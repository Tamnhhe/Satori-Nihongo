import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
    opacity: 0.8,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  testButton: {
    marginBottom: 12,
  },
  clearButton: {
    marginTop: 8,
  },
  summaryCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  summaryText: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
  summaryNote: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  divider: {
    marginVertical: 12,
  },
  resultsContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  resultCard: {
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 2,
  },
  resultContent: {
    paddingVertical: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  resultTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  resultMessage: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  resultData: {
    fontSize: 12,
    fontFamily: 'monospace',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    opacity: 0.7,
  },
  navigationSection: {
    padding: 16,
    alignItems: 'center',
  },
  navigationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 12,
  },
  navigationButton: {
    marginTop: 8,
  },
  comparisonCard: {
    margin: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  comparisonItem: {
    alignItems: 'center',
  },
  comparisonLabel: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  comparisonValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
