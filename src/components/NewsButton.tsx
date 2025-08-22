// src/components/NewsButton.tsx
import React from 'react';
import { IonIcon } from '@ionic/react';
import { newspaperOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const NewsButton: React.FC = () => {
  const history = useHistory();

  const handleNewsClick = () => {
    console.log('News button clicked');
    console.log('Current path:', window.location.pathname);
    console.log('Navigating to /tabs/news...');

    history.push('/tabs/news');
  };

  return (
    <div
      className="flex items-center justify-center cursor-pointer"
      onClick={handleNewsClick}
    >
      <IonIcon
        icon={newspaperOutline}
        className="text-white text-2xl"
      />
    </div>
  );
};

export default NewsButton;