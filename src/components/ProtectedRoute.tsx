// src/components/ProtectedRoute.tsx

import React, { useEffect, useState } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase-config'; // <-- PERUBAHAN DI SINI
import { IonLoading } from '@ionic/react';

const ProtectedRoute: React.FC<RouteProps> = ({ component: Component, ...rest }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kita langsung gunakan 'auth' yang sudah diimpor
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []); // Hapus [auth] karena instance-nya stabil

  if (loading) {
    return <IonLoading isOpen={true} message={'Memuat...'} />;
  }

  if (!Component) return null;

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default ProtectedRoute;