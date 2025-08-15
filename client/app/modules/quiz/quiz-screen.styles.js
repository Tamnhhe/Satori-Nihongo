import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // Header
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },

  // Progress
  progressContainer: {
    flex: 1,
    marginRight: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 4,
  },

  // Timer
  timerContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  // Question Counter
  questionCounter: {
    alignItems: 'center',
  },
  questionCounterText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Question Title
  questionTitleContainer: {
    paddingVertical: 20,
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E3A8A',
    textAlign: 'center',
  },

  // Question
  questionContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  questionJapanese: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1E3A8A',
    textAlign: 'center',
    marginBottom: 12,
  },
  questionRomanji: {
    fontSize: 20,
    color: '#3B82F6',
    textAlign: 'center',
  },

  // Options
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  optionButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  correctOption: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  wrongOption: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  disabledOption: {
    opacity: 0.5,
  },

  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
  },
  optionIcon: {
    marginLeft: 12,
  },
});
