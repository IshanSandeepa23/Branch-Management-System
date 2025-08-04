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
public class Branch {

    @Id
    private String branchid;

    private String branch_name;
    private String branch_location;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate created_date;
    private String branch_status;

}