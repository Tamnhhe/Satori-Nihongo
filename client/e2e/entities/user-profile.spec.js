const {
  reloadApp,
  loginAsUser,
  logout,
  goBack,
  tapFirstElementByLabel,
  openAndTapDrawerMenuItemByLabel,
  waitThenTapButton,
  waitForElementToBeVisibleById,
  setPickerValue,
  scrollTo,
} = require('../utils');

describe('UserProfile Screen Tests', () => {
  beforeEach(async () => {
    await reloadApp();
    await loginAsUser();
    await navigateToUserProfileScreen();
  });

  const navigateToUserProfileScreen = async () => {
    await openAndTapDrawerMenuItemByLabel('Entities');
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await scrollTo('userProfileEntityScreenButton', 'entityScreenScrollList');
    await element(by.id('userProfileEntityScreenButton')).tap();
    await waitForElementToBeVisibleById('userProfileScreen');
  };

  it('should allow you to create, update, and delete the UserProfile entity', async () => {
    await expect(element(by.id('userProfileScreen'))).toBeVisible();

    /*
     * Create UserProfile
     */
    await tapFirstElementByLabel(' New ');
    await waitForElementToBeVisibleById('userProfileEditScrollView');
    // username
    await scrollTo('usernameInput', 'userProfileEditScrollView');
    await element(by.id('usernameInput')).replaceText('ugh longingly incidentally');
    await element(by.id('usernameInput')).tapReturnKey();
    // passwordHash
    await scrollTo('passwordHashInput', 'userProfileEditScrollView');
    await element(by.id('passwordHashInput')).replaceText('providence deadly gently');
    await element(by.id('passwordHashInput')).tapReturnKey();
    // email
    await scrollTo('emailInput', 'userProfileEditScrollView');
    await element(by.id('emailInput')).replaceText('Tyshawn.Kemmer64@gmail.com');
    await element(by.id('emailInput')).tapReturnKey();
    // fullName
    await scrollTo('fullNameInput', 'userProfileEditScrollView');
    await element(by.id('fullNameInput')).replaceText('account phrase');
    await element(by.id('fullNameInput')).tapReturnKey();
    // gender
    await scrollTo('genderInput', 'userProfileEditScrollView');
    await toggleSwitchToValue('genderInput', true);
    // role
    await scrollTo('roleInput', 'userProfileEditScrollView');
    await setPickerValue('roleInput', 'ADMIN');
    // save
    await scrollTo('submitButton', 'userProfileEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View UserProfile - validate the creation
     */
    await waitForElementToBeVisibleById('userProfileDetailScrollView');
    // username
    await scrollTo('username', 'userProfileDetailScrollView');
    await expect(element(by.id('username'))).toHaveLabel('ugh longingly incidentally');
    // passwordHash
    await scrollTo('passwordHash', 'userProfileDetailScrollView');
    await expect(element(by.id('passwordHash'))).toHaveLabel('providence deadly gently');
    // email
    await scrollTo('email', 'userProfileDetailScrollView');
    await expect(element(by.id('email'))).toHaveLabel('Tyshawn.Kemmer64@gmail.com');
    // fullName
    await scrollTo('fullName', 'userProfileDetailScrollView');
    await expect(element(by.id('fullName'))).toHaveLabel('account phrase');
    // gender
    await scrollTo('gender', 'userProfileDetailScrollView');
    await expect(element(by.id('gender'))).toHaveLabel('true');
    // role
    await scrollTo('role', 'userProfileDetailScrollView');
    await expect(element(by.id('role'))).toHaveLabel('ADMIN');

    /*
     * Update UserProfile
     */
    await scrollTo('userProfileEditButton', 'userProfileDetailScrollView');
    await tapFirstElementByLabel('UserProfile Edit Button');
    await waitForElementToBeVisibleById('userProfileEditScrollView');
    // username
    await scrollTo('usernameInput', 'userProfileEditScrollView');
    await element(by.id('usernameInput')).replaceText('ugh longingly incidentally');
    await element(by.id('usernameInput')).tapReturnKey();
    // passwordHash
    await scrollTo('passwordHashInput', 'userProfileEditScrollView');
    await element(by.id('passwordHashInput')).replaceText('providence deadly gently');
    await element(by.id('passwordHashInput')).tapReturnKey();
    // email
    await scrollTo('emailInput', 'userProfileEditScrollView');
    await element(by.id('emailInput')).replaceText('Tyshawn.Kemmer64@gmail.com');
    await element(by.id('emailInput')).tapReturnKey();
    // fullName
    await scrollTo('fullNameInput', 'userProfileEditScrollView');
    await element(by.id('fullNameInput')).replaceText('account phrase');
    await element(by.id('fullNameInput')).tapReturnKey();
    // gender
    await scrollTo('genderInput', 'userProfileEditScrollView');
    await toggleSwitchToValue('genderInput', false);
    // role
    await scrollTo('roleInput', 'userProfileEditScrollView');
    await setPickerValue('roleInput', 'GIANG_VIEN');
    // save
    await scrollTo('submitButton', 'userProfileEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View UserProfile - validate the update
     */
    await waitForElementToBeVisibleById('userProfileDetailScrollView');
    // username
    await scrollTo('username', 'userProfileDetailScrollView');
    await expect(element(by.id('username'))).toHaveLabel('ugh longingly incidentally');
    // passwordHash
    await scrollTo('passwordHash', 'userProfileDetailScrollView');
    await expect(element(by.id('passwordHash'))).toHaveLabel('providence deadly gently');
    // email
    await scrollTo('email', 'userProfileDetailScrollView');
    await expect(element(by.id('email'))).toHaveLabel('Tyshawn.Kemmer64@gmail.com');
    // fullName
    await scrollTo('fullName', 'userProfileDetailScrollView');
    await expect(element(by.id('fullName'))).toHaveLabel('account phrase');
    // gender
    await scrollTo('gender', 'userProfileDetailScrollView');
    await expect(element(by.id('gender'))).toHaveLabel('false');
    // role
    await scrollTo('role', 'userProfileDetailScrollView');
    await expect(element(by.id('role'))).toHaveLabel('GIANG_VIEN');

    /*
     * Delete
     */
    await scrollTo('userProfileDeleteButton', 'userProfileDetailScrollView');
    await waitThenTapButton('userProfileDeleteButton');
    await waitForElementToBeVisibleById('userProfileDeleteModal');
    await waitThenTapButton('deleteButton');
    await waitForElementToBeVisibleById('userProfileScreen');

    /*
     * Logout
     */
    await goBack();
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await logout();
  });
});
