'use client'

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Edit, Trash2, Clock, MapPin } from 'lucide-react';

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
  updatedAt: string;
}

interface FormData {
  id?: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  type: string;
  order: string;
}

export default function AdminJadwal() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    type: 'regular',
    order: '0'
  });

  // Load jadwal
  const loadSchedules = async () => {
    try {
      const response = await fetch('/api/admin/schedules');
      const data = await response.json();
      setSchedules(data.schedules || []);
    } catch (error) {
      console.error('Error loading schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      location: '',
      type: 'regular',
      order: '0'
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.startDate) {
      alert('Judul dan tanggal mulai harus diisi!');
      return;
    }

    setSubmitting(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const payload = editingId 
        ? { id: editingId, ...formData }
        : formData;

      const response = await fetch('/api/admin/schedules', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (response.ok) {
        alert(result.message);
        resetForm();
        loadSchedules();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan: ' + error);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (schedule: Schedule) => {
    setFormData({
      title: schedule.title,
      description: schedule.description || '',
      startDate: schedule.startDate.split('T')[0],
      endDate: schedule.endDate ? schedule.endDate.split('T')[0] : '',
      startTime: schedule.startTime || '',
      endTime: schedule.endTime || '',
      location: schedule.location || '',
      type: schedule.type,
      order: schedule.order.toString()
    });
    setEditingId(schedule.id);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus jadwal "${title}"?`)) return;

    try {
      const response = await fetch(`/api/admin/schedules?id=${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert(result.message);
        loadSchedules();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal menghapus jadwal: ' + error);
    }
  };

  // Format tanggal Indonesia
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get badge color
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'important': return 'bg-red-500';
      case 'deadline': return 'bg-orange-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <AdminLayout 
      title="Jadwal" 
      subtitle="Kelola jadwal dan regulasi PPDB"
    >
      <div className="space-y-8">
        {/* Header dengan tombol tambah */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-xl border border-blue-100 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Manajemen Jadwal
                </h1>
                <p className="text-gray-600 mt-1">
                  Kelola jadwal kegiatan PPDB
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] px-6"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              {showForm ? 'Tutup Form' : 'Tambah Jadwal'}
            </Button>
          </div>
        </div>

        {/* Form Input */}
        {showForm && (
          <Card className="shadow-sm border-2 hover:border-blue-200 transition-all duration-300 hover:shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-sm">
                  <Edit className="h-5 w-5 text-white" />
                </div>
                <span className="text-gray-800">
                  {editingId ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700">Judul Kegiatan *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Contoh: Pendaftaran Online"
                      required
                      className="border-2 focus:border-blue-400 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-sm font-medium text-gray-700">Jenis Kegiatan</Label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full p-3 border-2 border-gray-200 rounded-md focus:border-blue-400 focus:ring-0 transition-colors bg-white"
                    >
                      <option value="regular">Regular</option>
                      <option value="important">Penting</option>
                      <option value="deadline">Deadline</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Deskripsi detail kegiatan..."
                    rows={3}
                    className="border-2 focus:border-blue-400 transition-colors resize-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">Tanggal Mulai *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      required
                      className="border-2 focus:border-blue-400 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">Tanggal Selesai</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="border-2 focus:border-blue-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startTime" className="text-sm font-medium text-gray-700">Jam Mulai</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                      className="border-2 focus:border-blue-400 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime" className="text-sm font-medium text-gray-700">Jam Selesai</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                      className="border-2 focus:border-blue-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium text-gray-700">Lokasi</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="Contoh: Ruang Lab Komputer"
                      className="border-2 focus:border-blue-400 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order" className="text-sm font-medium text-gray-700">Urutan Tampil</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({...formData, order: e.target.value})}
                      placeholder="0"
                      className="border-2 focus:border-blue-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-6"
                  >
                    {submitting ? 'Menyimpan...' : (editingId ? 'Update' : 'Simpan')}
                  </Button>
                  {editingId && (
                    <Button 
                      type="button" 
                      onClick={resetForm}
                      variant="outline"
                      className="border-2 hover:border-gray-400 transition-colors px-6"
                    >
                      Batal
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Daftar Jadwal */}
        <Card className="shadow-sm border-2 hover:border-blue-200 transition-all duration-300 hover:shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-sm">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="text-gray-800">Daftar Jadwal ({schedules.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">{loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-3 text-gray-500 font-medium">Memuat jadwal...</p>
              </div>
            ) : schedules.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada jadwal</h3>
                <p className="text-gray-500 mb-4">Klik "Tambah Jadwal" untuk membuat jadwal baru</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">{schedules.map((schedule) => (
                  <div key={schedule.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{schedule.title}</h3>
                          <Badge className={`text-white px-3 py-1 font-medium ${getBadgeColor(schedule.type)}`}>
                            {schedule.type === 'important' ? 'Penting' : 
                             schedule.type === 'deadline' ? 'Deadline' : 'Regular'}
                          </Badge>
                        </div>
                        
                        {schedule.description && (
                          <p className="text-gray-600 mb-3 leading-relaxed">{schedule.description}</p>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(schedule.startDate)}</span>
                            {schedule.endDate && (
                              <span> - {formatDate(schedule.endDate)}</span>
                            )}
                          </div>
                          
                          {schedule.startTime && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{schedule.startTime}</span>
                              {schedule.endTime && <span> - {schedule.endTime}</span>}
                            </div>
                          )}
                          
                          {schedule.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{schedule.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button 
                          size="sm" 
                          onClick={() => handleEdit(schedule)}
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleDelete(schedule.id, schedule.title)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}