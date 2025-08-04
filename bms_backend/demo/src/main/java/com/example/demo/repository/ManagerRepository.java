package com.example.demo.repository;

import com.example.demo.model.Manager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ManagerRepository extends JpaRepository<Manager, String> {

    @Query(value = "SELECT * FROM manager WHERE managerid = ?1",nativeQuery = true)
    Manager getManagerByID(String managerid);
}
