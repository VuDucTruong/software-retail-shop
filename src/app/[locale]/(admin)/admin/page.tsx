import { redirect } from 'next/navigation'
const isAuthorized = true; // TODO: check if user is authorized
export default function AdminPage() {
  if (isAuthorized) {
    redirect('admin/dashboard')
  }
  redirect('admin/login')
}
