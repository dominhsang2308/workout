from fastapi import status


def test_create_and_get_workout_plan(client, auth_headers):
    # First get an exercise ID
    ex_res = client.get("/api/v1/exercises/")
    exercises = ex_res.json()
    first_ex_id = exercises[0]["id"]
    second_ex_id = exercises[1]["id"]

    # Create plan
    plan_payload = {
        "name": "Upper Body Blast",
        "description": "Intense upper body workout routine",
        "difficulty": "Advanced",
        "estimated_duration_min": 60,
        "items": [
            {
                "exercise_id": first_ex_id,
                "order_index": 1,
                "target_sets": 4,
                "target_reps": 8,
                "target_rpe": 8.5,
                "rest_seconds": 120,
            },
            {
                "exercise_id": second_ex_id,
                "order_index": 2,
                "target_sets": 3,
                "target_reps": 12,
                "target_rpe": 7.5,
                "rest_seconds": 90,
            },
        ],
    }
    create_res = client.post("/api/v1/plans/", headers=auth_headers, json=plan_payload)
    assert create_res.status_code == status.HTTP_201_CREATED
    plan_data = create_res.json()
    plan_id = plan_data["id"]
    assert plan_data["name"] == "Upper Body Blast"
    assert len(plan_data["items"]) == 2

    # Get plans list
    list_res = client.get("/api/v1/plans/", headers=auth_headers)
    assert list_res.status_code == status.HTTP_200_OK
    assert any(p["id"] == plan_id for p in list_res.json())

    # Get plan by ID
    get_res = client.get(f"/api/v1/plans/{plan_id}", headers=auth_headers)
    assert get_res.status_code == status.HTTP_200_OK
    assert get_res.json()["id"] == plan_id

    # Delete plan
    del_res = client.delete(f"/api/v1/plans/{plan_id}", headers=auth_headers)
    assert del_res.status_code == status.HTTP_200_OK
