import {Notification} from "./Notification";

export interface PerformanceMetric {
  id: number;
  notification: Notification;
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cvr: number;
}
