package com.satori.platform.service.dto;

import jakarta.validation.constraints.NotBlank;
import java.io.Serializable;
import java.util.Objects;

/**
 * DTO for OAuth2 callback request.
 */
public class OAuth2CallbackRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotBlank
    private String code;

    @NotBlank
    private String state;

    private String redirectUrl;

    public OAuth2CallbackRequest() {
    }

    public OAuth2CallbackRequest(String code, String state) {
        this.code = code;
        this.state = state;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getRedirectUrl() {
        return redirectUrl;
    }

    public void setRedirectUrl(String redirectUrl) {
        this.redirectUrl = redirectUrl;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof OAuth2CallbackRequest))
            return false;
        OAuth2CallbackRequest that = (OAuth2CallbackRequest) o;
        return Objects.equals(code, that.code) &&
                Objects.equals(state, that.state) &&
                Objects.equals(redirectUrl, that.redirectUrl);
    }

    @Override
    public int hashCode() {
        return Objects.hash(code, state, redirectUrl);
    }

    @Override
    public String toString() {
        return "OAuth2CallbackRequest{" +
                "code='[PROTECTED]'" +
                ", state='" + state + '\'' +
                ", redirectUrl='" + redirectUrl + '\'' +
                '}';
    }
}