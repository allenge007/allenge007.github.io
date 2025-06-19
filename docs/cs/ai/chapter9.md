# 强化学习

!!! abstract "前情知识回顾：机器学习"
    机器学习需要提前给定大量静态数据，其学习目标是发现数据中的潜在结构或映射关系。

    *   **监督学习：** 在拥有输入和对应输出（标签）的情况下训练模型，用于寻找输入与输出之间的映射关系。
    *   **无监督学习：** 在训练数据没有标签或目标值的情况下训练模型，用于探索数据中隐含的模式和分布。

在许多如棋牌博弈、机器人控制等序列决策场景中，智能体（Agent）需要与环境（Environment）进行动态交互，并通过交互获得的数据来学习其决策策略。这些动态决策场景十分广泛，包括博弈游戏、无人机空战、交通灯控制、无人驾驶以及智能电网等。

## 什么是强化学习？

!!! quote "强化学习核心定义"
    强化学习讨论的核心问题是：在一个复杂且不确定的环境中，智能体如何通过与环境进行大量的试错交互来学习一个最优的决策策略。

!!! contrast "强化学习 vs. 监督/无监督学习"
    强化学习是机器学习的第三种主要学习范式，与监督学习和无监督学习有着显著的不同：

    *   **监督学习：**
        *   目标：分类或预测标签。
        *   特点：无交互、无序列决策、无探索（试错）。
    *   **无监督学习：**
        *   目标：发现数据的内部模式或结构。
        *   特点：无交互、无序列决策、无探索（试错）。
    *   **强化学习：**
        *   **试错学习 (Trial-and-Error Learning)：** 通过尝试不同的动作，并根据接收到的奖励信号调整策略，从而学习最优行为。
        *   **延迟奖励 (Delayed Reward)：** 可能需要经过一系列动作后才能获得最终的奖励，因此必须考虑长期回报。
        *   **动态策略 (Dynamic Policy)：** 智能体需要根据当前状态选择行动，其选择动作的策略是动态调整的。
        *   **序列决策 (Sequential Decision Making)：** 智能体和环境的交互是一个序列决策过程。

!!! tip "本章学习目标与要求"
    **学习目标 (Goal):**

    1.  理解强化学习的基本概念。
    2.  掌握表格型强化学习的三类主要算法。
    3.  掌握深度强化学习的基本算法。
    4.  了解多智能体强化学习的相关概念和算法。

    **重点内容 (Importance):**

    5.  掌握建模强化学习问题的形式化过程。
    6.  能够训练强化学习算法在复杂场景上的策略模型。

    **学习难点 (Difficulty):**

    *   能够灵活地将强化学习算法应用到任意复杂的环境中。

---

## 一、强化学习基本概念

强化学习（Reinforcement Learning, RL）从动物学习过程中汲取灵感，强调在与环境的不断交互和试错中学习，通过获取经验来优化行为。

**强化学习过程的四个基本要素：**

1.  **智能体 (Agent)：** 学习者和决策者。
2.  **环境 (Environment)：** 智能体外部的一切，与智能体交互。
3.  **动作 (Action)：** 智能体可以执行的操作。
4.  **奖励 (Reward)：** 环境对智能体动作的即时反馈信号，用于评估动作的好坏。
5.  **状态 (State)：** 对环境某个时刻的描述，是智能体决策的依据。
    *   *(PPT中环境模型和交互样本是要素，这里结合通用表述调整为Agent, Environment, Action, Reward, State)*

!!! example "《冒险岛》游戏中的强化学习元素"
    *   **智能体 (Agent)：** 玩家操控的角色。
    *   **环境 (Environment)：** 游戏地图、怪物、道具等。
    *   **状态 (State)：** 当前游戏画面（例如，角色位置、怪物位置、血量等）。
    *   **动作 (Action)：** 角色可以执行的操作（如：前进、后退、跳跃、攻击）。
    *   **奖励 (Reward)：**
        *   **正向奖励：** 收集苹果 (+50)，攻击小怪 (+100)。
        *   **负向奖励：** 每消耗一秒时间 (-5)，接触小怪 (−∞，游戏结束)。
    **强化学习的目标是最大化智能体在环境中能获得的累积奖励。**

### 1. 马尔可夫性质 (Markov Property)

一个状态如果具有马尔可夫性质，意味着给定当前状态后，未来状态的概率分布仅与当前状态有关，而与过去的状态（即该过程的历史状态）无关。

$P[S_{t+1} | S_t] = P[S_{t+1} | S_1, S_2, \dots, S_t]$

或者如PPT中更一般的形式：

$P\{S_{t+h}=s'|S_t=s_t, S_{t-1}=s_{t-1}, \dots, S_0=s_0\} = P\{S_{t+h}=s'|S_t=s_t\}, \forall h > 0$

*   当前状态包含了历史中的所有相关信息。
*   一旦当前状态已知，就可以忽略其余的历史状态信息。

### 2. 马尔可夫决策过程 (Markov Decision Process, MDP)

MDP 是对强化学习问题进行形式化描述的框架。一个MDP通常由一个五元组 $\langle S, A, P, R, \gamma \rangle$ 定义：

*   **状态空间 $S$ (State Space)：** 所有可能状态的集合。

*   **动作空间 $A$ (Action Space)：** 所有可能动作的集合。

*   **状态转移函数 $P$ (Transition Function)：** $P(s'|s,a) = P\{S_{t+1}=s'|S_t=s, A_t=a\}$，表示在状态 $s$ 执行动作 $a$ 后，转移到状态 $s'$ 的概率。

*   **奖励函数 $R$ (Reward Function)：** $R(s,a,s')$ 表示在状态 $s$ 执行动作 $a$ 转移到状态 $s'$ 后获得的即时奖励。PPT中表示为 $R_t = R(S_t, A_t, S_{t+1})$。有时也定义为 $R(s,a) = E[R_{t+1}|S_t=s, A_t=a]$。

*   **折扣因子 $\gamma$ (Discount Factor)：** $\gamma \in [0,1]$，用于衡量未来奖励在当前时刻的价值。

### 3. 策略 (Policy)

策略 $\pi$ 是智能体在给定状态下选择动作的方式，即从状态到动作的映射。

*   **随机性策略 (Stochastic Policy) $\pi(a|s)$：** 输出在状态 $s$ 下选择动作 $a$ 的概率。满足 $\sum_{a \in A} \pi(a|s) = 1$。
*   **确定性策略 (Deterministic Policy) $a = \pi(s)$：** 输出在状态 $s$ 下选择的唯一确定动作。

**策略的具体形式：**

*   **表格策略 (Tabular Policy)：** 对于每一个状态 $s$，直接存储采取动作 $a$ 的概率 $\pi(a|s)$ 或确定的动作 $\pi(s)$。
*   **参数化策略 (Parameterized Policy)：** 使用带有参数 $\theta$ 的函数来表示策略，例如神经网络。
    *   确定性: $a = \pi_\theta(s) \triangleq \pi(s;\theta)$
    *   随机性: $\pi_\theta(a|s) \triangleq \pi(a|s;\theta)$

### 4. 回报 (Return)

回报 $G_t$ 是从时间步 $t$ 开始的所有未来折扣奖励的总和：

$G_t = R_{t+1} + \gamma R_{t+2} + \gamma^2 R_{t+3} + \dots = \sum_{k=0}^{\infty} \gamma^k R_{t+k+1}$

*   折扣因子 $\gamma$ 使得未来的奖励在当前看来价值有所衰减。
*   强化学习的目标是最大化期望累积回报。

!!! tip "折扣因子的意义"
    *   **数学便利性：** 确保回报是有限的，有助于算法收敛。
    *   **避免无限循环：** 防止在循环状态中累积无限奖励。
    *   **不确定性：** 未来的奖励往往具有更高的不确定性。
    *   **即时偏好：** 生物系统（包括人类）通常更偏好即时奖励。
    *   **经济学类比：** 类似利率，今天的钱比未来的钱更有价值。

### 5. 价值函数 (Value Function)

价值函数用于评估一个状态或状态-动作对的好坏程度，即从该状态或状态-动作对开始，遵循特定策略所能获得的期望回报。

*   **状态价值函数 (State-value function) $V_\pi(s)$：** 从状态 $s$ 开始，遵循策略 $\pi$ 的期望回报。
    $V_\pi(s) \triangleq E_\pi[G_t | S_t=s]$
*   **动作价值函数 (Action-value function) $Q_\pi(s,a)$：** 在状态 $s$ 执行动作 $a$后，继续遵循策略 $\pi$ 的期望回报。

    $Q_\pi(s,a) \triangleq E_\pi[G_t | S_t=s, A_t=a]$

**$V_\pi(s)$ 和 $Q_\pi(s,a)$ 之间的关系：**

$V_\pi(s) = \sum_{a \in A} \pi(a|s) Q_\pi(s,a)$
$Q_\pi(s,a) = \sum_{s' \in S} P(s'|s,a) [R(s,a,s') + \gamma V_\pi(s')]$

(PPT中的写法: $Q_\pi(s,a) = \mathcal{R}_s^a + \gamma \sum_{s' \in S} P_{ss'}^a V_\pi(s')$，其中 $\mathcal{R}_s^a$ 是期望立即奖励)

### 6. 最优价值函数 (Optimal Value Function)

最优价值函数是在所有可能的策略中能达到的最大期望回报。

*   **最优状态价值函数 $V^*(s)$：**
    $V^*(s) = \max_{\pi} V_\pi(s), \forall s \in S$
*   **最优动作价值函数 $Q^*(s,a)$：**
    $Q^*(s,a) = \max_{\pi} Q_\pi(s,a)$

!!!tip "$V^*(s)$ 与 $Q^*(s,a)$ 之间的关系："

    $V^*(s) = \max_{a \in A} Q^*(s,a)$

    $Q^*(s,a) = \sum_{s' \in S} P(s'|s,a) [R(s,a,s') + \gamma V^*(s')]$

    (PPT中的写法: $Q^*(s,a) = \mathcal{R}_s^a + \gamma \sum_{s' \in S} P_{ss'}^a V^*(s')$ )

**最优策略 $\pi^*(a|s)$：** 任何使得 $Q^*(s,a)$ 达到最大的动作都是最优动作。

$\pi^*(a|s) = \begin{cases} 1 & \text{if } a = \arg\max_{a' \in A} Q^*(s,a') \\ 0 & \text{otherwise} \end{cases}$ (对于确定性最优策略)

### 7. 贝尔曼方程 (Bellman Equations)

贝尔曼方程是价值函数必须满足的一组自洽性方程，它们将一个状态（或状态-动作对）的价值与其后继状态的价值联系起来。

描述了在给定策略 $\pi$ 下，价值函数与其后继价值函数之间的关系。

*   **状态价值函数 $V_\pi(s)$：**

    $$V_\pi(s) = E_\pi[R_{t+1} + \gamma V_\pi(S_{t+1}) | S_t=s]$$

    $$V_\pi(s) = \sum_{a \in A} \pi(a|s) \sum_{s' \in S} P(s'|s,a) [R(s,a,s') + \gamma V_\pi(s')]$$

    (PPT中: $V_\pi(s) = \sum_{a \in A} \pi(a|s) (\mathcal{R}_s^a + \gamma \sum_{s' \in S} P_{ss'}^a V_\pi(s'))$)

*   **动作价值函数 $Q_\pi(s,a)$：**

    $$Q_\pi(s,a) = E_\pi[R_{t+1} + \gamma Q_\pi(S_{t+1}, A_{t+1}) | S_t=s, A_t=a]$$

    $$Q_\pi(s,a) = \sum_{s' \in S} P(s'|s,a) [R(s,a,s') + \gamma \sum_{a' \in A} \pi(a'|s') Q_\pi(s',a')]$$

    PPT中: $Q_\pi(s,a) = \mathcal{R}_s^a + \gamma \sum_{s' \in S} P_{ss'}^a \sum_{a' \in A} \pi(a'|s')Q_\pi(s',a')$
    
    注意PPT中 $Q_\pi(s,a)$ 的贝尔曼方程有一页是 $Q_\pi(s,a) = \mathcal{R}_s^a + \gamma \sum_{s' \in S} P_{ss'}^a V_\pi(s')$，另一页是展开形式

!!! note "重点：贝尔曼最优方程 (Bellman Optimality Equations)"
    描述了最优价值函数 $V^*(s)$ 或 $Q^*(s,a)$ 与其后继状态的最优价值之间的关系。

    *   **最优状态价值函数 $V^*(s)$：**

        $$V^*(s) = \max_a E[R_{t+1} + \gamma V^*(S_{t+1}) | S_t=s, A_t=a]$$

        $$V^*(s) = \max_a \sum_{s' \in S} P(s'|s,a) [R(s,a,s') + \gamma V^*(s')]$$

        (PPT中: $V^*(s) = \max_a (\mathcal{R}_s^a + \gamma \sum_{s' \in S} P_{ss'}^a V^*(s'))$)

    *   **最优动作价值函数 $Q^*(s,a)$：**

        $$Q^*(s,a) = E[R_{t+1} + \gamma \max_{a'} Q^*(S_{t+1}, a') | S_t=s, A_t=a]$$

        $$Q^*(s,a) = \sum_{s' \in S} P(s'|s,a) [R(s,a,s') + \gamma \max_{a'} Q^*(s',a')]$$

        (PPT中: $Q^*(s,a) = \mathcal{R}_s^a + \gamma \sum_{s' \in S} P_{ss'}^a \max_{a'} Q^*(s',a')$)

!!! success "强化学习的应用进展"
    强化学习已在多个领域取得突破性进展，例如：

    *   **机器人控制：** Tokamak（核聚变反应堆）等离子体控制 (Nature 2022, 2024), 冠军级无人机竞速 (Nature 2023), 模拟果蝇运动 (Nature 2025)。
    *   **游戏AI：** AlphaGo (围棋, Science 2018), DouZero (斗地主), 掌握多种控制任务的世界模型 (Nature 2025)。
    *   **科学发现：** 蛋白质结构设计 (Science 2023), 发现更快的矩阵乘法算法 (Nature 2022)。
    *   **工程设计：** 芯片设计中的图布局优化 (Nature 2021)。
    *   **自动驾驶：** 自动驾驶汽车的安全性验证 (Nature 2023)。

??? summary "本节小结：强化学习基本概念"
    *   **强化学习基本要素：** 智能体 (Agent), 环境 (Environment), 状态 (State), 动作 (Action), 奖励 (Reward)。
    *   **马尔可夫决策过程 (MDP)：**
        *   五元组: $\langle S, A, P, R, \gamma \rangle$。
        *   策略函数: 确定性 $\pi(s)$ 或随机性 $\pi(a|s)$。
        *   累计折扣回报: $G_t = \sum_{k=0}^{\infty} \gamma^k R_{t+k+1}$。
        *   状态值函数: $V_\pi(s) = E_\pi[G_t | S_t=s]$。
        *   动作值函数: $Q_\pi(s,a) = E_\pi[G_t | S_t=s, A_t=a]$。
    *   **贝尔曼方程：**
        *   状态值函数 ($V_\pi$): $V_\pi(s) = \sum_a \pi(a|s) \sum_{s'} P(s'|s,a) [R(s,a,s') + \gamma V_\pi(s')]$。
        *   动作值函数 ($Q_\pi$): $Q_\pi(s,a) = \sum_{s'} P(s'|s,a) [R(s,a,s') + \gamma \sum_{a'} \pi(a'|s') Q_\pi(s',a')]$。
        *   最优状态值函数 ($V^*$): $V^*(s) = \max_a \sum_{s'} P(s'|s,a) [R(s,a,s') + \gamma V^*(s')]$。
        *   最优动作值函数 ($Q^*$): $Q^*(s,a) = \sum_{s'} P(s'|s,a) [R(s,a,s') + \gamma \max_{a'} Q^*(s',a')]$。

---

## 二、表格型强化学习

当状态空间 $S$ 和动作空间 $A$ 都是有限的时，我们可以用表格（如Q表）来存储价值函数或策略。这类方法适用于状态和动作数量较少的场景。

!!! example "表格型强化学习场景：冰湖 (Frozen Lake - Gym)"
    *   **环境描述：** 智能体在一个冰冻的湖面上行走，起点在左上角，目标（宝箱）在右下角，湖面上有若干冰洞。
    *   **状态：** 智能体在网格地图上的位置。
    *   **动作：** 上、下、左、右。由于冰面光滑，采取的动作不一定会导致预期的移动方向，存在一定的随机性。
    *   **奖励：** 到达宝箱位置获得正奖励，其他情况（如移动一步）无奖励或小的负奖励。掉入冰洞或到达目标状态则回合结束。
    *   **Q表：** 可以构建一个表格，行表示状态，列表示动作，单元格的值 $Q(s,a)$ 表示在状态 $s$ 执行动作 $a$ 的期望回报。根据Q表，每个状态的最优策略是选择具有最大Q值的动作。

**Q表更新方法分类：**

Q表通常初始化为全零或随机值，然后通过智能体与环境的交互不断更新。当Q表中的值收敛时，对应的策略即为最优策略。

*   **有环境模型的求解方法 (Model-based)：** 需要知道环境的状态转移函数 $P$ 和奖励函数 $R$。
    *   常用算法：**动态规划 (DP)**，包括策略迭代和值迭代。
*   **无环境模型的求解方法 (Model-free)：** 无需显式知道环境的 $P$ 和 $R$。通过智能体与环境交互产生的样本数据来更新Q值。
    *   常用算法：**蒙特卡洛方法 (MC)**，**时序差分方法 (TD)**。

### 1. 动态规划 (Dynamic Programming, DP)

动态规划是一类在已知环境模型（MDP的 $P$ 和 $R$）的情况下，求解最优策略的方法。它利用价值函数的贝尔曼方程进行计算。

!!! note "动态规划的核心思想"
    DP适用于具有以下两个性质的问题：

    1.  **最优子结构 (Optimal Substructure)：** 问题的最优解包含其子问题的最优解。贝尔曼方程正是这种性质的体现。
    2.  **重叠子问题 (Overlapping Subproblems)：** 在求解过程中，子问题会被多次重复计算。DP通过存储和复用子问题的解（如价值函数）来提高效率。

#### 1.1 策略评估 (Policy Evaluation)

!!! note "重点：策略评估"
    **目标：** 对于给定的策略 $\pi$，计算其状态价值函数 $V_\pi(s)$。

    **方法：** 迭代应用贝尔曼期望方程进行更新（同步更新，即一次迭代中更新所有状态的价值）：

    $V_{k+1}(s) \leftarrow \sum_{a \in A} \pi(a|s) \sum_{s' \in S} P(s'|s,a) [R(s,a,s') + \gamma V_k(s')]$

    这个迭代过程保证收敛到 $V_\pi(s)$。

    **收敛性：** 贝尔曼期望算子 $T^\pi$ 是一个 $\gamma$-压缩映射， $\|T^\pi U - T^\pi W\|_\infty \le \gamma \|U - W\|_\infty$。根据压缩映射定理，迭代 $V_{k+1} = T^\pi V_k$ 会收敛到唯一的固定点 $V_\pi$。

#### 1.2 策略提升 (Policy Improvement)

!!! note "重点：策略提升"
    **目标：** 基于当前策略 $\pi$ 的价值函数 $V_\pi(s)$（或 $Q_\pi(s,a)$），找到一个更好的策略 $\pi'$。

    **方法：** 对于每个状态 $s$，贪心地选择能够最大化 $Q_\pi(s,a)$ 的动作：

    $\pi'(s) = \arg\max_{a \in A} Q_\pi(s,a) = \arg\max_{a \in A} \sum_{s' \in S} P(s'|s,a) [R(s,a,s') + \gamma V_\pi(s')]$

    可以证明，这样得到的策略 $\pi'$ 满足 $V_{\pi'}(s) \ge V_\pi(s)$ 对所有 $s \in S$。

#### 1.3 策略迭代 (Policy Iteration)

!!! note "重点：策略迭代"
    策略迭代通过交替执行策略评估和策略提升来寻找最优策略。

    1.  **初始化：** 随机初始化策略 $\pi$ 和价值函数 $V$ (通常为0)。
    2.  **策略评估 (E)：** 根据当前策略 $\pi$，使用迭代的贝尔曼期望方程计算 $V_\pi(s)$ 直到收敛。
    3.  **策略提升 (I)：** 根据 $V_\pi(s)$，使用贪心方法更新策略 $\pi'(s) = \arg\max_a Q_\pi(s,a)$。
    4.  如果 $\pi' = \pi$，则策略已收敛到最优策略 $\pi^*$，算法结束。否则，令 $\pi \leftarrow \pi'$，返回步骤2。

    这个过程最终会收敛到最优策略 $\pi^*$ 和最优价值函数 $V^*$。

#### 1.4 值迭代 (Value Iteration)

!!! note "重点：值迭代"
    值迭代是另一种DP方法，它直接通过迭代贝尔曼最优方程来寻找最优价值函数 $V^*(s)$，从而避免了策略评估中可能需要的多次完整迭代。

    **方法：** 迭代更新价值函数（同步更新）：

    $V_{k+1}(s) \leftarrow \max_{a \in A} \sum_{s' \in S} P(s'|s,a) [R(s,a,s') + \gamma V_k(s')]$
    当 $V_k(s)$ 收敛到 $V^*(s)$ 后，最优策略 $\pi^*(s)$ 可以通过一步策略提升直接提取：
    $\pi^*(s) = \arg\max_{a \in A} \sum_{s' \in S} P(s'|s,a) [R(s,a,s') + \gamma V^*(s')]$

??? summary "动态规划算法总结"
    | 求解问题             | 使用贝尔曼方程类型     | 算法名称     |
    |----------------------|------------------------|--------------|
    | 预测 (求解价值函数)  | 贝尔曼期望方程         | 策略评估     |
    | 控制 (求解最优策略)  | 贝尔曼期望方程 + 贪心提升 | 策略迭代     |
    | 控制 (求解最优策略)  | 贝尔曼最优方程         | 值迭代       |
    *DP算法的迭代复杂度对于 $N$ 个状态和 $M$ 个动作的MDP，每次迭代通常是 $O(MN^2)$ 或 $O(M^2N)$ (取决于实现和 $P$ 的稀疏性)。*

### 2. 蒙特卡洛方法 (Monte Carlo, MC)

蒙特卡洛方法是无模型的，它通过从环境中采样完整的经验轨迹 (episodes) 来学习价值函数和策略，不需要知道环境的动态特性 $P$ 和 $R$。

#### 2.1 蒙特卡洛策略评估

!!! note "重点：蒙特卡洛策略评估"
    **目标：** 在给定策略 $\pi$ 的情况下，估计其价值函数 $V_\pi(s)$ 或 $Q_\pi(s,a)$。

    **方法：**

    1.  智能体遵循策略 $\pi$ 与环境交互，生成多条完整的经验轨迹。
    2.  对于每个状态 $s$（或状态-动作对 $(s,a)$）：
        *   **首次访问MC (First-Visit MC)：** 在每条轨迹中，只考虑状态 $s$ (或 $(s,a)$) 第一次出现后的回报 $G_t$。
        *   **每次访问MC (Every-Visit MC)：** 在每条轨迹中，考虑状态 $s$ (或 $(s,a)$) 每次出现后的回报 $G_t$。
    3.  将所有这些回报取平均值作为 $V_\pi(s)$ (或 $Q_\pi(s,a)$) 的估计。

        $V_\pi(s) \approx \text{Average}(G_t \text{ for first/every visit to } s)$

        $Q_\pi(s,a) \approx \text{Average}(G_t \text{ for first/every visit to } (s,a))$

    首次访问MC是 $V_\pi(s)$ 的无偏估计。每次访问MC虽然有偏，但通常方差更小，且在访问次数趋于无穷时也会收敛。

#### 2.2 蒙特卡洛控制 (MC Control)

为了找到最优策略，MC方法同样采用广义策略迭代 (GPI) 的思想：交替进行策略评估和策略提升。

*   **策略评估：** 使用MC方法估计当前策略 $\pi$ 的 $Q_\pi(s,a)$。
*   **策略提升：** 基于估计的 $Q_\pi(s,a)$，使用 $\epsilon$-贪心策略来改进 $\pi$。

!!! note "重点：$\epsilon$-贪心策略 (Epsilon-Greedy Policy)"
    为了确保在学习过程中进行充分的探索（即尝试所有可能的动作，而不仅仅是当前认为最优的动作），通常采用 $\epsilon$-贪心策略：

    *   以 $1-\epsilon$ 的概率选择当前估计的具有最大 $Q(s,a)$ 值的动作 (exploitation)。
    *   以 $\epsilon$ 的概率从所有可用动作中随机选择一个动作 (exploration)。

    $\pi(a|s) = \begin{cases} 1-\epsilon + \epsilon/|A(s)| & \text{if } a = \arg\max_{a' \in A(s)} Q(s,a') \\ \epsilon/|A(s)| & \text{otherwise} \end{cases}$

    其中 $|A(s)|$ 是状态 $s$ 下可用动作的数量。

**MC控制算法（首次访问，$\epsilon$-贪心）：**

1.  初始化 $Q(s,a)$ 和 $\pi(s)$ (例如，$\epsilon$-贪心于 $Q$)。
2.  对每个回合 (episode)：
    a.  使用当前策略 $\pi$ 生成一个完整的轨迹：$S_0, A_0, R_1, S_1, A_1, R_2, \dots, S_T$.
    b.  对于轨迹中的每个时间步 $t=0, 1, \dots, T-1$:
        i.  计算从该步开始的回报 $G_t = \sum_{k=0}^{T-1-t} \gamma^k R_{t+k+1}$。
        ii. 如果 $(S_t, A_t)$ 是首次出现在从时间0到 $t$ 的序列中：
            1.  将 $G_t$ 添加到 $Returns(S_t, A_t)$ 列表中。
            2.  更新 $Q(S_t, A_t) = \text{Average}(Returns(S_t, A_t))$。
            3.  更新策略 $\pi(S_t)$ 使其对 $Q(S_t, \cdot)$ 是 $\epsilon$-贪心的。

!!! note "增量式更新 (Incremental Update)"
    为了避免存储所有回报然后计算平均值，可以使用增量式均值更新：

    $Q_{k+1}(s,a) = Q_k(s,a) + \frac{1}{N_k(s,a)+1} (G_{k+1} - Q_k(s,a))$

    或者使用固定学习率 $\alpha$:

    $Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha (G_t - Q(S_t, A_t))$

**MC方法的优缺点：**

*   **优点：**
    *   无模型，不需环境动态。
    *   可从实际或模拟经验中学习。
    *   适用于非马尔可夫环境（因为它不依赖于单步转移）。
    *   评估某个状态的价值与其他状态无关。
*   **缺点：**
    *   只能用于有明确结束的回合制任务 (episodic tasks)。
    *   策略评估需要等到整个回合结束后才能进行，学习效率可能较低。
    *   如果采样回合数不足，容易收敛到次优策略。
    *   回报的方差可能较大。

### 3. 时序差分学习 (Temporal Difference, TD)

TD学习是强化学习中一种核心且新颖的思想，它结合了DP和MC方法的优点。TD方法像MC一样从经验中学习，无需环境模型；像DP一样，它也使用自举 (bootstrapping)，即用当前估计的价值函数来更新自身。

!!! note "TD学习的核心思想"
    TD学习在每一步之后（或几步之后）就更新价值估计，而不是等到整个回合结束。它使用当前获得的即时奖励和下一状态的估计价值来更新当前状态的价值。
    基本TD(0)更新规则 (用于策略评估 $V_\pi$):

    $V(S_t) \leftarrow V(S_t) + \alpha [R_{t+1} + \gamma V(S_{t+1}) - V(S_t)]$

    *   **TD目标 (TD Target)：** $R_{t+1} + \gamma V(S_{t+1})$

    *   **TD误差 (TD Error) $\delta_t$：** $\delta_t = R_{t+1} + \gamma V(S_{t+1}) - V(S_t)$

    *   $\alpha$ 是学习率。

**TD vs. MC vs. DP:**

*   **DP：** 需要完整模型，进行期望更新。
*   **MC：** 无需模型，使用完整样本回报进行更新，方差大，偏差小（对于$V_\pi$的估计）。
*   **TD：** 无需模型，使用单步实际奖励和估计的下一状态价值进行更新，方差小，有偏（因为依赖于$V(S_{t+1})$的估计）。

**偏差 (Bias) 与方差 (Variance) 权衡：**

*   **MC：** $G_t$ 是 $V_\pi(S_t)$ 的无偏估计，但由于依赖于一个完整轨迹中的所有随机奖励和动作，其方差较大。
*   **TD(0)：** TD目标 $R_{t+1} + \gamma V(S_{t+1})$ 是 $V_\pi(S_t)$ 的有偏估计（因为 $V(S_{t+1})$ 本身是估计值），但由于只依赖于一个实际奖励 $R_{t+1}$ 和一个估计值 $V(S_{t+1})$，其方差通常比MC小。

#### 3.1 n-步TD学习 (n-step TD Learning)

n-步TD是MC和TD(0)之间的一个折中。它向前看 $n$ 步的实际奖励，然后使用第 $n$ 步之后状态的估计价值。

*   **n-步回报 $G_t^{(n)}$：**
    $G_t^{(n)} = R_{t+1} + \gamma R_{t+2} + \dots + \gamma^{n-1} R_{t+n} + \gamma^n V(S_{t+n})$
*   **n-步TD更新：**
    $V(S_t) \leftarrow V(S_t) + \alpha [G_t^{(n)} - V(S_t)]$
    当 $n=1$ 时，是TD(0)。当 $n \rightarrow \infty$ (或 $n$ 达到回合结束)，则近似于MC。

#### 3.2 TD($\lambda$)

TD($\lambda$) 结合了所有不同 $n$ 步回报的优点，通过对它们进行加权平均。

*   **$\lambda$-回报 $G_t^\lambda$：**
    $G_t^\lambda = (1-\lambda) \sum_{n=1}^{\infty} \lambda^{n-1} G_t^{(n)}$
    其中 $\lambda \in [0,1]$。当 $\lambda=0$ 时，是TD(0)回报。当 $\lambda=1$ 时，是MC回报。
*   **前向视角TD($\lambda$)更新：**
    $V(S_t) \leftarrow V(S_t) + \alpha [G_t^\lambda - V(S_t)]$
    前向视角在概念上简单，但计算上需要在回合结束后才能进行。实际中常用资格迹 (eligibility traces) 实现后向视角TD($\lambda$)，可以在线更新。

#### 3.3 SARSA (State-Action-Reward-State-Action)

SARSA是一种**同策略 (on-policy)** TD控制算法。它学习动作价值函数 $Q(s,a)$。

"同策略"意味着用于生成行为的策略与正在评估和改进的策略是同一个。

**SARSA更新规则：**

基于转移 $(S_t, A_t, R_{t+1}, S_{t+1}, A_{t+1})$:
$Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha [R_{t+1} + \gamma Q(S_{t+1}, A_{t+1}) - Q(S_t, A_t)]$

智能体在状态 $S_t$ 选择动作 $A_t$，观察到奖励 $R_{t+1}$ 和下一状态 $S_{t+1}$，然后在 $S_{t+1}$ 根据当前策略选择动作 $A_{t+1}$，之后用 $Q(S_{t+1}, A_{t+1})$ 来更新 $Q(S_t, A_t)$。

**SARSA算法流程 ($\epsilon$-贪心策略)：**

1.  初始化 $Q(s,a)$ 对所有 $s,a$ (例如，为0)，$\epsilon > 0$。
2.  对每个回合：
    a.  初始化 $S$。
    b.  使用 $Q$ 和 $\epsilon$-贪心策略从 $S$ 选择动作 $A$。
    c.  只要 $S$ 不是终止状态：
        i.   执行动作 $A$，观察 $R, S'$。
        ii.  使用 $Q$ 和 $\epsilon$-贪心策略从 $S'$ 选择动作 $A'$。
        iii. 更新 $Q(S,A) \leftarrow Q(S,A) + \alpha [R + \gamma Q(S',A') - Q(S,A)]$。
        iv.  $S \leftarrow S'$, $A \leftarrow A'$。

#### 3.4 Q-Learning

Q-Learning是一种**异策略 (off-policy)** TD控制算法。它也学习动作价值函数 $Q(s,a)$。

"异策略"意味着用于生成行为的策略（行为策略）可以不同于正在评估和改进的策略（目标策略）。Q-Learning的目标策略是贪心策略，而其行为策略通常是 $\epsilon$-贪心策略以保证探索。

**Q-Learning更新规则：**

基于转移 $(S_t, A_t, R_{t+1}, S_{t+1})$:
$Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha [R_{t+1} + \gamma \max_{a'} Q(S_{t+1}, a') - Q(S_t, A_t)]$

注意，更新中使用的 $\max_{a'} Q(S_{t+1}, a')$ 是基于目标策略（贪心策略）在下一状态 $S_{t+1}$ 所能获得的最好价值，而实际在 $S_{t+1}$ 采取的动作（由行为策略决定）并不直接用于这个更新目标。

**Q-Learning算法流程 ($\epsilon$-贪心行为策略)：**

1.  初始化 $Q(s,a)$ 对所有 $s,a$ (例如，为0)，$\epsilon > 0$。
2.  对每个回合：
    a.  初始化 $S$。
    b.  只要 $S$ 不是终止状态：
        i.   使用 $Q$ 和 $\epsilon$-贪心策略从 $S$ 选择动作 $A$ (行为策略)。
        ii.  执行动作 $A$，观察 $R, S'$。
        iii. 更新 $Q(S,A) \leftarrow Q(S,A) + \alpha [R + \gamma \max_{a'} Q(S',a') - Q(S,A)]$ (目标策略是贪心)。
        iv.  $S \leftarrow S'$。

!!! contrast "同策略 (On-Policy) vs. 异策略 (Off-Policy)"
    *   **同策略 (On-Policy)：** 学习的策略和用于收集数据的行为策略是同一个。例如SARSA。
        *   优点：通常更稳定，直接优化当前行为策略的性能。
        *   缺点：探索和利用的平衡直接影响学习效果。如果行为策略为了探索而不选择最优动作，那么学习到的价值也是基于这种次优探索行为的。
    *   **异策略 (Off-Policy)：** 学习的策略（目标策略）和用于收集数据的行为策略可以不同。例如Q-Learning。
        *   优点：可以从历史数据或其他策略（甚至是人类演示）中学习。行为策略可以大胆探索，而目标策略仍然学习最优行为。
        *   缺点：更新可能方差更大，收敛性有时更难保证（需要重要性采样等技术，但Q-Learning的特定形式避免了显式重要性采样）。

??? summary "表格型强化学习算法小结"
    *   **动态规划 (DP)：**
        *   基于模型，使用期望更新。
        *   策略评估：计算给定策略的价值函数。
        *   策略提升：根据价值函数改进策略。
        *   策略迭代/值迭代：找到最优策略和价值函数。
    *   **蒙特卡洛方法 (MC)：**
        *   无模型，使用完整回合的样本回报更新。
        *   首次访问/每次访问MC。
        *   高方差，零偏差（对于$V_\pi$）。
    *   **时序差分学习 (TD)：**
        *   无模型，使用单步或多步的实际奖励和后续状态的估计价值（自举）更新。
        *   TD(0), n-step TD, TD($\lambda$)。
        *   SARSA (同策略)，Q-Learning (异策略)。
        *   通常比MC方差小，但有偏。

---

## 三、深度强化学习 (Deep Reinforcement Learning, DRL)

表格型强化学习方法在状态和动作空间较小的问题上表现良好。然而，当状态或动作空间非常大，甚至是连续的时候（例如，从图像输入学习，或控制机器人手臂），表格方法面临“维度灾难”，无法存储和有效学习Q表或策略表。

**深度强化学习 (DRL) 的出现：**
DRL将深度学习（特别是深度神经网络DNN）与强化学习相结合。DNN作为函数逼近器，可以用来表示：
*   价值函数 (例如, $Q(s,a;\theta)$)
*   策略函数 (例如, $\pi(a|s;\theta)$)
*   甚至环境模型

这使得RL能够处理高维输入（如图像、文本）和复杂的、大规模的状态/动作空间。

### 1. 基于值函数的DRL (Value-Based DRL)

这类算法的核心是学习一个动作价值函数 $Q(s,a;\theta)$（Q网络），然后通过最大化Q值来得到策略。

#### 1.1 Naïve DQN (Deep Q-Network)

最直接的想法是将Q-Learning中的Q表替换为一个神经网络 $Q(s,a;\theta)$。

**损失函数：** 最小化均方贝尔曼误差 (MSBE):

$L(\theta) = E_{(s,a,r,s') \sim \mathcal{D}} \left[ (y - Q(s,a;\theta))^2 \right]$
其中，TD目标 $y = r + \gamma \max_{a'} Q(s',a';\theta)$。
梯度更新：$\theta \leftarrow \theta - \alpha \nabla_\theta L(\theta)$。

**在线Naïve DQN存在的问题：**

1.  **样本相关性：** 连续的样本 $(s_t, a_t, r_{t+1}, s_{t+1})$ 和 $(s_{t+1}, a_{t+1}, r_{t+2}, s_{t+2})$ 高度相关，违反了许多监督学习算法的独立同分布 (i.i.d) 假设，导致训练不稳定。
2.  **目标非平稳性：** 在计算TD目标 $y$ 时， $Q(s',a';\theta)$ 自身也在随着 $\theta$ 的更新而改变。这意味着我们追逐一个移动的目标，可能导致训练震荡或发散。这被称为半梯度 (semi-gradient) 问题，因为目标 $y$ 依赖于参数 $\theta$，但在计算梯度时我们通常忽略这一点。

#### 1.2 经典DQN (Mnih et al., 2013, 2015)

为了解决Naïve DQN的问题，经典DQN引入了两个关键技术：

!!! note "重点：经验回放 (Experience Replay)"
    *   **机制：** 将智能体与环境交互产生的转移 $(s_t, a_t, r_{t+1}, s_{t+1})$ 存储在一个固定大小的回放缓冲区 (replay buffer) $\mathcal{B}$ 中。
    *   **训练：** 在训练Q网络时，从缓冲区中随机采样一个小批量 (mini-batch) 的转移数据进行学习。
    *   **优点：**
        *   **打破样本相关性：** 随机采样使得训练样本近似i.i.d。
        *   **数据重用：** 一条经验可以被多次用于训练，提高数据利用率。
        *   **平滑学习：** 平均了许多先前状态的行为，避免了策略的剧烈摆动。

!!! note "重点：目标网络 (Target Network)"
    *   **机制：** 使用两个独立的Q网络：
        *   **在线网络 (Online Network) $Q(s,a;\theta)$：** 用于选择当前动作和进行参数更新。
        *   **目标网络 (Target Network) $Q(s,a;\theta^-)$：** 用于计算TD目标 $y = r + \gamma \max_{a'} Q(s',a';\theta^-)$。
    *   **更新：** 在线网络的参数 $\theta$ 正常通过梯度下降更新。目标网络的参数 $\theta^-$ 则定期（例如每 $C$ 步）从在线网络复制过来：$\theta^- \leftarrow \theta$。或者使用软更新：$\theta^- \leftarrow \tau\theta + (1-\tau)\theta^-$。
    *   **优点：**
        *   **稳定目标：** 目标网络参数在一段时间内保持固定，使得TD目标 $y$ 更加稳定，减少了训练的震荡。

**经典DQN的损失函数：**

$L(\theta) = E_{(s,a,r,s') \sim U(\mathcal{B})} \left[ (r + \gamma \max_{a'} Q(s',a';\theta^-) - Q(s,a;\theta))^2 \right]$

#### 1.3 DQN的改进

!!! note "Double DQN (DDQN)"
    *   **问题：** 标准DQN中的 $\max$ 操作符会导致对Q值的系统性高估 (maximization bias)。这是因为 $E[\max_a X_a] \ge \max_a E[X_a]$。
    *   **解决方案：** 解耦目标Q值计算中的动作选择和动作评估。使用在线网络选择最优动作，使用目标网络评估该动作的Q值。
        $y^{DDQN} = r + \gamma Q(s', \arg\max_{a'} Q(s',a';\theta);\theta^-)$
    *   **优点：** 显著减少了Q值的高估，通常能学习到更好的策略。

!!! note "Dueling DQN"
    *   **思想：** 将Q网络分解为两个独立的流：
        *   **状态价值函数 $V(s;\theta_V, \beta)$：** 估计状态 $s$ 的价值。
        *   **优势函数 $A(s,a;\theta_A, \alpha)$：** 估计在状态 $s$ 下采取动作 $a$ 相对于平均动作的优势。$A(s,a) = Q(s,a) - V(s)$。
    *   **合并：** $Q(s,a) = V(s) + (A(s,a) - \text{mean}_{a'} A(s,a'))$ 或 $Q(s,a) = V(s) + (A(s,a) - \max_{a'} A(s,a'))$ (后者需要 $A(s, \arg\max_a A(s,a)) = 0$ 的约束)。
        PPT中给出的是 $Q(s,a;\theta,\alpha,\beta) = V(s;\theta,\beta) + (A(s,a;\theta,\alpha) - \frac{1}{|\mathcal{A}|}\sum_{a'}A(s,a';\theta,\alpha))$
    *   **优点：**
        *   能够更有效地学习状态价值，即使某些动作不重要。
        *   当动作对状态价值影响不大时，网络主要学习 $V(s)$。
        *   通常能更快收敛并达到更好的性能。

!!! note "优先经验回放 (Prioritized Experience Replay - PER)"
    *   **思想：** 并非所有经验都是同等重要的。TD误差大的转移（即智能体感到“惊讶”的转移）包含更多学习信息。
    *   **机制：**
        *   赋予每个转移 $(s,a,r,s')$ 一个优先级 $p_i \propto |\delta_i|^\omega + \epsilon_{per}$，其中 $\delta_i$ 是TD误差，$\omega$ 控制优先化程度。
        *   从回放缓冲区中根据优先级进行采样，高优先级的样本更容易被选中。
        *   为了修正这种有偏采样引入的偏差，使用重要性采样 (Importance Sampling, IS) 权重 $w_i = (N \cdot P(i))^{-\beta_{is}}$ 来调整梯度更新，其中 $N$ 是缓冲区大小，$P(i)$ 是采样概率，$\beta_{is}$ 随训练从0退火到1。
    *   **优点：** 显著提高学习效率和最终性能。

!!! note "Rainbow DQN"
    Rainbow DQN 整合了DQN的多种重要改进技术，包括：
    
    *   Double DQN
    *   Dueling DQN
    *   Prioritized Experience Replay (PER)
    *   Multi-step Learning (使用n-步回报作为TD目标)
    *   Distributional RL (学习Q值的完整分布，而不仅仅是期望)
    *   Noisy Nets (在网络权重中加入参数化噪声以进行探索，替代$\epsilon$-greedy)

    Rainbow DQN在许多Atari游戏上取得了当时SOTA的性能。

### 2. 基于策略的DRL (Policy-Based DRL)

这类算法直接参数化策略 $\pi(a|s;\theta)$，并通过优化某个性能指标 $J(\theta)$ (通常是期望累积回报) 来学习策略参数 $\theta$。

!!! note "策略梯度定理 (Policy Gradient Theorem)"
    该定理提供了一种计算性能指标 $J(\theta)$ 关于策略参数 $\theta$ 的梯度的方法，而不需要对状态分布或环境动态求导。

    $\nabla_\theta J(\theta) = E_{\tau \sim \pi_\theta} \left[ \sum_{t=0}^{T-1} \nabla_\theta \log \pi_\theta(A_t|S_t) G_t \right]$

    或者，更常用的形式是：

    $\nabla_\theta J(\theta) = E_{\pi_\theta} \left[ \nabla_\theta \log \pi_\theta(A_t|S_t) Q^{\pi_\theta}(S_t,A_t) \right]$

    其中 $Q^{\pi_\theta}(S_t,A_t)$ 是在策略 $\pi_\theta$ 下，状态 $S_t$ 执行动作 $A_t$ 的动作价值。

    $\nabla_\theta \log \pi_\theta(A_t|S_t)$ 称为得分函数 (score function)。

#### 2.1 REINFORCE (Monte Carlo Policy Gradient)

REINFORCE是最早也是最简单的策略梯度算法之一。它使用蒙特卡洛方法估计 $Q^{\pi_\theta}(S_t,A_t)$，即使用整个回合的实际回报 $G_t$。

**更新规则：**

$\theta \leftarrow \theta + \alpha \nabla_\theta \log \pi_\theta(A_t|S_t) G_t$
(通常在一个回合结束后，对该回合内所有步的梯度进行累加或平均)

**REINFORCE算法流程：**

1.  初始化策略参数 $\theta$。
2.  重复：
    a.  使用当前策略 $\pi_\theta$ 生成一个完整的经验轨迹：$S_0, A_0, R_1, \dots, S_{T-1}, A_{T-1}, R_T$。
    b.  对于轨迹中的每个时间步 $t=0, \dots, T-1$：
        i.   计算从该步开始的回报 $G_t = \sum_{k=t}^{T-1} \gamma^{k-t} R_{k+1}$。
        ii.  更新参数：$\theta \leftarrow \theta + \alpha \gamma^t \nabla_\theta \log \pi_\theta(A_t|S_t) G_t$ (有时 $\gamma^t$ 因子被省略或学习率吸收)。

**REINFORCE的缺点：**

*   **高方差：** $G_t$ 作为 $Q^{\pi_\theta}(S_t,A_t)$ 的估计，其方差非常大，导致学习过程缓慢且不稳定。
*   **同策略：** 必须使用当前策略采样，数据利用率低。

!!! note "基线 (Baseline) 技巧"
    为了减小策略梯度的方差，可以从回报 $G_t$ 中减去一个不依赖于动作 $A_t$ 的基线 $b(S_t)$。

    $\nabla_\theta J(\theta) = E_{\pi_\theta} \left[ \nabla_\theta \log \pi_\theta(A_t|S_t) (G_t - b(S_t)) \right]$

    一个常用的基线是状态价值函数 $V^{\pi_\theta}(S_t)$。此时 $(G_t - V^{\pi_\theta}(S_t))$ 是优势函数 $A^{\pi_\theta}(S_t,A_t)$ 的一个（有偏）估计。

    减去基线不改变梯度的期望，但可以显著降低其方差。

### 3. 基于演员-评论家 (Actor-Critic, AC) 的DRL

Actor-Critic方法结合了基于值函数和基于策略方法的优点。它维护两个网络：

*   **演员 (Actor)：** 策略网络 $\pi(a|s;\theta_\pi)$，负责选择动作。
*   **评论家 (Critic)：** 价值网络 $V(s;\theta_v)$ 或 $Q(s,a;\theta_q)$，负责评估演员选择的动作的好坏。

**基本思想：**

1.  **演员** 根据当前策略 $\pi_\theta$ 选择动作 $A_t$。
2.  **评论家** 评估这个动作，例如计算TD误差：$\delta_t = R_{t+1} + \gamma V(S_{t+1};\theta_v) - V(S_t;\theta_v)$ (如果评论家是 $V$ 网络)。
3.  **演员** 根据评论家的评估（如TD误差）更新其策略参数 $\theta_\pi$：

    $\theta_\pi \leftarrow \theta_\pi + \alpha_\pi \nabla_{\theta_\pi} \log \pi(A_t|S_t;\theta_\pi) \delta_t$

5.  **评论家** 也根据TD学习规则更新其价值参数 $\theta_v$：
    $\theta_v \leftarrow \theta_v + \alpha_v \delta_t \nabla_{\theta_v} V(S_t;\theta_v)$

#### 3.1 优势演员-评论家 (Advantage Actor-Critic, A2C)

A2C是一种常用的AC变体，其中评论家学习状态价值函数 $V(s)$，并使用优势函数 $A(s,a) = Q(s,a) - V(s)$ 来指导演员的学习。

优势函数可以用TD误差来估计： $A(S_t, A_t) \approx R_{t+1} + \gamma V(S_{t+1}) - V(S_t)$。

*   **演员更新 (策略梯度)：**
    $\nabla_{\theta_\pi} J(\theta_\pi) \approx \nabla_{\theta_\pi} \log \pi(A_t|S_t;\theta_\pi) [R_{t+1} + \gamma V(S_{t+1};\theta_v) - V(S_t;\theta_v)]$
*   **评论家更新 (最小化 $V$ 的预测误差)：**
    $L(\theta_v) = (R_{t+1} + \gamma V(S_{t+1};\theta_v) - V(S_t;\theta_v))^2$

**A3C (Asynchronous Advantage Actor-Critic):**

A3C是A2C的一个重要变种，它使用多个并行的actor-learner在环境的不同副本中异步地收集经验和更新全局参数。这有助于打破样本相关性并加速学习。

**AC算法的神经网络架构：**

*   **方案一：** 两个独立的神经网络分别拟合Actor (策略) 和 Critic (价值)。
    *   优点：简单，训练可能更稳定。
    *   缺点：训练效率可能较低。
*   **方案二：** Actor和Critic共享前面几层的特征提取网络，最后有各自的输出层。
    *   优点：参数量少，训练效率可能更高。
    *   缺点：策略和价值可能需要不同的特征，共享可能导致冲突，训练稳定性可能稍差。

??? summary "深度强化学习小结"
    *   **基于值的DRL：**
        *   **DQN：** 核心思想是使用神经网络逼近Q函数。
        *   **关键技术：** 经验回放、目标网络。
        *   **改进：** Double DQN (减少过高估计), Dueling DQN (分解V和A), Prioritized Experience Replay (优先处理重要样本), Rainbow DQN (集大成者)。
    *   **基于策略的DRL：**
        *   **REINFORCE：** 蒙特卡洛策略梯度，方差大。
        *   **基线：** 引入基线 (如状态价值函数) 减小方差。
    *   **基于Actor-Critic的DRL：**
        *   **Actor (策略网络) + Critic (价值网络)。**
        *   **A2C/A3C：** 使用优势函数指导策略学习。
        *   结合了值方法和策略方法的优点，通常具有较好的稳定性和样本效率。

---

## 四、多智能体强化学习 (Multi-Agent Reinforcement Learning, MARL)

当环境中存在多个智能体同时学习和交互时，问题就从单智能体强化学习 (SARL) 扩展到了多智能体强化学习 (MARL)。

**SARL vs. MARL:**

*   **SARL：**
    *   单个智能体与环境交互。
    *   环境状态转移和奖励主要由环境本身决定。
    *   智能体决策相对独立。
    *   环境通常被视为“静态”的（从智能体学习的角度）。
*   **MARL：**
    *   多个智能体同时与环境（以及彼此）交互。
    *   一个智能体的动作不仅影响环境，也可能影响其他智能体的状态、观察和奖励。
    *   智能体的决策是相互依赖的。
    *   环境是“非平稳”的：当一个智能体改变其策略时，对于其他智能体来说，环境的动态特性也随之改变。
    *   每个智能体可能有自己的奖励函数，或者共享团队奖励。

**MARL面临的困境：**

*   **环境的非平稳性 (Non-stationarity)：** 其他智能体的策略变化使得当前智能体感知的环境动态不稳定。
*   **部分可观测性 (Partial Observability)：** 智能体通常只能观察到环境的局部信息。
*   **维度灾难 (Curse of Dimensionality)：** 联合状态空间和联合动作空间随智能体数量指数增长。
*   **策略协同与通信 (Strategy Coordination and Communication)：** 在合作任务中，智能体需要协同策略，有时需要显式通信。
*   **博弈与对抗 (Game Theory and Adversarial Behavior)：** 在竞争性环境中，智能体行为可能是对抗性的。
*   **信任分配 (Credit Assignment)：** 在团队奖励下，难以判断个体智能体的贡献。

**MARL算法分类思路：**

*   **独立学习 (Independent Learners, IL)：** 每个智能体独立使用SARL算法学习，将其他智能体视为环境的一部分。例如，IQL (Independent Q-Learning)。
*   **通信机制 (Communication)：** 允许智能体之间传递信息以辅助决策。
*   **协同学习 (Coordination)：** 设计机制使智能体能够协同行动，即使只有局部观察。
*   **智能体建模 (Agent Modeling)：** 智能体尝试推理或学习其他智能体的策略或目标。

**MARL场景分类：**

*   **合作型场景 (Cooperative)：** 所有智能体共享一个团队目标，最大化共同奖励。
*   **竞争性场景 (Competitive)：** 智能体目标冲突，通常是零和博弈（一个赢则另一个输）。
*   **混合场景 (Mixed/General-sum)：** 智能体之间既有合作也有竞争。

### 1. 基于策略的MARL —— MADDPG

**MADDPG (Multi-Agent Deep Deterministic Policy Gradient)** 是一种适用于混合合作竞争场景的算法，它采用了**中心化训练，分布式执行 (Centralized Training with Decentralized Execution, CTDE)** 的框架。

*   **中心化训练：** 在训练阶段，每个智能体的评论家 (Critic) 可以访问所有智能体的全局状态和动作信息，从而更好地评估当前联合动作的价值，缓解非平稳性问题。
*   **分布式执行：** 在执行阶段，每个智能体的演员 (Actor) 仅根据自己的局部观察来选择动作。
每个智能体 $i$ 学习一个确定性策略 $\mu_i(o_i;\theta_i)$ 和一个中心化的Q函数 $Q_i(x, a_1, \dots, a_N;\phi_i)$，其中 $x$ 是全局状态，$a_j$ 是智能体 $j$ 的动作。

### 2. 基于值函数的MARL —— VDN

**VDN (Value Decomposition Networks)** 是一种适用于合作型MARL的算法，旨在解决信任分配问题。

*   **核心思想：** 将团队的联合Q值函数 $Q_{tot}$ 分解为每个智能体局部Q值函数 $Q_i$ 的和：
    $Q_{tot}(\mathbf{\tau}, \mathbf{u}) = \sum_{i=1}^N Q_i(\tau_i, u_i)$
    其中 $\mathbf{\tau}$ 是联合观察，$\mathbf{u}$ 是联合动作，$\tau_i, u_i$ 是智能体 $i$ 的局部观察和动作。
*   **优点：**
    *   简化了联合Q函数的学习。
    *   通过加性分解，隐式地将团队奖励分配给各个智能体。
    *   也遵循CTDE框架：训练时使用 $Q_{tot}$，执行时每个智能体根据自己的 $Q_i$ 贪心选择动作。
*   **Mixing Network：** VDN使用一个简单的求和作为混合网络。后续的QMIX等算法使用了更复杂的非线性混合网络，同时保证了IGM (Individual-Global-Max) 原则，即全局最优动作可以通过每个智能体的局部最优动作得到。

??? summary "多智能体强化学习小结"
    *   **MARL定义：** 多个智能体在共享环境中交互学习。
    *   **MARL困境：** 非平稳性、部分可观测性、维度灾难、协同/通信、信任分配等。
    *   **MARL算法分类：** 独立学习、通信、协同、智能体建模。
    *   **MARL场景：** 合作、竞争、混合。
    *   **代表性算法：**
        *   MADDPG (基于策略，CTDE，适用于混合场景)。
        *   VDN (基于值函数，值分解，CTDE，适用于合作场景)。