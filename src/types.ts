export type Platform = 'Instagram Reels' | 'YouTube Shorts' | 'YouTube';

export type VideoStatus = 
  | 'Material Not Received'
  | 'Material Received'
  | 'In Editing'
  | 'Revision'
  | 'Ready'
  | 'Scheduled'
  | 'Published'
  | 'Cancelled';

export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface FeedbackItem {
  id: string;
  timestamp: string; // e.g. "0:15"
  comment: string;
  resolved: boolean;
}

export interface Video {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  platform: Platform;
  rawMaterialLink: string;
  deliveryDeadline: string; // YYYY-MM-DD
  publishDate: string; // YYYY-MM-DD
  finalVideoLink: string;
  publishedPostLink: string;
  notes: string;
  priority: Priority;
  status: VideoStatus;
  safetyBufferDays: number;
  // Finance additions
  price?: number;
  isPaid?: boolean;
  // Professional workflow additions
  subTasks?: SubTask[];
  feedbacks?: FeedbackItem[];
  assigneeName?: string; // name of the video editor/crew assigned
}

export interface Client {
  id: string;
  name: string;
  specialty: string;
  reelsTarget: number;
  youtubeTarget: number;
  // Finance target targets
  monthlyContractPrice?: number;
}
