package com.satori.platform.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

/**
 * Service for handling scheduled quiz operations.
 */
@Service
public class QuizSchedulingService {

    private static final Logger LOG = LoggerFactory.getLogger(QuizSchedulingService.class);

    private final QuizService quizService;

    public QuizSchedulingService(QuizService quizService) {
        this.quizService = quizService;
    }

    /**
     * Process automatic quiz activation/deactivation every minute.
     */
    @Scheduled(fixedRate = 60000) // Run every minute
    public void processAutomaticQuizActivation() {
        LOG.debug("Running scheduled quiz activation/deactivation check");
        try {
            quizService.processAutomaticActivation();
        } catch (Exception e) {
            LOG.error("Error during automatic quiz activation/deactivation", e);
        }
    }
}