import axios from 'axios';
import sinon from 'sinon';
import { TranslatorContext } from 'react-jhipster';

import locale, { addTranslationSourcePrefix, loaded, setLocale, updateLocale } from 'app/shared/reducers/locale';

const defaultLocale = 'vi';
const dispatch = jest.fn();
const extra = {};

describe('Locale reducer tests', () => {
  it('should return the initial state', () => {
    const localeState = locale(undefined, { type: '' });
    expect(localeState).toMatchObject({
      currentLocale: '',
    });
  });

  it('should correctly set the first time locale', () => {
    const localeState = locale(undefined, updateLocale(defaultLocale));
    expect(localeState).toMatchObject({
      currentLocale: defaultLocale,
    });
    expect(TranslatorContext.context.locale).toEqual(defaultLocale);
  });

  it('should correctly detect update in current locale state', () => {
    TranslatorContext.setLocale(defaultLocale);
    expect(TranslatorContext.context.locale).toEqual(defaultLocale);
    const localeState = locale(
      {
        currentLocale: defaultLocale,
        sourcePrefixes: [],
        lastChange: new Date().getTime(),
        loadedKeys: [],
      },
      updateLocale('es'),
    );
    expect(localeState).toMatchObject({
      currentLocale: 'es',
    });
    expect(TranslatorContext.context.locale).toEqual('es');
  });

  describe('setLocale reducer', () => {
    describe('with default language loaded', () => {
      beforeEach(() => {
        axios.get = sinon.stub().returns(Promise.resolve({ key: 'value' }));
      });

      it('dispatches updateLocale action for default locale', async () => {
        TranslatorContext.setDefaultLocale(defaultLocale);
        expect(Object.keys(TranslatorContext.context.translations)).not.toContainEqual(defaultLocale);

        const getState = jest.fn(() => ({ locale: { sourcePrefixes: '', loadedLocales: [defaultLocale], loadedKeys: [] } }));

        const result = await setLocale(defaultLocale)(dispatch, getState, extra);

        const pendingAction = dispatch.mock.calls[0][0];
        expect(pendingAction.meta.requestStatus).toBe('pending');
        expect(setLocale.fulfilled.match(result)).toBe(true);
      });
    });

    describe('with no language loaded', () => {
      beforeEach(() => {
        axios.get = sinon.stub().returns(Promise.resolve({ key: 'value' }));
      });

      it('dispatches loaded and updateLocale action for default locale', async () => {
        TranslatorContext.setDefaultLocale(defaultLocale);
        expect(Object.keys(TranslatorContext.context.translations)).not.toContainEqual(defaultLocale);

        const getState = jest.fn(() => ({ locale: { sourcePrefixes: [], loadedLocales: [], loadedKeys: [] } }));

        const result = await setLocale(defaultLocale)(dispatch, getState, extra);

        const pendingAction = dispatch.mock.calls[0][0];
        expect(pendingAction.meta.requestStatus).toBe('pending');
        expect(setLocale.fulfilled.match(result)).toBe(true);
      });
    });
  });

  describe('addTranslationSourcePrefix reducer', () => {
    const sourcePrefix = 'foo/';

    describe('with no prefixes and keys loaded', () => {
      beforeEach(() => {
        axios.get = sinon.stub().returns(Promise.resolve({ key: 'value' }));
      });

      it('dispatches loaded action with keys and sourcePrefix', async () => {
        const getState = jest.fn(() => ({
          locale: { currentLocale: defaultLocale, sourcePrefixes: [], loadedLocales: [], loadedKeys: [] },
        }));

        const result = await addTranslationSourcePrefix(sourcePrefix)(dispatch, getState, extra);

        const pendingAction = dispatch.mock.calls[0][0];
        expect(pendingAction.meta.requestStatus).toBe('pending');
        expect(addTranslationSourcePrefix.fulfilled.match(result)).toBe(true);
      });
    });

    describe('with prefix already added', () => {
      beforeEach(() => {
        axios.get = sinon.stub().returns(Promise.resolve({ key: 'value' }));
      });

      it("doesn't dispatches loaded action", async () => {
        const getState = jest.fn(() => ({
          locale: { currentLocale: defaultLocale, sourcePrefixes: [sourcePrefix], loadedLocales: [], loadedKeys: [] },
        }));

        const result = await addTranslationSourcePrefix(sourcePrefix)(dispatch, getState, extra);

        const pendingAction = dispatch.mock.calls[0][0];
        expect(pendingAction.meta.requestStatus).toBe('pending');
        expect(addTranslationSourcePrefix.fulfilled.match(result)).toBe(true);
      });
    });

    describe('with key already loaded', () => {
      beforeEach(() => {
        axios.get = sinon.stub().returns(Promise.resolve({ key: 'value' }));
      });

      it("doesn't dispatches loaded action", async () => {
        const getState = jest.fn(() => ({
          locale: { currentLocale: defaultLocale, sourcePrefixes: [], loadedLocales: [], loadedKeys: [`${sourcePrefix}${defaultLocale}`] },
        }));

        const result = await addTranslationSourcePrefix(sourcePrefix)(dispatch, getState, extra);

        const pendingAction = dispatch.mock.calls[0][0];
        expect(pendingAction.meta.requestStatus).toBe('pending');
        expect(addTranslationSourcePrefix.fulfilled.match(result)).toBe(true);
      });
    });
  });

  describe('loaded reducer', () => {
    describe('with empty state', () => {
      let initialState;
      beforeEach(() => {
        initialState = { currentLocale: defaultLocale, sourcePrefixes: [], loadedLocales: [], loadedKeys: [] };
      });

      it("and empty parameter, don't adds anything", () => {
        const expectedState = { currentLocale: defaultLocale, sourcePrefixes: [], loadedLocales: [], loadedKeys: [] };

        const localeState = locale(initialState, loaded({}));
        expect(localeState).toMatchObject(expectedState);
      });

      it('and keys parameter, adds to loadedKeys', () => {
        const expectedState = { currentLocale: defaultLocale, sourcePrefixes: [], loadedLocales: [], loadedKeys: ['foo'] };

        const localeState = locale(initialState, loaded({ keys: ['foo'] }));
        expect(localeState).toMatchObject(expectedState);
      });

      it('and sourcePrefix parameter, adds to sourcePrefixes', () => {
        const expectedState = { currentLocale: defaultLocale, sourcePrefixes: ['foo'], loadedLocales: [], loadedKeys: [] };

        const localeState = locale(initialState, loaded({ sourcePrefix: 'foo' }));
        expect(localeState).toMatchObject(expectedState);
      });

      it('and locale parameter, adds to loadedLocales', () => {
        const expectedState = { currentLocale: defaultLocale, sourcePrefixes: [], loadedLocales: ['foo'], loadedKeys: [] };

        const localeState = locale(initialState, loaded({ locale: 'foo' }));
        expect(localeState).toMatchObject(expectedState);
      });
    });
  });
});
