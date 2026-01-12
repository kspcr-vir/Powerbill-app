import jsPDF from 'jspdf';
import { BillDetails, UkscData } from '../types';

export const generateBillPdf = (bill: BillDetails, connection: UkscData): Blob => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(41, 128, 185);
  doc.text('Electricity Bill Details', 105, 20, { align: 'center' });
  
  doc.setLineWidth(0.5);
  doc.line(20, 25, 190, 25);

  // Connection Info
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Connection Details', 20, 40);
  
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text(`Profile Name: ${connection.name || 'N/A'}`, 20, 50);
  doc.text(`UKSC Number: ${connection.ukscNo}`, 20, 58);
  
  // Tenant Info
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Tenant Details', 20, 75);
  
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text(`Name: ${connection.tenant.name || 'N/A'}`, 20, 85);
  doc.text(`Flat/Plot No: ${connection.tenant.flatNo || 'N/A'}`, 20, 93);
  doc.text(`Phone: ${connection.tenant.phone || 'N/A'}`, 20, 101);

  // Bill Info Box
  doc.setFillColor(245, 247, 250);
  doc.rect(20, 115, 170, 60, 'F');
  
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Bill Summary', 30, 128);

  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  
  let y = 140;
  const addRow = (label: string, value: string, isBold: boolean = false) => {
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.text(label, 30, y);
    doc.text(value, 120, y);
    y += 10;
  };

  addRow('Bill Date:', bill.billDate);
  addRow('Due Date:', bill.dueDate);
  addRow('Units Consumed:', `${bill.unitsConsumed} kWh`);
  
  doc.setTextColor(192, 57, 43); // Red color for amount
  addRow('Total Amount:', `INR ${bill.amount.toFixed(2)}`, true);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);
  y+=5;
  
  doc.text(`Status: ${bill.status}`, 30, y);

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text('Generated via PowerBill Manager App', 105, 280, { align: 'center' });

  return doc.output('blob');
};

export const downloadPdf = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
