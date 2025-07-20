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
 * Mapper for the entity {@link Quiz} and its DTO {@link QuizDTO}.
 */
@Mapper(componentModel = "spring")
public interface QuizMapper extends EntityMapper<QuizDTO, Quiz> {
    @Mapping(target = "courses", source = "courses", qualifiedByName = "courseIdSet")
    @Mapping(target = "lessons", source = "lessons", qualifiedByName = "lessonIdSet")
    QuizDTO toDto(Quiz s);

    @Mapping(target = "removeCourse", ignore = true)
    @Mapping(target = "removeLesson", ignore = true)
    Quiz toEntity(QuizDTO quizDTO);

    @Named("courseId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    CourseDTO toDtoCourseId(Course course);

    @Named("courseIdSet")
    default Set<CourseDTO> toDtoCourseIdSet(Set<Course> course) {
        return course.stream().map(this::toDtoCourseId).collect(Collectors.toSet());
    }

    @Named("lessonId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    LessonDTO toDtoLessonId(Lesson lesson);

    @Named("lessonIdSet")
    default Set<LessonDTO> toDtoLessonIdSet(Set<Lesson> lesson) {
        return lesson.stream().map(this::toDtoLessonId).collect(Collectors.toSet());
    }
}
