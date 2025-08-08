package com.satori.platform.service.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * Utility class for encrypting and decrypting OAuth2 tokens using AES-256-GCM.
 */
@Component
public class OAuth2TokenEncryption {

    private static final Logger log = LoggerFactory.getLogger(OAuth2TokenEncryption.class);

    private static final String ALGORITHM = "AES";
    private static final String TRANSFORMATION = "AES/GCM/NoPadding";
    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 16;

    private final SecretKey secretKey;
    private final SecureRandom secureRandom;

    public OAuth2TokenEncryption(@Value("${app.oauth2.encryption.key:}") String encryptionKey) {
        this.secureRandom = new SecureRandom();

        if (encryptionKey != null && !encryptionKey.trim().isEmpty()) {
            // Use provided key
            byte[] keyBytes = Base64.getDecoder().decode(encryptionKey);
            this.secretKey = new SecretKeySpec(keyBytes, ALGORITHM);
        } else {
            // Generate a new key (for development/testing)
            this.secretKey = generateKey();
            log.warn("No encryption key provided, using generated key. This should not be used in production!");
        }
    }

    /**
     * Encrypt a token string.
     *
     * @param token the token to encrypt
     * @return the encrypted token as Base64 string
     */
    public String encrypt(String token) {
        if (token == null || token.isEmpty()) {
            return token;
        }

        try {
            byte[] iv = new byte[GCM_IV_LENGTH];
            secureRandom.nextBytes(iv);

            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH * 8, iv);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, parameterSpec);

            byte[] encryptedData = cipher.doFinal(token.getBytes(StandardCharsets.UTF_8));

            // Combine IV and encrypted data
            byte[] encryptedWithIv = new byte[iv.length + encryptedData.length];
            System.arraycopy(iv, 0, encryptedWithIv, 0, iv.length);
            System.arraycopy(encryptedData, 0, encryptedWithIv, iv.length, encryptedData.length);

            return Base64.getEncoder().encodeToString(encryptedWithIv);
        } catch (Exception e) {
            log.error("Error encrypting token", e);
            throw new RuntimeException("Failed to encrypt token", e);
        }
    }

    /**
     * Decrypt a token string.
     *
     * @param encryptedToken the encrypted token as Base64 string
     * @return the decrypted token
     */
    public String decrypt(String encryptedToken) {
        if (encryptedToken == null || encryptedToken.isEmpty()) {
            return encryptedToken;
        }

        try {
            byte[] encryptedWithIv = Base64.getDecoder().decode(encryptedToken);

            // Extract IV and encrypted data
            byte[] iv = new byte[GCM_IV_LENGTH];
            byte[] encryptedData = new byte[encryptedWithIv.length - GCM_IV_LENGTH];
            System.arraycopy(encryptedWithIv, 0, iv, 0, iv.length);
            System.arraycopy(encryptedWithIv, iv.length, encryptedData, 0, encryptedData.length);

            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH * 8, iv);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, parameterSpec);

            byte[] decryptedData = cipher.doFinal(encryptedData);
            return new String(decryptedData, StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error("Error decrypting token", e);
            throw new RuntimeException("Failed to decrypt token", e);
        }
    }

    /**
     * Generate a new AES-256 key.
     *
     * @return the generated secret key
     */
    private SecretKey generateKey() {
        try {
            KeyGenerator keyGenerator = KeyGenerator.getInstance(ALGORITHM);
            keyGenerator.init(256);
            return keyGenerator.generateKey();
        } catch (Exception e) {
            log.error("Error generating encryption key", e);
            throw new RuntimeException("Failed to generate encryption key", e);
        }
    }

    /**
     * Generate a Base64 encoded key for configuration.
     * This method is useful for generating keys for production use.
     *
     * @return Base64 encoded key
     */
    public static String generateBase64Key() {
        try {
            KeyGenerator keyGenerator = KeyGenerator.getInstance(ALGORITHM);
            keyGenerator.init(256);
            SecretKey key = keyGenerator.generateKey();
            return Base64.getEncoder().encodeToString(key.getEncoded());
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Base64 key", e);
        }
    }
}