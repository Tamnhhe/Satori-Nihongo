const {
  reloadApp,
  loginAsUser,
  logout,
  goBack,
  tapFirstElementByLabel,
  openAndTapDrawerMenuItemByLabel,
  waitThenTapButton,
  waitForElementToBeVisibleById,
  scrollTo,
} = require('../utils');

describe('TeacherProfile Screen Tests', () => {
  beforeEach(async () => {
    await reloadApp();
    await loginAsUser();
    await navigateToTeacherProfileScreen();
  });

  const navigateToTeacherProfileScreen = async () => {
    await openAndTapDrawerMenuItemByLabel('Entities');
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await scrollTo('teacherProfileEntityScreenButton', 'entityScreenScrollList');
    await element(by.id('teacherProfileEntityScreenButton')).tap();
    await waitForElementToBeVisibleById('teacherProfileScreen');
  };

  it('should allow you to create, update, and delete the TeacherProfile entity', async () => {
    await expect(element(by.id('teacherProfileScreen'))).toBeVisible();

    /*
     * Create TeacherProfile
     */
    await tapFirstElementByLabel(' New ');
    await waitForElementToBeVisibleById('teacherProfileEditScrollView');
    // teacherCode
    await scrollTo('teacherCodeInput', 'teacherProfileEditScrollView');
    await element(by.id('teacherCodeInput')).replaceText('boo');
    await element(by.id('teacherCodeInput')).tapReturnKey();
    // save
    await scrollTo('submitButton', 'teacherProfileEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View TeacherProfile - validate the creation
     */
    await waitForElementToBeVisibleById('teacherProfileDetailScrollView');
    // teacherCode
    await scrollTo('teacherCode', 'teacherProfileDetailScrollView');
    await expect(element(by.id('teacherCode'))).toHaveLabel('boo');

    /*
     * Update TeacherProfile
     */
    await scrollTo('teacherProfileEditButton', 'teacherProfileDetailScrollView');
    await tapFirstElementByLabel('TeacherProfile Edit Button');
    await waitForElementToBeVisibleById('teacherProfileEditScrollView');
    // teacherCode
    await scrollTo('teacherCodeInput', 'teacherProfileEditScrollView');
    await element(by.id('teacherCodeInput')).replaceText('boo');
    await element(by.id('teacherCodeInput')).tapReturnKey();
    // save
    await scrollTo('submitButton', 'teacherProfileEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View TeacherProfile - validate the update
     */
    await waitForElementToBeVisibleById('teacherProfileDetailScrollView');
    // teacherCode
    await scrollTo('teacherCode', 'teacherProfileDetailScrollView');
    await expect(element(by.id('teacherCode'))).toHaveLabel('boo');

    /*
     * Delete
     */
    await scrollTo('teacherProfileDeleteButton', 'teacherProfileDetailScrollView');
    await waitThenTapButton('teacherProfileDeleteButton');
    await waitForElementToBeVisibleById('teacherProfileDeleteModal');
    await waitThenTapButton('deleteButton');
    await waitForElementToBeVisibleById('teacherProfileScreen');

    /*
     * Logout
     */
    await goBack();
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await logout();
  });
});
