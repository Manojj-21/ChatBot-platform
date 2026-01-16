package com.chatbot.platform.controller;

import com.chatbot.platform.entity.Project;
import com.chatbot.platform.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Map<String, String> request, 
                                                 Authentication auth) {
        return ResponseEntity.ok(projectService.createProject(
            request.get("name"), 
            request.get("description"), 
            auth.getName()
        ));
    }

    @GetMapping
    public ResponseEntity<List<Project>> getProjects(Authentication auth) {
        return ResponseEntity.ok(projectService.getUserProjects(auth.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProject(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProject(id));
    }
}
