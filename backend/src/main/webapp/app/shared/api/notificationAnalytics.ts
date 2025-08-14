import axios from 'axios';

export interface NotificationAnalyticsDTO {
  totalNotifications?: number;
  delivered?: number;
  failed?: number;
  bounced?: number;
  byChannel?: Record<string, number>;
  byStatus?: Record<string, number>;
  timeline?: Array<{ timestamp: string; count: number }>;
  [key: string]: any;
}

export interface DeliveryStatsDTO {
  status?: string;
  count?: number;
  [key: string]: any;
}

const baseUrl = 'api/admin/notification-analytics';

export async function getAnalytics(params?: { startDate?: string; endDate?: string }) {
  const response = await axios.get<NotificationAnalyticsDTO>(`${baseUrl}/analytics`, {
    params: {
      startDate: params?.startDate,
      endDate: params?.endDate,
    },
  });
  return response.data;
}

export async function getDeliveryRate(params?: { startDate?: string; endDate?: string }) {
  const response = await axios.get<number>(`${baseUrl}/delivery-rate`, {
    params: {
      startDate: params?.startDate,
      endDate: params?.endDate,
    },
  });
  return response.data;
}

export async function getSystemHealth() {
  const response = await axios.get<Record<string, any>>(`${baseUrl}/system-health`);
  return response.data;
}
