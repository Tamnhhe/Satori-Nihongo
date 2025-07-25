const execSync = require('child_process').execSync;
const username = process.env.E2E_USERNAME || 'user';
const password = process.env.E2E_PASSWORD || 'user';
const expoPublishedUrl = process.env.E2E_EXPO_URL || 'exp://localhost:8081';

const DEFAULT_VISIBLE_TIMEOUT = 10000;
const DEFAULT_RELOAD_AWAIT = 3000;

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const waitThenTapButton = async (buttonId, ms = 1000) => {
  await wait(ms);
  await element(by.id(buttonId)).tap();
};

const openAndTapDrawerMenuItemByLabel = async label => {
  await waitForElementToBeVisibleById('drawerButtonWrapper', DEFAULT_VISIBLE_TIMEOUT * 2);
  await wait(2000);
  // matching the drawer button is flaky, so open it with a swipe from the left
  await element(by.id('drawerButtonWrapper')).atIndex(0).swipe('right', 'fast', 0.7, 0.01);
  await waitForElementToBeVisibleById('drawerContentScrollView');
  await tapFirstElementByLabel(label);
};

const setDateTimePickerValue = async (elementId, dateString, dateFormat) => {
  await waitThenTapButton(elementId);
  await waitForElementToBeVisibleById(`${elementId}Modal`);
  await element(by.id(`${elementId}Modal`)).setDatePickerDate(dateString, dateFormat);
  // the first tap can be flaky, so tap it again if it still exists
  await tapFirstElementByLabel('Confirm');
  await tapFirstElementByLabel('Confirm');
  await waitForElementToBeVisibleById(elementId);
};

const setPickerValue = async (elementId, value) => {
  await waitThenTapButton(elementId);
  await waitForElementToBeVisibleById(`${elementId}Picker`);
  await element(by.id(`${elementId}Picker`)).setColumnToValue(0, value);
  await waitThenTapButton(`${elementId}PickerDone`);
  await waitForElementToBeVisibleById(elementId);
};

const navigateToLoginScreen = async () => {
  await openAndTapDrawerMenuItemByLabel('Login');
  await waitForElementToBeVisibleById('loginScreenUsername');
};

const loginAsUser = async () => {
  await navigateToLoginScreen();
  await element(by.id('loginScreenUsername')).replaceText(username);
  await element(by.id('loginScreenPassword')).replaceText(password);
  await waitThenTapButton('loginScreenLoginButton');
  try {
    await waitForElementToBeVisibleById('authDisplayTrue');
  } catch (e) {
    throw new Error(`Logging in failed. Check backend status or credentials. ${e}`);
  }
};

const logout = async () => {
  await openAndTapDrawerMenuItemByLabel('Logout');
};

const goBack = async () => {
  await wait(1000);
  if (device.getPlatform() === 'ios') {
    await tapFirstElementByLabel('Back');
  } else {
    await device.pressBack();
  }
};

const toggleSwitchToValue = async (switchId, targetValue) => {
  let attributes = await element(by.id(switchId)).getAttributes();
  while (!!+attributes.value !== targetValue) {
    await element(by.id(switchId)).longPress();
    attributes = await element(by.id(switchId)).getAttributes();
  }
};

const scrollTo = async (fieldId, listId) => {
  await waitFor(element(by.id(fieldId)))
    .toBeVisible()
    .whileElement(by.id(listId))
    .scroll(500, 'down');
};

const tapFirstElementById = async id => {
  try {
    await element(by.id(id)).atIndex(0).tap();
  } catch {
    console.warn(`Could not tap on element with ID: ${id}`);
  }
};

const tapFirstElementByLabel = async label => {
  try {
    await element(by.label(label)).atIndex(0).tap();
  } catch {
    console.warn(`Could not tap on element with label: ${label}`);
  }
};

const waitForElementToBeVisibleByLabel = async (elementLabel, timeout = DEFAULT_VISIBLE_TIMEOUT) => {
  await waitFor(element(by.label(elementLabel)))
    .toBeVisible()
    .withTimeout(timeout);
};

const waitForElementToBeVisibleById = async (elementId, timeout = DEFAULT_VISIBLE_TIMEOUT) => {
  await waitFor(element(by.id(elementId)))
    .toBeVisible()
    .withTimeout(timeout);
};

/*
const _closeDeveloperMenu = async () => {
  await wait(DEFAULT_RELOAD_AWAIT);

  await waitFor(element(by.text('Continue')))
    .toBeVisible()
    .withTimeout(DEFAULT_VISIBLE_TIMEOUT);
  await element(by.text('Continue')).tap();

  await waitFor(element(by.text('Reload')))
    .toBeVisible()
    .withTimeout(DEFAULT_VISIBLE_TIMEOUT);
  await element(by.text('Reload')).tap();

  await wait(DEFAULT_RELOAD_AWAIT);
};
*/

const reloadApp = async () => {
  try {
    if (device.getPlatform() === 'ios') {
      // disable password autofill
      execSync(
        `plutil -replace restrictedBool.allowPasswordAutoFill.value -bool NO ~/Library/Developer/CoreSimulator/Devices/${device.id}/data/Containers/Shared/SystemGroup/systemgroup.com.apple.configurationprofiles/Library/ConfigurationProfiles/UserSettings.plist`,
      );
      execSync(
        `plutil -replace restrictedBool.allowPasswordAutoFill.value -bool NO ~/Library/Developer/CoreSimulator/Devices/${device.id}/data/Library/UserConfigurationProfiles/EffectiveUserSettings.plist`,
      );
      execSync(
        `plutil -replace restrictedBool.allowPasswordAutoFill.value -bool NO ~/Library/Developer/CoreSimulator/Devices/${device.id}/data/Library/UserConfigurationProfiles/PublicInfo/PublicEffectiveUserSettings.plist`,
      );
    }
    await device.launchApp({
      url: expoPublishedUrl,
      newInstance: true,
      launchArgs: {
        detoxEnableSynchronization: false,
        permissions: { camera: 'YES', photo: 'YES' },
        // Don't show developer menu.
        EXKernelDisableNuxDefaultsKey: true,
      },
    });
    // await closeDeveloperMenu();
    await waitForElementToBeVisibleById('homeScreen', DEFAULT_VISIBLE_TIMEOUT);
  } catch (e) {
    console.warn('Reloading app failed, retrying');
    console.warn(e);

    // Reopen the application
    await device.sendToHome();
    await device.launchApp({ newInstance: false });
    await wait(DEFAULT_RELOAD_AWAIT);
  }
};

module.exports = {
  wait,
  waitThenTapButton,
  setDateTimePickerValue,
  setPickerValue,
  openAndTapDrawerMenuItemByLabel,
  navigateToLoginScreen,
  loginAsUser,
  goBack,
  logout,
  scrollTo,
  tapFirstElementById,
  tapFirstElementByLabel,
  waitForElementToBeVisibleById,
  waitForElementToBeVisibleByLabel,
  toggleSwitchToValue,
  reloadApp,
};
