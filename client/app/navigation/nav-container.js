import * as React from 'react';
import { AppState, Text, useWindowDimensions, View } from 'react-native';
import * as Linking from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { useReduxDevToolsExtension } from '@react-navigation/devtools';
import { connect } from 'react-redux';

// import screens
import WelcomeScreen from '../modules/welcome/welcome-screen';
import LoginScreen from '../modules/login/login-screen';
import MainTabNavigator from './tab-navigator';
import SettingsScreen from '../modules/account/settings/settings-screen';
import RegisterScreen from '../modules/account/register/register-screen';
import ForgotPasswordScreen from '../modules/account/password-reset/forgot-password-screen';
import ChangePasswordScreen from '../modules/account/password/change-password-screen';
import AccountActions from '../shared/reducers/account.reducer';
import EntityStackScreen, { getEntityRoutes } from './entity-stack';
import StorybookScreen from '../../storybook';
import DrawerContent from './drawer/drawer-content';
import { isReadyRef, navigationRef } from './nav-ref';
import NotFound from './not-found-screen';
import { ModalScreen } from './modal-screen';
import { DrawerButton } from './drawer/drawer-button';

export const drawerScreens = [
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

  // Luôn bắt đầu từ Welcome screen để user chọn Login/Register
  const initialRouteName = 'Welcome';

  return !loaded ? (
    <View>
      <Text>Loading...</Text>
    </View>
  ) : (
    <NavigationContainer
      linking={linking}
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}
    >
      <Stack.Navigator>
        {/* Luôn hiển thị Auth flow với Welcome screen làm điểm bắt đầu */}
        <Stack.Screen name="Auth" options={{ headerShown: false }}>
          {() => (
            <Drawer.Navigator
              drawerContent={(p) => <DrawerContent {...p} />}
              initialRouteName={initialRouteName}
              drawerType={dimensions.width >= 768 ? 'permanent' : 'front'}
              screenOptions={{
                headerShown: true,
                headerLeft: DrawerButton,
                headerStyle: { backgroundColor: '#1976D2' },
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
              {/* Thêm Home screen vào drawer để có thể navigate sau khi login */}
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
