import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Phone, Star, Clock, ExternalLink, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_INDIA_DOCTORS } from '../constants';

export default function MapLocator() {
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const cities = ['All', ...Array.from(new Set(ALL_INDIA_DOCTORS.map(d => d.city)))];
  const specialties = ['All', ...Array.from(new Set(ALL_INDIA_DOCTORS.map(d => d.specialty)))];

  const filteredDoctors = ALL_INDIA_DOCTORS.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doc.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'All' || doc.city === selectedCity;
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    return matchesSearch && matchesCity && matchesSpecialty;
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoading(false);
        },
        (err) => {
          console.error(err);
          setError("Could not access your location. Showing results for Bangalore.");
          setLocation({ lat: 12.9716, lng: 77.5946 });
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  }, []);

  const openInGoogleMaps = (docName: string, address: string) => {
    const query = encodeURIComponent(`${docName} ${address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Find Nearby Doctors</h1>
        <p className="text-gray-500">Locate specialists and clinics based on your current location</p>
      </div>

      {error && (
        <div className="p-4 bg-amber-50 border border-amber-100 text-amber-800 rounded-2xl text-sm flex items-center gap-3 font-medium">
          <MapPin className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search doctors or clinics..."
            className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="text-gray-400 w-5 h-5 shrink-0" />
          <select 
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
          >
            {cities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400 w-5 h-5 shrink-0" />
          <select 
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
          >
            {specialties.map(spec => <option key={spec} value={spec}>{spec}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Placeholder */}
        <div className="lg:col-span-2 bg-gray-200 rounded-3xl overflow-hidden relative min-h-[400px] shadow-inner border border-gray-300">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <MapPin className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Interactive Map View</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  In a production environment, this would render a Google Map with markers at:
                  <br />
                  <code className="text-xs bg-white px-2 py-1 rounded mt-2 inline-block">
                    Lat: {location?.lat.toFixed(4)}, Lng: {location?.lng.toFixed(4)}
                  </code>
                </p>
              </div>
            </div>
          )}
          
          {/* Map Controls Overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-gray-600 hover:text-indigo-600 transition-colors">
              <Navigation className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Doctor List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            Nearby Specialists
            <span className="text-xs font-normal text-gray-400">({filteredDoctors.length} results)</span>
          </h2>
          <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
            <AnimatePresence>
              {filteredDoctors.map((doc) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  key={doc.id}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-200 transition-all group"
                >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{doc.name}</h3>
                    <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">{doc.specialty}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-amber-700">{doc.rating}</span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
                    <span>{doc.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{doc.open}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{doc.phone}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => window.open(`tel:${doc.phone.replace(/\s/g, '')}`)}
                    className="flex-grow bg-indigo-600 text-white py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Call Now
                  </button>
                  <button 
                    onClick={() => openInGoogleMaps(doc.name, doc.address)}
                    className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                    title="View on Google Maps"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
