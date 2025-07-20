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
  setPickerValue,
  setDateTimePickerValue,
  scrollTo,
} = require('../utils');

describe('SocialAccount Screen Tests', () => {
  beforeEach(async () => {
    await reloadApp();
    await loginAsUser();
    await navigateToSocialAccountScreen();
  });

  const navigateToSocialAccountScreen = async () => {
    await openAndTapDrawerMenuItemByLabel('Entities');
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await scrollTo('socialAccountEntityScreenButton', 'entityScreenScrollList');
    await element(by.id('socialAccountEntityScreenButton')).tap();
    await waitForElementToBeVisibleById('socialAccountScreen');
  };

  it('should allow you to create, update, and delete the SocialAccount entity', async () => {
    await expect(element(by.id('socialAccountScreen'))).toBeVisible();

    /*
     * Create SocialAccount
     */
    await tapFirstElementByLabel(' New ');
    await waitForElementToBeVisibleById('socialAccountEditScrollView');
    // provider
    await scrollTo('providerInput', 'socialAccountEditScrollView');
    await setPickerValue('providerInput', 'LOCAL');
    // providerUserId
    await scrollTo('providerUserIdInput', 'socialAccountEditScrollView');
    await element(by.id('providerUserIdInput')).replaceText('deceivingly whoa psst');
    await element(by.id('providerUserIdInput')).tapReturnKey();
    // accessToken
    await scrollTo('accessTokenInput', 'socialAccountEditScrollView');
    await element(by.id('accessTokenInput')).replaceText('cleverly makeover');
    await element(by.id('accessTokenInput')).tapReturnKey();
    // refreshToken
    await scrollTo('refreshTokenInput', 'socialAccountEditScrollView');
    await element(by.id('refreshTokenInput')).replaceText('whereas customise');
    await element(by.id('refreshTokenInput')).tapReturnKey();
    // tokenExpiry
    await scrollTo('tokenExpiryInput', 'socialAccountEditScrollView');
    await setDateTimePickerValue('tokenExpiryInput', '2025-07-19T19:25:00+07:00', 'ISO8601');
    // save
    await scrollTo('submitButton', 'socialAccountEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View SocialAccount - validate the creation
     */
    await waitForElementToBeVisibleById('socialAccountDetailScrollView');
    // provider
    await scrollTo('provider', 'socialAccountDetailScrollView');
    await expect(element(by.id('provider'))).toHaveLabel('LOCAL');
    // providerUserId
    await scrollTo('providerUserId', 'socialAccountDetailScrollView');
    await expect(element(by.id('providerUserId'))).toHaveLabel('deceivingly whoa psst');
    // accessToken
    await scrollTo('accessToken', 'socialAccountDetailScrollView');
    await expect(element(by.id('accessToken'))).toHaveLabel('cleverly makeover');
    // refreshToken
    await scrollTo('refreshToken', 'socialAccountDetailScrollView');
    await expect(element(by.id('refreshToken'))).toHaveLabel('whereas customise');
    // tokenExpiry
    await scrollTo('tokenExpiry', 'socialAccountDetailScrollView');
    const tokenExpiryCreateAttributes = await element(by.id('tokenExpiry')).getAttributes();
    jestExpect(Date.parse(tokenExpiryCreateAttributes.label)).toEqual(Date.parse('2025-07-19T19:25:00+07:00'));

    /*
     * Update SocialAccount
     */
    await scrollTo('socialAccountEditButton', 'socialAccountDetailScrollView');
    await tapFirstElementByLabel('SocialAccount Edit Button');
    await waitForElementToBeVisibleById('socialAccountEditScrollView');
    // provider
    await scrollTo('providerInput', 'socialAccountEditScrollView');
    await setPickerValue('providerInput', 'FACEBOOK');
    // providerUserId
    await scrollTo('providerUserIdInput', 'socialAccountEditScrollView');
    await element(by.id('providerUserIdInput')).replaceText('deceivingly whoa psst');
    await element(by.id('providerUserIdInput')).tapReturnKey();
    // accessToken
    await scrollTo('accessTokenInput', 'socialAccountEditScrollView');
    await element(by.id('accessTokenInput')).replaceText('cleverly makeover');
    await element(by.id('accessTokenInput')).tapReturnKey();
    // refreshToken
    await scrollTo('refreshTokenInput', 'socialAccountEditScrollView');
    await element(by.id('refreshTokenInput')).replaceText('whereas customise');
    await element(by.id('refreshTokenInput')).tapReturnKey();
    // tokenExpiry
    await scrollTo('tokenExpiryInput', 'socialAccountEditScrollView');
    await setDateTimePickerValue('tokenExpiryInput', '2025-07-19T12:26:00+07:00', 'ISO8601');
    // save
    await scrollTo('submitButton', 'socialAccountEditScrollView');
    await waitThenTapButton('submitButton');

    /*
     * View SocialAccount - validate the update
     */
    await waitForElementToBeVisibleById('socialAccountDetailScrollView');
    // provider
    await scrollTo('provider', 'socialAccountDetailScrollView');
    await expect(element(by.id('provider'))).toHaveLabel('FACEBOOK');
    // providerUserId
    await scrollTo('providerUserId', 'socialAccountDetailScrollView');
    await expect(element(by.id('providerUserId'))).toHaveLabel('deceivingly whoa psst');
    // accessToken
    await scrollTo('accessToken', 'socialAccountDetailScrollView');
    await expect(element(by.id('accessToken'))).toHaveLabel('cleverly makeover');
    // refreshToken
    await scrollTo('refreshToken', 'socialAccountDetailScrollView');
    await expect(element(by.id('refreshToken'))).toHaveLabel('whereas customise');
    // tokenExpiry
    await scrollTo('tokenExpiry', 'socialAccountDetailScrollView');
    const tokenExpiryUpdateAttributes = await element(by.id('tokenExpiry')).getAttributes();
    jestExpect(Date.parse(tokenExpiryUpdateAttributes.label)).toEqual(Date.parse('2025-07-19T12:26:00+07:00'));

    /*
     * Delete
     */
    await scrollTo('socialAccountDeleteButton', 'socialAccountDetailScrollView');
    await waitThenTapButton('socialAccountDeleteButton');
    await waitForElementToBeVisibleById('socialAccountDeleteModal');
    await waitThenTapButton('deleteButton');
    await waitForElementToBeVisibleById('socialAccountScreen');

    /*
     * Logout
     */
    await goBack();
    await waitForElementToBeVisibleById('entityScreenScrollList');
    await logout();
  });
});
