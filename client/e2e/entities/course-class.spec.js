const { expect: jestExpect } = require('expect');
const {
  reloadApp,
  loginAsUser,
  logout,
  goBack,
  tapFirstElementByLabel,
  openAndTapDrawerMenuItemByLabel,
  waitThenTapButton,
  waitForElementToBeVisibleById,
  setDateTimePickerValue,
  scrollTo,
} = require('../utils');

describe('CourseClass Screen Tests', () => {
  beforeEach(async () => {
    await reloadApp();
    await loginAsUser();
    await navigateToCourseClassScreen();
  });

  const navigateToCourseClassScreen = async () => {
    await openAndTapDrawerMenuItemByLabel('Entities');
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await scrollTo('courseClassEntityScreenButton', 'entityScreenScrollList');
    await element(by.id('courseClassEntityScreenButton')).tap();
    await waitForElementToBeVisibleById('courseClassScreen');
  };

  it('should allow you to create, update, and delete the CourseClass entity', async () => {
    await expect(element(by.id('courseClassScreen'))).toBeVisible();

    /*
     * Create CourseClass
     */
    await tapFirstElementByLabel(' New ');
    await waitForElementToBeVisibleById('courseClassEditScrollView');
    // code
    await scrollTo('codeInput', 'courseClassEditScrollView');
    await element(by.id('codeInput')).replaceText('till forenenst duh');
    await element(by.id('codeInput')).tapReturnKey();
    // name
    await scrollTo('nameInput', 'courseClassEditScrollView');
    await element(by.id('nameInput')).replaceText('burdensome mid needy');
    await element(by.id('nameInput')).tapReturnKey();
    // description
    await scrollTo('descriptionInput', 'courseClassEditScrollView');
    await element(by.id('descriptionInput')).replaceText('gee phew properly');
    await element(by.id('descriptionInput')).tapReturnKey();
    // startDate
    await scrollTo('startDateInput', 'courseClassEditScrollView');
    await setDateTimePickerValue('startDateInput', '2025-07-19T21:48:00+07:00', 'ISO8601');
    // endDate
    await scrollTo('endDateInput', 'courseClassEditScrollView');
    await setDateTimePickerValue('endDateInput', '2025-07-19T18:10:00+07:00', 'ISO8601');
    // capacity
    await scrollTo('capacityInput', 'courseClassEditScrollView');
    await element(by.id('capacityInput')).replaceText('24442');
    await element(by.id('capacityInput')).tapReturnKey();
    // save
    await scrollTo('submitButton', 'courseClassEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View CourseClass - validate the creation
     */
    await waitForElementToBeVisibleById('courseClassDetailScrollView');
    // code
    await scrollTo('code', 'courseClassDetailScrollView');
    await expect(element(by.id('code'))).toHaveLabel('till forenenst duh');
    // name
    await scrollTo('name', 'courseClassDetailScrollView');
    await expect(element(by.id('name'))).toHaveLabel('burdensome mid needy');
    // description
    await scrollTo('description', 'courseClassDetailScrollView');
    await expect(element(by.id('description'))).toHaveLabel('gee phew properly');
    // startDate
    await scrollTo('startDate', 'courseClassDetailScrollView');
    const startDateCreateAttributes = await element(by.id('startDate')).getAttributes();
    jestExpect(Date.parse(startDateCreateAttributes.label)).toEqual(Date.parse('2025-07-19T21:48:00+07:00'));
    // endDate
    await scrollTo('endDate', 'courseClassDetailScrollView');
    const endDateCreateAttributes = await element(by.id('endDate')).getAttributes();
    jestExpect(Date.parse(endDateCreateAttributes.label)).toEqual(Date.parse('2025-07-19T18:10:00+07:00'));
    // capacity
    await scrollTo('capacity', 'courseClassDetailScrollView');
    await expect(element(by.id('capacity'))).toHaveLabel('24442');

    /*
     * Update CourseClass
     */
    await scrollTo('courseClassEditButton', 'courseClassDetailScrollView');
    await tapFirstElementByLabel('CourseClass Edit Button');
    await waitForElementToBeVisibleById('courseClassEditScrollView');
    // code
    await scrollTo('codeInput', 'courseClassEditScrollView');
    await element(by.id('codeInput')).replaceText('till forenenst duh');
    await element(by.id('codeInput')).tapReturnKey();
    // name
    await scrollTo('nameInput', 'courseClassEditScrollView');
    await element(by.id('nameInput')).replaceText('burdensome mid needy');
    await element(by.id('nameInput')).tapReturnKey();
    // description
    await scrollTo('descriptionInput', 'courseClassEditScrollView');
    await element(by.id('descriptionInput')).replaceText('gee phew properly');
    await element(by.id('descriptionInput')).tapReturnKey();
    // startDate
    await scrollTo('startDateInput', 'courseClassEditScrollView');
    await setDateTimePickerValue('startDateInput', '2025-07-19T21:18:00+07:00', 'ISO8601');
    // endDate
    await scrollTo('endDateInput', 'courseClassEditScrollView');
    await setDateTimePickerValue('endDateInput', '2025-07-20T03:23:00+07:00', 'ISO8601');
    // capacity
    await scrollTo('capacityInput', 'courseClassEditScrollView');
    await element(by.id('capacityInput')).replaceText('18404');
    await element(by.id('capacityInput')).tapReturnKey();
    // save
    await scrollTo('submitButton', 'courseClassEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View CourseClass - validate the update
     */
    await waitForElementToBeVisibleById('courseClassDetailScrollView');
    // code
    await scrollTo('code', 'courseClassDetailScrollView');
    await expect(element(by.id('code'))).toHaveLabel('till forenenst duh');
    // name
    await scrollTo('name', 'courseClassDetailScrollView');
    await expect(element(by.id('name'))).toHaveLabel('burdensome mid needy');
    // description
    await scrollTo('description', 'courseClassDetailScrollView');
    await expect(element(by.id('description'))).toHaveLabel('gee phew properly');
    // startDate
    await scrollTo('startDate', 'courseClassDetailScrollView');
    const startDateUpdateAttributes = await element(by.id('startDate')).getAttributes();
    jestExpect(Date.parse(startDateUpdateAttributes.label)).toEqual(Date.parse('2025-07-19T21:18:00+07:00'));
    // endDate
    await scrollTo('endDate', 'courseClassDetailScrollView');
    const endDateUpdateAttributes = await element(by.id('endDate')).getAttributes();
    jestExpect(Date.parse(endDateUpdateAttributes.label)).toEqual(Date.parse('2025-07-20T03:23:00+07:00'));
    // capacity
    await scrollTo('capacity', 'courseClassDetailScrollView');
    await expect(element(by.id('capacity'))).toHaveLabel('18404');

    /*
     * Delete
     */
    await scrollTo('courseClassDeleteButton', 'courseClassDetailScrollView');
    await waitThenTapButton('courseClassDeleteButton');
    await waitForElementToBeVisibleById('courseClassDeleteModal');
    await waitThenTapButton('deleteButton');
    await waitForElementToBeVisibleById('courseClassScreen');

    /*
     * Logout
     */
    await goBack();
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await logout();
  });
});
