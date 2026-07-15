---
slug: foodflow
title:
  zh: FoodFlow：多方推荐与履约仿真
  en: "FoodFlow: Recommendation & Fulfillment Simulation"
summary:
  zh: 我们把 Top-K 推荐继续推向商家曝光、骑手匹配与午餐高峰仿真，在同一条流水线里衡量用户准确率、公平性、ETA、超时率和平台效用。
  en: We connect Top-K recommendation to merchant exposure, courier matching, and peak-hour simulation, measuring accuracy, fairness, ETA, timeout rate, and platform utility together.
problem:
  zh: 外卖推荐的离线最优不一定是系统最优。热门或远距离商家可能提高短期命中，却会制造曝光集中、爆单、骑手负载和超时风险。
  en: Offline recommendation gains may create concentrated exposure, overloaded merchants, courier imbalance, and delivery delays downstream.
work:
  zh: 我们实现八类推荐/重排模型、服务圈约束、知识图谱解释、批量与路径派单、多时间步仿真和 Streamlit 决策台，并让 CLI、前端和报告共享同一套策略注册表。
  en: We implemented eight recommenders/rerankers, serviceability constraints, KG explanations, batch and route-aware dispatch, multi-step simulation, and a shared Streamlit workbench.
outcome:
  zh: 60 项测试与 mock 全链路复现通过。Seq-Tuned 取得准确率前沿，Logistic-LTR 改善覆盖与曝光；KG-Tripartite + Batch 的当前平均平台效用最高。
  en: All 60 tests and the full mock pipeline pass. Seq-Tuned leads accuracy, Logistic-LTR improves coverage and exposure, and KG-Tripartite + Batch has the best current mean platform utility.
date: "2026"
role:
  zh: 推荐、仿真、实验与交互实现
  en: Recommendation, simulation, evaluation & UI
status:
  zh: 可复现实验系统 · 全链路已审计
  en: Reproducible experimental system · pipeline audited
stack: [Python, Pandas, scikit-learn, Streamlit, Plotly, NetworkX, pytest]
metrics:
  - value: "0.4509"
    label: { zh: Seq-Tuned Recall@20, en: Seq-Tuned Recall@20 }
  - value: "24.98 min"
    label: { zh: KG + Batch 平均 ETA, en: KG + Batch mean ETA }
  - value: "0.5697"
    label: { zh: 当前最高平均平台效用, en: best mean platform utility }
featured: true
image: /project-media/foodflow/foodflow-dispatch-light.jpg
imageDark: /project-media/foodflow/foodflow-dispatch-dark.jpg
imageAlt:
  zh: FoodFlow 实时调度台，展示订单、骑手、ETA 与路线决策
  en: FoodFlow live dispatch workbench with orders, couriers, ETA, and routing decisions
links:
  - label: { zh: GitHub 仓库, en: GitHub repository }
    url: https://github.com/HSZGB/FoodFlow
---

## 推荐列表之后，系统发生了什么

我们没有把 FoodFlow 做成另一个只汇报 Recall/NDCG 的推荐作业。外卖推荐一旦把订单集中到热门或远距离商家，后果会继续传递到商家曝光、骑手负载和超时风险。于是我们把推荐列表向下游继续推进：用户选择商家后，订单进入骑手匹配与午餐高峰动态仿真。

完整闭环是：TRD 订单与点击/菜品信号 → 8 km 服务圈候选 → 用户—商家 Top-K 排序 → 偏好/公平/ETA/供给联合重排 → MNL 模拟下单 → 逐单、批量或路径插单派单 → 多时间步高峰仿真 → 联合评价。

## 数据规模与诚实边界

推荐侧使用 Takeout Recommendation Dataset（TRD），覆盖北京 11 个商圈、2021-03-01 至 2021-03-28。本地全量审计包含 200,000 位用户、29,072 家商户、179,778 个 SPU、1,068,495 条训练订单和 230,550 条测试订单/标签。

TRD 没有真实经纬度，也没有完整骑手状态与平台派单记录。我们把实体嵌入 84,307 个 LaDe 烟台配送 GPS 点形成的城市空间分布，并用固定 seed 合成骑手位置、负载、可靠性与收入。LaDe 只用于校准速度、服务时长和并发负载分布，而且它是末端包裹配送数据，不是外卖派单数据。

<div class="project-callout"><strong>数据口径</strong>FoodFlow 比较的是同一仿真环境下的策略差异，不宣称还原工业平台的绝对指标；平台效用也是本项目定义的综合指标，必须与 Recall、Coverage、Gini、ETA 和超时率并列解释。</div>

## 推荐层：准确率、公平和履约特征进入同一候选集

我们比较 Popular、BPR-MF、UserOnly、Seq-Tuned、Logistic-LTR、Seq-xQuAD-Tripartite、Session-SPU-Tripartite 与 KG-Tripartite。Seq-Tuned 用快/慢最近性、复购、商家转移、品类、热度和质量构造可解释序列信号；三方模型进一步把用户偏好、商家公平、ETA 与可用供给加入重排。

KG-Tripartite 还会建立时间衰减的品类、区域和价位兴趣路径，输出“用户—品类—商家”等解释。所有候选先经过 8 km 服务圈硬约束；测试标签不会进入模拟下单过程。

<figure class="project-theme-figure">
  <img src="/project-media/foodflow/foodflow-recommendation-light.jpg" alt="FoodFlow 浅色推荐决策页面" data-theme-image="light" loading="lazy">
  <img src="/project-media/foodflow/foodflow-recommendation-dark.jpg" alt="FoodFlow 深色推荐决策页面" data-theme-image="dark" loading="lazy">
  <figcaption>同一推荐案例会随网站主题切换浅色/深色截图。页面同时展示用户画像、候选 ETA、公平分、可用运力与图谱解释，测试期命中标签默认隐藏。</figcaption>
</figure>

当前正式输出使用 Logistic-LTR：虽然依赖文件声明了 LightGBM，本次环境没有安装该包，代码正确回退到 Logistic Regression，结果 CSV 也记录了真实模型名。我们不会把这些数值写成 LightGBM 实验。

| 模型 | Recall@20 | NDCG@20 | Coverage@20 | Exposure Gini |
| --- | ---: | ---: | ---: | ---: |
| Popular | 0.0559 | 0.0266 | 0.0151 | 0.9946 |
| BPR-MF | 0.1622 | 0.1009 | 0.1430 | 0.9516 |
| Seq-Tuned | **0.4509** | **0.3428** | 0.2894 | 0.8927 |
| Logistic-LTR | 0.4019 | 0.3241 | **0.4600** | **0.7893** |
| Seq-xQuAD-Tripartite | 0.4309 | 0.3307 | 0.2829 | 0.8856 |
| Session-SPU-Tripartite | 0.4251 | 0.3296 | 0.2851 | 0.8826 |
| KG-Tripartite | 0.4455 | 0.3361 | 0.2897 | 0.8752 |

这不是一个模型全面取胜的表格。Seq-Tuned 位于准确率前沿，Logistic-LTR 的覆盖和曝光均衡最好，KG/三方模型则把接近前沿的推荐继续送入履约系统。

<figure>
  <img src="/project-media/foodflow/tripartite_scorecard.png" alt="FoodFlow 用户、商家与平台三方指标卡" loading="lazy">
  <figcaption>同一策略在用户准确率、商家曝光和平台履约上可能得到不同排序，因此我们避免只挑一个最漂亮的离线数字。</figcaption>
</figure>

## 履约层：批量匹配与路径插单

逐单策略包括最近骑手、最小 ETA 与负载感知；批量策略把骑手容量展开为槽位，用最大权匹配处理同一时间步的订单。路径策略维护取餐/送达航点序列，通过 cheapest insertion 计算边际绕行，并让骑手在仿真中沿路径移动，而不是“派单即瞬移”。

正式仿真让所有策略共享请求流、初始骑手池和 MNL 随机数流，并使用 10 个 seed：

| 推荐 + 调度 | Avg ETA | Timeout | Platform Utility |
| --- | ---: | ---: | ---: |
| Popular + Nearest | 54.03 ± 2.50 min | 54.2% | 0.3998 ± 0.0104 |
| Seq-Tuned + MinETA | 29.25 ± 1.67 min | 10.1% | 0.5501 ± 0.0105 |
| Seq-xQuAD + Batch | **24.62 ± 0.95 min** | **3.4%** | 0.5688 ± 0.0067 |
| Session-SPU + Batch | 24.84 ± 0.96 min | 3.6% | 0.5681 ± 0.0066 |
| KG-Tripartite + Batch | 24.98 ± 0.99 min | 3.48% | **0.5697 ± 0.0057** |

相对 Popular + Nearest，KG + Batch 的平均 ETA 下降约 53.8%，超时率从 54.2% 降到 3.48%，平台效用由 0.3998 提升到 0.5697。部分策略的置信区间重叠，因此准确表述是“当前均值最高”，而不是“统计显著全面优于”。

<figure>
  <img src="/project-media/foodflow/pareto_recall_utility.png" alt="FoodFlow Recall 与平台效用 Pareto 图" loading="lazy">
  <figcaption>推荐准确率与系统效用形成 Pareto 关系；把离线前沿继续放入履约仿真后，策略排序会发生变化。</figcaption>
</figure>

## 路径插单只在容量压力下体现价值

默认 120 名骑手时，简单槽位 Batch 反而略优：KG + Batch 为 24.98 min / 3.48%，RouteMinETA 为 25.07 min / 3.86%，RouteBatch 为 26.27 min / 4.80%。合单并不是免费收益。

当骑手数降到 30，路径机制开始表现出韧性：

| 策略 | Avg ETA | Timeout | Utility | 顺路接单率 |
| --- | ---: | ---: | ---: | ---: |
| KG + Batch | 39.84 min | 32.06% | 0.5614 | — |
| KG + RouteMinETA | **31.21 min** | **10.94%** | **0.5810** | 67.35% |
| KG + RouteBatch | 32.44 min | 14.14% | 0.5681 | 68.89% |

我们因此把路径插单定位成“高峰运力不足时的韧性机制”，而不是宣称它在所有场景都更快。

## 复现与阶段成果

本次独立复现得到 **60 passed**，并在 `/tmp` 从 mock TRD 开始跑通：预处理 → 8 模型离线评估 → 11 策略仿真 → 数据审计 → 18 张图 → Markdown 报告。真实 Streamlit 决策台也用当前处理数据启动，并分别以 light/dark 主题复现调度和推荐页面。

项目目前已经具备可重复的实验与展示闭环，但尚不是线上 A/B 测试。下一阶段需要用真实地理、骑手轨迹与派单日志替代 proxy，并把平台效用拆成更可解释、更可校准的业务约束。
