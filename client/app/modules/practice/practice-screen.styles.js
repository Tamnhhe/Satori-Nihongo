import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // gray-50
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },

  // Header Section
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 44, // Space for status bar
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '500',
    color: '#FB923C', // Orange color for title
  },

  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FB923C',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Search Section
  searchContainer: {
    position: 'relative',
  },

  searchInputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },

  searchInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingLeft: 48,
    paddingRight: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
  },

  // Content Section
  content: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 128, // Space for bottom navigation
  },

  courseTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 16,
  },

  // Lessons Container
  lessonsContainer: {
    gap: 12,
  },

  // Lesson Card
  lessonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },

  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },

  lessonHeaderLeft: {
    flex: 1,
  },

  lessonTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3B82F6', // blue-600
    marginBottom: 4,
  },

  lessonDescription: {
    fontSize: 14,
    color: '#9CA3AF', // gray-400
  },

  chevronIcon: {
    transform: [{ rotate: '0deg' }],
  },

  chevronIconExpanded: {
    transform: [{ rotate: '180deg' }],
  },

  // Expanded Content
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  practiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },

  practiceItemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  practiceItemType: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3B82F6', // blue-600
  },

  practiceItemCount: {
    fontSize: 14,
    color: '#9CA3AF', // gray-400
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },

  emptyDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});
