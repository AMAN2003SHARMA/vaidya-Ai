import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Phone, Star, Clock, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

// Expanded doctor data from across India
const MOCK_DOCTORS = [
  {
    id: 1,
    name: "Dr. Rajesh Sharma",
    specialty: "Dermatologist",
    expertise: ["Skin", "Eczema", "Psoriasis"],
    address: "12, MG Road, Bangalore, Karnataka",
    city: "Bangalore",
    rating: 4.8,
    reviews: 124,
    phone: "+91 98765 43210",
    distance: "1.2 km",
    open: "Open until 8:00 PM"
  },
  {
    id: 2,
    name: "Apollo Medical Center",
    specialty: "Multi-Specialty Clinic",
    expertise: ["General", "Fever", "Infection"],
    address: "45, Indiranagar, Bangalore, Karnataka",
    city: "Bangalore",
    rating: 4.5,
    reviews: 850,
    phone: "+91 80 2345 6789",
    distance: "2.5 km",
    open: "Open 24/7"
  },
  {
    id: 3,
    name: "Dr. Priya Iyer",
    specialty: "Ophthalmologist",
    expertise: ["Eyes", "Cataract", "Glaucoma"],
    address: "78, Koramangala, Bangalore, Karnataka",
    city: "Bangalore",
    rating: 4.9,
    reviews: 98,
    phone: "+91 91234 56789",
    distance: "3.1 km",
    open: "Open until 6:30 PM"
  },
  {
    id: 4,
    name: "Smile Dental Clinic",
    specialty: "Dentist",
    expertise: ["Teeth", "Gums", "Root Canal"],
    address: "22, Jayanagar, Bangalore, Karnataka",
    city: "Bangalore",
    rating: 4.7,
    reviews: 215,
    phone: "+91 80 4567 8901",
    distance: "0.8 km",
    open: "Open until 7:00 PM"
  },
  {
    id: 5,
    name: "Dr. Amit Verma",
    specialty: "Dermatologist",
    expertise: ["Skin", "Acne", "Dermatitis"],
    address: "Sector 18, Noida, Uttar Pradesh",
    city: "Noida",
    rating: 4.6,
    reviews: 156,
    phone: "+91 99887 76655",
    distance: "850 km",
    open: "Open until 7:30 PM"
  },
  {
    id: 6,
    name: "Dr. Sunita Reddy",
    specialty: "Ophthalmologist",
    expertise: ["Eyes", "Vision", "Lasik"],
    address: "Banjara Hills, Hyderabad, Telangana",
    city: "Hyderabad",
    rating: 4.8,
    reviews: 312,
    phone: "+91 90000 11111",
    distance: "570 km",
    open: "Open until 6:00 PM"
  },
  {
    id: 7,
    name: "Dr. Vikram Mehra",
    specialty: "Dentist",
    expertise: ["Teeth", "Implants", "Orthodontics"],
    address: "South Extension, New Delhi",
    city: "Delhi",
    rating: 4.9,
    reviews: 420,
    phone: "+91 11 2345 6789",
    distance: "2100 km",
    open: "Open until 8:30 PM"
  },
  {
    id: 8,
    name: "Dr. Anjali Gupta",
    specialty: "Dermatologist",
    expertise: ["Skin", "Hair", "Laser"],
    address: "Andheri West, Mumbai, Maharashtra",
    city: "Mumbai",
    rating: 4.7,
    reviews: 289,
    phone: "+91 22 9876 5432",
    distance: "980 km",
    open: "Open until 7:00 PM"
  },
  {
    id: 9,
    name: "Kolkata Eye Care",
    specialty: "Ophthalmologist",
    expertise: ["Eyes", "Retina", "Pediatric"],
    address: "Salt Lake City, Kolkata, West Bengal",
    city: "Kolkata",
    rating: 4.5,
    reviews: 175,
    phone: "+91 33 4567 1234",
    distance: "1800 km",
    open: "Open until 6:00 PM"
  },
  {
    id: 10,
    name: "Dr. Suresh Babu",
    specialty: "Dentist",
    expertise: ["Teeth", "Whitening", "Extraction"],
    address: "Anna Nagar, Chennai, Tamil Nadu",
    city: "Chennai",
    rating: 4.8,
    reviews: 234,
    phone: "+91 44 2345 6789",
    distance: "350 km",
    open: "Open until 8:00 PM"
  }
];

export default function MapLocator() {
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState(MOCK_DOCTORS);

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

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = MOCK_DOCTORS.filter(doc => 
      doc.name.toLowerCase().includes(query) ||
      doc.specialty.toLowerCase().includes(query) ||
      doc.city.toLowerCase().includes(query) ||
      doc.expertise.some(exp => exp.toLowerCase().includes(query))
    ).sort((a, b) => {
      // Simple sorting: if location is available, we'd sort by distance
      // Here we just keep the original order or could prioritize by rating
      return b.rating - a.rating;
    });
    setFilteredDoctors(filtered);
  }, [searchQuery]);

  const openInGoogleMaps = (docName: string, address: string) => {
    const query = encodeURIComponent(`${docName} ${address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Find Doctors Across India</h1>
        <p className="text-gray-500">Locate specialists and clinics based on your current location or search by disease</p>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by disease (e.g. Skin, Eyes, Teeth) or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
      </div>

      {error && (
        <div className="p-4 bg-amber-50 border border-amber-100 text-amber-800 rounded-2xl text-sm flex items-center gap-3 font-medium">
          <MapPin className="w-5 h-5" />
          {error}
        </div>
      )}

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
            Specialists
            <span className="text-xs font-normal text-gray-400">({filteredDoctors.length} results)</span>
          </h2>
          <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doc) => (
                <motion.div
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

                  <div className="flex flex-wrap gap-1 mb-4">
                    {doc.expertise.map((exp, i) => (
                      <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {exp}
                      </span>
                    ))}
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
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400">No doctors found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
