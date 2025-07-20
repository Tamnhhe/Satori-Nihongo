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

describe('StudentProfile Screen Tests', () => {
  beforeEach(async () => {
    await reloadApp();
    await loginAsUser();
    await navigateToStudentProfileScreen();
  });

  const navigateToStudentProfileScreen = async () => {
    await openAndTapDrawerMenuItemByLabel('Entities');
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await scrollTo('studentProfileEntityScreenButton', 'entityScreenScrollList');
    await element(by.id('studentProfileEntityScreenButton')).tap();
    await waitForElementToBeVisibleById('studentProfileScreen');
  };

  it('should allow you to create, update, and delete the StudentProfile entity', async () => {
    await expect(element(by.id('studentProfileScreen'))).toBeVisible();

    /*
     * Create StudentProfile
     */
    await tapFirstElementByLabel(' New ');
    await waitForElementToBeVisibleById('studentProfileEditScrollView');
    // studentId
    await scrollTo('studentIdInput', 'studentProfileEditScrollView');
    await element(by.id('studentIdInput')).replaceText('after likewise');
    await element(by.id('studentIdInput')).tapReturnKey();
    // gpa
    await scrollTo('gpaInput', 'studentProfileEditScrollView');
    await element(by.id('gpaInput')).replaceText('18871.75');
    await element(by.id('gpaInput')).tapReturnKey();
    // save
    await scrollTo('submitButton', 'studentProfileEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View StudentProfile - validate the creation
     */
    await waitForElementToBeVisibleById('studentProfileDetailScrollView');
    // studentId
    await scrollTo('studentId', 'studentProfileDetailScrollView');
    await expect(element(by.id('studentId'))).toHaveLabel('after likewise');
    // gpa
    await scrollTo('gpa', 'studentProfileDetailScrollView');
    await expect(element(by.id('gpa'))).toHaveLabel('18871.75');

    /*
     * Update StudentProfile
     */
    await scrollTo('studentProfileEditButton', 'studentProfileDetailScrollView');
    await tapFirstElementByLabel('StudentProfile Edit Button');
    await waitForElementToBeVisibleById('studentProfileEditScrollView');
    // studentId
    await scrollTo('studentIdInput', 'studentProfileEditScrollView');
    await element(by.id('studentIdInput')).replaceText('after likewise');
    await element(by.id('studentIdInput')).tapReturnKey();
    // gpa
    await scrollTo('gpaInput', 'studentProfileEditScrollView');
    await element(by.id('gpaInput')).replaceText('15040.81');
    await element(by.id('gpaInput')).tapReturnKey();
    // save
    await scrollTo('submitButton', 'studentProfileEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View StudentProfile - validate the update
     */
    await waitForElementToBeVisibleById('studentProfileDetailScrollView');
    // studentId
    await scrollTo('studentId', 'studentProfileDetailScrollView');
    await expect(element(by.id('studentId'))).toHaveLabel('after likewise');
    // gpa
    await scrollTo('gpa', 'studentProfileDetailScrollView');
    await expect(element(by.id('gpa'))).toHaveLabel('15040.81');

    /*
     * Delete
     */
    await scrollTo('studentProfileDeleteButton', 'studentProfileDetailScrollView');
    await waitThenTapButton('studentProfileDeleteButton');
    await waitForElementToBeVisibleById('studentProfileDeleteModal');
    await waitThenTapButton('deleteButton');
    await waitForElementToBeVisibleById('studentProfileScreen');

    /*
     * Logout
     */
    await goBack();
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await logout();
  });
});
