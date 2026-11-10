package com.alpha.JobTracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.alpha.JobTracker.entity.Job;

public interface JobRepository extends JpaRepository<Job, Integer> {

}