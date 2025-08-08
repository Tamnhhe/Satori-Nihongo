import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  infoCard: {
    marginBottom: 16,
    elevation: 2,
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
    marginBottom: 16,
  },
  courseInfo: {
    marginBottom: 16,
  },
  progressSection: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  contentCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
  resourceCard: {
    marginBottom: 24,
    elevation: 2,
  },
  resourceButtons: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  resourceButton: {
    flex: 1,
    minWidth: 120,
  },
  noResourceContainer: {
    padding: 24,
    alignItems: 'center',
    borderRadius: 8,
  },
  noResourceText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  startButton: {
    marginBottom: 32,
    elevation: 3,
  },
  startButtonContent: {
    paddingVertical: 8,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    marginTop: 16,
  },
});
