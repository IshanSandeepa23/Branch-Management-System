package com.example.demo.controller;

import com.example.demo.model.Employee;
import com.example.demo.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/getEmployees")
    public List<Employee> getAllEmployees(){
        return employeeService.getAllEmployees();
    }

    @GetMapping("/getEmployee/{employeeid}")
    public Employee getEmployeeByID(@PathVariable String employeeid){
        return employeeService.getEmployeeByID(employeeid);
    }

    @PostMapping("/createEmployee")
    public Employee createBranch(@RequestBody Employee employee) {
        return employeeService.createEmployee(employee);
    }

    @PutMapping("/updateEmployee/{employeeid}")
    public Employee updateEmployee(@RequestBody Employee employee){
        return employeeService.updateEmployee(employee);
    }

    @DeleteMapping("/deleteEmployee/{employeeid}")
    public boolean deleteEmployee(@RequestBody Employee employee){
        return employeeService.deleteEmployee(employee);
    }
}