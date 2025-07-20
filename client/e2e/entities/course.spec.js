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

describe('Course Screen Tests', () => {
  beforeEach(async () => {
    await reloadApp();
    await loginAsUser();
    await navigateToCourseScreen();
  });

  const navigateToCourseScreen = async () => {
    await openAndTapDrawerMenuItemByLabel('Entities');
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await scrollTo('courseEntityScreenButton', 'entityScreenScrollList');
    await element(by.id('courseEntityScreenButton')).tap();
    await waitForElementToBeVisibleById('courseScreen');
  };

  it('should allow you to create, update, and delete the Course entity', async () => {
    await expect(element(by.id('courseScreen'))).toBeVisible();

    /*
     * Create Course
     */
    await tapFirstElementByLabel(' New ');
    await waitForElementToBeVisibleById('courseEditScrollView');
    // title
    await scrollTo('titleInput', 'courseEditScrollView');
    await element(by.id('titleInput')).replaceText('why jaggedly');
    await element(by.id('titleInput')).tapReturnKey();
    // description
    await scrollTo('descriptionInput', 'courseEditScrollView');
    await element(by.id('descriptionInput')).replaceText('unto before');
    await element(by.id('descriptionInput')).tapReturnKey();
    // courseCode
    await scrollTo('courseCodeInput', 'courseEditScrollView');
    await element(by.id('courseCodeInput')).replaceText('electrify masculinize');
    await element(by.id('courseCodeInput')).tapReturnKey();
    // save
    await scrollTo('submitButton', 'courseEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View Course - validate the creation
     */
    await waitForElementToBeVisibleById('courseDetailScrollView');
    // title
    await scrollTo('title', 'courseDetailScrollView');
    await expect(element(by.id('title'))).toHaveLabel('why jaggedly');
    // description
    await scrollTo('description', 'courseDetailScrollView');
    await expect(element(by.id('description'))).toHaveLabel('unto before');
    // courseCode
    await scrollTo('courseCode', 'courseDetailScrollView');
    await expect(element(by.id('courseCode'))).toHaveLabel('electrify masculinize');

    /*
     * Update Course
     */
    await scrollTo('courseEditButton', 'courseDetailScrollView');
    await tapFirstElementByLabel('Course Edit Button');
    await waitForElementToBeVisibleById('courseEditScrollView');
    // title
    await scrollTo('titleInput', 'courseEditScrollView');
    await element(by.id('titleInput')).replaceText('why jaggedly');
    await element(by.id('titleInput')).tapReturnKey();
    // description
    await scrollTo('descriptionInput', 'courseEditScrollView');
    await element(by.id('descriptionInput')).replaceText('unto before');
    await element(by.id('descriptionInput')).tapReturnKey();
    // courseCode
    await scrollTo('courseCodeInput', 'courseEditScrollView');
    await element(by.id('courseCodeInput')).replaceText('electrify masculinize');
    await element(by.id('courseCodeInput')).tapReturnKey();
    // save
    await scrollTo('submitButton', 'courseEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View Course - validate the update
     */
    await waitForElementToBeVisibleById('courseDetailScrollView');
    // title
    await scrollTo('title', 'courseDetailScrollView');
    await expect(element(by.id('title'))).toHaveLabel('why jaggedly');
    // description
    await scrollTo('description', 'courseDetailScrollView');
    await expect(element(by.id('description'))).toHaveLabel('unto before');
    // courseCode
    await scrollTo('courseCode', 'courseDetailScrollView');
    await expect(element(by.id('courseCode'))).toHaveLabel('electrify masculinize');

    /*
     * Delete
     */
    await scrollTo('courseDeleteButton', 'courseDetailScrollView');
    await waitThenTapButton('courseDeleteButton');
    await waitForElementToBeVisibleById('courseDeleteModal');
    await waitThenTapButton('deleteButton');
    await waitForElementToBeVisibleById('courseScreen');

    /*
     * Logout
     */
    await goBack();
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await logout();
  });
});
