'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import keycloak from './utils/keyclock';

export default function Providers({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    keycloak.init({ onLoad: 'login-required' }).then(auth => {
      if (auth) {
        setIsAuthenticated(true);
        localStorage.setItem("token", keycloak.token);
        router.push('/dashboard');
      }
    });
  }, []);

  if (!isAuthenticated) return <div>Loading...</div>;
  return children;
}
