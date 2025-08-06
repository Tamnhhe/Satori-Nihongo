/**
 * Google Calendar Integration Test
 * Test các tính năng mở Google Calendar từ lịch học
 */

import GoogleCalendarHelper from '../../shared/services/google-calendar-helper';

class GoogleCalendarTest {
  /**
   * Test mở Google Calendar với dữ liệu mẫu
   */
  static async testOpenGoogleCalendar() {
    console.log('🗓️ Testing Google Calendar Integration...');

    // Tạo dữ liệu schedule mẫu
    const sampleSchedule = {
      id: 1,
      date: new Date(),
      startTime: new Date(Date.now() + 60 * 60 * 1000), // 1 giờ từ bây giờ
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 giờ từ bây giờ
      location: 'Tầng 3, Tòa nhà ABC, 123 Đường XYZ, Quận 1, TP.HCM',
      course: {
        id: 101,
        title: 'Tiếng Nhật Sơ Cấp N5',
      },
      description: 'Bài học về từ vựng và ngữ pháp cơ bản',
    };

    try {
      const result = await GoogleCalendarHelper.openGoogleCalendar(sampleSchedule);

      if (result) {
        console.log('✅ Google Calendar opened successfully');
        return {
          success: true,
          message: 'Google Calendar mở thành công',
          schedule: sampleSchedule,
        };
      } else {
        console.log('⚠️ Google Calendar could not be opened, fallback used');
        return {
          success: false,
          message: 'Không thể mở Google Calendar, đã hiển thị thông tin thay thế',
          schedule: sampleSchedule,
        };
      }
    } catch (error) {
      console.error('❌ Error testing Google Calendar:', error);
      return {
        success: false,
        error: error.message,
        schedule: sampleSchedule,
      };
    }
  }

  /**
   * Test với nhiều loại dữ liệu khác nhau
   */
  static async testVariousScheduleTypes() {
    console.log('🧪 Testing various schedule types...');

    const testCases = [
      {
        name: 'Online Class',
        schedule: {
          id: 1,
          startTime: new Date(),
          endTime: new Date(Date.now() + 60 * 60 * 1000),
          location: 'Online - Zoom Meeting',
          course: { title: 'Tiếng Nhật Online N4' },
        },
      },
      {
        name: 'Physical Class',
        schedule: {
          id: 2,
          startTime: new Date(),
          endTime: new Date(Date.now() + 90 * 60 * 1000),
          location: 'Trung tâm Satori Nihongo - Phòng 201',
          course: { title: 'Conversation Practice' },
        },
      },
      {
        name: 'Minimal Data',
        schedule: {
          id: 3,
          startTime: new Date(),
          location: 'TBD',
        },
      },
    ];

    const results = [];

    for (const testCase of testCases) {
      console.log(`Testing: ${testCase.name}`);

      try {
        const url = GoogleCalendarHelper.buildGoogleCalendarUrl(
          GoogleCalendarHelper.formatEventDetails(testCase.schedule)
        );

        results.push({
          name: testCase.name,
          success: true,
          url: url.substring(0, 100) + '...', // Truncate for readability
          schedule: testCase.schedule,
        });

        console.log(`✅ ${testCase.name} - URL generated successfully`);
      } catch (error) {
        results.push({
          name: testCase.name,
          success: false,
          error: error.message,
          schedule: testCase.schedule,
        });

        console.error(`❌ ${testCase.name} - Error:`, error.message);
      }
    }

    return results;
  }

  /**
   * Test quick open method
   */
  static async testQuickOpen() {
    console.log('⚡ Testing quick open method...');

    try {
      const result = await GoogleCalendarHelper.quickOpen(
        'Bài kiểm tra N5',
        'Trung tâm Satori Nihongo',
        new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        new Date(Date.now() + 25 * 60 * 60 * 1000) // Tomorrow + 1 hour
      );

      return {
        success: result,
        message: result ? 'Quick open thành công' : 'Quick open failed',
      };
    } catch (error) {
      console.error('❌ Quick open test failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Chạy tất cả tests
   */
  static async runAllTests() {
    console.log('🚀 Starting Google Calendar Integration Tests...');

    const results = {
      timestamp: new Date().toISOString(),
      tests: {},
    };

    // Test 1: Basic Google Calendar opening
    console.log('\\n--- Test 1: Basic Google Calendar Opening ---');
    results.tests.basicOpen = await this.testOpenGoogleCalendar();

    // Test 2: Various schedule types
    console.log('\\n--- Test 2: Various Schedule Types ---');
    results.tests.variousTypes = await this.testVariousScheduleTypes();

    // Test 3: Quick open method
    console.log('\\n--- Test 3: Quick Open Method ---');
    results.tests.quickOpen = await this.testQuickOpen();

    console.log('\\n🏁 All tests completed!');
    console.log('Results summary:', {
      basicOpen: results.tests.basicOpen.success ? '✅' : '❌',
      variousTypes: results.tests.variousTypes.every((t) => t.success) ? '✅' : '❌',
      quickOpen: results.tests.quickOpen.success ? '✅' : '❌',
    });

    return results;
  }
}

export default GoogleCalendarTest;
