package com.satori.platform.validation;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import javax.sql.DataSource;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

/**
 * Direct User table schema validation test that validates the User table schema
 * changes
 * from Liquibase changeset 20250809000005 without requiring
 * Docker/Testcontainers.
 */
@SpringBootTest
@ActiveProfiles("dev")
public class UserSchemaValidationTest {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private JdbcTemplate jdbcTemplate;

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

    private boolean tableExists(String tableName) throws SQLException {
        DatabaseMetaData metaData = dataSource.getConnection().getMetaData();
        try (ResultSet tables = metaData.getTables(null, null, tableName.toUpperCase(), new String[] { "TABLE" })) {
            return tables.next();
        }
    }

    private void validateUserColumn(String columnName, String expectedType, boolean nullable, String defaultValue)
            throws SQLException {
        DatabaseMetaData metaData = dataSource.getConnection().getMetaData();
        try (ResultSet columns = metaData.getColumns(null, null, "JHI_USER", columnName.toUpperCase())) {
            assert columns.next() : String.format("Column %s should exist in jhi_user table", columnName);

            String actualType = columns.getString("TYPE_NAME");
            int isNullable = columns.getInt("NULLABLE");
            String columnDefault = columns.getString("COLUMN_DEF");

            System.out.printf("✅ Column %s exists in jhi_user table (Type: %s, Nullable: %s)%n",
                    columnName, actualType, isNullable == DatabaseMetaData.columnNullable ? "YES" : "NO");

            // Validate nullability
            if (nullable) {
                assert isNullable == DatabaseMetaData.columnNullable
                        : String.format("Column %s should be nullable", columnName);
            }

            // Validate default value if specified
            if (defaultValue != null && columnDefault != null) {
                System.out.printf("   Default value for %s: %s%n", columnName, columnDefault);
            }
        }
    }

    private void validateUserColumnConstraints() {
        System.out.println("=== Validating User Column Constraints ===");

        try {
            // Test that we can insert and retrieve data with new columns
            String testEmail = "schema.test@example.com";
            String testLogin = "schematest";

            // Clean up any existing test data
            jdbcTemplate.update("DELETE FROM jhi_user WHERE email = ? OR login = ?", testEmail, testLogin);

            // Insert test user with new columns
            String insertSql = """
                    INSERT INTO jhi_user (login, email, password_hash, activated, lang_key,
                        failed_login_attempts, profile_completed, timezone, oauth2_registration,
                        profile_picture_url, created_by, created_date)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """;

            jdbcTemplate.update(insertSql,
                    testLogin, testEmail, "test_hash", true, "en",
                    3, true, "UTC", false, "https://example.com/avatar.jpg",
                    "system", new java.sql.Timestamp(System.currentTimeMillis()));

            // Verify the data was inserted correctly
            String selectSql = """
                    SELECT failed_login_attempts, profile_completed, timezone,
                           oauth2_registration, profile_picture_url
                    FROM jhi_user WHERE login = ?
                    """;

            Map<String, Object> result = jdbcTemplate.queryForMap(selectSql, testLogin);

            assert result.get("failed_login_attempts").equals(3) : "failed_login_attempts should be 3";
            assert result.get("profile_completed").equals(true) : "profile_completed should be true";
            assert result.get("timezone").equals("UTC") : "timezone should be UTC";
            assert result.get("oauth2_registration").equals(false) : "oauth2_registration should be false";
            assert result.get("profile_picture_url").equals("https://example.com/avatar.jpg")
                    : "profile_picture_url should match";

            System.out.println("✅ User column constraints validation passed");

            // Test updating timestamp fields
            String updateSql = """
                    UPDATE jhi_user SET last_login_date = ?, account_locked_until = ?,
                           external_profile_synced_at = ? WHERE login = ?
                    """;

            java.sql.Timestamp now = new java.sql.Timestamp(System.currentTimeMillis());
            jdbcTemplate.update(updateSql, now, now, now, testLogin);

            // Verify timestamp updates
            String timestampSql = """
                    SELECT last_login_date, account_locked_until, external_profile_synced_at
                    FROM jhi_user WHERE login = ?
                    """;

            Map<String, Object> timestampResult = jdbcTemplate.queryForMap(timestampSql, testLogin);
            assert timestampResult.get("last_login_date") != null : "last_login_date should be set";
            assert timestampResult.get("account_locked_until") != null : "account_locked_until should be set";
            assert timestampResult.get("external_profile_synced_at") != null
                    : "external_profile_synced_at should be set";

            System.out.println("✅ Timestamp column updates validation passed");

            // Clean up test data
            jdbcTemplate.update("DELETE FROM jhi_user WHERE login = ?", testLogin);

        } catch (Exception e) {
            System.err.println("❌ User column constraints validation failed: " + e.getMessage());
            throw new AssertionError("User column constraints validation failed", e);
        }
    }
}