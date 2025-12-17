import { redirect } from 'next/navigation'
import { getCurrentAdmin, loginAction } from '@/lib/auth'

interface AdminLoginProps {
  searchParams: Promise<{
    error?: string
  }>
}

export default async function LoginPage({ searchParams }: AdminLoginProps) {
  const params = await searchParams
  
  // Jika sudah login, redirect ke dashboard
  const currentUser = await getCurrentAdmin()
  if (currentUser) {
    redirect('/admin')
  }

  const errorMessage = {
    'missing-credentials': 'Username dan password harus diisi',
    'invalid-credentials': 'Username atau password salah',
    'server-error': 'Terjadi kesalahan server'
  }[params.error || ''] || null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin PPDB Online
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Silakan masuk dengan akun admin Anda
          </p>
        </div>
        
        <form className="mt-8 space-y-6" action={loginAction}>
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errorMessage}
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Masuk
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Username: <span className="font-mono bg-gray-100 px-1">admin</span><br/>
              Password: <span className="font-mono bg-gray-100 px-1">admin123</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}