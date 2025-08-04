package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Manager {

    @Id
    private String managerid;

    private String name;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate assigned_date;
}
