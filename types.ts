export interface Tenant {
  name: string;
  flatNo: string;
  phone: string;
}

export interface UkscData {
  id: string;
  ukscNo: string;
  name: string; // Optional alias or name for the connection
  tenant: Tenant;
}

export interface Profile {
  id: string;
  name: string;
  type: 'HOME' | 'APARTMENT';
  connections: UkscData[];
}

export interface BillDetails {
  ukscNo: string;
  amount: number;
  dueDate: string;
  billDate: string;
  unitsConsumed: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  customerName?: string; // Fetched name
}

// Helper to generate a unique ID
export const generateId = (): string => Math.random().toString(36).substring(2, 9);
