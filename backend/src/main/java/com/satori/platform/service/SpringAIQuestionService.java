package com.satori.platform.service;

import com.satori.platform.service.dto.AIGeneratedQuestionDTO;
import com.satori.platform.service.dto.AIQuestionGenerationRequestDTO;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Question generation using Spring AI ChatClient (Vertex AI Gemini or other providers).
 */
@Service
public class SpringAIQuestionService {

    private static final Logger log = LoggerFactory.getLogger(SpringAIQuestionService.class);

    private final ChatClient chatClient;

    @Value("${app.ai.practice-test.max-question-count:50}")
    private int maxQuestionCount;

    private static final Pattern QUESTION_PATTERN = Pattern.compile("Q\\d+:|Question \\d+:", Pattern.CASE_INSENSITIVE);

    public SpringAIQuestionService(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    public List<AIGeneratedQuestionDTO> generateQuestions(AIQuestionGenerationRequestDTO request) {
        if (request.getQuestionCount() <= 0 || request.getQuestionCount() > maxQuestionCount) {
            throw new IllegalArgumentException("Question count must be between 1 and " + maxQuestionCount);
        }

        String prompt = buildPrompt(request);

        log.debug("Calling Spring AI chat model to generate {} questions", request.getQuestionCount());

        String content = chatClient.prompt().user(prompt).call().content();

        return parseQuestions(content, request);
    }

    private String buildPrompt(AIQuestionGenerationRequestDTO request) {
        PromptTemplate template = new PromptTemplate(
            """
            You are an experienced educational content creator.
            Generate {count} high-quality questions in English based on the content below.

            Content:
            {content}

            Requirements:
            - Difficulty level: {difficulty}
            - Include images: {includeImages}
            - Focus weak areas: {weakAreas}

            Format each question exactly as:
            Q1: <question text>
            A1: <correct answer>
            Type1: <multiple_choice|true_false|short_answer|essay>
            Explanation1: <explanation>
            Hint1: <optional hint>
            """
        );

        return template.render(
            java.util.Map.of(
                "count",
                request.getQuestionCount(),
                "content",
                request.getContent(),
                "difficulty",
                String.valueOf(request.getDifficultyLevel()),
                "includeImages",
                String.valueOf(Boolean.TRUE.equals(request.getIncludeImages())),
                "weakAreas",
                request.getWeakAreas() != null ? String.join(", ", request.getWeakAreas()) : "none"
            )
        );
    }

    private List<AIGeneratedQuestionDTO> parseQuestions(String aiResponse, AIQuestionGenerationRequestDTO request) {
        List<AIGeneratedQuestionDTO> questions = new ArrayList<>();
        if (aiResponse == null || aiResponse.isBlank()) return questions;

        String[] lines = aiResponse.split("\n");
        AIGeneratedQuestionDTO current = null;
        for (String raw : lines) {
            String line = raw.trim();
            if (line.isEmpty()) continue;

            if (QUESTION_PATTERN.matcher(line).find()) {
                if (current != null) questions.add(current);
                current = new AIGeneratedQuestionDTO();
                current.setContent(line.replaceFirst("(?i)Q\\d+:|(?i)Question \\d+:", "").trim());
                current.setDifficultyLevel(request.getDifficultyLevel());
                continue;
            }
            if (current == null) continue;

            if (line.startsWith("A")) {
                current.setCorrectAnswer(line.substring(line.indexOf(":") + 1).trim());
            } else if (line.toLowerCase().startsWith("type")) {
                String t = line.substring(line.indexOf(":") + 1).trim();
                current.setType(normalizeType(t));
            } else if (line.toLowerCase().startsWith("explanation")) {
                current.setExplanation(line.substring(line.indexOf(":") + 1).trim());
            } else if (line.toLowerCase().startsWith("hint")) {
                current.setHint(line.substring(line.indexOf(":") + 1).trim());
            }
        }
        if (current != null) questions.add(current);

        return questions;
    }

    private String normalizeType(String t) {
        String s = t.toLowerCase();
        if (s.contains("multiple")) return "multiple_choice";
        if (s.contains("true") || s.contains("false")) return "true_false";
        if (s.contains("essay")) return "essay";
        return "short_answer";
    }
}
