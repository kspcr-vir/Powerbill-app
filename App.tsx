import React, { useState, useEffect } from 'react';
import { Plus, Home, Building2, Trash2, Zap, Settings, Search, ArrowLeft, MoreVertical, Edit2 } from 'lucide-react';
import { Profile, UkscData, generateId } from './types';
import UkscCard from './components/UkscCard';
import { AddUkscModal } from './components/AddUkscModal';

const STORAGE_KEY = 'powerbill_profiles';

const App: React.FC = () => {
  // --- State ---
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileType, setNewProfileType] = useState<'HOME' | 'APARTMENT'>('HOME');
  
  // Initialize from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProfiles(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse profiles", e);
      }
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  }, [profiles]);

  // --- Handlers ---

  const handleCreateProfile = () => {
    if (!newProfileName.trim()) return;
    const newProfile: Profile = {
      id: generateId(),
      name: newProfileName,
      type: newProfileType,
      connections: [],
    };
    setProfiles([...profiles, newProfile]);
    setNewProfileName('');
    setShowAddProfile(false);
  };

  const deleteProfile = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this profile?')) {
      setProfiles(profiles.filter(p => p.id !== id));
      if (activeProfileId === id) setActiveProfileId(null);
    }
  };

  const updateProfileConnections = (profileId: string, newConnections: UkscData[]) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === profileId) {
        return { ...p, connections: newConnections };
      }
      return p;
    }));
  };

  const activeProfile = profiles.find(p => p.id === activeProfileId);

  // --- Render ---

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-indigo-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeProfileId && (
              <button 
                onClick={() => setActiveProfileId(null)}
                className="mr-2 p-1 hover:bg-indigo-500 rounded-full transition"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <Zap className="text-yellow-300 fill-current" />
            <h1 className="text-xl font-bold tracking-tight">
              {activeProfile ? activeProfile.name : 'My Power Bills'}
            </h1>
          </div>
          {/* Global Actions could go here */}
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4">
        {activeProfileId && activeProfile ? (
          <ProfileDetailView 
            profile={activeProfile} 
            onUpdateConnections={(conns) => updateProfileConnections(activeProfile.id, conns)}
          />
        ) : (
          <DashboardView 
            profiles={profiles} 
            onSelectProfile={setActiveProfileId}
            onDeleteProfile={deleteProfile}
            onOpenAdd={() => setShowAddProfile(true)}
          />
        )}
      </main>

      {/* Add Profile Modal */}
      {showAddProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Create New Profile</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Name</label>
                  <input
                    type="text"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    placeholder="e.g. My Villa, Lotus Apartments"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setNewProfileType('HOME')}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition ${
                        newProfileType === 'HOME' 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <Home size={24} className="mb-2" />
                      <span className="font-medium">Home</span>
                    </button>
                    <button
                      onClick={() => setNewProfileType('APARTMENT')}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition ${
                        newProfileType === 'APARTMENT' 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <Building2 size={24} className="mb-2" />
                      <span className="font-medium">Apartment</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => setShowAddProfile(false)}
                  className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateProfile}
                  disabled={!newProfileName.trim()}
                  className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-md transition"
                >
                  Create Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Sub-Components ---

const DashboardView: React.FC<{
  profiles: Profile[];
  onSelectProfile: (id: string) => void;
  onDeleteProfile: (e: React.MouseEvent, id: string) => void;
  onOpenAdd: () => void;
}> = ({ profiles, onSelectProfile, onDeleteProfile, onOpenAdd }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-700">Your Properties</h2>
      </div>

      {profiles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="text-indigo-400" size={32} />
          </div>
          <p className="text-gray-500 mb-6">No profiles added yet.</p>
          <button 
            onClick={onOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-full font-medium shadow-md hover:bg-indigo-700 transition"
          >
            <Plus size={18} /> Add First Profile
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {profiles.map(profile => (
            <div 
              key={profile.id}
              onClick={() => onSelectProfile(profile.id)}
              className="group bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300 cursor-pointer transition relative"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-lg ${profile.type === 'HOME' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                    {profile.type === 'HOME' ? <Home size={24} /> : <Building2 size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg group-hover:text-indigo-600 transition">{profile.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {profile.connections.length} Connection{profile.connections.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={(e) => onDeleteProfile(e, profile.id)}
                  className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition"
                  title="Delete Profile"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          
          <button 
            onClick={onOpenAdd}
            className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition gap-2 h-full min-h-[140px]"
          >
            <Plus size={24} />
            <span className="font-medium">Add New Profile</span>
          </button>
        </div>
      )}
    </div>
  );
};

const ProfileDetailView: React.FC<{
  profile: Profile;
  onUpdateConnections: (conns: UkscData[]) => void;
}> = ({ profile, onUpdateConnections }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddConnections = (newConns: UkscData[]) => {
    onUpdateConnections([...profile.connections, ...newConns]);
    setShowAddModal(false);
  };

  const handleUpdateConnection = (updated: UkscData) => {
    const updatedList = profile.connections.map(c => c.id === updated.id ? updated : c);
    onUpdateConnections(updatedList);
  };

  const handleDeleteConnection = (id: string) => {
    if (window.confirm('Delete this connection?')) {
      onUpdateConnections(profile.connections.filter(c => c.id !== id));
    }
  };

  const filteredConnections = profile.connections.filter(c => 
    c.ukscNo.includes(searchTerm) || 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.tenant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Actions Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-auto flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search UKSC or Tenant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-sm hover:bg-indigo-700 transition font-medium"
        >
          <Plus size={18} /> Add UKSC No
        </button>
      </div>

      {/* List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {filteredConnections.length > 0 ? (
          filteredConnections.map(conn => (
            <UkscCard 
              key={conn.id} 
              data={conn} 
              onUpdate={handleUpdateConnection}
              onDelete={handleDeleteConnection}
            />
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500">
              {profile.connections.length === 0 
                ? "No connections added yet. Click 'Add UKSC No' to start." 
                : "No matching connections found."}
            </p>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddUkscModal 
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddConnections}
        />
      )}
    </div>
  );
};

export default App;
