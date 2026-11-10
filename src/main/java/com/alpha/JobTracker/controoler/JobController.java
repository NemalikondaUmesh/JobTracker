
package com.alpha.JobTracker.controoler;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import com.alpha.JobTracker.requestdto.JobApplicationStatusrequestdto;
import com.alpha.JobTracker.requestdto.JobApplicationrequestdto;
import com.alpha.JobTracker.requestdto.Jobrequestdto;

import com.alpha.JobTracker.responsedto.JobApplicationresponsedto;
import com.alpha.JobTracker.responsedto.Jobresponsedto;
import com.alpha.JobTracker.responsedto.Responsestructure;

import com.alpha.JobTracker.service.JobApplicationService;
import com.alpha.JobTracker.service.JobService;

@RestController
@RequestMapping("/job")
public class JobController {

    @Autowired
    private JobService jobService;

    @Autowired
    private JobApplicationService jobApplicationService;

    // ADD JOB
    @PostMapping("/add")
    public Responsestructure<Jobresponsedto> addJob(
            @Valid @RequestBody Jobrequestdto jobRequest) {

        return jobService.addJob(jobRequest);
    }

    // GET ALL JOBS
    @GetMapping("/all")
    public Responsestructure<List<Jobresponsedto>> getAllJobs() {

        return jobService.getAllJobs();
    }

    // GET JOB BY ID
    @GetMapping("/{id}")
    public Responsestructure<Jobresponsedto> getJobById(
            @PathVariable int id) {

        return jobService.getJobById(id);
    }

    // UPDATE JOB
    @PutMapping("/update/{id}")
    public Responsestructure<Jobresponsedto> updateJob(
            @PathVariable int id,
            @Valid @RequestBody Jobrequestdto jobRequest) {

        return jobService.updateJob(id, jobRequest);
    }

    // DELETE JOB
    @DeleteMapping("/{id}")
    public Responsestructure<String> deleteJob(
            @PathVariable int id) {

        return jobService.deleteJob(id);
    }

    // APPLY FOR JOB
    @PostMapping("/apply")
    public ResponseEntity<Responsestructure<JobApplicationresponsedto>> applyForJob(
            @Valid @RequestBody JobApplicationrequestdto request) {

        Responsestructure<JobApplicationresponsedto> response =
                jobApplicationService.applyForJob(request);

        if (response.getStatuscode() == 400) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(response);
        }

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // GET ALL JOB APPLICATIONS
    @GetMapping("/applications")
    public Responsestructure<List<JobApplicationresponsedto>> getAllApplications() {

        return jobApplicationService.getAllApplications();
    }

    // UPDATE APPLICATION STATUS
    @PutMapping("/application/status/{id}")
    public Responsestructure<JobApplicationresponsedto> updateApplicationStatus(
            @PathVariable int id,
            @Valid @RequestBody JobApplicationStatusrequestdto request) {

        return jobApplicationService.updateApplicationStatus(id, request);
    }

    // GET APPLICATION BY ID
    @GetMapping("/application/{id}")
    public Responsestructure<JobApplicationresponsedto> getApplicationById(
            @PathVariable int id) {

        return jobApplicationService.getApplicationById(id);
    }

    // DELETE JOB APPLICATION
    @DeleteMapping("/application/{id}")
    public Responsestructure<String> deleteApplication(
            @PathVariable int id) {

        return jobApplicationService.deleteApplication(id);
    }
}
