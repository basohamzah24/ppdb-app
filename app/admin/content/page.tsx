import { getAllSiteContent, updateSiteContent } from '../actions/content'

export default async function AdminContentPage() {
  const allContent = await getAllSiteContent()

  // Predefined content keys untuk kemudahan - gunakan underscore sesuai database
  const contentTypes = [
    { key: 'hero_title', title: 'Judul Hero', type: 'hero' },
    { key: 'hero_subtitle', title: 'Subtitle Hero', type: 'hero' },
    { key: 'hero_description', title: 'Deskripsi Hero', type: 'hero' },
    { key: 'about_title', title: 'Tentang Sekolah - Judul', type: 'info' },
    { key: 'about_content', title: 'Tentang Sekolah - Konten', type: 'info' },
    { key: 'contact_address', title: 'Alamat Sekolah', type: 'contact' },
    { key: 'contact_phone', title: 'Nomor Telepon', type: 'contact' },
    { key: 'contact_email', title: 'Email Sekolah', type: 'contact' },
    { key: 'announcement_main', title: 'Pengumuman Utama', type: 'announcement' },
  ]

  async function handleUpdateContent(formData: FormData) {
    'use server'
    const key = formData.get('key') as string
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const type = formData.get('type') as string

    if (key && title && content && type) {
      await updateSiteContent(formData)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Manajemen Konten</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {contentTypes.map((contentType) => {
          const existingContent = allContent.find(c => c.key === contentType.key)
          
          return (
            <div key={contentType.key} className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{contentType.title}</h2>
              
              <form action={handleUpdateContent} className="space-y-4">
                <input type="hidden" name="key" value={contentType.key} />
                <input type="hidden" name="type" value={contentType.type} />
                
                <div>
                  <label htmlFor={`title-${contentType.key}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Judul
                  </label>
                  <input
                    type="text"
                    id={`title-${contentType.key}`}
                    name="title"
                    defaultValue={existingContent?.title || contentType.title}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor={`content-${contentType.key}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Konten
                  </label>
                  <textarea
                    id={`content-${contentType.key}`}
                    name="content"
                    rows={4}
                    defaultValue={existingContent?.content || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Masukkan konten..."
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`active-${contentType.key}`}
                    name="isActive"
                    value="true"
                    defaultChecked={existingContent?.isActive !== false}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`active-${contentType.key}`} className="ml-2 block text-sm text-gray-900">
                    Aktifkan konten
                  </label>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Simpan
                </button>
              </form>
              
              {existingContent && (
                <div className="mt-4 text-sm text-gray-500">
                  Terakhir diupdate: {new Date(existingContent.updatedAt).toLocaleString('id-ID')}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}