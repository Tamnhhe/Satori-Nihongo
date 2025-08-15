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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    marginTop: 44, // Space for status bar
  },

  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000000',
  },

  daysBadge: {
    backgroundColor: '#FB923C',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },

  daysBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },

  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FB923C',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Date Selector
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dateSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  dateLabel: {
    fontSize: 16,
    color: '#6B7280',
  },

  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  dateButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },

  calendarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FED7AA', // orange-100
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Schedule List
  scheduleContainer: {
    flex: 1,
  },

  scheduleContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 128, // Space for bottom navigation
  },

  // Schedule Card
  scheduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  timeContainer: {
    flex: 1,
  },

  timeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },

  timezoneText: {
    color: '#6B7280',
    fontWeight: 'normal',
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },

  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },

  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  cardLeft: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },

  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  levelBadge: {
    backgroundColor: '#FEF3C7', // yellow-100
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  levelText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },

  durationText: {
    fontSize: 14,
    color: '#6B7280',
  },

  // Teacher Avatar
  teacherContainer: {
    position: 'relative',
    marginLeft: 12,
  },

  teacherAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  // Action Buttons
  joinButton: {
    backgroundColor: '#1D4ED8', // blue-700
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },

  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },

  remindButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#93C5FD', // blue-300
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },

  remindButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '500',
  },

  // Expanded Content
  expandedContent: {
    paddingTop: 8,
  },

  expandedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  expandedTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    flex: 1,
  },

  calendarAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  calendarAddText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },

  expandedSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },

  // Tags
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },

  tagText: {
    fontSize: 14,
    color: '#374151',
  },

  // Divider Section
  dividerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB', // gray-300
  },

  dividerText: {
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#9CA3AF', // gray-400
  },
});
