import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },

  searchBar: {
    marginBottom: 16,
    elevation: 0,
    borderRadius: 8,
  },

  filterContainer: {
    marginBottom: 12,
  },

  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },

  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  filterChip: {
    marginRight: 8,
    marginBottom: 4,
  },

  resultsContainer: {
    marginTop: 8,
  },

  resultsText: {
    fontSize: 12,
    fontWeight: '500',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },

  emptyList: {
    flexGrow: 1,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },

  footerLoader: {
    padding: 16,
    alignItems: 'center',
  },

  loadingText: {
    fontSize: 14,
  },

  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    borderRadius: 28,
  },
});
