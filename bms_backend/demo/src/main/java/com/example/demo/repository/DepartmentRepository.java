package com.example.demo.repository;

import com.example.demo.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DepartmentRepository extends JpaRepository<Department, String> {
    @Query(value = "SELECT * FROM department WHERE departmentid = ?1", nativeQuery = true)
    Department getDepartmentByID(String departmentid);
}