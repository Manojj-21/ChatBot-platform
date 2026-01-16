package com.chatbot.platform.dto;

import lombok.Data;

@Data
public class ChatRequest {
    private String message;
    private Long projectId;
}
