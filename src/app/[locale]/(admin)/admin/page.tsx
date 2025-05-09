'use client'
import LoadingPage from '@/components/special/LoadingPage';
import { useAuthStore } from '@/stores/auth.store'
import { useEffect } from 'react'

export default function AdminPage() {
  
    const getUser = useAuthStore((state) => state.getUser);

    useEffect(() => {
        getUser();
    }, []);


    return LoadingPage();


}
