package com.satori.platform.service.mapper;

import com.satori.platform.domain.Course;
import com.satori.platform.domain.GiftCode;
import com.satori.platform.domain.UserProfile;
import com.satori.platform.service.dto.GiftCodeDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link GiftCode} and its DTO {@link GiftCodeDTO}.
 */
@Mapper(componentModel = "spring")
public interface GiftCodeMapper extends EntityMapper<GiftCodeDTO, GiftCode> {

    @Mapping(target = "courseId", source = "course.id")
    @Mapping(target = "courseTitle", source = "course.title")
    @Mapping(target = "createdById", source = "createdBy.id")
    @Mapping(target = "createdByLogin", source = "createdBy.email")
    GiftCodeDTO toDto(GiftCode giftCode);

    @Mapping(target = "course", source = "courseId", qualifiedByName = "courseId")
    @Mapping(target = "createdBy", source = "createdById", qualifiedByName = "userProfileId")
    GiftCode toEntity(GiftCodeDTO giftCodeDTO);

    @Named("courseId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    Course toCourse(Long id);

    @Named("userProfileId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserProfile toUserProfile(Long id);
}