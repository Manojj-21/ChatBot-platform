package com.chatbot.platform.service;

import com.chatbot.platform.entity.Project;
import com.chatbot.platform.entity.Prompt;
import com.chatbot.platform.repository.ProjectRepository;
import com.chatbot.platform.repository.PromptRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PromptService {
    private final PromptRepository promptRepository;
    private final ProjectRepository projectRepository;

    public PromptService(PromptRepository promptRepository, ProjectRepository projectRepository) {
        this.promptRepository = promptRepository;
        this.projectRepository = projectRepository;
    }

    public Prompt createPrompt(Long projectId, String content) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Prompt prompt = new Prompt();
        prompt.setContent(content);
        prompt.setProject(project);
        return promptRepository.save(prompt);
    }

    public List<Prompt> getProjectPrompts(Long projectId) {
        return promptRepository.findByProjectId(projectId);
    }
}
