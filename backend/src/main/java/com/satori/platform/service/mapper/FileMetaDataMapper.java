package com.satori.platform.service.mapper;

import com.satori.platform.domain.FileMetaData;
import com.satori.platform.service.dto.FileMetaDataDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link FileMetaData} and its DTO
 * {@link FileMetaDataDTO}.
 */
@Mapper(componentModel = "spring")
public interface FileMetaDataMapper extends EntityMapper<FileMetaDataDTO, FileMetaData> {

    @Mapping(target = "lessonId", source = "lesson.id")
    @Mapping(target = "lessonTitle", source = "lesson.title")
    @Mapping(target = "uploadedById", source = "uploadedBy.id")
    @Mapping(target = "uploadedByName", source = "uploadedBy.fullName")
    FileMetaDataDTO toDto(FileMetaData fileMetaData);

    @Mapping(target = "lesson", source = "lessonId", qualifiedByName = "lessonId")
    @Mapping(target = "uploadedBy", source = "uploadedById", qualifiedByName = "userProfileId")
    FileMetaData toEntity(FileMetaDataDTO fileMetaDataDTO);

    @Named("lessonId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    com.satori.platform.domain.Lesson toDtoLessonId(Long id);

    @Named("userProfileId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    com.satori.platform.domain.UserProfile toDtoUserProfileId(Long id);
}