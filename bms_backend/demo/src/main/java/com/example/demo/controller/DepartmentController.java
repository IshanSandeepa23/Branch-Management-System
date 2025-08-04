package com.example.demo.controller;

import com.example.demo.model.Department;
import com.example.demo.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/department")
@CrossOrigin
public class DepartmentController {

    @Autowired
    private DepartmentService service;

    @GetMapping("/getDepartments")
    public List<Department> getDepartments(){
         return service.getAllDepartments();
    }

    @GetMapping("/getDepartment/{departmentid}")
    public Department getDepartmentById(@PathVariable String departmentid){
        return service.getDepartmentByID(departmentid);
    }

    @PostMapping("/createDepartment")
    public Department createDepartment(@RequestBody Department department){
        return service.createDepartment(department);
    }

    @PutMapping("/updateDepartment/{departmentid}")
    public Department updateDepartment(@RequestBody Department department){
        return service.updateDepartment(department);
    }

    @DeleteMapping("/deleteDepartment/{departmentid}")
    public boolean deleteDepartment(@RequestBody Department department){
        return service.deleteDepartment(department);
    }
}