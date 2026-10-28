from datetime import datetime, timezone
from fastapi import status


def test_create_and_log_session(client, auth_headers):
    # Get an exercise
    ex_res = client.get("/api/v1/exercises/")
    ex_id = ex_res.json()[0]["id"]

    now_iso = datetime.now(timezone.utc).isoformat()

    session_payload = {
        "title": "Evening Bench Test",
        "plan_id": None,
        "started_at": now_iso,
        "completed_at": now_iso,
        "duration_seconds": 3600,
        "notes": "Testing set logging",
        "sets": [
            {"exercise_id": ex_id, "set_number": 1, "weight_kg": 60.0, "reps": 10, "is_completed": True},
            {"exercise_id": ex_id, "set_number": 2, "weight_kg": 70.0, "reps": 8, "is_completed": True},
            {"exercise_id": ex_id, "set_number": 3, "weight_kg": 80.0, "reps": 6, "is_completed": True},
        ],
    }

    create_res = client.post("/api/v1/sessions/", headers=auth_headers, json=session_payload)
    assert create_res.status_code == status.HTTP_201_CREATED
    data = create_res.json()
    assert data["title"] == "Evening Bench Test"
    assert len(data["sets"]) == 3
    # Volume calculation: (60*10) + (70*8) + (80*6) = 600 + 560 + 480 = 1640.0
    assert data["total_volume_kg"] == 1640.0

    session_id = data["id"]

    # Verify session detail
    get_res = client.get(f"/api/v1/sessions/{session_id}", headers=auth_headers)
    assert get_res.status_code == status.HTTP_200_OK
    assert get_res.json()["total_volume_kg"] == 1640.0

    # Verify stats dashboard endpoint
    stats_res = client.get("/api/v1/stats/dashboard", headers=auth_headers)
    assert stats_res.status_code == status.HTTP_200_OK
    stats_data = stats_res.json()
    assert stats_data["total_workouts"] >= 1
    assert stats_data["total_volume_kg"] >= 1640.0
    assert "weekly_progress" in stats_data
    assert "muscle_group_distribution" in stats_data
