import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Button, Card, IconButton, useTheme, Chip } from 'react-native-paper';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import GoogleMeetHelper from '../../services/google-meet-helper';
import styles from './schedule-calendar.styles';

const ScheduleCalendar = ({
  schedules = [],
  onSchedulePress,
  viewMode = 'month',
  onViewModeChange,
  navigation,
}) => {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD'));
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));

  // Format schedules để phù hợp với react-native-calendars
  const formatSchedulesForCalendar = () => {
    const markedDates = {};
    const agendaItems = {};

    schedules.forEach((schedule) => {
      const dateStr = moment(schedule.date).format('YYYY-MM-DD');

      // Đánh dấu ngày có lịch học
      if (!markedDates[dateStr]) {
        markedDates[dateStr] = {
          marked: true,
          dotColor: theme.colors.primary,
          activeOpacity: 0.5,
        };
      }

      // Tạo dữ liệu cho agenda
      if (!agendaItems[dateStr]) {
        agendaItems[dateStr] = [];
      }

      agendaItems[dateStr].push({
        ...schedule,
        name: schedule.course?.title || `Buổi học #${schedule.id}`,
        time: `${moment(schedule.startTime).format('HH:mm')} - ${moment(schedule.endTime).format('HH:mm')}`,
        location: schedule.location || 'Online',
      });
    });

    // Thêm selected date
    if (markedDates[selectedDate]) {
      markedDates[selectedDate].selected = true;
      markedDates[selectedDate].selectedColor = theme.colors.primary;
    } else {
      markedDates[selectedDate] = {
        selected: true,
        selectedColor: theme.colors.primary,
      };
    }

    return { markedDates, agendaItems };
  };

  const { markedDates, agendaItems } = formatSchedulesForCalendar();

  // Handle schedule press - open Google Meet
  const handleSchedulePress = async (schedule) => {
    try {
      console.debug('ScheduleCalendar: Opening Google Meet for schedule', schedule);

      // First call the original onSchedulePress if provided
      if (onSchedulePress) {
        onSchedulePress(schedule);
      }

      // Then open Google Meet
      const opened = await GoogleMeetHelper.openGoogleMeet(schedule);

      if (opened) {
        console.debug('ScheduleCalendar: Google Meet opened successfully');
      } else {
        console.warn('ScheduleCalendar: Failed to open Google Meet');
      }
    } catch (error) {
      console.error('ScheduleCalendar: Error opening Google Meet', error);
    }
  };

  // Render header với các nút chuyển đổi view
  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.headerTitle}>
        <Text style={[styles.headerText, { color: theme.colors.onSurface }]}>Lịch học</Text>
      </View>

      <View style={styles.viewToggle}>
        <Button
          mode={viewMode === 'month' ? 'contained' : 'outlined'}
          onPress={() => onViewModeChange?.('month')}
          compact
          style={styles.toggleButton}
        >
          <MaterialCommunityIcons name="calendar" size={16} /> Tháng
        </Button>

        <Button
          mode={viewMode === 'week' ? 'contained' : 'outlined'}
          onPress={() => onViewModeChange?.('week')}
          compact
          style={styles.toggleButton}
        >
          <MaterialCommunityIcons name="calendar-week" size={16} /> Tuần
        </Button>

        <Button
          mode={viewMode === 'agenda' ? 'contained' : 'outlined'}
          onPress={() => onViewModeChange?.('agenda')}
          compact
          style={styles.toggleButton}
        >
          <MaterialCommunityIcons name="format-list-bulleted" size={16} /> Danh sách
        </Button>
      </View>
    </View>
  );

  // Render item trong agenda
  const renderAgendaItem = (item) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => handleSchedulePress(item)}
      style={[styles.agendaItem, { backgroundColor: theme.colors.surface }]}
    >
      <Card style={styles.scheduleCard} elevation={2}>
        <Card.Content>
          <View style={styles.scheduleHeader}>
            <Text style={[styles.scheduleName, { color: theme.colors.onSurface }]}>
              {item.name}
            </Text>
            <Chip mode="outlined" compact style={styles.timeChip}>
              {item.time}
            </Chip>
          </View>

          <View style={styles.scheduleDetails}>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="map-marker"
                size={16}
                color={theme.colors.onSurfaceVariant}
              />
              <Text style={[styles.detailText, { color: theme.colors.onSurfaceVariant }]}>
                {item.location}
              </Text>
            </View>

            {item.course && (
              <View style={styles.detailRow}>
                <MaterialCommunityIcons
                  name="book-open-variant"
                  size={16}
                  color={theme.colors.onSurfaceVariant}
                />
                <Text style={[styles.detailText, { color: theme.colors.onSurfaceVariant }]}>
                  Khóa học #{item.course.id}
                </Text>
              </View>
            )}

            {/* Add Google Meet indicator */}
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="video" size={16} color={theme.colors.primary} />
              <Text style={[styles.detailText, { color: theme.colors.primary }]}>
                Nhấn để tham gia Google Meet
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  // Render empty date cho agenda
  const renderEmptyDate = () => (
    <View style={styles.emptyDate}>
      <Text style={[styles.emptyDateText, { color: theme.colors.onSurfaceVariant }]}>
        Không có lịch học nào
      </Text>
    </View>
  );

  // Render weekly view tùy chỉnh
  const renderWeekView = () => {
    const startOfWeek = moment(selectedDate).startOf('week');
    const weekDays = [];

    for (let i = 0; i < 7; i++) {
      const date = moment(startOfWeek).add(i, 'days');
      const dateStr = date.format('YYYY-MM-DD');
      const daySchedules = agendaItems[dateStr] || [];

      weekDays.push(
        <View key={dateStr} style={styles.weekDay}>
          <TouchableOpacity
            onPress={() => setSelectedDate(dateStr)}
            style={[
              styles.weekDayHeader,
              selectedDate === dateStr && { backgroundColor: theme.colors.primary },
            ]}
          >
            <Text
              style={[
                styles.weekDayName,
                {
                  color: selectedDate === dateStr ? theme.colors.onPrimary : theme.colors.onSurface,
                },
              ]}
            >
              {date.format('ddd')}
            </Text>
            <Text
              style={[
                styles.weekDayNumber,
                {
                  color: selectedDate === dateStr ? theme.colors.onPrimary : theme.colors.onSurface,
                },
              ]}
            >
              {date.format('DD')}
            </Text>
          </TouchableOpacity>

          <ScrollView style={styles.weekDaySchedules}>
            {daySchedules.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleSchedulePress(item)}
                style={[
                  styles.weekScheduleItem,
                  { backgroundColor: theme.colors.primaryContainer },
                ]}
              >
                <Text style={[styles.weekScheduleTime, { color: theme.colors.onPrimaryContainer }]}>
                  {item.time}
                </Text>
                <Text
                  style={[styles.weekScheduleName, { color: theme.colors.onPrimaryContainer }]}
                  numberOfLines={2}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
            {daySchedules.length === 0 && (
              <View style={styles.weekEmptyDay}>
                <Text style={[styles.weekEmptyText, { color: theme.colors.onSurfaceVariant }]}>
                  Trống
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      );
    }

    return (
      <View style={styles.weekContainer}>
        <View style={styles.weekNavigation}>
          <IconButton
            icon="chevron-left"
            onPress={() =>
              setSelectedDate(moment(selectedDate).subtract(1, 'week').format('YYYY-MM-DD'))
            }
          />
          <Text style={[styles.weekTitle, { color: theme.colors.onSurface }]}>
            Tuần {moment(selectedDate).format('W, YYYY')}
          </Text>
          <IconButton
            icon="chevron-right"
            onPress={() =>
              setSelectedDate(moment(selectedDate).add(1, 'week').format('YYYY-MM-DD'))
            }
          />
        </View>

        <View style={styles.weekGrid}>{weekDays}</View>
      </View>
    );
  };

  const calendarTheme = {
    backgroundColor: theme.colors.background,
    calendarBackground: theme.colors.surface,
    textSectionTitleColor: theme.colors.onSurface,
    selectedDayBackgroundColor: theme.colors.primary,
    selectedDayTextColor: theme.colors.onPrimary,
    todayTextColor: theme.colors.primary,
    dayTextColor: theme.colors.onSurface,
    textDisabledColor: theme.colors.onSurfaceVariant,
    dotColor: theme.colors.primary,
    selectedDotColor: theme.colors.onPrimary,
    arrowColor: theme.colors.primary,
    monthTextColor: theme.colors.onSurface,
    indicatorColor: theme.colors.primary,
    textDayFontFamily: 'System',
    textMonthFontFamily: 'System',
    textDayHeaderFontFamily: 'System',
    textDayFontSize: 16,
    textMonthFontSize: 18,
    textDayHeaderFontSize: 14,
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderHeader()}

      {viewMode === 'month' && (
        <Calendar
          current={currentDate}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          onMonthChange={(month) => setCurrentDate(month.dateString)}
          markedDates={markedDates}
          theme={calendarTheme}
          firstDay={1} // Bắt đầu từ thứ 2
          enableSwipeMonths={true}
          style={styles.calendar}
        />
      )}

      {viewMode === 'week' && renderWeekView()}

      {viewMode === 'agenda' && (
        <Agenda
          items={agendaItems}
          selected={selectedDate}
          renderItem={renderAgendaItem}
          renderEmptyDate={renderEmptyDate}
          rowHasChanged={(r1, r2) => r1.id !== r2.id}
          theme={calendarTheme}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          firstDay={1}
        />
      )}

      {viewMode === 'month' && selectedDate && (
        <View style={[styles.selectedDateSchedules, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.selectedDateTitle, { color: theme.colors.onSurface }]}>
            Lịch học ngày {moment(selectedDate).format('DD/MM/YYYY')}
          </Text>
          <ScrollView style={styles.selectedSchedulesList}>
            {(agendaItems[selectedDate] || []).map(renderAgendaItem)}
            {(!agendaItems[selectedDate] || agendaItems[selectedDate].length === 0) &&
              renderEmptyDate()}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default ScheduleCalendar;
