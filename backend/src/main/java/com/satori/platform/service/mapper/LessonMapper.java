package com.satori.platform.service.mapper;

import com.satori.platform.domain.Course;
import com.satori.platform.domain.Lesson;
import com.satori.platform.domain.Quiz;
import com.satori.platform.service.dto.CourseDTO;
import com.satori.platform.service.dto.LessonDTO;
import com.satori.platform.service.dto.QuizDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Lesson} and its DTO {@link LessonDTO}.
 */
@Mapper(componentModel = "spring")
public interface LessonMapper extends EntityMapper<LessonDTO, Lesson> {
    @Mapping(target = "course", source = "course", qualifiedByName = "courseId")
    @Mapping(target = "quizzes", source = "quizzes", qualifiedByName = "quizIdSet")
    LessonDTO toDto(Lesson s);

    @Mapping(target = "quizzes", ignore = true)
    @Mapping(target = "removeQuiz", ignore = true)
    Lesson toEntity(LessonDTO lessonDTO);

    @Named("courseId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    CourseDTO toDtoCourseId(Course course);

    @Named("quizId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    QuizDTO toDtoQuizId(Quiz quiz);

    @Named("quizIdSet")
    default Set<QuizDTO> toDtoQuizIdSet(Set<Quiz> quiz) {
        return quiz.stream().map(this::toDtoQuizId).collect(Collectors.toSet());
    }
}
