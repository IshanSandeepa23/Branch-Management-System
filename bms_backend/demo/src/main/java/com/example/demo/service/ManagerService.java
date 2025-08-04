package com.example.demo.service;

import com.example.demo.model.Manager;
import com.example.demo.repository.ManagerRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class ManagerService {

    @Autowired
    private ManagerRepository repository;
    @Autowired
    private ModelMapper modelMapper;

    public List<Manager> getAllManagers(){
        List<Manager>managerList = repository.findAll();
        return modelMapper.map(managerList, new TypeToken<List<Manager>>(){}.getType());
    }
    public Manager getManagerByID(String managerid){
        Manager manager = repository.getManagerByID(managerid);
        return modelMapper.map(manager,Manager.class);
    }

    public Manager createManager(Manager manager){
        repository.save(modelMapper.map(manager,Manager.class));
        return manager;
    }

    public Manager updateManager(Manager manager){
        repository.save(modelMapper.map(manager,Manager.class));
        return manager;
    }

    public boolean deleteManager(Manager manager){
        repository.delete(modelMapper.map(manager,Manager.class));
        return true;
    }
}
