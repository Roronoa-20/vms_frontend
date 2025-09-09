export interface Notification {
  name: string;
  notification_name: string;
  subject: string;
  read: boolean;
  creation: string;
  modified: string;
  for_user: string;
  from_user: string;
  type: string;
  document_type: string;
  document_name: string;
  attached_file: string | null;
  content: string;
  content_preview: string;
}


export interface Pagination {
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface NotificationListResponse {
  message: {
    success: boolean;
    data: {
      notifications: Notification[];
      pagination: Pagination;
    };
  };
}

export interface MarkAllReadResponse {
  message: {
    success: boolean;
    message: string;
    data: {
      updated_count: number;
      total_notifications: number;
    };
  };
}
