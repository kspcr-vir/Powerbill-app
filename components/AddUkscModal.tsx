import React, { useState } from 'react';
import { X, HelpCircle } from 'lucide-react';
import { UkscData, generateId } from '../types';

interface AddUkscModalProps {
  onClose: () => void;
  onAdd: (connections: UkscData[]) => void;
}

export const AddUkscModal: React.FC<AddUkscModalProps> = ({ onClose, onAdd }) => {
  const [input, setInput] = useState('');

  const parseInput = () => {
    const lines = input.split(/[\n;]/).filter(line => line.trim() !== '');
    const newConnections: UkscData[] = [];

    lines.forEach(line => {
      // Logic: Split by comma. First part is UKSC, second is optional name.
      // Format: 110390320, My House Name
      const parts = line.split(',');
      const ukscNo = parts[0].trim();
      const name = parts[1] ? parts[1].trim() : `Connection ${ukscNo.slice(-4)}`;

      if (ukscNo) {
        newConnections.push({
          id: generateId(),
          ukscNo,
          name,
          tenant: { name: '', flatNo: '', phone: '' } // Empty initial tenant info
        });
      }
    });

    onAdd(newConnections);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Add UKSC Numbers</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Numbers (Batch)
          </label>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4 text-sm text-blue-800 flex items-start gap-2">
            <HelpCircle size={16} className="mt-0.5 shrink-0" />
            <p>
              Enter one per line. Optionally add a name after a comma.<br/>
              Example:<br/>
              <span className="font-mono text-xs opacity-75">
                110390320, Ground Floor<br/>
                110390321, First Floor
              </span>
            </p>
          </div>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm resize-none"
            placeholder="110390320&#10;110390321, Flat 2B..."
            autoFocus
          />
          
          <div className="mt-6 flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition"
            >
              Cancel
            </button>
            <button 
              onClick={parseInput}
              disabled={!input.trim()}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-sm transition"
            >
              Add Connections
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
