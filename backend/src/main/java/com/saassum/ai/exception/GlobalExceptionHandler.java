package com.saassum.ai.exception;

import com.saassum.ai.dto.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArgument(IllegalArgumentException ex) {
        log.warn("[Bad Request] {}", sanitize(ex.getMessage()));
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationException(MethodArgumentNotValidException ex) {
        String errors = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("; "));
        log.warn("[Validation Error] {}", sanitize(errors));
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Validation failed: " + errors));
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ApiResponse<Object>> handleDataAccessException(DataAccessException ex) {
        log.error("[Database Error] {}", sanitize(ex.getMessage()), ex);
        String explanation = "Database operation could not be completed. "
                + "If connecting to Supabase PostgreSQL, please verify your credentials and network connectivity in application.properties or environment variables.";
        return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error(explanation));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGenericException(Exception ex) {
        log.error("[Server Error] {}", sanitize(ex.getMessage()), ex);
        String safeMessage = ex.getMessage() != null && !ex.getMessage().isBlank()
                ? sanitize(ex.getMessage())
                : "An unexpected server error occurred while processing your request.";
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(safeMessage));
    }

    /**
     * Masks sensitive tokens, API keys, passwords, and secrets before logging or displaying.
     */
    private String sanitize(String input) {
        if (input == null) return "";
        return input
                .replaceAll("(?i)(password=)[^&;\\s]+", "$1******")
                .replaceAll("(?i)(api[_-]?key=)[^&;\\s]+", "$1******")
                .replaceAll("(?i)(bearer\\s+)[a-zA-Z0-9._-]+", "$1******")
                .replaceAll("(?i)(secret=)[^&;\\s]+", "$1******");
    }
}
