---
slug: geosketch-cot
title:
  zh: GeoSketch-CoT：可执行几何草稿
  en: "GeoSketch-CoT: Executable Geometry Scratchpads"
summary:
  zh: 我们把几何推理里的“脑内辅助线”变成可以执行、校验、回放和比较的中间状态，并用严格配对实验区分视觉草图与推理协议各自带来的增益。
  en: We turn auxiliary geometry constructions into executable, verifiable, and replayable intermediate states, then use paired experiments to separate visual gains from reasoning-protocol gains.
problem:
  zh: 多模态模型会漏看图中关系，也会提出几何上不成立的辅助线；更麻烦的是，准确率提升往往无法说明究竟来自新图、更多推理 token，还是更严格的输出格式。
  en: Multimodal models may miss diagram relations or invent invalid constructions, while apparent gains can be confounded by extra reasoning tokens and output formatting.
work:
  zh: 我们实现 Graph Schema v2、受约束作图 DSL、事务式执行器、几何 verifier、SVG/PNG 渲染器和三栏研究工作台，并在 Geometry3K 与 GeoLaux 上设计匹配文字、真实视觉和反事实视觉对照。
  en: We built Graph Schema v2, a constrained drawing DSL, transactional execution, geometric verification, SVG/PNG rendering, and a research workbench with matched-text and counterfactual controls.
outcome:
  zh: 149 项测试与完整前后端构建通过。视觉草稿本身尚未被证明稳定有效；确认集上的显著提升来自“两阶段分析 + 严格 JSON 决策”，这一负结果决定了下一阶段的研究重点。
  en: All 149 tests and both production builds pass. The visual scratchpad itself is not yet a reliable improvement; the confirmed gain comes from a two-stage analysis and strict decision protocol.
date: "2026"
role:
  zh: 研究设计、几何系统与实验实现
  en: Research design, geometry system & evaluation
status:
  zh: 持续研究 · 已完成核心复现
  en: Active research · core reproduction complete
stack: [Python, FastAPI, Next.js, React, SVG, SQLite, pytest, Multimodal LLM]
metrics:
  - value: "149 passed"
    label: { zh: 核心与 Web 测试, en: core and web tests }
  - value: "85 / 92"
    label: { zh: Flash 确认集正确, en: Flash confirm correct }
  - value: "+2.000"
    label: { zh: 两阶段平均效用增益, en: two-stage utility gain }
featured: true
image: /project-media/geosketch/construction-examples.png
imageAlt:
  zh: GeoSketch 中通过几何约束验证的辅助构造
  en: Auxiliary constructions accepted by GeoSketch's geometric verifier
---

## 问题不是“能不能画线”，而是“这条线是否提供新证据”

我们开始 GeoSketch-CoT 时，并不满足于让模型在图片上多画几条线。真正困难的问题有两个：模型提出的构造是否在几何上成立，以及新生成的视觉状态是否真的为解题提供了额外证据。

因此，我们把辅助作图从一张不可追踪的中间图片，拆成图结构、动作程序、事务执行、约束验证和渲染结果。每一步都有输入、输出与失败原因；只有动作完整执行且关系验证通过，新的 SVG/PNG 才会进入下一轮模型推理。

<figure>
  <img src="/project-media/geosketch/trapezoid-scratchpad.png" alt="在梯形题上复现的事务式 GeoSketch 作图" loading="lazy">
  <figcaption>本次独立复现的梯形案例：高亮 BG、沿射线复制 CD 的长度得到 H、连接 DH，并在渲染前确认 H 位于射线 BG 且 BH = CD。</figcaption>
</figure>

## 从 Geometry Graph 到可执行作图 DSL

Graph Schema v2 用无歧义的数组端点表达点、线段、直线、射线、目标、来源与置信度。验证器当前覆盖平行、垂直、等长、中点、交点、垂足、共线和点在线/线段/射线等关系；距离容差会随图尺度变化，角度则使用归一化残差。

围绕这套图结构，我们实现了 12 类受约束动作，包括绘制线/线段/射线、高亮与关系标记，以及中点、交点、垂足、平行线、垂线和“沿射线复制长度”等构造。动作 ID 必须唯一，未知字段会被直接拒绝。整个动作列表先在克隆图上执行，任一步失败都会回滚，避免半成品污染原图。

渲染层共享同一份 Scene IR，可以输出 SVG、PNG、原图 overlay 和并排对照；每条构造保留 provenance，便于在工作台中回放“谁提出、如何执行、为什么通过或失败”。

## 从研究脚本收敛为本地工作台

我们把实验管线做成 FastAPI + Next.js 三栏工作台。左侧管理会话、Geometry3K、GeoLaux 与用户导入数据；中间组织题目、模型、工作流、上传文件和 SSE 运行进度；右侧集中显示 Graph、动作 JSON、SVG/PNG 产物与事件时间线。

当前工作流以 YAML 版本化，包含 direct VLM、verified scratchpad、two-pass visual 和 direct-vs-scratchpad 四条路径。API Key 只需保存在后端进程内存，SQLite 使用 WAL；但系统没有账号层，因此定位始终是可信本机研究工具，而不是可直接暴露到公网的服务。

独立复现中，Python 测试得到 **149 passed**；TypeScript、ESLint 与 Next.js 生产构建全部通过；FastAPI 健康检查、四个工作流、Geometry3K/GeoLaux 数据 API 和前端 HTTP 响应均完成核验。

## Geometry3K：视觉草稿的第一轮负结果

Geometry3K test 共 601 题。我们在模型调用前冻结 eligibility，当前解析器与 DSL 能执行其中 238 题（39.6%），其余 363 题明确保留为 unsupported。配对实验比较原图、基础重绘、验证草图以及验证草图 + Graph JSON；效用将正确答案计为 +3，明确弃答计为 +1，错误、无效或运行失败计为 -1，并使用 10,000 次 paired bootstrap。

| 模型 | 条件 | 总效用 | Accuracy | Invalid |
| --- | --- | ---: | ---: | ---: |
| Qwen3-VL-Plus | 原图 | 238 | 0.500 | 0.004 |
| Qwen3-VL-Plus | 验证草图 | 144 | 0.399 | 0.008 |
| Qwen3-VL-Flash | 原图 | 166 | 0.424 | 0.097 |
| Qwen3-VL-Flash | 验证草图 | 174 | 0.433 | 0.013 |

Plus 的草图臂相对原图平均效用 **-0.395**，95% CI 为 **[-0.588, -0.202]**；Flash 虽多出 8 个总效用点，但平均增益仅 **+0.034**，95% CI **[-0.185, +0.252]**，区间跨过 0。附加 Graph JSON 同样没有改善结果。

<div class="project-callout"><strong>阶段结论</strong>早期实验没有证明“辅助图本身有效”。在 Plus 上它甚至显著有害；在 Flash 上只能观察到不确定的小幅变化。</div>

<figure>
  <img src="/project-media/geosketch/correction-case.png" alt="匹配文字、验证构造与反事实构造的因果对照" loading="lazy">
  <figcaption>我们让匹配文字对照、验证自动构造与端点置换的反事实构造使用相同推理预算，从而区分“正确视觉证据”与“图片只是发生了变化”。</figcaption>
</figure>

## 两阶段协议通过确认，但不能归功于草图

我们把 238 个 eligible 样本固定拆为 146 个 dev 与 92 个一次性 confirm，并预先规定接受条件：平均效用增益至少 +0.15、95% CI 下界大于 0、Invalid 不超过 2%。选中的 `flash-two-pass-original-v1` 先进行长文本视觉分析，再用第二次调用把分析压缩成严格的 `AnswerDecision` JSON；金标准答案从不进入模型请求。

| 模型 / split | 原始单阶段 | 两阶段协议 | 正确数变化 | 平均增益（95% CI） |
| --- | ---: | ---: | ---: | ---: |
| Flash / dev | 102 / 438 | 390 / 438 | 62 → 134 / 146 | +1.973 [1.616, 2.329] |
| Flash / confirm | 64 / 276 | 248 / 276 | 39 → 85 / 92 | **+2.000 [1.565, 2.435]** |
| Plus / confirm | 80 / 276 | 232 / 276 | 43 → 81 / 92 | +1.652 [1.174, 2.130] |

12 题 pilot 中，原图与原图+草图在单阶段都得到 8/36；进入两阶段后两者都变成 32/36。换句话说，确认集提升来自“长分析 + 严格决策格式”，不是视觉草图的胜利。它也有成本：Flash confirm 中位延迟 15.34 秒、P95 51.66 秒；Plus 分别为 21.72 秒和 111.49 秒。

## GeoLaux：正确辅助图有信号，自动构造仍未过线

在 18 组公开原图/官方辅助图中，同一辅助文字配官方视觉更新相对匹配文字对照平均增加 +0.222 效用，但 bootstrap 下界为 0，只能作为诊断证据。自动 top-1 构造与等预算文字对照最终同为 38/54；反事实视觉为 34/54。验证视觉比无关视觉更安全，却尚未证明超过匹配文字。

<figure>
  <img src="/project-media/geosketch/geolaux-construction-contact-sheet.png" alt="GeoLaux 自动构造人工复核面板" loading="lazy">
  <figcaption>GeoLaux 构造复核面板同时保留题目 ID、动作类型、执行结果与辅助线位置。大量失败集中在圆心、半径、弦、切线和圆周角语义，而不是 SVG 渲染。</figcaption>
</figure>

## 下一阶段

当前最可靠的成果不是一个“已经提升准确率”的口号，而是一套能识别错误归因的实验基础设施。下一步我们会扩充圆相关实体与带语义前置条件的动作，提高从原图生成 Graph v2 的感知质量，并在新的冻结开发集上同时报告效用、污染率、Invalid、调用成本和延迟。已经消费的 92 题 confirm 不会继续用于调参。
