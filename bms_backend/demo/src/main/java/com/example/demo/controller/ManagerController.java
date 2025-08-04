package com.example.demo.controller;

import com.example.demo.model.Manager;
import com.example.demo.service.ManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/managers")
@CrossOrigin
public class ManagerController {

    @Autowired
    private ManagerService managerService;

    @GetMapping("/getManagers")
    public List<Manager> getAllManagers(){
        return managerService.getAllManagers();
    }

    @GetMapping("/getManager/{managerid}")
    public Manager getManagerByID(@PathVariable String managerid){
        return managerService.getManagerByID(managerid);
    }

    @PostMapping("/createManager")
    public Manager createBranch(@RequestBody Manager manager) {
        return managerService.createManager(manager);
    }

    @PutMapping("/updateManager/{managerid}")
    public Manager updateManager(@RequestBody Manager manager){
        return managerService.updateManager(manager);
    }

    @DeleteMapping("/deleteManager/{managerid}")
    public boolean deleteManager(@RequestBody Manager manager){
        return managerService.deleteManager(manager);
    }
}
