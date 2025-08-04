package com.example.demo.controller;

import com.example.demo.model.Branch;
import com.example.demo.service.BranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/branches")
@CrossOrigin("http://localhost:3000/")
public class BranchController {

    @Autowired
    private BranchService service;

    @GetMapping("/getBranches")
    public List<Branch> getAllBranches(){
        return service.getAllBranches();
    }

    @GetMapping("/getBranch/{branchid}")
    public Branch getBranch(@PathVariable String branchid){
        return service.getBranchByID(branchid);
    }

    @PostMapping("/saveBranch")
    public Branch createBranch(@RequestBody Branch branch) {
        return service.createBranch(branch);
    }

    @PutMapping("/updateBranch/{branchid}")
    public Branch updateBranch(@RequestBody Branch branch){
        return service.updateBranch(branch);
    }

    @DeleteMapping("/deleteBranch")
    public boolean deleteBranch(@RequestBody Branch branch){
       return service.deleteBranch(branch);
    }
}