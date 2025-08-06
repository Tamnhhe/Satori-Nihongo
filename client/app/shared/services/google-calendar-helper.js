/**
 * Google Calendar Integration Helper
 * Provides functionality to open Google Calendar with schedule details
 */

import { Linking, Alert } from 'react-native';
import moment from 'moment';

class GoogleCalendarHelper {
  /**
   * Open Google Calendar with event details
   * @param {Object} schedule - Schedule object with event details
   * @param {string} schedule.date - Event date
   * @param {string} schedule.startTime - Event start time
   * @param {string} schedule.endTime - Event end time
   * @param {string} schedule.location - Event location
   * @param {string} schedule.course - Course information
   * @param {string} schedule.description - Event description
   */
  static async openGoogleCalendar(schedule) {
    try {
      if (!schedule) {
        console.warn('GoogleCalendarHelper: No schedule provided');
        return false;
      }

      const eventDetails = this.formatEventDetails(schedule);
      const googleCalendarUrl = this.buildGoogleCalendarUrl(eventDetails);

      console.debug('GoogleCalendarHelper: Opening Google Calendar', {
        url: googleCalendarUrl,
        title: eventDetails.title,
        location: eventDetails.location,
      });

      // Try to open Google Calendar
      const canOpen = await Linking.canOpenURL(googleCalendarUrl);

      if (canOpen) {
        await Linking.openURL(googleCalendarUrl);
        return true;
      } else {
        // Fallback: Show alert with event details
        this.showEventDetailsAlert(eventDetails);
        return false;
      }
    } catch (error) {
      console.error('GoogleCalendarHelper: Failed to open Google Calendar', error);

      // Show error alert
      Alert.alert(
        'Lỗi',
        'Không thể mở Google Calendar. Vui lòng kiểm tra xem ứng dụng đã được cài đặt chưa.',
        [{ text: 'OK' }]
      );

      return false;
    }
  }

  /**
   * Format schedule data for Google Calendar
   * @param {Object} schedule - Raw schedule object
   * @returns {Object} Formatted event details
   */
  static formatEventDetails(schedule) {
    const startDateTime = moment(schedule.startTime || schedule.date);
    const endDateTime = moment(schedule.endTime || schedule.date).add(1, 'hour');

    // Create event title
    let title = 'Buổi học Satori Nihongo';
    if (schedule.course?.title) {
      title = `${schedule.course.title} - Satori Nihongo`;
    } else if (schedule.title) {
      title = schedule.title;
    }

    // Create event description
    let description = 'Buổi học tiếng Nhật tại Satori Nihongo';
    if (schedule.description) {
      description = schedule.description;
    } else if (schedule.course) {
      description = `Khóa học: ${schedule.course.title || 'N/A'}\\n`;
      description += `Mã khóa học: #${schedule.course.id || 'N/A'}\\n`;
      description += `Thời gian: ${startDateTime.format('HH:mm')} - ${endDateTime.format('HH:mm')}`;
    }

    return {
      title,
      description,
      location: schedule.location || 'Online - Satori Nihongo',
      startDateTime: startDateTime.format('YYYYMMDDTHHmmss'),
      endDateTime: endDateTime.format('YYYYMMDDTHHmmss'),
      timezone: 'Asia/Ho_Chi_Minh',
    };
  }

  /**
   * Build Google Calendar URL
   * @param {Object} eventDetails - Formatted event details
   * @returns {string} Google Calendar URL
   */
  static buildGoogleCalendarUrl(eventDetails) {
    const baseUrl = 'https://calendar.google.com/calendar/render';

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: eventDetails.title,
      dates: `${eventDetails.startDateTime}/${eventDetails.endDateTime}`,
      details: eventDetails.description,
      location: eventDetails.location,
      ctz: eventDetails.timezone,
    });

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Show event details in alert (fallback)
   * @param {Object} eventDetails - Formatted event details
   */
  static showEventDetailsAlert(eventDetails) {
    const startTime = moment(eventDetails.startDateTime, 'YYYYMMDDTHHmmss').format(
      'DD/MM/YYYY HH:mm'
    );
    const endTime = moment(eventDetails.endDateTime, 'YYYYMMDDTHHmmss').format('HH:mm');

    const message =
      `📅 ${eventDetails.title}\\n\\n` +
      `🕐 ${startTime} - ${endTime}\\n` +
      `📍 ${eventDetails.location}\\n\\n` +
      `${eventDetails.description}`;

    Alert.alert('Chi tiết buổi học', message, [
      { text: 'Đóng', style: 'cancel' },
      {
        text: 'Sao chép link Calendar',
        onPress: () => {
          const googleCalendarUrl = this.buildGoogleCalendarUrl(eventDetails);
          // In a real app, you might want to copy to clipboard here
          console.log('Google Calendar URL:', googleCalendarUrl);
        },
      },
    ]);
  }

  /**
   * Quick method to open Google Calendar with minimal data
   * @param {string} title - Event title
   * @param {string} location - Event location
   * @param {Date|string} startTime - Event start time
   * @param {Date|string} endTime - Event end time (optional)
   */
  static async quickOpen(title, location, startTime, endTime) {
    const schedule = {
      title,
      location,
      startTime,
      endTime: endTime || moment(startTime).add(1, 'hour').toDate(),
      description: `Buổi học tại ${location}`,
    };

    return this.openGoogleCalendar(schedule);
  }
}

export default GoogleCalendarHelper;
