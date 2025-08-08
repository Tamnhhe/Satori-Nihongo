/**
 * Google Meet Integration Test
 * Test các tính năng mở Google Meet từ lịch học
 */

import GoogleMeetHelper from '../../shared/services/google-meet-helper';

class GoogleMeetTest {
  /**
   * Test mở Google Meet với dữ liệu mẫu
   */
  static async testOpenGoogleMeet() {
    console.log('📹 Testing Google Meet Integration...');

    // Tạo dữ liệu schedule mẫu với Google Meet URL
    const sampleSchedule = {
      id: 1,
      date: new Date(),
      startTime: new Date(Date.now() + 60 * 60 * 1000), // 1 giờ từ bây giờ
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 giờ từ bây giờ
      location: 'Online - Google Meet: https://meet.google.com/abc-defg-hij',
      meetUrl: 'https://meet.google.com/abc-defg-hij',
      course: {
        id: 101,
        title: 'Tiếng Nhật Sơ Cấp N5',
      },
      description: 'Bài học online qua Google Meet',
    };

    try {
      const result = await GoogleMeetHelper.openGoogleMeet(sampleSchedule);

      if (result) {
        console.log('✅ Google Meet opened successfully');
        return {
          success: true,
          message: 'Google Meet mở thành công',
          schedule: sampleSchedule,
        };
      } else {
        console.log('⚠️ Google Meet could not be opened, fallback used');
        return {
          success: false,
          message: 'Không thể mở Google Meet, đã hiển thị thông tin thay thế',
          schedule: sampleSchedule,
        };
      }
    } catch (error) {
      console.error('❌ Error testing Google Meet:', error);
      return {
        success: false,
        error: error.message,
        schedule: sampleSchedule,
      };
    }
  }

  /**
   * Test extract Google Meet URL từ các định dạng khác nhau
   */
  static testExtractMeetUrl() {
    console.log('🔍 Testing Google Meet URL extraction...');

    const testCases = [
      {
        name: 'Direct meetUrl field',
        schedule: {
          meetUrl: 'https://meet.google.com/abc-defg-hij',
        },
        expected: 'https://meet.google.com/abc-defg-hij',
      },
      {
        name: 'URL in location field',
        schedule: {
          location: 'Online - Google Meet: https://meet.google.com/xyz-uvwx-rst',
        },
        expected: 'https://meet.google.com/xyz-uvwx-rst',
      },
      {
        name: 'Room code in description',
        schedule: {
          description: 'Buổi học online với room code: abc-defg-hij',
        },
        expected: 'https://meet.google.com/abc-defg-hij',
      },
      {
        name: 'No Google Meet URL',
        schedule: {
          location: 'Phòng học 101, Tầng 2',
        },
        expected: null,
      },
      {
        name: 'Course meetUrl',
        schedule: {
          course: {
            meetUrl: 'https://meet.google.com/course-meet-123',
          },
        },
        expected: 'https://meet.google.com/course-meet-123',
      },
    ];

    const results = [];

    testCases.forEach((testCase) => {
      console.log(`Testing: ${testCase.name}`);

      try {
        const extractedUrl = GoogleMeetHelper.extractMeetUrl(testCase.schedule);
        const success = extractedUrl === testCase.expected;

        results.push({
          name: testCase.name,
          success,
          expected: testCase.expected,
          actual: extractedUrl,
          schedule: testCase.schedule,
        });

        if (success) {
          console.log(`✅ ${testCase.name} - URL extracted correctly`);
        } else {
          console.log(`❌ ${testCase.name} - Expected: ${testCase.expected}, Got: ${extractedUrl}`);
        }
      } catch (error) {
        results.push({
          name: testCase.name,
          success: false,
          error: error.message,
          schedule: testCase.schedule,
        });

        console.error(`❌ ${testCase.name} - Error:`, error.message);
      }
    });

    return results;
  }

  /**
   * Test URL validation
   */
  static testUrlValidation() {
    console.log('✅ Testing URL validation...');

    const testUrls = [
      { url: 'https://meet.google.com/abc-defg-hij', expected: true },
      { url: 'https://meet.google.com/xyz-uvwx-rst', expected: true },
      { url: 'https://meet.google.com/invalid', expected: false },
      { url: 'https://zoom.us/meeting/123', expected: false },
      { url: 'not-a-url', expected: false },
      { url: '', expected: false },
      { url: null, expected: false },
    ];

    const results = [];

    testUrls.forEach((testCase) => {
      const isValid = GoogleMeetHelper.isValidMeetUrl(testCase.url);
      const success = isValid === testCase.expected;

      results.push({
        url: testCase.url,
        expected: testCase.expected,
        actual: isValid,
        success,
      });

      if (success) {
        console.log(`✅ "${testCase.url}" - Validation correct`);
      } else {
        console.log(`❌ "${testCase.url}" - Expected: ${testCase.expected}, Got: ${isValid}`);
      }
    });

    return results;
  }

  /**
   * Test quick open method
   */
  static async testQuickOpen() {
    console.log('⚡ Testing quick open method...');

    try {
      const result = await GoogleMeetHelper.quickOpenMeet(
        'https://meet.google.com/test-meet-room',
        'Test Course'
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
    console.log('🚀 Starting Google Meet Integration Tests...');

    const results = {
      timestamp: new Date().toISOString(),
      tests: {},
    };

    // Test 1: Basic Google Meet opening
    console.log('\\n--- Test 1: Basic Google Meet Opening ---');
    results.tests.basicOpen = await this.testOpenGoogleMeet();

    // Test 2: URL extraction
    console.log('\\n--- Test 2: Google Meet URL Extraction ---');
    results.tests.urlExtraction = this.testExtractMeetUrl();

    // Test 3: URL validation
    console.log('\\n--- Test 3: URL Validation ---');
    results.tests.urlValidation = this.testUrlValidation();

    // Test 4: Quick open method
    console.log('\\n--- Test 4: Quick Open Method ---');
    results.tests.quickOpen = await this.testQuickOpen();

    console.log('\\n🏁 All tests completed!');
    console.log('Results summary:', {
      basicOpen: results.tests.basicOpen.success ? '✅' : '❌',
      urlExtraction: results.tests.urlExtraction.every((t) => t.success) ? '✅' : '❌',
      urlValidation: results.tests.urlValidation.every((t) => t.success) ? '✅' : '❌',
      quickOpen: results.tests.quickOpen.success ? '✅' : '❌',
    });

    return results;
  }
}

export default GoogleMeetTest;
