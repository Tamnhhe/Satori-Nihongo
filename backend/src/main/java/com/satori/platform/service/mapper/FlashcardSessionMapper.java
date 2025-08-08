package com.satori.platform.service.mapper;

import com.satori.platform.domain.FlashcardSession;
import com.satori.platform.service.dto.FlashcardSessionDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link FlashcardSession} and its DTO
 * {@link FlashcardSessionDTO}.
 */
@Mapper(componentModel = "spring", uses = { StudentProfileMapper.class, LessonMapper.class })
public interface FlashcardSessionMapper extends EntityMapper<FlashcardSessionDTO, FlashcardSession> {
    @Mapping(target = "student", source = "student")
    @Mapping(target = "lesson", source = "lesson")
    FlashcardSessionDTO toDto(FlashcardSession s);

    @Named("flashcardSessionId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    FlashcardSessionDTO toDtoFlashcardSessionId(FlashcardSession flashcardSession);
}