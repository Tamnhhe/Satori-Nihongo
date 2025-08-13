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

    @Mapping(target = "uploadedBy", source = "uploadedBy.fullName")
    @Mapping(target = "uploadedDate", source = "uploadDate")
    @Mapping(target = "originalFileName", source = "originalName")
    @Mapping(target = "folder", source = "folderPath")
    FileMetaDataDTO toDto(FileMetaData fileMetaData);

    @Mapping(target = "uploadedBy", ignore = true)
    @Mapping(target = "lesson", ignore = true)
    @Mapping(target = "uploadDate", source = "uploadedDate")
    @Mapping(target = "originalName", source = "originalFileName")
    @Mapping(target = "folderPath", source = "folder")
    FileMetaData toEntity(FileMetaDataDTO fileMetaDataDTO);

    default FileMetaData fromId(Long id) {
        if (id == null) {
            return null;
        }
        FileMetaData fileMetaData = new FileMetaData();
        fileMetaData.setId(id);
        return fileMetaData;
    }
}