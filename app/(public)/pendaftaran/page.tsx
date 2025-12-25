'use client';

import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';

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

  const [dokumen, setDokumen] = useState({
    akta_kelahiran: null as File | null,
    kartu_keluarga: null as File | null,
    foto_siswa: null as File | null
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, jenisFile: string) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Ukuran file maksimal 5MB');
        setMessageType('error');
        return;
      }

      // Validasi tipe file
      const allowedTypes = jenisFile === 'foto_siswa' 
        ? ['image/jpeg', 'image/jpg', 'image/png'] 
        : ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      
      if (!allowedTypes.includes(file.type)) {
        const expectedTypes = jenisFile === 'foto_siswa' ? 'JPG, PNG' : 'PDF, JPG, PNG';
        setMessage(`Format file tidak valid. Gunakan: ${expectedTypes}`);
        setMessageType('error');
        return;
      }

      setDokumen({
        ...dokumen,
        [jenisFile]: file
      });
      setMessage('');
    }
  };

  const removeFile = (jenisFile: string) => {
    setDokumen({
      ...dokumen,
      [jenisFile]: null
    });
  };

  const validateForm = () => {
    const { nama, nik, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, agama, nama_ayah, nama_ibu, no_telp, jalur_pendaftaran } = formData;
    
    // Field wajib
    if (!nama || !nik || !tempat_lahir || !tanggal_lahir || !jenis_kelamin || 
        !alamat || !agama || !nama_ayah || !nama_ibu || !no_telp || !jalur_pendaftaran) {
      return 'Semua field wajib (*) harus diisi';
    }
    
    // Validasi dokumen wajib
    if (!dokumen.akta_kelahiran || !dokumen.kartu_keluarga || !dokumen.foto_siswa) {
      return 'Semua dokumen wajib harus diupload (Akta Kelahiran, Kartu Keluarga, Foto 3x4)';
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
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Add form data
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });
      
      // Add files
      if (dokumen.akta_kelahiran) submitData.append('akta_kelahiran', dokumen.akta_kelahiran);
      if (dokumen.kartu_keluarga) submitData.append('kartu_keluarga', dokumen.kartu_keluarga);
      if (dokumen.foto_siswa) submitData.append('foto_siswa', dokumen.foto_siswa);

      const response = await fetch('/api/pendaftaran', {
        method: 'POST',
        body: submitData, // FormData instead of JSON
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Data Calon Siswa + Upload Dokumen */}
              <div className="bg-blue-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                  <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2">1</span>
                  Data & Dokumen Calon Siswa
                </h3>
                
                {/* Basic Student Data - Compact Table Style */}
                <div className="bg-white rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-gray-800 mb-3">Informasi Dasar Siswa</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nama lengkap sesuai akta kelahiran"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="nik" className="block text-sm font-medium text-gray-700 mb-1">
                        NIK *
                      </label>
                      <input
                        type="text"
                        id="nik"
                        name="nik"
                        value={formData.nik}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Alamat lengkap sesuai KTP"
                      rows={2}
                      required
                    />
                  </div>
                </div>

                {/* Upload Dokumen - Langsung setelah data siswa */}
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                    <Upload className="h-4 w-4 mr-2 text-green-600" />
                    Upload Dokumen Wajib
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Akta Kelahiran */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Akta Kelahiran *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-green-400 transition-colors">
                        {dokumen.akta_kelahiran ? (
                          <div className="bg-green-50 rounded-lg p-2">
                            <FileText className="h-6 w-6 text-green-600 mx-auto mb-1" />
                            <p className="text-xs font-medium text-green-800 truncate">{dokumen.akta_kelahiran.name}</p>
                            <p className="text-xs text-green-600">{(dokumen.akta_kelahiran.size / 1024 / 1024).toFixed(2)} MB</p>
                            <button
                              type="button"
                              onClick={() => removeFile('akta_kelahiran')}
                              className="mt-1 text-red-500 hover:text-red-700 text-xs"
                            >
                              Hapus
                            </button>
                          </div>
                        ) : (
                          <div>
                            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                            <input
                              type="file"
                              id="akta_kelahiran"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileChange(e, 'akta_kelahiran')}
                              className="hidden"
                            />
                            <label
                              htmlFor="akta_kelahiran"
                              className="cursor-pointer text-green-600 hover:text-green-700 font-medium text-sm"
                            >
                              Upload Akta
                            </label>
                            <p className="text-xs text-gray-500 mt-1">PDF/JPG/PNG, Max 5MB</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Kartu Keluarga */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kartu Keluarga *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-green-400 transition-colors">
                        {dokumen.kartu_keluarga ? (
                          <div className="bg-green-50 rounded-lg p-2">
                            <FileText className="h-6 w-6 text-green-600 mx-auto mb-1" />
                            <p className="text-xs font-medium text-green-800 truncate">{dokumen.kartu_keluarga.name}</p>
                            <p className="text-xs text-green-600">{(dokumen.kartu_keluarga.size / 1024 / 1024).toFixed(2)} MB</p>
                            <button
                              type="button"
                              onClick={() => removeFile('kartu_keluarga')}
                              className="mt-1 text-red-500 hover:text-red-700 text-xs"
                            >
                              Hapus
                            </button>
                          </div>
                        ) : (
                          <div>
                            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                            <input
                              type="file"
                              id="kartu_keluarga"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileChange(e, 'kartu_keluarga')}
                              className="hidden"
                            />
                            <label
                              htmlFor="kartu_keluarga"
                              className="cursor-pointer text-green-600 hover:text-green-700 font-medium text-sm"
                            >
                              Upload KK
                            </label>
                            <p className="text-xs text-gray-500 mt-1">PDF/JPG/PNG, Max 5MB</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Foto Siswa */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Foto 3x4 Latar Merah *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-green-400 transition-colors">
                        {dokumen.foto_siswa ? (
                          <div className="bg-green-50 rounded-lg p-2">
                            <FileText className="h-6 w-6 text-green-600 mx-auto mb-1" />
                            <p className="text-xs font-medium text-green-800 truncate">{dokumen.foto_siswa.name}</p>
                            <p className="text-xs text-green-600">{(dokumen.foto_siswa.size / 1024 / 1024).toFixed(2)} MB</p>
                            <button
                              type="button"
                              onClick={() => removeFile('foto_siswa')}
                              className="mt-1 text-red-500 hover:text-red-700 text-xs"
                            >
                              Hapus
                            </button>
                          </div>
                        ) : (
                          <div>
                            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                            <input
                              type="file"
                              id="foto_siswa"
                              accept=".jpg,.jpeg,.png"
                              onChange={(e) => handleFileChange(e, 'foto_siswa')}
                              className="hidden"
                            />
                            <label
                              htmlFor="foto_siswa"
                              className="cursor-pointer text-green-600 hover:text-green-700 font-medium text-sm"
                            >
                              Upload Foto
                            </label>
                            <p className="text-xs text-gray-500 mt-1">JPG/PNG, Max 5MB</p>
                            <p className="text-xs text-orange-600 mt-1">âš ï¸ Latar merah, ukuran 3x4</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-3 mt-4">
                    <h5 className="text-xs font-medium text-blue-800 mb-1">ðŸ“‹ Catatan Dokumen:</h5>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>â€¢ Semua 3 dokumen wajib diupload</li>
                      <li>â€¢ Pastikan dokumen jelas dan tidak blur</li>
                      <li>â€¢ Format: PDF untuk dokumen, JPG/PNG untuk foto</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Data Orang Tua */}
              <div className="bg-green-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                  <span className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2">2</span>
                  Data Orang Tua/Wali
                </h3>
                
                <div className="bg-white rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Pekerjaan ibu"
                      />
                    </div>

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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Kosongkan jika sama dengan alamat anak"
                    />
                  </div>
                </div>
              </div>

              {/* Data Pendaftaran */}
              <div className="bg-orange-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
                  <span className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2">3</span>
                  Data Pendaftaran
                </h3>
                
                <div className="bg-white rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="jalur_pendaftaran" className="block text-sm font-medium text-gray-700 mb-1">
                        Jalur Pendaftaran *
                      </label>
                      <select
                        id="jalur_pendaftaran"
                        name="jalur_pendaftaran"
                        value={formData.jalur_pendaftaran}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tuliskan prestasi yang pernah diraih (jika ada)"
                    />
                  </div>
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
                    <li>âœ“ Data yang dimasukkan adalah benar dan dapat dipertanggungjawabkan</li>
                    <li>âœ“ Saya bersedia memenuhi persyaratan yang telah ditetapkan</li>
                    <li>âœ“ Saya memahami ketentuan dan prosedur PPDB yang berlaku</li>
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
