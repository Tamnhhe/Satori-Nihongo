import * as React from 'react';
import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import createStore from './app/shared/reducers';
import * as SplashScreen from 'expo-splash-screen';
import 'setimmediate';

import NavContainer from './app/navigation/nav-container';
import { materialTheme } from './app/shared/themes/material-theme';

const store = createStore();

export default function App() {
  // prevent the splashscreen from disappearing until the redux store is completely ready (hidden in nav-container.js)
  const [displayApp, setDisplayApp] = React.useState(false);
  React.useEffect(() => {
    if (!displayApp) {
      SplashScreen.preventAutoHideAsync()
        .then(() => setDisplayApp(true))
        .catch(() => setDisplayApp(true));
    }
  }, [displayApp, setDisplayApp]);

  return displayApp ? (
    <Provider store={store}>
      <PaperProvider theme={materialTheme}>
        <NavContainer />
      </PaperProvider>
    </Provider>
  ) : null;
}
