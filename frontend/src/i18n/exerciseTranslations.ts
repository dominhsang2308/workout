import { Language } from "./translations";

export interface ExerciseDataTranslation {
  name: { vi: string; en: string };
  description: { vi: string; en: string };
  instructions: { vi: string; en: string };
}

// Complete bilingual knowledge base for all standard exercises
export const EXERCISE_DATA_TRANSLATIONS: Record<string, ExerciseDataTranslation> = {
  "cable chest fly": {
    name: {
      vi: "Ép Ngực Dây Cáp (Cable Chest Fly)",
      en: "Cable Chest Fly",
    },
    description: {
      vi: "Bài tập duy trì áp lực căng liên tục lên toàn bộ nhóm cơ ngực, giúp săn chắc cơ ngực và tạo rãnh ngực quyến rũ.",
      en: "Constant tension chest fly movement focusing on chest definition and shaping.",
    },
    instructions: {
      vi: "1. Đặt ròng rọc ngang tầm vai, bước một chân về phía trước để giữ thăng bằng.\n2. Cùi chỏ hơi cong nhẹ cố định, kéo hai tay về phía trước ngực.\n3. Siết chặt cơ ngực ở điểm chạm nhau trong 1-2 giây.\n4. Mở rộng tay trở về vị trí ban đầu một cách chậm rãi có kiểm soát.",
      en: "1. Set pulleys to shoulder height, take a staggered stance for stability.\n2. Keep a slight, fixed elbow bend, bring handles together across chest.\n3. Squeeze pecs hard at peak contraction for 1-2 seconds.\n4. Return under slow control until you feel a comfortable chest stretch.",
    },
  },

  "barbell bench press": {
    name: {
      vi: "Đẩy Ngực Đòn Tạ (Barbell Bench Press)",
      en: "Barbell Bench Press",
    },
    description: {
      vi: "Bài tập sức mạnh kinh điển cho cơ ngực, vai trước và bắp tay sau, tạo nền tảng vững chắc cho phần thân trên.",
      en: "Standard flat barbell bench press for chest, anterior delts, and triceps.",
    },
    instructions: {
      vi: "1. Nằm phẳng trên ghế, ép chặt xương bả vai vào đệm ghế, hai chân đặt chắc chắn trên sàn.\n2. Nắm thanh đòn rộng hơn vai một chút, hạ tạ có kiểm soát chạm nhẹ giữa ngực.\n3. Đẩy tạ dứt khoát lên trên theo quỹ đạo hơi cong về phía mắt, thở ra khi đẩy.",
      en: "1. Lie flat, retract scapulae firmly into bench, feet planted.\n2. Grip barbell slightly wider than shoulder-width, lower bar to mid-chest.\n3. Press upward with smooth lockout, exhaling on the concentric drive.",
    },
  },

  "incline dumbbell press": {
    name: {
      vi: "Đẩy Ngực Trên Tạ Đơn (Incline Dumbbell Press)",
      en: "Incline Dumbbell Press",
    },
    description: {
      vi: "Tập trung chuyên sâu vào cơ ngực trên, giúp vòng 1 cao ráo và đầy đặn hơn.",
      en: "Incline press focusing on the clavicular head of the pectoralis major.",
    },
    instructions: {
      vi: "1. Điều chỉnh ghế nghiêng 30 - 45 độ, cầm tạ đơn đặt ở ngang ngực trên.\n2. Đẩy tạ hướng lên cao và hơi chụm lại ở đỉnh (không để 2 tạ va vào nhau).\n3. Hạ tạ từ từ trong 2-3 giây để cảm nhận cơ ngực trên được kéo giãn sâu.",
      en: "1. Set bench to 30-45 degrees, dumbbells positioned at upper chest.\n2. Press upward converging slightly at the top without clanking dumbbells.\n3. Lower with 2-3 seconds tempo for a deep upper chest stretch.",
    },
  },

  "barbell deadlift": {
    name: {
      vi: "Kéo Tạ Đòn (Barbell Deadlift)",
      en: "Barbell Deadlift",
    },
    description: {
      vi: "Bài tập tổng hợp toàn diện tác động vào chuỗi cơ sau (lưng, mông, đùi sau), giúp tăng cường vóc dáng thon gọn và khỏe khoắn.",
      en: "Foundational compound lift targeting posterior chain, lower back, traps, and glutes.",
    },
    instructions: {
      vi: "1. Đứng chân rộng bằng hông, thanh đòn bám sát ống chân.\n2. Gập hông, nắm chặt thanh đòn, giữ thẳng lưng và mở rộng ngực.\n3. Đạp mạnh chân xuống sàn kéo tạ đứng thẳng lên, siết chặt cơ mông ở đỉnh.",
      en: "1. Feet hip-width apart, bar touching shins.\n2. Hinge hips back, grip bar outside knees with flat back.\n3. Drive feet into the floor to stand upright, squeezing glutes at lockout.",
    },
  },

  "pull-up": {
    name: {
      vi: "Kéo Xà Đơn (Pull-Up)",
      en: "Pull-Up",
    },
    description: {
      vi: "Bài tập trọng lượng cơ thể phát triển cơ lưng xô thon gọn, tạo đường cong chữ V thanh thoát cho lưng.",
      en: "Vertical pulling movement targeting latissimus dorsi and biceps.",
    },
    instructions: {
      vi: "1. Nắm thanh xà rộng hơn vai, lòng bàn tay hướng ra ngoài.\n2. Hạ xương bả vai xuống trước, sau đó kéo ngực hướng lên chạm thanh xà.\n3. Hạ người có kiểm soát xuống hết tầm tay để kéo giãn cơ xô.",
      en: "1. Grip overhead bar with overhand grip wider than shoulders.\n2. Depress scapulae, pull chest towards bar leading with elbows.\n3. Lower down smoothly into a full stretch.",
    },
  },

  "bent-over barbell row": {
    name: {
      vi: "Gập Người Chèo Tạ Đòn (Bent-Over Barbell Row)",
      en: "Bent-Over Barbell Row",
    },
    description: {
      vi: "Bài tập chèo tạ giúp săn chắc phần lưng trên, cải thiện tư thế đứng thẳng và giảm mỡ lưng.",
      en: "Horizontal pull for upper back thickness and rhomboids.",
    },
    instructions: {
      vi: "1. Gập hông 45 độ, giữ lưng thẳng tự nhiên, đầu gối hơi chùng.\n2. Kéo thanh đòn về phía rốn hoặc bụng dưới, ép chặt hai xương bả vai ở đỉnh.\n3. Hạ tạ từ từ có kiểm soát, hít vào khi hạ.",
      en: "1. Hinge hips to 45 degrees with flat spine and soft knees.\n2. Pull barbell toward navel, retracting shoulder blades firmly.\n3. Lower under control, inhaling on the way down.",
    },
  },

  "lat pulldown": {
    name: {
      vi: "Kéo Xô Cáp Ngồi (Lat Pulldown)",
      en: "Lat Pulldown",
    },
    description: {
      vi: "Phát triển độ thon dài của cơ xô lưng, giúp eo trông nhỏ gọn hơn nhờ tỉ lệ lưng thon thả.",
      en: "Cable vertical pull targeting lats with adjustable resistance.",
    },
    instructions: {
      vi: "1. Ngồi thẳng lưng, cố định đùi dưới đệm gối, tay nắm thanh kéo rộng hơn vai.\n2. Hơi nghiêng người về sau 10-15 độ, kéo thanh đòn xuống chạm nhẹ xương quai xanh.\n3. Cùi chỏ hướng thẳng xuống sàn, thả thanh đòn trở lên từ từ.",
      en: "1. Sit tall with thighs locked under pads, grip bar wider than shoulders.\n2. Slight 10-15 degree backward lean, pull bar down towards upper chest.\n3. Drive elbows downward and control the eccentric return.",
    },
  },

  "barbell back squat": {
    name: {
      vi: "Gánh Tạ Đòn Squat (Barbell Back Squat)",
      en: "Barbell Back Squat",
    },
    description: {
      vi: "Vua của các bài tập thân dưới, kích hoạt tối đa cơ đùi trước, cơ mông và cơ lõi, giúp vòng 3 căng tròn và săn chắc.",
      en: "King of lower body compound lifts targeting quadriceps, glutes, and core.",
    },
    instructions: {
      vi: "1. Đặt thanh đòn trên cơ cầu vai, chân mở rộng bằng vai, mũi chân mở 15-30 độ.\n2. Đẩy hông ra sau và hạ gối xuống sâu cho đến khi đùi song song hoặc sâu hơn sàn.\n3. Đạp gót chân đẩy người đứng dậy dứt khoát, giữ ngực mở cao.",
      en: "1. Rest barbell on upper traps, feet shoulder-width, toes flared slightly.\n2. Break at hips and knees, squat down until thighs are parallel to floor.\n3. Drive through midfoot/heels to stand up tall with open chest.",
    },
  },

  "romanian deadlift (rdl)": {
    name: {
      vi: "Deadlift RDL Đùi Sau & Mông (Romanian Deadlift)",
      en: "Romanian Deadlift (RDL)",
    },
    description: {
      vi: "Bài tập bản lề hông đặc biệt hiệu quả để nâng cao cơ mông và làm thon gọn cơ đùi sau.",
      en: "Hip-hinge movement emphasizing hamstrings and glutes.",
    },
    instructions: {
      vi: "1. Đứng thẳng, cầm đòn tạ hoặc tạ đơn trước đùi, đầu gối chỉ hơi chùng nhẹ cố định.\n2. Đẩy hông ra xa về phía sau, trượt tạ sát chân xuống đến dưới gối cho đến khi đùi sau căng sâu.\n3. Đạp gót chân và siết mạnh cơ mông để đưa hông về vị trí đứng thẳng.",
      en: "1. Stand tall holding weight, soft knees fixed in position.\n2. Push hips backwards, sliding bar along thighs/shins until hamstrings stretch.\n3. Drive hips forward and contract glutes hard to return.",
    },
  },

  "hip thrust": {
    name: {
      vi: "Đẩy Hông Hip Thrust (Barbell Hip Thrust)",
      en: "Barbell Hip Thrust",
    },
    description: {
      vi: "Bài tập số 1 giúp tăng kích thước và độ săn chắc vòng 3 mà không làm to đùi trước.",
      en: "The premier glute hypertrophy exercise for round, sculpted curves.",
    },
    instructions: {
      vi: "1. Tựa lưng trên vào ghế tập, đặt tạ đòn ngang nếp gấp hông có đệm êm.\n2. Hai chân mở rộng bằng vai, đặt gót chân vuông góc 90 độ khi nâng lên đỉnh.\n3. Đạp mạnh gót chân đẩy hông lên cao, siết chặt cơ mông trong 2 giây.",
      en: "1. Rest upper back on bench, position padded barbell across hip crease.\n2. Feet shoulder-width apart, shins vertical at top of lift.\n3. Drive through heels into full hip extension, locking glutes for 2 seconds.",
    },
  },

  "glute bridge": {
    name: {
      vi: "Cầu Mông Sàn (Glute Bridge)",
      en: "Glute Bridge",
    },
    description: {
      vi: "Kích hoạt cơ mông cực kỳ hiệu quả tại nhà, dễ tập trên thảm và giúp vòng 3 săn chắc.",
      en: "Floor glute bridge activating hips and sculpting glutes at home.",
    },
    instructions: {
      vi: "1. Nằm ngửa trên thảm tập, co gối, gót chân cách mông một khoảng vừa phải.\n2. Ấn chặt gót chân xuống sàn nâng mông lên cao tạo đường thẳng từ gối tới ngực.\n3. Siết chặt cơ mông ở đỉnh trong 2 giây rồi từ từ hạ xuống.",
      en: "1. Lie flat on back on mat with knees bent and feet flat on ground.\n2. Drive through heels to raise pelvis toward ceiling.\n3. Squeeze glutes tightly at the top for 2 seconds, then lower under control.",
    },
  },

  "donkey kicks": {
    name: {
      vi: "Đá Mông Ngược (Donkey Kicks)",
      en: "Donkey Kicks",
    },
    description: {
      vi: "Bài tập cô lập cơ mông lớn tại nhà siêu hiệu quả, không cần tạ, giúp nâng mông và hạn chế to đùi.",
      en: "Classic home glute isolation movement sculpting high, perky glutes without heavy weights.",
    },
    instructions: {
      vi: "1. Quỳ bốn chi trên thảm tập, cổ tay đặt dưới vai, đầu gối đặt dưới hông.\n2. Giữ góc gối 90 độ, đẩy gót chân thẳng lên hướng trần nhà.\n3. Siết chặt cơ mông ở điểm cao nhất trong 1 giây, hạ chân xuống không chạm đất và lặp lại.",
      en: "1. Start on all fours on a yoga mat, hands under shoulders, knees under hips.\n2. Keeping knee at 90 degrees, kick one heel straight up toward ceiling.\n3. Squeeze glute tightly at top for 1s, lower slowly without touching floor.",
    },
  },

  "fire hydrant": {
    name: {
      vi: "Đá Mông Ngang (Fire Hydrant)",
      en: "Fire Hydrant",
    },
    description: {
      vi: "Tập trung vào cơ mông nhỡ và hông ngoài, giúp lấp đầy hõm mông và tạo đường cong đồng hồ cát.",
      en: "Targets the gluteus medius and outer hips to build a shapely hourglass silhouette.",
    },
    instructions: {
      vi: "1. Tư thế quỳ bốn điểm trên thảm, giữ lưng thẳng và cơ bụng siết chặt.\n2. Mở một chân sang ngang như cánh cửa, giữ góc gối 90 độ.\n3. Siết cơ hông ngoài ở điểm cao nhất rồi hạ xuống chậm rãi.",
      en: "1. On hands and knees on mat, keeping back neutral and core braced.\n2. Lift one leg out to the side keeping knee bent at 90 degrees.\n3. Squeeze outer glute at the peak and lower with control.",
    },
  },

  "bodyweight air squat": {
    name: {
      vi: "Squat Tự Thân (Bodyweight Air Squat)",
      en: "Bodyweight Air Squat",
    },
    description: {
      vi: "Bài tập nền tảng tại nhà cho đùi thon và mông săn chắc, không cần bất kỳ dụng cụ nào.",
      en: "Foundational lower body bodyweight exercise for thighs and glutes at home.",
    },
    instructions: {
      vi: "1. Đứng chân rộng bằng vai, mũi chân mở nhẹ 15-20 độ, hai tay chắp trước ngực.\n2. Đẩy hông ra sau và hạ đùi xuống sâu ngang sàn, giữ ngực mở cao.\n3. Đạp gót chân đứng thẳng dậy và siết nhẹ mông.",
      en: "1. Feet shoulder-width apart, toes slightly flared, hands together in front.\n2. Sit hips down and back into a deep squat, keeping chest tall.\n3. Drive through heels to stand upright and lock glutes.",
    },
  },

  "walking lunges": {
    name: {
      vi: "Bước Chùng Chân (Walking Lunges)",
      en: "Walking Lunges",
    },
    description: {
      vi: "Đốt mỡ đùi và nâng mông linh hoạt, có thể tập dọc hành lang hoặc phòng khách tại nhà.",
      en: "Dynamic unilateral leg exercise sculpting quads, hamstrings, and glutes.",
    },
    instructions: {
      vi: "1. Đứng thẳng, bước một bước dài về phía trước.\n2. Hạ trọng tâm cho cả hai gối tạo thành góc 90 độ, gối sau không chạm sàn.\n3. Đạp gót chân trước bước tiếp chân sau lên phía trước.",
      en: "1. Stand tall, take a controlled long stride forward.\n2. Lower hips until both knees reach 90-degree angles.\n3. Drive through front heel to step smoothly into next lunge.",
    },
  },

  "knee push-up": {
    name: {
      vi: "Chống Đẩy Quỳ Gối (Knee Push-Up)",
      en: "Knee Push-Up",
    },
    description: {
      vi: "Biến thể chống đẩy êm ái tại nhà cho nữ giới, làm săn chắc cơ ngực, vai và thon gọn bắp tay.",
      en: "Gentle upper-body toning push-up variation ideal for home fitness.",
    },
    instructions: {
      vi: "1. Quỳ gối trên thảm, hai bàn tay đặt rộng hơn vai một chút, thân người thẳng.\n2. Gập cùi chỏ hạ ngực xuống cách sàn 5-10cm, hít vào.\n3. Đẩy mạnh lòng bàn tay nâng người lên vị trí ban đầu, thở ra.",
      en: "1. Knees on mat, hands placed slightly wider than shoulders, torso straight.\n2. Bend elbows to lower chest toward the floor, inhaling.\n3. Press firmly through palms to push back up, exhaling.",
    },
  },

  "bicycle crunch": {
    name: {
      vi: "Gập Bụng Đạp Xe (Bicycle Crunch)",
      en: "Bicycle Crunch",
    },
    description: {
      vi: "Bài tập thắt chặt vòng eo số 1 tại nhà, tác động đồng thời vào cơ bụng số 11 và cơ liên sườn.",
      en: "Top-rated ab exercise targeting both rectus abdominis and obliques for a snatched waist.",
    },
    instructions: {
      vi: "1. Nằm ngửa trên thảm, hai tay chạm nhẹ sau tai, nâng hai chân co 90 độ.\n2. Xoay thân người đưa cùi chỏ phải chạm gối trái, chân phải duỗi thẳng ra.\n3. Đổi bên nhịp nhàng liên tục như động tác đạp xe, luôn siết chặt cơ bụng.",
      en: "1. Lie flat on mat, fingertips behind ears, legs elevated at 90 degrees.\n2. Twist torso to bring right elbow to left knee while extending right leg.\n3. Alternate sides fluidly in a pedaling cadence, maintaining ab tension.",
    },
  },

  "bulgarian split squat": {
    name: {
      vi: "Squat Một Chân Ghế (Bulgarian Split Squat)",
      en: "Bulgarian Split Squat",
    },
    description: {
      vi: "Cô lập từng bên mông và đùi, khắc phục lệch cơ và nâng cao đường cong vòng 3 rõ rệt.",
      en: "Single-leg squat targeting glutes and quads while addressing imbalances.",
    },
    instructions: {
      vi: "1. Đặt mu bàn chân sau lên ghế/giường, bước chân trước về phía trước một sải chân.\n2. Hạ trọng tâm thẳng đứng cho đến khi đùi trước song song với mặt sàn.\n3. Dồn 85% lực vào chân trước đẩy người đứng thẳng dậy.",
      en: "1. Rest top of rear foot on bench/chair, front foot stepped comfortably forward.\n2. Lower hips vertically until front thigh is parallel to the ground.\n3. Push through front heel to stand up, keeping core braced.",
    },
  },

  "leg press": {
    name: {
      vi: "Đạp Đùi Bàn Ép (Leg Press)",
      en: "Leg Press",
    },
    description: {
      vi: "Máy đạp đùi chuyên dụng phòng gym an toàn với lưng, giúp phát triển cơ đùi săn chắc và tăng sức mạnh thân dưới.",
      en: "Machine leg press allowing heavy quad loading with back support.",
    },
    instructions: {
      vi: "1. Ngồi áp sát lưng vào ghế đệm, đặt chân giữa bàn ép rộng bằng vai.\n2. Mở khóa máy, hạ bàn ép xuống có kiểm soát đến góc gối 90 độ.\n3. Đạp mạnh bàn ép lên nhưng KHÔNG khóa thẳng băng khớp gối ở đỉnh.",
      en: "1. Back supported against pad, feet shoulder-width on footplate.\n2. Lower sled smoothly until knees form 90 degrees flexion.\n3. Press back up without forcefully locking knees.",
    },
  },

  "standing calf raise": {
    name: {
      vi: "Nhón Bắp Chuối Đứng (Standing Calf Raise)",
      en: "Standing Calf Raise",
    },
    description: {
      vi: "Cô lập cơ bắp chuối, giúp đôi chân thon gọn, săn chắc và đôi bắp chân khỏe khoắn.",
      en: "Isolates the gastrocnemius muscle for toned calves.",
    },
    instructions: {
      vi: "1. Đặt nửa trước bàn chân lên mép bục, hạ gót chân xuống sâu để kéo giãn cơ bắp chuối.\n2. Kiễng cao hết mức lên đầu ngón chân, siết cơ bắp chuối ở điểm cao nhất trong 1 giây.\n3. Hạ gót chân chậm rãi trở lại.",
      en: "1. Balls of feet on step edge, lower heels for deep stretch.\n2. Press high onto toes and pause for 1 second.\n3. Lower with a controlled, fluid tempo.",
    },
  },

  "overhead barbell press": {
    name: {
      vi: "Đẩy Vai Đòn Tạ (Overhead Barbell Press)",
      en: "Overhead Barbell Press",
    },
    description: {
      vi: "Xây dựng bờ vai thon gọn, thanh mảnh và cân đối, tăng sức mạnh cơ bắp tay sau.",
      en: "Strict overhead press targeting deltoids and triceps.",
    },
    instructions: {
      vi: "1. Đứng thẳng, giữ thanh đòn ngang xương quai xanh, siết chặt cơ bụng và mông.\n2. Đẩy thanh tạ thẳng đứng lên qua đầu, khóa khớp cùi chỏ nhẹ ở đỉnh.\n3. Hạ tạ chậm về vị trí ban đầu ngang ngực trên.",
      en: "1. Stand tall with bar at collarbone, brace core and glutes.\n2. Press vertically overhead until arms lock out cleanly.\n3. Lower bar smoothly under control back to clavicles.",
    },
  },

  "dumbbell lateral raise": {
    name: {
      vi: "Dang Tạ Đơn Vai Giữa (Dumbbell Lateral Raise)",
      en: "Dumbbell Lateral Raise",
    },
    description: {
      vi: "Tập trung cô lập cơ vai giữa, tạo form vai thon gọn, thanh thoát khi mặc áo hai dây hoặc đầm.",
      en: "Isolates the lateral deltoid head for beautiful shoulder contour.",
    },
    instructions: {
      vi: "1. Đứng thẳng, người hơi nghiêng về trước một chút, hai tay cầm tạ đơn bên hông.\n2. Cùi chỏ hơi cong nhẹ, nâng hai tay sang ngang lên ngang tầm vai.\n3. Dẫn động bằng cùi chỏ, giữ lại nửa giây rồi hạ tạ từ từ.",
      en: "1. Stand with slight forward lean, holding dumbbells at sides.\n2. With soft elbows, raise arms out to sides until parallel to ground.\n3. Lead with elbows and lower slowly for 2-3 seconds.",
    },
  },

  "face pull": {
    name: {
      vi: "Kéo Cáp Mặt Vai Sau (Face Pull)",
      en: "Face Pull",
    },
    description: {
      vi: "Bài tập cải thiện tư thế lưng tôm gù vai, giúp mở vai thẳng lưng và tăng sức khỏe khớp vai.",
      en: "Rear deltoid and rotator cuff builder, essential for posture and shoulder health.",
    },
    instructions: {
      vi: "1. Gắn dây thừng vào ròng rọc ngang tầm mắt, nắm hai đầu dây.\n2. Kéo dây về phía trán/mắt, mở rộng hai cùi chỏ sang hai bên.\n3. Xoay ngoài cánh tay và siết chặt cơ vai sau, giữ lại 1 giây rồi nhả ra chậm rãi.",
      en: "1. Attach rope at eye level, grip handles with thumbs back.\n2. Pull toward forehead while separating elbows outward.\n3. Rotate forearms back, contract rear delts, and return with control.",
    },
  },

  "barbell bicep curl": {
    name: {
      vi: "Cuộn Tay Trước Đòn Tạ (Barbell Bicep Curl)",
      en: "Barbell Bicep Curl",
    },
    description: {
      vi: "Bài tập kinh điển giúp bắp tay trước thon gọn, săn chắc và giảm mỡ thừa cánh tay.",
      en: "Classic bicep mass builder for toned, defined arms.",
    },
    instructions: {
      vi: "1. Đứng thẳng, cầm đòn tạ ngửa lòng bàn tay, hai cùi chỏ khép sát hai bên sườn.\n2. Cuộn thanh đòn lên ngang ngực mà không đung đưa thân người.\n3. Siết cơ bắp tay ở đỉnh 1 giây rồi hạ tạ chậm rãi xuống.",
      en: "1. Hold barbell with underhand grip, elbows pinned to sides.\n2. Curl bar up to chest level without swinging torso.\n3. Squeeze biceps at peak, then lower down with control over 2-3s.",
    },
  },

  "tricep rope pushdown": {
    name: {
      vi: "Đẩy Cáp Tay Sau (Tricep Rope Pushdown)",
      en: "Tricep Rope Pushdown",
    },
    description: {
      vi: "Giúp đánh bay mỡ thừa bắp tay sau, tạo cánh tay thon gọn, săn chắc tự tin.",
      en: "Isolates triceps lateral and medial heads for sculpted arms.",
    },
    instructions: {
      vi: "1. Nắm hai đầu dây thừng, cùi chỏ ép sát sườn cố định.\n2. Đẩy dây cáp xuống phía đùi và tách nhẹ hai đầu dây thừng ở điểm thấp nhất.\n3. Siết chặt bắp tay sau trong 1 giây rồi thu tay trở về góc 90 độ.",
      en: "1. Grip rope ends, elbows locked at sides throughout.\n2. Push down and flare rope tips slightly outward at full extension.\n3. Squeeze triceps hard, then return under control to 90 degrees.",
    },
  },

  "hammer dumbbell curl": {
    name: {
      vi: "Cuộn Tay Trước Cầm Dọc (Hammer Dumbbell Curl)",
      en: "Hammer Dumbbell Curl",
    },
    description: {
      vi: "Tác động vào cơ bắp tay trước và cơ cẳng tay, giúp cánh tay thon đều và tăng lực cầm nắm.",
      en: "Neutral-grip curl targeting brachialis and forearm flexors.",
    },
    instructions: {
      vi: "1. Cầm tạ đơn với hai lòng bàn tay hướng vào nhau (kiểu cầm búa).\n2. Giữ cùi chỏ cố định sát sườn, cuộn tạ lên ngang vai.\n3. Hạ tạ từ từ có kiểm soát, hít vào khi hạ.",
      en: "1. Hold dumbbells with palms facing each other throughout.\n2. Keep elbows stationary beside ribs, curl weights to shoulders.\n3. Lower with control, inhaling on descent.",
    },
  },

  "hanging leg raise": {
    name: {
      vi: "Treo Xà Nâng Chân Bụng Dưới (Hanging Leg Raise)",
      en: "Hanging Leg Raise",
    },
    description: {
      vi: "Bài tập siết cơ bụng dưới và cơ gập hông cực kỳ hiệu quả, giúp bụng dưới phẳng lỳ.",
      en: "Dynamic core exercise engaging lower abs and hip flexors.",
    },
    instructions: {
      vi: "1. Treo người trên xà đơn, hai tay nắm chắc rộng hơn vai một chút.\n2. Siết cơ bụng, cuộn xương chậu nâng chân hoặc gối lên ngang ngực.\n3. Giữ lại nửa giây rồi hạ chân xuống từ từ, không để thân người đung đưa.",
      en: "1. Hang from pull-up bar with active, stable shoulders.\n2. Roll pelvis upward, bringing straight legs or knees up to hip height.\n3. Lower slowly without swinging momentum.",
    },
  },

  "plank": {
    name: {
      vi: "Plank Siết Cơ Bụng (Plank)",
      en: "Plank",
    },
    description: {
      vi: "Bài tập siết cơ lõi toàn diện, giúp thon gọn vòng eo, phẳng bụng và bảo vệ cột sống.",
      en: "Isometric core stability exercise for a flatter tummy and waist.",
    },
    instructions: {
      vi: "1. Chống cẳng tay vuông góc trên sàn, cùi chỏ đặt ngay dưới vai.\n2. Nâng người tạo thành đường thẳng tắp từ đầu, lưng, mông đến gót chân.\n3. Siết chặt cơ bụng và cơ mông, hít thở sâu và đều đặn trong suốt thời gian giữ.",
      en: "1. Forearms on floor, elbows directly under shoulders.\n2. Maintain rigid straight line from head to heels.\n3. Brace abdomen and glutes firmly while breathing steadily.",
    },
  },

  "banded clamshells": {
    name: {
      vi: "Mở Gối Dây Kháng Lực (Banded Clamshells)",
      en: "Banded Clamshells",
    },
    description: {
      vi: "Bài tập cô lập cơ mông nhỡ số 1 tại nhà với dây mini-band, giúp lấp đầy hõm mông và tạo bờ hông quả đào quyến rũ.",
      en: "Top isolated glute medius exercise with mini-band for rounder hips at home.",
    },
    instructions: {
      vi: "1. Nằm nghiêng trên thảm yoga, hai đầu gối gập 90 độ, lồng dây kháng lực ngay trên đầu gối.\n2. Hai mép bàn chân luôn chụm dính vào nhau, mở đầu gối chân trên lên cao hết cỡ như vỏ sò hé mở.\n3. Siết chặt cơ mông ngoài ở đỉnh 1-2 giây rồi từ từ khép lại có kiểm soát.",
      en: "1. Lie on side on mat, knees at 90 degrees, band looped above knees.\n2. Keep feet glued together, rotate top knee upward like an opening clam shell.\n3. Squeeze outer glute for 1-2 seconds at peak, then lower with control.",
    },
  },

  "banded lateral walk": {
    name: {
      vi: "Bước Ngang Dây Kháng Lực (Banded Lateral Walk)",
      en: "Banded Lateral Walk",
    },
    description: {
      vi: "Kích hoạt toàn diện vùng mông ngoài và đùi trên tại nhà, làm săn chắc cơ chân và thon gọn đùi.",
      en: "Dynamic resistance band monster walk activating entire outer hip and upper glutes.",
    },
    instructions: {
      vi: "1. Lồng dây kháng lực quanh cổ chân hoặc trên gối, hạ gối xuống tư thế squat nhẹ.\n2. Bước từng bước sang ngang có kiểm soát, luôn duy trì độ căng của dây kháng lực.\n3. Không để hai đầu gối chụm vào nhau, giữ lưng thẳng và ngực mở.",
      en: "1. Place band around ankles or above knees, take a light athletic quarter squat.\n2. Step laterally sideways under control, constantly maintaining tension on the band.\n3. Prevent knees from collapsing inward, keep chest tall.",
    },
  },

  "bird dog": {
    name: {
      vi: "Tư Thế Chim - Chó (Bird Dog)",
      en: "Bird Dog",
    },
    description: {
      vi: "Bài tập thảm chuẩn Pilates giúp ổn định cột sống, siết chặt cơ bụng lõi và tạo eo thon không cần bất kỳ tạ nặng.",
      en: "Essential physical therapy & pilates core movement stabilizing spine and trimming waistline without weights.",
    },
    instructions: {
      vi: "1. Bò 4 chân trên thảm yoga, cổ tay dưới vai, đầu gối dưới hông.\n2. Nâng đồng thời tay phải về phía trước và chân trái ra phía sau thành đường thẳng song song sàn.\n3. Siết cơ bụng và cơ mông giữ 2 giây, sau đó thu về và đổi bên nhịp nhàng.",
      en: "1. Tabletop position on mat, wrists under shoulders, knees under hips.\n2. Extend opposite arm forward and opposite leg backward parallel to floor.\n3. Hold 2 seconds bracing core and glutes, return and alternate sides smoothly.",
    },
  },

  "mountain climbers": {
    name: {
      vi: "Leo Núi Tại Chỗ (Mountain Climbers)",
      en: "Mountain Climbers",
    },
    description: {
      vi: "Động tác cardio đốt mỡ toàn thân tại nhà trên thảm, siết cơ bụng dưới và tăng cường sức bền tim mạch.",
      en: "Dynamic bodyweight floor cardio engaging lower abs and calorie burning at home.",
    },
    instructions: {
      vi: "1. Bắt đầu ở tư thế chống đẩy cao tay trên thảm, giữ lưng thẳng và cơ bụng siết chặt.\n2. Kéo luân phiên từng đầu gối hướng về phía ngực theo nhịp chạy nhịp nhàng.\n3. Giữ hông thấp ngang lưng, không nhấp nhô mông lên cao.",
      en: "1. Start in high plank position on mat, back flat and core braced.\n2. Drive knees alternately towards chest in a smooth running cadence.\n3. Keep hips level with shoulders without bouncing excessively.",
    },
  },

  "cat-cow stretch": {
    name: {
      vi: "Kéo Giãn Mèo - Bò (Cat-Cow Stretch)",
      en: "Cat-Cow Stretch",
    },
    description: {
      vi: "Bài tập yoga mở rộng lồng ngực, giải tỏa nhức mỏi lưng và tăng độ dẻo dai cho toàn bộ cột sống.",
      en: "Gentle spinal mobility movement relieving back stiffness and engaging deep pelvic floor.",
    },
    instructions: {
      vi: "1. Bò 4 chân trên thảm yoga, hít sâu hạ bụng xuống sàn, ưỡn ngực nhìn lên (Tư thế Bò).\n2. Thở chậm cuộn tròn lưng lên trần nhà, cúi đầu nhìn về rốn (Tư thế Mèo).\n3. Lặp lại nhịp nhàng 8-10 nhịp thở sâu.",
      en: "1. Inhale, drop belly, look up with broad chest (Cow).\n2. Exhale, round spine up towards ceiling, chin to chest (Cat).\n3. Repeat fluidly for 8-10 deep breath cycles.",
    },
  },

  "glute bridge hold": {
    name: {
      vi: "Giữ Cầu Mông Tĩnh (Glute Bridge Hold)",
      en: "Glute Bridge Hold",
    },
    description: {
      vi: "Bài tập siết cơ mông tĩnh tại nhà, giúp định hình vòng 3 quả đào và tăng sức bền cơ mông.",
      en: "Isometric glute activation exercise building endurance and firming buttocks.",
    },
    instructions: {
      vi: "1. Nằm ngửa trên thảm, co gối, bàn chân đặt phẳng trên sàn cách mông một gang tay.\n2. Đạp gót chân đẩy hông lên cao tạo đường thẳng từ gối đến vai.\n3. Siết chặt hai mông giữ nguyên tư thế trong 30-45 giây, thở đều đặn.",
      en: "1. Lie flat on mat, knees bent, feet flat hip-width apart.\n2. Drive through heels to lift hips creating straight diagonal line.\n3. Squeeze glutes hard and hold for 30-45 seconds while breathing steadily.",
    },
  },

  "dead bug": {
    name: {
      vi: "Bọ Chết Siết Bụng Lõi (Dead Bug)",
      en: "Dead Bug",
    },
    description: {
      vi: "Bài tập cơ bụng chuẩn Pilates bảo vệ lưng dưới tuyệt đối, giúp làm phẳng bụng dưới hiệu quả.",
      en: "Foundational pilates core stability movement protecting lower back while flattening lower tummy.",
    },
    instructions: {
      vi: "1. Nằm ngửa, hai tay giơ thẳng lên trần, hai chân co 90 độ.\n2. Ép chặt thắt lưng sát mặt thảm, hạ đồng thời tay phải và chân trái xuống sát sàn.\n3. Giữ cơ bụng gồng chặt rồi đưa về vị trí ban đầu và đổi bên luân phiên.",
      en: "1. Lie on back, arms pointing up, knees bent 90 degrees.\n2. Press lower back firmly into mat, lower opposite arm and leg toward floor.\n3. Return under control and alternate sides without arching lower back.",
    },
  },

  "standing side leg raise": {
    name: {
      vi: "Nâng Chân Ngang Đứng (Standing Side Leg Raise)",
      en: "Standing Side Leg Raise",
    },
    description: {
      vi: "Bài tập đứng không cần tạ giúp siết gọn đùi ngoài, làm đầy hõm mông và thon gọn chân.",
      en: "Gentle standing outer thigh and hip sculpter with zero equipment required.",
    },
    instructions: {
      vi: "1. Đứng thẳng, một tay vịn vào tường hoặc lưng ghế giữ thăng bằng.\n2. Nâng một chân sang ngang góc khoảng 45 độ, giữ mũi chân hướng thẳng về phía trước.\n3. Siết cơ mông nhỡ ở điểm cao nhất trong 1 giây rồi hạ từ từ.",
      en: "1. Stand tall holding wall or chair for balance.\n2. Raise outer leg out to side to 45 degrees, toes pointing forward.\n3. Squeeze outer hip for 1 second at top, then lower smoothly.",
    },
  },

  "side plank": {
    name: {
      vi: "Plank Nghiêng Thắt Eo (Side Plank)",
      en: "Side Plank",
    },
    description: {
      vi: "Bài tập siết cơ liên sườn số 1 giúp thu nhỏ vòng eo và tạo rãnh eo số 11 săn chắc.",
      en: "Static core exercise targeting obliques and transverse abdominis for a sculpted hourglass waist.",
    },
    instructions: {
      vi: "1. Nằm nghiêng, chống cẳng tay vuông góc với thảm, hai chân xếp chồng lên nhau.\n2. Nâng hông lên cao tạo đường thẳng tắp từ đầu đến mắt cá chân.\n3. Gồng chặt cơ liên sườn và giữ trong 30-40 giây mỗi bên.",
      en: "1. Lie on side propped on elbow under shoulder, legs stacked.\n2. Lift hips until body forms straight rigid line.\n3. Hold 30-40 seconds per side bracing obliques tightly.",
    },
  },

  "banded glute bridge": {
    name: {
      vi: "Cầu Mông Dây Kháng Lực (Banded Glute Bridge)",
      en: "Banded Glute Bridge",
    },
    description: {
      vi: "Nhân đôi hiệu quả kích hoạt vòng 3 kết hợp nâng mông và mở gối chống lại lực cản của dây.",
      en: "Double-impact glute builder combining hip extension with abductor resistance.",
    },
    instructions: {
      vi: "1. Lồng dây kháng lực mini-band ngay trên đầu gối, nằm ngửa trên thảm.\n2. Đạp gót nâng hông lên cao đồng thời mở nhẹ hai đầu gối sang hai bên chống lại dây.\n3. Siết chặt toàn bộ cơ mông trong 1-2 giây rồi hạ chậm rãi.",
      en: "1. Loop band just above knees, lie flat with feet planted.\n2. Drive hips upward while actively pushing knees outward against band.\n3. Squeeze glutes firmly for 1-2 seconds, lower under steady control.",
    },
  },

  "reverse lunges": {
    name: {
      vi: "Bước Lùi Chùng Chân (Reverse Lunges)",
      en: "Reverse Lunges",
    },
    description: {
      vi: "Biến thể lunge êm dịu cho khớp gối, tập trung sâu vào cơ mông và đùi sau.",
      en: "Knee-friendly unilateral leg exercise creating firm glutes and slender hamstrings.",
    },
    instructions: {
      vi: "1. Đứng thẳng, bước một chân lùi về phía sau một bước dài vừa phải.\n2. Hạ trọng tâm thẳng đứng cho cả hai đầu gối gập 90 độ.\n3. Dồn lực đạp gót chân trước đứng dậy trở về vị trí bắt đầu.",
      en: "1. Stand tall, step one foot backwards smoothly.\n2. Lower hips vertically until both knees bend to 90 degrees.\n3. Drive through front heel to return to starting position.",
    },
  },

  "russian twist": {
    name: {
      vi: "Xoay Người Siết Eo (Russian Twist)",
      en: "Russian Twist",
    },
    description: {
      vi: "Bài tập xoay thân người giúp đánh tan mỡ thừa vùng eo hông và làm săn chắc cơ bụng.",
      en: "Rotational oblique exercise defining the waistline and burning love handles.",
    },
    instructions: {
      vi: "1. Ngồi trên thảm, co nhẹ đầu gối, ngả lưng ra sau góc khoảng 45 độ.\n2. Siết chặt cơ bụng, xoay ngực và hai tay sang bên phải rồi sang bên trái nhịp nhàng.\n3. Giữ lưng thẳng, không để lưng bị gù cong khi xoay.",
      en: "1. Sit on mat with knees bent, lean torso back to 45 degrees.\n2. Brace core, rotate shoulders and hands side to side with control.\n3. Keep chest open and spine straight throughout.",
    },
  },

  "banded kickback": {
    name: {
      vi: "Đá Mông Sau Dây Kháng Lực (Banded Kickback)",
      en: "Banded Kickback",
    },
    description: {
      vi: "Bài tập cô lập cơ mông lớn tại nhà, giúp nâng cao đỉnh mông và tạo độ săn tròn căng đầy.",
      en: "Direct gluteus maximus isolation creating a lifted, perkier backside.",
    },
    instructions: {
      vi: "1. Lồng dây kháng lực quanh cổ chân hoặc đầu gối, đứng thẳng vịn tay vào tường.\n2. Đá một chân thẳng ra phía sau và hơi chếch ra ngoài, siết chặt đỉnh mông.\n3. Giữ thẳng lưng, không võng thắt lưng lấy đà.",
      en: "1. Loop band around ankles or above knees, hold wall for balance.\n2. Kick one leg straight back and slightly outward, contracting upper glute.\n3. Keep pelvis stable without hyperextending lower back.",
    },
  },

  "jump squats": {
    name: {
      vi: "Bật Nhảy Squat Đốt Mỡ (Jump Squats)",
      en: "Jump Squats",
    },
    description: {
      vi: "Bài tập plyometric cường độ cao giúp đốt cháy calo cực khủng và làm săn chắc toàn bộ đùi và mông.",
      en: "High-energy plyometric squat burning massive calories and toning lower body.",
    },
    instructions: {
      vi: "1. Hạ người vào tư thế squat chuẩn, ngực ưỡn mở.\n2. Dùng lực chân bật nhảy dứt khoát thẳng lên không trung.\n3. Tiếp đất nhẹ nhàng bằng mũi chân đến gót chân rồi hạ ngay vào nhịp squat tiếp theo.",
      en: "1. Lower into deep air squat with proud chest.\n2. Explode upwards jumping straight into air.\n3. Land softly absorbing impact from toe to heel directly into next squat.",
    },
  },

  "hollow body hold": {
    name: {
      vi: "Giữ Bụng Rỗng Thể Thao (Hollow Body Hold)",
      en: "Hollow Body Hold",
    },
    description: {
      vi: "Tư thế giữ bụng đỉnh cao của VĐV thể dục dụng cụ, siết chặt toàn bộ thành bụng từ trong ra ngoài.",
      en: "Gold-standard gymnast core isometric hold creating incredible abdominal density and flat tummy.",
    },
    instructions: {
      vi: "1. Nằm ngửa trên thảm, ép toàn bộ thắt lưng dính chặt xuống sàn.\n2. Nâng hai chân cách sàn 15cm và vươn hai tay qua đầu tạo hình dáng chiếc thuyền.\n3. Gồng cứng cơ bụng tối đa và giữ trong 20-30 giây, thở đều.",
      en: "1. Lie flat pressing lumbar spine completely into mat.\n2. Hover arms overhead and legs 6 inches off floor in hollow banana shape.\n3. Lock core maximally and hold for 20-30 seconds.",
    },
  },

  "pike push-up": {
    name: {
      vi: "Chống Đẩy Dốc Vai (Pike Push-Up)",
      en: "Pike Push-Up",
    },
    description: {
      vi: "Bài tập thể hình tự thân nâng cao tác động trực tiếp vào cơ vai trước và bắp tay sau không cần tạ.",
      en: "Advanced bodyweight vertical push targeting anterior deltoids and triceps without weights.",
    },
    instructions: {
      vi: "1. Bắt đầu ở tư thế chữ V ngược (như downward dog), hông nâng cao lên trời.\n2. Gập cùi chỏ hạ đỉnh đầu chạm nhẹ phía trước hai bàn tay.\n3. Đẩy dứt khoát ngược trở lại vị trí chữ V ban đầu.",
      en: "1. Inverted V shape with hips held high in downward dog.\n2. Bend elbows lowering crown of head forward between hands.\n3. Press firmly back up into starting inverted V position.",
    },
  },

  "goblet squat": {
    name: {
      vi: "Squat Ôm Tạ Đơn (Goblet Squat)",
      en: "Goblet Squat",
    },
    description: {
      vi: "Bài tập squat nền tảng tại phòng gym, giúp giữ thân người thẳng đứng và kích hoạt tối ưu cơ đùi & mông.",
      en: "Ideal squat variation teaching upright posture and deep quad engagement with single dumbbell.",
    },
    instructions: {
      vi: "1. Hai tay ôm tạ đơn dựng dọc trước ngực sát dưới cằm, chân rộng bằng vai.\n2. Hạ hông xuống sâu, cùi chỏ lọt vào bên trong hai đầu gối.\n3. Đạp gót chân đứng thẳng lên và siết cơ mông ở đỉnh.",
      en: "1. Hold dumbbell vertically cupped against chest, shoulder-width stance.\n2. Squat deep keeping elbows tracking inside knees.\n3. Drive through heels to stand upright squeezing glutes.",
    },
  },

  "seated cable row": {
    name: {
      vi: "Kéo Cáp Ngồi Thẳng Lưng (Seated Cable Row)",
      en: "Seated Cable Row",
    },
    description: {
      vi: "Bài tập chèo cáp giúp săn chắc cơ lưng trên, cải thiện tư thế đứng thẳng và giảm mỡ lưng.",
      en: "Safe and effective machine horizontal pull promoting upright posture and slender upper back.",
    },
    instructions: {
      vi: "1. Ngồi thẳng lưng trên máy, chân đặt trên bệ tỳ, cầm tay nắm chữ V.\n2. Kéo tay nắm về phía bụng dưới, ép chặt hai xương bả vai lại với nhau.\n3. Nhả cáp từ từ có kiểm soát, cảm nhận cơ xô được kéo giãn sâu.",
      en: "1. Sit tall on bench, feet braced on footrests, grasp V-bar.\n2. Pull handle to navel while pulling shoulders back and retracting scapulae.\n3. Release slowly under control for a full stretch.",
    },
  },

  "dumbbell bicep curl": {
    name: {
      vi: "Cuộn Tay Trước Tạ Đơn (Dumbbell Bicep Curl)",
      en: "Dumbbell Bicep Curl",
    },
    description: {
      vi: "Bài tập kinh điển giúp thon gọn và săn chắc bắp tay trước với tạ đơn.",
      en: "Fundamental arm shaping movement for toned biceps with dumbbells.",
    },
    instructions: {
      vi: "1. Đứng thẳng, cầm hai tạ đơn thả lỏng hai bên sườn, lòng bàn tay hướng về trước.\n2. Cố định cùi chỏ sát sườn, cuộn tạ lên phía vai và siết cơ bắp tay trong 1 giây.\n3. Hạ tạ chậm rãi trong 2-3 giây, hít vào khi hạ.",
      en: "1. Stand tall with dumbbells at sides, palms facing forward.\n2. Pin elbows to ribs, curl dumbbells up and squeeze biceps.\n3. Lower with control over 2-3 seconds.",
    },
  },

  "lying leg curl": {
    name: {
      vi: "Móc Đùi Sau Bằng Máy (Lying Leg Curl)",
      en: "Lying Leg Curl",
    },
    description: {
      vi: "Máy tập cô lập cơ đùi sau (hamstrings), giúp làm săn chắc mặt sau đùi và thon gọn chân.",
      en: "Targeted hamstring isolation machine toning the back of the thighs.",
    },
    instructions: {
      vi: "1. Nằm sấp trên máy, đệm kê vừa vặn ngay trên gót chân (phía dưới bắp chuối).\n2. Gập gối kéo gót chân hướng về phía mông, siết chặt cơ đùi sau ở đỉnh.\n3. Hạ tạ từ từ có kiểm soát, không để tạ chạm nhau gây mất sức căng.",
      en: "1. Lie face down with pad positioned just above heels.\n2. Curl legs upward towards glutes, contracting hamstrings hard.\n3. Lower with 2-3 seconds tempo without slamming weight stack.",
    },
  },

  "dumbbell shoulder press": {
    name: {
      vi: "Đẩy Vai Tạ Đơn (Dumbbell Shoulder Press)",
      en: "Dumbbell Shoulder Press",
    },
    description: {
      vi: "Bài tập phát triển cơ vai tròn trịa và thanh thoát, tạo tỷ lệ cơ thể đồng hồ cát cân đối.",
      en: "Overhead pressing exercise creating feminine rounded shoulders and arm definition.",
    },
    instructions: {
      vi: "1. Ngồi trên ghế có tựa lưng thẳng, cầm tạ đơn ngang tầm tai, cùi chỏ mở 75 độ.\n2. Đẩy tạ thẳng lên cao qua đầu, hơi chụm tạ lại ở đỉnh (không va tạ vào nhau).\n3. Hạ tạ có kiểm soát trở lại ngang tầm tai, hít vào khi hạ.",
      en: "1. Sit tall on upright bench with dumbbells at ear height.\n2. Press upward converging slightly overhead without locking elbows.\n3. Lower smoothly to ear level, inhaling on descent.",
    },
  },

  "front squat": {
    name: {
      vi: "Gánh Tạ Đòn Trước Ngực (Front Squat)",
      en: "Front Squat",
    },
    description: {
      vi: "Bài tập squat nâng cao giúp phát triển cơ đùi trước săn chắc và siết chặt toàn bộ cơ lõi.",
      en: "Advanced quad and thoracic builder requiring deep mobility and core bracing.",
    },
    instructions: {
      vi: "1. Đặt thanh đòn lên phần trước cơ vai, giữ hai cùi chỏ hướng cao về phía trước.\n2. Giữ lưng thẳng đứng, hạ hông xuống sâu ngang hoặc dưới đùi song song.\n3. Đạp chân mạnh mẽ đứng dậy dứt khoát.",
      en: "1. Rack bar across front deltoids with high elbows.\n2. Descend deep into squat maintaining perfectly vertical torso.\n3. Drive through midfoot to stand upright.",
    },
  },

  "banded squats": {
    name: {
      vi: "Squat Dây Kháng Lực (Banded Squats)",
      en: "Banded Squats",
    },
    description: {
      vi: "Bài tập squat tại nhà kết hợp dây kháng lực trên đầu gối, kích hoạt toàn diện cơ mông và đùi.",
      en: "Home squat variation with looped resistance band above knees for enhanced glute activation.",
    },
    instructions: {
      vi: "1. Lồng dây kháng lực ngay phía trên hai đầu gối, đứng chân rộng bằng vai.\n2. Hạ hông xuống tư thế squat sâu, chủ động mở hai đầu gối sang hai bên chống lại lực ép của dây.\n3. Đạp mạnh gót chân đứng thẳng dậy và siết nhẹ mông.",
      en: "1. Place resistance band above knees, feet shoulder-width apart.\n2. Squat down driving knees outward against band tension.\n3. Push through heels to return to standing, contracting glutes.",
    },
  },

  "banded pull-apart": {
    name: {
      vi: "Kéo Dây Kháng Lực Mở Vai (Banded Pull-Apart)",
      en: "Banded Pull-Apart",
    },
    description: {
      vi: "Động tác phục hồi và săn chắc lưng trên, mở rộng lồng ngực và khắc phục tình trạng gù lưng tại nhà.",
      en: "Postural corrective exercise strengthening rear delts and upper back with a band.",
    },
    instructions: {
      vi: "1. Đứng thẳng, cầm dây kháng lực bằng hai tay duỗi thẳng phía trước ngực.\n2. Kéo dây sang hai bên ngang ngực cho đến khi chạm nhẹ vào ngực, ép chặt hai xương bả vai.\n3. Giữ 1 giây rồi từ từ đưa tay về vị trí ban đầu có kiểm soát.",
      en: "1. Hold resistance band in front of chest with arms straight.\n2. Pull band apart horizontally until it touches chest, squeezing shoulder blades together.\n3. Return slowly to start with controlled resistance.",
    },
  },

  "banded bicep curl": {
    name: {
      vi: "Cuộn Tay Trước Dây Kháng Lực (Banded Bicep Curl)",
      en: "Banded Bicep Curl",
    },
    description: {
      vi: "Làm săn chắc bắp tay trước và thon gọn cánh tay tại nhà không cần tạ đơn.",
      en: "Home arm-toning movement using constant resistance band tension for shapely biceps.",
    },
    instructions: {
      vi: "1. Đứng hai chân dẫm chắc lên giữa dây kháng lực, hai tay cầm hai đầu dây.\n2. Cố định cùi chỏ sát sườn, gập cẳng tay cuộn dây lên phía vai.\n3. Siết chặt bắp tay ở đỉnh 1 giây rồi từ từ hạ tay xuống.",
      en: "1. Stand on middle of band, grasp ends with palms facing up.\n2. Keeping elbows glued to sides, curl band upward toward shoulders.\n3. Squeeze biceps at peak contraction, lower smoothly.",
    },
  },
};

// Equipment translations
export const EQUIPMENT_TRANSLATIONS: Record<string, { vi: string; en: string }> = {
  Barbell: { vi: "Đòn tạ (Barbell)", en: "Barbell" },
  Dumbbell: { vi: "Tạ đơn (Dumbbell)", en: "Dumbbell" },
  Cable: { vi: "Dây cáp (Cable)", en: "Cable" },
  Machine: { vi: "Máy tập (Machine)", en: "Machine" },
  Bodyweight: { vi: "Tự thân (Bodyweight)", en: "Bodyweight" },
  "Resistance Band": { vi: "Dây kháng lực", en: "Resistance Band" },
  "Yoga Mat": { vi: "Thảm Yoga", en: "Yoga Mat" },
};

// Category translations
export const CATEGORY_TRANSLATIONS: Record<string, { vi: string; en: string }> = {
  Strength: { vi: "Sức Mạnh", en: "Strength" },
  Hypertrophy: { vi: "Săn Chắc & Tăng Cơ", en: "Hypertrophy" },
  Endurance: { vi: "Sức Bền & Dẻo Dai", en: "Endurance" },
  Toning: { vi: "Săn Chắc Vóc Dáng", en: "Toning" },
  Yoga: { vi: "Yoga & Dẻo Dai", en: "Yoga" },
  Pilates: { vi: "Pilates", en: "Pilates" },
  HIIT: { vi: "HIIT Đốt Mỡ", en: "HIIT" },
  Dance: { vi: "Nhảy & Cardio", en: "Dance" },
  Flexibility: { vi: "Linh Hoạt", en: "Flexibility" },
};

/**
 * Checks if an exercise is suitable for Home Workout:
 * - STRICT HOME ONLY: Yoga Mat, Resistance Band, gentle Bodyweight / Floor workouts
 * - NEVER includes: Dumbbells, Barbells, Cables, Machines, Pull-Up bars, Hanging bars
 */
export function isHomeExercise(exercise: {
  equipment: string;
  category?: string | null;
  name: string;
}): boolean {
  const eq = (exercise.equipment || "").toLowerCase().trim();
  const name = exercise.name.toLowerCase().trim();

  // If equipment is weights, cables, machines, or pull-up/hanging bar: NEVER HOME
  if (
    eq === "barbell" ||
    eq === "cable" ||
    eq === "machine" ||
    eq === "dumbbell" ||
    name.includes("pull-up") ||
    name.includes("hanging") ||
    name.includes("barbell") ||
    name.includes("dumbbell")
  ) {
    return false;
  }

  // Pure home equipment: Yoga Mat, Resistance Band, and gentle floor bodyweight
  if (
    eq === "yoga mat" ||
    eq === "resistance band" ||
    eq === "bodyweight"
  ) {
    return true;
  }

  return false;
}

/**
 * Checks if an exercise is for Gym / Fitness Center:
 * - All weights (Barbell, Dumbbell), Cable machines, Gym machines, Pull-up & Hanging bars
 */
export function isGymExercise(exercise: {
  equipment: string;
  category?: string | null;
  name: string;
}): boolean {
  const eq = (exercise.equipment || "").toLowerCase().trim();
  const name = exercise.name.toLowerCase().trim();

  if (
    eq === "barbell" ||
    eq === "cable" ||
    eq === "machine" ||
    eq === "dumbbell" ||
    name.includes("pull-up") ||
    name.includes("hanging")
  ) {
    return true;
  }

  return false;
}

export type ExerciseEnvironment = "home" | "gym";

export function getExerciseEnvironment(exercise: {
  equipment: string;
  category?: string | null;
  name: string;
}): ExerciseEnvironment {
  if (isHomeExercise(exercise)) return "home";
  return "gym";
}

/**
 * Returns localized exercise details seamlessly matching the selected language!
 */
export function getLocalizedExercise(
  exercise: {
    name: string;
    description?: string | null;
    instructions?: string | null;
    equipment: string;
    category: string;
  },
  lang: Language
): {
  name: string;
  description: string;
  instructions: string;
  equipment: string;
  category: string;
} {
  const cleanKey = exercise.name.trim().toLowerCase();
  const entry = EXERCISE_DATA_TRANSLATIONS[cleanKey];

  const name =
    lang === "vi" && entry
      ? entry.name.vi
      : exercise.name;

  const description =
    lang === "vi" && entry
      ? entry.description.vi
      : (exercise.description || "");

  const instructions =
    lang === "vi" && entry
      ? entry.instructions.vi
      : (exercise.instructions || "");

  const eqEntry = EQUIPMENT_TRANSLATIONS[exercise.equipment];
  const equipment = eqEntry ? eqEntry[lang] : exercise.equipment;

  const catEntry = CATEGORY_TRANSLATIONS[exercise.category];
  const category = catEntry ? catEntry[lang] : exercise.category;

  return {
    name,
    description,
    instructions,
    equipment,
    category,
  };
}
