package com.example.mdsback.controllers;

import com.example.mdsback.DTOs.SampleDTO;
import com.example.mdsback.models.Sample;
import com.example.mdsback.repositories.SampleRepository;
import com.example.mdsback.services.SampleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/samples")
public class SampleController {
    @Autowired
    private SampleRepository sampleRepo;

    @Autowired
    private SampleService sampleService;

    @GetMapping("/{id}")
    public SampleDTO findById(@PathVariable Long id) {
        Sample sample = sampleService.findById(id);
        return new SampleDTO(sample);
    }

    @GetMapping
    public List<SampleDTO> findAll() {
        return sampleRepo.findAll()
                .stream()
                .map(SampleDTO::new)
                .collect(Collectors.toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Sample create(@RequestBody Sample sample) {
        return sampleRepo.save(sample);
    }

    @PutMapping("/like/{id}")
    public SampleDTO likeSample(@PathVariable Long id) {
        Sample sample = sampleService.findById(id);
        sampleService.incrementLikes(sample);
        return new SampleDTO(sampleRepo.save(sample));
    }
}
