---
slug: deepseek-cli
title:
  zh: DeepSeek CLI：终端里的流式会话
  en: "DeepSeek CLI: Streaming Conversations in the Terminal"
summary:
  zh: 我把 DeepSeek 的单次问答、多轮历史、System Prompt、R1 推理流和 stdin 管道整合成一个 Rust 命令行工具，并对当前实现做了独立边界审计。
  en: I combine one-shot prompts, local conversation history, system prompts, R1 reasoning streams, and Unix pipes in a Rust CLI, with an explicit audit of its current boundaries.
problem:
  zh: 代码、日志和 Git diff 本来就产生在 shell 中；如果每次都复制到网页聊天，再把回答粘贴回来，模型就无法自然嵌入现有终端工作流。
  en: Code, logs, and diffs already live in the shell; repeatedly copying them into a web chat breaks the natural command-line workflow.
work:
  zh: 我用 clap、Tokio 和 Reqwest 实现无记忆、新会话与续接会话三种模式，加入流式 delta、R1 reasoning 展示、时间戳 JSON 历史、配置文件与中英文本地化。
  en: I used clap, Tokio, and Reqwest for stateless, new, and resumed sessions, with streamed deltas, R1 reasoning display, timestamped JSON history, configuration, and localization.
outcome:
  zh: Release 构建成功并产出约 5.7 MiB arm64 二进制；核心调用链可用，但当前仓库没有自动化测试，SSE framing、历史安全和配置权限仍需要下一轮工程化。
  en: The release build produces a 5.7 MiB arm64 binary. The core path works, while SSE framing, history safety, configuration permissions, and automated tests remain next-step work.
date: "2025–2026"
role:
  zh: 个人项目 · Rust 实现与审计
  en: Personal project · Rust implementation and audit
status:
  zh: 可用原型 · 工程边界已审计
  en: Usable prototype · engineering boundaries audited
stack: [Rust, Tokio, Reqwest, clap, Serde, TOML, rust-i18n]
metrics:
  - value: "5.7 MiB"
    label: { zh: arm64 Release 二进制, en: arm64 release binary }
  - value: "3 modes"
    label: { zh: 无记忆/新建/续接, en: stateless/new/resume }
  - value: "0 tests"
    label: { zh: 当前仓库自动化测试, en: current repository tests }
featured: false
image: /project-media/deepseek-cli/deepseek-cli-terminal-light.png
imageDark: /project-media/deepseek-cli/deepseek-cli-terminal-dark.png
imageAlt:
  zh: 根据 DeepSeek CLI 真实帮助信息制作的浅色或深色终端视图
  en: Theme-aware terminal view built from the actual DeepSeek CLI help output
links:
  - label: { zh: GitHub 仓库, en: GitHub repository }
    url: https://github.com/allenge007/deepseek_commandline_tool
---

## 为什么不是另一个聊天页面

我做 DeepSeek CLI 的起点，是希望模型直接出现在代码、日志和命令输出产生的地方。Unix 管道已经提供了一套成熟的组合方式：前一个命令把文本送到 stdin，CLI 再附上一句任务说明，把回答以流的形式写回当前终端。

```bash
git diff | ag nomemory "Review this patch and list risks"
ag -v r1 new "Explain the borrow checker step by step"
ag continue "Turn the previous explanation into a checklist"
```

当前工具形成三种清晰语义：直接输入或 `nomemory` 做一次性任务；`new` 从空上下文开始并保存新会话；`continue` 读取最近历史、追加一轮，再写回新的时间戳文件。

Hero 图是依据真实 `--help` 与代码实际支持的 pipe/R1 命令绘制的终端视图，不是伪造的 API 回答。它会随本站主题在浅色和深色版本之间切换。

## 四个模块，一条完整调用链

| 模块 | 当前职责 |
| --- | --- |
| `main.rs` | clap 参数、stdin 合并、请求构建、HTTP 调用、SSE 输出和会话模式编排 |
| `config.rs` | `config.toml`、API Key 与默认 System Prompt |
| `history.rs` | 时间戳 JSON 历史、最近会话定位、加载/保存/删除 |
| `models.rs` | Chat message、请求体、tool call 与流式 delta 数据结构 |

一次请求会先解析 query、模型别名、温度和子命令；非 TTY stdin 会被完整读入并与 query 拼接；接着根据模式加载历史、注入默认 System Prompt，最后 POST 到固定的 DeepSeek Chat Completions 地址并逐块输出响应。记忆模式成功后，用户消息与助手结果会写入 `~/.config/deepseek/histories/YYYYMMDDHHMMSS.json`。

当前请求固定使用 `deepseek-chat` 或 `deepseek-reasoner`、`max_tokens=2048`、`stream=true` 和 `include_usage=true`。这也是兼容边界：项目还不是任意 OpenAI-compatible 网关客户端。

## 真实可执行文件，而不是 README 推测

独立隔离构建得到约 **5.7 MiB** 的 arm64 Release 二进制。真实帮助信息为：

```text
Usage: deepseek_cli [OPTIONS] [query] [COMMAND]

Commands:
  new         New conversation
  continue    Resume last conversation
  nomemory    Memoryless mode
  set_api     Set API Key
  set_prompt  Set System Prompt

Options:
  -v, --version <version>          Model version (r1 for deepseek-reasoner)
  -t, --temperature <temperature>  Temperature (default 1.0)
  -h, --help                       Print help
```

这次审计也找出了文档与二进制的差异：README 写了 `-V` 程序版本参数，但实际不存在；裸 `--version` 是模型别名参数并要求一个值。温度文档声称范围是 0–2，但解析器没有范围校验；除了精确的 `r1`，其余别名都会回退为 `deepseek-chat`。

`new` 的含义是“不加载旧历史”，不是清空整个 histories 目录；管道输入仍必须同时提供 query。这些细节会在下一轮同步回用户文档。

## 流式输出与 R1 reasoning

`process_stream()` 消费 Reqwest 的 `bytes_stream()`，解析 `data: ` 开头的 SSE delta。reasoner 模式先输出 `reasoning_content`，第一次收到普通 `content` 时再显示 answer 分隔；普通模型只打印最终内容。终端为 TTY 时会显示 spinner，首个数据块到达后停止。

独立审计在 `/tmp` 中增加了三个临时测试，复现出当前实现的关键边界：

1. **缺少跨 chunk 的 SSE 缓冲。** 一条 JSON event 如果正好被网络拆成两个 Bytes chunk，前半段反序列化失败，后半段又不再以 `data: ` 开头，整条 delta 会静默丢失。
2. **reasoning 与 answer 合并保存。** R1 的推理文字和最终回答会被拼成同一 assistant content；下一次 `continue` 会把推理过程当普通助手消息再次发送。
3. **历史目录没有过滤 JSON。** 名称最大的无关文件也可能被选为最近会话，并在成功续接后进入删除路径。

<div class="project-callout"><strong>下一轮首要修复</strong>把字节流升级成带残留缓冲的 SSE framing，把 reasoning 与 final answer 分开保存，并让历史索引只接受通过 schema 验证的 JSON 会话。</div>

## 配置与本地数据的安全边界

配置目前只有明文 `api_key` 与可选 `default_prompt`。实际复现中新建文件权限为 `644`，没有主动收紧到 `600`；`ag set_api key` 还会让 Key 出现在 shell history 和进程参数中。历史 JSON 同样可能包含源码、日志、个人信息和 System Prompt。

损坏 TOML 也需要更安全的失败行为：普通查询当前可能 panic；执行 `set_prompt` 时会退化到空 API Key 配置并覆盖原文件。配置写入应改成原子临时文件 + 权限收紧，并在解析失败时保留原件。

## 当前工程质量

`cargo build --release --locked` 与 `cargo test --locked` 都能完成，但后者运行的是 **0 个仓库测试**。`cargo fmt --check` 尚未通过；严格 Clippy 在原源码中报告约 15 条 lint，主要是冗余导入/匹配/借用和动态 `expect`。

这些结果不是为了否定一个能用的小工具，而是把“个人可用”到“可放心复用”的距离写清楚。下一阶段会先把审计测试正式纳入仓库，再处理 SSE、历史与配置安全，最后实现已经写好设计的 endpoint/model 解耦。

## 已经设计，但尚未实现

仓库中的可配置 endpoint 方案目前仍是设计稿。`base_url`、`default_model`、`-m/--model`、V4 模型别名、解析优先级和第三方网关验证都没有进入当前源码。

这个项目已经证明 LLM 可以成为 Unix 管道的一段，也可以在终端里保留连续的研究与编码上下文。接下来我不会继续堆命令数量，而会先补齐 framing、错误模型、测试和凭据安全，再把固定 DeepSeek endpoint 抽象成真正可验证的 Chat Completions 客户端。
