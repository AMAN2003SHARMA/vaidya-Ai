import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Shield, Edit2, Check, X, Camera } from 'lucide-react';

export default function Profile() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          setNewName(userDoc.data().displayName || '');
        }
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleUpdateProfile = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    try {
      if (auth.currentUser) {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          displayName: newName
        });
        setUserData({ ...userData, displayName: newName });
        setIsEditing(false);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-blue-500"></div>
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6 flex items-end gap-6">
            <div className="relative group">
              <div className="w-32 h-32 bg-white rounded-2xl p-1 shadow-lg">
                {userData?.photoURL ? (
                  <img src={userData.photoURL} alt="Profile" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <div className="w-full h-full bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <User className="w-12 h-12" />
                  </div>
                )}
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-white rounded-lg shadow-md text-gray-400 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="pb-2">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="text-2xl font-bold text-gray-900 border-b-2 border-indigo-600 outline-none bg-transparent"
                  />
                  <button onClick={handleUpdateProfile} className="p-1 text-green-600 hover:bg-green-50 rounded">
                    <Check className="w-6 h-6" />
                  </button>
                  <button onClick={() => setIsEditing(false)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-900">{userData?.displayName || 'Anonymous User'}</h1>
                  <button onClick={() => setIsEditing(true)} className="p-1 text-gray-400 hover:text-indigo-600 rounded transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <p className="text-gray-500 font-medium">{userData?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Mail className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Email Address</p>
                  <p className="font-semibold text-gray-900">{userData?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Calendar className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Member Since</p>
                  <p className="font-semibold text-gray-900">
                    {userData?.createdAt?.toDate ? userData.createdAt.toDate().toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Shield className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Account Status</p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <p className="font-semibold text-gray-900">Verified Patient</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Shield className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">2FA Security</p>
                  <p className="font-semibold text-gray-900">{userData?.twoFactorEnabled ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 rounded-3xl p-8 border border-indigo-100">
        <h2 className="text-xl font-bold text-indigo-900 mb-4">Medical Privacy Policy</h2>
        <p className="text-indigo-800 leading-relaxed text-sm">
          Your medical data is encrypted and stored securely in our private cloud. We do not share your diagnostic history with third parties without your explicit consent. You can request to delete your data at any time from the account settings.
        </p>
      </div>
    </div>
  );
}
