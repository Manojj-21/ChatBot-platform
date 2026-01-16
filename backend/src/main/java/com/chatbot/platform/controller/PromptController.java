package com.chatbot.platform.controller;

import com.chatbot.platform.entity.Prompt;
import com.chatbot.platform.service.PromptService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prompts")
public class PromptController {
    private final PromptService promptService;

    public PromptController(PromptService promptService) {
        this.promptService = promptService;
    }

    @PostMapping
    public ResponseEntity<Prompt> createPrompt(@RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(promptService.createPrompt(
            Long.parseLong(request.get("projectId").toString()),
            request.get("content").toString()
        ));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Prompt>> getProjectPrompts(@PathVariable Long projectId) {
        return ResponseEntity.ok(promptService.getProjectPrompts(projectId));
    }
}
