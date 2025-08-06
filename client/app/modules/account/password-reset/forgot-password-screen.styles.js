import { StyleSheet } from 'react-native';

import { ApplicationStyles, Colors } from '../../../shared/themes';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  backToLoginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  backToLoginText: {
    color: Colors.jhipsterBlue,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
