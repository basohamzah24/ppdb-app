import { getPPDBSettings, updatePPDBSettings } from '../actions/content'

export default async function AdminPPDBSettingsPage() {
  const settings = await getPPDBSettings()

  async function handleUpdateSettings(formData: FormData) {
    'use server'
    const tahunAjaran = formData.get('tahunAjaran') as string
    const tanggalBuka = formData.get('tanggalBuka') as string
    const tanggalTutup = formData.get('tanggalTutup') as string
    const kuotaSiswa = parseInt(formData.get('kuotaSiswa') as string)
    const statusPendaftaran = formData.get('statusPendaftaran') as 'buka' | 'tutup'
    const persyaratan = (formData.get('persyaratan') as string)?.split('\n').filter(Boolean) || []
    const alurPendaftaran = (formData.get('alurPendaftaran') as string)?.split('\n').filter(Boolean) || []
    const informasiTambahan = formData.get('informasiTambahan') as string

    if (tahunAjaran && tanggalBuka && tanggalTutup && !isNaN(kuotaSiswa) && statusPendaftaran) {
      await updatePPDBSettings(formData)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Pengaturan PPDB</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form action={handleUpdateSettings} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="tahunAjaran" className="block text-sm font-medium text-gray-700 mb-1">
                Tahun Ajaran *
              </label>
              <input
                type="text"
                id="tahunAjaran"
                name="tahunAjaran"
                defaultValue={settings?.tahunAjaran || ''}
                placeholder="2024/2025"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="kuotaSiswa" className="block text-sm font-medium text-gray-700 mb-1">
                Kuota Siswa *
              </label>
              <input
                type="number"
                id="kuotaSiswa"
                name="kuotaSiswa"
                defaultValue={settings?.kuotaSiswa || ''}
                placeholder="100"
                min="1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="tanggalBuka" className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Buka Pendaftaran *
              </label>
              <input
                type="datetime-local"
                id="tanggalBuka"
                name="tanggalBuka"
                defaultValue={settings ? new Date(settings.tanggalBuka).toISOString().slice(0, 16) : ''}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="tanggalTutup" className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Tutup Pendaftaran *
              </label>
              <input
                type="datetime-local"
                id="tanggalTutup"
                name="tanggalTutup"
                defaultValue={settings ? new Date(settings.tanggalTutup).toISOString().slice(0, 16) : ''}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="statusPendaftaran" className="block text-sm font-medium text-gray-700 mb-1">
              Status Pendaftaran
            </label>
            <select
              id="statusPendaftaran"
              name="statusPendaftaran"
              defaultValue={settings?.statusPendaftaran || 'tutup'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="tutup">Tutup</option>
              <option value="buka">Buka</option>
            </select>
          </div>

          <div>
            <label htmlFor="persyaratan" className="block text-sm font-medium text-gray-700 mb-1">
              Persyaratan Pendaftaran
            </label>
            <textarea
              id="persyaratan"
              name="persyaratan"
              rows={8}
              defaultValue={settings?.persyaratan ? (settings.persyaratan as string[]).join('\n') : ''}
              placeholder="Tulis setiap persyaratan dalam baris baru:
Fotokopi Akta Kelahiran
Fotokopi Kartu Keluarga
Pas foto 3x4 sebanyak 2 lembar
..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="alurPendaftaran" className="block text-sm font-medium text-gray-700 mb-1">
              Alur Pendaftaran
            </label>
            <textarea
              id="alurPendaftaran"
              name="alurPendaftaran"
              rows={8}
              defaultValue={settings?.alurPendaftaran ? (settings.alurPendaftaran as string[]).join('\n') : ''}
              placeholder="Tulis setiap langkah dalam baris baru:
1. Daftar online melalui website
2. Upload dokumen persyaratan
3. Verifikasi berkas oleh sekolah
4. Pengumuman hasil seleksi
..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="informasiTambahan" className="block text-sm font-medium text-gray-700 mb-1">
              Informasi Tambahan
            </label>
            <textarea
              id="informasiTambahan"
              name="informasiTambahan"
              rows={4}
              defaultValue={settings?.informasiTambahan || ''}
              placeholder="Informasi tambahan tentang PPDB..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Simpan Pengaturan
            </button>
          </div>
        </form>
        
        {settings && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Terakhir diupdate: {new Date(settings.updatedAt).toLocaleString('id-ID')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}