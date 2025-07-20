package com.satori.platform.service.mapper;

import com.satori.platform.domain.Question;
import com.satori.platform.domain.Quiz;
import com.satori.platform.domain.QuizQuestion;
import com.satori.platform.service.dto.QuestionDTO;
import com.satori.platform.service.dto.QuizDTO;
import com.satori.platform.service.dto.QuizQuestionDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link QuizQuestion} and its DTO {@link QuizQuestionDTO}.
 */
@Mapper(componentModel = "spring")
public interface QuizQuestionMapper extends EntityMapper<QuizQuestionDTO, QuizQuestion> {
    @Mapping(target = "quiz", source = "quiz", qualifiedByName = "quizId")
    @Mapping(target = "question", source = "question", qualifiedByName = "questionId")
    QuizQuestionDTO toDto(QuizQuestion s);

    @Named("quizId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    QuizDTO toDtoQuizId(Quiz quiz);

    @Named("questionId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    QuestionDTO toDtoQuestionId(Question question);
}
