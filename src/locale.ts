export type Language = 'en' | 'ru' | 'uz';

export const translations = {
  en: {
    // Sidebar
    dashboard: 'Dashboard',
    weeklyPlanner: 'Weekly Planner',
    calendar: 'Calendar',
    videos: 'Videos',
    clients: 'Clients',
    analytics: 'Analytics',
    settings: 'Settings',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    language: 'Language',

    // General / Buttons
    newVideo: 'New Video',
    cancel: 'Cancel',
    save: 'Save Details',
    edit: 'Edit',
    delete: 'Delete',
    saveBtn: 'Save',
    activeClients: 'Active Clients',

    // Dashboard View
    dashboardTitle: 'Dashboard',
    activeVideos: 'Active Videos',
    inEditing: 'In Editing',
    dueToday: 'Due Today',
    publishingToday: 'Publishing Today',
    overdueVideos: 'Overdue Videos',
    cancelled: 'Cancelled',
    smartAlerts: 'Smart Alerts',
    todaysTasks: "Today's Video Tasks",
    noTasks: 'No videos scheduled for delivery or publishing today. Nice work!',
    overdueDesc: 'Passed deadline & not finished',
    atRiskDesc: 'Publish tomorrow but not ready',
    urgentDesc: 'Deadline is today',
    readyPublishDesc: 'Ready and publishing today',

    // Alerts
    alertOverdue: 'Overdue',
    alertAtRisk: 'At Risk',
    alertUrgent: 'Urgent',
    alertReadyPublish: 'Ready to Publish',

    // Weekly View
    weeklySchedule: 'Weekly Schedule',
    weekOf: 'Week of',
    prevWeek: '← Previous Week',
    nextWeek: 'Next Week →',
    dropHere: 'Drop Here',
    dueEditing: 'Due/Editing',
    publishing: 'Publishing',

    // Calendar View
    monthlyPlanner: 'Monthly Planner',
    prevMonth: '← Prev Month',
    nextMonth: 'Next Month →',

    // Videos View
    searchPlaceholder: 'Search videos, client, notes...',
    filterClient: 'All Clients',
    filterPlatform: 'All Platforms',
    filterStatus: 'Active Videos',
    filterPriority: 'All Priorities',
    noVideos: 'No videos found matching the filters.',
    tableClient: 'Client',
    tableTitle: 'Video Title',
    tablePlatform: 'Platform',
    tableDeadline: 'Delivery Deadline',
    tablePublish: 'Publish Date',
    tableStatus: 'Status',
    tablePriority: 'Priority',
    tableActions: 'Action Links',

    // Status Options
    statusNotReceived: 'Material Not Received',
    statusReceived: 'Material Received',
    statusEditing: 'In Editing',
    statusRevision: 'Revision',
    statusReady: 'Ready',
    statusScheduled: 'Scheduled',
    statusPublished: 'Published',
    statusCancelled: 'Cancelled',

    // Clients View
    clientsTitle: 'Client Workflow Directories',
    addClient: 'Add Client',
    setTarget: 'Set Target',
    reelsTarget: 'Reels Target',
    ytTarget: 'YouTube Target',
    planned: 'Planned',
    targetCompletion: 'Target Completion',
    noTargets: 'No targets set',
    addNewClientTitle: 'Add New Client Niche',
    registerClient: 'Register Client',

    // Analytics View
    prodRate: 'Production Rate',
    ofPlanned: 'Of planned videos published',
    pipeline: 'Videos in pipeline',
    publishedCount: 'Published Videos',
    allTimePub: 'All-time published content',
    platformBreakdown: 'Platform Breakdown',

    // Settings View
    sysSettings: 'System Settings',
    globalPlanning: 'Global Planning Logic',
    planningDesc: 'Configure default buffer between publication and delivery deadline.',
    safetyBufferLabel: 'Default Safety Buffer (Days)',
    registeredClients: 'Registered Clients',
    sameDay: 'Same Day (0 days)',
    oneDay: '1 Day (Default)',
    twoDays: '2 Days',
    threeDays: '3 Days',

    // Modal
    editDetails: 'Edit Video Details',
    addDetails: 'Add New Video',
    clientLabel: 'Client *',
    platformLabel: 'Platform *',
    videoTitleLabel: 'Video Title *',
    safetyBuffer: 'Safety Buffer',
    publishDateLabel: 'Publish Date *',
    deliveryDeadlineLabel: 'Delivery Deadline *',
    rawLabel: 'Raw Material Link (Drive, Frame.io, Telegram etc.)',
    finalLabel: 'Final Video Link',
    publishedLabel: 'Published Post Link',
    notesLabel: 'Notes',
    
    // Dialog
    confirmDelete: 'Are you sure you want to delete this client? This will also delete all of their planned videos.'
  },
  ru: {
    // Sidebar
    dashboard: 'Дашборд',
    weeklyPlanner: 'Еженедельник',
    calendar: 'Календарь',
    videos: 'Видео',
    clients: 'Клиенты',
    analytics: 'Аналитика',
    settings: 'Настройки',
    lightMode: 'Светлая тема',
    darkMode: 'Темная тема',
    language: 'Язык',

    // General / Buttons
    newVideo: 'Новое видео',
    cancel: 'Отмена',
    save: 'Сохранить детали',
    edit: 'Редактировать',
    delete: 'Удалить',
    saveBtn: 'Сохранить',
    activeClients: 'Активные клиенты',

    // Dashboard View
    dashboardTitle: 'Дашборд',
    activeVideos: 'Активные видео',
    inEditing: 'В монтаже',
    dueToday: 'Сдача сегодня',
    publishingToday: 'Публикация сегодня',
    overdueVideos: 'Просроченные',
    cancelled: 'Отменено',
    smartAlerts: 'Умные оповещения',
    todaysTasks: 'Задачи по видео на сегодня',
    noTasks: 'На сегодня видео к сдаче или публикации не запланировано. Отличная работа!',
    overdueDesc: 'Срок прошел, видео не готово',
    atRiskDesc: 'Публикация завтра, видео не готово',
    urgentDesc: 'Срок сдачи сегодня',
    readyPublishDesc: 'Готово и публикуется сегодня',

    // Alerts
    alertOverdue: 'Просрочено',
    alertAtRisk: 'Под угрозой',
    alertUrgent: 'Срочно',
    alertReadyPublish: 'Готово к публикации',

    // Weekly View
    weeklySchedule: 'Недельный план',
    weekOf: 'Неделя с',
    prevWeek: '← Пред. неделя',
    nextWeek: 'След. неделя →',
    dropHere: 'Перетащите сюда',
    dueEditing: 'Сдача/Монтаж',
    publishing: 'Публикация',

    // Calendar View
    monthlyPlanner: 'Месячный план',
    prevMonth: '← Пред. месяц',
    nextMonth: 'След. месяц →',

    // Videos View
    searchPlaceholder: 'Поиск видео, клиентов, заметок...',
    filterClient: 'Все клиенты',
    filterPlatform: 'Все платформы',
    filterStatus: 'Активные видео',
    filterPriority: 'Все приоритеты',
    noVideos: 'Видео по заданным фильтрам не найдены.',
    tableClient: 'Клиент',
    tableTitle: 'Название видео',
    tablePlatform: 'Платформа',
    tableDeadline: 'Срок сдачи',
    tablePublish: 'Дата публикации',
    tableStatus: 'Статус',
    tablePriority: 'Приоритет',
    tableActions: 'Ссылки',

    // Status Options
    statusNotReceived: 'Материал не получен',
    statusReceived: 'Материал получен',
    statusEditing: 'В монтаже',
    statusRevision: 'Правки',
    statusReady: 'Готово',
    statusScheduled: 'Запланировано',
    statusPublished: 'Опубликовано',
    statusCancelled: 'Отменено',

    // Clients View
    clientsTitle: 'Каталог клиентов',
    addClient: 'Добавить клиента',
    setTarget: 'Задать цель',
    reelsTarget: 'Цель Reels',
    ytTarget: 'Цель YouTube',
    planned: 'Запланировано',
    targetCompletion: 'Выполнение плана',
    noTargets: 'Цели не заданы',
    addNewClientTitle: 'Добавить нового клиента',
    registerClient: 'Зарегистрировать',

    // Analytics View
    prodRate: 'Процент публикации',
    ofPlanned: 'От запланированных видео опубликовано',
    pipeline: 'Видео в процессе',
    publishedCount: 'Опубликовано видео',
    allTimePub: 'Всего опубликовано за все время',
    platformBreakdown: 'Распределение по платформам',

    // Settings View
    sysSettings: 'Системные настройки',
    globalPlanning: 'Глобальная логика планирования',
    planningDesc: 'Настройте стандартный буфер времени между публикацией и сдачей готового видео.',
    safetyBufferLabel: 'Стандартный буфер (в днях)',
    registeredClients: 'Зарегистрированные клиенты',
    sameDay: 'В тот же день (0 дней)',
    oneDay: '1 день (Стандартно)',
    twoDays: '2 дня',
    threeDays: '3 дня',

    // Modal
    editDetails: 'Редактировать видео',
    addDetails: 'Добавить новое видео',
    clientLabel: 'Клиент *',
    platformLabel: 'Платформа *',
    videoTitleLabel: 'Название видео *',
    safetyBuffer: 'Буфер безопасности',
    publishDateLabel: 'Дата публикации *',
    deliveryDeadlineLabel: 'Срок сдачи готового видео *',
    rawLabel: 'Ссылка на исходники (Drive, Telegram и т.д.)',
    finalLabel: 'Ссылка на готовое видео',
    publishedLabel: 'Ссылка на опубликованный пост',
    notesLabel: 'Заметки',

    // Dialog
    confirmDelete: 'Вы уверены, что хотите удалить этого клиента? Все его запланированные видео также будут удалены.'
  },
  uz: {
    // Sidebar
    dashboard: 'Boshqaruv paneli',
    weeklyPlanner: 'Haftalik reja',
    calendar: 'Taqvim',
    videos: 'Videolar',
    clients: 'Mijozlar',
    analytics: 'Tahlillar',
    settings: 'Sozlamalar',
    lightMode: 'Kuzgi mavzu',
    darkMode: 'Tungi mavzu',
    language: 'Til',

    // General / Buttons
    newVideo: 'Yangi video',
    cancel: 'Bekor qilish',
    save: 'Saqlash',
    edit: 'Tahrirlash',
    delete: "O'chirish",
    saveBtn: 'Saqlash',
    activeClients: 'Faol mijozlar',

    // Dashboard View
    dashboardTitle: 'Boshqaruv paneli',
    activeVideos: 'Faol videolar',
    inEditing: 'Montajda',
    dueToday: 'Bugun topshiriladigan',
    publishingToday: 'Bugun e\'lon qilinadigan',
    overdueVideos: 'Muddati o\'tganlar',
    cancelled: 'Bekor qilingan',
    smartAlerts: 'Aqlli ogohlantirishlar',
    todaysTasks: 'Bugungi topshiriqlar',
    noTasks: 'Bugun topshiriladigan yoki e\'lon qilinadigan videolar mavjud emas. Ajoyib ish!',
    overdueDesc: 'Muddat o\'tdi va tayyor emas',
    atRiskDesc: 'Ertaga chop etiladi, tayyor emas',
    urgentDesc: 'Topshirish muddati bugun',
    readyPublishDesc: 'Tayyor va bugun chop etiladi',

    // Alerts
    alertOverdue: 'Muddati o\'tgan',
    alertAtRisk: 'Xavf ostida',
    alertUrgent: 'Shoshilinch',
    alertReadyPublish: 'Chop etishga tayyor',

    // Weekly View
    weeklySchedule: 'Haftalik reja',
    weekOf: 'Hafta boshlanishi:',
    prevWeek: '← O\'tgan hafta',
    nextWeek: 'Kelgusi hafta →',
    dropHere: 'Bu yerga tashlang',
    dueEditing: 'Topshirish/Montaj',
    publishing: 'Chop etish',

    // Calendar View
    monthlyPlanner: 'Oylik reja',
    prevMonth: '← O\'tgan oy',
    nextMonth: 'Kelgusi oy →',

    // Videos View
    searchPlaceholder: 'Videolar, mijozlar va eslatmalarni izlash...',
    filterClient: 'Barcha mijozlar',
    filterPlatform: 'Barcha platformalar',
    filterStatus: 'Faol videolar',
    filterPriority: 'Barcha ustuvorliklar',
    noVideos: 'Filtrlarga mos videolar topilmadi.',
    tableClient: 'Mijoz',
    tableTitle: 'Video nomi',
    tablePlatform: 'Platforma',
    tableDeadline: 'Topshirish muddati',
    tablePublish: 'Chop etish sanasi',
    tableStatus: 'Status',
    tablePriority: 'Ustuvorlik',
    tableActions: 'Havolalar',

    // Status Options
    statusNotReceived: 'Material olinmadi',
    statusReceived: 'Material olindi',
    statusEditing: 'Montajda',
    statusRevision: 'Tahrirlashda',
    statusReady: 'Tayyor',
    statusScheduled: 'Rejalashtirildi',
    statusPublished: 'E\'lon qilindi',
    statusCancelled: 'Bekor qilindi',

    // Clients View
    clientsTitle: 'Mijozlar ro\'yxati',
    addClient: 'Mijoz qo\'shish',
    setTarget: 'Reja belgilash',
    reelsTarget: 'Reels rejasi',
    ytTarget: 'YouTube rejasi',
    planned: 'Rejalashtirildi',
    targetCompletion: 'Reja bajarilishi',
    noTargets: 'Rejalar belgilanmagan',
    addNewClientTitle: 'Yangi mijoz qo\'shish',
    registerClient: 'Mijozni ro\'yxatdan o\'tkazish',

    // Analytics View
    prodRate: 'Ish unumdorligi sanasi',
    ofPlanned: 'Rejalashtirilgan videolardan chop etilganlari',
    pipeline: 'Jarayondagi videolar',
    publishedCount: 'Chop etilgan videolar',
    allTimePub: 'Jami chop etilgan kontentlar',
    platformBreakdown: 'Platformalar bo\'yicha taqsimot',

    // Settings View
    sysSettings: 'Tizim sozlamalari',
    globalPlanning: 'Global rejalashtirish mantiqi',
    planningDesc: 'Chop etish sanasi va tayyor videoni topshirish muddati orasidagi standart bufer kunlarini sozlang.',
    safetyBufferLabel: 'Standart bufer (kunlar)',
    registeredClients: "Ro'yxatdan o'tgan mijozlar",
    sameDay: 'Shu kunning o\'zida (0 kun)',
    oneDay: '1 kun (Standart)',
    twoDays: '2 kun',
    threeDays: '3 kun',

    // Modal
    editDetails: 'Video tafsilotlarini tahrirlash',
    addDetails: 'Yangi video qo\'shish',
    clientLabel: 'Mijoz *',
    platformLabel: 'Platforma *',
    videoTitleLabel: 'Video nomi *',
    safetyBuffer: 'Xavfsizlik buferi',
    publishDateLabel: 'Chop etish sanasi *',
    deliveryDeadlineLabel: 'Topshirish muddati *',
    rawLabel: 'Xom material havolasi (Google Drive, Telegram va h.k.)',
    finalLabel: 'Tayyor video havolasi',
    publishedLabel: 'Chop etilgan post havolasi',
    notesLabel: 'Izohlar/Eslatmalar',

    // Dialog
    confirmDelete: 'Ushbu mijozni o\'chirishni xohlaysizmi? Uning barcha rejalashtirilgan videolari ham o\'chib ketadi.'
  }
};
