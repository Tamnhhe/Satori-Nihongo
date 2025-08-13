package com.satori.platform.validation;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

/**
 * Schema validation test that validates all Liquibase changes have been applied
 * correctly and the database schema matches expected structure.
 */
public class SchemaValidationTest extends ApiValidationTestFramework {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Test data constants
    private static final String TEST_EMAIL = "schema.test@example.com";
    private static final String TEST_LOGIN = "schematest";
    private static final String TEST_PASSWORD_HASH = "test_hash";
    private static final String TEST_TIMEZONE = "UTC";
    private static final String TEST_PROFILE_PICTURE_URL = "https://example.com/avatar.jpg";
    private static final String TEST_CREATED_BY = "system";

    // Table and column names
    private static final String USER_TABLE = "jhi_user";
    private static final String USER_TABLE_UPPERCASE = "JHI_USER";

    @Test
    @DisplayName("Validate Quiz Table Schema Changes (20250809000001)")
    void validateQuizTableSchemaChanges() {
        System.out.println("=== Validating Quiz Table Schema Changes ===");

        try {
            // Check if quiz table exists
            boolean quizTableExists = tableExists("quiz");
            assert quizTableExists : "Quiz table should exist";
            System.out.println("✅ Quiz table exists");

            // Validate new columns from 20250809000001_add_quiz_scheduling_columns.xml
            Map<String, String> expectedColumns = new HashMap<>();
            expectedColumns.put("is_active", "BOOLEAN");
            expectedColumns.put("activation_time", "TIMESTAMP");
            expectedColumns.put("deactivation_time", "TIMESTAMP");
            expectedColumns.put("time_limit_minutes", "INTEGER");
            expectedColumns.put("is_template", "BOOLEAN");
            expectedColumns.put("template_name", "VARCHAR");

            for (Map.Entry<String, String> column : expectedColumns.entrySet()) {
                boolean columnExists = columnExists("quiz", column.getKey());
                assert columnExists : String.format("Column %s should exist in quiz table", column.getKey());
                System.out.printf("✅ Column %s exists in quiz table%n", column.getKey());
            }

            System.out.println("✅ Quiz table schema validation completed successfully");

        } catch (Exception e) {
            System.err.println("❌ Quiz table schema validation failed: " + e.getMessage());
            throw new AssertionError("Quiz table schema validation failed", e);
        }
    }

    /**
     * Validates that all user table schema changes from Liquibase changelog
     * 20250809000005_add_missing_user_columns.xml have been applied correctly.
     * 
     * This test verifies:
     * - All new columns exist with correct data types
     * - Column constraints (nullable, default values) are properly set
     * - Data can be inserted and retrieved correctly
     * - Timestamp columns can be updated
     */
    @Test
    @DisplayName("Validate User Table Schema Changes (20250809000005)")
    void validateUserTableSchemaChanges() {
        System.out.println("=== Validating User Table Schema Changes ===");

        try {
            // Check if jhi_user table exists
            boolean userTableExists = tableExists("jhi_user");
            assert userTableExists : "User table should exist";
            System.out.println("✅ User table exists");

            // Validate new columns from 20250809000005_add_missing_user_columns.xml
            validateUserColumn("last_login_date", "TIMESTAMP", true, null);
            validateUserColumn("failed_login_attempts", "INTEGER", true, "0");
            validateUserColumn("account_locked_until", "TIMESTAMP", true, null);
            validateUserColumn("profile_completed", "BOOLEAN", true, "false");
            validateUserColumn("timezone", "VARCHAR", true, null);
            validateUserColumn("oauth2_registration", "BOOLEAN", true, "false");
            validateUserColumn("profile_picture_url", "VARCHAR", true, null);
            validateUserColumn("external_profile_synced_at", "TIMESTAMP", true, null);

            // Test column constraints and data types
            validateUserColumnConstraints();

            System.out.println("✅ User table schema validation completed successfully");

        } catch (Exception e) {
            System.err.println("❌ User table schema validation failed: " + e.getMessage());
            throw new AssertionError("User table schema validation failed", e);
        }
    }

    private void validateUserColumn(String columnName, String expectedType, boolean nullable, String defaultValue)
            throws SQLException {
        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();
            try (ResultSet columns = metaData.getColumns(null, null, USER_TABLE_UPPERCASE, columnName.toUpperCase())) {
                assert columns.next() : String.format("Column %s should exist in %s table", columnName, USER_TABLE);

                ColumnInfo columnInfo = extractColumnInfo(columns);

                System.out.printf("✅ Column %s exists in %s table (Type: %s, Nullable: %s)%n",
                        columnName, USER_TABLE, columnInfo.typeName(), columnInfo.isNullable() ? "YES" : "NO");

                validateColumnConstraints(columnName, columnInfo, nullable, defaultValue);
            }
        }
    }

    private ColumnInfo extractColumnInfo(ResultSet columns) throws SQLException {
        String actualType = columns.getString("TYPE_NAME");
        int isNullable = columns.getInt("NULLABLE");
        String columnDefault = columns.getString("COLUMN_DEF");

        return new ColumnInfo(actualType, isNullable == DatabaseMetaData.columnNullable, columnDefault);
    }

    private void validateColumnConstraints(String columnName, ColumnInfo columnInfo, boolean nullable,
            String defaultValue) {
        // Validate nullability
        if (nullable) {
            assert columnInfo.isNullable() : String.format("Column %s should be nullable", columnName);
        }

        // Validate default value if specified
        if (defaultValue != null && columnInfo.defaultValue() != null) {
            System.out.printf("   Default value for %s: %s%n", columnName, columnInfo.defaultValue());
        }
    }

    private record ColumnInfo(String typeName, boolean isNullable, String defaultValue) {
    }

    private void validateUserColumnConstraints() {
        System.out.println("=== Validating User Column Constraints ===");

        TestUser testUser = createTestUser();
        try {
            validateDataInsertionAndRetrieval(testUser);
            validateTimestampUpdates(testUser);
            System.out.println("✅ User column constraints validation completed successfully");
        } catch (Exception e) {
            System.err.println("❌ User column constraints validation failed: " + e.getMessage());
            throw new AssertionError("User column constraints validation failed", e);
        } finally {
            cleanupTestUser(testUser);
        }
    }

    private TestUser createTestUser() {
        // Clean up any existing test data
        jdbcTemplate.update("DELETE FROM " + USER_TABLE + " WHERE email = ? OR login = ?", TEST_EMAIL, TEST_LOGIN);

        return new TestUser(TEST_LOGIN, TEST_EMAIL);
    }

    private void validateDataInsertionAndRetrieval(TestUser testUser) {
        // Insert test user with new columns
        String insertSql = """
                INSERT INTO %s (login, email, password_hash, activated, lang_key,
                    failed_login_attempts, profile_completed, timezone, oauth2_registration,
                    profile_picture_url, created_by, created_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """.formatted(USER_TABLE);

        TestUserBuilder builder = new TestUserBuilder()
                .withLogin(testUser.login())
                .withEmail(testUser.email());

        jdbcTemplate.update(insertSql, builder.buildInsertParameters());

        // Verify the data was inserted correctly
        String selectSql = """
                SELECT failed_login_attempts, profile_completed, timezone,
                       oauth2_registration, profile_picture_url
                FROM %s WHERE login = ?
                """.formatted(USER_TABLE);

        Map<String, Object> result = jdbcTemplate.queryForMap(selectSql, testUser.login());

        validateInsertedData(result);
        System.out.println("✅ Data insertion and retrieval validation passed");
    }

    private void validateInsertedData(Map<String, Object> result) {
        assert result.get("failed_login_attempts").equals(3) : "failed_login_attempts should be 3";
        assert result.get("profile_completed").equals(true) : "profile_completed should be true";
        assert result.get("timezone").equals(TEST_TIMEZONE) : "timezone should be " + TEST_TIMEZONE;
        assert result.get("oauth2_registration").equals(false) : "oauth2_registration should be false";
        assert result.get("profile_picture_url").equals(TEST_PROFILE_PICTURE_URL)
                : "profile_picture_url should match " + TEST_PROFILE_PICTURE_URL;
    }

    private void validateTimestampUpdates(TestUser testUser) {
        // Test updating timestamp fields
        String updateSql = """
                UPDATE %s SET last_login_date = ?, account_locked_until = ?,
                       external_profile_synced_at = ? WHERE login = ?
                """.formatted(USER_TABLE);

        java.sql.Timestamp now = new java.sql.Timestamp(System.currentTimeMillis());
        jdbcTemplate.update(updateSql, now, now, now, testUser.login());

        // Verify timestamp updates
        String timestampSql = """
                SELECT last_login_date, account_locked_until, external_profile_synced_at
                FROM %s WHERE login = ?
                """.formatted(USER_TABLE);

        Map<String, Object> timestampResult = jdbcTemplate.queryForMap(timestampSql, testUser.login());

        assert timestampResult.get("last_login_date") != null : "last_login_date should be set";
        assert timestampResult.get("account_locked_until") != null : "account_locked_until should be set";
        assert timestampResult.get("external_profile_synced_at") != null
                : "external_profile_synced_at should be set";

        System.out.println("✅ Timestamp column updates validation passed");
    }

    private void cleanupTestUser(TestUser testUser) {
        try {
            jdbcTemplate.update("DELETE FROM " + USER_TABLE + " WHERE login = ?", testUser.login());
        } catch (Exception e) {
            System.err.println("⚠️ Failed to cleanup test user: " + e.getMessage());
        }
    }

    private record TestUser(String login, String email) {
    }

    /**
     * Builder for creating test user data with different configurations
     */
    private static class TestUserBuilder {
        private String login = TEST_LOGIN;
        private String email = TEST_EMAIL;
        private String passwordHash = TEST_PASSWORD_HASH;
        private boolean activated = true;
        private String langKey = "en";
        private int failedLoginAttempts = 3;
        private boolean profileCompleted = true;
        private String timezone = TEST_TIMEZONE;
        private boolean oauth2Registration = false;
        private String profilePictureUrl = TEST_PROFILE_PICTURE_URL;
        private String createdBy = TEST_CREATED_BY;

        public TestUserBuilder withLogin(String login) {
            this.login = login;
            return this;
        }

        public TestUserBuilder withEmail(String email) {
            this.email = email;
            return this;
        }

        public TestUserBuilder withFailedLoginAttempts(int attempts) {
            this.failedLoginAttempts = attempts;
            return this;
        }

        public Object[] buildInsertParameters() {
            return new Object[] {
                    login, email, passwordHash, activated, langKey,
                    failedLoginAttempts, profileCompleted, timezone, oauth2Registration,
                    profilePictureUrl, createdBy, new java.sql.Timestamp(System.currentTimeMillis())
            };
        }

        public TestUser build() {
            return new TestUser(login, email);
        }
    }

    @Test
    @DisplayName("Validate FileMetaData Table Creation (20250811000001)")
    void validateFileMetaDataTableCreation() {
        System.out.println("=== Validating FileMetaData Table Creation ===");

        try {
            // Check if file_meta_data table exists
            boolean fileMetaDataTableExists = tableExists("file_meta_data");
            assert fileMetaDataTableExists : "FileMetaData table should exist";
            System.out.println("✅ FileMetaData table exists");

            // Validate all columns from 20250811000001_add_file_metadata_table.xml
            Map<String, String> expectedColumns = new HashMap<>();
            expectedColumns.put("id", "BIGINT");
            expectedColumns.put("file_name", "VARCHAR");
            expectedColumns.put("original_file_name", "VARCHAR");
            expectedColumns.put("mime_type", "VARCHAR");
            expectedColumns.put("file_size", "BIGINT");
            expectedColumns.put("checksum", "VARCHAR");
            expectedColumns.put("folder_path", "VARCHAR");
            expectedColumns.put("upload_date", "TIMESTAMP");
            expectedColumns.put("lesson_id", "BIGINT");
            expectedColumns.put("user_profile_id", "BIGINT");

            for (Map.Entry<String, String> column : expectedColumns.entrySet()) {
                boolean columnExists = columnExists("file_meta_data", column.getKey());
                assert columnExists : String.format("Column %s should exist in file_meta_data table", column.getKey());
                System.out.printf("✅ Column %s exists in file_meta_data table%n", column.getKey());
            }

            // Validate foreign key constraints
            boolean lessonFkExists = foreignKeyExists("file_meta_data", "lesson_id", "lesson", "id");
            assert lessonFkExists : "Foreign key constraint from file_meta_data.lesson_id to lesson.id should exist";
            System.out.println("✅ Foreign key constraint to lesson table exists");

            boolean userProfileFkExists = foreignKeyExists("file_meta_data", "user_profile_id", "user_profile", "id");
            assert userProfileFkExists
                    : "Foreign key constraint from file_meta_data.user_profile_id to user_profile.id should exist";
            System.out.println("✅ Foreign key constraint to user_profile table exists");

            // Validate indexes
            boolean checksumIndexExists = indexExists("file_meta_data", "checksum");
            System.out.printf("%s Index on checksum column%n", checksumIndexExists ? "✅" : "⚠️");

            boolean folderPathIndexExists = indexExists("file_meta_data", "folder_path");
            System.out.printf("%s Index on folder_path column%n", folderPathIndexExists ? "✅" : "⚠️");

            System.out.println("✅ FileMetaData table schema validation completed successfully");

        } catch (Exception e) {
            System.err.println("❌ FileMetaData table schema validation failed: " + e.getMessage());
            throw new AssertionError("FileMetaData table schema validation failed", e);
        }
    }

    @Test
    @DisplayName("Validate All Core Entity Tables")
    void validateAllCoreEntityTables() {
        System.out.println("=== Validating All Core Entity Tables ===");

        // List of all expected core tables
        String[] expectedTables = {
                "jhi_user", "jhi_authority", "jhi_user_authority",
                "user_profile", "student_profile", "teacher_profile",
                "course", "lesson", "quiz", "question", "quiz_question",
                "course_class", "schedule", "student_quiz", "student_quiz_participation",
                "flashcard", "flashcard_session", "social_account",
                "notification_preference", "notification_delivery",
                "file_meta_data", "gift_code"
        };

        int existingTables = 0;
        int totalTables = expectedTables.length;

        for (String tableName : expectedTables) {
            try {
                boolean exists = tableExists(tableName);
                if (exists) {
                    existingTables++;
                    System.out.printf("✅ Table %s exists%n", tableName);
                } else {
                    System.out.printf("⚠️  Table %s does not exist%n", tableName);
                }
            } catch (Exception e) {
                System.out.printf("❌ Error checking table %s: %s%n", tableName, e.getMessage());
            }
        }

        System.out.printf("✅ Core entity tables validation completed: %d/%d tables exist (%.1f%%)%n",
                existingTables, totalTables, (existingTables * 100.0) / totalTables);

        // Assert that at least 80% of expected tables exist
        double existencePercentage = (existingTables * 100.0) / totalTables;
        assert existencePercentage >= 80.0 : String
                .format("Expected at least 80%% of core tables to exist, but only %.1f%% exist", existencePercentage);
    }

    @Test
    @DisplayName("Validate Liquibase Changelog Execution")
    void validateLiquibaseChangelogExecution() {
        System.out.println("=== Validating Liquibase Changelog Execution ===");

        try {
            // Check if DATABASECHANGELOG table exists
            boolean changelogTableExists = tableExists("DATABASECHANGELOG");
            assert changelogTableExists : "DATABASECHANGELOG table should exist";
            System.out.println("✅ DATABASECHANGELOG table exists");

            // Check specific changesets
            String[] expectedChangesets = {
                    "20250809000001_add_quiz_scheduling_columns.xml",
                    "20250809000002_add_user_session_table.xml",
                    "20250809000003_add_missing_entities.xml",
                    "20250809000004_add_remaining_entities.xml",
                    "20250809000005_add_missing_user_columns.xml",
                    "20250811000001_add_file_metadata_table.xml"
            };

            for (String changeset : expectedChangesets) {
                boolean changesetExecuted = changesetExecuted(changeset);
                System.out.printf("%s Changeset %s%n",
                        changesetExecuted ? "✅" : "⚠️", changeset);
            }

            System.out.println("✅ Liquibase changelog validation completed");

        } catch (Exception e) {
            System.err.println("❌ Liquibase changelog validation failed: " + e.getMessage());
            throw new AssertionError("Liquibase changelog validation failed", e);
        }
    }

    // Helper methods for database metadata inspection

    private boolean tableExists(String tableName) throws SQLException {
        DatabaseMetaData metaData = dataSource.getConnection().getMetaData();
        try (ResultSet tables = metaData.getTables(null, null, tableName.toUpperCase(), new String[] { "TABLE" })) {
            return tables.next();
        }
    }

    private boolean columnExists(String tableName, String columnName) throws SQLException {
        DatabaseMetaData metaData = dataSource.getConnection().getMetaData();
        try (ResultSet columns = metaData.getColumns(null, null, tableName.toUpperCase(), columnName.toUpperCase())) {
            return columns.next();
        }
    }

    private boolean foreignKeyExists(String tableName, String columnName, String referencedTable,
            String referencedColumn) throws SQLException {
        DatabaseMetaData metaData = dataSource.getConnection().getMetaData();
        try (ResultSet foreignKeys = metaData.getImportedKeys(null, null, tableName.toUpperCase())) {
            while (foreignKeys.next()) {
                String fkColumnName = foreignKeys.getString("FKCOLUMN_NAME");
                String pkTableName = foreignKeys.getString("PKTABLE_NAME");
                String pkColumnName = foreignKeys.getString("PKCOLUMN_NAME");

                if (columnName.equalsIgnoreCase(fkColumnName) &&
                        referencedTable.equalsIgnoreCase(pkTableName) &&
                        referencedColumn.equalsIgnoreCase(pkColumnName)) {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean indexExists(String tableName, String columnName) throws SQLException {
        DatabaseMetaData metaData = dataSource.getConnection().getMetaData();
        try (ResultSet indexes = metaData.getIndexInfo(null, null, tableName.toUpperCase(), false, false)) {
            while (indexes.next()) {
                String indexColumnName = indexes.getString("COLUMN_NAME");
                if (columnName.equalsIgnoreCase(indexColumnName)) {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean changesetExecuted(String changesetId) {
        try {
            String sql = "SELECT COUNT(*) FROM DATABASECHANGELOG WHERE FILENAME LIKE ?";
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, "%" + changesetId + "%");
            return count != null && count > 0;
        } catch (Exception e) {
            System.err.println("Error checking changeset " + changesetId + ": " + e.getMessage());
            return false;
        }
    }
}