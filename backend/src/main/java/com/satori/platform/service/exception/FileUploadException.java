package com.satori.platform.service.exception;

/**
 * Exception thrown when file upload operations fail.
 */
public class FileUploadException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public FileUploadException(String message) {
        super(message);
    }

    public FileUploadException(String message, Throwable cause) {
        super(message, cause);
    }
}