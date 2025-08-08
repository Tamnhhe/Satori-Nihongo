package com.satori.platform.service.mapper;

import com.satori.platform.domain.NotificationPreference;
import com.satori.platform.domain.UserProfile;
import com.satori.platform.service.dto.NotificationPreferenceDTO;
import com.satori.platform.service.dto.UserProfileDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link NotificationPreference} and its DTO
 * {@link NotificationPreferenceDTO}.
 */
@Mapper(componentModel = "spring")
public interface NotificationPreferenceMapper extends EntityMapper<NotificationPreferenceDTO, NotificationPreference> {

    @Mapping(target = "userProfile", source = "userProfile", qualifiedByName = "userProfileId")
    NotificationPreferenceDTO toDto(NotificationPreference s);

    @Named("userProfileId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "username", source = "username")
    @Mapping(target = "fullName", source = "fullName")
    UserProfileDTO toDtoUserProfileId(UserProfile userProfile);
}