---
slug: yatcc-se
title:
  zh: YatCC-SE：课程云开发平台
  en: "YatCC-SE: Cloud Development for Computing Labs"
summary:
  zh: 我们把计算机实验课需要的浏览器 IDE、学生隔离、时间配额和集群调度组织成一套多用户云开发平台原型，并如实保留任务系统、存储配额与生产部署的阶段性边界。
  en: We combine browser IDEs, student isolation, time quotas, and cluster scheduling into a multi-user cloud development platform prototype, while documenting unfinished coursework, storage-quota, and production work.
problem:
  zh: 实验课程既需要让每位学生快速得到一致的开发环境，也需要教师统一管理配额、作业、空间状态和集群资源；只提供一台共享服务器很难兼顾隔离与运维。
  en: Computing labs need reproducible per-student environments and centralized management of quotas, assignments, spaces, and cluster resources.
work:
  zh: 团队拆分学生端、管理端、两组 API 服务、Redis 状态层、异步执行脚本和 Kubernetes 适配，并为每名学生创建独立的 code-server / sshd 空间。
  en: The team separated student/admin frontends, two API services, Redis state, asynchronous workers, and Kubernetes adapters for isolated code-server/sshd spaces.
outcome:
  zh: 学生与管理前端均完成类型检查和生产构建，学生 API 聚焦测试 7/7 通过；复现也定位了状态枚举、测试隔离、保活、存储和密钥管理问题，因此仍定位为工程原型。
  en: Both web apps pass type checking and production builds, while the focused student API suite passes 7/7. State, isolation, keepalive, storage, and secret-management gaps keep the platform at prototype stage.
date: "2025"
role:
  zh: 团队工程项目参与者
  en: Team engineering project contributor
status:
  zh: 工程原型 · 核心流程可演示
  en: Engineering prototype · core flow demonstrable
stack: [Vue 3, TypeScript, Python, Flask-OpenAPI3, Redis, asyncio, Kubernetes, code-server]
metrics:
  - value: "7/7"
    label: { zh: 学生 API 聚焦测试, en: focused student API tests }
  - value: "1486"
    label: { zh: 学生端构建模块, en: student build modules }
  - value: "1526"
    label: { zh: 管理端构建模块, en: admin build modules }
featured: false
image: /project-media/yatcc-se/yatcc-student-dashboard-light.jpg
imageDark: /project-media/yatcc-se/yatcc-student-dashboard-dark.jpg
imageAlt:
  zh: YatCC-SE 学生端代码空间与时间配额仪表盘
  en: YatCC-SE student dashboard for codespace status and time quota
links:
  - label: { zh: GitHub 仓库, en: GitHub repository }
    url: https://github.com/Nickchen-PUSH/YatCC-SE
---

## 从“统一装环境”到“每个人都有独立代码空间”

计算机实验课经常把大量时间花在环境差异上：编译器版本不一致、依赖安装失败、共享服务器权限互相影响。教师端又需要知道每个学生的空间是否运行、还剩多少时间配额、作业是否提交，以及集群资源是否足够。

我们把这些需求收敛为 YatCC-SE：学生通过浏览器登录自己的 code-server 环境，管理端统一创建账户、调整时间配额并批量控制代码空间；底层用 Redis 保存核心状态，用异步工作进程驱动容器生命周期，再把集群操作交给 Mock 或 Kubernetes 适配器。任务管理目前只有界面骨架，不能把规划能力写成已经交付的功能。

## 学生、教师与集群是三个不同的操作面

<figure>
  <img src="/project-media/yatcc-se/architecture.png" alt="YatCC-SE 系统架构" loading="lazy">
  <figcaption>学生网页、管理网页和管理员终端分别进入对应服务；Redis 连接账户、配额与空间状态，Kubernetes 为学生创建隔离的 code-server / sshd 工作环境。</figcaption>
</figure>

学生端负责登录、个人资料、密码修改、代码空间启动/停止/进入和剩余时间展示。管理端已经实现学生单个/批量创建、删除、时间配额调整与代码空间批量启停；“任务管理”和“代码空间总览”页面仍显示待实现，因此它们只代表产品方向。管理员还可以通过 SSH 运维入口处理批量操作。

两个 Python API 服务分别面向学生与管理员，使用 Flask-OpenAPI3 + Pydantic 描述接口并生成 Swagger 文档。拆开服务不仅是路由整理，也把权限边界明确下来：学生只能操作自己的空间，管理员接口才能查看与修改全体学生状态。

## 代码空间生命周期与时间配额

核心状态包含空间 URL、运行状态、总配额、已用时间、最近启动/停止/活跃/检查时间。启动前会检查时间配额，后台 watcher 根据启动和检查时间累计使用时长，达到配额后触发停止流程；管理员 keepalive 路由与核心 `keep_alive()` 目前还是空实现，不能作为已完成链路。

Kubernetes 适配器负责 Deployment、Service、日志、端口转发、暂停恢复与资源清理。停止代码空间时，我们把 Deployment 副本数缩到 0，而不是立即删除资源；重新启动后恢复副本并更新 CPU、内存和环境变量。当前工作目录依赖 `hostPath`，并没有 PVC 或按学生执行的容量限制，所以“保留文件”成立于节点路径仍可用的前提下。Mock 适配器与 Kubernetes 共享接口，使本地前后端开发不必依赖真实集群。

`asyncio` 工作进程承担异步创建、启动、停止与监控，避免一次较慢的集群操作阻塞整个 Web 请求。Redis 则让学生服务、管理服务和后台脚本共享同一份账户、配额与生命周期状态。

## 真实复现的学生端 Demo

页面截图来自仓库当前学生端的 Vite + MSW 开发模式。我们实际完成模拟登录，读取个人资料和代码空间状态，并切换原生浅色/深色主题。Hero 图会跟随本站的手动主题按钮即时切换，而不是只读取操作系统偏好。

仪表盘同时展示空间是否运行、访问链接、隐藏密码和剩余时长，并提供启动、刷新与停止动作。独立构建中，学生端 `vue-tsc -b && vite build` 成功处理 **1486 个模块**，生成约 299 KB 的主 JavaScript bundle（gzip 约 107 KB）；管理端也通过类型检查与 Vite 构建，共处理 **1526 个模块**，主入口约 237 KB（gzip 约 87 KB）。

浏览器核验也暴露了几个不会阻塞页面、但值得修复的 Vue warning：`hideAfter`、`strokeWidth` 与 `width` 以字符串传入，而 Element Plus 期望 Number。这类问题会被保留在工程清单里，而不是因为 Demo 能打开就忽略。

## 从构建到接口的独立复现

| 检查项 | 结果 | 我们从中确认的事实 |
| --- | ---: | --- |
| Python `compileall` | 通过 | Python 源文件可完成字节码编译 |
| 学生端类型检查 + Vite | 通过 | 1486 modules，JS 299.49 kB / gzip 107.34 kB |
| 管理端类型检查 + Vite | 通过 | 1526 modules，主入口 237.01 kB / gzip 86.96 kB |
| 学生 API 聚焦测试 | 7/7 通过 | 登录、资料与代码空间主路径可执行 |
| 核心学生测试 | 8/9 通过 | 剩余失败涉及测试 stub 与 MockCluster 状态不一致 |
| 管理 API 聚焦测试 | 6/11 通过 | 失败集中在 3ms 异步跃迁、共享状态和 Redis SCAN 顺序假设 |

完整测试并非全绿：依赖声明遗漏了 `redis`、`flask-openapi3` 等实际需要的包，测试 Redis 默认只开 TCP，而核心测试沿用生产 Unix socket；隔离修正测试配置后，我们还发现集群 `PENDING` 被写成枚举中不存在的 `pending`，下一次反序列化会退化为 `error`。这些结论比一个笼统的“后端可运行”更能说明当前工程处于什么阶段。

## 当前完成度

| 层次 | 已有实现 |
| --- | --- |
| 学生前端 | Vue 3 + TypeScript + Vite + Element Plus + UnoCSS；登录、资料、配额和代码空间控制，支持 MSW 与深浅主题 |
| 管理前端 | 学生与账户管理、批量导入和空间批量启停已成形；任务与空间总览仍为占位页 |
| 服务接口 | 学生登录/资料/空间接口；管理员学生 CRUD、批量启停与配额调整；OpenAPI 文档 |
| 状态与执行 | Redis 数据模型、asyncio 工作进程、运行时间与配额记录 |
| 集群适配 | Mock / Kubernetes 两套实现，覆盖 Deployment、Service、日志、暂停恢复和清理 |
| 运行环境 | code-server + sshd、CPU/内存限制与 hostPath 目录隔离；PVC、空间配额和跨节点恢复尚未实现 |

## 为什么仍然叫工程原型

代码中还有明确未完成部分：管理员 keepalive、任务管理交互、空间配额执行，以及 HTTPS/生产部署收尾。readiness/liveness probe 和 Redis 完整性检查已有代码但没有接入运行路径；每名学生一个 LoadBalancer 会增加地址与成本压力，`hostPath` 也限制跨节点恢复。开发配置中的默认 Key、固定 secret 和浮动私有镜像标签同样需要在真实部署前替换。

<div class="project-callout"><strong>阶段定位</strong>我们已经把学生代码空间、管理操作、状态层和集群适配连成可以演示的核心路径；在完成监控、配额一致性、权限审计、HTTPS 与真实课程压力测试之前，不把它描述为已经投入教学的生产平台。</div>

下一阶段会优先补齐 keepalive 与配额原子性、任务提交/评分闭环、真实 Redis/Kubernetes 集成测试和故障恢复演练，同时修复前端类型 warning，并记录从点击启动到空间可用的端到端延迟。
