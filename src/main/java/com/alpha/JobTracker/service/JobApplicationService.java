
package com.alpha.JobTracker.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alpha.JobTracker.entity.Candidate;
import com.alpha.JobTracker.entity.Job;
import com.alpha.JobTracker.entity.JobApplication;

import com.alpha.JobTracker.repository.CandidateRepository;
import com.alpha.JobTracker.repository.JobRepository;
import com.alpha.JobTracker.repository.JobApplicationRepository;

import com.alpha.JobTracker.requestdto.JobApplicationStatusrequestdto;
import com.alpha.JobTracker.requestdto.JobApplicationrequestdto;

import com.alpha.JobTracker.responsedto.JobApplicationresponsedto;
import com.alpha.JobTracker.responsedto.Responsestructure;

import com.alpha.JobTracker.exception.CandidateNotFoundException;
import com.alpha.JobTracker.exception.JobNotFoundException;

@Service
public class JobApplicationService {

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    // APPLY FOR JOB
    public Responsestructure<JobApplicationresponsedto> applyForJob(
            JobApplicationrequestdto request) {

        Candidate candidate = candidateRepository.findById(
                request.getCandidateId()
        ).orElseThrow(
                () -> new CandidateNotFoundException(
                        "Candidate not found with ID: "
                                + request.getCandidateId()
                )
        );

        Job job = jobRepository.findById(
                request.getJobId()
        ).orElseThrow(
                () -> new JobNotFoundException(
                        "Job not found with ID: "
                                + request.getJobId()
                )
        );

        // CHECK DUPLICATE APPLICATION
        boolean alreadyApplied =
                jobApplicationRepository.existsByCandidate_IdAndJob_Id(
                        candidate.getId(),
                        job.getId()
                );

        if (alreadyApplied) {

            Responsestructure<JobApplicationresponsedto> response =
                    new Responsestructure<>();

            response.setStatuscode(400);

            response.setMessagecode(
                    "You have already applied for this job."
            );

            response.setData(null);

            return response;
        }

        // CREATE NEW APPLICATION
        JobApplication application = new JobApplication();

        application.setCandidate(candidate);
        application.setJob(job);
        application.setStatus("APPLIED");

        JobApplication savedApplication =
                jobApplicationRepository.save(application);

        // CREATE RESPONSE DTO
        JobApplicationresponsedto dto =
                new JobApplicationresponsedto();

        dto.setId(savedApplication.getId());
        dto.setCandidateId(candidate.getId());
        dto.setCandidateName(candidate.getName());
        dto.setJobId(job.getId());
        dto.setJobTitle(job.getTitle());
        dto.setCompany(job.getCompany());
        dto.setStatus(savedApplication.getStatus());

        Responsestructure<JobApplicationresponsedto> response =
                new Responsestructure<>();

        response.setStatuscode(201);
        response.setMessagecode(
                "Job application submitted successfully"
        );
        response.setData(dto);

        return response;
    }

    // GET ALL JOB APPLICATIONS
    public Responsestructure<List<JobApplicationresponsedto>>
            getAllApplications() {

        List<JobApplication> applications =
                jobApplicationRepository.findAll();

        List<JobApplicationresponsedto> dtoList =
                new ArrayList<>();

        for (JobApplication application : applications) {

            JobApplicationresponsedto dto =
                    new JobApplicationresponsedto();

            dto.setId(application.getId());
            dto.setCandidateId(
                    application.getCandidate().getId()
            );
            dto.setCandidateName(
                    application.getCandidate().getName()
            );
            dto.setJobId(application.getJob().getId());
            dto.setJobTitle(application.getJob().getTitle());
            dto.setCompany(application.getJob().getCompany());
            dto.setStatus(application.getStatus());

            dtoList.add(dto);
        }

        Responsestructure<List<JobApplicationresponsedto>> response =
                new Responsestructure<>();

        response.setStatuscode(200);
        response.setMessagecode(
                "Job applications retrieved successfully"
        );
        response.setData(dtoList);

        return response;
    }

    // UPDATE APPLICATION STATUS
    public Responsestructure<JobApplicationresponsedto>
            updateApplicationStatus(
                    int id,
                    JobApplicationStatusrequestdto request) {

        JobApplication application =
                jobApplicationRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Job application not found with ID: " + id
                        )
                );

        application.setStatus(request.getStatus());

        JobApplication updatedApplication =
                jobApplicationRepository.save(application);

        JobApplicationresponsedto dto =
                new JobApplicationresponsedto();

        dto.setId(updatedApplication.getId());
        dto.setCandidateId(
                updatedApplication.getCandidate().getId()
        );
        dto.setCandidateName(
                updatedApplication.getCandidate().getName()
        );
        dto.setJobId(updatedApplication.getJob().getId());
        dto.setJobTitle(updatedApplication.getJob().getTitle());
        dto.setCompany(updatedApplication.getJob().getCompany());
        dto.setStatus(updatedApplication.getStatus());

        Responsestructure<JobApplicationresponsedto> response =
                new Responsestructure<>();

        response.setStatuscode(200);
        response.setMessagecode(
                "Application status updated successfully"
        );
        response.setData(dto);

        return response;
    }

    // GET APPLICATION BY ID
    public Responsestructure<JobApplicationresponsedto>
            getApplicationById(int id) {

        JobApplication application =
                jobApplicationRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Job application not found with ID: " + id
                        )
                );

        JobApplicationresponsedto dto =
                new JobApplicationresponsedto();

        dto.setId(application.getId());
        dto.setCandidateId(
                application.getCandidate().getId()
        );
        dto.setCandidateName(
                application.getCandidate().getName()
        );
        dto.setJobId(application.getJob().getId());
        dto.setJobTitle(application.getJob().getTitle());
        dto.setCompany(application.getJob().getCompany());
        dto.setStatus(application.getStatus());

        Responsestructure<JobApplicationresponsedto> response =
                new Responsestructure<>();

        response.setStatuscode(200);
        response.setMessagecode(
                "Job application found successfully"
        );
        response.setData(dto);

        return response;
    }

    // DELETE JOB APPLICATION
    public Responsestructure<String> deleteApplication(int id) {

        JobApplication application =
                jobApplicationRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Job application not found with ID: " + id
                        )
                );

        jobApplicationRepository.delete(application);

        Responsestructure<String> response =
                new Responsestructure<>();

        response.setStatuscode(200);
        response.setMessagecode(
                "Job application deleted successfully"
        );
        response.setData("Deleted application ID: " + id);

        return response;
    }
}
