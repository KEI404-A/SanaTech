// src/AppTabs.tsx

import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { homeOutline, heartOutline, leafOutline, bookOutline, chatbubblesOutline } from 'ionicons/icons';

// Impor halaman-halaman untuk Tab Bar
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import Tab4 from './pages/Tab4';
import Tab5 from './pages/Tab5';

const AppTabs: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route exact path="/app/tabs/beranda" component={Tab1} /> 
      <Route exact path="/app/tabs/fisik" component={Tab2} />
      <Route exact path="/app/tabs/mental" component={Tab3} />
      <Route exact path="/app/tabs/edukasi" component={Tab4} />
      <Route exact path="/app/tabs/forum" component={Tab5} />
      <Route exact path="/app/tabs">
        <Redirect to="/app/tabs/beranda" />
      </Route>
    </IonRouterOutlet>

    <IonTabBar slot="bottom">
      <IonTabButton tab="beranda" href="/app/tabs/beranda"><IonIcon icon={homeOutline} /><IonLabel>Beranda</IonLabel></IonTabButton>
      <IonTabButton tab="fisik" href="/app/tabs/fisik"><IonIcon icon={heartOutline} /><IonLabel>Fisik</IonLabel></IonTabButton>
      <IonTabButton tab="mental" href="/app/tabs/mental"><IonIcon icon={leafOutline} /><IonLabel>Mental</IonLabel></IonTabButton>
      <IonTabButton tab="edukasi" href="/app/tabs/edukasi"><IonIcon icon={bookOutline} /><IonLabel>Edukasi</IonLabel></IonTabButton>
      <IonTabButton tab="forum" href="/app/tabs/forum"><IonIcon icon={chatbubblesOutline} /><IonLabel>Forum</IonLabel></IonTabButton>
    </IonTabBar>
  </IonTabs>
);

export default AppTabs;