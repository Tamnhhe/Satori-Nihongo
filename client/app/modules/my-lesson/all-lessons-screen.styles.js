import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  searchBar: {
    marginBottom: 16,
    elevation: 2,
  },
  filterControls: {
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterButton: {
    marginRight: 8,
    minWidth: 120,
  },
  clearButton: {
    marginLeft: 'auto',
  },
  activeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    marginRight: 4,
    marginBottom: 4,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 32,
    margin: 16,
    alignItems: 'center',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  clearFiltersButton: {
    marginTop: 8,
  },
  loadMoreContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadMoreText: {
    marginTop: 8,
    fontSize: 14,
  },
});
