package com.example.demo.service;

import com.example.demo.model.Branch;
import com.example.demo.repository.BranchRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class BranchService {

    @Autowired
    private BranchRepository repository;
    @Autowired
    private ModelMapper modelMapper;

    public List<Branch> getAllBranches() {
        return repository.findAll();
    }

    public Branch getBranchByID(String branchid){
        Branch branch = repository.getBranchByID(branchid);
        return modelMapper.map(branch, Branch.class);
    }

    public Branch createBranch(Branch branch){
       repository.save(modelMapper.map(branch,Branch.class));
       return branch;
    }

    public Branch updateBranch(Branch branch){
        repository.save(modelMapper.map(branch,Branch.class));
        return branch;
    }

    public boolean deleteBranch(Branch branch){
        repository.delete(modelMapper.map(branch,Branch.class));
        return true;
    }
}