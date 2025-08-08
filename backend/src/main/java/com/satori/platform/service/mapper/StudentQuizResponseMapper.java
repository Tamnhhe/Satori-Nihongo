package com.satori.platform.service.mapper;

import com.satori.platform.domain.StudentQuiz;
import com.satori.platform.domain.StudentQuizResponse;
import com.satori.platform.domain.QuizQuestion;
import com.satori.platform.service.dto.StudentQuizResponseDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link StudentQuizResponse} and its DTO
 * {@link StudentQuizResponseDTO}.
 */
@Mapper(componentModel = "spring", uses = { QuizQuestionMapper.class })
public interface StudentQuizResponseMapper extends EntityMapper<StudentQuizResponseDTO, StudentQuizResponse> {

    @Mapping(target = "studentQuizId", source = "studentQuiz.id")
    @Mapping(target = "quizQuestionId", source = "quizQuestion.id")
    StudentQuizResponseDTO toDto(StudentQuizResponse studentQuizResponse);

    @Mapping(target = "studentQuiz", ignore = true)
    @Mapping(target = "quizQuestion", ignore = true)
    StudentQuizResponse toEntity(StudentQuizResponseDTO studentQuizResponseDTO);
}