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

describe('StudentQuiz Screen Tests', () => {
  beforeEach(async () => {
    await reloadApp();
    await loginAsUser();
    await navigateToStudentQuizScreen();
  });

  const navigateToStudentQuizScreen = async () => {
    await openAndTapDrawerMenuItemByLabel('Entities');
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await scrollTo('studentQuizEntityScreenButton', 'entityScreenScrollList');
    await element(by.id('studentQuizEntityScreenButton')).tap();
    await waitForElementToBeVisibleById('studentQuizScreen');
  };

  it('should allow you to create, update, and delete the StudentQuiz entity', async () => {
    await expect(element(by.id('studentQuizScreen'))).toBeVisible();

    /*
     * Create StudentQuiz
     */
    await tapFirstElementByLabel(' New ');
    await waitForElementToBeVisibleById('studentQuizEditScrollView');
    // startTime
    await scrollTo('startTimeInput', 'studentQuizEditScrollView');
    await setDateTimePickerValue('startTimeInput', '2025-07-19T08:14:00+07:00', 'ISO8601');
    // endTime
    await scrollTo('endTimeInput', 'studentQuizEditScrollView');
    await setDateTimePickerValue('endTimeInput', '2025-07-20T02:53:00+07:00', 'ISO8601');
    // score
    await scrollTo('scoreInput', 'studentQuizEditScrollView');
    await element(by.id('scoreInput')).replaceText('6195.7');
    await element(by.id('scoreInput')).tapReturnKey();
    // completed
    await scrollTo('completedInput', 'studentQuizEditScrollView');
    await toggleSwitchToValue('completedInput', true);
    // save
    await scrollTo('submitButton', 'studentQuizEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View StudentQuiz - validate the creation
     */
    await waitForElementToBeVisibleById('studentQuizDetailScrollView');
    // startTime
    await scrollTo('startTime', 'studentQuizDetailScrollView');
    const startTimeCreateAttributes = await element(by.id('startTime')).getAttributes();
    jestExpect(Date.parse(startTimeCreateAttributes.label)).toEqual(Date.parse('2025-07-19T08:14:00+07:00'));
    // endTime
    await scrollTo('endTime', 'studentQuizDetailScrollView');
    const endTimeCreateAttributes = await element(by.id('endTime')).getAttributes();
    jestExpect(Date.parse(endTimeCreateAttributes.label)).toEqual(Date.parse('2025-07-20T02:53:00+07:00'));
    // score
    await scrollTo('score', 'studentQuizDetailScrollView');
    await expect(element(by.id('score'))).toHaveLabel('6195.7');
    // completed
    await scrollTo('completed', 'studentQuizDetailScrollView');
    await expect(element(by.id('completed'))).toHaveLabel('true');

    /*
     * Update StudentQuiz
     */
    await scrollTo('studentQuizEditButton', 'studentQuizDetailScrollView');
    await tapFirstElementByLabel('StudentQuiz Edit Button');
    await waitForElementToBeVisibleById('studentQuizEditScrollView');
    // startTime
    await scrollTo('startTimeInput', 'studentQuizEditScrollView');
    await setDateTimePickerValue('startTimeInput', '2025-07-19T04:27:00+07:00', 'ISO8601');
    // endTime
    await scrollTo('endTimeInput', 'studentQuizEditScrollView');
    await setDateTimePickerValue('endTimeInput', '2025-07-19T17:02:00+07:00', 'ISO8601');
    // score
    await scrollTo('scoreInput', 'studentQuizEditScrollView');
    await element(by.id('scoreInput')).replaceText('3898.7');
    await element(by.id('scoreInput')).tapReturnKey();
    // completed
    await scrollTo('completedInput', 'studentQuizEditScrollView');
    await toggleSwitchToValue('completedInput', true);
    // save
    await scrollTo('submitButton', 'studentQuizEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View StudentQuiz - validate the update
     */
    await waitForElementToBeVisibleById('studentQuizDetailScrollView');
    // startTime
    await scrollTo('startTime', 'studentQuizDetailScrollView');
    const startTimeUpdateAttributes = await element(by.id('startTime')).getAttributes();
    jestExpect(Date.parse(startTimeUpdateAttributes.label)).toEqual(Date.parse('2025-07-19T04:27:00+07:00'));
    // endTime
    await scrollTo('endTime', 'studentQuizDetailScrollView');
    const endTimeUpdateAttributes = await element(by.id('endTime')).getAttributes();
    jestExpect(Date.parse(endTimeUpdateAttributes.label)).toEqual(Date.parse('2025-07-19T17:02:00+07:00'));
    // score
    await scrollTo('score', 'studentQuizDetailScrollView');
    await expect(element(by.id('score'))).toHaveLabel('3898.7');
    // completed
    await scrollTo('completed', 'studentQuizDetailScrollView');
    await expect(element(by.id('completed'))).toHaveLabel('true');

    /*
     * Delete
     */
    await scrollTo('studentQuizDeleteButton', 'studentQuizDetailScrollView');
    await waitThenTapButton('studentQuizDeleteButton');
    await waitForElementToBeVisibleById('studentQuizDeleteModal');
    await waitThenTapButton('deleteButton');
    await waitForElementToBeVisibleById('studentQuizScreen');

    /*
     * Logout
     */
    await goBack();
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await logout();
  });
});
