import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  startContainer: {
    padding: 16,
    justifyContent: 'center',
    minHeight: '100%',
  },
  startCard: {
    elevation: 4,
  },
  startHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  quizTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  quizDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  quizInfo: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 12,
  },
  lessonInfo: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  lessonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  startButton: {
    marginTop: 8,
  },
  startButtonContent: {
    paddingVertical: 8,
  },
  header: {
    elevation: 4,
    paddingTop: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  headerInfo: {
    alignItems: 'flex-end',
  },
  questionCounter: {
    fontSize: 16,
    fontWeight: '600',
  },
  timer: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  progressBar: {
    height: 4,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  questionContainer: {
    flex: 1,
    padding: 16,
  },
  questionCard: {
    elevation: 2,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
    marginBottom: 24,
  },
  optionsContainer: {
    marginTop: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
    lineHeight: 24,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    elevation: 4,
  },
  navButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  resultsCard: {
    elevation: 4,
    marginBottom: 16,
  },
  scoreHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  resultChip: {
    alignSelf: 'center',
  },
  reviewCard: {
    elevation: 2,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reviewQuestion: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginRight: 12,
  },
  explanation: {
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    marginTop: 8,
  },
  resultsActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});
