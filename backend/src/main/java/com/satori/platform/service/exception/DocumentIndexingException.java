package com.satori.platform.service.exception;

/**
 * Exception thrown when document indexing fails in the RAG system.
 */
public class DocumentIndexingException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public DocumentIndexingException(String message) {
        super(message);
    }

    public DocumentIndexingException(String message, Throwable cause) {
        super(message, cause);
    }

    public DocumentIndexingException(Throwable cause) {
        super(cause);
    }
}
