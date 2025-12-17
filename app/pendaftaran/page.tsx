'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';

export default function PendaftaranPage() {
  const [formData, setFormData] = useState({
    // Data Calon Siswa
    nama: '',
    nik: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    jenis_kelamin: '',
    alamat: '',
    agama: '',
    anak_ke: '',
    jumlah_saudara: '',
    
    // Data Orang Tua
    nama_ayah: '',
    pekerjaan_ayah: '',
    nama_ibu: '',
    pekerjaan_ibu: '',
    alamat_ortu: '',
    no_telp: '',
    email: '',
    
    // Data Pendaftaran
    jalur_pendaftaran: '',
    asal_sekolah: '',
    prestasi: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const { nama, nik, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, agama, nama_ayah, nama_ibu, no_telp, jalur_pendaftaran } = formData;
    
    // Field wajib
    if (!nama || !nik || !tempat_lahir || !tanggal_lahir || !jenis_kelamin || 
        !alamat || !agama || !nama_ayah || !nama_ibu || !no_telp || !jalur_pendaftaran) {
      return 'Semua field wajib (*) harus diisi';
    }
    
    // Validasi NIK (16 digit)
    if (!/^\d{16}$/.test(nik)) {
      return 'NIK harus terdiri dari 16 digit angka';
    }
    
    // Validasi email jika ada
    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        return 'Format email tidak valid';
      }
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setMessage(validationError);
      setMessageType('error');
      return;
    }

    setIsSubmitting(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/pendaftaran', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Redirect ke halaman success
        window.location.href = '/success';
      } else {
        setMessage(result.error || 'Terjadi kesalahan saat mendaftar');
        setMessageType('error');
      }
    } catch (error: unknown) {
      console.error('Network error:', error);
      setMessage('Terjadi kesalahan jaringan. Silakan coba lagi.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Form Pendaftaran PPDB
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            UPT SD Negeri 061 Sumpira - Tahun Ajaran 2025/2026
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 md:p-8 border border-blue-100">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Formulir Pendaftaran Calon Siswa Baru
              </h2>
              <p className="text-gray-600 text-sm">
                Harap lengkapi semua data dengan benar dan sesuai dengan dokumen resmi
              </p>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`p-4 rounded-lg mb-6 ${
                messageType === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Data Calon Siswa */}
              <div className="bg-blue-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                  <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2">1</span>
                  Data Calon Siswa
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      id="nama"
                      name="nama"
                      value={formData.nama}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nama lengkap sesuai akta kelahiran"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="nik" className="block text-sm font-medium text-gray-700 mb-1">
                      NIK (Nomor Induk Kependudukan) *
                    </label>
                    <input
                      type="text"
                      id="nik"
                      name="nik"
                      value={formData.nik}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="16 digit NIK"
                      maxLength={16}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="tempat_lahir" className="block text-sm font-medium text-gray-700 mb-1">
                      Tempat Lahir *
                    </label>
                    <input
                      type="text"
                      id="tempat_lahir"
                      name="tempat_lahir"
                      value={formData.tempat_lahir}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Jakarta"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="tanggal_lahir" className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Lahir *
                    </label>
                    <input
                      type="date"
                      id="tanggal_lahir"
                      name="tanggal_lahir"
                      value={formData.tanggal_lahir}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="jenis_kelamin" className="block text-sm font-medium text-gray-700 mb-1">
                      Jenis Kelamin *
                    </label>
                    <select
                      id="jenis_kelamin"
                      name="jenis_kelamin"
                      value={formData.jenis_kelamin}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Pilih jenis kelamin</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="agama" className="block text-sm font-medium text-gray-700 mb-1">
                      Agama *
                    </label>
                    <select
                      id="agama"
                      name="agama"
                      value={formData.agama}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Pilih agama</option>
                      <option value="Islam">Islam</option>
                      <option value="Kristen">Kristen</option>
                      <option value="Katolik">Katolik</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Buddha">Buddha</option>
                      <option value="Konghucu">Konghucu</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="anak_ke" className="block text-sm font-medium text-gray-700 mb-1">
                      Anak Ke
                    </label>
                    <input
                      type="number"
                      id="anak_ke"
                      name="anak_ke"
                      value={formData.anak_ke}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="1"
                      min="1"
                    />
                  </div>

                  <div>
                    <label htmlFor="jumlah_saudara" className="block text-sm font-medium text-gray-700 mb-1">
                      Jumlah Saudara
                    </label>
                    <input
                      type="number"
                      id="jumlah_saudara"
                      name="jumlah_saudara"
                      value={formData.jumlah_saudara}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="alamat" className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat Lengkap *
                  </label>
                  <textarea
                    id="alamat"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Alamat lengkap sesuai Kartu Keluarga"
                    required
                  ></textarea>
                </div>
              </div>

              {/* Data Orang Tua */}
              <div className="bg-green-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                  <span className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2">2</span>
                  Data Orang Tua/Wali
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nama_ayah" className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Ayah *
                    </label>
                    <input
                      type="text"
                      id="nama_ayah"
                      name="nama_ayah"
                      value={formData.nama_ayah}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nama lengkap ayah"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="pekerjaan_ayah" className="block text-sm font-medium text-gray-700 mb-1">
                      Pekerjaan Ayah
                    </label>
                    <input
                      type="text"
                      id="pekerjaan_ayah"
                      name="pekerjaan_ayah"
                      value={formData.pekerjaan_ayah}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Pekerjaan ayah"
                    />
                  </div>

                  <div>
                    <label htmlFor="nama_ibu" className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Ibu *
                    </label>
                    <input
                      type="text"
                      id="nama_ibu"
                      name="nama_ibu"
                      value={formData.nama_ibu}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nama lengkap ibu"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="pekerjaan_ibu" className="block text-sm font-medium text-gray-700 mb-1">
                      Pekerjaan Ibu
                    </label>
                    <input
                      type="text"
                      id="pekerjaan_ibu"
                      name="pekerjaan_ibu"
                      value={formData.pekerjaan_ibu}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Pekerjaan ibu"
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="no_telp" className="block text-sm font-medium text-gray-700 mb-1">
                      Nomor Telepon *
                    </label>
                    <input
                      type="tel"
                      id="no_telp"
                      name="no_telp"
                      value={formData.no_telp}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="081234567890"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="email@contoh.com"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="alamat_ortu" className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat Orang Tua (jika berbeda dengan anak)
                  </label>
                  <textarea
                    id="alamat_ortu"
                    name="alamat_ortu"
                    value={formData.alamat_ortu}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Kosongkan jika sama dengan alamat anak"
                  ></textarea>
                </div>
              </div>

              {/* Data Pendaftaran */}
              <div className="bg-orange-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
                  <span className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2">3</span>
                  Data Pendaftaran
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="jalur_pendaftaran" className="block text-sm font-medium text-gray-700 mb-1">
                      Jalur Pendaftaran *
                    </label>
                    <select
                      id="jalur_pendaftaran"
                      name="jalur_pendaftaran"
                      value={formData.jalur_pendaftaran}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Pilih jalur pendaftaran</option>
                      <option value="Zonasi">Jalur Zonasi (70%)</option>
                      <option value="Afirmasi">Jalur Afirmasi (15%)</option>
                      <option value="Perpindahan">Jalur Perpindahan Tugas Orang Tua (5%)</option>
                      <option value="Prestasi">Jalur Prestasi (10%)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="asal_sekolah" className="block text-sm font-medium text-gray-700 mb-1">
                      Asal Sekolah (TK/RA)
                    </label>
                    <input
                      type="text"
                      id="asal_sekolah"
                      name="asal_sekolah"
                      value={formData.asal_sekolah}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nama TK/RA sebelumnya"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="prestasi" className="block text-sm font-medium text-gray-700 mb-1">
                    Prestasi (khusus untuk jalur prestasi)
                  </label>
                  <textarea
                    id="prestasi"
                    name="prestasi"
                    value={formData.prestasi}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tuliskan prestasi yang pernah diraih (jika ada)"
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <div className="bg-gray-50 rounded-2xl p-6 text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full md:w-auto px-8 py-4 rounded-xl font-semibold text-white text-lg transition duration-200 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? 'Sedang Mendaftar...' : 'Kirim Formulir Pendaftaran'}
                </button>
                
                <div className="mt-4 text-sm text-gray-600">
                  <p className="mb-2">Dengan mengirim formulir ini, saya menyatakan bahwa:</p>
                  <ul className="text-xs space-y-1 max-w-md mx-auto">
                    <li>� Data yang dimasukkan adalah benar dan dapat dipertanggungjawabkan</li>
                    <li>� Saya bersedia memenuhi persyaratan yang telah ditetapkan</li>
                    <li>� Saya memahami ketentuan dan prosedur PPDB yang berlaku</li>
                  </ul>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

