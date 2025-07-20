package com.satori.platform.service.mapper;

import com.satori.platform.domain.Course;
import com.satori.platform.domain.Quiz;
import com.satori.platform.domain.UserProfile;
import com.satori.platform.service.dto.CourseDTO;
import com.satori.platform.service.dto.QuizDTO;
import com.satori.platform.service.dto.UserProfileDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Course} and its DTO {@link CourseDTO}.
 */
@Mapper(componentModel = "spring")
public interface CourseMapper extends EntityMapper<CourseDTO, Course> {
    @Mapping(target = "teacher", source = "teacher", qualifiedByName = "userProfileId")
    @Mapping(target = "quizzes", source = "quizzes", qualifiedByName = "quizIdSet")
    CourseDTO toDto(Course s);

    @Mapping(target = "quizzes", ignore = true)
    @Mapping(target = "removeQuiz", ignore = true)
    Course toEntity(CourseDTO courseDTO);

    @Named("userProfileId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserProfileDTO toDtoUserProfileId(UserProfile userProfile);

    @Named("quizId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    QuizDTO toDtoQuizId(Quiz quiz);

    @Named("quizIdSet")
    default Set<QuizDTO> toDtoQuizIdSet(Set<Quiz> quiz) {
        return quiz.stream().map(this::toDtoQuizId).collect(Collectors.toSet());
    }
}
