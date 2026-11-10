package com.alpha.JobTracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.alpha.JobTracker.entity.Candidate;

public interface CandidateRepository extends JpaRepository<Candidate, Integer> {

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, int id);

    // Search candidate by name
    List<Candidate> findByNameContainingIgnoreCase(String name);

    // Search candidate by email
    List<Candidate> findByEmailContainingIgnoreCase(String email);

}