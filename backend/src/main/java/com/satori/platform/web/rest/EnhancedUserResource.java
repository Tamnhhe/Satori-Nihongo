package com.satori.platform.web.rest;

import com.satori.platform.domain.Authority;
import com.satori.platform.domain.User;
import com.satori.platform.repository.AuthorityRepository;
import com.satori.platform.repository.UserRepository;
import com.satori.platform.repository.UserProfileRepository;
import com.satori.platform.security.AuthoritiesConstants;
import com.satori.platform.service.UserService;
import com.satori.platform.service.dto.AdminUserDTO;
import com.satori.platform.service.dto.UserProfileDTO;
import com.satori.platform.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Enhanced REST controller for managing users with advanced features.
 */
@RestController
@RequestMapping("/api/admin/users")
public class EnhancedUserResource {

    private static final Logger LOG = LoggerFactory.getLogger(EnhancedUserResource.class);

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserService userService;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final AuthorityRepository authorityRepository;

    public EnhancedUserResource(UserService userService, UserRepository userRepository,
            UserProfileRepository userProfileRepository, AuthorityRepository authorityRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.authorityRepository = authorityRepository;
    }

    /**
     * {@code GET /admin/users/search} : Search users with advanced filtering
     */
    @GetMapping("/search")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    @Transactional(readOnly = true)
    public ResponseEntity<List<AdminUserDTO>> searchUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status,
            @org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to search Users with filters - search: {}, role: {}, status: {}", search, role, status);

        // Get users without authorities first to establish pagination
        Page<User> usersPage = userRepository.findAll(pageable);
        
        // Now get all users with authorities for each page user
        List<AdminUserDTO> userDTOs = new ArrayList<>();
        for (User user : usersPage.getContent()) {
            try {
                // Fetch user with authorities within transaction
                Optional<User> userWithAuthorities = userRepository.findOneWithAuthoritiesByLogin(user.getLogin());
                if (userWithAuthorities.isPresent()) {
                    AdminUserDTO dto = new AdminUserDTO(userWithAuthorities.get());
                    if (matchesSearchDTO(dto, search) && 
                        matchesRoleDTO(dto, role) && 
                        matchesStatusDTO(dto, status)) {
                        userDTOs.add(dto);
                    }
                }
            } catch (Exception e) {
                LOG.warn("Failed to load authorities for user {}: {}", user.getLogin(), e.getMessage());
                // Create DTO without authorities as fallback
                AdminUserDTO dto = createDTOWithoutAuthorities(user);
                if (matchesSearchDTO(dto, search) && 
                    matchesRoleDTO(dto, role) && 
                    matchesStatusDTO(dto, status)) {
                    userDTOs.add(dto);
                }
            }
        }

        Page<AdminUserDTO> page = new PageImpl<>(userDTOs, pageable, usersPage.getTotalElements());
        HttpHeaders headers = PaginationUtil
                .generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);

        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * {@code GET /admin/users/{login}/profile} : Get user with extended profile
     * information
     */
    @GetMapping("/{login}/profile")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<AdminUserDTO> getUserWithProfile(@PathVariable String login) {
        LOG.debug("REST request to get User with profile: {}", login);

        Optional<User> user = userService.getUserWithAuthoritiesByLogin(login);
        if (user.isPresent()) {
            AdminUserDTO userDTO = new AdminUserDTO(user.get());
            // Add extended profile information here if needed
            return ResponseEntity.ok(userDTO);
        }

        return ResponseEntity.notFound().build();
    }

    /**
     * {@code POST /admin/users/bulk} : Perform bulk operations on users
     */
    @PostMapping("/bulk")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Map<String, Object>> performBulkAction(@Valid @RequestBody BulkActionRequest request) {
        LOG.debug("REST request to perform bulk action: {} on users: {}", request.getAction(), request.getUserIds());

        Map<String, Object> result = new HashMap<>();
        int successCount = 0;
        List<String> errors = new ArrayList<>();

        for (String userId : request.getUserIds()) {
            try {
                Optional<User> userOpt = userRepository.findById(Long.parseLong(userId));
                if (userOpt.isPresent()) {
                    User user = userOpt.get();

                    switch (request.getAction()) {
                        case "activate":
                            user.setActivated(true);
                            userRepository.save(user);
                            successCount++;
                            break;
                        case "deactivate":
                            user.setActivated(false);
                            userRepository.save(user);
                            successCount++;
                            break;
                        case "changeRole":
                            if (request.getData() != null && request.getData().containsKey("role")) {
                                String newRole = (String) request.getData().get("role");
                                // Update user authorities based on role
                                updateUserRole(user, newRole);
                                userRepository.save(user);
                                successCount++;
                            }
                            break;
                        default:
                            errors.add("Unknown action: " + request.getAction());
                    }
                } else {
                    errors.add("User not found: " + userId);
                }
            } catch (Exception e) {
                errors.add("Error processing user " + userId + ": " + e.getMessage());
            }
        }

        result.put("success", successCount);
        result.put("errors", errors);
        result.put("total", request.getUserIds().size());

        return ResponseEntity.ok(result);
    }

    /**
     * {@code GET /admin/users/export} : Export users to CSV/Excel
     */
    @GetMapping("/export")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<byte[]> exportUsers(
            @RequestParam(defaultValue = "csv") String format,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status) {
        LOG.debug("REST request to export Users in format: {}", format);

        // Use UserService to get all managed users which properly loads authorities
        Page<AdminUserDTO> allUserDTOs = userService.getAllManagedUsers(Pageable.unpaged());
        List<User> users = allUserDTOs.getContent().stream()
                .map(dto -> userService.getUserWithAuthoritiesByLogin(dto.getLogin()).orElse(null))
                .filter(Objects::nonNull)
                .filter(user -> matchesSearch(user, search))
                .filter(user -> matchesRole(user, role))
                .filter(user -> matchesStatus(user, status))
                .collect(Collectors.toList());

        byte[] exportData;
        String contentType;
        String filename;

        if ("excel".equals(format)) {
            exportData = exportToExcel(users);
            contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            filename = "users_export.xlsx";
        } else {
            exportData = exportToCsv(users);
            contentType = "text/csv";
            filename = "users_export.csv";
        }

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=" + filename);
        headers.add("Content-Type", contentType);

        return new ResponseEntity<>(exportData, headers, HttpStatus.OK);
    }

    /**
     * {@code POST /admin/users/import} : Import users from CSV
     */
    @PostMapping("/import")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Map<String, Object>> importUsers(@RequestParam("file") MultipartFile file) {
        LOG.debug("REST request to import Users from file: {}", file.getOriginalFilename());

        Map<String, Object> result = new HashMap<>();
        int importedCount = 0;
        List<String> errors = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            boolean isFirstLine = true;

            while ((line = reader.readLine()) != null) {
                if (isFirstLine) {
                    isFirstLine = false;
                    continue; // Skip header
                }

                try {
                    String[] fields = line.split(",");
                    if (fields.length >= 4) {
                        String username = fields[0].trim();
                        String email = fields[1].trim();
                        String fullName = fields[2].trim();
                        String role = fields[3].trim();

                        // Create user if not exists
                        if (!userRepository.findOneByLogin(username).isPresent() &&
                                !userRepository.findOneByEmailIgnoreCase(email).isPresent()) {

                            AdminUserDTO userDTO = new AdminUserDTO();
                            userDTO.setLogin(username);
                            userDTO.setEmail(email);
                            userDTO.setFirstName(fullName.split(" ")[0]);
                            if (fullName.split(" ").length > 1) {
                                userDTO.setLastName(fullName.substring(fullName.indexOf(" ") + 1));
                            }
                            userDTO.setActivated(true);
                            userDTO.setAuthorities(Set.of(role));

                            userService.createUser(userDTO);
                            importedCount++;
                        } else {
                            errors.add("User already exists: " + username);
                        }
                    } else {
                        errors.add("Invalid line format: " + line);
                    }
                } catch (Exception e) {
                    errors.add("Error processing line: " + line + " - " + e.getMessage());
                }
            }
        } catch (IOException e) {
            errors.add("Error reading file: " + e.getMessage());
        }

        result.put("success", importedCount > 0);
        result.put("imported", importedCount);
        result.put("errors", errors);

        return ResponseEntity.ok(result);
    }

    /**
     * {@code GET /admin/users/statistics} : Get user statistics
     */
    @GetMapping("/statistics")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Map<String, Object>> getUserStatistics() {
        LOG.debug("REST request to get User statistics");

        Map<String, Object> stats = new HashMap<>();

        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByActivatedTrue();
        long inactiveUsers = totalUsers - activeUsers;

        // Role distribution
        Map<String, Long> roleDistribution = new HashMap<>();
        roleDistribution.put("ADMIN", userRepository.countByAuthoritiesName(AuthoritiesConstants.ADMIN));
        roleDistribution.put("GIANG_VIEN", userRepository.countByAuthoritiesName(AuthoritiesConstants.TEACHER));
        roleDistribution.put("HOC_VIEN", userRepository.countByAuthoritiesName(AuthoritiesConstants.USER));

        stats.put("totalUsers", totalUsers);
        stats.put("activeUsers", activeUsers);
        stats.put("inactiveUsers", inactiveUsers);
        stats.put("roleDistribution", roleDistribution);

        return ResponseEntity.ok(stats);
    }

    // Helper method to create AdminUserDTO without authorities as fallback
    private AdminUserDTO createDTOWithoutAuthorities(User user) {
        AdminUserDTO dto = new AdminUserDTO();
        dto.setId(user.getId());
        dto.setLogin(user.getLogin());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setActivated(user.isActivated());
        dto.setImageUrl(user.getImageUrl());
        dto.setLangKey(user.getLangKey());
        dto.setCreatedBy(user.getCreatedBy());
        dto.setCreatedDate(user.getCreatedDate());
        dto.setLastModifiedBy(user.getLastModifiedBy());
        dto.setLastModifiedDate(user.getLastModifiedDate());
        dto.setAuthorities(new HashSet<>()); // Empty authorities as fallback
        return dto;
    }

    // Helper methods for DTO filtering
    private boolean matchesSearchDTO(AdminUserDTO userDTO, String search) {
        if (search == null || search.trim().isEmpty()) {
            return true;
        }
        String searchLower = search.toLowerCase();
        return userDTO.getLogin().toLowerCase().contains(searchLower) ||
                userDTO.getEmail().toLowerCase().contains(searchLower) ||
                (userDTO.getFirstName() != null && userDTO.getFirstName().toLowerCase().contains(searchLower)) ||
                (userDTO.getLastName() != null && userDTO.getLastName().toLowerCase().contains(searchLower));
    }

    private boolean matchesRoleDTO(AdminUserDTO userDTO, String role) {
        if (role == null || role.trim().isEmpty()) {
            return true;
        }
        return userDTO.getAuthorities() != null && userDTO.getAuthorities().contains(role);
    }

    private boolean matchesStatusDTO(AdminUserDTO userDTO, String status) {
        if (status == null || status.trim().isEmpty()) {
            return true;
        }
        return ("active".equals(status) && userDTO.isActivated()) ||
                ("inactive".equals(status) && !userDTO.isActivated());
    }

    // Helper methods for User filtering
    private boolean matchesSearch(User user, String search) {
        if (search == null || search.trim().isEmpty()) {
            return true;
        }
        String searchLower = search.toLowerCase();
        return user.getLogin().toLowerCase().contains(searchLower) ||
                user.getEmail().toLowerCase().contains(searchLower) ||
                (user.getFirstName() != null && user.getFirstName().toLowerCase().contains(searchLower)) ||
                (user.getLastName() != null && user.getLastName().toLowerCase().contains(searchLower));
    }

    private boolean matchesRole(User user, String role) {
        if (role == null || role.trim().isEmpty()) {
            return true;
        }
        return user.getAuthorities().stream()
                .anyMatch(authority -> authority.getName().equals(role));
    }

    private boolean matchesStatus(User user, String status) {
        if (status == null || status.trim().isEmpty()) {
            return true;
        }
        return ("active".equals(status) && user.isActivated()) ||
                ("inactive".equals(status) && !user.isActivated());
    }

    private void updateUserRole(User user, String newRole) {
        // Clear existing authorities
        user.getAuthorities().clear();

        // Add new authority based on role
        Optional<Authority> authority;
        switch (newRole) {
            case "ADMIN":
                authority = authorityRepository.findById(AuthoritiesConstants.ADMIN);
                break;
            case "GIANG_VIEN":
                authority = authorityRepository.findById(AuthoritiesConstants.TEACHER);
                break;
            case "HOC_VIEN":
                authority = authorityRepository.findById(AuthoritiesConstants.USER);
                break;
            default:
                authority = authorityRepository.findById(AuthoritiesConstants.USER);
                break;
        }

        if (authority.isPresent()) {
            user.getAuthorities().add(authority.get());
        }
    }

    private byte[] exportToCsv(List<User> users) {
        StringBuilder csv = new StringBuilder();
        csv.append("Username,Email,First Name,Last Name,Activated,Authorities,Created Date\n");

        for (User user : users) {
            csv.append(user.getLogin()).append(",")
                    .append(user.getEmail()).append(",")
                    .append(user.getFirstName() != null ? user.getFirstName() : "").append(",")
                    .append(user.getLastName() != null ? user.getLastName() : "").append(",")
                    .append(user.isActivated()).append(",")
                    .append(user.getAuthorities().stream()
                            .map(auth -> auth.getName())
                            .collect(Collectors.joining(";")))
                    .append(",")
                    .append(user.getCreatedDate() != null ? user.getCreatedDate().toString() : "").append("\n");
        }

        return csv.toString().getBytes();
    }

    private byte[] exportToExcel(List<User> users) {
        // For now, return CSV format. In a real implementation, you would use Apache
        // POI
        // to create actual Excel files
        return exportToCsv(users);
    }

    // Inner class for bulk action requests
    public static class BulkActionRequest {
        private String action;
        private List<String> userIds;
        private Map<String, Object> data;

        public String getAction() {
            return action;
        }

        public void setAction(String action) {
            this.action = action;
        }

        public List<String> getUserIds() {
            return userIds;
        }

        public void setUserIds(List<String> userIds) {
            this.userIds = userIds;
        }

        public Map<String, Object> getData() {
            return data;
        }

        public void setData(Map<String, Object> data) {
            this.data = data;
        }
    }
}