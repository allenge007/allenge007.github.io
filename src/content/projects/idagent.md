---
slug: idagent
title:
  zh: IDAgent：构想—数据集双向发现
  en: "IDAgent: Bidirectional Idea–Dataset Discovery"
summary:
  zh: 我们围绕共享的 Idea–Dataset 科研记忆，同时实现从研究想法检索数据集，以及从数据集检索先例并生成研究构思的两条路径。
  en: We build a shared Idea–Dataset research memory for both idea-to-dataset retrieval and dataset-grounded research ideation.
problem:
  zh: 研究想法描述目标、假设与方法，数据集描述字段、模态与经验边界；两者不是同一种文本，关键词和通用相似度很难判断“这个数据集是否真的支撑这个想法”。
  en: Ideas describe goals and hypotheses while datasets describe fields, modalities, and empirical boundaries; keyword search cannot reliably align the two.
work:
  zh: 我们从 AI 与数据库论文构建大规模对齐语料，训练 ID-SBERT 与 Faiss 检索器，设计语义聚类、冷启动切分和 RARO 生成流程，并形成可重复编译的论文与分析工具链。
  en: We constructed a large aligned corpus, trained an ID-SBERT/Faiss retriever, designed semantic clustering and cold-start evaluation, and implemented a RARO generation workflow.
outcome:
  zh: 32 项分析测试通过，14 页论文可重新编译，12 组核心检索表与 CSV 一致。当前证据验证核心检索和生成模块，完整交互式 Controller 仍待端到端评估。
  en: All 32 analysis tests pass, the 14-page paper recompiles, and 12 retrieval tables match generated CSVs. The interactive controller remains to be evaluated end to end.
date: "2026"
role:
  zh: 研究设计、语料构建与系统实现
  en: Research design, corpus construction & implementation
status:
  zh: 论文准备中 · 核心模块评估完成
  en: Manuscript in preparation · core modules evaluated
stack: [Python, Sentence-BERT, Faiss, RAG, LLM, LaTeX, pytest]
metrics:
  - value: "217,942"
    label: { zh: Idea–Dataset 对齐记录, en: aligned Idea–Dataset pairs }
  - value: "64,252"
    label: { zh: 来源论文, en: source papers }
  - value: "0.3334"
    label: { zh: 最佳 Relaxed MRR, en: best relaxed MRR }
featured: true
image: /project-media/idagent/idagent-architecture.png
imageAlt:
  zh: IDAgent 的双向研究智能体与离线科研记忆架构
  en: IDAgent architecture with bidirectional research agents and offline research memory
---

## 为什么要把 Idea 与 Dataset 放进同一份科研记忆

做科研选题时，我们经常遇到两个镜像问题：有了想法，却不知道哪些数据集真正能够支撑实验；拿到一个有价值的数据集，又很难快速判断它还能打开哪些研究方向。Idea 通常描述目标、假设、方法和贡献，Dataset 则描述变量、样本、模态与边界。它们并不天然共享关键词空间。

IDAgent 因此不是只做一个数据集搜索框。我们围绕共享的 `⟨Idea, Dataset⟩` 记忆，设计 Idea-to-Dataset 检索和 Dataset-to-Idea 研究构思两条在线路径；离线管线负责采集论文、抽取与归一化、语义聚类、检索器重训和索引重建。

<figure>
  <img src="/project-media/idagent/idagent-architecture.png" alt="IDAgent 总体架构" loading="lazy">
  <figcaption>两个任务 Agent 共享同一套向量化科研记忆。Controller、多轮澄清与工具路由属于完整系统设计；当前实验主要验证下方两个核心任务模块。</figcaption>
</figure>

## 从 64,252 篇论文构建对齐语料

我们选取近五年 CCF A/B 类人工智能与数据库/数据挖掘/信息检索论文，借助 Qwen3-Max 抽取论文中的研究想法与数据集使用关系，再进行数据集描述归一化、重复项合并、质量过滤和语义聚类。

| 领域 | Idea–Dataset 对齐记录 | 来源论文 |
| --- | ---: | ---: |
| AI | 165,141 | 45,586 |
| Database | 52,801 | 18,666 |
| **合计** | **217,942** | **64,252** |

同一份记忆被两个方向共用：检索任务把对齐记录作为跨类型监督，生成任务把历史研究想法作为可以追溯的先例库。在线检索结果还会经过语义簇去重，并附上来源论文，避免只返回一串名称相近但缺少证据的候选。

## Idea-to-Dataset：跨类型语义检索

ID-SBERT 使用共享参数的双编码器，把研究想法与复合数据集描述映射到同一向量空间。数据集向量提前写入 Faiss，在线只需编码查询并执行 Top-K 近邻检索。训练采用 MultipleNegativesRankingLoss：batch 对角线是已知配对，其余数据集构成批内负例。

<figure>
  <img src="/project-media/idagent/idea-to-dataset-workflow.png" alt="Idea-to-Dataset 检索训练与在线查询流程" loading="lazy">
  <figcaption>ID-SBERT 学习研究意图与数据集描述的跨类型对齐；Faiss 承担在线近邻检索，语义簇用于别名去重与宽松评估。</figcaption>
</figure>

我们同时设计 random、dataset cold-start 与 idea cold-start 三种切分。Strict 只接受原标注数据集；Relaxed-ST 也接受同一语义簇中的近等价候选。核心结果如下：

| 领域 / 切分 | Strict MRR | Strict R@10 | Relaxed-ST MRR | Relaxed-ST R@10 |
| --- | ---: | ---: | ---: | ---: |
| AI / random | 0.1426 | 0.2764 | 0.2957 | 0.5802 |
| AI / dataset | 0.1326 | 0.2446 | 0.2798 | 0.5482 |
| AI / idea | 0.1273 | 0.2257 | 0.2722 | 0.5097 |
| Database / random | **0.1809** | 0.3511 | **0.3334** | **0.6546** |
| Database / dataset | 0.1700 | 0.3559 | 0.2774 | 0.6494 |
| Database / idea | 0.1433 | 0.2583 | 0.3052 | 0.5789 |

任务特定微调在所有 domain / split / evaluation 组合下都超过 BM25、TF-IDF、SVD、ItemCF、Popularity 与 zero-shot SBERT。相对 zero-shot SBERT，Strict MRR 在 AI 上达到约 4.23–5.46 倍，在 Database 上达到约 8.29–11.24 倍。idea split 在两个领域最难或接近最难，说明新研究意图比新数据集描述更开放、更抽象。

<figure>
  <img src="/project-media/idagent/retrieval-mrr-by-split.png" alt="IDAgent 在不同冷启动切分上的严格 MRR" loading="lazy">
  <figcaption>最佳微调模型的 Strict MRR。未见研究想法比未见数据集更具挑战，Database 在三种切分上均高于 AI。</figcaption>
</figure>

## 聚类更适合评价，不适合无差别扩充正例

我们比较固定阈值 single-threshold 与 LLM 仲裁模糊边的 two-stage clustering。Two-stage 并不是简单提高相似度阈值：AI 中它拒绝 42,269 条高相似但语义不同的边，同时接受 99,131 条低于 0.85 但被判断为语义等价的边。

覆盖率更高却没有自动带来更好的检索训练。12 个最佳 domain/split/evaluation 配置全部使用 `train_scheme=none`：不扩充正例时平均 Strict MRR 为 **0.1494**，single-threshold 扩充后降到 **0.0648**，two-stage 扩充后为 **0.0683**。

<figure>
  <img src="/project-media/idagent/cluster-coverage.png" alt="两种数据集语义聚类策略的覆盖率" loading="lazy">
  <figcaption>更高的簇覆盖没有转化为更高的排序指标。当前证据支持“聚类用于去重和宽松评价”，不支持直接把整簇样本加入训练正例。</figcaption>
</figure>

<div class="project-callout"><strong>需要保留的负结果</strong>语义等价是有边界的。簇适合修正精确匹配中的假负例，但无差别扩大训练正例会显著模糊 Idea–Dataset 的对应关系。</div>

## Dataset-to-Idea：Retrieve–Adapt–Reflect–Optimize

反向任务不是把检索器倒过来。系统先解析目标数据集，在约 46K 条 AI 或 19K 条 Database 历史想法中检索先例，再依次完成适配、反思和优化，输出标题、背景、目标、方法、预期结果与创新说明六个字段。测试某个数据集时，与它直接配对的历史想法会从检索池移除，降低泄漏。

<figure>
  <img src="/project-media/idagent/dataset-to-idea-raro.png" alt="Dataset-to-Idea 的 RARO 生成流程" loading="lazy">
  <figcaption>RARO 先检索研究先例，再面向目标数据集适配、反思和修订；LLM-as-a-Judge 只用于离线评分，不参与在线生成。</figcaption>
</figure>

在 AI 上，ID-SBERT RAG + Reflection 的 Overall 为 8.26，较未反思版本提高 0.10；Database 上由 8.21 提高到 8.30。增益主要来自 Specificity 与 Relevance，而 Feasibility 并没有同步变高。这符合我们的观察：越具体、越有野心的方法，越容易暴露真实执行约束。

这些数字仍需要谨慎解释。评分来自单次 LLM-as-a-Judge，不是多人盲评；不同方法保留的候选数不同，Database 的 ID-SBERT 方法只有 515 条，而 BM25 有 1000 条，跨方法均值可能混入覆盖率选择效应。

## 本次复现验证了什么，也没有验证什么

独立复现把分析代码与论文构建放进隔离目录，得到 **32 passed**，并重新编译出 **14 页论文**。论文中的 12 组 Strict / Relaxed-ST 检索指标与生成 CSV 逐项一致。

但仓库没有原始训练 CSV、逐条生成响应和 Judge 记录，因此目前不能从零重训检索器或重新计算生成均值。论文提到的“抽样 400 个簇、78.5% 为高置信等价簇”也无法由现有归档再次复核：提供的 400 行样本中 `manual_label` 和 `manual_notes` 为空。我们会把它保留为论文阶段的启发式审计结果，而不是本次复现重新确认的事实。

当前项目没有 Web/Gradio/Streamlit Demo；已验证的是共享科研记忆上的检索与检索增强生成模块。下一阶段才会把 Controller、任务路由、多轮澄清、工具调用和用户反馈接成可交互原型，并用真实科研任务评价端到端效用。
