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

describe('Quiz Screen Tests', () => {
  beforeEach(async () => {
    await reloadApp();
    await loginAsUser();
    await navigateToQuizScreen();
  });

  const navigateToQuizScreen = async () => {
    await openAndTapDrawerMenuItemByLabel('Entities');
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await scrollTo('quizEntityScreenButton', 'entityScreenScrollList');
    await element(by.id('quizEntityScreenButton')).tap();
    await waitForElementToBeVisibleById('quizScreen');
  };

  it('should allow you to create, update, and delete the Quiz entity', async () => {
    await expect(element(by.id('quizScreen'))).toBeVisible();

    /*
     * Create Quiz
     */
    await tapFirstElementByLabel(' New ');
    await waitForElementToBeVisibleById('quizEditScrollView');
    // title
    await scrollTo('titleInput', 'quizEditScrollView');
    await element(by.id('titleInput')).replaceText('till');
    await element(by.id('titleInput')).tapReturnKey();
    // description
    await scrollTo('descriptionInput', 'quizEditScrollView');
    await element(by.id('descriptionInput')).replaceText('geez');
    await element(by.id('descriptionInput')).tapReturnKey();
    // isTest
    await scrollTo('isTestInput', 'quizEditScrollView');
    await toggleSwitchToValue('isTestInput', false);
    // isPractice
    await scrollTo('isPracticeInput', 'quizEditScrollView');
    await toggleSwitchToValue('isPracticeInput', true);
    // quizType
    await scrollTo('quizTypeInput', 'quizEditScrollView');
    await setPickerValue('quizTypeInput', 'LESSON');
    // save
    await scrollTo('submitButton', 'quizEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View Quiz - validate the creation
     */
    await waitForElementToBeVisibleById('quizDetailScrollView');
    // title
    await scrollTo('title', 'quizDetailScrollView');
    await expect(element(by.id('title'))).toHaveLabel('till');
    // description
    await scrollTo('description', 'quizDetailScrollView');
    await expect(element(by.id('description'))).toHaveLabel('geez');
    // isTest
    await scrollTo('isTest', 'quizDetailScrollView');
    await expect(element(by.id('isTest'))).toHaveLabel('false');
    // isPractice
    await scrollTo('isPractice', 'quizDetailScrollView');
    await expect(element(by.id('isPractice'))).toHaveLabel('true');
    // quizType
    await scrollTo('quizType', 'quizDetailScrollView');
    await expect(element(by.id('quizType'))).toHaveLabel('LESSON');

    /*
     * Update Quiz
     */
    await scrollTo('quizEditButton', 'quizDetailScrollView');
    await tapFirstElementByLabel('Quiz Edit Button');
    await waitForElementToBeVisibleById('quizEditScrollView');
    // title
    await scrollTo('titleInput', 'quizEditScrollView');
    await element(by.id('titleInput')).replaceText('till');
    await element(by.id('titleInput')).tapReturnKey();
    // description
    await scrollTo('descriptionInput', 'quizEditScrollView');
    await element(by.id('descriptionInput')).replaceText('geez');
    await element(by.id('descriptionInput')).tapReturnKey();
    // isTest
    await scrollTo('isTestInput', 'quizEditScrollView');
    await toggleSwitchToValue('isTestInput', false);
    // isPractice
    await scrollTo('isPracticeInput', 'quizEditScrollView');
    await toggleSwitchToValue('isPracticeInput', true);
    // quizType
    await scrollTo('quizTypeInput', 'quizEditScrollView');
    await setPickerValue('quizTypeInput', 'LESSON');
    // save
    await scrollTo('submitButton', 'quizEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View Quiz - validate the update
     */
    await waitForElementToBeVisibleById('quizDetailScrollView');
    // title
    await scrollTo('title', 'quizDetailScrollView');
    await expect(element(by.id('title'))).toHaveLabel('till');
    // description
    await scrollTo('description', 'quizDetailScrollView');
    await expect(element(by.id('description'))).toHaveLabel('geez');
    // isTest
    await scrollTo('isTest', 'quizDetailScrollView');
    await expect(element(by.id('isTest'))).toHaveLabel('false');
    // isPractice
    await scrollTo('isPractice', 'quizDetailScrollView');
    await expect(element(by.id('isPractice'))).toHaveLabel('true');
    // quizType
    await scrollTo('quizType', 'quizDetailScrollView');
    await expect(element(by.id('quizType'))).toHaveLabel('LESSON');

    /*
     * Delete
     */
    await scrollTo('quizDeleteButton', 'quizDetailScrollView');
    await waitThenTapButton('quizDeleteButton');
    await waitForElementToBeVisibleById('quizDeleteModal');
    await waitThenTapButton('deleteButton');
    await waitForElementToBeVisibleById('quizScreen');

    /*
     * Logout
     */
    await goBack();
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await logout();
  });
});
