package com.satori.platform.service.mapper;

import com.satori.platform.domain.Quiz;
import com.satori.platform.domain.StudentQuiz;
import com.satori.platform.domain.UserProfile;
import com.satori.platform.service.dto.QuizDTO;
import com.satori.platform.service.dto.StudentQuizDTO;
import com.satori.platform.service.dto.UserProfileDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link StudentQuiz} and its DTO {@link StudentQuizDTO}.
 */
@Mapper(componentModel = "spring")
public interface StudentQuizMapper extends EntityMapper<StudentQuizDTO, StudentQuiz> {
    @Mapping(target = "quiz", source = "quiz", qualifiedByName = "quizId")
    @Mapping(target = "student", source = "student", qualifiedByName = "userProfileId")
    StudentQuizDTO toDto(StudentQuiz s);

    @Named("quizId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    QuizDTO toDtoQuizId(Quiz quiz);

    @Named("userProfileId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserProfileDTO toDtoUserProfileId(UserProfile userProfile);
}
