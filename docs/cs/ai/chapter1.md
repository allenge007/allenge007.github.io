# 知识表示与推理

## 理论第2讲 知识表示和推理 I

### 一、知识与知识表示
1. **数据、信息与知识**
   - 数据：单独的事实（信息载体）
   - 信息：数据+上下文，具有意义和价值
   - 知识：经验总结升华，可动态推导新知识：
     $$ \text{知识} \xrightarrow{\text{推导}} \text{新知识} $$

2. **知识表示要求**
   - 正确有效符号化
   - 支持高效搜索和推理
   - 易读易懂
   - 支持渐进式知识增长

### 二、命题逻辑
1. **基本概念**
   - 原子命题：不可分割的真假判断（如 \( P = \text{"天空是蓝色的"} \)）
   - 复合命题：逻辑连接词组合命题

2. **逻辑连接词**
   
   | 符号 | 名称 | 示例 |
   |------|------|------|
   | \( \neg \) | 否定 | \( \neg P \) |
   | \( \land \) | 合取 | \( P \land Q \) |
   | \( \lor \) | 析取 | \( P \lor Q \) |
   | \( \rightarrow \) | 蕴涵 | \( P \rightarrow Q \) |
   | \( \leftrightarrow \) | 等价 | \( P \leftrightarrow Q \) |

3. **语义与真值表**
   - 永真式（\( \top \)）与永假式（\( \bot \)）
   - 真值表示例（合取）：
  
    $$
    \begin{array}{cc|c}
    P & Q & P \land Q \\
    \hline
    T & T & T \\
    T & F & F \\
    F & T & F \\
    F & F & F \\
    \end{array}
    $$

### 三、谓词逻辑
1. **基本元素**
   - 个体：客观实体（常量符号，如 \( c \)）
   - 谓词：表示属性/关系（如 \( \text{Female}(x) \)）
   - 函词：生成复合项（如 \( f(x) \)）
   - 量词：
     - \( \forall x \)：全称量词
     - \( \exists x \)：存在量词

2. **量化语句等价变换**
   
$$
\begin{align*}
\forall x \, P(x) & \Leftrightarrow \neg \exists x \, \neg P(x) \\
\exists x \, P(x) & \Leftrightarrow \neg \forall x \, \neg P(x) \\
\neg \forall x \, P(x) & \Leftrightarrow \exists x \, \neg P(x) \\
\neg \exists x \, P(x) & \Leftrightarrow \forall x \, \neg P(x)
\end{align*}
$$

3. **语义与解释**
   - 置换：形如 \( \{ x_1/t_1, \dots, x_n/t_n \} \) 的变量替换
   - 解释函数：\( I(\text{Female}) = \{"高"\} \)

---

## 理论第3讲 知识表示和推理 II

### 一、逻辑推理方法
1. **推理类型**
   - 演绎：一般 → 个别（三段论）
    $$
    \frac{\forall x \, (\text{Footballer}(x) \rightarrow \text{Strong}(x)) \quad \text{Footballer}(\text{Gao Bo})}{\text{Strong}(\text{Gao Bo})}
    $$
   - 归纳：个别 → 一般

2. **推理规则**
   $$
   \begin{aligned}{c}
   \text{假言推理} \\
   \dfrac{P \quad P \rightarrow Q}{Q} \\
   \\
   \text{拒取式} \\
   \dfrac{\neg Q \quad P \rightarrow Q}{\neg P} \\
   \\
   \text{全称特化} \\
   \dfrac{\forall x \, P(x)}{P(a)} \\
   \\
   \text{存在特化} \\
   \dfrac{\exists x \, P(x)}{P(a)}
   \end{aligned}
   $$

### 二、归结原理
1. **基本概念**
   - 子句：文字的析取（如 \( P \lor \neg Q \)）
   - 空子句（\( \square \)）：永假式
   - 归结式：
    $$
    \frac{C_1 = A \lor \alpha \quad C_2 = \neg A \lor \beta}{\text{Res}(C_1, C_2) = \alpha \lor \beta}
    $$

2. **谓词逻辑归结**
   - 合一：寻找置换 \( \theta \) 使表达式一致
   - 最一般合一项（MGU）算法：

    $$
    \begin{array}{l}
    \text{输入：两个原子公式 } A \text{ 和 } B \\
    \text{输出：MGU } \theta \text{ 或失败} \\
    \hline
    1.\ \theta := \{\}, S := \{(A, B)\} \\
    2.\ \text{while } S \neq \emptyset \\
    3.\quad \text{从 } S \text{ 移除 } (s, t) \\
    4.\quad \text{若 } s \neq t: \\
    5.\qquad \text{若 } s = f(s_1,\dots,s_n) \text{ 且 } t = g(t_1,\dots,t_m) \\
    6.\qquad\quad \text{若 } f \neq g: \text{失败} \\
    7.\qquad\quad \text{否则：添加 } \{(s_1,t_1),\dots,(s_n,t_n)\} \text{ 到 } S \\
    8.\qquad \text{若 } s = x \text{ (变量)} \\
    9.\qquad\quad \text{若 } x \in \text{vars}(t): \text{失败} \\
    10.\qquad\quad \text{否则：} \theta := \theta \cup \{x/t\} \\
    11.\qquad\quad S := S\theta \\
    \text{end while} \\
    \text{return } \theta
    \end{array}
    $$

---

## 理论第4讲 知识表示和推理 III

### 一、谓词公式化为子句集
9步转化流程：

1. **消去蕴涵和等价**：
   
$$
\begin{align*}
A \rightarrow B & \Rightarrow \neg A \lor B \\
A \leftrightarrow B & \Rightarrow (\neg A \land \neg B) \lor (A \land B)
\end{align*}
$$

2. **内移否定**：

$$
\begin{align*}
\neg(\neg A) & \Rightarrow A \\
\neg(A \land B) & \Rightarrow \neg A \lor \neg B \\
\neg(\forall x \, P(x)) & \Rightarrow \exists x \, \neg P(x) \\
\neg(\exists x \, P(x)) & \Rightarrow \forall x \, \neg P(x)
\end{align*}
$$

3. **变量标准化**：重命名重复变量
4. **Skolem化**：
   - 受全称量词约束的存在量词替换为Skolem函数：

$$
\forall x \exists y \, P(x,y) \Rightarrow \forall x \, P(x,f(x))
$$

5. **化为前束型**：\( \text{前缀}[\text{母式}] \)
6. **母式合取范式化**：

$$
\bigvee_i \bigwedge_j L_{ij} \quad \Rightarrow \quad \bigwedge_k \bigvee_m L_{km}
$$

7. **省略全称量词**
8. **子句集表示**：合取元转为集合
9. **变量标准化**：重命名子句变量

### 二、归结原理应用
1. **问题求解步骤**：
$$
\begin{array}{c}
\text{前提子句集 } S \\
\downarrow \\
\text{添加 } \neg \text{目标} \rightarrow \text{Answer} \\
\downarrow \\
\text{归结直至得到 Answer} \\
\end{array}
$$

2. **经典案例（老实人说谎者问题）**：
   - 定义谓词 \( T(x) \)：\( x \) 说真话
   - 子句集：

$$
\begin{align*}
& \neg T(A) \lor \neg T(B) \\
& \neg T(A) \lor \neg T(C) \\
& T(C) \lor T(A) \lor T(B) \\
& \vdots \\
& \text{归结得 } T(C) \land \neg T(A) \land \neg T(B)
\end{align*}
$$

### 三、机器定理证明里程碑
- **吴文俊方法**：几何定理代数化 → 多项式方程组 → 伪除法判定
- **王浩贡献**：1959年用IBM-704在9分钟内证明《数学原理》350条定理

## 课后作业

!!! question "问题一"
    求解 $P(a, x, h(g(z)))$ 和 $P(z, h(y), h(y))$ 的最一般合一项。

!!! question "问题二"
    试用归结法证明以下论断为有效的：有理数都是实数。无理数也都是实数。有些数不是实数。因此，有些数既不是有理数，也不是无理数。请使用以下谓词：Q(x) : x是有理数，R(x) : x是实数，W(x) : x是无理数。

!!! question "问题三"
    给定前提集：
    
    （1）$Student(john)$，（2）$Student(jane)$，（3）$Happy(john) ∨ Happy(jane)$。

    求解下述问题的答案：$∃x[Student(x) ∧ Happy(x)]$