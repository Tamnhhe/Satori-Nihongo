import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Changed to gray-50 equivalent
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
    paddingHorizontal: 16,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FB923C',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Progress Section
  progressSection: {
    gap: 12,
  },

  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  progressLabel: {
    color: '#FFFFFF',
    fontSize: 14,
  },

  progressCount: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },

  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#1E40AF', // Darker blue for progress background
    borderRadius: 4,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },

  // Lessons List
  lessonsContainer: {
    flex: 1,
  },

  lessonsContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 128, // More space for bottom navigation
  },

  // Lesson Card
  lessonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 16,
  },

  lockedCard: {
    opacity: 0.6,
  },

  lessonCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  lessonInfo: {
    flex: 1,
  },

  lessonTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E3A8A', // Blue-900 for titles
    marginBottom: 4,
    lineHeight: 22,
  },

  lessonDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },

  // Meta Info
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  metaText: {
    fontSize: 14,
    color: '#6B7280',
  },

  // Progress Section for individual lessons
  lessonProgressSection: {
    marginTop: 8,
  },

  lessonProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  lessonProgressLabel: {
    fontSize: 12,
    color: '#6B7280',
  },

  lessonProgressPercent: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },

  lessonProgressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E7EB', // Gray-200 for progress background
    borderRadius: 2,
    overflow: 'hidden',
  },

  lessonProgressBar: {
    height: '100%',
    backgroundColor: '#FB923C', // Orange for progress fill
    borderRadius: 2,
  },

  // Status Icons
  statusIconContainer: {
    marginLeft: 16,
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  playIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: 20,
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
