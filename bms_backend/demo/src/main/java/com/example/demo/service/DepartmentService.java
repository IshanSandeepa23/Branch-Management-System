package com.example.demo.service;

import com.example.demo.model.Department;
import com.example.demo.repository.DepartmentRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class DepartmentService {

    @Autowired
    private DepartmentRepository repository;
    @Autowired
    private ModelMapper modelMapper;

    public List<Department> getAllDepartments(){
        List<Department>departmentList = repository.findAll();
        return modelMapper.map(departmentList,new TypeToken<List<Department>>(){}.getType());
    }

    public Department getDepartmentByID(String departmentid){
        Department department = repository.getDepartmentByID(departmentid);
        return modelMapper.map(department,Department.class);
    }

    public Department createDepartment(Department department){
        repository.save(modelMapper.map(department,Department.class));
        return department;
    }

    public Department updateDepartment(Department department){
        repository.save(modelMapper.map(department,Department.class));
        return department;
    }

    public boolean deleteDepartment(Department department){
        repository.delete(modelMapper.map(department,Department.class));
        return true;
    }
}