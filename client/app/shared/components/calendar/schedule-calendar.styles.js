import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header styles
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },

  headerTitle: {
    marginBottom: 12,
  },

  headerText: {
    fontSize: 20,
    fontWeight: '600',
  },

  viewToggle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  toggleButton: {
    marginHorizontal: 4,
    minWidth: 80,
  },

  // Calendar styles
  calendar: {
    marginBottom: 8,
  },

  // Week view styles
  weekContainer: {
    flex: 1,
  },

  weekNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },

  weekTitle: {
    fontSize: 18,
    fontWeight: '600',
  },

  weekGrid: {
    flex: 1,
    flexDirection: 'row',
  },

  weekDay: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },

  weekDayHeader: {
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    borderRadius: 8,
    marginHorizontal: 2,
    marginTop: 2,
  },

  weekDayName: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },

  weekDayNumber: {
    fontSize: 16,
    fontWeight: '600',
  },

  weekDaySchedules: {
    flex: 1,
    padding: 4,
  },

  weekScheduleItem: {
    padding: 8,
    marginVertical: 2,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },

  weekScheduleTime: {
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 2,
  },

  weekScheduleName: {
    fontSize: 11,
    fontWeight: '400',
  },

  weekEmptyDay: {
    padding: 16,
    alignItems: 'center',
  },

  weekEmptyText: {
    fontSize: 12,
    fontStyle: 'italic',
  },

  // Agenda styles
  agendaItem: {
    marginVertical: 4,
    marginHorizontal: 16,
  },

  scheduleCard: {
    marginVertical: 2,
  },

  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  scheduleName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },

  timeChip: {
    backgroundColor: '#E3F2FD',
  },

  scheduleDetails: {
    marginTop: 4,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },

  detailText: {
    fontSize: 14,
    marginLeft: 6,
  },

  // Empty state styles
  emptyDate: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyDateText: {
    fontSize: 14,
    fontStyle: 'italic',
  },

  // Selected date schedules (for month view)
  selectedDateSchedules: {
    maxHeight: 200,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },

  selectedDateTitle: {
    fontSize: 16,
    fontWeight: '600',
    padding: 16,
    paddingBottom: 8,
  },

  selectedSchedulesList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  // Loading state
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },

  // Error state
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },

  retryButton: {
    marginTop: 8,
  },
});
