export interface AuditRecord {
  id: number;
  entityName: string;
  entityId: string;
  userId: number;
  oldState: Record<string, any> | null;
  newState: Record<string, any> | null;
  action: "INSERT" | "UPDATE" | "DELETE";
  createdAt: string;
}

export interface AuditMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AuditResponse {
  data: AuditRecord[];
  meta: AuditMeta;
}
