package com.alpha.JobTracker.requestdto;

import jakarta.validation.constraints.NotNull;

public class JobApplicationrequestdto {

    @NotNull(message = "Candidate ID is required")
    private Integer candidateId;

    @NotNull(message = "Job ID is required")
    private Integer jobId;

    public JobApplicationrequestdto() {
    }

    public JobApplicationrequestdto(Integer candidateId, Integer jobId) {
        this.candidateId = candidateId;
        this.jobId = jobId;
    }

    public Integer getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(Integer candidateId) {
        this.candidateId = candidateId;
    }

    public Integer getJobId() {
        return jobId;
    }

    public void setJobId(Integer jobId) {
        this.jobId = jobId;
    }
}