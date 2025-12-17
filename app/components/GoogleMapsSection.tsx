'use client';

import React, { useState } from 'react';

interface GoogleMapsSectionProps {
  className?: string;
}

const GoogleMapsSection: React.FC<GoogleMapsSectionProps> = ({ className = "" }) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
  // Koordinat sekolah (diambil dari link Google Maps yang diberikan)
  const schoolLocation = {
    lat: -2.7056153, // Koordinat akurat Sumpira, Luwu Utara
    lng: 120.2847489,
    name: "UPT SD Negeri 061 Sumpira",
    address: "Jalan Trans Sumpira, Sumpira, Kec. Baebunta, Kabupaten Luwu Utara, Sulawesi Selatan 92965",
    phone: "(0423) 22345",
    mapsLink: "https://www.google.com/maps/place/UPT+SD+Negeri+061+Sumpira/@-2.7054931,120.2390834,13z/data=!4m14!1m7!3m6!1s0x2d917908ab56495b:0xea93556da05a1d17!2sUPT+SD+Negeri+061+Sumpira!8m2!3d-2.7056153!4d120.2847489!16s%2Fg%2F11h0ml7glp!3m5!1s0x2d917908ab56495b:0xea93556da05a1d17!8m2!3d-2.7056153!4d120.2847489!16s%2Fg%2F11h0ml7glp?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D",
    embedUrl: "!1m18!1m12!1m3!1d127243.98745733378!2d120.23908341224414!3d-2.7054930781394865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d917908ab56495b%3A0xea93556da05a1d17!2sUPT%20SD%20Negeri%20061%20Sumpira!5e0!3m2!1sid!2sid"
  };

  const handleDirectionsClick = () => {
    window.open(schoolLocation.mapsLink, '_blank');
  };

  const handleMapClick = () => {
    window.open(schoolLocation.mapsLink, '_blank');
  };

  const handleCallClick = () => {
    window.open(`tel:${schoolLocation.phone}`, '_self');
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6282112345678?text=Halo%2C%20saya%20ingin%20bertanya%20tentang%20PPDB%20UPT%20SD%20Negeri%20061%20Sumpira%20di%20Sumpira%2C%20Baebunta%2C%20Luwu%20Utara', '_blank');
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header Section */}
      <div className="text-center mb-8 px-4">
        <div className="inline-block bg-white/90 backdrop-blur-sm rounded-2xl px-6 md:px-8 py-6 shadow-lg mb-6 max-w-4xl">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3 flex-wrap">
            <span className="text-3xl animate-bounce">??</span>
            <span>Lokasi Sekolah</span>
          </h3>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            Temukan lokasi sekolah kami dengan mudah dan dapatkan petunjuk arah langsung ke UPT SD Negeri 061 Sumpira
          </p>
        </div>
      </div>

      {/* Maps Container */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
          {/* School Info Header */}
          <div className="bg-linear-to-r from-blue-50 to-green-50 px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-1">
                  {schoolLocation.name}
                </h4>
                <p className="text-gray-600 text-sm mb-1">
                  {schoolLocation.address}
                </p>
                <p className="text-gray-600 text-sm">
                  ?? {schoolLocation.phone}
                </p>
              </div>
              <button
                onClick={handleDirectionsClick}
                className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 shadow-md flex items-center gap-2 text-sm md:text-base whitespace-nowrap"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Petunjuk Arah
              </button>
            </div>
          </div>

          {/* Maps Display */}
          <div className="relative">
            {/* Embedded Google Maps */}
            <div className="w-full h-96 md:h-[500px] bg-gray-100 relative overflow-hidden">
              {/* Loading state */}
              {!isMapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-blue-50 to-green-50">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 font-medium">Memuat peta lokasi...</p>
                  </div>
                </div>
              )}
              
              <iframe
                src={`https://www.google.com/maps/embed?pb=${schoolLocation.embedUrl}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-b-3xl"
                title="Lokasi UPT SD Negeri 061 Sumpira"
                onLoad={() => setIsMapLoaded(true)}
              ></iframe>

              {/* Overlay click area untuk mobile */}
              <div 
                onClick={handleMapClick}
                className="absolute inset-0 bg-transparent cursor-pointer md:hidden"
                aria-label="Klik untuk membuka peta"
              />
            </div>

            {/* Info Card Overlay */}
            <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto md:max-w-sm">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shrink-0 shadow-md">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-gray-800 text-sm leading-tight mb-1">
                      {schoolLocation.name}
                    </h5>
                    <p className="text-gray-600 text-xs leading-tight mb-2">
                      {schoolLocation.address}
                    </p>
                    <button
                      onClick={handleDirectionsClick}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full font-medium transition-colors duration-200 flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Petunjuk Arah
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Mudah Dijangkau</h4>
            <p className="text-gray-600 text-sm">
              Lokasi strategis dengan akses transportasi umum yang mudah
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Jam Operasional</h4>
            <p className="text-gray-600 text-sm">
              Senin - Jumat: 07:00 - 15:00<br />
              Sabtu: 07:00 - 12:00
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Hubungi Kami</h4>
            <p className="text-gray-600 text-sm mb-3">
              Telepon: {schoolLocation.phone}<br />
              WhatsApp: 0821-XXXX-XXXX
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleCallClick}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs py-2 px-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-1"
              >
                ?? Call
              </button>
              <button
                onClick={handleWhatsAppClick}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2 px-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-1"
              >
                ?? WA
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapsSection;

