
package com.alpha.JobTracker.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.alpha.JobTracker.responsedto.Responsestructure;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // HANDLE VALIDATION ERRORS
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Responsestructure<String>> handleValidationException(
            MethodArgumentNotValidException ex) {

        String errorMessage = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("Invalid request data");

        Responsestructure<String> response = new Responsestructure<>();

        response.setStatuscode(400);
        response.setMessagecode(errorMessage);
        response.setData(null);

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // HANDLE CANDIDATE NOT FOUND
    @ExceptionHandler(CandidateNotFoundException.class)
    public ResponseEntity<Responsestructure<String>> handleCandidateNotFound(
            CandidateNotFoundException ex) {

        Responsestructure<String> response = new Responsestructure<>();

        response.setStatuscode(404);
        response.setMessagecode(ex.getMessage());
        response.setData(null);

        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    // HANDLE DUPLICATE EMAIL
    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<Responsestructure<String>> handleDuplicateEmail(
            DuplicateEmailException ex) {

        Responsestructure<String> response = new Responsestructure<>();

        response.setStatuscode(409);
        response.setMessagecode(ex.getMessage());
        response.setData(null);

        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    // HANDLE JOB NOT FOUND
    @ExceptionHandler(JobNotFoundException.class)
    public ResponseEntity<Responsestructure<String>> handleJobNotFound(
            JobNotFoundException ex) {

        Responsestructure<String> response = new Responsestructure<>();

        response.setStatuscode(404);
        response.setMessagecode(ex.getMessage());
        response.setData(null);

        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    // HANDLE DATABASE CONSTRAINT VIOLATIONS
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Responsestructure<String>> handleDatabaseError(
            DataIntegrityViolationException ex) {

        Responsestructure<String> response = new Responsestructure<>();

        response.setStatuscode(409);
        response.setMessagecode(
                "This operation violates a database constraint.");
        response.setData(null);

        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    // HANDLE UNEXPECTED ERRORS
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Responsestructure<String>> handleGeneralException(
            Exception ex) {

        Responsestructure<String> response = new Responsestructure<>();

        response.setStatuscode(500);
        response.setMessagecode("An unexpected error occurred.");
        response.setData(null);

        return new ResponseEntity<>(
                response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
