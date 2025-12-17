import { getCurrentAdmin } from '@/lib/auth'
import { AdminLayoutClient } from '@/components/AdminLayoutClient'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Auth sudah ditangani oleh middleware, tapi kita ambil user info
  const currentUser = await getCurrentAdmin()
  
  // Fallback jika somehow user null (middleware seharusnya menangani ini)
  const adminName = currentUser?.username || 'Admin PPDB'

  return (
    <AdminLayoutClient adminName={adminName}>
      {children}
    </AdminLayoutClient>
  )
}

