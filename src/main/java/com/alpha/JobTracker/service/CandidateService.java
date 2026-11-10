
package com.alpha.JobTracker.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alpha.JobTracker.entity.Candidate;
import com.alpha.JobTracker.exception.CandidateNotFoundException;
import com.alpha.JobTracker.exception.DuplicateEmailException;
import com.alpha.JobTracker.repository.CandidateRepository;
import com.alpha.JobTracker.repository.JobApplicationRepository;
import com.alpha.JobTracker.requestdto.Candidaterequestdto;
import com.alpha.JobTracker.responsedto.Candidateresponsedto;
import com.alpha.JobTracker.responsedto.Responsestructure;

@Service
public class CandidateService {

    @Autowired
    private CandidateRepository candidateRepository;
    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    // REGISTER CANDIDATE
    public Responsestructure<Candidateresponsedto> candidateRegister(
            Candidaterequestdto candidateRequest) {

        // Check for duplicate email
        if (candidateRepository.existsByEmail(candidateRequest.getEmail())) {
            throw new DuplicateEmailException(
                    "Email already registered: " + candidateRequest.getEmail());
        }

        Candidate candidate = new Candidate();

        candidate.setName(candidateRequest.getName());
        candidate.setEmail(candidateRequest.getEmail());
        candidate.setPhone(candidateRequest.getPhone());
        candidate.setSkills(candidateRequest.getSkills());

        Candidate savedCandidate = candidateRepository.save(candidate);

        Candidateresponsedto candidateResponse = new Candidateresponsedto();

        candidateResponse.setId(savedCandidate.getId());
        candidateResponse.setName(savedCandidate.getName());
        candidateResponse.setEmail(savedCandidate.getEmail());

        Responsestructure<Candidateresponsedto> response = new Responsestructure<>();

        response.setStatuscode(201);
        response.setMessagecode("Candidate registered successfully");
        response.setData(candidateResponse);

        return response;
    }

    // GET ALL CANDIDATES
    public Responsestructure<List<Candidateresponsedto>> getAllCandidates() {

        List<Candidate> candidates = candidateRepository.findAll();

        List<Candidateresponsedto> responseList = new ArrayList<>();

        for (Candidate candidate : candidates) {

            Candidateresponsedto dto = new Candidateresponsedto();

            dto.setId(candidate.getId());
            dto.setName(candidate.getName());
            dto.setEmail(candidate.getEmail());

            responseList.add(dto);
        }

        Responsestructure<List<Candidateresponsedto>> response = new Responsestructure<>();

        response.setStatuscode(200);
        response.setMessagecode("Candidates retrieved successfully");
        response.setData(responseList);

        return response;
    }

    // GET CANDIDATE BY ID
    public Responsestructure<Candidateresponsedto> getCandidateById(int id) {

        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new CandidateNotFoundException(
                        "Candidate not found with ID: " + id));

        Candidateresponsedto dto = new Candidateresponsedto();

        dto.setId(candidate.getId());
        dto.setName(candidate.getName());
        dto.setEmail(candidate.getEmail());

        Responsestructure<Candidateresponsedto> response = new Responsestructure<>();

        response.setStatuscode(200);
        response.setMessagecode("Candidate found successfully");
        response.setData(dto);

        return response;
    }

    // UPDATE CANDIDATE
    public Responsestructure<Candidateresponsedto> updateCandidate(
            int id, Candidaterequestdto candidateRequest) {

        // Check whether another candidate already uses this email
        if (candidateRepository.existsByEmailAndIdNot(
                candidateRequest.getEmail(), id)) {

            throw new DuplicateEmailException(
                    "Email already registered: " + candidateRequest.getEmail());
        }

        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new CandidateNotFoundException(
                        "Candidate not found with ID: " + id));

        candidate.setName(candidateRequest.getName());
        candidate.setEmail(candidateRequest.getEmail());
        candidate.setPhone(candidateRequest.getPhone());
        candidate.setSkills(candidateRequest.getSkills());

        Candidate updatedCandidate = candidateRepository.save(candidate);

        Candidateresponsedto dto = new Candidateresponsedto();

        dto.setId(updatedCandidate.getId());
        dto.setName(updatedCandidate.getName());
        dto.setEmail(updatedCandidate.getEmail());

        Responsestructure<Candidateresponsedto> response = new Responsestructure<>();

        response.setStatuscode(200);
        response.setMessagecode("Candidate updated successfully");
        response.setData(dto);

        return response;
    }

 // SEARCH CANDIDATE BY NAME
    public Responsestructure<List<Candidateresponsedto>> searchCandidateByName(String name) {

        List<Candidate> candidates =
                candidateRepository.findByNameContainingIgnoreCase(name);

        List<Candidateresponsedto> responseList = new ArrayList<>();

        for (Candidate candidate : candidates) {

            Candidateresponsedto dto = new Candidateresponsedto();

            dto.setId(candidate.getId());
            dto.setName(candidate.getName());
            dto.setEmail(candidate.getEmail());

            responseList.add(dto);
        }

        Responsestructure<List<Candidateresponsedto>> response =
                new Responsestructure<>();

        response.setStatuscode(200);
        response.setMessagecode("Candidates found successfully");
        response.setData(responseList);

        return response;
    }
 // SEARCH CANDIDATE BY EMAIL
    public Responsestructure<List<Candidateresponsedto>> searchCandidateByEmail(String email) {

        List<Candidate> candidates =
                candidateRepository.findByEmailContainingIgnoreCase(email);

        List<Candidateresponsedto> responseList = new ArrayList<>();

        for (Candidate candidate : candidates) {

            Candidateresponsedto dto = new Candidateresponsedto();

            dto.setId(candidate.getId());
            dto.setName(candidate.getName());
            dto.setEmail(candidate.getEmail());

            responseList.add(dto);
        }

        Responsestructure<List<Candidateresponsedto>> response =
                new Responsestructure<>();

        response.setStatuscode(200);
        response.setMessagecode("Candidates found successfully");
        response.setData(responseList);

        return response;
    }

 // DELETE CANDIDATE
 public Responsestructure<String> deleteCandidate(int id) {

     Candidate candidate = candidateRepository.findById(id)
             .orElseThrow(() -> new CandidateNotFoundException(
                     "Candidate not found with ID: " + id));

     // Check whether the candidate has job applications
     if (jobApplicationRepository.existsByCandidate_Id(id)) {

         Responsestructure<String> response = new Responsestructure<>();

         response.setStatuscode(400);
         response.setMessagecode(
                 "Cannot delete this candidate because job applications are associated with them.");
         response.setData(null);

         return response;
     }

     candidateRepository.delete(candidate);

     Responsestructure<String> response = new Responsestructure<>();

     response.setStatuscode(200);
     response.setMessagecode("Candidate deleted successfully");
     response.setData("Deleted candidate ID: " + id);

     return response;
 }

}
