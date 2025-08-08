package com.satori.platform.service;

import com.satori.platform.config.Constants;
import com.satori.platform.domain.Authority;
import com.satori.platform.domain.User;
import com.satori.platform.domain.enumeration.AuthenticationEventType;
import com.satori.platform.repository.AuthorityRepository;
import com.satori.platform.repository.UserRepository;
import com.satori.platform.security.AuthoritiesConstants;
import com.satori.platform.security.SecurityUtils;
import com.satori.platform.service.dto.AdminUserDTO;
import com.satori.platform.service.dto.UserDTO;
import com.satori.platform.service.dto.UserRegistrationDTO;
import com.satori.platform.service.dto.ProfileCompletionDTO;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.CacheManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.security.RandomUtil;

/**
 * Service class for managing users.
 */
@Service
@Transactional
public class UserService {

    private static final Logger LOG = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthorityRepository authorityRepository;

    private final CacheManager cacheManager;

    private final AuthenticationAuditService auditService;

    private final MailService mailService;

    public UserService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        AuthorityRepository authorityRepository,
        CacheManager cacheManager,
        AuthenticationAuditService auditService,
        MailService mailService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authorityRepository = authorityRepository;
        this.cacheManager = cacheManager;
        this.auditService = auditService;
        this.mailService = mailService;
    }

    public Optional<User> activateRegistration(String key) {
        LOG.debug("Activating user for activation key {}", key);
        return userRepository
            .findOneByActivationKey(key)
            .map(user -> {
                // activate given user for the registration key.
                user.setActivated(true);
                user.setActivationKey(null);
                this.clearUserCaches(user);
                LOG.debug("Activated user: {}", user);
                return user;
            });
    }

    public Optional<User> completePasswordReset(String newPassword, String key) {
        LOG.debug("Reset user password for reset key {}", key);
        return userRepository
            .findOneByResetKey(key)
            .filter(user -> user.getResetDate().isAfter(Instant.now().minus(1, ChronoUnit.DAYS)))
            .map(user -> {
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setResetKey(null);
                user.setResetDate(null);
                this.clearUserCaches(user);
                return user;
            });
    }

    public Optional<User> requestPasswordReset(String mail) {
        return userRepository
            .findOneByEmailIgnoreCase(mail)
            .filter(User::isActivated)
            .map(user -> {
                user.setResetKey(RandomUtil.generateResetKey());
                user.setResetDate(Instant.now());
                this.clearUserCaches(user);
                return user;
            });
    }

    public User registerUser(AdminUserDTO userDTO, String password) {
        userRepository
            .findOneByLogin(userDTO.getLogin().toLowerCase())
            .ifPresent(existingUser -> {
                boolean removed = removeNonActivatedUser(existingUser);
                if (!removed) {
                    throw new UsernameAlreadyUsedException();
                }
            });
        userRepository
            .findOneByEmailIgnoreCase(userDTO.getEmail())
            .ifPresent(existingUser -> {
                boolean removed = removeNonActivatedUser(existingUser);
                if (!removed) {
                    throw new EmailAlreadyUsedException();
                }
            });
        User newUser = new User();
        String encryptedPassword = passwordEncoder.encode(password);
        newUser.setLogin(userDTO.getLogin().toLowerCase());
        // new user gets initially a generated password
        newUser.setPassword(encryptedPassword);
        newUser.setFirstName(userDTO.getFirstName());
        newUser.setLastName(userDTO.getLastName());
        if (userDTO.getEmail() != null) {
            newUser.setEmail(userDTO.getEmail().toLowerCase());
        }
        newUser.setImageUrl(userDTO.getImageUrl());
        newUser.setLangKey(userDTO.getLangKey());
        // new user is not active
        newUser.setActivated(false);
        // new user gets registration key
        newUser.setActivationKey(RandomUtil.generateActivationKey());
        Set<Authority> authorities = new HashSet<>();
        authorityRepository.findById(AuthoritiesConstants.USER).ifPresent(authorities::add);
        newUser.setAuthorities(authorities);
        userRepository.save(newUser);
        this.clearUserCaches(newUser);
        LOG.debug("Created Information for User: {}", newUser);
        return newUser;
    }

/**
     * Enhanced user registration with role-based profile creation.
     */
    public User registerUserWithProfile(UserRegistrationDTO registrationDTO) {
        // Check for existing users
        userRepository
                .findOneByLogin(registrationDTO.getLogin().toLowerCase())
                .ifPresent(existingUser -> {
                    boolean removed = removeNonActivatedUser(existingUser);
                    if (!removed) {
                        throw new UsernameAlreadyUsedException();
                    }
                });
        userRepository
                .findOneByEmailIgnoreCase(registrationDTO.getEmail())
                .ifPresent(existingUser -> {
                    boolean removed = removeNonActivatedUser(existingUser);
                    if (!removed) {
                        throw new EmailAlreadyUsedException();
                    }
                });

        // Create new user
        User newUser = new User();
        String encryptedPassword = passwordEncoder.encode(registrationDTO.getPassword());
        newUser.setLogin(registrationDTO.getLogin().toLowerCase());
        newUser.setPassword(encryptedPassword);
        newUser.setFirstName(registrationDTO.getFirstName());
        newUser.setLastName(registrationDTO.getLastName());
        newUser.setEmail(registrationDTO.getEmail().toLowerCase());
        newUser.setLangKey(registrationDTO.getLangKey());
        newUser.setTimezone(registrationDTO.getTimezone());
        newUser.setActivated(false);
        newUser.setActivationKey(RandomUtil.generateActivationKey());
        newUser.setProfileCompleted(false);

        // Set authorities
        Set<Authority> authorities = new HashSet<>();
        if (registrationDTO.getAuthorities() != null && !registrationDTO.getAuthorities().isEmpty()) {
            registrationDTO.getAuthorities()
                    .forEach(authority -> authorityRepository.findById(authority).ifPresent(authorities::add));
        } else {
            authorityRepository.findById(AuthoritiesConstants.USER).ifPresent(authorities::add);
        }
        newUser.setAuthorities(authorities);

        userRepository.save(newUser);

        // Profile creation will be handled separately

        this.clearUserCaches(newUser);
        LOG.debug("Created user with profile: {}", newUser);

        // Log registration event
        auditService.logUserRegistration(newUser.getLogin(), null, null);

        return newUser;
    }

    /**
     * Complete user profile after registration.
     */
    public void completeUserProfile(String login, ProfileCompletionDTO profileDTO) {
        userRepository.findOneByLogin(login)
                .ifPresent(user -> {
                    // Update user fields
                    if (profileDTO.getTimezone() != null) {
                        user.setTimezone(profileDTO.getTimezone());
                    }
                    if (profileDTO.getImageUrl() != null) {
                        user.setImageUrl(profileDTO.getImageUrl());
                    }
                    user.setProfileCompleted(true);
                    userRepository.save(user);

                    // Profile update will be handled separately

                    this.clearUserCaches(user);
                    LOG.debug("Completed profile for user: {}", user.getLogin());

                    // Log profile completion
                    auditService.logProfileCompletion(user.getLogin(), null, null);
                });
    }

    /**
     * Enhanced password reset with email integration and audit logging.
     */
    public Optional<User> requestPasswordResetEnhanced(String mail, String ipAddress, String userAgent) {
        Optional<User> userOpt = userRepository
                .findOneByEmailIgnoreCase(mail)
                .filter(User::isActivated)
                .map(user -> {
                    user.setResetKey(RandomUtil.generateResetKey());
                    user.setResetDate(Instant.now());
                    this.clearUserCaches(user);

                    // Log password reset request
                    auditService.logPasswordResetRequest(user.getLogin(), ipAddress, userAgent);

                    return user;
                });

        // Send password reset email
        userOpt.ifPresent(user -> {
            try {
                mailService.sendPasswordResetMail(user);
            } catch (Exception e) {
                LOG.error("Failed to send password reset email to user: {}", user.getLogin(), e);
            }
        });

        return userOpt;
    }

    /**
     * Complete password reset with audit logging.
     */
    public Optional<User> completePasswordResetEnhanced(String newPassword, String key, String ipAddress,
            String userAgent) {
        LOG.debug("Reset user password for reset key {}", key);
        return userRepository
                .findOneByResetKey(key)
                .filter(user -> user.getResetDate().isAfter(Instant.now().minus(1, ChronoUnit.DAYS)))
                .map(user -> {
                    user.setPassword(passwordEncoder.encode(newPassword));
                    user.setResetKey(null);
                    user.setResetDate(null);
                    user.setFailedLoginAttempts(0); // Reset failed attempts
                    user.setAccountLockedUntil(null); // Unlock account if locked
                    this.clearUserCaches(user);

                    // Log successful password reset
                    auditService.logPasswordResetSuccess(user.getLogin(), ipAddress, userAgent);

                    return user;
                });
    }

    /**
     * Update last login date and reset failed attempts.
     */
    public void updateLastLogin(String login) {
        userRepository.findOneByLogin(login)
                .ifPresent(user -> {
                    user.setLastLoginDate(Instant.now());
                    user.setFailedLoginAttempts(0);
                    user.setAccountLockedUntil(null);
                    userRepository.save(user);
                    this.clearUserCaches(user);
                });
    }

    /**
     * Handle failed login attempt.
     */
    public void handleFailedLogin(String login, String ipAddress, String userAgent, String reason) {
        userRepository.findOneByLogin(login)
                .ifPresent(user -> {
                    int attempts = user.getFailedLoginAttempts() != null ? user.getFailedLoginAttempts() : 0;
                    user.setFailedLoginAttempts(attempts + 1);

                    // Lock account if too many failed attempts
                    if (auditService.shouldLockAccount(login)) {
                        user.setAccountLockedUntil(Instant.now().plus(30, ChronoUnit.MINUTES));
                        auditService.logAccountLocked(login, ipAddress, userAgent, "Too many failed login attempts");
                    }

                    userRepository.save(user);
                    this.clearUserCaches(user);
                });

        // Log failed login attempt
        auditService.logFailedLogin(login, ipAddress, userAgent, reason);
    }

    /**
     * Check if user account is locked.
     */
    @Transactional(readOnly = true)
    public boolean isAccountLocked(String login) {
        return userRepository.findOneByLogin(login)
                .map(user -> user.getAccountLockedUntil() != null &&
                        user.getAccountLockedUntil().isAfter(Instant.now()))
                .orElse(false);
    }

    /**
     * Unlock expired account locks - runs every 15 minutes.
     */
    @Scheduled(fixedRate = 900000) // 15 minutes
    public void unlockExpiredAccounts() {
        List<User> usersWithExpiredLocks = userRepository.findUsersWithExpiredLocks(Instant.now());
        usersWithExpiredLocks.forEach(user -> {
            user.setAccountLockedUntil(null);
            user.setFailedLoginAttempts(0);
            userRepository.save(user);
            this.clearUserCaches(user);
            LOG.debug("Unlocked expired account: {}", user.getLogin());
        });
    }

    /**
     * Get users with incomplete profiles.
     */
    @Transactional(readOnly = true)
    public List<User> getUsersWithIncompleteProfiles() {
        return userRepository.findUsersWithIncompleteProfiles();
    }

    private boolean removeNonActivatedUser(User existingUser) {
        if (existingUser.isActivated()) {
            return false;
        }
        userRepository.delete(existingUser);
        userRepository.flush();
        this.clearUserCaches(existingUser);
        return true;
    }

    public User createUser(AdminUserDTO userDTO) {
        User user = new User();
        user.setLogin(userDTO.getLogin().toLowerCase());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        if (userDTO.getEmail() != null) {
            user.setEmail(userDTO.getEmail().toLowerCase());
        }
        user.setImageUrl(userDTO.getImageUrl());
        if (userDTO.getLangKey() == null) {
            user.setLangKey(Constants.DEFAULT_LANGUAGE); // default language
        } else {
            user.setLangKey(userDTO.getLangKey());
        }
        String encryptedPassword = passwordEncoder.encode(RandomUtil.generatePassword());
        user.setPassword(encryptedPassword);
        user.setResetKey(RandomUtil.generateResetKey());
        user.setResetDate(Instant.now());
        user.setActivated(true);
        if (userDTO.getAuthorities() != null) {
            Set<Authority> authorities = userDTO
                .getAuthorities()
                .stream()
                .map(authorityRepository::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toSet());
            user.setAuthorities(authorities);
        }
        userRepository.save(user);
        this.clearUserCaches(user);
        LOG.debug("Created Information for User: {}", user);
        return user;
    }

    /**
     * Update all information for a specific user, and return the modified user.
     *
     * @param userDTO user to update.
     * @return updated user.
     */
    public Optional<AdminUserDTO> updateUser(AdminUserDTO userDTO) {
        return Optional.of(userRepository.findById(userDTO.getId()))
            .filter(Optional::isPresent)
            .map(Optional::get)
            .map(user -> {
                this.clearUserCaches(user);
                user.setLogin(userDTO.getLogin().toLowerCase());
                user.setFirstName(userDTO.getFirstName());
                user.setLastName(userDTO.getLastName());
                if (userDTO.getEmail() != null) {
                    user.setEmail(userDTO.getEmail().toLowerCase());
                }
                user.setImageUrl(userDTO.getImageUrl());
                user.setActivated(userDTO.isActivated());
                user.setLangKey(userDTO.getLangKey());
                Set<Authority> managedAuthorities = user.getAuthorities();
                managedAuthorities.clear();
                userDTO
                    .getAuthorities()
                    .stream()
                    .map(authorityRepository::findById)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .forEach(managedAuthorities::add);
                userRepository.save(user);
                this.clearUserCaches(user);
                LOG.debug("Changed Information for User: {}", user);
                return user;
            })
            .map(AdminUserDTO::new);
    }

    public void deleteUser(String login) {
        userRepository
            .findOneByLogin(login)
            .ifPresent(user -> {
                userRepository.delete(user);
                this.clearUserCaches(user);
                LOG.debug("Deleted User: {}", user);
            });
    }

    /**
     * Update basic information (first name, last name, email, language) for the current user.
     *
     * @param firstName first name of user.
     * @param lastName  last name of user.
     * @param email     email id of user.
     * @param langKey   language key.
     * @param imageUrl  image URL of user.
     */
    public void updateUser(String firstName, String lastName, String email, String langKey, String imageUrl) {
        SecurityUtils.getCurrentUserLogin()
            .flatMap(userRepository::findOneByLogin)
            .ifPresent(user -> {
                user.setFirstName(firstName);
                user.setLastName(lastName);
                if (email != null) {
                    user.setEmail(email.toLowerCase());
                }
                user.setLangKey(langKey);
                user.setImageUrl(imageUrl);
                userRepository.save(user);
                this.clearUserCaches(user);
                LOG.debug("Changed Information for User: {}", user);
            });
    }

    @Transactional
    public void changePassword(String currentClearTextPassword, String newPassword) {
        SecurityUtils.getCurrentUserLogin()
            .flatMap(userRepository::findOneByLogin)
            .ifPresent(user -> {
                String currentEncryptedPassword = user.getPassword();
                if (!passwordEncoder.matches(currentClearTextPassword, currentEncryptedPassword)) {
                    throw new InvalidPasswordException();
                }
                String encryptedPassword = passwordEncoder.encode(newPassword);
                user.setPassword(encryptedPassword);
                this.clearUserCaches(user);
                LOG.debug("Changed password for User: {}", user);
            });
    }

    @Transactional(readOnly = true)
    public Page<AdminUserDTO> getAllManagedUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(AdminUserDTO::new);
    }

    @Transactional(readOnly = true)
    public Page<UserDTO> getAllPublicUsers(Pageable pageable) {
        return userRepository.findAllByIdNotNullAndActivatedIsTrue(pageable).map(UserDTO::new);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthoritiesByLogin(String login) {
        return userRepository.findOneWithAuthoritiesByLogin(login);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthorities() {
        return SecurityUtils.getCurrentUserLogin().flatMap(userRepository::findOneWithAuthoritiesByLogin);
    }

    /**
     * Not activated users should be automatically deleted after 3 days.
     * <p>
     * This is scheduled to get fired every day, at 01:00 (am).
     */
    @Scheduled(cron = "0 0 1 * * ?")
    public void removeNotActivatedUsers() {
        userRepository
            .findAllByActivatedIsFalseAndActivationKeyIsNotNullAndCreatedDateBefore(Instant.now().minus(3, ChronoUnit.DAYS))
            .forEach(user -> {
                LOG.debug("Deleting not activated user {}", user.getLogin());
                userRepository.delete(user);
                this.clearUserCaches(user);
            });
    }

    /**
     * Gets a list of all the authorities.
     * @return a list of all the authorities.
     */
    @Transactional(readOnly = true)
    public List<String> getAuthorities() {
        return authorityRepository.findAll().stream().map(Authority::getName).toList();
    }

    private void clearUserCaches(User user) {
        Objects.requireNonNull(cacheManager.getCache(UserRepository.USERS_BY_LOGIN_CACHE)).evictIfPresent(user.getLogin());
        if (user.getEmail() != null) {
            Objects.requireNonNull(cacheManager.getCache(UserRepository.USERS_BY_EMAIL_CACHE)).evictIfPresent(user.getEmail());
        }
    }
}
