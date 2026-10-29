from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session

from app.models.exercise import Exercise
from app.models.user import User
from app.models.workout_plan import WorkoutPlan, WorkoutPlanItem
from app.models.workout_session import WorkoutSession, WorkoutSetLog
from app.core.security import get_password_hash

INITIAL_EXERCISES = [
    {
        "name": 'Barbell Bench Press',
        "muscle_group": 'Chest',
        "equipment": 'Barbell',
        "category": 'Strength',
        "difficulty": 'Intermediate',
        "description": 'Standard flat barbell bench press for chest, anterior delts, and triceps.',
        "instructions": 'Lie flat on the bench, grip barbell slightly wider than shoulder-width, lower bar to mid-chest, press upward locking elbows smoothly.',
    },
    {
        "name": 'Incline Dumbbell Press',
        "muscle_group": 'Chest',
        "equipment": 'Dumbbell',
        "category": 'Hypertrophy',
        "difficulty": 'Intermediate',
        "description": 'Incline press focusing on the clavicular head of the pectoralis major.',
        "instructions": 'Set bench to 30-45 degrees, press dumbbells upward converging slightly at the top.',
    },
    {
        "name": 'Cable Chest Fly',
        "muscle_group": 'Chest',
        "equipment": 'Cable',
        "category": 'Hypertrophy',
        "difficulty": 'Beginner',
        "description": 'Constant tension chest fly movement.',
        "instructions": 'Set pulleys to shoulder height, bring handles together with a slight bend in elbows, squeeze chest at peak contraction.',
    },
    {
        "name": 'Barbell Deadlift',
        "muscle_group": 'Back',
        "equipment": 'Barbell',
        "category": 'Strength',
        "difficulty": 'Experienced',
        "description": 'Foundational compound lift targeting posterior chain, lower back, traps, and glutes.',
        "instructions": 'Feet hip-width apart, grip bar outside legs, engage lats, drive feet into the floor keeping back neutral.',
    },
    {
        "name": 'Pull-Up',
        "muscle_group": 'Back',
        "equipment": 'Bodyweight',
        "category": 'Strength',
        "difficulty": 'Experienced',
        "description": 'Vertical pulling movement targeting latissimus dorsi and biceps.',
        "instructions": 'Hang from bar with overhand grip, pull chest towards bar leading with elbows, lower under control.',
    },
    {
        "name": 'Bent-Over Barbell Row',
        "muscle_group": 'Back',
        "equipment": 'Barbell',
        "category": 'Strength',
        "difficulty": 'Intermediate',
        "description": 'Horizontal pull for upper back thickness and rhomboids.',
        "instructions": 'Hinge hips at 45 degrees, pull barbell towards belly button, squeeze shoulder blades together.',
    },
    {
        "name": 'Lat Pulldown',
        "muscle_group": 'Back',
        "equipment": 'Cable',
        "category": 'Hypertrophy',
        "difficulty": 'Beginner',
        "description": 'Cable vertical pull targeting lats with adjustable resistance.',
        "instructions": 'Sit upright, pull bar down towards upper chest, control the eccentric return.',
    },
    {
        "name": 'Barbell Back Squat',
        "muscle_group": 'Legs',
        "equipment": 'Barbell',
        "category": 'Strength',
        "difficulty": 'Experienced',
        "description": 'King of lower body compound lifts targeting quadriceps, glutes, and core.',
        "instructions": 'Rest barbell on upper traps, descend until thighs are parallel to floor, drive up through midfoot.',
    },
    {
        "name": 'Romanian Deadlift (RDL)',
        "muscle_group": 'Legs',
        "equipment": 'Barbell',
        "category": 'Hypertrophy',
        "difficulty": 'Intermediate',
        "description": 'Hip-hinge movement emphasizing hamstrings and glutes.',
        "instructions": 'Slight knee bend, push hips backward while lowering weight along shins until hamstrings stretch, return forward.',
    },
    {
        "name": 'Leg Press',
        "muscle_group": 'Legs',
        "equipment": 'Machine',
        "category": 'Hypertrophy',
        "difficulty": 'Beginner',
        "description": 'Machine leg press allowing heavy quad loading with back support.',
        "instructions": 'Place feet shoulder-width on platform, lower sled smoothly to 90 degrees knee flexion, press back without locking knees.',
    },
    {
        "name": 'Standing Calf Raise',
        "muscle_group": 'Legs',
        "equipment": 'Machine',
        "category": 'Hypertrophy',
        "difficulty": 'Beginner',
        "description": 'Isolates the gastrocnemius muscle.',
        "instructions": 'Balls of feet on step edge, lower heels for deep stretch, press up onto toes and pause.',
    },
    {
        "name": 'Overhead Barbell Press',
        "muscle_group": 'Shoulders',
        "equipment": 'Barbell',
        "category": 'Strength',
        "difficulty": 'Experienced',
        "description": 'Strict overhead press targeting deltoids and triceps.',
        "instructions": 'Stand tall with bar at collarbone, brace core, press vertically overhead until arms lock out.',
    },
    {
        "name": 'Dumbbell Lateral Raise',
        "muscle_group": 'Shoulders',
        "equipment": 'Dumbbell',
        "category": 'Hypertrophy',
        "difficulty": 'Beginner',
        "description": 'Isolates the lateral deltoid head for shoulder width.',
        "instructions": 'Raise dumbbells out to sides leading with elbows until parallel with ground, lower slowly.',
    },
    {
        "name": 'Face Pull',
        "muscle_group": 'Shoulders',
        "equipment": 'Cable',
        "category": 'Hypertrophy',
        "difficulty": 'Beginner',
        "description": 'Rear deltoid and rotator cuff builder, essential for posture and shoulder health.',
        "instructions": 'Rope attachment at eye level, pull toward forehead while externally rotating shoulders.',
    },
    {
        "name": 'Barbell Bicep Curl',
        "muscle_group": 'Arms',
        "equipment": 'Barbell',
        "category": 'Hypertrophy',
        "difficulty": 'Beginner',
        "description": 'Classic bicep mass builder.',
        "instructions": 'Hold barbell with supinated grip, keep elbows pinned by sides, curl up to chest level, squeeze peak.',
    },
    {
        "name": 'Tricep Rope Pushdown',
        "muscle_group": 'Arms',
        "equipment": 'Cable',
        "category": 'Hypertrophy',
        "difficulty": 'Beginner',
        "description": 'Isolates triceps lateral and medial heads.',
        "instructions": 'Upper arms pinned to sides, push rope down and spread handles at bottom.',
    },
    {
        "name": 'Hammer Dumbbell Curl',
        "muscle_group": 'Arms',
        "equipment": 'Dumbbell',
        "category": 'Hypertrophy',
        "difficulty": 'Beginner',
        "description": 'Neutral-grip curl targeting brachialis and forearm flexors.',
        "instructions": 'Palms facing each other throughout the curl, controlled tempo.',
    },
    {
        "name": 'Hanging Leg Raise',
        "muscle_group": 'Core',
        "equipment": 'Bodyweight',
        "category": 'Strength',
        "difficulty": 'Experienced',
        "description": 'Dynamic core exercise engaging lower abs and hip flexors.',
        "instructions": 'Hang from pull-up bar, raise legs up to horizontal without swinging, lower slowly.',
    },
    {
        "name": 'Plank',
        "muscle_group": 'Core',
        "equipment": 'Bodyweight',
        "category": 'Endurance',
        "difficulty": 'Beginner',
        "description": 'Isometric core stability exercise.',
        "instructions": 'Forearms on floor, maintain straight line from head to heels, brace abdomen firmly.',
    },
    {
        "name": 'Glute Bridge',
        "muscle_group": 'Glutes',
        "equipment": 'Bodyweight',
        "category": 'Toning',
        "difficulty": 'Beginner',
        "description": 'Classic floor glute activation exercise for rounder glutes.',
        "instructions": 'Lie on your back with knees bent, feet flat. Drive through heels to raise hips, squeeze glutes at the top.',
    },
    {
        "name": 'Donkey Kicks',
        "muscle_group": 'Glutes',
        "equipment": 'Bodyweight',
        "category": 'Toning',
        "difficulty": 'Beginner',
        "description": 'Great for isolating the gluteus maximus at home without weights.',
        "instructions": 'On all fours on a yoga mat, kick one heel up towards the ceiling while keeping the knee at 90 degrees. Squeeze glute at the peak.',
    },
    {
        "name": 'Fire Hydrant',
        "muscle_group": 'Glutes',
        "equipment": 'Bodyweight',
        "category": 'Toning',
        "difficulty": 'Beginner',
        "description": 'Targets the gluteus medius and outer hips to build hourglass hips.',
        "instructions": 'On hands and knees, lift one leg out to the side like a dog at a fire hydrant. Keep torso steady.',
    },
    {
        "name": 'Bodyweight Air Squat',
        "muscle_group": 'Legs',
        "equipment": 'Bodyweight',
        "category": 'Toning',
        "difficulty": 'Beginner',
        "description": 'Foundational lower body bodyweight exercise for thighs and glutes.',
        "instructions": 'Feet shoulder-width apart, sit back and down into a deep squat, keeping chest proud and knees out.',
    },
    {
        "name": 'Walking Lunges',
        "muscle_group": 'Legs',
        "equipment": 'Bodyweight',
        "category": 'Toning',
        "difficulty": 'Intermediate',
        "description": 'Dynamic unilateral leg exercise sculpting quads, hamstrings, and glutes.',
        "instructions": 'Step forward into a lunge until both knees reach 90 degrees, push through front heel to step into next lunge.',
    },
    {
        "name": 'Knee Push-Up',
        "muscle_group": 'Chest',
        "equipment": 'Bodyweight',
        "category": 'Toning',
        "difficulty": 'Beginner',
        "description": 'Gentle upper-body toning push-up variation ideal for home fitness.',
        "instructions": 'Place hands slightly wider than shoulders, knees on mat, lower chest towards the floor with controlled elbows, press back up.',
    },
    {
        "name": 'Bicycle Crunch',
        "muscle_group": 'Core',
        "equipment": 'Bodyweight',
        "category": 'Toning',
        "difficulty": 'Intermediate',
        "description": 'Top-rated ab exercise targeting both rectus abdominis and obliques for a snatched waist.',
        "instructions": 'Lie on back, bring opposite elbow to opposite knee in a pedaling bicycle motion, engaging core continuously.',
    },
    {
        "name": 'Banded Clamshells',
        "muscle_group": 'Glutes',
        "equipment": 'Resistance Band',
        "category": 'Toning',
        "difficulty": 'Intermediate',
        "description": 'Top isolated glute medius exercise with mini-band for rounder hips at home.',
        "instructions": 'Lie on side on yoga mat with knees bent and loop band above knees. Keeping feet glued together, open top knee like a clam shell, squeeze outer glute.',
    },
    {
        "name": 'Banded Lateral Walk',
        "muscle_group": 'Glutes',
        "equipment": 'Resistance Band',
        "category": 'Toning',
        "difficulty": 'Intermediate',
        "description": 'Dynamic resistance band monster walk activating entire outer hip and upper glutes.',
        "instructions": 'Place resistance band around ankles or above knees, take a quarter squat stance, take slow controlled steps sideways maintaining band tension.',
    },
    {
        "name": 'Bird Dog',
        "muscle_group": 'Core',
        "equipment": 'Yoga Mat',
        "category": 'Flexibility',
        "difficulty": 'Beginner',
        "description": 'Essential physical therapy & pilates core movement stabilizing spine and trimming waistline without weights.',
        "instructions": 'From tabletop position on mat, simultaneously reach right arm forward and left leg backward until parallel to floor. Hold 2 seconds, alternate sides.',
    },
    {
        "name": 'Mountain Climbers',
        "muscle_group": 'Core',
        "equipment": 'Bodyweight',
        "category": 'HIIT',
        "difficulty": 'Intermediate',
        "description": 'Dynamic bodyweight floor cardio engaging lower abs and calorie burning at home.',
        "instructions": 'Start in high plank on mat, drive knees alternatively toward chest in a smooth running motion while keeping hips low.',
    },
    {
        "name": 'Cat-Cow Stretch',
        "muscle_group": 'Back',
        "equipment": 'Yoga Mat',
        "category": 'Flexibility',
        "difficulty": 'Beginner',
        "description": 'Gentle spinal mobility movement relieving back stiffness and engaging deep pelvic floor.',
        "instructions": 'From tabletop, inhale and drop belly towards mat looking up (Cow). Exhale and round spine pulling navel to spine (Cat). Repeat smoothly.',
    },
    {
        "name": 'Glute Bridge Hold',
        "muscle_group": 'Glutes',
        "equipment": 'Yoga Mat',
        "category": 'Toning',
        "difficulty": 'Beginner',
        "description": 'Isometric glute activation exercise building endurance and firming buttocks.',
        "instructions": 'Lie on back with knees bent, raise hips and squeeze glutes hard at top. Hold for 30-45 seconds without letting hips drop.',
    },
    {
        "name": 'Dead Bug',
        "muscle_group": 'Core',
        "equipment": 'Yoga Mat',
        "category": 'Flexibility',
        "difficulty": 'Beginner',
        "description": 'Foundational pilates core stability movement protecting the lower back while flattening lower tummy.',
        "instructions": 'Lie on back with arms pointing to ceiling and knees at 90 degrees. Lower opposite arm and leg slowly towards floor, return and switch.',
    },
    {
        "name": 'Standing Side Leg Raise',
        "muscle_group": 'Glutes',
        "equipment": 'Bodyweight',
        "category": 'Toning',
        "difficulty": 'Beginner',
        "description": 'Gentle standing outer thigh and hip sculpter with zero equipment required.',
        "instructions": 'Stand tall holding a wall or chair for balance, lift outer leg sideways to 45 degrees, squeeze outer glute, lower slowly.',
    },
    {
        "name": 'Side Plank',
        "muscle_group": 'Core',
        "equipment": 'Yoga Mat',
        "category": 'Endurance',
        "difficulty": 'Intermediate',
        "description": 'Static core exercise targeting obliques and transverse abdominis for a sculpted hourglass waist.',
        "instructions": 'Lie on side supported on forearm, stack feet, lift hips until body forms a straight line. Hold 30-40 seconds per side.',
    },
    {
        "name": 'Banded Glute Bridge',
        "muscle_group": 'Glutes',
        "equipment": 'Resistance Band',
        "category": 'Toning',
        "difficulty": 'Intermediate',
        "description": 'Double-impact glute builder combining hip extension with abductor resistance.',
        "instructions": 'Loop mini-band right above knees, lie on mat. Drive hips upward while pressing knees outward against band tension.',
    },
    {
        "name": 'Reverse Lunges',
        "muscle_group": 'Legs',
        "equipment": 'Bodyweight',
        "category": 'Toning',
        "difficulty": 'Intermediate',
        "description": 'Knee-friendly unilateral leg exercise creating firm glutes and slender hamstrings.',
        "instructions": 'Step backward into a lunge until both knees reach 90 degrees, drive through front heel to return to standing.',
    },
    {
        "name": 'Russian Twist',
        "muscle_group": 'Core',
        "equipment": 'Yoga Mat',
        "category": 'Toning',
        "difficulty": 'Intermediate',
        "description": 'Rotational oblique exercise defining the waistline and burning love handles.',
        "instructions": 'Sit on mat with knees bent, lean torso back 45 degrees, rotate hands from side to side tapping mat near hip.',
    },
    {
        "name": 'Banded Kickback',
        "muscle_group": 'Glutes',
        "equipment": 'Resistance Band',
        "category": 'Toning',
        "difficulty": 'Intermediate',
        "description": 'Direct gluteus maximus isolation creating a lifted, perkier backside.',
        "instructions": 'Loop band around ankles or above knees, kick one leg straight back and slightly out, squeeze upper glute hard at top.',
    },
    {
        "name": 'Jump Squats',
        "muscle_group": 'Legs',
        "equipment": 'Bodyweight',
        "category": 'HIIT',
        "difficulty": 'Experienced',
        "description": 'High-energy plyometric squat burning massive calories and toning lower body.',
        "instructions": 'Lower into a deep air squat, explosively jump straight up into air, land softly with knees bending into next repetition.',
    },
    {
        "name": 'Hollow Body Hold',
        "muscle_group": 'Core',
        "equipment": 'Yoga Mat',
        "category": 'Strength',
        "difficulty": 'Experienced',
        "description": 'Gold-standard gymnast core isometric hold creating incredible abdominal density and flat tummy.',
        "instructions": 'Lie on back, press lumbar spine flat against floor, hover arms overhead and legs 6 inches off ground forming banana shape.',
    },
    {
        "name": 'Pike Push-Up',
        "muscle_group": 'Shoulders',
        "equipment": 'Bodyweight',
        "category": 'Strength',
        "difficulty": 'Experienced',
        "description": 'Advanced bodyweight vertical push targeting anterior deltoids and triceps without weights.',
        "instructions": 'In downward dog position with hips high in inverted V, bend elbows lowering top of head towards mat, press back up.',
    },
    {
        "name": 'Goblet Squat',
        "muscle_group": 'Legs',
        "equipment": 'Dumbbell',
        "category": 'Strength',
        "difficulty": 'Beginner',
        "description": 'Ideal squat variation teaching upright posture and deep quad engagement with single dumbbell.',
        "instructions": 'Hold dumbbell vertically at chest under chin, squat deep keeping elbows inside knees and chest proud.',
    },
    {
        "name": 'Seated Cable Row',
        "muscle_group": 'Back',
        "equipment": 'Cable',
        "category": 'Hypertrophy',
        "difficulty": 'Beginner',
        "description": 'Safe and effective machine horizontal pull promoting upright posture and slender upper back.',
        "instructions": 'Sit tall with feet on pedals, pull V-bar handle toward navel while pinching shoulder blades together.',
    },
    {
        "name": 'Dumbbell Bicep Curl',
        "muscle_group": 'Arms',
        "equipment": 'Dumbbell',
        "category": 'Hypertrophy',
        "difficulty": 'Beginner',
        "description": 'Fundamental arm shaping movement for toned biceps with dumbbells.',
        "instructions": 'Hold dumbbells at sides with palms up, curl up smoothly without swinging elbows, lower under control.',
    },
    {
        "name": 'Lying Leg Curl',
        "muscle_group": 'Legs',
        "equipment": 'Machine',
        "category": 'Hypertrophy',
        "difficulty": 'Beginner',
        "description": 'Targeted hamstring isolation machine toning the back of the thighs.',
        "instructions": 'Lie face down on machine with pad behind ankles, curl heels toward buttocks, squeeze hamstrings, lower slowly.',
    },
    {
        "name": 'Bulgarian Split Squat',
        "muscle_group": 'Legs',
        "equipment": 'Dumbbell',
        "category": 'Hypertrophy',
        "difficulty": 'Intermediate',
        "description": 'The ultimate unilateral glute and quad builder in fitness centers.',
        "instructions": 'Rear foot elevated on bench, hold dumbbells at sides, drop hips straight down until front thigh is parallel to floor.',
    },
    {
        "name": 'Dumbbell Shoulder Press',
        "muscle_group": 'Shoulders',
        "equipment": 'Dumbbell',
        "category": 'Hypertrophy',
        "difficulty": 'Intermediate',
        "description": 'Overhead pressing exercise creating feminine rounded shoulders and arm definition.',
        "instructions": 'Sit on upright bench with dumbbells at ear level, press overhead converging slightly at top without locking elbows.',
    },
    {
        "name": 'Hip Thrust',
        "muscle_group": 'Glutes',
        "equipment": 'Barbell',
        "category": 'Hypertrophy',
        "difficulty": 'Intermediate',
        "description": 'The #1 scientifically-proven barbell exercise for maximal glute growth and lift.',
        "instructions": 'Back against bench at shoulder-blade line, barbell over hips with pad, drive heels to lift hips parallel to floor.',
    },
    {
        "name": 'Front Squat',
        "muscle_group": 'Legs',
        "equipment": 'Barbell',
        "category": 'Strength',
        "difficulty": 'Experienced',
        "description": 'Advanced quad and thoracic builder requiring deep mobility and core bracing.',
        "instructions": 'Rest barbell across front deltoids with clean grip or crossed arms, squat deep keeping elbows high and spine vertical.',
    },
    {
        "name": 'Banded Squats',
        "muscle_group": 'Legs',
        "equipment": 'Resistance Band',
        "category": 'Toning',
        "difficulty": 'Beginner',
        "description": 'Squat voi day khang luc quang qua dau goi giup kich hoat toan dien co dui va mong.',
        "instructions": '1. Long day khang luc tren dau goi.\n2. Ha hong squat sau, mo nhe hai dau goi chong lai luc day.\n3. Dung day siet nhe mong.',
    },
    {
        "name": 'Banded Pull-Apart',
        "muscle_group": 'Back',
        "equipment": 'Resistance Band',
        "category": 'Flexibility',
        "difficulty": 'Beginner',
        "description": 'Bai tap keo day khang luc giup mo rong long nguc, sua gu lung va san chac lung tren.',
        "instructions": '1. Cam day khang luc hai tay rong bang vai truoc nguc.\n2. Keo day sang hai ben ep chat hai xuong ba vai.\n3. Thu ve tu tu co kiem soat.',
    },
    {
        "name": 'Banded Bicep Curl',
        "muscle_group": 'Arms',
        "equipment": 'Resistance Band',
        "category": 'Toning',
        "difficulty": 'Beginner',
        "description": 'Cuon tay truoc voi day khang luc giup thon gon va san chac bap tay tai nha khong can ta.',
        "instructions": '1. Dung hai chan giam len giua day khang luc, hai tay cam hai dau day.\n2. Cuon tay keo day len huong vai, siet bap tay.\n3. Ha tay cham rai.',
    },
]

def seed_initial_data(db: Session) -> None:
    """Seed standard exercises and optional demo account if database is empty or missing exercises."""
    # 1. Seed or synchronize standard exercises (ensures missing exercises are added seamlessly)
    existing_names = {e[0].lower().strip() for e in db.query(Exercise.name).all()}
    added_any = False
    for ex_data in INITIAL_EXERCISES:
        if ex_data["name"].lower().strip() not in existing_names:
            exercise = Exercise(
                name=ex_data["name"],
                muscle_group=ex_data["muscle_group"],
                equipment=ex_data["equipment"],
                category=ex_data["category"],
                difficulty=ex_data.get("difficulty", "Beginner"),
                description=ex_data.get("description", ""),
                instructions=ex_data.get("instructions", ""),
                is_custom=False,
                user_id=None,
            )
            db.add(exercise)
            existing_names.add(ex_data["name"].lower().strip())
            added_any = True
    if added_any:
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

        # Sample Workout Plan: Leg & Glute Sculpt
        leg_plan = WorkoutPlan(
            user_id=demo_user.id,
            name="Lower Body & Glute Focus",
            description="Squats, RDLs and glute bridges for lower body strength and sculpting.",
            difficulty="Beginner",
            estimated_duration_min=45,
        )
        db.add(leg_plan)
        db.flush()

        leg_items = [
            ("Barbell Back Squat", 4, 8, 8.0, 120),
            ("Romanian Deadlift (RDL)", 3, 10, 8.0, 90),
            ("Glute Bridge", 3, 15, 7.5, 60),
            ("Leg Press", 3, 12, 8.0, 90),
            ("Standing Calf Raise", 3, 15, 7.0, 60),
        ]
        for idx, (ex_name, sets, reps, rpe, rest) in enumerate(leg_items, start=1):
            if ex_name in exercises_map:
                db.add(
                    WorkoutPlanItem(
                        plan_id=leg_plan.id,
                        exercise_id=exercises_map[ex_name],
                        order_index=idx,
                        target_sets=sets,
                        target_reps=reps,
                        target_rpe=rpe,
                        rest_seconds=rest,
                    )
                )

        # 4. Create Historical Completed Workout Sessions
        now = datetime.now(timezone.utc)
        history_data = [
            ("Push Power Session", now - timedelta(days=5), 48 * 60, 4820.0, push_plan.id, [
                ("Barbell Bench Press", [
                    (1, 10, 60.0, True),
                    (2, 8, 70.0, True),
                    (3, 8, 70.0, True),
                    (4, 6, 75.0, True),
                ]),
                ("Incline Dumbbell Press", [
                    (1, 10, 22.0, True),
                    (2, 10, 24.0, True),
                    (3, 8, 24.0, True),
                ]),
                ("Overhead Barbell Press", [
                    (1, 8, 40.0, True),
                    (2, 8, 42.5, True),
                    (3, 7, 42.5, True),
                ]),
                ("Dumbbell Lateral Raise", [
                    (1, 12, 10.0, True),
                    (2, 12, 10.0, True),
                    (3, 12, 10.0, True),
                ]),
                ("Tricep Rope Pushdown", [
                    (1, 12, 25.0, True),
                    (2, 12, 27.5, True),
                    (3, 10, 27.5, True),
                ]),
            ]),
            ("Pull & Lats Blast", now - timedelta(days=3), 52 * 60, 5640.0, pull_plan.id, [
                ("Barbell Deadlift", [
                    (1, 5, 100.0, True),
                    (2, 5, 120.0, True),
                    (3, 5, 130.0, True),
                    (4, 3, 140.0, True),
                ]),
                ("Pull-Up", [
                    (1, 8, 0.0, True),
                    (2, 8, 0.0, True),
                    (3, 6, 0.0, True),
                ]),
                ("Bent-Over Barbell Row", [
                    (1, 10, 60.0, True),
                    (2, 10, 65.0, True),
                    (3, 8, 70.0, True),
                ]),
                ("Barbell Bicep Curl", [
                    (1, 10, 30.0, True),
                    (2, 10, 32.5, True),
                    (3, 8, 35.0, True),
                ]),
                ("Face Pull", [
                    (1, 15, 20.0, True),
                    (2, 15, 22.5, True),
                    (3, 15, 22.5, True),
                ]),
            ]),
            ("Lower Body Sculpting", now - timedelta(days=1), 44 * 60, 6200.0, leg_plan.id, [
                ("Barbell Back Squat", [
                    (1, 10, 80.0, True),
                    (2, 8, 90.0, True),
                    (3, 8, 95.0, True),
                    (4, 6, 100.0, True),
                ]),
                ("Romanian Deadlift (RDL)", [
                    (1, 10, 70.0, True),
                    (2, 10, 75.0, True),
                    (3, 8, 80.0, True),
                ]),
                ("Leg Press", [
                    (1, 12, 140.0, True),
                    (2, 12, 160.0, True),
                    (3, 10, 170.0, True),
                ]),
                ("Glute Bridge", [
                    (1, 15, 0.0, True),
                    (2, 15, 0.0, True),
                    (3, 15, 0.0, True),
                ]),
                ("Standing Calf Raise", [
                    (1, 15, 50.0, True),
                    (2, 15, 50.0, True),
                    (3, 15, 50.0, True),
                ]),
            ]),
        ]

        for title, start_time, duration, volume, p_id, ex_logs in history_data:
            session = WorkoutSession(
                user_id=demo_user.id,
                plan_id=p_id,
                title=title,
                started_at=start_time,
                completed_at=start_time + timedelta(seconds=duration),
                duration_seconds=duration,
                total_volume_kg=volume,
                notes=f"Auto-generated workout session benchmark for {title}.",
            )
            db.add(session)
            db.flush()

            for ex_name, set_records in ex_logs:
                if ex_name in exercises_map:
                    for s_num, reps, wt, is_done in set_records:
                        db.add(
                            WorkoutSetLog(
                                session_id=session.id,
                                exercise_id=exercises_map[ex_name],
                                set_number=s_num,
                                reps=reps,
                                weight_kg=wt,
                                is_completed=is_done,
                                rpe=8.0,
                            )
                        )

        db.commit()
