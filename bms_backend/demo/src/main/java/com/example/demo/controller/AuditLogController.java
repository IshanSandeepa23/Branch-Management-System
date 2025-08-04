package com.example.demo.controller;

import com.example.demo.model.AuditLog;
import com.example.demo.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/audit")
@CrossOrigin("http://localhost:3000/")
public class AuditLogController {

    @Autowired
    private AuditLogService auditLogService;    @GetMapping("/logs")
    public ResponseEntity<Page<AuditLog>> getAllLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        return ResponseEntity.ok(auditLogService.getAllAuditLogs(
            PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "timestamp"))
        ));
    }

    @GetMapping("/{entityType}")
    public ResponseEntity<Page<AuditLog>> getAuditLogs(
            @PathVariable String entityType,
            @RequestParam(required = false) String entityId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        return ResponseEntity.ok(auditLogService.getAuditLogs(
            entityType,
            entityId,
            PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "timestamp"))
        ));
    }
}
