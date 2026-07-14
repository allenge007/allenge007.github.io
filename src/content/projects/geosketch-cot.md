---
slug: geosketch-cot
title:
  zh: GeoSketch-CoT：可执行几何草稿
  en: "GeoSketch-CoT: Executable Geometry Scratchpads"
summary:
  zh: 把结构化几何与绘图动作转为可验证、可编辑的 SVG 草稿。
  en: A prototype that turns structured geometry and drawing actions into verifiable, editable SVG scratchpads.
problem:
  zh: 多模态模型给出的几何推理往往难以运行和校验，视觉草图与文字推理之间也缺少清晰的结构。
  en: Geometry reasoning traces from multimodal models are often difficult to execute or verify, while visual sketches remain loosely connected to the accompanying text.
work:
  zh: 设计几何表示与约束验证引擎，覆盖平行、垂直、中点、交点、等长和共线等关系；实现 plan-sketch-verify-revise 流程、模型轨迹记录与核心测试。
  en: Designed a geometry representation and constraint engine covering parallelism, perpendicularity, midpoints, intersections, equal lengths, and collinearity. Also implemented a plan-sketch-verify-revise workflow, model-run tracing, and tests for the core modules.
outcome:
  zh: 完成可执行的视觉草稿原型，让推理的中间过程能够被编辑、检查并反复修正。
  en: Built an executable visual-scratchpad prototype whose intermediate steps can be edited, checked, and revised.
date: "2026"
role:
  zh: 研究与课程项目
  en: Research and course project
stack: [Python, SVG, pytest, OpenAI-compatible APIs]
featured: true
---
