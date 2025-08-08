import { StyleSheet } from 'react-native';

import { ApplicationStyles, Colors } from '../../../shared/themes';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    color: Colors.jhipsterBlue,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
