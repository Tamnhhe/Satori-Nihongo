import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    marginBottom: 12,
  },

  card: {
    borderRadius: 12,
    marginHorizontal: 16,
  },

  header: {
    marginBottom: 12,
  },

  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
    lineHeight: 24,
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  bookmarkButton: {
    margin: 0,
  },

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },

  courseChip: {
    marginRight: 8,
  },

  statusChip: {
    marginRight: 8,
  },

  progressContainer: {
    marginBottom: 12,
  },

  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },

  progressText: {
    fontSize: 11,
    fontWeight: '500',
  },

  content: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  mediaButtons: {
    flexDirection: 'row',
    flex: 1,
  },

  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },

  mediaButtonText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },

  noMediaText: {
    fontSize: 12,
    fontStyle: 'italic',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});
