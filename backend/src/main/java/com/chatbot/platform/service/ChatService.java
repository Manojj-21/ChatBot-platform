package com.chatbot.platform.service;

import com.chatbot.platform.entity.ChatMessage;
import com.chatbot.platform.entity.Project;
import com.chatbot.platform.entity.Prompt;
import com.chatbot.platform.repository.ChatMessageRepository;
import com.chatbot.platform.repository.ProjectRepository;
import com.chatbot.platform.repository.PromptRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatService {
    private final ChatMessageRepository chatMessageRepository;
    private final ProjectRepository projectRepository;
    private final PromptRepository promptRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${openrouter.api.key}")
    private String apiKey;

    @Value("${openrouter.api.url}")
    private String apiUrl;

    public ChatService(ChatMessageRepository chatMessageRepository, 
                      ProjectRepository projectRepository,
                      PromptRepository promptRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.projectRepository = projectRepository;
        this.promptRepository = promptRepository;
    }

    public String chat(Long projectId, String userMessage) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Save user message
        ChatMessage userMsg = new ChatMessage();
        userMsg.setProject(project);
        userMsg.setRole("user");
        userMsg.setContent(userMessage);
        chatMessageRepository.save(userMsg);

        // Get conversation history
        List<ChatMessage> history = chatMessageRepository.findByProjectIdOrderByCreatedAtAsc(projectId);
        
        // Get project prompts
        List<Prompt> prompts = promptRepository.findByProjectId(projectId);
        String systemPrompt = prompts.isEmpty() ? "You are a helpful assistant." 
                : prompts.stream().map(Prompt::getContent).collect(Collectors.joining("\n"));

        // Call OpenRouter API
        String response = callOpenRouter(systemPrompt, history);

        // Save assistant response
        ChatMessage assistantMsg = new ChatMessage();
        assistantMsg.setProject(project);
        assistantMsg.setRole("assistant");
        assistantMsg.setContent(response);
        chatMessageRepository.save(assistantMsg);

        return response;
    }

    private String callOpenRouter(String systemPrompt, List<ChatMessage> history) {
        if (apiKey == null || apiKey.isEmpty()) {
            return "OpenRouter API key not configured. Please set your API key in application.properties.";
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);
        headers.set("HTTP-Referer", "http://localhost:3000");
        headers.set("X-Title", "Chatbot Platform");

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));
        
        for (ChatMessage msg : history) {
            messages.add(Map.of("role", msg.getRole(), "content", msg.getContent()));
        }

        Map<String, Object> requestBody = Map.of(
            "model", "openai/gpt-3.5-turbo",
            "messages", messages
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                apiUrl + "/chat/completions",
                HttpMethod.POST,
                request,
                Map.class
            );

            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) body.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    return (String) message.get("content");
                }
            }
        } catch (Exception e) {
            return "Error calling OpenRouter API: " + e.getMessage();
        }

        return "No response from AI";
    }

    public List<ChatMessage> getChatHistory(Long projectId) {
        return chatMessageRepository.findByProjectIdOrderByCreatedAtAsc(projectId);
    }
}
