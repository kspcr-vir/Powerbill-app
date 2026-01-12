import React, { useEffect, useState } from 'react';
import { X, Share2, Download, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { UkscData, BillDetails } from '../types';
import { fetchBillDetails, getBillUrl } from '../services/billService';
import { generateBillPdf, downloadPdf } from '../services/pdfService';

interface BillModalProps {
  connection: UkscData;
  onClose: () => void;
}

export const BillModal: React.FC<BillModalProps> = ({ connection, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [bill, setBill] = useState<BillDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadBill = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBillDetails(connection.ukscNo);
      setBill(data);
    } catch (err) {
      setError("Failed to load bill details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBill();
  }, [connection.ukscNo]);

  const handleDownloadPdf = () => {
    if (!bill) return;
    const blob = generateBillPdf(bill, connection);
    const filename = `Bill_${connection.ukscNo}_${bill.billDate}.pdf`;
    downloadPdf(blob, filename);
  };

  const handleShareWhatsapp = () => {
    if (!bill) return;
    
    // First download the PDF so the user has it
    handleDownloadPdf();

    // Construct WhatsApp message
    const tenantName = connection.tenant.name || 'Tenant';
    const amount = bill.amount.toFixed(2);
    const month = new Date(bill.billDate).toLocaleString('default', { month: 'long', year: 'numeric' });
    
    const message = `Hello ${tenantName},\n\nHere is your electricity bill details for ${month}.\n\n*UKSC No:* ${connection.ukscNo}\n*Amount:* ₹${amount}\n*Due Date:* ${bill.dueDate}\n*Units:* ${bill.unitsConsumed}\n\nI have downloaded the detailed PDF and will attach it shortly.\n\nPlease pay by the due date to avoid penalties.`;
    
    const encodedMessage = encodeURIComponent(message);
    const phone = connection.tenant.phone.replace(/\D/g, ''); // Remove non-digits
    
    // Fallback to general link if no phone provided, otherwise direct chat
    const url = phone 
      ? `https://wa.me/91${phone}?text=${encodedMessage}`
      : `https://wa.me/?text=${encodedMessage}`;
      
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Bill Details</h2>
            <p className="text-sm text-gray-500">UKSC: {connection.ukscNo}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <RefreshCw className="animate-spin text-indigo-600" size={40} />
              <p className="text-gray-500 font-medium">Fetching bill info...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="mx-auto text-red-500 mb-2" size={40} />
              <p className="text-gray-800 font-medium mb-4">{error}</p>
              <button onClick={loadBill} className="text-indigo-600 hover:underline">Try Again</button>
            </div>
          ) : bill ? (
            <div className="space-y-6">
              {/* Status Banner */}
              <div className={`p-4 rounded-xl border flex justify-between items-center ${
                bill.status === 'PAID' ? 'bg-green-50 border-green-200 text-green-700' :
                bill.status === 'OVERDUE' ? 'bg-red-50 border-red-200 text-red-700' :
                'bg-yellow-50 border-yellow-200 text-yellow-700'
              }`}>
                <span className="font-bold flex items-center gap-2">
                  <AlertCircle size={20} />
                  Status: {bill.status}
                </span>
                <span className="text-sm font-medium opacity-80">Due: {bill.dueDate}</span>
              </div>

              {/* Amount */}
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Total Amount Due</p>
                <p className="text-5xl font-extrabold text-gray-900 mt-2">₹{bill.amount.toFixed(2)}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 mb-1">Bill Date</p>
                  <p className="font-semibold">{bill.billDate}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-500 mb-1">Units Consumed</p>
                  <p className="font-semibold">{bill.unitsConsumed} kWh</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                  <p className="text-gray-500 mb-1">Customer Name (Record)</p>
                  <p className="font-semibold">{bill.customerName || 'N/A'}</p>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="text-xs text-gray-400 text-center italic">
                Data is simulated for demonstration. In a production environment, this would fetch from the official API via a secure proxy.
              </div>
            </div>
          ) : null}
        </div>

        {/* Actions Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-3">
          <button 
            onClick={handleDownloadPdf}
            disabled={loading || !bill}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
          >
            <Download size={20} /> Save PDF
          </button>
          
          <button 
            onClick={handleShareWhatsapp}
            disabled={loading || !bill}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition disabled:opacity-50 shadow-md shadow-green-200"
          >
            <Share2 size={20} /> WhatsApp
          </button>
          
          <a 
            href={getBillUrl(connection.ukscNo)}
            target="_blank"
            rel="noreferrer"
            className="col-span-2 text-center text-indigo-600 text-sm font-medium hover:underline flex items-center justify-center gap-1 mt-2"
          >
            Open Official Site <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};
