import io
from fastapi import status
from app.models.user import User
from app.core.security import get_password_hash


def test_security_headers_present(client):
    """Verify standard OWASP security headers are present in HTTP responses."""
    response = client.get("/health")
    assert response.status_code == status.HTTP_200_OK
    assert response.headers.get("X-Content-Type-Options") == "nosniff"
    assert response.headers.get("X-Frame-Options") == "DENY"
    assert response.headers.get("Referrer-Policy") == "strict-origin-when-cross-origin"


def test_logout_revokes_jwt_token(client, auth_headers):
    """Verify that calling /logout revokes the JWT access token."""
    # First, verify the token works
    res_before = client.get("/api/v1/users/me", headers=auth_headers)
    assert res_before.status_code == status.HTTP_200_OK

    # Call logout
    res_logout = client.post("/api/v1/auth/logout", headers=auth_headers)
    assert res_logout.status_code == status.HTTP_200_OK

    # Token must now be rejected
    res_after = client.get("/api/v1/users/me", headers=auth_headers)
    assert res_after.status_code == status.HTTP_401_UNAUTHORIZED


def test_user_update_duplicate_email(client, db, auth_headers, test_user):
    """Verify that updating email to an existing user's email is rejected with 400."""
    # Create another user
    other = User(
        email="existing@example.com",
        username="existinguser",
        hashed_password=get_password_hash("password123"),
        is_active=True,
    )
    db.add(other)
    db.commit()

    response = client.put(
        "/api/v1/users/me",
        headers=auth_headers,
        json={"email": "existing@example.com"},
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "already exists" in response.json()["detail"]


def test_user_update_password_requires_current_password(client, auth_headers):
    """Verify that setting a new password requires the correct current password."""
    # Attempt without current_password
    res1 = client.put(
        "/api/v1/users/me",
        headers=auth_headers,
        json={"password": "brandnewpassword123"},
    )
    assert res1.status_code == status.HTTP_400_BAD_REQUEST
    assert "Current password is required" in res1.json()["detail"]

    # Attempt with incorrect current_password
    res2 = client.put(
        "/api/v1/users/me",
        headers=auth_headers,
        json={
            "password": "brandnewpassword123",
            "current_password": "wrongpassword",
        },
    )
    assert res2.status_code == status.HTTP_400_BAD_REQUEST
    assert "Incorrect current password" in res2.json()["detail"]

    # Attempt with correct current_password
    res3 = client.put(
        "/api/v1/users/me",
        headers=auth_headers,
        json={
            "password": "brandnewpassword123",
            "current_password": "password123",
        },
    )
    assert res3.status_code == status.HTTP_200_OK


def test_upload_image_invalid_magic_bytes(client, auth_headers):
    """Verify that uploading non-image content disguised as image is rejected."""
    fake_file = io.BytesIO(b"Hello world, this is just a plain text file pretending to be image.")
    response = client.post(
        "/api/v1/nutrition/upload-image",
        headers=auth_headers,
        files={"file": ("malicious.jpg", fake_file, "image/jpeg")},
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "Invalid image signature" in response.json()["detail"]


def test_upload_image_valid_jpeg(client, auth_headers):
    """Verify that uploading a valid JPEG header succeeds."""
    # Standard minimal JPEG header: \xff\xd8\xff\xe0...
    valid_jpeg = b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00" + b"\x00" * 100
    response = client.post(
        "/api/v1/nutrition/upload-image",
        headers=auth_headers,
        files={"file": ("photo.jpg", io.BytesIO(valid_jpeg), "image/jpeg")},
    )
    assert response.status_code == status.HTTP_200_OK
    assert "image_url" in response.json()
    assert response.json()["image_url"].startswith("/uploads/meals/")
