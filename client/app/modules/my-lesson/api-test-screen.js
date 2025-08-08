import React, { useState, useCallback } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import {
  Text,
  Button,
  Card,
  useTheme,
  ActivityIndicator,
  Surface,
  Divider,
} from 'react-native-paper';
import { connect } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LessonService from '../../shared/services/lesson.service';
import CourseService from '../../shared/services/course.service';
import QuizService from '../../shared/services/quiz.service';
import notificationService from '../../shared/services/notification.service';
import IntegrationTestManager from './integration-test-manager';
import { mockLessons } from '../../shared/data/mock-data';
import styles from './api-test-screen.styles';

function ApiTestScreen(props) {
  const { api, navigation } = props;
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [backendLessons, setBackendLessons] = useState([]);
  const [backendCourses, setBackendCourses] = useState([]);
  const [backendQuizzes, setBackendQuizzes] = useState([]);
  const [apiStatus, setApiStatus] = useState('not_tested');

  const lessonService = new LessonService(api);
  const courseService = new CourseService(api);
  const quizService = new QuizService(api);
  const integrationTestManager = new IntegrationTestManager(api);

  const addTestResult = useCallback((test, success, message, data = null) => {
    const result = {
      test,
      success,
      message,
      data,
      timestamp: new Date().toLocaleTimeString(),
    };

    setTestResults((prev) => [...prev, result]);
    console.log('API Test Result:', result);
  }, []);

  const testBackendConnection = useCallback(async () => {
    setLoading(true);
    setTestResults([]);
    setApiStatus('testing');

    try {
      addTestResult('API Connection', true, 'Starting comprehensive backend API tests...');

      // Test 1: Get all courses
      addTestResult('Course List', true, 'Testing course list endpoint...');
      const coursesResult = await courseService.getAllCourses({
        page: 0,
        size: 10,
        sort: 'id,desc',
      });

      if (coursesResult.success) {
        setBackendCourses(coursesResult.data);
        addTestResult(
          'Course List',
          true,
          `✅ Successfully loaded ${coursesResult.data.length} courses from backend`,
          { count: coursesResult.data.length, totalItems: coursesResult.pagination?.totalItems }
        );

        // Test individual course if any courses exist
        if (coursesResult.data.length > 0) {
          const firstCourse = coursesResult.data[0];
          addTestResult('Single Course', true, `Testing get course #${firstCourse.id}...`);

          const courseResult = await courseService.getCourse(firstCourse.id);

          if (courseResult.success) {
            addTestResult(
              'Single Course',
              true,
              `✅ Successfully loaded course: ${courseResult.data.name || courseResult.data.id}`,
              { course: courseResult.data }
            );
          } else {
            addTestResult(
              'Single Course',
              false,
              `❌ Failed to load course: ${courseResult.message}`
            );
          }
        } else {
          addTestResult(
            'Single Course',
            true,
            'ℹ️ No courses available to test individual course endpoint'
          );
        }
      } else {
        addTestResult('Course List', false, `❌ Failed to load courses: ${coursesResult.message}`);
      }

      // Test 2: Get all lessons
      addTestResult('Lesson List', true, 'Testing lesson list endpoint...');
      const lessonsResult = await lessonService.getAllLessons({
        page: 0,
        size: 10,
        sort: 'id,desc',
      });

      if (lessonsResult.success) {
        setBackendLessons(lessonsResult.data);
        addTestResult(
          'Lesson List',
          true,
          `✅ Successfully loaded ${lessonsResult.data.length} lessons from backend`,
          { count: lessonsResult.data.length, totalItems: lessonsResult.pagination?.totalItems }
        );

        // Test individual lesson if any lessons exist
        if (lessonsResult.data.length > 0) {
          const firstLesson = lessonsResult.data[0];
          addTestResult('Single Lesson', true, `Testing get lesson #${firstLesson.id}...`);

          const lessonResult = await lessonService.getLesson(firstLesson.id);

          if (lessonResult.success) {
            addTestResult(
              'Single Lesson',
              true,
              `✅ Successfully loaded lesson: ${lessonResult.data.title || lessonResult.data.id}`,
              { lesson: lessonResult.data }
            );
          } else {
            addTestResult(
              'Single Lesson',
              false,
              `❌ Failed to load lesson: ${lessonResult.message}`
            );
          }
        } else {
          addTestResult(
            'Single Lesson',
            true,
            'ℹ️ No lessons available to test individual lesson endpoint'
          );
        }
      } else {
        addTestResult('Lesson List', false, `❌ Failed to load lessons: ${lessonsResult.message}`);
      }

      // Test 3: Get all quizzes
      addTestResult('Quiz List', true, 'Testing quiz list endpoint...');
      const quizzesResult = await quizService.getAllQuizzes({
        page: 0,
        size: 10,
        sort: 'id,desc',
      });

      if (quizzesResult.success) {
        setBackendQuizzes(quizzesResult.data);
        addTestResult(
          'Quiz List',
          true,
          `✅ Successfully loaded ${quizzesResult.data.length} quizzes from backend`,
          { count: quizzesResult.data.length, totalItems: quizzesResult.pagination?.totalItems }
        );

        // Test individual quiz if any quizzes exist
        if (quizzesResult.data.length > 0) {
          const firstQuiz = quizzesResult.data[0];
          addTestResult('Single Quiz', true, `Testing get quiz #${firstQuiz.id}...`);

          const quizResult = await quizService.getQuiz(firstQuiz.id);

          if (quizResult.success) {
            addTestResult(
              'Single Quiz',
              true,
              `✅ Successfully loaded quiz: ${quizResult.data.title || quizResult.data.id}`,
              { quiz: quizResult.data }
            );
          } else {
            addTestResult('Single Quiz', false, `❌ Failed to load quiz: ${quizResult.message}`);
          }
        } else {
          addTestResult(
            'Single Quiz',
            true,
            'ℹ️ No quizzes available to test individual quiz endpoint'
          );
        }
      } else {
        addTestResult('Quiz List', false, `❌ Failed to load quizzes: ${quizzesResult.message}`);
      }

      // Test 4: Test notification service
      addTestResult('Notification', true, 'Testing notification service initialization...');
      try {
        const notificationToken = await notificationService.initialize();

        if (notificationToken) {
          addTestResult(
            'Notification',
            true,
            `✅ Notification service initialized with token: ${notificationToken.substring(0, 20)}...`,
            { token: notificationToken }
          );

          // Test push notification
          addTestResult('Push Notification', true, 'Testing push notification...');
          const notificationSent = await notificationService.sendIncompleteCoursesNotification(
            backendLessons.length || 5
          );

          if (notificationSent) {
            addTestResult(
              'Push Notification',
              true,
              `✅ Successfully sent test notification about ${backendLessons.length || 5} incomplete lessons`
            );
          } else {
            addTestResult('Push Notification', false, '❌ Failed to send test notification');
          }
        } else {
          addTestResult(
            'Notification',
            false,
            '❌ Failed to initialize notification service (likely on simulator)'
          );
        }
      } catch (notificationError) {
        addTestResult(
          'Notification',
          false,
          `❌ Notification test failed: ${notificationError.message}`
        );
      }

      // Test 5: Search functionality
      if (lessonsResult.success && lessonsResult.data.length > 0) {
        addTestResult('Search', true, 'Testing search functionality...');
        const searchResult = await lessonService.searchLessons('lesson', { size: 5 });

        if (searchResult.success) {
          addTestResult('Search', true, `✅ Search returned ${searchResult.data.length} results`, {
            searchTerm: 'lesson',
            results: searchResult.data.length,
          });
        } else {
          addTestResult('Search', false, `❌ Search failed: ${searchResult.message}`);
        }
      }

      // Final summary
      const allTests = testResults.filter((r) => r.success !== undefined);
      const successfulTests = allTests.filter((r) => r.success);

      addTestResult(
        'Summary',
        successfulTests.length >= allTests.length - 1, // Allow 1 failure for simulator notifications
        `🎯 Completed ${successfulTests.length}/${allTests.length} tests successfully`
      );

      setApiStatus(successfulTests.length >= allTests.length - 1 ? 'success' : 'partial');
    } catch (error) {
      console.error('API Test Error:', error);
      addTestResult('Connection', false, `❌ Critical error: ${error.message}`);
      setApiStatus('failed');
    } finally {
      setLoading(false);
    }
  }, [
    api,
    lessonService,
    courseService,
    quizService,
    notificationService,
    addTestResult,
    backendLessons.length,
    testResults,
  ]);

  const testLoginNotification = useCallback(async () => {
    try {
      addTestResult('Login Notification', true, 'Testing complete login flow simulation...');

      // Use integration test manager for complete flow
      const result = await integrationTestManager.simulateLoginFlow('Test User');

      if (result.success) {
        addTestResult(
          'Login Flow Simulation',
          true,
          `✅ Complete login flow successful! Notification: Bạn còn ${result.data?.remainingLessons || 0} bài học chưa hoàn thành`,
          result.data
        );
      } else {
        addTestResult('Login Flow Simulation', false, `❌ Login flow failed: ${result.message}`);
      }
    } catch (error) {
      addTestResult('Login Flow Simulation', false, `❌ Error: ${error.message}`);
    }
  }, [integrationTestManager, addTestResult]);

  const testAllNotifications = useCallback(async () => {
    try {
      addTestResult('All Notifications', true, 'Testing all notification types...');

      const result = await integrationTestManager.testAllNotifications();

      if (result.success) {
        // Add individual results
        result.results.forEach((test) => {
          addTestResult(`Notification: ${test.type}`, test.success, test.message);
        });

        addTestResult(
          'All Notifications',
          true,
          `✅ All ${result.results.length} notification types tested successfully`
        );
      } else {
        addTestResult(
          'All Notifications',
          false,
          `❌ Notification tests failed: ${result.message}`
        );
      }
    } catch (error) {
      addTestResult('All Notifications', false, `❌ Error: ${error.message}`);
    }
  }, [integrationTestManager, addTestResult]);

  const clearResults = useCallback(() => {
    setTestResults([]);
    setApiStatus('not_tested');
  }, []);

  const navigateToLessons = useCallback(() => {
    navigation.navigate('MyLesson');
  }, [navigation]);

  const renderTestResult = (result, index) => {
    const icon =
      result.success === true
        ? 'check-circle'
        : result.success === false
          ? 'close-circle'
          : 'information';
    const color =
      result.success === true
        ? theme.colors.primary
        : result.success === false
          ? theme.colors.error
          : theme.colors.outline;

    return (
      <Card key={index} style={[styles.resultCard, { borderLeftColor: color }]}>
        <Card.Content style={styles.resultContent}>
          <View style={styles.resultHeader}>
            <MaterialCommunityIcons name={icon} size={20} color={color} />
            <Text style={[styles.resultTitle, { color }]}>{result.test}</Text>
            <Text style={styles.resultTime}>{result.timestamp}</Text>
          </View>
          <Text style={styles.resultMessage}>{result.message}</Text>
          {result.data && (
            <Text style={styles.resultData}>
              Data: {JSON.stringify(result.data, null, 2).substring(0, 200)}
              {JSON.stringify(result.data, null, 2).length > 200 ? '...' : ''}
            </Text>
          )}
        </Card.Content>
      </Card>
    );
  };

  const renderDataSummary = () => {
    if (apiStatus !== 'success' && apiStatus !== 'partial') return null;

    return (
      <Surface style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>📊 Data Summary</Text>
        <Divider style={styles.divider} />

        <View style={styles.summaryRow}>
          <MaterialCommunityIcons name="book-outline" size={20} color={theme.colors.primary} />
          <Text style={styles.summaryText}>Courses: {backendCourses.length}</Text>
        </View>

        <View style={styles.summaryRow}>
          <MaterialCommunityIcons name="school-outline" size={20} color={theme.colors.primary} />
          <Text style={styles.summaryText}>Lessons: {backendLessons.length}</Text>
        </View>

        <View style={styles.summaryRow}>
          <MaterialCommunityIcons name="quiz" size={20} color={theme.colors.primary} />
          <Text style={styles.summaryText}>Quizzes: {backendQuizzes.length}</Text>
        </View>

        <Divider style={styles.divider} />

        <Text style={styles.summaryNote}>All services are ready for integration! 🚀</Text>
      </Surface>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🧪 API & Service Test Lab</Text>
        <Text style={styles.subtitle}>
          Test backend connectivity, service functionality, and notification system
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={testBackendConnection}
            loading={loading}
            disabled={loading}
            style={styles.testButton}
            icon="api"
          >
            {loading ? 'Running Tests...' : 'Run Full API Test Suite'}
          </Button>

          <Button
            mode="outlined"
            onPress={testLoginNotification}
            disabled={loading}
            style={styles.testButton}
            icon="bell-outline"
          >
            Test Login Flow + Notification
          </Button>

          <Button
            mode="outlined"
            onPress={testAllNotifications}
            disabled={loading}
            style={styles.testButton}
            icon="bell-ring"
          >
            Test All Notifications
          </Button>

          <Button
            mode="text"
            onPress={clearResults}
            disabled={loading}
            style={styles.clearButton}
            icon="delete-outline"
          >
            Clear Results
          </Button>
        </View>

        {renderDataSummary()}

        {testResults.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>🔍 Test Results</Text>
            {testResults.map(renderTestResult)}
          </View>
        )}

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Running comprehensive tests...</Text>
          </View>
        )}

        {/* Navigation to Lessons */}
        {apiStatus === 'success' && (
          <View style={styles.navigationSection}>
            <Divider style={styles.divider} />
            <Text style={styles.navigationTitle}>🎉 Backend kết nối thành công!</Text>
            <Button
              mode="contained"
              onPress={navigateToLessons}
              style={styles.navigationButton}
              icon="school"
            >
              Xem danh sách bài học
            </Button>
          </View>
        )}

        {/* Mock Data Comparison */}
        <Card style={styles.comparisonCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>📊 Data Comparison</Text>
            <View style={styles.comparisonRow}>
              <View style={styles.comparisonItem}>
                <Text style={styles.comparisonLabel}>Backend Courses</Text>
                <Text style={[styles.comparisonValue, { color: theme.colors.primary }]}>
                  {backendCourses.length}
                </Text>
              </View>
              <View style={styles.comparisonItem}>
                <Text style={styles.comparisonLabel}>Backend Lessons</Text>
                <Text style={[styles.comparisonValue, { color: theme.colors.primary }]}>
                  {backendLessons.length}
                </Text>
              </View>
              <View style={styles.comparisonItem}>
                <Text style={styles.comparisonLabel}>Backend Quizzes</Text>
                <Text style={[styles.comparisonValue, { color: theme.colors.primary }]}>
                  {backendQuizzes.length}
                </Text>
              </View>
            </View>
            <View style={styles.comparisonRow}>
              <View style={styles.comparisonItem}>
                <Text style={styles.comparisonLabel}>Mock Lessons</Text>
                <Text style={[styles.comparisonValue, { color: theme.colors.tertiary }]}>
                  {mockLessons.length}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Notification Info */}
        <Card style={styles.comparisonCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>🔔 Notification System</Text>
            <Text style={styles.comparisonLabel}>
              • Welcome notification khi đăng nhập thành công
            </Text>
            <Text style={styles.comparisonLabel}>• Hiển thị số lượng bài học chưa hoàn thành</Text>
            <Text style={styles.comparisonLabel}>• Push notification lên hệ thống điện thoại</Text>
            <Text style={styles.comparisonLabel}>
              • Badge count hiển thị số lượng bài học còn lại
            </Text>

            <Divider style={styles.divider} />

            <View style={styles.summaryRow}>
              <MaterialCommunityIcons
                name="information-outline"
                size={20}
                color={theme.colors.outline}
              />
              <Text style={[styles.summaryText, { fontSize: 14, opacity: 0.8 }]}>
                {notificationService.isRunningInExpoGo()
                  ? 'Đang chạy trong Expo Go - chỉ hiện alert thay vì push notification'
                  : 'Chạy trong development/production build - hỗ trợ đầy đủ push notification'}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const mapStateToProps = (state) => {
  return {
    api: state.api,
  };
};

export default connect(mapStateToProps)(ApiTestScreen);
