---
slug: deepseek-cli
title:
  zh: DeepSeek CLI
  en: DeepSeek CLI
summary:
  zh: 一个支持多轮对话、历史管理与管道输入的 Rust CLI。
  en: A Rust command-line client with multi-turn conversations, history management, and piped input.
problem:
  zh: 在终端调用模型时，单轮请求、连续对话与本地历史，应该落在一套轻量、可组合的工作流里。
  en: Using a model from the terminal should support one-off prompts, ongoing conversations, and local history without becoming a heavyweight workflow.
work:
  zh: 基于 Tokio、clap 与 Reqwest，实现无记忆、新会话和续接会话三种模式，并将历史保存在本地配置目录。
  en: Used Tokio, clap, and reqwest to implement stateless, new-session, and resume-session modes, with conversation history stored in the local configuration directory.
outcome:
  zh: 完成可由命令参数或 Unix 管道调用的 CLI 原型，支持本地 API 配置与对话恢复。
  en: Built a CLI prototype that accepts command-line arguments or Unix pipes, with local API configuration and support for resuming previous conversations.
date: "2025"
role:
  zh: 个人项目
  en: Personal project
stack: [Rust, Tokio, clap, reqwest]
featured: false
---
