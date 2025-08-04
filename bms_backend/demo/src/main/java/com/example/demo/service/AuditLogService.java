package com.example.demo.service;

import com.example.demo.model.AuditLog;
import com.example.demo.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository repository;

    public void logEvent(String entityType, String entityId, String action, String details) {
        AuditLog log = new AuditLog();
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setAction(action);
        log.setDetails(details);
        log.setTimestamp(LocalDateTime.now());
        
        log.setPerformedBy("system");
        repository.save(log);
    }

    public Page<AuditLog> getAuditLogs(String entityType, String entityId, Pageable pageable) {
        if (entityId != null) {
            return repository.findByEntityTypeAndEntityId(entityType, entityId, pageable);
        }
        return repository.findByEntityType(entityType, pageable);
    }

    public Page<AuditLog> getAllAuditLogs(Pageable pageable) {
        return repository.findAll(pageable);
    }
}
