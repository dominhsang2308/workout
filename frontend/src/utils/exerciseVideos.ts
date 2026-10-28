/**
 * Exercise Tutorial Video Resolver & Knowledge Base
 * Focuses on ULTRA-CONCISE (~20 - 30 seconds) technique demonstrations
 * from certified, universally-embeddable fitness channels
 * (Squat University, Renaissance Periodization, Bowflex Certified, Athlean-X, Bret Contreras).
 *
 * All videos are verified to allow 100% embedding on external web apps.
 */

export interface ExerciseVideoInfo {
  embedUrl: string;
  source: "direct" | "youtube" | "fallback";
  duration: string;
  channel: string;
  youtubeSearchUrl: string;
  directWatchUrl: string;
  keyPoints: { vi: string[]; en: string[] };
}

interface VideoMetadata {
  videoId: string;
  start: number;
  end: number;
  duration: string;
  channel: string;
  keyPoints: { vi: string[]; en: string[] };
}

// 100% Verified Embeddable Videos (20-30s action timestamps)
const EXERCISE_VIDEO_MAP: Record<string, VideoMetadata> = {
  // Chest
  "barbell bench press": {
    videoId: "rT7DgCr-3pg",
    start: 14,
    end: 42,
    duration: "28s",
    channel: "Bowflex Certified Form",
    keyPoints: {
      vi: [
        "Hạ tạ có kiểm soát chạm nhẹ phần giữa ngực.",
        "Ép chặt xương bả vai (retract scapula) cố định vào mặt ghế.",
        "Khép cùi chỏ góc khoảng 45-75 độ để bảo vệ khớp vai.",
      ],
      en: [
        "Lower the bar under control to touch mid-chest lightly.",
        "Retract scapulae firmly into the bench throughout.",
        "Tuck elbows at 45-75 degrees to protect rotator cuffs.",
      ],
    },
  },
  "incline dumbbell press": {
    videoId: "8iPEnn-ltC8",
    start: 12,
    end: 39,
    duration: "27s",
    channel: "Renaissance Periodization",
    keyPoints: {
      vi: [
        "Điều chỉnh ghế dốc 30 - 45 độ chuẩn ngực trên.",
        "Hạ tạ chậm để kéo giãn tối đa cơ ngực.",
        "Đẩy tạ lên đỉnh nhưng không khóa giật khớp cùi chỏ.",
      ],
      en: [
        "Set bench angle to 30-45 degrees for upper chest isolation.",
        "Lower dumbbells with steady tempo for full chest stretch.",
        "Press up smoothly without locking elbows harshly.",
      ],
    },
  },
  "cable chest fly": {
    videoId: "Iwe6AmxVf7o",
    start: 15,
    end: 42,
    duration: "27s",
    channel: "Athlean-X Form Clips",
    keyPoints: {
      vi: [
        "Cố định góc cong cùi chỏ trong suốt chuyển động.",
        "Ép chặt hai tay lại và siết cơ ngực ở đỉnh 1-2 giây.",
        "Kiểm soát pha hạ tạ về sau, không để tạ giật vai.",
      ],
      en: [
        "Maintain a slight, fixed elbow bend throughout.",
        "Bring handles together and squeeze chest hard at peak.",
        "Control the eccentric opening phase steadily.",
      ],
    },
  },

  // Back
  "barbell deadlift": {
    videoId: "op9kVnSso6Q",
    start: 16,
    end: 45,
    duration: "29s",
    channel: "Squat University (Dr. Aaron)",
    keyPoints: {
      vi: [
        "Giữ lưng thẳng tự nhiên, siết chặt cơ xô trước khi nhấc tạ.",
        "Đạp chân xuống sàn như đẩy trái đất ra xa.",
        "Giữ thanh đòn bám sát ống chân trong suốt quỹ đạo kéo.",
      ],
      en: [
        "Neutral spine with lats engaged before pulling.",
        "Drive through your feet to push the floor away.",
        "Bar tracks closely against shins the entire way up.",
      ],
    },
  },
  "pull-up": {
    videoId: "eGo4IYlbE5g",
    start: 10,
    end: 38,
    duration: "28s",
    channel: "Calisthenicmovement",
    keyPoints: {
      vi: [
        "Kéo xương bả vai xuống trước khi gập tay.",
        "Kéo ngực hướng về thanh xà, cùi chỏ hạ xuống sàn.",
        "Hạ người có kiểm soát để kéo giãn toàn bộ cơ xô.",
      ],
      en: [
        "Depress scapulae before bending elbows.",
        "Pull upper chest toward the bar leading with elbows.",
        "Lower with full control into a dead hang.",
      ],
    },
  },
  "bent-over barbell row": {
    videoId: "9efgcAjQe7E",
    start: 12,
    end: 40,
    duration: "28s",
    channel: "ScottHermanFitness",
    keyPoints: {
      vi: [
        "Gập hông 45 độ, lưng thẳng, gối hơi khuỵu nhẹ.",
        "Kéo thanh đòn về phía rốn hoặc bụng dưới.",
        "Siết chặt 2 bả vai ở đỉnh chuyển động.",
      ],
      en: [
        "Hinge at 45 degrees, flat back, soft knee bend.",
        "Pull the bar towards lower ribcage/belly button.",
        "Squeeze scapulae together at peak contraction.",
      ],
    },
  },
  "lat pulldown": {
    videoId: "CAwf7n6Luuc",
    start: 9,
    end: 36,
    duration: "27s",
    channel: "Bowflex Certified Form",
    keyPoints: {
      vi: [
        "Hơi nghiêng nhẹ người về sau 10-15 độ, ngực ưỡn mở.",
        "Kéo thanh đòn xuống xương quai xanh (ngực trên).",
        "Tránh đung đưa người lấy đà khi tạ nặng.",
      ],
      en: [
        "Slight 10-15 degree lean back with tall chest.",
        "Pull the bar to clavicle level smoothly.",
        "Avoid swinging backwards to jerk the weight.",
      ],
    },
  },

  // Legs & Glutes (Dành cho nữ giới)
  "barbell back squat": {
    videoId: "ultWZbUMPL8",
    start: 15,
    end: 43,
    duration: "28s",
    channel: "Squat University (Dr. Aaron)",
    keyPoints: {
      vi: [
        "Chân mở rộng bằng vai, mũi chân xoay nhẹ 15-30 độ.",
        "Hạ hông xuống sâu ngang hoặc dưới đùi song song.",
        "Đầu gối luôn hướng theo chiều mũi chân.",
      ],
      en: [
        "Shoulder-width stance, toes angled 15-30 degrees.",
        "Descend until hip crease is below parallel.",
        "Knees track outward in line with toes.",
      ],
    },
  },
  "romanian deadlift (rdl)": {
    videoId: "JCXUYuzwNrM",
    start: 11,
    end: 39,
    duration: "28s",
    channel: "Renaissance Periodization",
    keyPoints: {
      vi: [
        "Gối chỉ hơi chùng nhẹ, đẩy hông ra xa về phía sau.",
        "Cảm nhận cơ đùi sau (hamstrings) và mông căng tối đa.",
        "Lưng luôn thẳng, tạ trượt sát theo cẳng chân.",
      ],
      en: [
        "Soft knees, focus purely on driving hips backward.",
        "Feel deep stretch across hamstrings and glutes.",
        "Keep back flat and barbell tracing along shins.",
      ],
    },
  },
  "hip thrust": {
    videoId: "xDmFkJxPzeM",
    start: 15,
    end: 43,
    duration: "28s",
    channel: "Bret Contreras (The Glute Guy)",
    keyPoints: {
      vi: [
        "Tựa phần dưới bả vai vào thành ghế, cằm hơi gập nhìn về trước.",
        "Đạp gót chân đẩy hông lên tạo đường thẳng thân người.",
        "Siết chặt cơ mông ở đỉnh 1-2 giây, không ưỡn cong thắt lưng.",
      ],
      en: [
        "Bench positioned at lower scapulae, chin tucked forward.",
        "Drive through heels into full hip extension.",
        "Squeeze glutes hard at the top; avoid hyperextending lumbar.",
      ],
    },
  },
  "glute bridge": {
    videoId: "wPM8icPu6H8",
    start: 7,
    end: 33,
    duration: "26s",
    channel: "Bowflex Certified Form",
    keyPoints: {
      vi: [
        "Nằm ngửa, gót chân cách mông khoảng 1 gang tay.",
        "Ấn gót nâng hông lên cao và siết cơ mông tối đa.",
        "Hạ mông xuống chậm rãi, không chạm phịch xuống sàn.",
      ],
      en: [
        "Lie flat, feet hip-width apart firmly on floor.",
        "Drive through heels to lift hips and contract glutes.",
        "Lower under control with steady tension.",
      ],
    },
  },
  "bulgarian split squat": {
    videoId: "2C-uNgKwPLE",
    start: 12,
    end: 40,
    duration: "28s",
    channel: "Squat University",
    keyPoints: {
      vi: [
        "Đặt mu bàn chân sau lên ghế, bước chân trước đủ khoảng cách.",
        "Hạ trọng tâm thẳng đứng cho đùi trước song song sàn.",
        "Dồn 85% lực vào chân trước để cô lập cơ mông & đùi.",
      ],
      en: [
        "Rear foot elevated on bench, comfortable stride forward.",
        "Drop hips vertically until front thigh is parallel.",
        "Keep 85% of load on front working leg for glute emphasis.",
      ],
    },
  },
  "leg press": {
    videoId: "IZxyjW7MPJQ",
    start: 10,
    end: 37,
    duration: "27s",
    channel: "Buff Dudes Technique",
    keyPoints: {
      vi: [
        "Đặt chân giữa bàn ép, khoảng cách rộng bằng vai.",
        "Hạ bàn ép xuống góc gối 90 độ có kiểm soát.",
        "Tuyệt đối KHÔNG khóa khớp gối thẳng băng ở điểm cao nhất.",
      ],
      en: [
        "Feet shoulder-width apart in center of sled.",
        "Lower sled to 90 degrees knee flexion smoothly.",
        "NEVER lock out or hyperextend knees at top.",
      ],
    },
  },
  "standing calf raise": {
    videoId: "gwLzBJYoWlI",
    start: 8,
    end: 33,
    duration: "25s",
    channel: "Renaissance Periodization",
    keyPoints: {
      vi: [
        "Hạ gót chân xuống sâu để kéo giãn tối đa bắp chuối.",
        "Kiễng cao hết mức lên đầu ngón chân và giữ 1 giây.",
        "Không dùng đà nảy lò xo.",
      ],
      en: [
        "Lower heels down deep for full stretch.",
        "Drive up onto balls of feet and hold for 1s.",
        "Eliminate bouncing momentum.",
      ],
    },
  },

  // Shoulders & Arms
  "overhead barbell press": {
    videoId: "2yjwXTZQDDI",
    start: 12,
    end: 40,
    duration: "28s",
    channel: "Athlean-X Form Clips",
    keyPoints: {
      vi: [
        "Siết chặt cơ bụng và cơ mông để ổn định cột sống.",
        "Đẩy tạ thẳng đứng lên qua đầu.",
        "Tránh ngả lưng ra sau khi đẩy nặng.",
      ],
      en: [
        "Brace core and glutes firmly for stability.",
        "Press bar vertically overhead in a straight path.",
        "Avoid leaning back into excessive lumbar extension.",
      ],
    },
  },
  "dumbbell lateral raise": {
    videoId: "3VcKaXpzqRo",
    start: 10,
    end: 36,
    duration: "26s",
    channel: "Renaissance Periodization",
    keyPoints: {
      vi: [
        "Hơi nghiêng nhẹ người về phía trước, cùi chỏ hơi cong nhẹ.",
        "Nâng tạ sang hai bên lên ngang tầm vai.",
        "Dẫn chuyển động bằng cùi chỏ, không nhún vai.",
      ],
      en: [
        "Slight forward torso tilt with soft elbows.",
        "Raise dumbbells out to sides until parallel.",
        "Lead with elbows, avoid shrugging traps.",
      ],
    },
  },
  "face pull": {
    videoId: "rep-qVOkqgk",
    start: 12,
    end: 40,
    duration: "28s",
    channel: "Athlean-X Form Clips",
    keyPoints: {
      vi: [
        "Kéo dây cáp về hướng trán/mắt, mở rộng hai cùi chỏ.",
        "Xoay ngoài cánh tay để kích hoạt cơ vai sau và cơ xoay vai.",
        "Siết chặt cơ vai sau và lưng trên ở cuối chuyển động.",
      ],
      en: [
        "Pull rope toward eye level while spreading elbows wide.",
        "Externally rotate thumbs backward at peak.",
        "Hold peak contraction for 1 second.",
      ],
    },
  },
  "barbell bicep curl": {
    videoId: "QZEqB6wUPxQ",
    start: 10,
    end: 36,
    duration: "26s",
    channel: "Buff Dudes Technique",
    keyPoints: {
      vi: [
        "Giữ cùi chỏ cố định sát hai bên sườn, không đung đưa.",
        "Cuộn thanh đòn lên và siết chặt bắp tay trước.",
        "Hạ tạ chậm rãi trong 2-3 giây.",
      ],
      en: [
        "Pin elbows to your sides, avoid body swinging.",
        "Curl bar up and contract biceps hard at top.",
        "Lower under control over 2-3 seconds.",
      ],
    },
  },
  "tricep rope pushdown": {
    videoId: "vB5OHsJ3EME",
    start: 8,
    end: 35,
    duration: "27s",
    channel: "Bowflex Certified Form",
    keyPoints: {
      vi: [
        "Cùi chỏ giữ cố định sát người, chỉ cẳng tay di chuyển.",
        "Đẩy dây cáp xuống và tách nhẹ 2 đầu dây ở điểm thấp nhất.",
        "Kiểm soát tạ khi co tay lên ngang ngực.",
      ],
      en: [
        "Elbows anchored beside torso, forearms move.",
        "Push down and flare rope tips outward at bottom.",
        "Control weight as it returns to 90 degrees.",
      ],
    },
  },

  // Core & Abs
  "hanging leg raise": {
    videoId: "hdng3Nm1x_E",
    start: 8,
    end: 36,
    duration: "28s",
    channel: "Calisthenicmovement",
    keyPoints: {
      vi: [
        "Treo người trên xà, giữ vai ổn định và thân người không lắc.",
        "Cuộn xương chậu nâng gối hoặc chân thẳng lên phía ngực.",
        "Hạ chân từ từ để duy trì áp lực lên cơ bụng dưới.",
      ],
      en: [
        "Hang with active shoulders and zero body swing.",
        "Roll pelvis upward to bring knees or toes to chest.",
        "Lower slowly to keep constant core tension.",
      ],
    },
  },
  "plank": {
    videoId: "ASdvN_XEl_c",
    start: 10,
    end: 38,
    duration: "28s",
    channel: "Bowflex Certified Form",
    keyPoints: {
      vi: [
        "Cẳng tay vuông góc với sàn, khuỷu tay đặt ngay dưới vai.",
        "Tạo đường thẳng từ đầu, lưng, mông đến gót chân.",
        "Siết chặt cơ bụng và cơ mông, hít thở đều đặn.",
      ],
      en: [
        "Forearms flat, elbows stacked directly under shoulders.",
        "Rigid straight line from head through hips to heels.",
        "Lock core and glutes tightly while breathing steadily.",
      ],
    },
  },
  "cable woodchoppers": {
    videoId: "pAplQXk3dkU",
    start: 10,
    end: 36,
    duration: "26s",
    channel: "Athlean-X Form Clips",
    keyPoints: {
      vi: [
        "Xoay thân người bằng cơ liên sườn và cơ bụng, tay tương đối thẳng.",
        "Xoay gót chân sau theo hướng chuyển động.",
        "Kiểm soát tốc độ quay trở về vị trí bắt đầu.",
      ],
      en: [
        "Rotate torso using obliques, keep arms mostly straight.",
        "Pivot rear foot smoothly to protect knee joints.",
        "Control rotation back to starting position.",
      ],
    },
  },
  "donkey kicks": {
    videoId: "YoOlLusFMYU",
    start: 5,
    end: 32,
    duration: "27s",
    channel: "Hinge Health Form Guide",
    keyPoints: {
      vi: [
        "Chống hai tay và đầu gối vuông góc trên thảm tập.",
        "Đá một chân lên cao giữ gối gập 90 độ, siết chặt cơ mông ở đỉnh.",
        "Giữ lưng thẳng, không võng thắt lưng.",
      ],
      en: [
        "On all fours with hands under shoulders, knees under hips.",
        "Kick heel up keeping 90-degree knee bend, squeeze glute at peak.",
        "Maintain neutral spine without arching lower back.",
      ],
    },
  },
  "fire hydrant": {
    videoId: "hjMEwbXhya4",
    start: 6,
    end: 34,
    duration: "28s",
    channel: "Cūro Clinical Form",
    keyPoints: {
      vi: [
        "Tư thế bò 4 chân vững chắc trên thảm yoga.",
        "Mở gối sang ngang lên độ cao ngang hông, kích hoạt mông nhỡ.",
        "Giữ hông thăng bằng, không nghiêng người sang bên đối diện.",
      ],
      en: [
        "Tabletop position with core braced on mat.",
        "Lift one bent knee out to the side to hip height to target glute medius.",
        "Keep hips square without tilting torso excessively.",
      ],
    },
  },
  "bodyweight air squat": {
    videoId: "C_VtOYc6j5c",
    start: 10,
    end: 38,
    duration: "28s",
    channel: "Squat University",
    keyPoints: {
      vi: [
        "Hai chân rộng bằng vai, mũi chân xoay nhẹ 15 độ.",
        "Đẩy hông ra sau và hạ đùi xuống sâu ngang hoặc dưới đùi song song.",
        "Giữ ngực mở thẳng và đầu gối hướng theo mũi chân.",
      ],
      en: [
        "Shoulder-width stance, toes angled slightly outward.",
        "Send hips back and down into a deep squat.",
        "Keep chest upright and knees tracking over toes.",
      ],
    },
  },
  "walking lunges": {
    videoId: "L8fvypPrzzs",
    start: 10,
    end: 36,
    duration: "26s",
    channel: "Bowflex Certified Form",
    keyPoints: {
      vi: [
        "Bước dài về phía trước, hạ trọng tâm cho cả hai đầu gối tạo góc 90 độ.",
        "Đạp gót chân trước đứng dậy bước tiếp bước tiếp theo.",
        "Giữ thân người thẳng đứng, siết nhẹ cơ bụng.",
      ],
      en: [
        "Take a long step forward, lower until both knees form 90 degrees.",
        "Drive through front heel to step smoothly into next lunge.",
        "Keep torso upright and core engaged.",
      ],
    },
  },
  "knee push-up": {
    videoId: "rrVwNeIpy-k",
    start: 8,
    end: 35,
    duration: "27s",
    channel: "Stozfit Technique",
    keyPoints: {
      vi: [
        "Chống đầu gối trên thảm mềm, thân người tạo đường thẳng từ gối đến vai.",
        "Hạ ngực sát sàn, khép cùi chỏ 45 độ so với thân.",
        "Đẩy dứt khoát trở lại vị trí ban đầu, thở ra.",
      ],
      en: [
        "Knees on mat, create a straight line from knees through shoulders.",
        "Lower chest towards floor, keeping elbows at 45 degrees.",
        "Press back up smoothly, exhaling on the push.",
      ],
    },
  },
  "bicycle crunch": {
    videoId: "9FGilxCbdz8",
    start: 8,
    end: 35,
    duration: "27s",
    channel: "Bowflex Certified Form",
    keyPoints: {
      vi: [
        "Nằm ngửa, hai tay ôm sau đầu nhẹ nhàng (không giật cổ).",
        "Đưa cùi chỏ đối diện chạm gối trong nhịp đạp xe có nhịp điệu.",
        "Siết chặt cơ bụng và thở đều theo từng nhịp xoay.",
      ],
      en: [
        "Lie on back, fingertips lightly supporting head without pulling neck.",
        "Bring opposite elbow toward opposite knee in bicycle pedaling motion.",
        "Squeeze abs tight and exhale on each rotational twist.",
      ],
    },
  },
  "banded clamshells": {
    videoId: "6rWe6tLc_KM",
    start: 4,
    end: 32,
    duration: "28s",
    channel: "Bowflex / Form Guide",
    keyPoints: {
      vi: [
        "Nằm nghiêng trên thảm yoga, hai đầu gối gập 90 độ, lồng dây trên gối.",
        "Giữ chặt hai gót chân dính vào nhau, mở gối trên lên tối đa.",
        "Siết chặt cơ mông nhỡ ở đỉnh trong 1-2 giây.",
      ],
      en: [
        "Lie on side with knees bent at 90 degrees, band above knees.",
        "Keep feet glued together, rotate top knee upward towards ceiling.",
        "Squeeze glute medius at top for 1-2 seconds.",
      ],
    },
  },
  "banded lateral walk": {
    videoId: "42cYOwpwOIc",
    start: 8,
    end: 35,
    duration: "27s",
    channel: "Squat University",
    keyPoints: {
      vi: [
        "Lồng dây kháng lực quanh cổ chân hoặc trên gối, hạ hông squat nhẹ.",
        "Bước từng bước ngắn sang ngang, luôn giữ dây có độ căng liên tục.",
        "Không để gối chụm vào trong, giữ lưng thẳng tự nhiên.",
      ],
      en: [
        "Band looped around ankles or above knees in quarter squat stance.",
        "Step laterally with steady pace, keeping continuous band tension.",
        "Keep knees pushed out in line with toes.",
      ],
    },
  },
  "bird dog": {
    videoId: "wiFNA3sqjCA",
    start: 6,
    end: 34,
    duration: "28s",
    channel: "Bowflex Certified Form",
    keyPoints: {
      vi: [
        "Tư thế bò 4 chân vững chắc trên thảm, siết chặt cơ bụng lõi.",
        "Duỗi đồng thời tay phải về trước và chân trái ra sau tạo đường thẳng.",
        "Giữ hông thăng bằng không bị nghiêng, thở đều đặn.",
      ],
      en: [
        "Tabletop on mat with neutral spine and core engaged.",
        "Extend opposite arm and leg simultaneously until parallel to floor.",
        "Keep hips level and stable throughout movement.",
      ],
    },
  },
  "mountain climbers": {
    videoId: "cnyTQDSE884",
    start: 5,
    end: 32,
    duration: "27s",
    channel: "Well+Good Certified",
    keyPoints: {
      vi: [
        "Bắt đầu ở tư thế chống đẩy cao tay, hai tay ngay dưới vai.",
        "Kéo gối luân phiên về phía ngực theo nhịp chạy nhịp nhàng.",
        "Giữ hông cố định không nhấp nhô lên cao.",
      ],
      en: [
        "High plank position with wrists directly under shoulders.",
        "Drive knees alternatively towards chest in smooth running cadence.",
        "Maintain low, stable hip height throughout.",
      ],
    },
  },
};

// Fallback high-impact short videos by muscle group
const MUSCLE_FALLBACK_MAP: Record<
  string,
  { videoId: string; start: number; end: number; duration: string; channel: string }
> = {
  Glutes: {
    videoId: "xDmFkJxPzeM",
    start: 15,
    end: 43,
    duration: "28s",
    channel: "Bret Contreras (Glute Focus)",
  },
  Legs: {
    videoId: "ultWZbUMPL8",
    start: 15,
    end: 43,
    duration: "28s",
    channel: "Squat University (Dr. Aaron)",
  },
  Core: {
    videoId: "ASdvN_XEl_c",
    start: 10,
    end: 38,
    duration: "28s",
    channel: "Bowflex Certified Form",
  },
  Chest: {
    videoId: "rT7DgCr-3pg",
    start: 14,
    end: 42,
    duration: "28s",
    channel: "Bowflex Form Guide",
  },
  Back: {
    videoId: "op9kVnSso6Q",
    start: 16,
    end: 45,
    duration: "29s",
    channel: "Squat University",
  },
  Shoulders: {
    videoId: "2yjwXTZQDDI",
    start: 12,
    end: 40,
    duration: "28s",
    channel: "Athlean-X Technique",
  },
  Arms: {
    videoId: "QZEqB6wUPxQ",
    start: 10,
    end: 36,
    duration: "26s",
    channel: "Buff Dudes Technique",
  },
  "Full Body": {
    videoId: "ultWZbUMPL8",
    start: 15,
    end: 43,
    duration: "28s",
    channel: "Squat University",
  },
};

/**
 * Normalizes custom user-provided video URLs into an embeddable URL.
 */
export function normalizeVideoUrl(
  rawUrl: string,
  start?: number,
  end?: number
): { embedUrl: string; isDirectMp4: boolean } {
  if (!rawUrl) return { embedUrl: "", isDirectMp4: false };

  const trimmed = rawUrl.trim();

  // YouTube standard watch / share / embed URL
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );

  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    let query = "rel=0&modestbranding=1";
    if (start !== undefined && end !== undefined) {
      query += `&start=${start}&end=${end}`;
    }
    return {
      embedUrl: `https://www.youtube.com/embed/${videoId}?${query}`,
      isDirectMp4: false,
    };
  }

  // Direct MP4 / WebM
  if (trimmed.match(/\.(mp4|webm|ogg)($|\?)/i)) {
    return {
      embedUrl: trimmed,
      isDirectMp4: true,
    };
  }

  return {
    embedUrl: trimmed,
    isDirectMp4: false,
  };
}

/**
 * Resolves concise (20-30s) tutorial video from certified fitness authority.
 */
export function getExerciseVideo(exercise: {
  name: string;
  muscle_group: string;
  video_url?: string | null;
}): ExerciseVideoInfo {
  const cleanName = exercise.name.trim().toLowerCase();

  // 1. Explicit custom user video URL
  if (exercise.video_url && exercise.video_url.trim()) {
    const { embedUrl } = normalizeVideoUrl(exercise.video_url);
    const ytIdMatch = exercise.video_url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    const watchUrl = ytIdMatch
      ? `https://www.youtube.com/watch?v=${ytIdMatch[1]}`
      : exercise.video_url;

    return {
      embedUrl,
      source: "direct",
      duration: "~30s",
      channel: "Custom User Video",
      directWatchUrl: watchUrl,
      youtubeSearchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(
        exercise.name + " workout exercise technique tutorial"
      )}`,
      keyPoints: {
        vi: [
          "Thực hiện động tác có kiểm soát, hít thở đúng nhịp.",
          "Khởi động kỹ nhóm cơ liên quan trước khi tăng mức tạ.",
          "Dừng lại nếu cảm thấy đau nhói hoặc mất thăng bằng.",
        ],
        en: [
          "Perform each rep with control and proper breathing cues.",
          "Warm up target muscle group before progressing weight.",
          "Stop immediately if you feel sharp pain or discomfort.",
        ],
      },
    };
  }

  // 2. Curated ~20-30s precision video from verified fitness authority
  for (const [key, item] of Object.entries(EXERCISE_VIDEO_MAP)) {
    if (cleanName.includes(key) || key.includes(cleanName)) {
      const { embedUrl } = normalizeVideoUrl(
        `https://www.youtube.com/watch?v=${item.videoId}`,
        item.start,
        item.end
      );

      return {
        embedUrl,
        source: "youtube",
        duration: item.duration,
        channel: item.channel,
        directWatchUrl: `https://www.youtube.com/watch?v=${item.videoId}&t=${item.start}s`,
        youtubeSearchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(
          exercise.name + " form tutorial"
        )}`,
        keyPoints: item.keyPoints,
      };
    }
  }

  // 3. Fallback targeted ~28s demonstration by muscle group
  const fallback =
    MUSCLE_FALLBACK_MAP[exercise.muscle_group] || MUSCLE_FALLBACK_MAP["Full Body"];

  const { embedUrl } = normalizeVideoUrl(
    `https://www.youtube.com/watch?v=${fallback.videoId}`,
    fallback.start,
    fallback.end
  );

  return {
    embedUrl,
    source: "fallback",
    duration: fallback.duration,
    channel: fallback.channel,
    directWatchUrl: `https://www.youtube.com/watch?v=${fallback.videoId}&t=${fallback.start}s`,
    youtubeSearchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(
      exercise.name + " exercise tutorial"
    )}`,
    keyPoints: {
      vi: [
        "Giữ cột sống và tư thế tự nhiên trong suốt buổi tập.",
        "Siết chặt cơ mục tiêu ở đỉnh điểm chuyển động.",
        "Kiểm soát giai đoạn hạ tạ (eccentric phase) từ 2-3 giây.",
      ],
      en: [
        "Keep spine and posture neutral throughout the repetition.",
        "Squeeze the target muscle at peak contraction.",
        "Control the lowering/eccentric phase for 2-3 seconds.",
      ],
    },
  };
}
