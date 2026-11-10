
package com.alpha.JobTracker.controoler;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alpha.JobTracker.responsedto.Candidateresponsedto;

@RestController
public class TrailController {

    @RequestMapping("/name")
    public String name() {
        return "Umesh Nemalikonda";
    }

    @GetMapping("/hi")
    public void hello() {
        System.out.println("Hello guys...");
    }

    @PostMapping("/num")
    public int number() {
        return 300;
    }

    @PostMapping("/path")
    public void map(@RequestParam int id, @RequestParam String name) {
        System.out.println("pathvariables....");
        System.out.println("ID: " + id);
        System.out.println("Name: " + name);
    }

    @GetMapping("/new/{id}/{name}")
    public void ne(@PathVariable int id, @PathVariable String name) {
        System.out.println("ID: " + id);
        System.out.println("NAME: " + name);
    }

    @PostMapping("/body")
    public void body(@RequestBody Candidateresponsedto candidate) {
        System.out.println("Converted");
        System.out.println("ID: " + candidate.getId());
        System.out.println("NAME: " + candidate.getName());
        System.out.println("EMAIL: " + candidate.getEmail());
    }

    @GetMapping("/header")
    public void header(@RequestHeader("user-Agent") String userAgent) {
        System.out.println("UserAgent: " + userAgent);
    }
}
