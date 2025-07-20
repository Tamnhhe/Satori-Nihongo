package com.satori.platform.service.mapper;

import com.satori.platform.domain.SocialAccount;
import com.satori.platform.domain.UserProfile;
import com.satori.platform.service.dto.SocialAccountDTO;
import com.satori.platform.service.dto.UserProfileDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link SocialAccount} and its DTO {@link SocialAccountDTO}.
 */
@Mapper(componentModel = "spring")
public interface SocialAccountMapper extends EntityMapper<SocialAccountDTO, SocialAccount> {
    @Mapping(target = "userProfile", source = "userProfile", qualifiedByName = "userProfileId")
    SocialAccountDTO toDto(SocialAccount s);

    @Named("userProfileId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserProfileDTO toDtoUserProfileId(UserProfile userProfile);
}
