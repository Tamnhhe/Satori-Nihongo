import { StyleSheet } from 'react-native';

import { ApplicationStyles, Colors } from '../../shared/themes';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  forgotPasswordLink: {
    marginTop: 15,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: Colors.jhipsterBlue,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerLinkText: {
    color: Colors.jhipsterBlue,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
