import { BillDetails } from '../types';

/**
 * Simulates fetching bill details from the provided URL.
 * Note: Direct browser fetch to 'https://tgsouthernpower.org/billinginfo' 
 * is blocked by CORS policy in a client-side app. 
 * This service mimics the response for demonstration purposes.
 */
export const fetchBillDetails = async (ukscNo: string): Promise<BillDetails> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Deterministic mock data based on UKSC number to ensure consistency
  const seed = parseInt(ukscNo.replace(/\D/g, '').substring(0, 5) || '12345', 10);
  
  const randomAmount = (seed % 5000) + 200;
  const now = new Date();
  const dueDate = new Date(now);
  dueDate.setDate(now.getDate() + 15);

  const statusOptions: ('PAID' | 'PENDING' | 'OVERDUE')[] = ['PENDING', 'PAID', 'OVERDUE'];
  const status = statusOptions[seed % 3];

  return {
    ukscNo,
    amount: parseFloat(randomAmount.toFixed(2)),
    dueDate: dueDate.toISOString().split('T')[0],
    billDate: now.toISOString().split('T')[0],
    unitsConsumed: (seed % 300) + 50,
    status: status,
    customerName: `Customer ${ukscNo.substring(0, 4)}`,
  };
};

export const getBillUrl = (ukscNo: string) => `https://tgsouthernpower.org/billinginfo?ukscno=${ukscNo}`;
