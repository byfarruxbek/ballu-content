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
