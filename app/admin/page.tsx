import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'

export default async function AdminPage() {
  // Pastikan user sudah login
  await requireAuth()
  
  // Redirect ke dashboard
  redirect('/admin/dashboard')
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Masukkan password"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Ingat saya
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    Lupa password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 transform hover:scale-105"
              >
                Masuk
              </button>
            </form>

            <div className="mt-8 p-4 bg-gray-50 rounded-xl">
              <h3 className="text-sm font-medium text-gray-800 mb-2">
                ?? Akses Khusus Administrator
              </h3>
              <p className="text-xs text-gray-600">
                Halaman ini hanya untuk staf sekolah yang berwenang mengelola data PPDB.
                Gunakan kredensial yang telah diberikan oleh kepala sekolah.
              </p>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Butuh bantuan? Hubungi IT Support sekolah
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

