package com.satori.platform.service.dto;

import jakarta.validation.constraints.NotBlank;
import java.io.Serializable;
import java.util.Objects;

/**
 * DTO for OAuth2 account linking request.
 */
public class OAuth2LinkRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotBlank
    private String code;

    @NotBlank
    private String state;

    public OAuth2LinkRequest() {
    }

    public OAuth2LinkRequest(String code, String state) {
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

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof OAuth2LinkRequest))
            return false;
        OAuth2LinkRequest that = (OAuth2LinkRequest) o;
        return Objects.equals(code, that.code) &&
                Objects.equals(state, that.state);
    }

    @Override
    public int hashCode() {
        return Objects.hash(code, state);
    }

    @Override
    public String toString() {
        return "OAuth2LinkRequest{" +
                "code='[PROTECTED]'" +
                ", state='" + state + '\'' +
                '}';
    }
}