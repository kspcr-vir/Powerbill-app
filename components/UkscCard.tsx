import React, { useState } from 'react';
import { User, Phone, MapPin, Edit3, Trash2, FileText, Share2, Zap } from 'lucide-react';
import { UkscData, BillDetails } from '../types';
import { BillModal } from './BillModal';

interface UkscCardProps {
  data: UkscData;
  onUpdate: (data: UkscData) => void;
  onDelete: (id: string) => void;
}

const UkscCard: React.FC<UkscCardProps> = ({ data, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  
  // Edit State
  const [editData, setEditData] = useState(data);

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(data);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden ring-2 ring-indigo-500/20">
        <div className="bg-indigo-50 p-4 border-b border-indigo-100">
          <h3 className="font-semibold text-indigo-900">Edit Details</h3>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Label / Name</label>
            <input 
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
              value={editData.name}
              onChange={e => setEditData({...editData, name: e.target.value})}
              placeholder="e.g. Ground Floor"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">UKSC No</label>
            <input 
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
              value={editData.ukscNo}
              onChange={e => setEditData({...editData, ukscNo: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Tenant Name</label>
              <input 
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
                value={editData.tenant.name}
                onChange={e => setEditData({...editData, tenant: { ...editData.tenant, name: e.target.value }})}
                placeholder="Name"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Phone (91)</label>
              <input 
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
                value={editData.tenant.phone}
                onChange={e => setEditData({...editData, tenant: { ...editData.tenant, phone: e.target.value }})}
                placeholder="9876543210"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Flat/Plot No</label>
            <input 
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
              value={editData.tenant.flatNo}
              onChange={e => setEditData({...editData, tenant: { ...editData.tenant, flatNo: e.target.value }})}
              placeholder="A-101"
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-gray-100">
            <button onClick={handleCancel} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
            <button onClick={handleSave} className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">Save</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition duration-200 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={16} className="text-yellow-500 fill-current" />
              <span className="font-mono text-sm font-bold text-gray-500 tracking-wide">{data.ukscNo}</span>
            </div>
            <h3 className="font-bold text-gray-800 text-lg leading-tight">{data.name || 'Untitled Connection'}</h3>
          </div>
          <div className="flex gap-1">
            <button 
              onClick={() => setIsEditing(true)} 
              className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
              title="Edit Details"
            >
              <Edit3 size={16} />
            </button>
            <button 
              onClick={() => onDelete(data.id)} 
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Remove Connection"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex-1 space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-indigo-50 text-indigo-500 rounded-md shrink-0">
              <User size={16} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Tenant Name</p>
              <p className="text-sm text-gray-800 font-medium">{data.tenant.name || '—'}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-indigo-50 text-indigo-500 rounded-md shrink-0">
              <MapPin size={16} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Flat / Plot</p>
              <p className="text-sm text-gray-800 font-medium">{data.tenant.flatNo || '—'}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-indigo-50 text-indigo-500 rounded-md shrink-0">
              <Phone size={16} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Phone</p>
              <p className="text-sm text-gray-800 font-medium">{data.tenant.phone || '—'}</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
          <button 
            onClick={() => setShowBillModal(true)}
            className="w-full flex items-center justify-center gap-2 bg-white border border-indigo-200 text-indigo-700 font-semibold py-2 rounded-lg shadow-sm hover:bg-indigo-50 hover:border-indigo-300 transition"
          >
            <FileText size={18} /> View & Share Bill
          </button>
        </div>
      </div>

      {showBillModal && (
        <BillModal 
          connection={data} 
          onClose={() => setShowBillModal(false)} 
        />
      )}
    </>
  );
};

export default UkscCard;
