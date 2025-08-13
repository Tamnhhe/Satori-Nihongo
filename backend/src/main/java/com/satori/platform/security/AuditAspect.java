package com.satori.platform.security;

import com.satori.platform.domain.enumeration.AuditAction;
import com.satori.platform.service.AuditLogService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Aspect for automatic audit logging of sensitive operations.
 */
@Aspect
@Component
public class AuditAspect {

    private static final Logger log = LoggerFactory.getLogger(AuditAspect.class);

    private final AuditLogService auditLogService;

    public AuditAspect(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @Pointcut("@annotation(com.satori.platform.security.RoleBasedAccessControl.AdminOnly)")
    public void adminOnlyMethods() {
    }

    @Pointcut("execution(* com.satori.platform.web.rest.*Resource.create*(..))")
    public void createOperations() {
    }

    @Pointcut("execution(* com.satori.platform.web.rest.*Resource.update*(..))")
    public void updateOperations() {
    }

    @Pointcut("execution(* com.satori.platform.web.rest.*Resource.delete*(..))")
    public void deleteOperations() {
    }

    @Pointcut("execution(* com.satori.platform.service.*Service.activate*(..))")
    public void activationOperations() {
    }

    @Pointcut("execution(* com.satori.platform.service.*Service.deactivate*(..))")
    public void deactivationOperations() {
    }

    @Pointcut("execution(* com.satori.platform.service.FileManagementService.upload*(..))")
    public void fileUploadOperations() {
    }

    @Pointcut("execution(* com.satori.platform.service.FileManagementService.delete*(..))")
    public void fileDeleteOperations() {
    }

    @Pointcut("execution(* com.satori.platform.service.GiftCodeService.generate*(..))")
    public void giftCodeGenerationOperations() {
    }

    @Pointcut("execution(* com.satori.platform.service.GiftCodeService.redeem*(..))")
    public void giftCodeRedemptionOperations() {
    }

    @AfterReturning("createOperations()")
    public void logCreateOperation(JoinPoint joinPoint) {
        try {
            String resourceType = extractResourceType(joinPoint);
            auditLogService.logAuditEvent(AuditAction.CREATE, resourceType, null,
                    "Created " + resourceType + " via " + joinPoint.getSignature().getName());
        } catch (Exception e) {
            log.error("Failed to log create operation", e);
        }
    }

    @AfterReturning("updateOperations()")
    public void logUpdateOperation(JoinPoint joinPoint) {
        try {
            String resourceType = extractResourceType(joinPoint);
            Object[] args = joinPoint.getArgs();
            Long resourceId = extractResourceId(args);

            auditLogService.logAuditEvent(AuditAction.UPDATE, resourceType, resourceId,
                    "Updated " + resourceType + " via " + joinPoint.getSignature().getName());
        } catch (Exception e) {
            log.error("Failed to log update operation", e);
        }
    }

    @AfterReturning("deleteOperations()")
    public void logDeleteOperation(JoinPoint joinPoint) {
        try {
            String resourceType = extractResourceType(joinPoint);
            Object[] args = joinPoint.getArgs();
            Long resourceId = extractResourceId(args);

            auditLogService.logAuditEvent(AuditAction.DELETE, resourceType, resourceId,
                    "Deleted " + resourceType + " via " + joinPoint.getSignature().getName());
        } catch (Exception e) {
            log.error("Failed to log delete operation", e);
        }
    }

    @AfterReturning("fileUploadOperations()")
    public void logFileUpload(JoinPoint joinPoint) {
        try {
            auditLogService.logAuditEvent(AuditAction.FILE_UPLOAD, "FILE", null,
                    "File uploaded via " + joinPoint.getSignature().getName());
        } catch (Exception e) {
            log.error("Failed to log file upload", e);
        }
    }

    @AfterReturning("fileDeleteOperations()")
    public void logFileDelete(JoinPoint joinPoint) {
        try {
            Object[] args = joinPoint.getArgs();
            Long fileId = extractResourceId(args);

            auditLogService.logAuditEvent(AuditAction.FILE_DELETE, "FILE", fileId,
                    "File deleted via " + joinPoint.getSignature().getName());
        } catch (Exception e) {
            log.error("Failed to log file delete", e);
        }
    }

    @AfterReturning("giftCodeGenerationOperations()")
    public void logGiftCodeGeneration(JoinPoint joinPoint) {
        try {
            auditLogService.logAuditEvent(AuditAction.GIFT_CODE_GENERATE, "GIFT_CODE", null,
                    "Gift code generated via " + joinPoint.getSignature().getName());
        } catch (Exception e) {
            log.error("Failed to log gift code generation", e);
        }
    }

    @AfterReturning("giftCodeRedemptionOperations()")
    public void logGiftCodeRedemption(JoinPoint joinPoint) {
        try {
            auditLogService.logAuditEvent(AuditAction.GIFT_CODE_REDEEM, "GIFT_CODE", null,
                    "Gift code redeemed via " + joinPoint.getSignature().getName());
        } catch (Exception e) {
            log.error("Failed to log gift code redemption", e);
        }
    }

    @AfterThrowing(pointcut = "adminOnlyMethods()", throwing = "ex")
    public void logSecurityViolation(JoinPoint joinPoint, Exception ex) {
        try {
            auditLogService.logSecurityViolation(
                    "Unauthorized access attempt to admin-only method: " + joinPoint.getSignature().getName(),
                    ex.getMessage());
        } catch (Exception e) {
            log.error("Failed to log security violation", e);
        }
    }

    private String extractResourceType(JoinPoint joinPoint) {
        String className = joinPoint.getTarget().getClass().getSimpleName();
        return className.replace("Resource", "").replace("Service", "").toUpperCase();
    }

    private Long extractResourceId(Object[] args) {
        if (args != null && args.length > 0) {
            for (Object arg : args) {
                if (arg instanceof Long) {
                    return (Long) arg;
                }
                // Check if it's a DTO with an ID field
                try {
                    if (arg != null && arg.getClass().getMethod("getId") != null) {
                        return (Long) arg.getClass().getMethod("getId").invoke(arg);
                    }
                } catch (Exception e) {
                    // Ignore and continue
                }
            }
        }
        return null;
    }
}