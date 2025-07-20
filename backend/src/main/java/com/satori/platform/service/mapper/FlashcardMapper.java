package com.satori.platform.service.mapper;

import com.satori.platform.domain.Flashcard;
import com.satori.platform.domain.Lesson;
import com.satori.platform.service.dto.FlashcardDTO;
import com.satori.platform.service.dto.LessonDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Flashcard} and its DTO {@link FlashcardDTO}.
 */
@Mapper(componentModel = "spring")
public interface FlashcardMapper extends EntityMapper<FlashcardDTO, Flashcard> {
    @Mapping(target = "lesson", source = "lesson", qualifiedByName = "lessonId")
    FlashcardDTO toDto(Flashcard s);

    @Named("lessonId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    LessonDTO toDtoLessonId(Lesson lesson);
}
