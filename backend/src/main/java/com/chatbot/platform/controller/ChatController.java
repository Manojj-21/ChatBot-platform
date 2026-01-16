package com.chatbot.platform.controller;

import com.chatbot.platform.dto.ChatRequest;
import com.chatbot.platform.dto.ChatResponse;
import com.chatbot.platform.entity.ChatMessage;
import com.chatbot.platform.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        String response = chatService.chat(request.getProjectId(), request.getMessage());
        return ResponseEntity.ok(new ChatResponse(response));
    }

    @GetMapping("/history/{projectId}")
    public ResponseEntity<List<ChatMessage>> getChatHistory(@PathVariable Long projectId) {
        return ResponseEntity.ok(chatService.getChatHistory(projectId));
    }
}
