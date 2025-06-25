'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import keycloak from './keyclock';


export default function AuthProvider({ children }) {
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    keycloak.init({ onLoad: 'check-sso' }).then(auth => {
      if (auth) {
        localStorage.setItem('token', keycloak.token);
      }
      setInitialized(true);
    });
  }, []);

  if (!initialized) return <div>Loading...</div>;

  return <>{children}</>;
}
