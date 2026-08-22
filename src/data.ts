import type { Client, Video } from './types';

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Doston aka',
    specialty: 'Kardiolog',
    reelsTarget: 12,
    youtubeTarget: 0,
  },
  {
    id: 'c2',
    name: 'Elyor aka',
    specialty: 'Nevropatolog',
    reelsTarget: 12,
    youtubeTarget: 4,
  },
  {
    id: 'c3',
    name: 'Javohir aka',
    specialty: 'Urolog',
    reelsTarget: 8,
    youtubeTarget: 4,
  },
  {
    id: 'c4',
    name: 'Jafar aka',
    specialty: 'Dermatolog',
    reelsTarget: 0,
    youtubeTarget: 4,
  },
];

// Helper to construct dates relative to today
const getRelativeDateStr = (daysFromToday: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().split('T')[0];
};

// Generates 4 weeks of schedule for Doston aka based on user request:
// Tuesday — Reel published, Monday — delivery deadline
// Thursday — Reel published, Wednesday — delivery deadline
// Saturday — Reel published, Friday — delivery deadline
const generateDostonSchedule = (): Video[] => {
  const list: Video[] = [];
  const startDay = new Date();
  // Adjust back to 2 weeks ago to pre-populate some history and upcoming ones
  startDay.setDate(startDay.getDate() - 14);

  let idCounter = 1;

  for (let i = 0; i < 30; i++) {
    const current = new Date(startDay);
    current.setDate(startDay.getDate() + i);
    const dayOfWeek = current.getDay(); // 0 is Sunday, 2 is Tue, 4 is Thu, 6 is Sat

    if (dayOfWeek === 2 || dayOfWeek === 4 || dayOfWeek === 6) {
      const pubDate = current.toISOString().split('T')[0];
      const deadlineDate = new Date(current);
      deadlineDate.setDate(current.getDate() - 1);
      const deliveryDate = deadlineDate.toISOString().split('T')[0];

      // Determine a status based on how old it is relative to today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      current.setHours(0, 0, 0, 0);

      let status: any = 'Material Not Received';
      let rawLink = 'https://drive.google.com/drive/folders/doston_raw_reel_' + idCounter;
      let finalLink = '';
      let publishedLink = '';

      if (current.getTime() < today.getTime() - 86400000 * 2) {
        status = 'Published';
        finalLink = 'https://frame.io/doston_final_reel_' + idCounter;
        publishedLink = 'https://instagram.com/reel/doston_reel_' + idCounter;
      } else if (current.getTime() === today.getTime() - 86400000) {
        status = 'Scheduled';
        finalLink = 'https://frame.io/doston_final_reel_' + idCounter;
      } else if (current.getTime() === today.getTime()) {
        status = 'Ready';
        finalLink = 'https://frame.io/doston_final_reel_' + idCounter;
      } else if (current.getTime() > today.getTime()) {
        status = idCounter % 2 === 0 ? 'In Editing' : 'Material Received';
      }

      list.push({
        id: `doston-v-${idCounter}`,
        clientId: 'c1',
        clientName: 'Doston aka',
        title: `Kardiologiya Maslahatlari — Qism ${idCounter}`,
        platform: 'Instagram Reels',
        rawMaterialLink: rawLink,
        deliveryDeadline: deliveryDate,
        publishDate: pubDate,
        finalVideoLink: finalLink,
        publishedPostLink: publishedLink,
        notes: `Mavzu: Qon bosimi va yurak salomatligi. Visual dynamic b-roll talab qilinadi.`,
        priority: idCounter % 3 === 0 ? 'High' : 'Medium',
        status,
        safetyBufferDays: 1,
      });
      idCounter++;
    }
  }
  return list;
};

export const getInitialVideos = (): Video[] => {
  const dostonVideos = generateDostonSchedule();

  const otherVideos: Video[] = [
    // Elyor aka - Nevropatolog
    {
      id: 'elyor-v-1',
      clientId: 'c2',
      clientName: 'Elyor aka',
      title: 'Stressni 5 daqiqada yengish yoʻllari',
      platform: 'YouTube Shorts',
      rawMaterialLink: 'https://drive.google.com/drive/folders/elyor_stress_raw',
      deliveryDeadline: getRelativeDateStr(-1),
      publishDate: getRelativeDateStr(0), // Today
      finalVideoLink: 'https://frame.io/elyor_stress_final',
      publishedPostLink: '',
      notes: 'Boshida qiziqarli hook va matnlar boʻlsin.',
      priority: 'Urgent',
      status: 'Ready',
      safetyBufferDays: 1,
    },
    {
      id: 'elyor-v-2',
      clientId: 'c2',
      clientName: 'Elyor aka',
      title: 'Uyqusizlik sabablari va davolash',
      platform: 'YouTube',
      rawMaterialLink: 'https://drive.google.com/drive/folders/elyor_insomnia_raw',
      deliveryDeadline: getRelativeDateStr(2),
      publishDate: getRelativeDateStr(3),
      finalVideoLink: '',
      publishedPostLink: '',
      notes: 'Uzoq maʼruzali video, fon musiqasini pastroq qoʻying.',
      priority: 'High',
      status: 'In Editing',
      safetyBufferDays: 1,
    },
    // Javohir aka - Urolog
    {
      id: 'javohir-v-1',
      clientId: 'c3',
      clientName: 'Javohir aka',
      title: 'Erkaklar salomatligi uchun foydali taomlar',
      platform: 'Instagram Reels',
      rawMaterialLink: '',
      deliveryDeadline: getRelativeDateStr(0), // Today
      publishDate: getRelativeDateStr(1), // Tomorrow
      finalVideoLink: '',
      publishedPostLink: '',
      notes: 'Kutilyapti: Raw material hali Telegramdan yuborilmadi.',
      priority: 'High',
      status: 'Material Not Received',
      safetyBufferDays: 1,
    },
    {
      id: 'javohir-v-2',
      clientId: 'c3',
      clientName: 'Javohir aka',
      title: 'Buyrak toshlaridan qanday saqlanish mumkin?',
      platform: 'YouTube',
      rawMaterialLink: 'https://drive.google.com/drive/folders/javohir_kidney_raw',
      deliveryDeadline: getRelativeDateStr(1),
      publishDate: getRelativeDateStr(2),
      finalVideoLink: 'https://frame.io/javohir_kidney_edit1',
      publishedPostLink: '',
      notes: 'Tuzatish: Ranglar juda yorqin boʻlib ketgan, rang korreksiyasini toʻgʻrilang.',
      priority: 'Medium',
      status: 'Revision',
      safetyBufferDays: 1,
    },
    // Jafar aka - Dermatolog
    {
      id: 'jafar-v-1',
      clientId: 'c4',
      clientName: 'Jafar aka',
      title: 'Husnbuzarlar (Akne) haqida 5 ta xato tushuncha',
      platform: 'YouTube',
      rawMaterialLink: 'https://drive.google.com/drive/folders/jafar_acne_raw',
      deliveryDeadline: getRelativeDateStr(-2),
      publishDate: getRelativeDateStr(-1),
      finalVideoLink: 'https://frame.io/jafar_acne_final',
      publishedPostLink: 'https://youtube.com/watch?v=jafar_acne_video',
      notes: 'Zoʻr chiqdi, tomoshabinlar faol.',
      priority: 'Low',
      status: 'Published',
      safetyBufferDays: 1,
    },
    {
      id: 'jafar-v-2',
      clientId: 'c4',
      clientName: 'Jafar aka',
      title: 'Quruq teri uchun parvarish tartibi',
      platform: 'YouTube',
      rawMaterialLink: '',
      deliveryDeadline: getRelativeDateStr(4),
      publishDate: getRelativeDateStr(5),
      finalVideoLink: '',
      publishedPostLink: '',
      notes: 'Cancelled video test case.',
      priority: 'Low',
      status: 'Cancelled',
      safetyBufferDays: 1,
    }
  ];

  return [...dostonVideos, ...otherVideos];
};
