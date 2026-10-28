from fastapi import status


def test_list_exercises(client):
    response = client.get("/api/v1/exercises/")
    assert response.status_code == status.HTTP_200_OK
    exercises = response.json()
    assert len(exercises) >= 5
    assert any(e["name"] == "Barbell Bench Press" for e in exercises)


def test_filter_exercises_by_muscle(client):
    response = client.get("/api/v1/exercises/?muscle_group=Chest")
    assert response.status_code == status.HTTP_200_OK
    exercises = response.json()
    assert len(exercises) > 0
    assert all(e["muscle_group"] == "Chest" for e in exercises)


def test_create_and_delete_custom_exercise(client, auth_headers):
    # Create custom exercise
    create_res = client.post(
        "/api/v1/exercises/",
        headers=auth_headers,
        json={
            "name": "Bulgarian Split Squat",
            "muscle_group": "Legs",
            "equipment": "Dumbbell",
            "category": "Hypertrophy",
            "description": "Unilateral leg exercise focusing on quads and glutes.",
        },
    )
    assert create_res.status_code == status.HTTP_201_CREATED
    exercise_data = create_res.json()
    assert exercise_data["is_custom"] is True
    ex_id = exercise_data["id"]

    # Delete custom exercise
    del_res = client.delete(f"/api/v1/exercises/{ex_id}", headers=auth_headers)
    assert del_res.status_code == status.HTTP_200_OK

    # Verify not found
    get_res = client.get(f"/api/v1/exercises/{ex_id}", headers=auth_headers)
    assert get_res.status_code == status.HTTP_404_NOT_FOUND
