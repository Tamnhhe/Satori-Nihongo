import * as React from 'react';
import { AppState, useWindowDimensions } from 'react-native';
import * as Linking from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { useReduxDevToolsExtension } from '@react-navigation/devtools';
import { connect } from 'react-redux';

// import screens
import SplashScreenComponent from '../modules/splash/splash-screen';
import WelcomeScreen from '../modules/welcome/welcome-screen';
import LoginScreen from '../modules/login/login-screen';
import MainTabNavigator from './tab-navigator';
import SettingsScreen from '../modules/account/settings/settings-screen';
import RegisterScreen from '../modules/account/register/register-screen';
import ForgotPasswordScreen from '../modules/login/forgot-password-screen';
import ChangePasswordScreen from '../modules/account/password/change-password-screen';
import AccountActions from '../shared/reducers/account.reducer';
import EntityStackScreen, { getEntityRoutes } from './entity-stack';
import StorybookScreen from '../../storybook';
import DrawerContent from './drawer/drawer-content';
import { isReadyRef, navigationRef } from './nav-ref';
import NotFound from './not-found-screen';
import { ModalScreen } from './modal-screen';
import { DrawerButton } from './drawer/drawer-button';

// Import flashcard screens for full-screen navigation
import FlashcardListScreen from '../modules/flashcard/flashcard-list-screen';
import FlashcardScreen from '../modules/flashcard/flashcard-screen';
import FlashcardCompletionScreen from '../modules/flashcard/flashcard-completion-screen';

// Import quiz screens for full-screen navigation
import QuizScreen from '../modules/quiz/quiz-screen';
import QuizCompletionScreen from '../modules/quiz/quiz-completion-screen';

// Import achievements screen
import AchievementsScreen from '../modules/achievements/achievements-screen';

// Import notification helper
import notificationNavigationHelper from '../shared/services/notification-navigation-helper';

export const drawerScreens = [
  {
    name: 'Splash',
    component: SplashScreenComponent,
    auth: false,
  },
  {
    name: 'Welcome',
    component: WelcomeScreen,
    auth: false,
  },
  {
    name: 'Home',
    component: MainTabNavigator,
    auth: null,
  },
  {
    name: 'Login',
    route: 'login',
    component: LoginScreen,
    auth: false,
  },
  {
    name: 'Settings',
    route: 'settings',
    component: SettingsScreen,
    auth: true,
  },
  {
    name: 'Register',
    route: 'register',
    component: RegisterScreen,
    auth: false,
  },
  {
    name: 'Forgot Password',
    route: 'reset-password',
    component: ForgotPasswordScreen,
    auth: false,
  },
  {
    name: 'Change Password',
    route: 'change-password',
    component: ChangePasswordScreen,
    auth: true,
  },
  {
    name: 'EntityStack',
    isStack: true,
    component: EntityStackScreen,
    options: {
      title: 'Entities',
      headerShown: false,
    },
    auth: true,
  },
];
if (__DEV__) {
  drawerScreens.push({
    name: 'Storybook',
    route: 'storybook',
    component: StorybookScreen,
    auth: false,
  });
}
export const getDrawerRoutes = () => {
  const routes = {};
  drawerScreens.forEach((screen) => {
    if (screen.route) {
      routes[screen.name] = screen.route;
    }
  });
  return routes;
};

const linking = {
  prefixes: ['rnapp://', Linking.createURL('/')],
  config: {
    initialRouteName: 'Home',
    screens: {
      Home: {
        screens: {
          ...getDrawerRoutes(),
          EntityStack: {
            path: 'entities',
            screens: {
              ...getEntityRoutes(),
            },
          },
        },
      },
      ModalScreen: 'alert',
      NotFound: '*',
    },
  },
};

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const getScreens = (props) => {
  const isAuthed = props.account !== null;

  // Luôn bao gồm các màn hình cần thiết dựa trên auth status
  return drawerScreens
    .map((screen, index) => {
      if (screen.auth === null || screen.auth === undefined) {
        return (
          <Drawer.Screen
            name={screen.name}
            component={screen.component}
            options={screen.options}
            key={index}
          />
        );
      } else if (screen.auth === isAuthed) {
        return (
          <Drawer.Screen
            name={screen.name}
            component={screen.component}
            options={screen.options}
            key={index}
          />
        );
      }
      return null;
    })
    .filter((screen) => screen !== null);
};

function NavContainer(props) {
  const { loaded, getAccount } = props;
  const lastAppState = 'active';

  React.useEffect(() => {
    return () => {
      isReadyRef.current = false;
    };
  }, []);

  React.useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  React.useEffect(() => {
    const handleChange = (nextAppState) => {
      if (lastAppState.match(/inactive|background/) && nextAppState === 'active') {
        getAccount();
      }
    };
    const sub = AppState.addEventListener('change', handleChange);
    return () => sub.remove();
  }, [getAccount]);
  useReduxDevToolsExtension(navigationRef);
  const dimensions = useWindowDimensions();
  const isAuthed = props.account !== null;

  // Bắt đầu từ Splash screen, sau đó chuyển đến Welcome
  const initialRouteName = 'Splash';

  return (
    <NavigationContainer
      linking={linking}
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
        // Setup navigation reference for notification helper
        notificationNavigationHelper.setNavigationRef(navigationRef);
      }}
    >
      <Stack.Navigator initialRouteName={loaded ? 'Auth' : 'Splash'}>
        {/* Splash Screen - hiển thị ngay khi app khởi động */}
        <Stack.Screen
          name="Splash"
          component={SplashScreenComponent}
          options={{ headerShown: false }}
        />

        {/* Main Auth Stack */}
        <Stack.Screen name="Auth" options={{ headerShown: false }}>
          {() => (
            <Drawer.Navigator
              drawerContent={(p) => <DrawerContent {...p} />}
              initialRouteName="Welcome"
              drawerType={dimensions.width >= 768 ? 'permanent' : 'front'}
              screenOptions={{
                headerShown: true,
                headerLeft: DrawerButton,
                headerStyle: { backgroundColor: '#1E3A8A' },
                headerTintColor: '#ffffff',
              }}
            >
              <Drawer.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={{
                  headerShown: false,
                  title: 'Chào mừng',
                }}
              />
              <Drawer.Screen
                name="Login"
                component={LoginScreen}
                options={{
                  headerShown: false,
                  title: 'Đăng nhập',
                }}
              />
              <Drawer.Screen
                name="Register"
                component={RegisterScreen}
                options={{
                  title: 'Đăng ký',
                }}
              />
              <Drawer.Screen
                name="Forgot Password"
                component={ForgotPasswordScreen}
                options={{
                  title: 'Quên mật khẩu',
                }}
              />
              {/* Home screen sau khi login */}
              {isAuthed && (
                <Drawer.Screen
                  name="Home"
                  component={MainTabNavigator}
                  options={{
                    headerShown: false,
                    title: 'Trang chủ',
                  }}
                />
              )}
            </Drawer.Navigator>
          )}
        </Stack.Screen>

        {/* Flashcard screens - full screen without bottom tabs */}
        <Stack.Screen
          name="FlashcardList"
          component={FlashcardListScreen}
          options={{
            headerShown: false,
            title: 'Flashcard List',
          }}
        />
        <Stack.Screen
          name="Flashcard"
          component={FlashcardScreen}
          options={{
            headerShown: false,
            title: 'Flashcard',
          }}
        />
        <Stack.Screen
          name="FlashcardCompletion"
          component={FlashcardCompletionScreen}
          options={{
            headerShown: false,
            title: 'Hoàn thành',
          }}
        />

        {/* Quiz screens - full screen without bottom tabs */}
        <Stack.Screen
          name="Quiz"
          component={QuizScreen}
          options={{
            headerShown: false,
            title: 'Trắc nghiệm',
          }}
        />
        <Stack.Screen
          name="QuizCompletion"
          component={QuizCompletionScreen}
          options={{
            headerShown: false,
            title: 'Hoàn thành Quiz',
          }}
        />

        {/* Achievements screen - full screen without bottom tabs */}
        <Stack.Screen
          name="Achievements"
          component={AchievementsScreen}
          options={{
            headerShown: false,
            title: 'Thành tựu',
          }}
        />

        <Stack.Screen
          name="ModalScreen"
          component={ModalScreen}
          options={{
            headerShown: false,
            cardStyle: { backgroundColor: 'transparent' },
            cardOverlayEnabled: true,
            cardStyleInterpolator: ({ current: { progress } }) => ({
              cardStyle: {
                opacity: progress.interpolate({
                  inputRange: [0, 0.5, 0.9, 1],
                  outputRange: [0, 0.25, 0.7, 1],
                }),
              },
              overlayStyle: {
                opacity: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5],
                  extrapolate: 'clamp',
                }),
              },
            }),
          }}
        />
        <Stack.Screen name="NotFound" component={NotFound} options={{ title: 'Oops!' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const mapStateToProps = (state) => {
  return {
    loaded: state.appState.rehydrationComplete,
    account: state.account.account,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAccount: () => dispatch(AccountActions.accountRequest()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavContainer);
