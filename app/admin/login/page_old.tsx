// app/admin/login/page.tsx
import { loginAction } from '@/lib/actions/auth'

export default async function AdminLogin() {
  // Komponen login bisa memakai form server action
  return (
    <form action={loginAction}>
      <input name="username" placeholder="Username" required />
      <input name="password" placeholder="Password" type="password" required />
      <button type="submit">Login</button>
    </form>
  )
}
