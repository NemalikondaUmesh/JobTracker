package com.alpha.JobTracker.requestdto;

import jakarta.validation.constraints.NotBlank;

public class JobApplicationStatusrequestdto {

    @NotBlank(message = "Status is required")
    private String status;

    public JobApplicationStatusrequestdto() {
    }

    public JobApplicationStatusrequestdto(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}