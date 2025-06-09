# 搜索技术

## 一、搜索问题形式化

### 1.1 基本要素
- **状态空间** $S$：所有可能状态的集合
- **动作** $A(s)$：在状态 $s$ 下可执行的动作集合
- **初始状态** $s_0 \in S$
- **目标状态** $G \subseteq S$
- **路径成本** $c(s,a,s')$：执行动作 $a$ 从 $s$ 到 $s'$ 的成本
- **解**：动作序列 $\pi = \langle a_1, a_2, \dots, a_k \rangle$

### 1.2 问题示例
**罗马尼亚旅行问题**：

- 状态空间：城市集合
- 动作：移动到相邻城市
- 初始状态：Arad
- 目标状态：Bucharest
- 路径成本：城市间距离

**八数码问题**：

- 状态空间：$9!$ 种排列
- 动作：移动空格（上/下/左/右）
- 初始状态：随机排列
- 目标状态：有序排列
- 路径成本：移动次数

## 二、盲目搜索算法

### 2.1 算法比较
| 算法 | 选择策略 | 完备性 | 最优性 | 时间复杂度 | 空间复杂度 | 特点 |
|------|----------|--------|--------|------------|------------|------|
| **BFS** | FIFO队列 | 是 | 是(成本一致) | $O(b^d)$ | $O(b^d)$ | 层级扩展，内存消耗大 |
| **DFS** | LIFO栈 | 有限状态空间是 | 否 | $O(b^m)$ | $O(bm)$ | 深度优先，内存效率高 |
| **UCS** | $g(n)$最小优先 | 是 | 是 | $O(b^{1+\lfloor C^*/\epsilon \rfloor})$ | $O(b^{1+\lfloor C^*/\epsilon \rfloor})$ | 成本最优，扩展最低成本节点 |
| **DLS** | LIFO栈(深度$L$) | $L \geq d$时是 | 否 | $O(b^L)$ | $O(bL)$ | 深度受限的DFS |
| **IDS** | 递增$L$的DLS | 是 | 是 | $O(b^d)$ | $O(bd)$ | 结合BFS完备性和DFS空间效率 |

其中：

- $b$: 分支因子
- $d$: 最优解深度
- $m$: 最大深度
- $C^*$: 最优解成本
- $\epsilon$: 最小动作成本

### 2.2 环检测技术
1. **路径检测**：

$$n \notin \text{path}(parent(n))$$

   避免当前路径重复状态

2. **全局环检测**：

$$ClosedSet = \{ s \mid s \text{ 已扩展} \}$$

   存储所有扩展过的状态，避免重复扩展

## 三、启发式搜索

### 3.1 核心概念
- **启发函数** $h(n)$: 估计从 $n$ 到目标的成本
- **评价函数**:
  - 贪婪最佳优先：$f(n) = h(n)$
  - A*算法：$f(n) = g(n) + h(n)$

### 3.2 A*算法性质
1. **可采纳性**：若 $h(n) \leq h^*(n)$，则A*最优
2. **一致性**：若 $h(n) \leq c(n,a,n') + h(n')$，则A*高效
3. **支配关系**：若 $h_2(n) \geq h_1(n)$，则 $h_2$ 信息更丰富

### 3.3 启发函数设计
**八数码问题**：

- $h_1(n)$: 错位方块数

$$h_1(n) = \sum_{i=1}^{8} [\text{position}(i) \neq \text{goal}(i)]$$

- $h_2(n)$: 曼哈顿距离和
  
$$h_2(n) = \sum_{i=1}^{8} |x_i - x_g| + |y_i - y_g|$$

**松弛问题启发式**：原问题的松弛问题最优解成本是可采纳启发式

### 3.4 算法变种
1. **IDA*** (迭代加深A*)：
   ```python
   def IDAstar(root):
       threshold = h(root)
       while True:
           min_cost = float('inf')
           stack = [(root, 0)]
           while stack:
               node, cost = stack.pop()
               f = cost + h(node)
               if f > threshold:
                   min_cost = min(min_cost, f)
                   continue
               if is_goal(node): 
                   return solution
               for child in expand(node):
                   new_cost = cost + c(node, child)
                   stack.append((child, new_cost))
           threshold = min_cost
   ```

2. **双向搜索**：从初始状态和目标状态同时搜索
   - 时间复杂度：$O(b^{d/2})$
   - 空间复杂度：$O(b^{d/2})$

## 四、对抗搜索（博弈）

### 4.1 博弈树基本概念
- **MAX玩家**：最大化收益
- **MIN玩家**：最小化收益
- **效用函数** $U(s)$：终止状态 $s$ 对MAX的收益

### 4.2 极小极大算法
$$ \text{MINIMAX}(s) = \begin{cases} 
\text{UTILITY}(s) & \text{终止状态} \\
\max_{a \in A(s)} \text{MINIMAX}(\text{SUCCESSOR}(s,a)) & \text{MAX回合} \\
\min_{a \in A(s)} \text{MINIMAX}(\text{SUCCESSOR}(s,a)) & \text{MIN回合}
\end{cases} $$

### 4.3 Alpha-Beta剪枝
```python
def alphabeta(node, α, β, player):
    if terminal(node): 
        return utility(node)
  
    if player == MAX:
        value = -∞
        for child in children(node):
            value = max(value, alphabeta(child, α, β, MIN))
            α = max(α, value)
            if α ≥ β: break  # β剪枝
        return value
    else:
        value = +∞
        for child in children(node):
            value = min(value, alphabeta(child, α, β, MAX))
            β = min(β, value)
            if β ≤ α: break  # α剪枝
        return value
```

### 4.4 蒙特卡洛树搜索(MCTS)
**四阶段流程**：

1. **选择(Selection)**：从根节点选择子节点（使用UCT算法）

$$UCT = \frac{w_i}{n_i} + c \sqrt{\frac{\ln N}{n_i}}$$

2. **扩展(Expansion)**：添加新节点
3. **模拟(Simulation)**：随机策略至终止
4. **反向传播(Backpropagation)**：更新路径统计

## 五、局部搜索算法

### 5.1 算法比较
| 算法 | 核心机制 | 优点 | 缺点 | 应用场景 |
|------|----------|------|------|----------|
| **爬山法** | 选择邻域最优解 | 简单高效 | 易陷入局部最优 | 简单优化问题 |
| **模拟退火(SA)** | 概率接受劣解 $P = e^{-\Delta E/T}$ | 全局收敛性好 | 参数敏感 | 组合优化问题 |
| **遗传算法(GA)** | 自然选择机制 | 并行性强，全局搜索 | 早熟收敛 | 复杂优化问题 |

### 5.2 模拟退火算法
**算法流程**：
```python
T = T0  # 初始温度
s = s0  # 当前状态
while T > T_min:
    for i in range(L):  # 内循环
        s_new = neighbor(s)  # 产生新状态
        ΔE = f(s_new) - f(s)
        if ΔE < 0 or random() < exp(-ΔE/T):
            s = s_new  # 接受新状态
    T = α * T  # 降温 (0.8 ≤ α ≤ 0.99)
```

**参数设计**：

- 初温 $T_0$：$T_0 = -\frac{\Delta f_{\max}}{\ln(0.9)}$
- 内循环次数：$L = 100 \times$ 问题规模
- 降温系数：$\alpha = 0.9$
- 终止条件：$T < 0.01$ 或最优解稳定

### 5.3 遗传算法
**基本流程**：
```
1. 初始化种群：随机生成N个个体
2. 评估适应度：计算fitness(i)
3. while 未满足终止条件:
    3.1 选择：轮盘赌 P(i) = fitness(i)/Σfitness(j)
    3.2 交叉：单点/两点/均匀交叉
    3.3 变异：位翻转/逆序/插入
    3.4 评估新种群
```

**TSP问题编码**：

- **排列编码**：城市访问顺序 (e.g., [1,3,2,4])
- **随机键编码**：实数编码后排序 (e.g., [0.7,0.2,0.9] → [2,1,3])

**交叉算子**：

- PMX (部分映射交叉)
- OX (顺序交叉)
- CX (循环交叉)

**变异算子**：

- 逆转变异
- 插入变异
- 交换变异

## 六、应用实例

### 6.1 八数码问题
**A*搜索求解**：
```
初始状态:  2  8  3   → 目标状态:  1  2  3
           1  6  4              8     4
           7     5              7  6  5

启发函数: h(n) = 曼哈顿距离和

搜索过程:
  1. 扩展初始节点 (f=0+8=8)
  2. 选择f值最小节点扩展
  3. 当h(n)=0时找到解
```

### 6.2 旅行商问题(TSP)
**模拟退火求解**：
```python
def SA_TSP(cities):
    current_tour = random_permutation(cities)
    current_cost = tour_length(current_tour)
    T = initial_temperature()
  
    while T > T_min:
        for i in range(L):
            new_tour = perturb(current_tour)  # 2-opt或3-opt扰动
            new_cost = tour_length(new_tour)
            ΔE = new_cost - current_cost
          
            if ΔE < 0 or random() < exp(-ΔE/T):
                current_tour, current_cost = new_tour, new_cost
              
        T *= cooling_rate
  
    return current_tour
```

### 6.3 博弈问题
**AlphaGo架构**：

1. **策略网络**：预测下一步动作概率 $P(a|s)$
2. **价值网络**：评估局面胜率 $V(s)$
3. **蒙特卡洛树搜索**：结合策略和价值网络指导搜索

## 七、性能优化技术

### 7.1 搜索效率提升
1. **启发式设计**：可采纳性和一致性保证
2. **剪枝优化**：Alpha-Beta剪枝、约束传播
3. **并行计算**：遗传算法、MCTS天然并行
4. **问题分解**：分层抽象、子问题求解

### 7.2 内存优化
1. **迭代加深**：空间复杂度 $O(bd)$
2. **环检测**：避免重复状态扩展
3. **状态压缩**：高效状态表示（如位运算）
4. **外部存储**：大状态空间磁盘存储

> 实际应用中常采用混合策略：如A*用于路径规划，模拟退火用于TSP，MCTS用于游戏AI，遗传算法用于参数优化。算法选择需考虑问题特性、状态空间大小和实时性要求。