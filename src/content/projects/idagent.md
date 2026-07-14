---
slug: idagent
title:
  zh: IDAgent：连接研究构想与数据集的双向 Agent
  en: "IDAgent: Linking research ideas and datasets in both directions"
summary:
  zh: 支持 idea-to-dataset 检索，也从 dataset-to-idea 展开研究构思的 Research Agent。
  en: A research-agent prototype for idea-to-dataset retrieval and dataset-grounded ideation.
problem:
  zh: 数据集信息、任务边界与潜在研究空白散落在不同论文中；传统关键词检索也很难从一份数据集反推可行的研究问题。
  en: Dataset descriptions, task boundaries, and potential research gaps are scattered across papers. Keyword search also offers little help when reasoning from a dataset back to a viable research question.
work:
  zh: 搭建由 AI 与数据库论文组成的研究记忆，完成 LLM 辅助抽取、数据集归一化、语义聚类与质量控制；实现 Sentence-BERT、Faiss 及 retrieve-adapt-reflect 工作流。
  en: Built a research memory from AI and database papers using LLM-assisted extraction, dataset normalization, semantic clustering, and quality control. Implemented retrieval with Sentence-BERT and Faiss, followed by a retrieve-adapt-reflect workflow.
outcome:
  zh: 完成同时支持数据集检索与 dataset-grounded ideation 的原型系统。稿件仍在准备中，不作已发表成果表述。
  en: The prototype supports both dataset retrieval and dataset-grounded ideation. A manuscript is in preparation; this work is not presented as a publication.
date: "2026"
role:
  zh: 研究与系统实现
  en: Research & implementation
stack: [Python, Sentence-BERT, Faiss, RAG, LLM]
featured: true
---
