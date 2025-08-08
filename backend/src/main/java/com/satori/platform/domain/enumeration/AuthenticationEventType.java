package com.satori.platform.domain.enumeration;

/**
 * The AuthenticationEventType enumeration
 */
public enum AuthenticationEventType {
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT,
    PASSWORD_RESET_REQUEST,
    PASSWORD_RESET_SUCCESS,
    PASSWORD_CHANGE,
    ACCOUNT_ACTIVATION,
    ACCOUNT_LOCKED,
    ACCOUNT_UNLOCKED,
    REGISTRATION,
    PROFILE_COMPLETION,
    SESSION_EXPIRED,
    CONCURRENT_LOGIN_DETECTED,
}