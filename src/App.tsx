// src/App.tsx

import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import NewsPage from './pages/NewsPage';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { homeOutline, heartOutline, leafOutline, bookOutline, chatbubblesOutline, personCircleOutline } from 'ionicons/icons';

// Impor semua halaman tab
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import Tab4 from './pages/Tab4';
import Tab5 from './pages/Tab5';
import Tab6 from './pages/Tab6';

// Impor halaman Login dan ProtectedRoute
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import FAQPage from './pages/FAQPage';
import AboutDeveloperPage from './pages/AboutDeveloperPage';

/* Core CSS & Theme imports */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';
import './theme/tailwind.css';

setupIonicReact({
  mode: 'md',
  animated: false,
  rippleEffect: false
});

const AppTabs: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route exact path="/tabs/tab1" render={() => <Tab1 />} />
      <Route exact path="/tabs/tab2" render={() => <Tab2 />} />
      <Route exact path="/tabs/tab3" render={() => <Tab3 />} />
      <Route exact path="/tabs/tab4" render={() => <Tab4 />} />
      <Route exact path="/tabs/tab5" render={() => <Tab5 />} />
      <Route exact path="/tabs/tab6" render={() => <Tab6 />} />
      <Route exact path="/tabs/news" render={() => <NewsPage />} />
      <Route exact path="/tabs">
        <Redirect to="/tabs/tab1" />
      </Route>
    </IonRouterOutlet>
    <IonTabBar slot="bottom">
      <IonTabButton tab="tab1" href="/tabs/tab1">
        <IonIcon icon={homeOutline} />
        <IonLabel>Beranda</IonLabel>
      </IonTabButton>
      <IonTabButton tab="tab2" href="/tabs/tab2">
        <IonIcon icon={heartOutline} />
        <IonLabel>Fisik</IonLabel>
      </IonTabButton>
      <IonTabButton tab="tab3" href="/tabs/tab3">
        <IonIcon icon={leafOutline} />
        <IonLabel>Mental</IonLabel>
      </IonTabButton>
      <IonTabButton tab="tab4" href="/tabs/tab4">
        <IonIcon icon={bookOutline} />
        <IonLabel>Edukasi</IonLabel>
      </IonTabButton>
      <IonTabButton tab="tab5" href="/tabs/tab5">
        <IonIcon icon={chatbubblesOutline} />
        <IonLabel>Forum</IonLabel>
      </IonTabButton>
      <IonTabButton tab="profil" href="/tabs/tab6">
        <IonIcon icon={personCircleOutline} />
        <IonLabel>Profil</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

const App: React.FC = () => (
  <ThemeProvider>
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/login" component={Login} />
          <Route exact path="/privacy-policy" component={PrivacyPolicyPage} />
          <Route exact path="/terms-and-conditions" component={TermsAndConditionsPage} />
          <ProtectedRoute path="/tabs" component={AppTabs} />
          <ProtectedRoute exact path="/faq" component={FAQPage} />
          <ProtectedRoute exact path="/about" component={AboutDeveloperPage} />
          <Route exact path="/">
            <Redirect to="/tabs/tab1" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </ThemeProvider>
);

export default App;