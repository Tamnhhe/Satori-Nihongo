const { reloadApp, loginAsUser, logout, waitForElementToBeVisibleById, navigateToLoginScreen, waitThenTapButton } = require('../utils');

describe('Login Screen Tests', () => {
  beforeEach(async () => {
    await reloadApp();
  });

  it('should show an alert on log in failure', async () => {
    await navigateToLoginScreen();
    await element(by.id('loginScreenUsername')).replaceText('invalid');
    await element(by.id('loginScreenPassword')).replaceText('invalid');
    await waitThenTapButton('loginScreenLoginButton');
    await waitForElementToBeVisibleById('loginErrorMessage');
    await expect(element(by.id('loginErrorMessage'))).toBeVisible();
  });

  it('should log in and log out as user successfully', async () => {
    await loginAsUser();
    await waitForElementToBeVisibleById('homeScreen');
    await expect(element(by.id('authDisplayTrue'))).toBeVisible();
    await logout();
    await waitForElementToBeVisibleById('homeScreen');
    await expect(element(by.id('authDisplayFalse'))).toBeVisible();
  });
});
