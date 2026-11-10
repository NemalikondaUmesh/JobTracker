
package com.alpha.JobTracker.controoler;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alpha.JobTracker.requestdto.Candidaterequestdto;
import com.alpha.JobTracker.responsedto.Candidateresponsedto;
import com.alpha.JobTracker.responsedto.Responsestructure;
import com.alpha.JobTracker.service.CandidateService;

import jakarta.validation.Valid;

@RestController
public class CandidateController {

    @Autowired
    private CandidateService candidateservice;

    // REGISTER CANDIDATE
    @PostMapping("/candidate/register")
    public Responsestructure<Candidateresponsedto> candidateRegister(
            @Valid @RequestBody Candidaterequestdto candidateRequest) {

        return candidateservice.candidateRegister(candidateRequest);
    }

    // GET ALL CANDIDATES
    @GetMapping("/candidate/all")
    public Responsestructure<List<Candidateresponsedto>> getAllCandidates() {

        return candidateservice.getAllCandidates();
    }

    // GET CANDIDATE BY ID
    @GetMapping("/candidate/{id}")
    public Responsestructure<Candidateresponsedto> getCandidateById(
            @PathVariable int id) {

        return candidateservice.getCandidateById(id);
    }

    // UPDATE CANDIDATE
    @PutMapping("/candidate/update/{id}")
    public Responsestructure<Candidateresponsedto> updateCandidate(
            @PathVariable int id,
            @Valid @RequestBody Candidaterequestdto candidateRequest) {

        return candidateservice.updateCandidate(id, candidateRequest);
    }

    // DELETE CANDIDATE
    @DeleteMapping("/candidate/{id}")
    public Responsestructure<String> deleteCandidate(
            @PathVariable int id) {

        return candidateservice.deleteCandidate(id);
    }

    // SEARCH CANDIDATE BY NAME
    @GetMapping("/candidate/search")
    public Responsestructure<List<Candidateresponsedto>> searchCandidateByName(
            @RequestParam String name) {

        return candidateservice.searchCandidateByName(name);
    }

    // SEARCH CANDIDATE BY EMAIL
    @GetMapping("/candidate/search/email")
    public Responsestructure<List<Candidateresponsedto>> searchCandidateByEmail(
            @RequestParam String email) {

        return candidateservice.searchCandidateByEmail(email);
    }
}
