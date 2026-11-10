
package com.alpha.JobTracker.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alpha.JobTracker.entity.Job;
import com.alpha.JobTracker.exception.JobNotFoundException;
import com.alpha.JobTracker.repository.JobApplicationRepository;
import com.alpha.JobTracker.repository.JobRepository;
import com.alpha.JobTracker.requestdto.Jobrequestdto;
import com.alpha.JobTracker.responsedto.Jobresponsedto;
import com.alpha.JobTracker.responsedto.Responsestructure;

import jakarta.transaction.Transactional;

@Service
public class JobService {

	@Autowired
	private JobRepository jobRepository;
	@Autowired
	private JobApplicationRepository jobApplicationRepository;

	// ADD JOB
	public Responsestructure<Jobresponsedto> addJob(Jobrequestdto jobRequest) {

		Job job = new Job();

		job.setTitle(jobRequest.getTitle());
		job.setCompany(jobRequest.getCompany());
		job.setLocation(jobRequest.getLocation());
		job.setJobType(jobRequest.getJobType());
		job.setSalary(jobRequest.getSalary());
		job.setDescription(jobRequest.getDescription());
		job.setSkills(jobRequest.getSkills());

		Job savedJob = jobRepository.save(job);

		Jobresponsedto dto = new Jobresponsedto();

		dto.setId(savedJob.getId());
		dto.setTitle(savedJob.getTitle());
		dto.setCompany(savedJob.getCompany());
		dto.setLocation(savedJob.getLocation());
		dto.setJobType(savedJob.getJobType());
		dto.setSalary(savedJob.getSalary());
		dto.setDescription(savedJob.getDescription());
		dto.setSkills(savedJob.getSkills());

		Responsestructure<Jobresponsedto> response = new Responsestructure<>();

		response.setStatuscode(201);
		response.setMessagecode("Job added successfully");
		response.setData(dto);

		return response;
	}

	// GET ALL JOBS
	public Responsestructure<List<Jobresponsedto>> getAllJobs() {

		List<Job> jobs = jobRepository.findAll();

		List<Jobresponsedto> responseList = new ArrayList<>();

		for (Job job : jobs) {

			Jobresponsedto dto = new Jobresponsedto();

			dto.setId(job.getId());
			dto.setTitle(job.getTitle());
			dto.setCompany(job.getCompany());
			dto.setLocation(job.getLocation());
			dto.setJobType(job.getJobType());
			dto.setSalary(job.getSalary());
			dto.setDescription(job.getDescription());
			dto.setSkills(job.getSkills());

			responseList.add(dto);
		}

		Responsestructure<List<Jobresponsedto>> response = new Responsestructure<>();

		response.setStatuscode(200);
		response.setMessagecode("Jobs retrieved successfully");
		response.setData(responseList);

		return response;
	}

	// GET JOB BY ID
	public Responsestructure<Jobresponsedto> getJobById(int id) {

		Job job = jobRepository.findById(id)
				.orElseThrow(() -> new JobNotFoundException("Job not found with ID: " + id));

		Jobresponsedto dto = new Jobresponsedto();

		dto.setId(job.getId());
		dto.setTitle(job.getTitle());
		dto.setCompany(job.getCompany());
		dto.setLocation(job.getLocation());
		dto.setJobType(job.getJobType());
		dto.setSalary(job.getSalary());
		dto.setDescription(job.getDescription());
		dto.setSkills(job.getSkills());

		Responsestructure<Jobresponsedto> response = new Responsestructure<>();

		response.setStatuscode(200);
		response.setMessagecode("Job found successfully");
		response.setData(dto);

		return response;
	}
	// UPDATE JOB
	public Responsestructure<Jobresponsedto> updateJob(
	        int id, Jobrequestdto jobRequest) {

	    Job job = jobRepository.findById(id)
	            .orElseThrow(() -> new JobNotFoundException(
	                    "Job not found with ID: " + id));

	    job.setTitle(jobRequest.getTitle());
	    job.setCompany(jobRequest.getCompany());
	    job.setLocation(jobRequest.getLocation());
	    job.setJobType(jobRequest.getJobType());
	    job.setSalary(jobRequest.getSalary());
	    job.setDescription(jobRequest.getDescription());
	    job.setSkills(jobRequest.getSkills());

	    Job updatedJob = jobRepository.save(job);

	    Jobresponsedto dto = new Jobresponsedto();

	    dto.setId(updatedJob.getId());
	    dto.setTitle(updatedJob.getTitle());
	    dto.setCompany(updatedJob.getCompany());
	    dto.setLocation(updatedJob.getLocation());
	    dto.setJobType(updatedJob.getJobType());
	    dto.setSalary(updatedJob.getSalary());
	    dto.setDescription(updatedJob.getDescription());
	    dto.setSkills(updatedJob.getSkills());

	    Responsestructure<Jobresponsedto> response = new Responsestructure<>();

	    response.setStatuscode(200);
	    response.setMessagecode("Job updated successfully");
	    response.setData(dto);

	    return response;
	}
	// DELETE JOB
	// DELETE JOB
	@Transactional
	public Responsestructure<String> deleteJob(int id) {

	    Job job = jobRepository.findById(id)
	            .orElseThrow(() -> new JobNotFoundException(
	                    "Job not found with ID: " + id));

	    // Check whether applications exist for this job
	    boolean hasApplications =
	            jobApplicationRepository.existsById(id);

	    Responsestructure<String> response = new Responsestructure<>();

	    if (hasApplications) {
	        response.setStatuscode(400);
	        response.setMessagecode(
	                "Cannot delete this job because applications are associated with it."
	        );
	        response.setData(null);

	        return response;
	    }

	    jobRepository.delete(job);

	    response.setStatuscode(200);
	    response.setMessagecode("Job deleted successfully");
	    response.setData("Deleted job ID: " + id);

	    return response;
	}
}
