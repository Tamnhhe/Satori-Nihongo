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

describe('Schedule Screen Tests', () => {
  beforeEach(async () => {
    await reloadApp();
    await loginAsUser();
    await navigateToScheduleScreen();
  });

  const navigateToScheduleScreen = async () => {
    await openAndTapDrawerMenuItemByLabel('Entities');
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await scrollTo('scheduleEntityScreenButton', 'entityScreenScrollList');
    await element(by.id('scheduleEntityScreenButton')).tap();
    await waitForElementToBeVisibleById('scheduleScreen');
  };

  it('should allow you to create, update, and delete the Schedule entity', async () => {
    await expect(element(by.id('scheduleScreen'))).toBeVisible();

    /*
     * Create Schedule
     */
    await tapFirstElementByLabel(' New ');
    await waitForElementToBeVisibleById('scheduleEditScrollView');
    // date
    await scrollTo('dateInput', 'scheduleEditScrollView');
    await setDateTimePickerValue('dateInput', '2025-07-19T14:33:00+07:00', 'ISO8601');
    // startTime
    await scrollTo('startTimeInput', 'scheduleEditScrollView');
    await setDateTimePickerValue('startTimeInput', '2025-07-19T10:34:00+07:00', 'ISO8601');
    // endTime
    await scrollTo('endTimeInput', 'scheduleEditScrollView');
    await setDateTimePickerValue('endTimeInput', '2025-07-19T10:35:00+07:00', 'ISO8601');
    // location
    await scrollTo('locationInput', 'scheduleEditScrollView');
    await element(by.id('locationInput')).replaceText('warming flood');
    await element(by.id('locationInput')).tapReturnKey();
    // save
    await scrollTo('submitButton', 'scheduleEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View Schedule - validate the creation
     */
    await waitForElementToBeVisibleById('scheduleDetailScrollView');
    // date
    await scrollTo('date', 'scheduleDetailScrollView');
    const dateCreateAttributes = await element(by.id('date')).getAttributes();
    jestExpect(Date.parse(dateCreateAttributes.label)).toEqual(Date.parse('2025-07-19T14:33:00+07:00'));
    // startTime
    await scrollTo('startTime', 'scheduleDetailScrollView');
    const startTimeCreateAttributes = await element(by.id('startTime')).getAttributes();
    jestExpect(Date.parse(startTimeCreateAttributes.label)).toEqual(Date.parse('2025-07-19T10:34:00+07:00'));
    // endTime
    await scrollTo('endTime', 'scheduleDetailScrollView');
    const endTimeCreateAttributes = await element(by.id('endTime')).getAttributes();
    jestExpect(Date.parse(endTimeCreateAttributes.label)).toEqual(Date.parse('2025-07-19T10:35:00+07:00'));
    // location
    await scrollTo('location', 'scheduleDetailScrollView');
    await expect(element(by.id('location'))).toHaveLabel('warming flood');

    /*
     * Update Schedule
     */
    await scrollTo('scheduleEditButton', 'scheduleDetailScrollView');
    await tapFirstElementByLabel('Schedule Edit Button');
    await waitForElementToBeVisibleById('scheduleEditScrollView');
    // date
    await scrollTo('dateInput', 'scheduleEditScrollView');
    await setDateTimePickerValue('dateInput', '2025-07-19T21:49:00+07:00', 'ISO8601');
    // startTime
    await scrollTo('startTimeInput', 'scheduleEditScrollView');
    await setDateTimePickerValue('startTimeInput', '2025-07-19T23:34:00+07:00', 'ISO8601');
    // endTime
    await scrollTo('endTimeInput', 'scheduleEditScrollView');
    await setDateTimePickerValue('endTimeInput', '2025-07-19T11:13:00+07:00', 'ISO8601');
    // location
    await scrollTo('locationInput', 'scheduleEditScrollView');
    await element(by.id('locationInput')).replaceText('warming flood');
    await element(by.id('locationInput')).tapReturnKey();
    // save
    await scrollTo('submitButton', 'scheduleEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View Schedule - validate the update
     */
    await waitForElementToBeVisibleById('scheduleDetailScrollView');
    // date
    await scrollTo('date', 'scheduleDetailScrollView');
    const dateUpdateAttributes = await element(by.id('date')).getAttributes();
    jestExpect(Date.parse(dateUpdateAttributes.label)).toEqual(Date.parse('2025-07-19T21:49:00+07:00'));
    // startTime
    await scrollTo('startTime', 'scheduleDetailScrollView');
    const startTimeUpdateAttributes = await element(by.id('startTime')).getAttributes();
    jestExpect(Date.parse(startTimeUpdateAttributes.label)).toEqual(Date.parse('2025-07-19T23:34:00+07:00'));
    // endTime
    await scrollTo('endTime', 'scheduleDetailScrollView');
    const endTimeUpdateAttributes = await element(by.id('endTime')).getAttributes();
    jestExpect(Date.parse(endTimeUpdateAttributes.label)).toEqual(Date.parse('2025-07-19T11:13:00+07:00'));
    // location
    await scrollTo('location', 'scheduleDetailScrollView');
    await expect(element(by.id('location'))).toHaveLabel('warming flood');

    /*
     * Delete
     */
    await scrollTo('scheduleDeleteButton', 'scheduleDetailScrollView');
    await waitThenTapButton('scheduleDeleteButton');
    await waitForElementToBeVisibleById('scheduleDeleteModal');
    await waitThenTapButton('deleteButton');
    await waitForElementToBeVisibleById('scheduleScreen');

    /*
     * Logout
     */
    await goBack();
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await logout();
  });
});
