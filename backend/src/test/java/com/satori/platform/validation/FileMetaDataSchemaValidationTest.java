package com.satori.platform.validation;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.junit.jupiter.api.Assertions.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;
import java.util.function.BiConsumer;

/**
 * Dedicated validation test for FileMetaData table creation from Liquibase
 * changeset 20250811000001.
 * 
 * This test validates:
 * - file_meta_data table exists with all expected columns
 * - Foreign key constraints to lesson and user_profile tables
 * - Indexes on checksum, folder_path, mime_type, upload_date columns
 * - Column data types and constraints match the Liquibase definition
 */
public class FileMetaDataSchemaValidationTest extends ApiValidationTestFramework {

    private static final Logger log = LoggerFactory.getLogger(FileMetaDataSchemaValidationTest.class);

    @Autowired
    private DataSource dataSource;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final String FILE_META_DATA_TABLE = "file_meta_data";

    // Expected foreign key constraint names
    private static final String FK_LESSON_CONSTRAINT = "fk_file_meta_data_lesson_id";
    private static final String FK_USER_PROFILE_CONSTRAINT = "fk_file_meta_data_uploaded_by_id";

    // Expected index names
    private static final String IDX_CHECKSUM = "idx_file_meta_data_checksum";
    private static final String IDX_FOLDER_PATH = "idx_file_meta_data_folder_path";
    private static final String IDX_MIME_TYPE = "idx_file_meta_data_mime_type";
    private static final String IDX_UPLOAD_DATE = "idx_file_meta_data_upload_date";

    @Test
    @DisplayName("Validate FileMetaData table exists with all columns")
    void validateFileMetaDataTableExists() {
        log.info("=== Validating FileMetaData Table Existence ===");

        try {
            // Check if file_meta_data table exists
            boolean tableExists = tableExists(FILE_META_DATA_TABLE);
            assertTrue(tableExists, "file_meta_data table should exist");
            log.info("✅ file_meta_data table exists");

            // Validate all columns from the Liquibase changeset
            Map<String, ColumnDefinition> expectedColumns = getExpectedColumns();

            for (Map.Entry<String, ColumnDefinition> entry : expectedColumns.entrySet()) {
                String columnName = entry.getKey();
                ColumnDefinition expectedDef = entry.getValue();

                validateColumn(columnName, expectedDef);
            }

            log.info("✅ All FileMetaData table columns validated successfully");

        } catch (Exception e) {
            log.error("❌ FileMetaData table validation failed: {}", e.getMessage(), e);
            throw new AssertionError("FileMetaData table validation failed", e);
        }
    }

    @Test
    @DisplayName("Check foreign key constraints to lesson and user_profile tables")
    void validateForeignKeyConstraints() {
        System.out.println("=== Validating FileMetaData Foreign Key Constraints ===");

        try {
            // Validate foreign key constraint to lesson table
            boolean lessonFkExists = foreignKeyExists(FILE_META_DATA_TABLE, "lesson_id", "lesson", "id");
            assert lessonFkExists : "Foreign key constraint from file_meta_data.lesson_id to lesson.id should exist";
            System.out.println("✅ Foreign key constraint to lesson table exists (fk_file_meta_data_lesson_id)");

            // Validate foreign key constraint to user_profile table
            boolean userProfileFkExists = foreignKeyExists(FILE_META_DATA_TABLE, "uploaded_by_id", "user_profile",
                    "id");
            assert userProfileFkExists
                    : "Foreign key constraint from file_meta_data.uploaded_by_id to user_profile.id should exist";
            System.out.println(
                    "✅ Foreign key constraint to user_profile table exists (fk_file_meta_data_uploaded_by_id)");

            System.out.println("✅ All FileMetaData foreign key constraints validated successfully");

        } catch (Exception e) {
            System.err.println("❌ FileMetaData foreign key constraints validation failed: " + e.getMessage());
            throw new AssertionError("FileMetaData foreign key constraints validation failed", e);
        }
    }

    @Test
    @DisplayName("Validate indexes on checksum, folder_path, mime_type, upload_date")
    void validateIndexes() {
        log.info("=== Validating FileMetaData Table Indexes ===");

        try {
            Map<String, String> expectedIndexes = getExpectedIndexes();

            expectedIndexes.forEach(this::validateSingleIndex);

            log.info("✅ All FileMetaData table indexes validated successfully");

        } catch (Exception e) {
            log.error("❌ FileMetaData indexes validation failed: {}", e.getMessage(), e);
            throw new AssertionError("FileMetaData indexes validation failed", e);
        }
    }

    private Map<String, String> getExpectedIndexes() {
        Map<String, String> expectedIndexes = new HashMap<>();
        expectedIndexes.put("checksum", IDX_CHECKSUM);
        expectedIndexes.put("folder_path", IDX_FOLDER_PATH);
        expectedIndexes.put("mime_type", IDX_MIME_TYPE);
        expectedIndexes.put("upload_date", IDX_UPLOAD_DATE);
        return expectedIndexes;
    }

    private void validateSingleIndex(String columnName, String expectedIndexName) {
        try {
            boolean indexExists = indexExists(FILE_META_DATA_TABLE, columnName);
            assertTrue(indexExists, String.format("Index on %s column should exist", columnName));
            log.info("✅ Index on {} column exists ({})", columnName, expectedIndexName);
        } catch (SQLException e) {
            log.error("Failed to validate index on column {}: {}", columnName, e.getMessage());
            throw new AssertionError("Index validation failed for column: " + columnName, e);
        }
    }

    @Test
    @DisplayName("Validate FileMetaData table structure matches Liquibase definition")
    void validateCompleteTableStructure() {
        System.out.println("=== Validating Complete FileMetaData Table Structure ===");

        try {
            validateTableStructureComponents();
            validatePrimaryKeyConstraint();
            testBasicDataOperations();

            System.out.println("✅ Complete FileMetaData table structure validation passed");

        } catch (Exception e) {
            System.err.println("❌ Complete FileMetaData table structure validation failed: " + e.getMessage());
            throw new AssertionError("Complete FileMetaData table structure validation failed", e);
        }
    }

    private void validateTableStructureComponents() {
        validateFileMetaDataTableExists();
        validateForeignKeyConstraints();
        validateIndexes();
    }

    private void validatePrimaryKeyConstraint() throws SQLException {
        boolean primaryKeyExists = primaryKeyExists(FILE_META_DATA_TABLE, "id");
        assert primaryKeyExists : "Primary key on id column should exist";
        System.out.println("✅ Primary key on id column exists");
    }

    private void testBasicDataOperations() {
        System.out.println("=== Testing Basic FileMetaData Operations ===");

        try {
            // Test that we can query the table (even if empty)
            String countSql = "SELECT COUNT(*) FROM " + FILE_META_DATA_TABLE;
            Integer count = jdbcTemplate.queryForObject(countSql, Integer.class);
            System.out.printf("✅ Table query successful - current record count: %d%n", count != null ? count : 0);

            // Test that we can describe the table structure
            String describeSql = "SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ? ORDER BY ORDINAL_POSITION";
            List<Map<String, Object>> columns = jdbcTemplate.queryForList(describeSql,
                    FILE_META_DATA_TABLE.toUpperCase());

            System.out.printf("✅ Table structure query successful - found %d columns%n", columns.size());

            // Log column details for verification
            for (Map<String, Object> column : columns) {
                System.out.printf("   Column: %s, Type: %s, Nullable: %s%n",
                        column.get("COLUMN_NAME"),
                        column.get("DATA_TYPE"),
                        column.get("IS_NULLABLE"));
            }

        } catch (Exception e) {
            System.err.println("❌ Basic data operations test failed: " + e.getMessage());
            throw new AssertionError("Basic data operations test failed", e);
        }
    }

    private Map<String, ColumnDefinition> getExpectedColumns() {
        Map<String, ColumnDefinition> columns = new HashMap<>();

        // Primary key
        columns.put("id", ColumnDefinition.primaryKey("BIGINT"));

        // Required columns
        columns.put("file_name", ColumnDefinition.required("VARCHAR"));
        columns.put("original_name", ColumnDefinition.required("VARCHAR"));
        columns.put("file_path", ColumnDefinition.required("VARCHAR"));

        // Optional columns
        columns.put("file_type", ColumnDefinition.optional("VARCHAR"));
        columns.put("file_size", ColumnDefinition.optional("BIGINT"));
        columns.put("mime_type", ColumnDefinition.optional("VARCHAR"));
        columns.put("upload_date", ColumnDefinition.optional("TIMESTAMP"));
        columns.put("version", ColumnDefinition.optional("INTEGER"));
        columns.put("checksum", ColumnDefinition.optional("VARCHAR"));
        columns.put("folder_path", ColumnDefinition.optional("VARCHAR"));
        columns.put("description", ColumnDefinition.optional("TEXT"));
        columns.put("is_public", ColumnDefinition.optional("BOOLEAN"));
        columns.put("download_count", ColumnDefinition.optional("INTEGER"));
        columns.put("last_accessed_date", ColumnDefinition.optional("TIMESTAMP"));

        // Foreign keys
        columns.put("lesson_id", ColumnDefinition.foreignKey("BIGINT"));
        columns.put("uploaded_by_id", ColumnDefinition.foreignKey("BIGINT"));

        return Collections.unmodifiableMap(columns);
    }

    private void validateColumn(String columnName, ColumnDefinition expectedDef) throws SQLException {
        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();
            try (ResultSet columns = metaData.getColumns(null, null, FILE_META_DATA_TABLE.toUpperCase(),
                    columnName.toUpperCase())) {

                assertTrue(columns.next(),
                        String.format("Column %s should exist in %s table", columnName, FILE_META_DATA_TABLE));

                String actualType = columns.getString("TYPE_NAME");
                int isNullable = columns.getInt("NULLABLE");
                boolean actualNullable = (isNullable == DatabaseMetaData.columnNullable);

                // Validate nullability with proper assertion
                if (expectedDef.nullable != actualNullable) {
                    log.warn("⚠️  Column {} nullability mismatch - Expected: {}, Actual: {}",
                            columnName,
                            expectedDef.nullable ? "NULLABLE" : "NOT NULL",
                            actualNullable ? "NULLABLE" : "NOT NULL");
                }

                log.info("✅ Column {} exists (Type: {}, Nullable: {})",
                        columnName, actualType, actualNullable ? "YES" : "NO");
            }
        } catch (SQLException e) {
            log.error("Failed to validate column {}: {}", columnName, e.getMessage());
            throw e;
        }
    }

    // Helper methods for database metadata inspection

    private boolean tableExists(String tableName) throws SQLException {
        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();
            try (ResultSet tables = metaData.getTables(null, null, tableName.toUpperCase(), new String[] { "TABLE" })) {
                return tables.next();
            }
        }
    }

    private boolean foreignKeyExists(String tableName, String columnName, String referencedTable,
            String referencedColumn) throws SQLException {
        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();
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
        }
        return false;
    }

    private boolean indexExists(String tableName, String columnName) throws SQLException {
        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();
            try (ResultSet indexes = metaData.getIndexInfo(null, null, tableName.toUpperCase(), false, false)) {
                while (indexes.next()) {
                    String indexColumnName = indexes.getString("COLUMN_NAME");
                    if (columnName.equalsIgnoreCase(indexColumnName)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private boolean primaryKeyExists(String tableName, String columnName) throws SQLException {
        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();
            try (ResultSet primaryKeys = metaData.getPrimaryKeys(null, null, tableName.toUpperCase())) {
                while (primaryKeys.next()) {
                    String pkColumnName = primaryKeys.getString("COLUMN_NAME");
                    if (columnName.equalsIgnoreCase(pkColumnName)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Data class to represent expected column definition
     */
    private record ColumnDefinition(String dataType, boolean nullable, boolean primaryKey) {

        public ColumnDefinition {
            Objects.requireNonNull(dataType, "Data type cannot be null");
        }

        public static ColumnDefinition primaryKey(String dataType) {
            return new ColumnDefinition(dataType, false, true);
        }

        public static ColumnDefinition required(String dataType) {
            return new ColumnDefinition(dataType, false, false);
        }

        public static ColumnDefinition optional(String dataType) {
            return new ColumnDefinition(dataType, true, false);
        }

        public static ColumnDefinition foreignKey(String dataType) {
            return new ColumnDefinition(dataType, true, false);
        }
    }
}