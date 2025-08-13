"use client"
import { useUser, RedirectToSignIn } from '@clerk/nextjs';
import AdminList from '../components/AdminList';

export default function AdminPage() {
  const { user } = useUser();

  if (!user) {
    return <RedirectToSignIn />;

  }

  return (
    <div className='grid bg-base-100'>
      <div className='text-center text-xl font-bold text-white my-5'>
        <h1>Welcome to the Admin Page</h1>
        <p className='text-lg'>You are the authorized user!</p>
      </div>
      <div className='bg-natural'>
        <AdminList />
      </div>
    </div>
  );
}
