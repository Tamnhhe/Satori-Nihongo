package com.satori.platform.service;

import com.satori.platform.domain.enumeration.DifficultyLevel;
import com.satori.platform.service.dto.*;
import com.satori.platform.service.exception.AIServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

import java.util.*;
import java.util.regex.Pattern;

/**
 * Service for AI-powered content analysis and question generation.
 * Integrates with external AI/ML services for natural language processing.
 */
@Service
public class AIContentAnalysisService {

    private static final Logger log = LoggerFactory.getLogger(AIContentAnalysisService.class);

    private final RestTemplate restTemplate;

    @Value("${app.ai.service.url:}")
    private String aiServiceUrl;

    @Value("${app.ai.service.api-key:}")
    private String aiServiceApiKey;

    @Value("${app.ai.service.timeout:30000}")
    private int aiServiceTimeout;

    @Value("${app.ai.service.enabled:false}")
    private boolean aiServiceEnabled;

    @Value("${app.ai.service.model:gpt-3.5-turbo}")
    private String aiModel;

    @Value("${app.ai.service.max-tokens:2000}")
    private int maxTokens;

    private static final Pattern QUESTION_PATTERN = Pattern.compile("Q\\d+:|Question \\d+:", Pattern.CASE_INSENSITIVE);

    public AIContentAnalysisService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Generate questions using AI service based on content and requirements.
     *
     * @param request the question generation request
     * @return list of AI-generated questions
     */
    public List<AIGeneratedQuestionDTO> generateQuestions(AIQuestionGenerationRequestDTO request) {
        log.debug("Generating questions using AI service for content length: {}",
                request.getContent() != null ? request.getContent().length() : 0);

        if (!aiServiceEnabled) {
            log.warn("AI service is disabled, throwing exception");
            throw new AIServiceException("AI service is not enabled");
        }

        validateGenerationRequest(request);

        try {
            // Prepare AI prompt
            String prompt = buildQuestionGenerationPrompt(request);

            // Call AI service
            String aiResponse = callAIService(prompt);

            // Parse AI response into questions
            List<AIGeneratedQuestionDTO> questions = parseAIResponse(aiResponse, request);

            // Validate and enhance questions
            questions = validateAndEnhanceQuestions(questions, request);

            log.info("Successfully generated {} questions using AI service", questions.size());

            return questions;

        } catch (Exception e) {
            log.error("Failed to generate questions using AI service: {}", e.getMessage(), e);
            throw new AIServiceException("AI question generation failed: " + e.getMessage(), e);
        }
    }

    /**
     * Analyze content difficulty and suggest appropriate question types.
     *
     * @param content the content to analyze
     * @return content analysis result
     */
    public ContentAnalysisResultDTO analyzeContent(String content) {
        log.debug("Analyzing content difficulty and structure");

        ContentAnalysisResultDTO result = new ContentAnalysisResultDTO();

        if (content == null || content.trim().isEmpty()) {
            result.setDifficultyLevel(DifficultyLevel.EASY);
            result.setSuggestedQuestionTypes(Arrays.asList("multiple_choice"));
            result.setKeyTopics(new ArrayList<>());
            return result;
        }

        try {
            if (aiServiceEnabled) {
                result = analyzeContentWithAI(content);
            } else {
                result = analyzeContentBasic(content);
            }
        } catch (Exception e) {
            log.warn("Content analysis failed, using basic analysis: {}", e.getMessage());
            result = analyzeContentBasic(content);
        }

        return result;
    }

    /**
     * Validate question quality and difficulty assessment.
     *
     * @param question the question to validate
     * @return quality assessment result
     */
    public QuestionQualityAssessmentDTO assessQuestionQuality(AIGeneratedQuestionDTO question) {
        log.debug("Assessing quality of AI-generated question");

        QuestionQualityAssessmentDTO assessment = new QuestionQualityAssessmentDTO();
        assessment.setQuestionId(question.getId());

        // Basic validation checks
        List<String> issues = new ArrayList<>();
        double qualityScore = 100.0;

        // Check content quality
        if (question.getContent() == null || question.getContent().trim().length() < 10) {
            issues.add("Question content is too short or missing");
            qualityScore -= 30;
        }

        // Check answer quality
        if (question.getCorrectAnswer() == null || question.getCorrectAnswer().trim().isEmpty()) {
            issues.add("Correct answer is missing");
            qualityScore -= 40;
        }

        // Check explanation quality
        if (question.getExplanation() == null || question.getExplanation().trim().length() < 20) {
            issues.add("Answer explanation is too short or missing");
            qualityScore -= 20;
        }

        // Check for clarity and grammar (basic checks)
        if (question.getContent() != null) {
            if (!question.getContent().trim().endsWith("?") && !question.getContent().contains("Choose")
                    && !question.getContent().contains("Select")) {
                issues.add("Question may not be clearly formatted as a question");
                qualityScore -= 10;
            }
        }

        // Assess difficulty appropriateness
        DifficultyLevel assessedDifficulty = assessQuestionDifficulty(question);
        assessment.setAssessedDifficulty(assessedDifficulty);

        assessment.setQualityScore(Math.max(0, qualityScore));
        assessment.setIssues(issues);
        assessment.setIsAcceptable(qualityScore >= 60.0);

        return assessment;
    }

    // Private helper methods

    private void validateGenerationRequest(AIQuestionGenerationRequestDTO request) {
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("Content is required for question generation");
        }

        if (request.getQuestionCount() <= 0 || request.getQuestionCount() > 50) {
            throw new IllegalArgumentException("Question count must be between 1 and 50");
        }
    }

    private String buildQuestionGenerationPrompt(AIQuestionGenerationRequestDTO request) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("Generate ").append(request.getQuestionCount())
                .append(" educational questions based on the following content.\n\n");

        prompt.append("Content:\n").append(request.getContent()).append("\n\n");

        prompt.append("Requirements:\n");
        prompt.append("- Difficulty level: ").append(request.getDifficultyLevel()).append("\n");
        prompt.append("- Include images: ").append(request.getIncludeImages()).append("\n");

        if (request.getWeakAreas() != null && !request.getWeakAreas().isEmpty()) {
            prompt.append("- Focus on these weak areas: ").append(String.join(", ", request.getWeakAreas()))
                    .append("\n");
        }

        prompt.append("\nFormat each question as follows:\n");
        prompt.append("Q1: [Question content]\n");
        prompt.append("A1: [Correct answer]\n");
        prompt.append("Type1: [Question type: multiple_choice, true_false, short_answer, essay]\n");
        prompt.append("Explanation1: [Detailed explanation of the correct answer]\n");
        prompt.append("Hint1: [Optional hint for students]\n\n");

        prompt.append("Ensure questions are:\n");
        prompt.append("- Clear and unambiguous\n");
        prompt.append("- Appropriate for the specified difficulty level\n");
        prompt.append("- Directly related to the provided content\n");
        prompt.append("- Educational and engaging\n");

        return prompt.toString();
    }

    private String callAIService(String prompt) {
        if (aiServiceUrl == null || aiServiceUrl.trim().isEmpty()) {
            throw new AIServiceException("AI service URL is not configured");
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            if (aiServiceApiKey != null && !aiServiceApiKey.trim().isEmpty()) {
                headers.setBearerAuth(aiServiceApiKey);
            }

            // Prepare request body (this would depend on your AI service API)
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", aiModel);
            requestBody.put("prompt", prompt);
            requestBody.put("max_tokens", maxTokens);
            requestBody.put("temperature", 0.7);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map<String, Object>> response = restTemplate.postForEntity(aiServiceUrl, entity,
                    (Class<Map<String, Object>>) (Class<?>) Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                // Extract response text (this would depend on your AI service response format)
                Map<String, Object> responseBody = response.getBody();
                if (responseBody.containsKey("choices")) {
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                    if (!choices.isEmpty()) {
                        Map<String, Object> firstChoice = choices.get(0);
                        if (firstChoice.containsKey("text")) {
                            return (String) firstChoice.get("text");
                        }
                    }
                }

                throw new AIServiceException("Unexpected AI service response format");
            } else {
                throw new AIServiceException("AI service returned error status: " + response.getStatusCode());
            }

        } catch (RestClientException e) {
            throw new AIServiceException("Failed to call AI service: " + e.getMessage(), e);
        }
    }

    private List<AIGeneratedQuestionDTO> parseAIResponse(String aiResponse, AIQuestionGenerationRequestDTO request) {
        List<AIGeneratedQuestionDTO> questions = new ArrayList<>();

        if (aiResponse == null || aiResponse.trim().isEmpty()) {
            return questions;
        }

        // Split response into individual questions
        String[] lines = aiResponse.split("\n");
        AIGeneratedQuestionDTO currentQuestion = null;

        for (String line : lines) {
            line = line.trim();

            if (line.isEmpty()) {
                continue;
            }

            if (QUESTION_PATTERN.matcher(line).find()) {
                // Save previous question if exists
                if (currentQuestion != null) {
                    questions.add(currentQuestion);
                }

                // Start new question
                currentQuestion = new AIGeneratedQuestionDTO();
                currentQuestion.setContent(extractContent(line, "Q\\d+:|Question \\d+:"));
                currentQuestion.setDifficultyLevel(request.getDifficultyLevel());

            } else if (currentQuestion != null) {
                if (line.startsWith("A") && line.contains(":")) {
                    currentQuestion.setCorrectAnswer(extractContent(line, "A\\d+:|Answer \\d+:"));
                } else if (line.startsWith("Type") && line.contains(":")) {
                    currentQuestion.setType(extractContent(line, "Type\\d+:"));
                } else if (line.startsWith("Explanation") && line.contains(":")) {
                    currentQuestion.setExplanation(extractContent(line, "Explanation\\d+:"));
                } else if (line.startsWith("Hint") && line.contains(":")) {
                    currentQuestion.setHint(extractContent(line, "Hint\\d+:"));
                }
            }
        }

        // Add the last question
        if (currentQuestion != null) {
            questions.add(currentQuestion);
        }

        return questions;
    }

    private String extractContent(String line, String pattern) {
        return line.replaceFirst(pattern, "").trim();
    }

    private List<AIGeneratedQuestionDTO> validateAndEnhanceQuestions(List<AIGeneratedQuestionDTO> questions,
            AIQuestionGenerationRequestDTO request) {
        List<AIGeneratedQuestionDTO> validQuestions = new ArrayList<>();

        for (AIGeneratedQuestionDTO question : questions) {
            // Validate basic requirements
            if (question.getContent() != null && !question.getContent().trim().isEmpty() &&
                    question.getCorrectAnswer() != null && !question.getCorrectAnswer().trim().isEmpty()) {

                // Set defaults if missing
                if (question.getType() == null || question.getType().trim().isEmpty()) {
                    question.setType("multiple_choice");
                }

                if (question.getDifficultyLevel() == null) {
                    question.setDifficultyLevel(request.getDifficultyLevel());
                }

                // Generate ID
                question.setId(UUID.randomUUID().toString());

                validQuestions.add(question);
            }
        }

        return validQuestions;
    }

    private ContentAnalysisResultDTO analyzeContentWithAI(String content) {
        // This would call the AI service to analyze content
        // For now, we'll use basic analysis as fallback
        return analyzeContentBasic(content);
    }

    private ContentAnalysisResultDTO analyzeContentBasic(String content) {
        ContentAnalysisResultDTO result = new ContentAnalysisResultDTO();

        // Basic difficulty assessment based on content characteristics
        int wordCount = content.split("\\s+").length;
        int sentenceCount = content.split("[.!?]+").length;
        double avgWordsPerSentence = (double) wordCount / sentenceCount;

        // Simple heuristic for difficulty
        if (avgWordsPerSentence > 20 || content.contains("complex") || content.contains("advanced")) {
            result.setDifficultyLevel(DifficultyLevel.HARD);
        } else if (avgWordsPerSentence > 8 || wordCount > 100 || content.contains("algebra")
                || content.contains("geometry") || content.contains("statistics")) {
            result.setDifficultyLevel(DifficultyLevel.MEDIUM);
        } else {
            result.setDifficultyLevel(DifficultyLevel.EASY);
        }

        // Suggest question types based on content
        List<String> questionTypes = new ArrayList<>();
        questionTypes.add("multiple_choice");

        if (content.contains("true") || content.contains("false") || content.contains("correct")
                || content.contains("incorrect")) {
            questionTypes.add("true_false");
        }

        if (content.length() > 1000) {
            questionTypes.add("essay");
        } else {
            questionTypes.add("short_answer");
        }

        result.setSuggestedQuestionTypes(questionTypes);

        // Extract key topics (very basic approach)
        List<String> keyTopics = extractKeyTopics(content);
        result.setKeyTopics(keyTopics);

        return result;
    }

    private List<String> extractKeyTopics(String content) {
        // Very basic topic extraction - in reality, this would use NLP
        List<String> topics = new ArrayList<>();

        String[] words = content.toLowerCase().split("\\s+");
        Map<String, Integer> wordFreq = new HashMap<>();

        for (String word : words) {
            word = word.replaceAll("[^a-zA-Z]", "");
            if (word.length() > 4) { // Only consider longer words
                wordFreq.put(word, wordFreq.getOrDefault(word, 0) + 1);
            }
        }

        // Get top 5 most frequent words as topics
        wordFreq.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(5)
                .forEach(entry -> topics.add(entry.getKey()));

        return topics;
    }

    private DifficultyLevel assessQuestionDifficulty(AIGeneratedQuestionDTO question) {
        // Basic difficulty assessment based on question characteristics
        String content = question.getContent();

        if (content == null) {
            return DifficultyLevel.EASY;
        }

        int wordCount = content.split("\\s+").length;

        // Simple heuristics
        if (wordCount > 30 || content.contains("analyze") || content.contains("evaluate")
                || content.contains("synthesize")) {
            return DifficultyLevel.HARD;
        } else if (wordCount > 15 || content.contains("explain") || content.contains("compare")
                || content.contains("describe")) {
            return DifficultyLevel.MEDIUM;
        } else {
            return DifficultyLevel.EASY;
        }
    }
}