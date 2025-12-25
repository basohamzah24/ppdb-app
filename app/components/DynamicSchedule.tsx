'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';

interface Schedule {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  type: string;
  order: number;
}

export default function DynamicSchedule() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
    // Auto refresh every 30 seconds untuk real-time update
    const interval = setInterval(fetchSchedules, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await fetch('/api/public/schedules', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      setSchedules(data.schedules || []);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format tanggal ke bahasa Indonesia
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format tanggal singkat
  const formatDateShort = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get icon berdasarkan type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'important':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'deadline':
        return <Clock className="h-5 w-5 text-orange-500" />;
      default:
        return <Calendar className="h-5 w-5 text-blue-500" />;
    }
  };

  // Get warna berdasarkan type
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'important':
        return 'from-red-50 to-red-100 border-red-200';
      case 'deadline':
        return 'from-orange-50 to-orange-100 border-orange-200';
      default:
        return 'from-blue-50 to-blue-100 border-blue-200';
    }
  };

  // Cek apakah jadwal sedang berlangsung
  const isOngoing = (schedule: Schedule) => {
    const now = new Date();
    const start = new Date(schedule.startDate);
    const end = schedule.endDate ? new Date(schedule.endDate) : start;
    
    return now >= start && now <= end;
  };

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 md:p-8 border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Jadwal Kegiatan PPDB
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start space-x-4 pb-6 border-b border-gray-200">
                <div className="shrink-0 w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 md:p-8 border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Jadwal Kegiatan PPDB
        </h2>
        <div className="text-center py-8">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Jadwal kegiatan belum tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 md:p-8 border border-blue-100">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">
          Jadwal Kegiatan PPDB
        </h2>
        <span className="text-sm text-gray-500 ml-auto">
          Update otomatis setiap 30 detik
        </span>
      </div>
      
      <div className="space-y-6">
        {schedules.map((schedule, index) => (
          <div 
            key={schedule.id} 
            className={`relative flex items-start space-x-4 pb-6 ${
              index < schedules.length - 1 ? 'border-b border-gray-200' : ''
            }`}
          >
            {/* Nomor urut dengan icon type */}
            <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${getTypeColor(schedule.type)} border`}>
              {getTypeIcon(schedule.type)}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {schedule.title}
                    </h3>
                    {isOngoing(schedule) && (
                      <span className="px-2 py-1 text-xs font-medium text-white bg-green-500 rounded-full animate-pulse">
                        BERLANGSUNG
                      </span>
                    )}
                  </div>
                  
                  {schedule.description && (
                    <p className="text-gray-600 text-sm mb-3">
                      {schedule.description}
                    </p>
                  )}
                  
                  {/* Detail jadwal */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatDate(schedule.startDate)}
                        {schedule.endDate && schedule.endDate !== schedule.startDate && (
                          <span> sampai {formatDate(schedule.endDate)}</span>
                        )}
                      </span>
                    </div>
                    
                    {(schedule.startTime || schedule.endTime) && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>
                          {schedule.startTime && (
                            <>Pukul {schedule.startTime}</>
                          )}
                          {schedule.endTime && schedule.startTime && (
                            <> - {schedule.endTime}</>
                          )}
                          {schedule.endTime && !schedule.startTime && (
                            <>Sampai {schedule.endTime}</>
                          )}
                        </span>
                      </div>
                    )}
                    
                    {schedule.location && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{schedule.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Tanggal badge */}
                <div className={`mt-3 md:mt-0 md:ml-4 px-4 py-2 rounded-lg bg-gradient-to-br ${getTypeColor(schedule.type)} border`}>
                  <span className={`font-medium text-sm ${
                    schedule.type === 'important' ? 'text-red-800' :
                    schedule.type === 'deadline' ? 'text-orange-800' :
                    'text-blue-800'
                  }`}>
                    {schedule.endDate && schedule.endDate !== schedule.startDate ? (
                      <>
                        {formatDateShort(schedule.startDate)} - {formatDateShort(schedule.endDate)}
                      </>
                    ) : (
                      formatDateShort(schedule.startDate)
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer info */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          Jadwal dapat berubah sewaktu-waktu. Selalu pantau halaman ini untuk informasi terbaru.
        </p>
      </div>
    </div>
  );
}