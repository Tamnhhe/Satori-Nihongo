package com.satori.platform.service.mapper;

import java.util.List;
import org.mapstruct.BeanMapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;

/**
 * Contract for a generic dto to entity mapper.
 *
 * @param <D> - DTO type parameter.
 * @param <E> - Entity type parameter.
 */

public interface EntityMapper<D, E> {
    E toEntity(D dto);

    D toDto(E entity);

    List<E> toEntity(List<D> dtoList);

    List<D> toDto(List<E> entityList);

    @Named("partialUpdate")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void partialUpdate(@MappingTarget E entity, D dto);

    // Common conversion methods for all mappers
    default java.time.LocalDateTime map(java.time.Instant instant) {
        return instant != null ? java.time.LocalDateTime.ofInstant(instant, java.time.ZoneOffset.UTC) : null;
    }

    default java.time.Instant map(java.time.LocalDateTime localDateTime) {
        return localDateTime != null ? localDateTime.toInstant(java.time.ZoneOffset.UTC) : null;
    }

    default com.satori.platform.domain.UserProfile mapStringToUserProfile(String userProfileId) {
        // For now, return null to fix compilation
        // This would need proper implementation with service injection
        return null;
    }

    default String mapUserProfileToString(com.satori.platform.domain.UserProfile userProfile) {
        return userProfile != null ? userProfile.getId().toString() : null;
    }
}
