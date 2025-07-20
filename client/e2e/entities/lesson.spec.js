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

describe.skip('Lesson Screen Tests', () => {
  beforeEach(async () => {
    await reloadApp();
    await loginAsUser();
    await navigateToLessonScreen();
  });

  const navigateToLessonScreen = async () => {
    await openAndTapDrawerMenuItemByLabel('Entities');
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await scrollTo('lessonEntityScreenButton', 'entityScreenScrollList');
    await element(by.id('lessonEntityScreenButton')).tap();
    await waitForElementToBeVisibleById('lessonScreen');
  };

  it('should allow you to create, update, and delete the Lesson entity', async () => {
    await expect(element(by.id('lessonScreen'))).toBeVisible();

    /*
     * Create Lesson
     */
    await tapFirstElementByLabel(' New ');
    await waitForElementToBeVisibleById('lessonEditScrollView');
    // title
    await scrollTo('titleInput', 'lessonEditScrollView');
    await element(by.id('titleInput')).replaceText('informal');
    await element(by.id('titleInput')).tapReturnKey();
    // content
    await scrollTo('contentInput', 'lessonEditScrollView');
    await element(by.id('contentInput')).replaceText('long-text-blob-content');
    await element(by.id('contentInput')).tapReturnKey();
    // videoUrl
    await scrollTo('videoUrlInput', 'lessonEditScrollView');
    await element(by.id('videoUrlInput')).replaceText('until excluding iridescence');
    await element(by.id('videoUrlInput')).tapReturnKey();
    // slideUrl
    await scrollTo('slideUrlInput', 'lessonEditScrollView');
    await element(by.id('slideUrlInput')).replaceText('desk');
    await element(by.id('slideUrlInput')).tapReturnKey();
    // save
    await scrollTo('submitButton', 'lessonEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View Lesson - validate the creation
     */
    await waitForElementToBeVisibleById('lessonDetailScrollView');
    // title
    await scrollTo('title', 'lessonDetailScrollView');
    await expect(element(by.id('title'))).toHaveLabel('informal');
    // content
    await scrollTo('content', 'lessonDetailScrollView');
    await expect(element(by.id('content'))).toHaveLabel('long-text-blob-content');
    // videoUrl
    await scrollTo('videoUrl', 'lessonDetailScrollView');
    await expect(element(by.id('videoUrl'))).toHaveLabel('until excluding iridescence');
    // slideUrl
    await scrollTo('slideUrl', 'lessonDetailScrollView');
    await expect(element(by.id('slideUrl'))).toHaveLabel('desk');

    /*
     * Update Lesson
     */
    await scrollTo('lessonEditButton', 'lessonDetailScrollView');
    await tapFirstElementByLabel('Lesson Edit Button');
    await waitForElementToBeVisibleById('lessonEditScrollView');
    // title
    await scrollTo('titleInput', 'lessonEditScrollView');
    await element(by.id('titleInput')).replaceText('informal');
    await element(by.id('titleInput')).tapReturnKey();
    // content
    await scrollTo('contentInput', 'lessonEditScrollView');
    await element(by.id('contentInput')).replaceText('long-text-blob-content-2');
    await element(by.id('contentInput')).tapReturnKey();
    // videoUrl
    await scrollTo('videoUrlInput', 'lessonEditScrollView');
    await element(by.id('videoUrlInput')).replaceText('until excluding iridescence');
    await element(by.id('videoUrlInput')).tapReturnKey();
    // slideUrl
    await scrollTo('slideUrlInput', 'lessonEditScrollView');
    await element(by.id('slideUrlInput')).replaceText('desk');
    await element(by.id('slideUrlInput')).tapReturnKey();
    // save
    await scrollTo('submitButton', 'lessonEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View Lesson - validate the update
     */
    await waitForElementToBeVisibleById('lessonDetailScrollView');
    // title
    await scrollTo('title', 'lessonDetailScrollView');
    await expect(element(by.id('title'))).toHaveLabel('informal');
    // content
    await scrollTo('content', 'lessonDetailScrollView');
    await expect(element(by.id('content'))).toHaveLabel('long-text-blob-content-2');
    // videoUrl
    await scrollTo('videoUrl', 'lessonDetailScrollView');
    await expect(element(by.id('videoUrl'))).toHaveLabel('until excluding iridescence');
    // slideUrl
    await scrollTo('slideUrl', 'lessonDetailScrollView');
    await expect(element(by.id('slideUrl'))).toHaveLabel('desk');

    /*
     * Delete
     */
    await scrollTo('lessonDeleteButton', 'lessonDetailScrollView');
    await waitThenTapButton('lessonDeleteButton');
    await waitForElementToBeVisibleById('lessonDeleteModal');
    await waitThenTapButton('deleteButton');
    await waitForElementToBeVisibleById('lessonScreen');

    /*
     * Logout
     */
    await goBack();
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await logout();
  });
});
