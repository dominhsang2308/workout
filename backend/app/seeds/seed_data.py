from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session

from app.models.exercise import Exercise
from app.models.user import User
from app.models.workout_plan import WorkoutPlan, WorkoutPlanItem
from app.models.workout_session import WorkoutSession, WorkoutSetLog
from app.core.security import get_password_hash

INITIAL_EXERCISES = [
    # Chest
    {
        "name": "Barbell Bench Press",
        "muscle_group": "Chest",
        "equipment": "Barbell",
        "category": "Strength",
        "description": "Standard flat barbell bench press for chest, anterior delts, and triceps.",
        "instructions": "Lie flat on the bench, grip barbell slightly wider than shoulder-width, lower bar to mid-chest, press upward locking elbows smoothly.",
    },
    {
        "name": "Incline Dumbbell Press",
        "muscle_group": "Chest",
        "equipment": "Dumbbell",
        "category": "Hypertrophy",
        "description": "Incline press focusing on the clavicular head of the pectoralis major.",
        "instructions": "Set bench to 30-45 degrees, press dumbbells upward converging slightly at the top.",
    },
    {
        "name": "Cable Chest Fly",
        "muscle_group": "Chest",
        "equipment": "Cable",
        "category": "Hypertrophy",
        "description": "Constant tension chest fly movement.",
        "instructions": "Set pulleys to shoulder height, bring handles together with a slight bend in elbows, squeeze chest at peak contraction.",
    },
    # Back
    {
        "name": "Barbell Deadlift",
        "muscle_group": "Back",
        "equipment": "Barbell",
        "category": "Strength",
        "description": "Foundational compound lift targeting posterior chain, lower back, traps, and glutes.",
        "instructions": "Feet hip-width apart, grip bar outside legs, engage lats, drive feet into the floor keeping back neutral.",
    },
    {
        "name": "Pull-Up",
        "muscle_group": "Back",
        "equipment": "Bodyweight",
        "category": "Strength",
        "description": "Vertical pulling movement targeting latissimus dorsi and biceps.",
        "instructions": "Hang from bar with overhand grip, pull chest towards bar leading with elbows, lower under control.",
    },
    {
        "name": "Bent-Over Barbell Row",
        "muscle_group": "Back",
        "equipment": "Barbell",
        "category": "Strength",
        "description": "Horizontal pull for upper back thickness and rhomboids.",
        "instructions": "Hinge hips at 45 degrees, pull barbell towards belly button, squeeze shoulder blades together.",
    },
    {
        "name": "Lat Pulldown",
        "muscle_group": "Back",
        "equipment": "Cable",
        "category": "Hypertrophy",
        "description": "Cable vertical pull targeting lats with adjustable resistance.",
        "instructions": "Sit upright, pull bar down towards upper chest, control the eccentric return.",
    },
    # Legs
    {
        "name": "Barbell Back Squat",
        "muscle_group": "Legs",
        "equipment": "Barbell",
        "category": "Strength",
        "description": "King of lower body compound lifts targeting quadriceps, glutes, and core.",
        "instructions": "Rest barbell on upper traps, descend until thighs are parallel to floor, drive up through midfoot.",
    },
    {
        "name": "Romanian Deadlift (RDL)",
        "muscle_group": "Legs",
        "equipment": "Barbell",
        "category": "Hypertrophy",
        "description": "Hip-hinge movement emphasizing hamstrings and glutes.",
        "instructions": "Slight knee bend, push hips backward while lowering weight along shins until hamstrings stretch, return forward.",
    },
    {
        "name": "Leg Press",
        "muscle_group": "Legs",
        "equipment": "Machine",
        "category": "Hypertrophy",
        "description": "Machine leg press allowing heavy quad loading with back support.",
        "instructions": "Place feet shoulder-width on platform, lower sled smoothly to 90 degrees knee flexion, press back without locking knees.",
    },
    {
        "name": "Standing Calf Raise",
        "muscle_group": "Legs",
        "equipment": "Machine",
        "category": "Hypertrophy",
        "description": "Isolates the gastrocnemius muscle.",
        "instructions": "Balls of feet on step edge, lower heels for deep stretch, press up onto toes and pause.",
    },
    # Shoulders
    {
        "name": "Overhead Barbell Press",
        "muscle_group": "Shoulders",
        "equipment": "Barbell",
        "category": "Strength",
        "description": "Strict overhead press targeting deltoids and triceps.",
        "instructions": "Stand tall with bar at collarbone, brace core, press vertically overhead until arms lock out.",
    },
    {
        "name": "Dumbbell Lateral Raise",
        "muscle_group": "Shoulders",
        "equipment": "Dumbbell",
        "category": "Hypertrophy",
        "description": "Isolates the lateral deltoid head for shoulder width.",
        "instructions": "Raise dumbbells out to sides leading with elbows until parallel with ground, lower slowly.",
    },
    {
        "name": "Face Pull",
        "muscle_group": "Shoulders",
        "equipment": "Cable",
        "category": "Hypertrophy",
        "description": "Rear deltoid and rotator cuff builder, essential for posture and shoulder health.",
        "instructions": "Rope attachment at eye level, pull toward forehead while externally rotating shoulders.",
    },
    # Arms
    {
        "name": "Barbell Bicep Curl",
        "muscle_group": "Arms",
        "equipment": "Barbell",
        "category": "Hypertrophy",
        "description": "Classic bicep mass builder.",
        "instructions": "Hold barbell with supinated grip, keep elbows pinned by sides, curl up to chest level, squeeze peak.",
    },
    {
        "name": "Tricep Rope Pushdown",
        "muscle_group": "Arms",
        "equipment": "Cable",
        "category": "Hypertrophy",
        "description": "Isolates triceps lateral and medial heads.",
        "instructions": "Upper arms pinned to sides, push rope down and spread handles at bottom.",
    },
    {
        "name": "Hammer Dumbbell Curl",
        "muscle_group": "Arms",
        "equipment": "Dumbbell",
        "category": "Hypertrophy",
        "description": "Neutral-grip curl targeting brachialis and forearm flexors.",
        "instructions": "Palms facing each other throughout the curl, controlled tempo.",
    },
    # Core
    {
        "name": "Hanging Leg Raise",
        "muscle_group": "Core",
        "equipment": "Bodyweight",
        "category": "Strength",
        "description": "Dynamic core exercise engaging lower abs and hip flexors.",
        "instructions": "Hang from pull-up bar, raise legs up to horizontal without swinging, lower slowly.",
    },
    {
        "name": "Plank",
        "muscle_group": "Core",
        "equipment": "Bodyweight",
        "category": "Endurance",
        "description": "Isometric core stability exercise.",
        "instructions": "Forearms on floor, maintain straight line from head to heels, brace abdomen firmly.",
    },
    # Home & Female Sculpting
    {
        "name": "Glute Bridge",
        "muscle_group": "Glutes",
        "equipment": "Bodyweight",
        "category": "Toning",
        "description": "Classic floor glute activation exercise for rounder glutes.",
        "instructions": "Lie on your back with knees bent, feet flat. Drive through heels to raise hips, squeeze glutes at the top.",
    },
    {
        "name": "Donkey Kicks",
        "muscle_group": "Glutes",
        "equipment": "Bodyweight",
        "category": "Toning",
        "description": "Great for isolating the gluteus maximus at home without weights.",
        "instructions": "On all fours on a yoga mat, kick one heel up towards the ceiling while keeping the knee at 90 degrees. Squeeze glute at the peak.",
    },
    {
        "name": "Fire Hydrant",
        "muscle_group": "Glutes",
        "equipment": "Bodyweight",
        "category": "Toning",
        "description": "Targets the gluteus medius and outer hips to build hourglass hips.",
        "instructions": "On hands and knees, lift one leg out to the side like a dog at a fire hydrant. Keep torso steady.",
    },
    {
        "name": "Bodyweight Air Squat",
        "muscle_group": "Legs",
        "equipment": "Bodyweight",
        "category": "Toning",
        "description": "Foundational lower body bodyweight exercise for thighs and glutes.",
        "instructions": "Feet shoulder-width apart, sit back and down into a deep squat, keeping chest proud and knees out.",
    },
    {
        "name": "Walking Lunges",
        "muscle_group": "Legs",
        "equipment": "Bodyweight",
        "category": "Toning",
        "description": "Dynamic unilateral leg exercise sculpting quads, hamstrings, and glutes.",
        "instructions": "Step forward into a lunge until both knees reach 90 degrees, push through front heel to step into next lunge.",
    },
    {
        "name": "Knee Push-Up",
        "muscle_group": "Chest",
        "equipment": "Bodyweight",
        "category": "Toning",
        "description": "Gentle upper-body toning push-up variation ideal for home fitness.",
        "instructions": "Place hands slightly wider than shoulders, knees on mat, lower chest towards the floor with controlled elbows, press back up.",
    },
    {
        "name": "Bicycle Crunch",
        "muscle_group": "Core",
        "equipment": "Bodyweight",
        "category": "Toning",
        "description": "Top-rated ab exercise targeting both rectus abdominis and obliques for a snatched waist.",
        "instructions": "Lie on back, bring opposite elbow to opposite knee in a pedaling bicycle motion, engaging core continuously.",
    },
    {
        "name": "Banded Clamshells",
        "muscle_group": "Glutes",
        "equipment": "Resistance Band",
        "category": "Toning",
        "description": "Top isolated glute medius exercise with mini-band for rounder hips at home.",
        "instructions": "Lie on side on yoga mat with knees bent and loop band above knees. Keeping feet glued together, open top knee like a clam shell, squeeze outer glute.",
    },
    {
        "name": "Banded Lateral Walk",
        "muscle_group": "Glutes",
        "equipment": "Resistance Band",
        "category": "Toning",
        "description": "Dynamic resistance band monster walk activating entire outer hip and upper glutes.",
        "instructions": "Place resistance band around ankles or above knees, take a quarter squat stance, take slow controlled steps sideways maintaining band tension.",
    },
    {
        "name": "Bird Dog",
        "muscle_group": "Core",
        "equipment": "Yoga Mat",
        "category": "Flexibility",
        "description": "Essential physical therapy & pilates core movement stabilizing spine and trimming waistline without weights.",
        "instructions": "From tabletop position on mat, simultaneously reach right arm forward and left leg backward until parallel to floor. Hold 2 seconds, alternate sides.",
    },
    {
        "name": "Mountain Climbers",
        "muscle_group": "Core",
        "equipment": "Bodyweight",
        "category": "HIIT",
        "description": "Dynamic bodyweight floor cardio engaging lower abs and calorie burning at home.",
        "instructions": "Start in high plank on mat, drive knees alternatively toward chest in a smooth running motion while keeping hips low.",
    },
]


def seed_initial_data(db: Session) -> None:
    """Seed standard exercises and optional demo account if database is empty."""
    # 1. Seed standard exercises if none exist
    exercise_count = db.query(Exercise).count()
    if exercise_count == 0:
        for ex_data in INITIAL_EXERCISES:
            exercise = Exercise(
                name=ex_data["name"],
                muscle_group=ex_data["muscle_group"],
                equipment=ex_data["equipment"],
                category=ex_data["category"],
                description=ex_data["description"],
                instructions=ex_data["instructions"],
                is_custom=False,
                user_id=None,
            )
            db.add(exercise)
        db.commit()

    # 2. Seed a demo user if not already present
    demo_user = db.query(User).filter(User.email == "demo@workout.com").first()
    if not demo_user:
        demo_user = User(
            email="demo@workout.com",
            username="demouser",
            full_name="Alex Athlete",
            hashed_password=get_password_hash("password123"),
            is_active=True,
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)

        # Retrieve seeded exercises for demo plans
        exercises_map = {e.name: e.id for e in db.query(Exercise).all()}

        # 3. Create Sample Workout Plan: Push Day
        push_plan = WorkoutPlan(
            user_id=demo_user.id,
            name="Push Power & Hypertrophy",
            description="Chest, Shoulders & Triceps strength and hypertrophy session.",
            difficulty="Intermediate",
            estimated_duration_min=50,
        )
        db.add(push_plan)
        db.flush()

        push_items = [
            ("Barbell Bench Press", 4, 8, 8.5, 120),
            ("Incline Dumbbell Press", 3, 10, 8.0, 90),
            ("Overhead Barbell Press", 3, 8, 8.0, 90),
            ("Dumbbell Lateral Raise", 4, 12, 7.5, 60),
            ("Tricep Rope Pushdown", 3, 12, 8.0, 60),
        ]
        for idx, (ex_name, sets, reps, rpe, rest) in enumerate(push_items, start=1):
            if ex_name in exercises_map:
                db.add(
                    WorkoutPlanItem(
                        plan_id=push_plan.id,
                        exercise_id=exercises_map[ex_name],
                        order_index=idx,
                        target_sets=sets,
                        target_reps=reps,
                        target_rpe=rpe,
                        rest_seconds=rest,
                    )
                )

        # Sample Workout Plan: Pull Day
        pull_plan = WorkoutPlan(
            user_id=demo_user.id,
            name="Pull Strength & Lats",
            description="Heavy Deadlifts, Rows and arm isolation.",
            difficulty="Intermediate",
            estimated_duration_min=55,
        )
        db.add(pull_plan)
        db.flush()

        pull_items = [
            ("Barbell Deadlift", 4, 5, 8.5, 180),
            ("Pull-Up", 3, 8, 8.0, 90),
            ("Bent-Over Barbell Row", 3, 10, 8.0, 90),
            ("Barbell Bicep Curl", 3, 10, 8.0, 60),
            ("Face Pull", 3, 15, 7.0, 60),
        ]
        for idx, (ex_name, sets, reps, rpe, rest) in enumerate(pull_items, start=1):
            if ex_name in exercises_map:
                db.add(
                    WorkoutPlanItem(
                        plan_id=pull_plan.id,
                        exercise_id=exercises_map[ex_name],
                        order_index=idx,
                        target_sets=sets,
                        target_reps=reps,
                        target_rpe=rpe,
                        rest_seconds=rest,
                    )
                )

        # 4. Create historical logged workout sessions for the demo user
        now = datetime.now(timezone.utc)
        demo_sessions_data = [
            # 2 days ago: Push
            {
                "days_ago": 2,
                "title": "Push Day Hypertrophy",
                "plan_id": push_plan.id,
                "duration_min": 52,
                "notes": "Felt great, hit clean PR on bench press.",
                "sets": [
                    ("Barbell Bench Press", [(80, 8), (85, 8), (85, 7), (80, 8)]),
                    ("Incline Dumbbell Press", [(26, 10), (28, 10), (28, 9)]),
                    ("Dumbbell Lateral Raise", [(10, 12), (10, 12), (12, 10)]),
                    ("Tricep Rope Pushdown", [(25, 12), (25, 12), (30, 10)]),
                ],
            },
            # 4 days ago: Pull
            {
                "days_ago": 4,
                "title": "Pull Day Back & Biceps",
                "plan_id": pull_plan.id,
                "duration_min": 58,
                "notes": "Solid deadlift session, lats were fully pumped.",
                "sets": [
                    ("Barbell Deadlift", [(120, 5), (130, 5), (135, 5), (140, 3)]),
                    ("Pull-Up", [(0, 8), (0, 8), (0, 7)]),
                    ("Bent-Over Barbell Row", [(60, 10), (65, 10), (70, 8)]),
                    ("Barbell Bicep Curl", [(30, 10), (32.5, 10), (35, 8)]),
                ],
            },
            # 7 days ago: Legs
            {
                "days_ago": 7,
                "title": "Leg Day Quad Focus",
                "plan_id": None,
                "duration_min": 60,
                "notes": "Squat depth felt super clean.",
                "sets": [
                    ("Barbell Back Squat", [(90, 8), (100, 8), (105, 6), (105, 6)]),
                    ("Romanian Deadlift (RDL)", [(80, 10), (85, 10), (90, 8)]),
                    ("Leg Press", [(160, 12), (180, 10), (200, 10)]),
                    ("Standing Calf Raise", [(40, 15), (45, 15), (50, 12)]),
                ],
            },
        ]

        for s_data in demo_sessions_data:
            s_time = now - timedelta(days=s_data["days_ago"])
            sess = WorkoutSession(
                user_id=demo_user.id,
                plan_id=s_data["plan_id"],
                title=s_data["title"],
                started_at=s_time,
                completed_at=s_time + timedelta(minutes=s_data["duration_min"]),
                duration_seconds=s_data["duration_min"] * 60,
                total_volume_kg=0.0,
                notes=s_data["notes"],
            )
            db.add(sess)
            db.flush()

            sess_vol = 0.0
            for ex_name, set_list in s_data["sets"]:
                if ex_name in exercises_map:
                    for set_num, (wt, reps) in enumerate(set_list, start=1):
                        db.add(
                            WorkoutSetLog(
                                session_id=sess.id,
                                exercise_id=exercises_map[ex_name],
                                set_number=set_num,
                                weight_kg=wt,
                                reps=reps,
                                is_completed=True,
                            )
                        )
                        sess_vol += wt * reps

            sess.total_volume_kg = round(sess_vol, 2)

        db.commit()
