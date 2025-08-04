package com.example.demo.repository;

import com.example.demo.model.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BranchRepository extends JpaRepository<Branch, String> {
    @Query(value = "SELECT * FROM Branch WHERE branchid = ?1", nativeQuery = true)
    Branch getBranchByID(String branchid);
}