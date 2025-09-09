// src/components/ProtectedRoute.tsx - Alternative approach

import React, { useEffect, useState } from 'react';
import { Redirect, Route, RouteProps, useLocation } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase-config';
import { IonLoading } from '@ionic/react';

const ProtectedRoute: React.FC<RouteProps> = ({ component: Component, ...rest }) => {
  const [user, setUser] = useState<User | null>(auth.currentUser); // Langsung ambil dari auth.currentUser
  const [loading, setLoading] = useState(!auth.currentUser); // Hanya loading jika belum ada user
  const location = useLocation();

  useEffect(() => {
    // Jika sudah ada currentUser, langsung skip loading
    if (auth.currentUser) {
      setUser(auth.currentUser);
      setLoading(false);
      return;
    }

    // Reset loading untuk route baru
    setLoading(true);
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [location.pathname]); // Listen to path changes

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