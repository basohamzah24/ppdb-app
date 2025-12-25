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
      <div className="space-y-6">
        {/* Header dengan tombol tambah */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Manajemen Jadwal</h2>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {showForm ? 'Tutup Form' : 'Tambah Jadwal'}
          </Button>
        </div>

        {/* Form Input */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingId ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Judul Kegiatan *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Contoh: Pendaftaran Online"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Jenis Kegiatan</Label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="regular">Regular</option>
                      <option value="important">Penting</option>
                      <option value="deadline">Deadline</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Deskripsi detail kegiatan..."
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Tanggal Mulai *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Tanggal Selesai</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Jam Mulai</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">Jam Selesai</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Lokasi</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="Contoh: Ruang Lab Komputer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="order">Urutan Tampil</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({...formData, order: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {submitting ? 'Menyimpan...' : (editingId ? 'Update' : 'Simpan')}
                  </Button>
                  <Button 
                    type="button" 
                    onClick={resetForm}
                    variant="outline"
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Daftar Jadwal */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Jadwal ({schedules.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Memuat jadwal...</p>
              </div>
            ) : schedules.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada jadwal</h3>
                <p className="text-gray-500 mb-4">Klik "Tambah Jadwal" untuk membuat jadwal baru</p>
              </div>
            ) : (
              <div className="space-y-4">
                {schedules.map((schedule) => (
                  <div key={schedule.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{schedule.title}</h3>
                          <Badge className={`text-white ${getBadgeColor(schedule.type)}`}>
                            {schedule.type === 'important' ? 'Penting' : 
                             schedule.type === 'deadline' ? 'Deadline' : 'Regular'}
                          </Badge>
                        </div>
                        
                        {schedule.description && (
                          <p className="text-gray-600 mb-3">{schedule.description}</p>
                        )}
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(schedule.startDate)}</span>
                            {schedule.endDate && (
                              <span> - {formatDate(schedule.endDate)}</span>
                            )}
                          </div>
                          
                          {schedule.startTime && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>{schedule.startTime}</span>
                              {schedule.endTime && <span> - {schedule.endTime}</span>}
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
                      
                      <div className="flex gap-2 ml-4">
                        <Button 
                          size="sm" 
                          onClick={() => handleEdit(schedule)}
                          className="flex items-center gap-1"
                          variant="outline"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDelete(schedule.id, schedule.title)}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Hapus
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