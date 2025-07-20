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

describe('Question Screen Tests', () => {
  beforeEach(async () => {
    await reloadApp();
    await loginAsUser();
    await navigateToQuestionScreen();
  });

  const navigateToQuestionScreen = async () => {
    await openAndTapDrawerMenuItemByLabel('Entities');
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await scrollTo('questionEntityScreenButton', 'entityScreenScrollList');
    await element(by.id('questionEntityScreenButton')).tap();
    await waitForElementToBeVisibleById('questionScreen');
  };

  it('should allow you to create, update, and delete the Question entity', async () => {
    await expect(element(by.id('questionScreen'))).toBeVisible();

    /*
     * Create Question
     */
    await tapFirstElementByLabel(' New ');
    await waitForElementToBeVisibleById('questionEditScrollView');
    // content
    await scrollTo('contentInput', 'questionEditScrollView');
    await element(by.id('contentInput')).replaceText('while phooey');
    await element(by.id('contentInput')).tapReturnKey();
    // imageUrl
    await scrollTo('imageUrlInput', 'questionEditScrollView');
    await element(by.id('imageUrlInput')).replaceText('hm scamper');
    await element(by.id('imageUrlInput')).tapReturnKey();
    // suggestion
    await scrollTo('suggestionInput', 'questionEditScrollView');
    await element(by.id('suggestionInput')).replaceText('above astride');
    await element(by.id('suggestionInput')).tapReturnKey();
    // answerExplanation
    await scrollTo('answerExplanationInput', 'questionEditScrollView');
    await element(by.id('answerExplanationInput')).replaceText('following');
    await element(by.id('answerExplanationInput')).tapReturnKey();
    // correctAnswer
    await scrollTo('correctAnswerInput', 'questionEditScrollView');
    await element(by.id('correctAnswerInput')).replaceText('apud');
    await element(by.id('correctAnswerInput')).tapReturnKey();
    // type
    await scrollTo('typeInput', 'questionEditScrollView');
    await element(by.id('typeInput')).replaceText('until');
    await element(by.id('typeInput')).tapReturnKey();
    // save
    await scrollTo('submitButton', 'questionEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View Question - validate the creation
     */
    await waitForElementToBeVisibleById('questionDetailScrollView');
    // content
    await scrollTo('content', 'questionDetailScrollView');
    await expect(element(by.id('content'))).toHaveLabel('while phooey');
    // imageUrl
    await scrollTo('imageUrl', 'questionDetailScrollView');
    await expect(element(by.id('imageUrl'))).toHaveLabel('hm scamper');
    // suggestion
    await scrollTo('suggestion', 'questionDetailScrollView');
    await expect(element(by.id('suggestion'))).toHaveLabel('above astride');
    // answerExplanation
    await scrollTo('answerExplanation', 'questionDetailScrollView');
    await expect(element(by.id('answerExplanation'))).toHaveLabel('following');
    // correctAnswer
    await scrollTo('correctAnswer', 'questionDetailScrollView');
    await expect(element(by.id('correctAnswer'))).toHaveLabel('apud');
    // type
    await scrollTo('type', 'questionDetailScrollView');
    await expect(element(by.id('type'))).toHaveLabel('until');

    /*
     * Update Question
     */
    await scrollTo('questionEditButton', 'questionDetailScrollView');
    await tapFirstElementByLabel('Question Edit Button');
    await waitForElementToBeVisibleById('questionEditScrollView');
    // content
    await scrollTo('contentInput', 'questionEditScrollView');
    await element(by.id('contentInput')).replaceText('while phooey');
    await element(by.id('contentInput')).tapReturnKey();
    // imageUrl
    await scrollTo('imageUrlInput', 'questionEditScrollView');
    await element(by.id('imageUrlInput')).replaceText('hm scamper');
    await element(by.id('imageUrlInput')).tapReturnKey();
    // suggestion
    await scrollTo('suggestionInput', 'questionEditScrollView');
    await element(by.id('suggestionInput')).replaceText('above astride');
    await element(by.id('suggestionInput')).tapReturnKey();
    // answerExplanation
    await scrollTo('answerExplanationInput', 'questionEditScrollView');
    await element(by.id('answerExplanationInput')).replaceText('following');
    await element(by.id('answerExplanationInput')).tapReturnKey();
    // correctAnswer
    await scrollTo('correctAnswerInput', 'questionEditScrollView');
    await element(by.id('correctAnswerInput')).replaceText('apud');
    await element(by.id('correctAnswerInput')).tapReturnKey();
    // type
    await scrollTo('typeInput', 'questionEditScrollView');
    await element(by.id('typeInput')).replaceText('until');
    await element(by.id('typeInput')).tapReturnKey();
    // save
    await scrollTo('submitButton', 'questionEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View Question - validate the update
     */
    await waitForElementToBeVisibleById('questionDetailScrollView');
    // content
    await scrollTo('content', 'questionDetailScrollView');
    await expect(element(by.id('content'))).toHaveLabel('while phooey');
    // imageUrl
    await scrollTo('imageUrl', 'questionDetailScrollView');
    await expect(element(by.id('imageUrl'))).toHaveLabel('hm scamper');
    // suggestion
    await scrollTo('suggestion', 'questionDetailScrollView');
    await expect(element(by.id('suggestion'))).toHaveLabel('above astride');
    // answerExplanation
    await scrollTo('answerExplanation', 'questionDetailScrollView');
    await expect(element(by.id('answerExplanation'))).toHaveLabel('following');
    // correctAnswer
    await scrollTo('correctAnswer', 'questionDetailScrollView');
    await expect(element(by.id('correctAnswer'))).toHaveLabel('apud');
    // type
    await scrollTo('type', 'questionDetailScrollView');
    await expect(element(by.id('type'))).toHaveLabel('until');

    /*
     * Delete
     */
    await scrollTo('questionDeleteButton', 'questionDetailScrollView');
    await waitThenTapButton('questionDeleteButton');
    await waitForElementToBeVisibleById('questionDeleteModal');
    await waitThenTapButton('deleteButton');
    await waitForElementToBeVisibleById('questionScreen');

    /*
     * Logout
     */
    await goBack();
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await logout();
  });
});
