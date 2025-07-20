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

describe('QuizQuestion Screen Tests', () => {
  beforeEach(async () => {
    await reloadApp();
    await loginAsUser();
    await navigateToQuizQuestionScreen();
  });

  const navigateToQuizQuestionScreen = async () => {
    await openAndTapDrawerMenuItemByLabel('Entities');
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await scrollTo('quizQuestionEntityScreenButton', 'entityScreenScrollList');
    await element(by.id('quizQuestionEntityScreenButton')).tap();
    await waitForElementToBeVisibleById('quizQuestionScreen');
  };

  it('should allow you to create, update, and delete the QuizQuestion entity', async () => {
    await expect(element(by.id('quizQuestionScreen'))).toBeVisible();

    /*
     * Create QuizQuestion
     */
    await tapFirstElementByLabel(' New ');
    await waitForElementToBeVisibleById('quizQuestionEditScrollView');
    // position
    await scrollTo('positionInput', 'quizQuestionEditScrollView');
    await element(by.id('positionInput')).replaceText('1496');
    await element(by.id('positionInput')).tapReturnKey();
    // save
    await scrollTo('submitButton', 'quizQuestionEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View QuizQuestion - validate the creation
     */
    await waitForElementToBeVisibleById('quizQuestionDetailScrollView');
    // position
    await scrollTo('position', 'quizQuestionDetailScrollView');
    await expect(element(by.id('position'))).toHaveLabel('1496');

    /*
     * Update QuizQuestion
     */
    await scrollTo('quizQuestionEditButton', 'quizQuestionDetailScrollView');
    await tapFirstElementByLabel('QuizQuestion Edit Button');
    await waitForElementToBeVisibleById('quizQuestionEditScrollView');
    // position
    await scrollTo('positionInput', 'quizQuestionEditScrollView');
    await element(by.id('positionInput')).replaceText('30235');
    await element(by.id('positionInput')).tapReturnKey();
    // save
    await scrollTo('submitButton', 'quizQuestionEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View QuizQuestion - validate the update
     */
    await waitForElementToBeVisibleById('quizQuestionDetailScrollView');
    // position
    await scrollTo('position', 'quizQuestionDetailScrollView');
    await expect(element(by.id('position'))).toHaveLabel('30235');

    /*
     * Delete
     */
    await scrollTo('quizQuestionDeleteButton', 'quizQuestionDetailScrollView');
    await waitThenTapButton('quizQuestionDeleteButton');
    await waitForElementToBeVisibleById('quizQuestionDeleteModal');
    await waitThenTapButton('deleteButton');
    await waitForElementToBeVisibleById('quizQuestionScreen');

    /*
     * Logout
     */
    await goBack();
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await logout();
  });
});
