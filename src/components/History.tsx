import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Activity, 
  ChevronRight, 
  Search, 
  Filter,
  FileText,
  Clock,
  ArrowUpRight
} from 'lucide-react';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface DiagnosticRecord {
  id: string;
  type: string;
  imageUrl: string;
  predictedDisease: string;
  severityPercentage: number;
  timestamp: Timestamp;
  precautions: string[];
  causes: string[];
}

export default function History() {
  const [records, setRecords] = useState<DiagnosticRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [selectedRecord, setSelectedRecord] = useState<DiagnosticRecord | null>(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'diagnostics'),
      where('uid', '==', auth.currentUser.uid),
      orderBy('timestamp', 'desc')
    );

    const path = 'diagnostics';
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DiagnosticRecord[];
      setRecords(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const filteredRecords = records.filter(r => {
    const matchesSearch = r.predictedDisease.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || r.type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Loading your medical history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Patient History</h1>
        <p className="text-gray-500">View and manage your past AI diagnostic results</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by disease name..."
            className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Filter className="text-gray-400 w-5 h-5 shrink-0" />
          {['All', 'Skin', 'Eyes', 'Teeth'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                filterType === type 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record) => (
              <motion.div
                layout
                key={record.id}
                onClick={() => setSelectedRecord(record)}
                className={`p-4 bg-white rounded-2xl border transition-all cursor-pointer group ${
                  selectedRecord?.id === record.id 
                    ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-md' 
                    : 'border-gray-100 hover:border-indigo-200 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                    <img src={record.imageUrl} alt="Analysis" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase">
                        {record.type}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {record.timestamp.toDate().toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 truncate">{record.predictedDisease}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span className="text-xs text-gray-500 font-medium">{record.severityPercentage}% Severity</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-gray-300 transition-transform ${selectedRecord?.id === record.id ? 'rotate-90 text-indigo-500' : 'group-hover:translate-x-1'}`} />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No records found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedRecord ? (
              <motion.div
                key={selectedRecord.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden sticky top-24"
              >
                <div className="aspect-video relative">
                  <img src={selectedRecord.imageUrl} alt="Full view" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">{selectedRecord.type} Analysis</p>
                      <h2 className="text-2xl font-bold">{selectedRecord.predictedDisease}</h2>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <Activity className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Severity</p>
                        <p className="text-lg font-bold text-gray-900">{selectedRecord.severityPercentage}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <Clock className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Date</p>
                        <p className="text-lg font-bold text-gray-900">{selectedRecord.timestamp.toDate().toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                      <ArrowUpRight className="w-4 h-4 text-indigo-500" />
                      Precautions Taken
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecord.precautions.map((p, i) => (
                        <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                      <ArrowUpRight className="w-4 h-4 text-indigo-500" />
                      Identified Causes
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecord.causes.map((c, i) => (
                        <span key={i} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-gray-100 rounded-3xl border-2 border-dashed border-gray-200 h-[500px] flex flex-col items-center justify-center p-8 text-center text-gray-400">
                <FileText className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm font-medium">Select a record from the list to view detailed analysis results.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
