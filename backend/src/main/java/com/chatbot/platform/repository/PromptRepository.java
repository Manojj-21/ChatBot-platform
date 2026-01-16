package com.chatbot.platform.repository;

import com.chatbot.platform.entity.Prompt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PromptRepository extends JpaRepository<Prompt, Long> {
    List<Prompt> findByProjectId(Long projectId);
}
