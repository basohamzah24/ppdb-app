import PublicHeader from '@/components/PublicHeader'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar Public selalu tampil untuk route public */}
      <PublicHeader />
      
      {/* Content area */}
      <main>
        {children}
      </main>
      
      {/* Footer bisa ditambahkan di sini */}
    </div>
  )
}