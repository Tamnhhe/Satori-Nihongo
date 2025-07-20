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

describe.skip('Flashcard Screen Tests', () => {
  beforeEach(async () => {
    await reloadApp();
    await loginAsUser();
    await navigateToFlashcardScreen();
  });

  const navigateToFlashcardScreen = async () => {
    await openAndTapDrawerMenuItemByLabel('Entities');
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await scrollTo('flashcardEntityScreenButton', 'entityScreenScrollList');
    await element(by.id('flashcardEntityScreenButton')).tap();
    await waitForElementToBeVisibleById('flashcardScreen');
  };

  it('should allow you to create, update, and delete the Flashcard entity', async () => {
    await expect(element(by.id('flashcardScreen'))).toBeVisible();

    /*
     * Create Flashcard
     */
    await tapFirstElementByLabel(' New ');
    await waitForElementToBeVisibleById('flashcardEditScrollView');
    // term
    await scrollTo('termInput', 'flashcardEditScrollView');
    await element(by.id('termInput')).replaceText('ah powerfully');
    await element(by.id('termInput')).tapReturnKey();
    // definition
    await scrollTo('definitionInput', 'flashcardEditScrollView');
    await element(by.id('definitionInput')).replaceText('long-text-blob-content');
    await element(by.id('definitionInput')).tapReturnKey();
    // imageUrl
    await scrollTo('imageUrlInput', 'flashcardEditScrollView');
    await element(by.id('imageUrlInput')).replaceText('reword citizen');
    await element(by.id('imageUrlInput')).tapReturnKey();
    // hint
    await scrollTo('hintInput', 'flashcardEditScrollView');
    await element(by.id('hintInput')).replaceText('chilly scale');
    await element(by.id('hintInput')).tapReturnKey();
    // position
    await scrollTo('positionInput', 'flashcardEditScrollView');
    await element(by.id('positionInput')).replaceText('6622');
    await element(by.id('positionInput')).tapReturnKey();
    // save
    await scrollTo('submitButton', 'flashcardEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View Flashcard - validate the creation
     */
    await waitForElementToBeVisibleById('flashcardDetailScrollView');
    // term
    await scrollTo('term', 'flashcardDetailScrollView');
    await expect(element(by.id('term'))).toHaveLabel('ah powerfully');
    // definition
    await scrollTo('definition', 'flashcardDetailScrollView');
    await expect(element(by.id('definition'))).toHaveLabel('long-text-blob-content');
    // imageUrl
    await scrollTo('imageUrl', 'flashcardDetailScrollView');
    await expect(element(by.id('imageUrl'))).toHaveLabel('reword citizen');
    // hint
    await scrollTo('hint', 'flashcardDetailScrollView');
    await expect(element(by.id('hint'))).toHaveLabel('chilly scale');
    // position
    await scrollTo('position', 'flashcardDetailScrollView');
    await expect(element(by.id('position'))).toHaveLabel('6622');

    /*
     * Update Flashcard
     */
    await scrollTo('flashcardEditButton', 'flashcardDetailScrollView');
    await tapFirstElementByLabel('Flashcard Edit Button');
    await waitForElementToBeVisibleById('flashcardEditScrollView');
    // term
    await scrollTo('termInput', 'flashcardEditScrollView');
    await element(by.id('termInput')).replaceText('ah powerfully');
    await element(by.id('termInput')).tapReturnKey();
    // definition
    await scrollTo('definitionInput', 'flashcardEditScrollView');
    await element(by.id('definitionInput')).replaceText('long-text-blob-content-2');
    await element(by.id('definitionInput')).tapReturnKey();
    // imageUrl
    await scrollTo('imageUrlInput', 'flashcardEditScrollView');
    await element(by.id('imageUrlInput')).replaceText('reword citizen');
    await element(by.id('imageUrlInput')).tapReturnKey();
    // hint
    await scrollTo('hintInput', 'flashcardEditScrollView');
    await element(by.id('hintInput')).replaceText('chilly scale');
    await element(by.id('hintInput')).tapReturnKey();
    // position
    await scrollTo('positionInput', 'flashcardEditScrollView');
    await element(by.id('positionInput')).replaceText('26193');
    await element(by.id('positionInput')).tapReturnKey();
    // save
    await scrollTo('submitButton', 'flashcardEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View Flashcard - validate the update
     */
    await waitForElementToBeVisibleById('flashcardDetailScrollView');
    // term
    await scrollTo('term', 'flashcardDetailScrollView');
    await expect(element(by.id('term'))).toHaveLabel('ah powerfully');
    // definition
    await scrollTo('definition', 'flashcardDetailScrollView');
    await expect(element(by.id('definition'))).toHaveLabel('long-text-blob-content-2');
    // imageUrl
    await scrollTo('imageUrl', 'flashcardDetailScrollView');
    await expect(element(by.id('imageUrl'))).toHaveLabel('reword citizen');
    // hint
    await scrollTo('hint', 'flashcardDetailScrollView');
    await expect(element(by.id('hint'))).toHaveLabel('chilly scale');
    // position
    await scrollTo('position', 'flashcardDetailScrollView');
    await expect(element(by.id('position'))).toHaveLabel('26193');

    /*
     * Delete
     */
    await scrollTo('flashcardDeleteButton', 'flashcardDetailScrollView');
    await waitThenTapButton('flashcardDeleteButton');
    await waitForElementToBeVisibleById('flashcardDeleteModal');
    await waitThenTapButton('deleteButton');
    await waitForElementToBeVisibleById('flashcardScreen');

    /*
     * Logout
     */
    await goBack();
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await logout();
  });
});
