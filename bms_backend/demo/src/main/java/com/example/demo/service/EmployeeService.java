package com.example.demo.service;

import com.example.demo.model.Employee;
import com.example.demo.repository.EmployeeRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class EmployeeService {

    @Autowired
    private EmployeeRepository repository;
    @Autowired
    private ModelMapper modelMapper;

    public List<Employee> getAllEmployees(){
        List<Employee>employeeList = repository.findAll();
        return modelMapper.map(employeeList, new TypeToken<List<Employee>>(){}.getType());
    }
    public Employee getEmployeeByID(String employeeid){
        Employee employee = repository.getEmployeeByID(employeeid);
        return modelMapper.map(employee,Employee.class);
    }

    public Employee createEmployee(Employee employee){
        repository.save(modelMapper.map(employee,Employee.class));
        return employee;
    }

    public Employee updateEmployee(Employee employee){
        repository.save(modelMapper.map(employee,Employee.class));
        return employee;
    }

    public boolean deleteEmployee(Employee employee){
        repository.delete(modelMapper.map(employee,Employee.class));
        return true;
    }
}