
package com.alpha.JobTracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.alpha.JobTracker.entity.JobApplication;

public interface JobApplicationRepository
        extends JpaRepository<JobApplication, Integer> {

    boolean existsByJob_Id(int id);

    boolean existsByCandidate_Id(int candidateId);

    boolean existsByCandidate_IdAndJob_Id(
            int candidateId, int jobId);
}
