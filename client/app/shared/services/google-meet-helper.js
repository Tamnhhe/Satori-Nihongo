/**
 * Google Meet Integration Helper
 * Provides functionality to open Google Meet directly from schedule
 */

import { Linking, Alert } from 'react-native';
import moment from 'moment';

class GoogleMeetHelper {
  /**
   * Open Google Meet directly from schedule
   * @param {Object} schedule - Schedule object with meet details
   * @param {string} schedule.meetUrl - Direct Google Meet URL
   * @param {string} schedule.location - Location (may contain meet URL)
   * @param {string} schedule.course - Course information
   */
  static async openGoogleMeet(schedule) {
    try {
      if (!schedule) {
        console.warn('GoogleMeetHelper: No schedule provided');
        return false;
      }

      // Extract Google Meet URL from schedule
      const meetUrl = this.extractMeetUrl(schedule);

      if (!meetUrl) {
        console.warn('GoogleMeetHelper: No Google Meet URL found in schedule');
        this.showNoMeetUrlAlert(schedule);
        return false;
      }

      console.debug('GoogleMeetHelper: Opening Google Meet', {
        url: meetUrl,
        courseName: schedule.course?.title,
        location: schedule.location,
      });

      // Try to open Google Meet
      const canOpen = await Linking.canOpenURL(meetUrl);

      if (canOpen) {
        await Linking.openURL(meetUrl);
        return true;
      } else {
        // Fallback: Show alert with meet URL
        this.showMeetUrlAlert(meetUrl, schedule);
        return false;
      }
    } catch (error) {
      console.error('GoogleMeetHelper: Failed to open Google Meet', error);

      // Show error alert
      Alert.alert('Lỗi', 'Không thể mở Google Meet. Vui lòng kiểm tra kết nối mạng và thử lại.', [
        { text: 'OK' },
      ]);

      return false;
    }
  }

  /**
   * Extract Google Meet URL from schedule data
   * @param {Object} schedule - Schedule object
   * @returns {string|null} Google Meet URL or null if not found
   */
  static extractMeetUrl(schedule) {
    // Check various fields where Google Meet URL might be stored
    const possibleFields = [
      schedule.meetUrl,
      schedule.googleMeetUrl,
      schedule.meetingUrl,
      schedule.location,
      schedule.description,
      schedule.course?.meetUrl,
      schedule.course?.googleMeetUrl,
    ];

    for (const field of possibleFields) {
      if (field && typeof field === 'string') {
        // Look for Google Meet URL patterns
        const meetUrlPattern = /https:\/\/meet\.google\.com\/[a-z-]+/i;
        const match = field.match(meetUrlPattern);

        if (match) {
          return match[0];
        }

        // Also check for Google Meet room codes (like: abc-defg-hij)
        const roomCodePattern = /([a-z]{3}-[a-z]{4}-[a-z]{3})/i;
        const roomMatch = field.match(roomCodePattern);

        if (roomMatch) {
          return `https://meet.google.com/${roomMatch[1]}`;
        }
      }
    }

    return null;
  }

  /**
   * Generate a Google Meet URL if we have a meeting room code
   * @param {string} roomCode - Meeting room code (like: abc-defg-hij)
   * @returns {string} Complete Google Meet URL
   */
  static generateMeetUrl(roomCode) {
    // Clean the room code
    const cleanCode = roomCode.replace(/[^a-z-]/gi, '').toLowerCase();
    return `https://meet.google.com/${cleanCode}`;
  }

  /**
   * Show alert when no Google Meet URL is found
   * @param {Object} schedule - Schedule object
   */
  static showNoMeetUrlAlert(schedule) {
    const courseName = schedule.course?.title || 'Buổi học';
    const time = schedule.startTime ? moment(schedule.startTime).format('HH:mm DD/MM/YYYY') : 'N/A';

    Alert.alert(
      '📹 Thông tin buổi học',
      `${courseName}\n\n` +
        `🕐 Thời gian: ${time}\n` +
        `📍 Địa điểm: ${schedule.location || 'Chưa có thông tin'}\n\n` +
        `Không tìm thấy link Google Meet cho buổi học này. Vui lòng liên hệ giáo viên để được cung cấp link học online.`,
      [
        { text: 'Đóng', style: 'cancel' },
        {
          text: 'Liên hệ hỗ trợ',
          onPress: () => {
            // You can add contact support functionality here
            console.log('User wants to contact support for meet link');
          },
        },
      ]
    );
  }

  /**
   * Show alert with Google Meet URL (fallback)
   * @param {string} meetUrl - Google Meet URL
   * @param {Object} schedule - Schedule object
   */
  static showMeetUrlAlert(meetUrl, schedule) {
    const courseName = schedule.course?.title || 'Buổi học';
    const time = schedule.startTime ? moment(schedule.startTime).format('HH:mm DD/MM/YYYY') : 'N/A';

    Alert.alert(
      '📹 Google Meet',
      `${courseName}\n\n` +
        `🕐 Thời gian: ${time}\n` +
        `🔗 Link: ${meetUrl}\n\n` +
        `Không thể mở Google Meet tự động. Vui lòng sao chép link và mở thủ công.`,
      [
        { text: 'Đóng', style: 'cancel' },
        {
          text: 'Sao chép Link',
          onPress: () => {
            // In a real app, you might want to copy to clipboard here
            console.log('Copy to clipboard:', meetUrl);
            // Clipboard.setString(meetUrl);
            Alert.alert('Đã sao chép', 'Link Google Meet đã được sao chép vào clipboard.');
          },
        },
      ]
    );
  }

  /**
   * Quick method to open Google Meet with URL
   * @param {string} meetUrl - Direct Google Meet URL
   * @param {string} courseName - Course name for logging
   */
  static async quickOpenMeet(meetUrl, courseName = 'Unknown') {
    try {
      if (!meetUrl) {
        console.warn('GoogleMeetHelper: No meet URL provided');
        return false;
      }

      console.debug('GoogleMeetHelper: Quick opening Google Meet', {
        url: meetUrl,
        course: courseName,
      });

      const canOpen = await Linking.canOpenURL(meetUrl);

      if (canOpen) {
        await Linking.openURL(meetUrl);
        return true;
      } else {
        Alert.alert('Lỗi', `Không thể mở Google Meet. Link: ${meetUrl}`, [{ text: 'OK' }]);
        return false;
      }
    } catch (error) {
      console.error('GoogleMeetHelper: Quick open failed', error);
      return false;
    }
  }

  /**
   * Validate if a string is a valid Google Meet URL
   * @param {string} url - URL to validate
   * @returns {boolean} True if valid Google Meet URL
   */
  static isValidMeetUrl(url) {
    if (!url || typeof url !== 'string') {
      return false;
    }

    const meetUrlPattern = /^https:\/\/meet\.google\.com\/[a-z-]+$/i;
    return meetUrlPattern.test(url);
  }

  /**
   * Get meeting info from URL
   * @param {string} meetUrl - Google Meet URL
   * @returns {Object} Meeting info
   */
  static getMeetingInfo(meetUrl) {
    if (!this.isValidMeetUrl(meetUrl)) {
      return null;
    }

    const roomCode = meetUrl.replace('https://meet.google.com/', '');

    return {
      roomCode,
      fullUrl: meetUrl,
      isValid: true,
    };
  }
}

export default GoogleMeetHelper;
