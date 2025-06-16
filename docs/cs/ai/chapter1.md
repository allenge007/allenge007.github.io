# 知识表示与推理

!!! abstract "课程信息"
    - **课程名称：** 人工智能 (专业必修)
    - **授课对象：** 计算机科学与技术专业 二年级
    - **节选内容：** 第三章 知识表示和推理 I, II, III

## 1. 什么是知识与知识表示？

!!! info "数据、信息与知识"
    - **数据 (Data):** 单独的事实，信息的载体，由符号组成（如文字、数字）。
    - **信息 (Information):** 对符号赋予了意义，具有一定用途和价值。
    - **知识 (Knowledge):** 由经验总结升华得到，在信息基础上增加了上下文，提供了更多意义，更加有用和有价值。知识随时间动态变化，新的知识可由规则和已有知识推导。

**知识表示 (Knowledge Representation - KR)** 是指用机器表示知识的可行性、有效性的一般方法，可以看作是将知识符号化并输入到计算机的过程和方法。

!!! tip "知识表示的要求"
    1.  **正确有效 (Correctness & Effectiveness):** 能够正确、有效地将问题求解所需的各类知识都表示出来。
    2.  **高效搜索 (Efficient Search):** 表示知识的符号结构和推理机制应支持对知识库的高效搜索，使智能系统能迅速感知事物关系和变化，并快速找到相关知识。
    3.  **易懂易读 (Understandability & Readability):** 所表示的知识应易懂、易读。
    4.  **易于增删改 (Modifiability):** 使得智能系统能够渐进地增加知识，逐步进化。
    5.  **支持推理 (Inferential Capability):** 要能够从已有的知识中推出需要的答案和结论。

---

## 2. 自然语言的层级与逻辑基础

!!! abstract "自然语言的层级"
    - **语法 (Syntax):** 描述了组成语句的可能的搭配关系。
        - 例如：在简单算术中，$x+1=2$ (合法)，$1+=x$ (不合法)。
    - **语义 (Semantics):** 定义了语句所指的世界中的事实。
        - 例如：$1+1=2$ (真)，$1+2=2$ (假)。
    - **蕴涵 (Entailment):** 当语句 $A$ 为真时，语句 $B$ 必为真，那么称语句 $A$ 蕴涵语句 $B$。用蕴涵推导出结论的过程称为推理。
        - 例如：语句 $x=0$ 蕴涵语句 $xy=0$。

---

## 3. 命题逻辑 (Propositional Logic)

!!! note "命题逻辑基础"
    命题逻辑专注于分析和构建由命题（即陈述句所表达的判断）构成的逻辑系统。命题被视为最基本的逻辑单位。

**3.1. 语法 (Syntax)**

*   **原子命题 (Atomic Proposition):** 由单个命题词组成，每个命题词代表一个或为真或为假的命题，记作 $P, Q$ 等。
    *   *Example:* “天空是蓝色的” ($P$)
*   **复合命题 (Compound Proposition):** 通过逻辑连接词连接命题而形成的。
    *   *Example:* “天空是蓝色的并且草地是绿色的” ($P \land Q$)
*   **逻辑连接词 (Logical Connectives):**
    1.  **否定 (Negation):** $\neg$ (非)
        *   $\neg P$: 天空不是蓝色的。
    2.  **合取 (Conjunction):** $\land$ (且)
        *   $P \land Q$: 天空是蓝色的且草地是绿色的。
    3.  **析取 (Disjunction):** $\lor$ (或)
        *   $P \lor Q$: 天空是蓝色的或草地是绿色的。
    4.  **蕴涵 (Implication):** $\to$ (如果...那么...)
        *   $P \to Q$: 如果天空是蓝色的，那么草地是绿色的。
    5.  **等价 (Equivalence / Biconditional):** $\leftrightarrow$ (当且仅当...)
        *   $P \leftrightarrow Q$: 天空是蓝色的当且仅当草地是绿色的。

**3.2. 语义 (Semantics)**

*   语义定义了用于判定特定模型中的语句真值的规则。
*   每个原子语句的真值在模型中被直接指定。
*   复合语句的真值可以通过递归计算得到（通常使用真值表）。
*   **永真命题 (Tautology):** 如 $P \lor \neg P$。
*   **永假命题 (Contradiction):** 如 $P \land \neg P$。

**3.3. 命题演算形式系统 PC (Propositional Calculus)**

!!! example "命题演算的公理 (PC Axioms)"
    常见的三个公理包括：

    1.  **公理1:** $A \to (B \to A)$
        *   *理解:* 如果A成立，那么任何B的情况下A都成立。
    2.  **公理2:** $(A \to (B \to C)) \to ((A \to B) \to (A \to C))$
        *   *理解:* 蕴含的分配律。
    3.  **公理3:** $(\neg B \to \neg A) \to (A \to B)$
        *   *理解:* 逆否命题与原命题的等价性。

*   **证明 (Proof):** 从公理和已知前提，通过推理规则推导出结论的过程。
*   **演绎 (Deduction):** 一种证明方式。
*   **定理证明示例:** $\vdash_{PC} A \to A$ (证明 $A \to A$ 是一个定理)。

---

## 4. 谓词逻辑 (Predicate Logic / First-Order Logic - FOL)

!!! note "谓词逻辑基础"
    一阶谓词逻辑语言是围绕对象和关系建立起来的，通过引入个体、谓词、量词来表示个体属性和个体之间的关系。命题逻辑无法表达“所有”、“存在”等概念。

**4.1. 语法 (Syntax)**

*   **个体 (Individuals):** 客观存在的实体，可以是具体物体或抽象概念。
*   **谓词 (Predicates):** 用于描述或判断个体的性质或关系。
    *   *Example:* "天空是蓝色的" $\rightarrow \text{Blue}(\text{sky})$
    *   *Example:* "a是b的朋友" $\rightarrow \text{Friend}(a, b)$
*   **符号 (Symbols):**
    *   **常量符号 (Constant Symbols):** 表示对象，如 `lindaiyu`。
    *   **谓词符号 (Predicate Symbols):** 表示关系，如 `Parent`, `Female`。
    *   **函词符号 (Function Symbols):** 表示函数，如 `JadePendantOf(person)`。
*   **项 (Terms):** 指代对象的逻辑表达式。
    *   常量符号是项: `lindaiyu`。
    *   由函词和参数构成的是复合项: `JadePendantOf(lindaiyu)` (林黛玉的玉佩)。
*   **原子语句 (Atomic Sentences):** 由指代对象的项和指代关系的谓词构成。
    *   *Example:* `Female(lindaiyu)` (林黛玉是女性)。
*   **复合语句 (Complex Sentences):** 由原子语句和逻辑连接词构造。
    *   *Example:* $\text{Father}(\text{linruhai}, \text{lindaiyu}) \to \neg \text{Female}(\text{linruhai})$
*   **量词 (Quantifiers):**
    *   **全称量词 (Universal Quantifier):** $\forall$ (对于所有的...)
        *   $\forall x \text{ Child}(x) \to \text{Likes}(x, \text{icecream})$ (所有小孩子都喜欢冰淇淋)
    *   **存在量词 (Existential Quantifier):** $\exists$ (存在...使得...)
        *   $\exists x \text{ Child}(x) \land \neg \text{Likes}(x, \text{icecream})$ (存在小孩子不喜欢冰淇淋)
    *   变量 $x$ 被称为量词约束的变量。没有自由变量的项称为基项 (ground term)。

!!! tip "量词与否定 (De Morgan's Laws for Quantifiers)"
    两个量词通过否定词紧密关联：

    - $\forall x P(x) \Leftrightarrow \neg \exists x \neg P(x)$ (每个人都喜欢冰淇淋 $\Leftrightarrow$ 不存在讨厌冰淇淋的人)
    - $\exists x P(x) \Leftrightarrow \neg \forall x \neg P(x)$
    - $\neg \forall x P(x) \Leftrightarrow \exists x \neg P(x)$
    - $\neg \exists x P(x) \Leftrightarrow \forall x \neg P(x)$

**4.2. 语义 (Semantics)**

*   **解释 (Interpretation):** 给个体词在个体域中指定具体的个体，给谓词指定具体的性质或关系，以及给量词指定个体域并判定其范围。
    *   *Example:* 谓词 $F$ 可以解释为“高”。
*   **置换 (Substitution):** 利用项（常量、变量或函数）对变量进行替换的过程，形如 $\{v_1/t_1, v_2/t_2, \dots, v_n/t_n\}$。
    *   $v_i$ 是互不相同的变量。
    *   $t_i$ 是项。
    *   $v_i/t_i$ 表示用 $t_i$ 置换 $v_i$。合法前提：$t_i \neq v_i$， $v_i$ 不出现在 $t_i$ 中，不出现循环置换。
*   **公式真值判断:**
    *   原子公式：根据解释直接判断。
    *   复合公式：根据逻辑联结词规则和子命题真值判断。
    *   含 quantifier 公式：根据量词定义和个体域判断。

**4.3. 逻辑蕴涵与等价**

*   **逻辑蕴涵 (Logical Entailment):** 如果在一个特定的解释下，公式 $A$ 为真必然导致公式 $B$ 也为真，则 $A$ 蕴含 $B$ ($A \models B$ 或 $A \to B$ 在某些上下文中)。
    *   可用反证法证明：假设 $A$ 真 $B$ 假，推导出矛盾。
*   **逻辑等价 (Logical Equivalence):** 如果两个公式 $A$ 和 $B$ 在所有可能的解释下都取相同的真值，则 $A$ 和 $B$ 等价 ($A \Leftrightarrow B$ 或 $A \equiv B$)。
    *   证明方法：真值表法 (对命题逻辑)，逻辑等价变换法 ($A \models B$ 且 $B \models A$)。

**4.4. 谓词逻辑的常用推理规则和公理**

*   **常用推理规则 (永真蕴涵式):**
    1.  化简式: $P \land Q \Rightarrow P$
    2.  附加式: $P \Rightarrow P \lor Q$
    3.  析取三段论: $\neg P, P \lor Q \Rightarrow Q$
    4.  假言推理 (Modus Ponens): $P, P \to Q \Rightarrow Q$
    5.  拒取式 (Modus Tollens): $\neg Q, P \to Q \Rightarrow \neg P$
    6.  假言三段论: $P \to Q, Q \to R \Rightarrow P \to R$
    7.  二难推理: $P \lor Q, P \to R, Q \to R \Rightarrow R$
    8.  全称特化 (Universal Instantiation): $(\forall x)P(x) \Rightarrow P(a)$ (a 是个体域中任一个体)
    9.  存在特化 (Existential Instantiation): $(\exists x)P(x) \Rightarrow P(a)$ (a 是使 P(x) 为真的某个特定个体，通常引入新常量)

*   **谓词演算的公理模式 (Axioms for FOL):**
    *   AX(1.1): $A \to (B \to A)$
    *   AX(1.2): $(A \to (B \to C)) \to ((A \to B) \to (A \to C))$
    *   AX(1.3): $(\neg A \to \neg B) \to (B \to A)$
    *   AX2: $\forall v A \to A_t^v$ (t 对 A 中变元 v 可代入, $A_t^v = A(t/v)$)
    *   AX3: $\forall v (A \to B) \to (\forall v A \to \forall v B)$
    *   AX4: $A \to \forall v A$ (v 在 A 中无自由出现)
    *   推理规则模式仍为 Modus Ponens ($r_{mp}$).

!!! example "谓词逻辑应用：亲属关系论域"
    **谓词定义：**

    - 一元谓词: $\text{Male}(x)$, $\text{Female}(x)$
    - 二元谓词: $\text{Parent}(x,y)$ (x是y的家长), $\text{Child}(x,y)$ (x是y的孩子), $\text{Grandparent}(x,y)$

    **公理：**

    1.  家长和孩子是反关系: $\forall x,y (\text{Parent}(x,y) \leftrightarrow \text{Child}(y,x))$
    2.  祖父母是家长的家长: $\forall x,y (\text{Grandparent}(x,y) \leftrightarrow \exists z (\text{Parent}(x,z) \land \text{Parent}(z,y)))$

    **定理：** 可以通过公理推理得到。

---

## 5. 逻辑推理方法

!!! abstract "逻辑推理方法概述"
    - **逻辑推理 (Logical Reasoning):** 指用蕴涵推导出结论。
    - **模型验证 (Model Checking):** 通过枚举所有可能的模型来验证在给定当前知识库 ($KB$) 的前提下，结论都为真。
    - 如果推理算法 $\mathcal{I}$ 可以根据 $KB$ 导出结论 $\alpha$，则形式化地记为 $KB \vdash_{\mathcal{I}} \alpha$.
    - **可靠性/真值保持 (Soundness):** 只会导出蕴涵句的推理算法。

**5.1. 演绎、归纳与溯因**

*   **演绎推理 (Deductive Reasoning):** 从一般原理推导出个别结论。 (e.g., 三段论)
    *   *大前提:* 足球运动员身体强壮。
    *   *小前提:* 高波是足球运动员。
    *   *结论:* 高波身体强壮。
*   **归纳推理 (Inductive Reasoning):** 从个别案例推导出一般规律。
    *   *完全归纳:* 检查全部产品合格 $\Rightarrow$ 该厂产品合格。
    *   *不完全归纳:* 检查部分样品合格 $\Rightarrow$ 该厂产品合格 (结论不一定为真)。
*   **溯因推理 (Abductive Reasoning):** 从结论和规则出发，推测可能的前提 (寻求最佳解释)。

**5.2. 自然演绎 (Natural Deduction)**

从一组已知为真的事实出发，运用经典逻辑的推理规则推出结论的过程。

!!! success "常用自然演绎规则"
    - **假言推理 (Modus Ponens, MP):** $P, P \to Q \Rightarrow Q$
        *   *"如果 $A$ 是金属，则 $A$ 能导电", "铜是金属"* $\Rightarrow$ *"铜能导电"*
    - **拒取式推理 (Modus Tollens, MT):** $P \to Q, \neg Q \Rightarrow \neg P$
        *   *"如果下雨，则地下就湿", "地上不湿"* $\Rightarrow$ *"没有下雨"*
    - **P规则 (Premise Introduction):** 可以在证明的任何步骤引入前提。
    - **T规则 (Tautology Introduction):** 可以在证明的任何步骤引入逻辑上等价的公式或已知定理。

!!! example "自然演绎证明示例"
    **已知事实：**

    1.  凡是容易的课程小王(wang)都喜欢。
        $\forall x (\text{Easy}(x) \to \text{Likes}(\text{wang}, x))$
    2.  AI班的课程都是容易的。
        $\forall x (\text{AICourse}(x) \to \text{Easy}(x))$
    3.  ds是AI班的一门课程。
        $\text{AICourse}(\text{ds})$

    **求证：** 小王喜欢ds这门课程。
        $\text{Likes}(\text{wang}, \text{ds})$

    **证明步骤：**

    1.  $\forall x (\text{Easy}(x) \to \text{Likes}(\text{wang}, x))$ (前提1)
    2.  $\text{Easy}(\text{ds}) \to \text{Likes}(\text{wang}, \text{ds})$ (由1, 全称特化 UI, $x/\text{ds}$)
    3.  $\forall x (\text{AICourse}(x) \to \text{Easy}(x))$ (前提2)
    4.  $\text{AICourse}(\text{ds}) \to \text{Easy}(\text{ds})$ (由3, UI, $x/\text{ds}$)
    5.  $\text{AICourse}(\text{ds})$ (前提3)
    6.  $\text{Easy}(\text{ds})$ (由4, 5, 假言推理 MP)
    7.  $\text{Likes}(\text{wang}, \text{ds})$ (由2, 6, 假言推理 MP) **Q.E.D.**

!!! tip "自然演绎的优缺点"
    - **优点:** 表达定理证明过程自然，易理解；拥有丰富的推理规则，推理过程灵活；便于嵌入领域启发式知识。
    - **缺点:** 易产生组合爆炸，得到的中间结论一般呈指数形式递增。

---

## 6. 归结原理 (Resolution Principle)

!!! danger "归结原理核心思想"
    归结是一种基于**反证法 (Proof by Contradiction)** 的推理方法。

    - **定理:** $KB \models \alpha$ (知识库 $KB$ 蕴涵 $\alpha$) 当且仅当 $KB \land \neg \alpha$ 是不可满足的 (unsatisfiable / contradiction)。
    - **核心思路:** 证明 $KB \models \alpha$ 等价于证明语句 $S = (P_1 \land P_2 \land \dots \land P_n) \land \neg \alpha$ 为假 (其中 $P_i$ 是 $KB$ 中的前提)，这转换为证明子句集 $S' = \{P_1, P_2, \dots, P_n, \neg \alpha\}$ 是不可满足的。

**6.1. 基本概念**

*   **文字 (Literal):** 一个原子公式 ($P$) 或其否定 ($\neg P$)。
    *   $P$: 正文字 (Positive Literal)
    *   $\neg P$: 负文字 (Negative Literal)
*   **子句 (Clause):** 任何文字的析取 (disjunction)。单个文字也是子句。
    *   *Example:* $P \lor \neg Q \lor R$, 通常写作 $(P, \neg Q, R)$。
*   **空子句 (Empty Clause):** 不包含任何文字的子句，记作 NIL 或 $\Box$。空子句是永假的，不可满足的。
*   **子句集 (Clause Set):** 由子句构成的集合，表示子句间的合取 (conjunction)。
    *   *Example:* $\{(P, \neg Q), (\neg P, R)\}$ 表示 $(P \lor \neg Q) \land (\neg P \lor R)$。

**6.2. 归结式 (Resolvent)**

对于任意两个子句 $C_1$ 和 $C_2$，若 $C_1$ 中有一个文字 $L$，而 $C_2$ 中有一个与 $L$ 成互补的文字 $\neg L$，则分别从 $C_1$ 和 $C_2$ 中删去 $L$ 和 $\neg L$，并将其剩余部分组成新的析取式。这个新的子句被称为 $C_1$ 和 $C_2$ 关于 $L$ 的归结式。$C_1$ 和 $C_2$ 则是该归结式的亲本子句 (parent clauses)。

*   **符号表示:** $\frac{L \lor \alpha, \quad \neg L \lor \beta}{\alpha \lor \beta}$
*   **定理:** 两个子句的归结式是这两个子句（作为集合）的逻辑推论。
    *   $\{(P, Q_1), (\neg P, Q_2)\} \models (Q_1, Q_2)$
*   **特殊情况:** 子句 $L$ 和 $\neg L$ 的归结式为空子句 (NIL)。

**6.3. 鲁宾逊归结原理 (Robinson's Resolution Principle)**

1.  检查子句集 $S$ 中是否包含空子句。若包含，则 $S$ 不可满足。
2.  若不包含，则在 $S$ 中选择合适的子句进行归结，将归结式加入 $S$。
3.  一旦归结出空子句 (NIL)，就说明原始子句集 $S$ 是不可满足的。

**6.4. 命题逻辑中的归结推理过程**

1.  把前提集 $KB$ 转化成子句集表示，得到 $S_{KB}$。
2.  把待证明命题 $\alpha$ 的否定式 $\neg \alpha$ 也转化成子句集表示 $S_{\neg \alpha}$。
3.  构造新的子句集 $S = S_{KB} \cup S_{\neg \alpha}$。
4.  对子句集 $S$ 反复应用归结规则，直至导出空子句 (NIL)。若导出空子句，则证明 $\alpha$ 成立。

!!! example "命题逻辑归结示例"
    **已知前提:**

    1.  $P$
    2.  $(P \land Q) \to R$
    3.  $(S \lor T) \to Q$
    4.  $T$

    **求证:** $R$

    **1. 化为子句集:**

    - $P \Rightarrow \{ (P) \}$
    - $(P \land Q) \to R \Leftrightarrow \neg(P \land Q) \lor R \Leftrightarrow \neg P \lor \neg Q \lor R \Rightarrow \{ (\neg P, \neg Q, R) \}$
    - $(S \lor T) \to Q \Leftrightarrow \neg(S \lor T) \lor Q \Leftrightarrow (\neg S \land \neg T) \lor Q \Leftrightarrow (\neg S \lor Q) \land (\neg T \lor Q) \Rightarrow \{ (\neg S, Q), (\neg T, Q) \}$
    - $T \Rightarrow \{ (T) \}$
    - 待证结论的否定: $\neg R \Rightarrow \{ (\neg R) \}$

    **2. 归结过程 (子句集 $S_0 = \{(P), (\neg P, \neg Q, R), (\neg S, Q), (\neg T, Q), (T), (\neg R) \}$):**
    ```
    1. (P)                     [前提]
    2. (¬P, ¬Q, R)            [前提]
    3. (¬S, Q)                [前提]
    4. (¬T, Q)                [前提]
    5. (T)                     [前提]
    6. (¬R)                    [结论的否定]
    ------------------------------------
    7. (Q)                     [4, 5] (¬T与T归结)
    8. (¬P, R)                 [2, 7] (¬Q与Q归结, {Q/¬Q})
    9. (R)                     [1, 8] (P与¬P归结)
    10. NIL                    [6, 9] (¬R与R归结)
    ```
    由于推导出空子句 NIL，所以 $R$ 得证。

**6.5. 谓词逻辑中的归结推理**

在谓词逻辑中应用归结法，主要增加了两个复杂性：

1.  **公式转换:** 将所有谓词公式（包括 $KB$ 和 $\neg \alpha$）化为**子句范式 (Clausal Form / Conjunctive Normal Form - CNF)**。
2.  **合一 (Unification):** 对含有变量的子句进行归结时，需要找到合适的变量置换使得互补的文字能够匹配。

**6.5.1. 合一 (Unification)**

!!! definition "合一 (Unification)"
    在谓词逻辑的归结过程中，寻找项之间合适的变量置换 (substitution) $\theta$ 使得两个或多个表达式（通常是原子公式）一致 (identical) 的过程。

    - **置换 (Substitution):** 一个形如 $\theta = \{v_1/t_1, v_2/t_2, \dots, v_n/t_n\}$ 的有限集合，其中 $v_i$ 是变量，$t_i$ 是项，且 $v_i \neq t_i$，$v_i$ 不出现在 $t_i$ 中。
    - **应用置换:** $E\theta$ 表示对表达式 $E$ 应用置换 $\theta$ 后的结果。
    - **合成置换 (Composition of Substitutions):** $(E\theta_1)\theta_2 = E(\theta_1\theta_2)$。
    - **合一项 (Unifier):** 一个置换 $\theta$，使得 $E_1\theta = E_2\theta = \dots = E_k\theta$。
    - **最一般合一项 (Most General Unifier - MGU):** 一个合一项 $\theta_g$，使得对于任何其他合一项 $\theta'$, 都存在一个置换 $\lambda$ 使得 $\theta' = \theta_g\lambda$。MGU 是最不具体的合一。

!!! tip "求最一般合一项 (MGU) 算法 (简述)"
    给定两个语句 $E_1, E_2$:

    1.  初始化置换 $\sigma = \{\}$ (空置换)，差异集 $D = \text{disagreement\_set}(E_1\sigma, E_2\sigma)$。

    2.  **循环**直到 $D$ 为空 (表示已合一) 或无法合一：

        a.  从 $D$ 中选取一对差异项 $t_1, t_2$。

        b.  如果 $t_1$ 是变量 $v$ 且 $v$ 不出现在 $t_2$ 中 (occurs check)，则令 $\sigma_{new} = \{v/t_2\}$，更新 $\sigma = \sigma \sigma_{new}$。更新 $E_1, E_2$。

        c.  如果 $t_2$ 是变量 $v$ 且 $v$ 不出现在 $t_1$ 中，则令 $\sigma_{new} = \{v/t_1\}$，更新 $\sigma = \sigma \sigma_{new}$。更新 $E_1, E_2$。

        d.  否则 (如 $t_1, t_2$ 都是函数且函数名不同，或 occurs check 失败)，则不可合一，停止。

        e.  重新计算差异集 $D$。

    3.  如果 $D$ 为空，则 $\sigma$ 是 MGU。

!!! example "MGU 示例"
    1.  求 $P(f(x), y)$ 和 $P(z, a)$ 的 MGU:
        - 差异集 $\{f(x), z\}$。令 $z/f(x)$。$\sigma_1 = \{z/f(x)\}$.
          表达式变为 $P(f(x), y)$ 和 $P(f(x), a)$.
        - 差异集 $\{y, a\}$。令 $y/a$。$\sigma_2 = \{y/a\}$.
        - MGU $\sigma = \sigma_1\sigma_2 = \{z/f(x), y/a\}$. 结果: $P(f(x), a)$.

    2.  求 $P(a, x, h(g(z)))$ 和 $P(z, h(y), h(y))$ 的 MGU:
        - 初始: $E_1 = P(a, x, h(g(z)))$, $E_2 = P(z, h(y), h(y))$, $\sigma = \{\}$
        - 差异 $\{a, z\}$. $\sigma_1 = \{z/a\}$.
          $E_1\sigma_1 = P(a, x, h(g(a)))$, $E_2\sigma_1 = P(a, h(y), h(y))$
        - 差异 $\{x, h(y)\}$. $\sigma_2 = \{x/h(y)\}$.
          $E_1\sigma_1\sigma_2 = P(a, h(y), h(g(a)))$, $E_2\sigma_1\sigma_2 = P(a, h(y), h(y))$
        - 差异 $\{h(g(a)), h(y)\}$. 内部差异 $\{g(a), y\}$. $\sigma_3 = \{y/g(a)\}$.
          $E_1\sigma_1\sigma_2\sigma_3 = P(a, h(g(a)), h(g(a)))$, $E_2\sigma_1\sigma_2\sigma_3 = P(a, h(g(a)), h(g(a)))$
        - MGU: $\sigma = \{z/a, x/h(y), y/g(a)\}$.

**6.5.2. 谓词公式化为子句集 (CNF Conversion / Skolemization)**

!!! important "谓词公式化为子句集的步骤"
    将一个谓词逻辑公式转换为子句集（合取范式 CNF 的一种表示）通常涉及以下步骤：

    1.  **消去蕴涵和等价符号 (Eliminate $\to, \leftrightarrow$):**
        - $A \to B \Leftrightarrow \neg A \lor B$
        - $A \leftrightarrow B \Leftrightarrow (A \to B) \land (B \to A) \Leftrightarrow (\neg A \lor B) \land (\neg B \lor A)$

    2.  **内移否定符号 (Move $\neg$ inwards):** 将 $\neg$ 移到紧靠谓词的位置上。

        - $\neg(\neg A) \Leftrightarrow A$ (双重否定律)
        - $\neg(A \land B) \Leftrightarrow \neg A \lor \neg B$ (德摩根律)
        - $\neg(A \lor B) \Leftrightarrow \neg A \land \neg B$ (德摩根律)
        - $\neg \forall x P(x) \Leftrightarrow \exists x \neg P(x)$ (量词转换律)
        - $\neg \exists x P(x) \Leftrightarrow \forall x \neg P(x)$ (量词转换律)

    4.  **变量标准化 (Standardize variables apart):** 对变量作必要的换名，使每一量词只约束一个唯一的变量名，确保不同量词作用域内的变量名不冲突。

        *   e.g., $(\forall x P(x)) \lor (\exists x Q(x))$ 变为 $(\forall x P(x)) \lor (\exists y Q(y))$

    6.  **消去存在量词 (Skolemize):**

        - 若存在量词 $\exists x$ 不在任何全称量词辖域之内，则用一个新的**Skolem常量** $c$ 替代所有出现的 $x$。
          *   $\exists x P(x) \Rightarrow P(c)$
        - 若存在量词 $\exists y$ 位于一个或多个全称量词 $\forall x_1, \dots, \forall x_k$ 的辖域之内，则用一个新的**Skolem函数** $f(x_1, \dots, x_k)$ 替代所有出现的 $y$。
          *   $\forall x_1 \dots \forall x_k \exists y P(y, x_1, \dots, x_k) \Rightarrow \forall x_1 \dots \forall x_k P(f(x_1, \dots, x_k), x_1, \dots, x_k)$

    8.  **化为前束型 (Prenex Normal Form):** 将所有全称量词移到公式的最左边，形成 (前缀)[母式] 结构。前缀为全称量词串，母式为不含量词的谓词公式。

        *   e.g., $\forall x \forall y \dots (\text{Matrix})$

    10. **母式化为合取范式 (CNF):** 反复使用分配律将母式表达成合取范式 (AND of ORs)。

        - $A \lor (B \land C) \Leftrightarrow (A \lor B) \land (A \lor C)$

    12. **略去全称量词 (Drop universal quantifiers):** 由于母式中的所有变量均受全称量词约束，因此可省略掉所有 $\forall$。此时，所有变量都被认为是全称量化的。

    14. **母式用子句集表示:** 把母式中每一个合取元 (conjunct) 称为一个子句，省去合取联结词 $\land$，将每个析取式 (disjunct) 作为一个子句放入集合中。

    16. **子句变量标准化 (Standardize variables apart in clauses):** 对某些变量重新命名，使任意两个子句不会有相同的变量名出现。这增加了应用过程的灵活性，因为每个子句中的变量都是独立全称量化的。

        *   e.g., $\{P(x), Q(x)\}$ 变为 $\{P(x_1), Q(x_2)\}$

!!! example "公式化为子句集示例 (来自PPT)"
    将 $\forall x (\forall y P(x,y) \to \neg \forall y (Q(x,y) \to R(x,y)))$ 化为子句集:

    1.  **消去 $\to$:**

        $\forall x (\neg (\forall y P(x,y)) \lor \neg (\forall y (\neg Q(x,y) \lor R(x,y))))$

    3.  **内移 $\neg$:**

        $\forall x ((\exists y \neg P(x,y)) \lor (\exists y \neg (\neg Q(x,y) \lor R(x,y))))$

        $\forall x ((\exists y \neg P(x,y)) \lor (\exists y (Q(x,y) \land \neg R(x,y))))$

    5.  **变量标准化:** (x作用于整个式子, 两个y的作用域不同, 需要重命名一个)

        $\forall x ((\exists y_1 \neg P(x,y_1)) \lor (\exists y_2 (Q(x,y_2) \land \neg R(x,y_2))))$

    7.  **Skolemize:** $y_1$ 依赖于 $x$, $y_2$ 依赖于 $x$.
        用 $f(x)$ 替换 $y_1$, $g(x)$ 替换 $y_2$.

        $\forall x (\neg P(x,f(x)) \lor (Q(x,g(x)) \land \neg R(x,g(x))))$

    8.  **前束型:** 已经是前束型。
    9.  **母式化为CNF (分配律):** $\neg P(x,f(x)) \lor (Q(x,g(x)) \land \neg R(x,g(x)))$

        $\Leftrightarrow (\neg P(x,f(x)) \lor Q(x,g(x))) \land (\neg P(x,f(x)) \lor \neg R(x,g(x)))$

    11. **略去 $\forall x$:**

        $(\neg P(x,f(x)) \lor Q(x,g(x))) \land (\neg P(x,f(x)) \lor \neg R(x,g(x)))$

    13. **子句集表示:**

        $\{ (\neg P(x,f(x)), Q(x,g(x))), (\neg P(x,f(x)), \neg R(x,g(x))) \}$

    15. **子句变量标准化:** (如果需要与其他子句组合)

        $\{ (\neg P(x_1,f(x_1)), Q(x_1,g(x_1))), (\neg P(x_2,f(x_2)), \neg R(x_2,g(x_2))) \}$

        (如果这是唯一的公式，则原始的 $x$ 即可)

        Final set (assuming these are the only clauses):
        $\{ \{\neg P(x,f(x)), Q(x,g(x))\}, \{\neg P(x,f(x)), \neg R(x,g(x))\} \}$

!!! example "谓词逻辑归结证明：海豚问题"
    **已知：**

    1.  会朗读的人是识字的: $\forall x (\text{Read}(x) \to \text{Literate}(x))$
    2.  海豚都不识字: $\forall x (\text{Dolphin}(x) \to \neg \text{Literate}(x))$
    3.  有些海豚是很机灵的: $\exists x (\text{Dolphin}(x) \land \text{Intelligent}(x))$

    **求证：** 有些很机灵的东西不会朗读: $\exists x (\text{Intelligent}(x) \land \neg \text{Read}(x))$

    **1. 化为子句集:**

    - (1) $\forall x (\neg \text{Read}(x) \lor \text{Literate}(x)) \Rightarrow \{ (\neg \text{Read}(x_1), \text{Literate}(x_1)) \}$
    - (2) $\forall x (\neg \text{Dolphin}(x) \lor \neg \text{Literate}(x)) \Rightarrow \{ (\neg \text{Dolphin}(x_2), \neg \text{Literate}(x_2)) \}$
    - (3) $\exists x (\text{Dolphin}(x) \land \text{Intelligent}(x))$

        Skolemize: $\text{Dolphin}(a) \land \text{Intelligent}(a)$ (a is a Skolem constant)

        $\Rightarrow \{ (\text{Dolphin}(a)), (\text{Intelligent}(a)) \}$

    - 结论的否定: $\neg (\exists x (\text{Intelligent}(x) \land \neg \text{Read}(x)))$

        $\Leftrightarrow \forall x (\neg (\text{Intelligent}(x) \land \neg \text{Read}(x)))$

        $\Leftrightarrow \forall x (\neg \text{Intelligent}(x) \lor \text{Read}(x))$

        $\Rightarrow \{ (\neg \text{Intelligent}(x_3), \text{Read}(x_3)) \}$

    **2. 归结过程 (子句集 $S_0$):**
    ```
    1. (¬Read(x₁), Literate(x₁))      [前提1]
    2. (¬Dolphin(x₂), ¬Literate(x₂))  [前提2]
    3. (Dolphin(a))                   [前提3a]
    4. (Intelligent(a))                [前提3b]
    5. (¬Intelligent(x₃), Read(x₃))   [结论的否定]
    ---------------------------------------------------
    6. (¬Literate(a))                 [2, 3, MGU:{x₂/a}] (¬Dolphin(a)与Dolphin(a)归结)
    7. (¬Read(a))                    [1, 6, MGU:{x₁/a}] (Literate(a)与¬Literate(a)归结)
    8. (Read(a))                     [4, 5, MGU:{x₃/a}] (¬Intelligent(a)与Intelligent(a)归结)
    9. NIL                           [7, 8] (¬Read(a)与Read(a)归结)
    ```
    推导出空子句 NIL，因此原结论得证。

**6.6. 可判定性 (Decidability) 与 完备性 (Completeness)**

*   **可判定问题:** 如果存在一个算法，该算法用于求解该类问题时，可在有限步内停止，并给出正确的解答。
*   **谓词逻辑 (FOL):** 是**半可判定的 (semi-decidable)**。
    *   如果一个语句集是不可满足的，那么归结过程保证在有限步骤内推导出空子句 (归结是**反驳完备的 - refutation complete**)。
    *   如果语句集是可满足的，归结过程可能永不停止 (无法证明其可满足性)。
    *   "There can be no procedure to decide if a set of clauses is satisfiable."

**6.7. 应用归结原理求解问题 (问答系统)**

可以通过引入一个特殊的 `Answer` 谓词来从证明中提取答案。

1.  已知前提 $F$ 化为子句集 $S$。
2.  待求解的问题 $P(x)$ (假设我们想知道哪个 $x$ 满足 $P$)，将其否定并与 `Answer` 构成析取式: $\neg P(x) \lor \text{Answer}(x)$。
3.  将 $\neg P(x) \lor \text{Answer}(x)$ 化为子句并加入 $S$，得到 $S'$。
4.  对 $S'$ 应用归结原理。
5.  若得到归结式 $\text{Answer}(t)$，则 $t$ 就是问题的答案。

!!! example "说谎者问题 (来自PPT)"
    A, B, C 三人中有人从不说真话 (说谎者)，也有人从不说假话 (老实人)。

    问题：谁是说谎者？

    - A答：“B和C都是说谎者”
    - B答：“A和C都是说谎者”
    - C答：“A和B中至少有一个是说谎者”

    设 $T(x)$ 表示 $x$ 说真话 (老实人)，$\neg T(x)$ 表示 $x$ 说假话 (说谎者)。

    **前提的子句形式 (部分关键)：**

    - A的陈述: $T(A) \leftrightarrow (\neg T(B) \land \neg T(C))$
        $\Rightarrow \{(\neg T(A), \neg T(B)), (\neg T(A), \neg T(C)), (T(A), T(B), T(C))\}$
    - B的陈述: $T(B) \leftrightarrow (\neg T(A) \land \neg T(C))$
        $\Rightarrow \{(\neg T(B), \neg T(A)), (\neg T(B), \neg T(C)), (T(B), T(A), T(C))\}$
    - C的陈述: $T(C) \leftrightarrow (\neg T(A) \lor \neg T(B))$
        $\Rightarrow \{(\neg T(C), \neg T(A), \neg T(B)), (T(C), T(A)), (T(C), T(B))\}$
    - 假设至少有一个老实人，至少一个说谎者 (PPT中未明确写出，但通常暗含):
        $(T(A) \lor T(B) \lor T(C))$ 和 $(\neg T(A) \lor \neg T(B) \lor \neg T(C))$

    **求谁是老实人：** 加入查询子句 $\{ \neg T(x), \text{Answer}(x) \}$

    PPT演示了归结过程，最终得到 $\text{Answer}(C)$，所以 C 是老实人。

    **求谁不是老实人 (即说谎者)：** 证明 $\neg T(A)$。将其否定 $T(A)$ 加入子句集。

    PPT演示了归结过程，得到 NIL，所以 $\neg T(A)$ 成立，A 不是老实人。同理可证 B 也不是老实人。

---

## 7. 历史贡献

!!! quote "数学定理机械证明的先驱"
    - **吴文俊 (Wu Wenjun):** 中国数学家，其主要成就表现在拓扑学和数学机械化两个领域。"吴方法" 将几何问题代数化，利用伪除法判定条件方程组的解是否是结论方程组的解，不仅可以判断定理正确与否，还可以自动找出定理赖以成立的非退化条件。
    - **王浩 (Hao Wang):** 数理逻辑学家。1959年，王浩用他首创的“王氏算法”，在IBM-704计算机上用不到9分钟证明了《数学原理》中全部（350条以上）的一阶逻辑定理。被国际上公认为机器定理证明的开拓者之一。

---

## 课后作业

!!! question "问题一"
    求解 $P(a, x, h(g(z)))$ 和 $P(z, h(y), h(y))$ 的最一般合一项。

??? note "答案(仅供参考)"
      令： $E_1 = P(a, x, h(g(z)))$ $E_2 = P(z, h(y), h(y))$

      我们寻找一个替换 $\sigma$ 使得 $\sigma(E_1) = \sigma(E_2)$。

      比较第一个参数： $a$ (常量) 和 $z$ (变量)。 $\sigma_1 = {z/a}$。 应用 $\sigma_1$： 
      
      $\sigma_1(E_1) = P(a, x, h(g(a)))$
      
      $\sigma_1(E_2) = P(a, h(y), h(y))$

      比较第二个参数： $x$ (变量) 和 $h(y)$ (函数项)。 $\sigma_2 = {z/a, x/h(y)}$。
      
      应用 $\sigma_2$： 
      
      $\sigma_2(E_1) = P(a, h(y), h(g(a)))$
      
      $\sigma_2(E_2) = P(a, h(y), h(y))$

      比较第三个参数： $h(g(a))$ 和 $h(y)$。 函数符号 $h$ 相同。最终的替换是 $\sigma_3 = {z/a, x/h(g(a)), y/g(a)}$。 
      
      应用 $\sigma_3$： 

      $\sigma_3(E_1) = P(a, h(g(a)), h(g(a)))$ 
      
      $\sigma_3(E_2) = P(a, h(g(a)), h(g(a)))$

!!! question "问题二"
    试用归结法证明以下论断为有效的：有理数都是实数。无理数也都是实数。有些数不是实数。因此，有些数既不是有理数，也不是无理数。请使用以下谓词：Q(x) : x是有理数，R(x) : x是实数，W(x) : x是无理数。

??? note "答案(仅供参考)"
      将前提和结论翻译成谓词逻辑公式：

      前提1 (P1): 有理数都是实数。 $\forall x (Q(x) \rightarrow R(x))$

      前提2 (P2): 无理数也都是实数。 $\forall x (W(x) \rightarrow R(x))$

      前提3 (P3): 有些数不是实数。 $\exists x (\neg R(x))$

      结论 (C): 有些数既不是有理数，也不是无理数。 $\exists x (\neg Q(x) \land \neg W(x))$

      将结论否定 ($\neg C$)：

      $\neg C \equiv \neg (\exists x (\neg Q(x) \land \neg W(x)))$ $\equiv \forall x \neg (\neg Q(x) \land \neg W(x))$ $\equiv \forall x (Q(x) \lor W(x))$ (根据德摩根定律)

      所有公式（P1, P2, P3, $\neg C$）转换成子句形式：

      P1: $\forall x (Q(x) \rightarrow R(x))$

      消除蕴含： $\forall x (\neg Q(x) \lor R(x))$

      去掉全称量词 (变量 $x$ 保持为变量)： $\neg Q(x) \lor R(x)$

      子句 C1: ${\neg Q(x), R(x)}$

      P2: $\forall x (W(x) \rightarrow R(x))$

      消除蕴含： $\forall x (\neg W(x) \lor R(x))$

      去掉全称量词： $\neg W(x) \lor R(x)$

      子句 C2: ${\neg W(x), R(x)}$

      P3: $\exists x (\neg R(x))$

      Skolem化：引入一个Skolem常量（例如，$c$）来代替存在量词绑定的变量 $x$。 $\neg R(c)$

      子句 C3: ${\neg R(c)}$

      $\neg C: \forall x (Q(x) \lor W(x))$

      去掉全称量词： $Q(x) \lor W(x)$

      子句 C4: ${Q(x), W(x)}$
      
      用归结法从子句集 {C1, C2, C3, C4} 推导空子句 ($\square$)：

      我们当前的子句集是：

      ${\neg Q(x), R(x)}$

      ${\neg W(x), R(x)}$

      ${\neg R(c)}$

      ${Q(x), W(x)}$

      现在进行归结：

      步骤 1: 归结 C1 和 C3。 C1: ${\neg Q(x), R(x)}$ C3: ${\neg R(c)}$ 为了归结 $R(x)$ 和 $\neg R(c)$，我们需要一个最一般合一项 (MGU) $\sigma_1 = {x/c}$。 应用 $\sigma_1$ 后，得到新的子句 C5: 
      
      C5: ${\neg Q(c)}$ (来自 C1, C3)

      步骤 2: 归结 C2 和 C3。 C2: ${\neg W(x), R(x)}$ C3: ${\neg R(c)}$ 使用 MGU $\sigma_2 = {x/c}$。 应用 $\sigma_2$ 后，得到新的子句 C6: 
      
      C6: ${\neg W(c)}$ (来自 C2, C3)

      步骤 3: 归结 C4 和 C5。 C4: ${Q(x), W(x)}$ C5: ${\neg Q(c)}$ 使用 MGU $\sigma_3 = {x/c}$。 应用 $\sigma_3$ 后，得到新的子句 C7: 
      
      C7: ${W(c)}$ (来自 C4, C5)

      步骤 4: 归结 C6 和 C7。 C6: ${\neg W(c)}$ C7: ${W(c)}$ 这两个子句互补。 得到空子句: $\square$ (来自 C6, C7)

      结论：

      由于我们从前提和结论的否定推导出了空子句 ($\square$)，这表明前提和结论的否定是不可满足的（矛盾的）。因此，原始论断是有效的。

!!! question "问题三"
    给定前提集：
    
    （1）$Student(john)$，（2）$Student(jane)$，（3）$Happy(john) ∨ Happy(jane)$。

    求解下述问题的答案：$∃x[Student(x) ∧ Happy(x)]$

??? note "答案(仅供参考)"
    
    将结论否定
    
    $\neg C \equiv \neg \exist x (Student(x) \land Happy(x)) \equiv \forall x\neg Student(x)\lor \neg Happy(x) \equiv \neg Student(x) \lor \neg Happy(x)$，设为子句 C4

    归结 C1, C4，得到 C5：

    $\neg Happy(john)$

    归结 C2, C4, 得到 C6:

    $\neg Happy(jane)$

    归结 C3, C5, 得到 C7:
   
    $Happy(jane)$

    归结 C6, C7, 得到空子句 $\square$，因此前提和结论的否定是不可满足的。所以原始结论有效。