import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    paddingVertical: 16,
  },

  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },

  statCard: {
    minWidth: 120,
    borderRadius: 12,
  },

  statContent: {
    alignItems: 'center',
    padding: 16,
  },

  statHeader: {
    marginBottom: 8,
  },

  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});
