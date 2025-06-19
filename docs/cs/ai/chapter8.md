# Transformer

!!! info "课程信息"
    本笔记总结自《人工智能》课程第17讲：深度学习II - Transformer。
    主要内容包括自然语言处理（NLP）基础、词向量表示（Word2Vec）、序列到序列模型（Seq2Seq）、注意力机制（Attention）以及Transformer模型的核心架构。

## 1. 自然语言处理 (NLP) 概览

自然语言处理 (NLP) 是探索计算机与人类语言之间交互的领域，旨在实现人与计算机之间使用自然语言进行有效通信。

!!! tip "NLP发展阶段"
    1.  **基于规则的经验主义**：早期依赖人工定义的规则和语法。
    2.  **基于统计的理性主义**：利用统计模型从大规模语料中学习语言规律。
    3.  **基于深度学习的方法**：受益于预训练语言模型和Transformer等架构，NLP取得了跨越式提升。

## 2. 词的表示 (Word Representations)

### 2.1 传统表示：One-hot 向量

在传统NLP中，单词被视为离散符号，可以用 one-hot 向量表示。

*   例如：
    *   `motel = [0 0 0 0 0 0 0 0 0 0 1 0 0 0 0]`
    *   `hotel = [0 0 0 0 0 0 0 1 0 0 0 0 0 0 0]`
*   向量维度 = 词典大小 (可能非常大, e.g., 500,000+)。

!!! warning "One-hot 向量的问题"
    *   **高维稀疏**：向量维度过大，且大部分元素为0。
    *   **无法表达语义相似性**：任意两个不同单词的one-hot向量都是正交的，无法体现它们在概念上的相似性。例如，`motel` 和 `hotel` 的点积为0。

### 2.2 分布式表示：词嵌入 (Word Embeddings)

**分布语义学 (Distributional Semantics)**：一个词的含义由其上下文（经常一起出现的词）给出。
> "You shall know a word by the company it keeps" (J. R. Firth 1957: 11)

*   为每个单词构建一个**简短而密集**的实数向量（通常50-300维）。
*   使得在相似上下文中出现的单词具有相似的向量表示（通过点积衡量相似性）。
*   这些向量也称为词嵌入 (Word Embeddings) 或词表征 (Word Representations)。

!!! success "为什么使用简短密集的词向量？"
    *   **易于作为机器学习特征**：维度较低。
    *   **泛化能力强**：比显式计数更能捕捉词义。
    *   **捕捉同义关系**：语义相近的词向量也相近。

### 2.3 Word2Vec

Word2Vec (Mikolov et al. 2013) 是一个学习词向量的框架。

**核心思想**：
1.  拥有一个大型文本语料库。
2.  固定词汇表中的每个单词都由一个向量表示。
3.  遍历文本中的每个位置 `t`，包含一个中心词 `c` 和上下文（“外部”）词 `o`。
4.  使用 `c` 和 `o` 的词向量相似性来计算给定 `c` 时 `o` 的概率（反之亦然）。
5.  不断调整单词向量来最大化此概率。

**目标函数**：
最小化负对数似然的均值。对于中心词 $w_t$ 和窗口大小为 $m$ 的上下文词 $w_{t+j}$（$j \ne 0, -m \le j \le m$）：
$$ J(\theta) = -\frac{1}{T} \sum_{t=1}^{T} \sum_{-m \le j \le m, j \ne 0} \log P(w_{t+j} | w_t; \theta) $$

**计算概率 $P(o|c; \theta)$**：
对每个单词 `w`，使用两个向量：
*   $v_w$：当 `w` 是中心词时。
*   $u_w$：当 `w` 是上下文词时。
这两个向量都是模型参数 $\theta$ 的一部分。
对于中心词 `c` 和上下文词 `o`：
$$ P(o|c) = \frac{\exp(u_o^T v_c)}{\sum_{w' \in V} \exp(u_{w'}^T v_c)} $$
其中 $V$ 是词汇表。

**Word2Vec的两种模型架构**：
1.  **Continuous Bag of Words (CBOW)**：使用窗口中的上下文单词来预测中心词。
    *   输入：上下文词向量的平均 (或拼接)。
    *   输出：中心词的概率分布。
2.  **Skip-grams**：使用中心词来预测窗口中的上下文单词。
    *   输入：中心词向量。
    *   输出：各个上下文词的概率分布。

    ![Word2Vec CBOW and Skip-gram](https://i.imgur.com/Q0bZg2j.png)
    *(示意图，实际PPT中为更详细的结构图)*

**Word2Vec 训练参数 (以Skip-gram为例，预测一个上下文词)**:
*   输入层: 中心词 $x$ (one-hot vector, $R^{|V|}$)
*   隐藏层: $h = W^T x = v_c$ (中心词的词向量, $R^N$)
    *   $W$ 是输入到隐藏层的权重矩阵 ($R^{|V| \times N}$)，其行是中心词向量 $v_w$。
*   输出层: $z = W' h$ ($R^{|V|}$)
    *   $W'$ 是隐藏层到输出层的权重矩阵 ($R^{N \times |V|}$)，其列是上下文词向量 $u_w$。
*   $P(o|c) = \text{softmax}(z)$
*   需要学习的参数是 $W$ 和 $W'$。

!!! note "词向量的线性关系"
    训练好的词向量可以捕捉到一些线性关系，例如：
    `vector('king') - vector('man') + vector('woman') ≈ vector('queen')`

!!! warning "Word2Vec的盲点"
    *   无法有效处理训练语料中距离较远的词之间的关系。
    *   对于有相似词缀（前缀/后缀）的词，无法在词向量中直接表示这种构词法上的相似性。
    *   GloVe 和 FastText 等方法被提出来解决这些问题。

## 3. 机器翻译 (Machine Translation, MT)

MT任务：将一种语言（源语言）的句子 $x$ 翻译为另一种语言（目标语言）的句子 $y$。

### 3.1 统计机器翻译 (SMT) vs. 神经机器翻译 (NMT)

*   **SMT (1990s-2010s)**：
    *   系统复杂，包含许多单独设计的子组件。
    *   需要大量特征工程和额外的语言资源（如短语表）。
    *   人力维护成本高。
*   **NMT (2014 onwards)**：
    *   使用编码器-解码器 (Encoder-Decoder) 神经网络模型。
    *   端到端训练，减少了特征工程。
    *   迅速成为主流，性能超越SMT。

### 3.2 Seq2Seq 模型

*   **核心思想**：
    1.  **编码器 (Encoder)**：一个神经网络（通常是RNN，如LSTM/GRU）读取输入序列 $x = (x_1, \dots, x_{T_x})$ 并将其压缩成一个固定长度的上下文向量 (context vector) $c$。
    2.  **解码器 (Decoder)**：另一个神经网络（通常是RNN）以 $c$ 为初始状态，逐个生成目标序列 $y = (y_1, \dots, y_{T_y})$ 中的词。
*   Seq2Seq 模型是**条件语言模型**：解码器预测下一个词，其预测以源句子 $x$ (通过 $c$) 为条件。
*   **应用广泛**：文本摘要、对话系统、代码生成等。

!!! success "NMT的巨大成功"
    NMT 从2014年的边缘研究迅速发展成为2016年的领先标准方法。例如，谷歌翻译在2016年从SMT转向NMT。

## 4. 注意力机制 (Attention Mechanism)

Seq2Seq模型的一个瓶颈是编码器需要将源句子的所有信息压缩到一个固定长度的向量 $c$ 中，这对于长句子来说很困难。

**注意力机制的核心思想**：
在解码器的每一步，允许解码器**直接查看并关注 (attend to)** 源序列的不同部分，而不是仅仅依赖于最终的上下文向量 $c$。

*   解码器在生成每个目标词时，会计算源序列中每个词的**注意力权重 (attention weights)**。
*   这些权重决定了在当前解码步骤中，源序列的哪些部分更重要。
*   然后，根据这些权重对编码器的隐藏状态进行加权求和，得到一个动态的上下文向量，用于当前词的预测。

!!! abstract "注意力机制的优势"
    *   **提升NMT性能**：允许解码器专注于源句子的相关部分。
    *   **解决瓶颈问题**：解码器可以直接查看源序列，无需将所有信息压缩到单一向量。
    *   **缓解梯度消失**：提供了到源序列较远状态的“捷径”。
    *   **提供可解释性**：通过注意力分布，可以看到解码器在生成某个词时关注了源句子的哪些部分，相当于获得了“软对齐”。

**更一般的注意力定义**：
给定一个查询向量 (query) 和一组键值对 (key-value pairs)，注意力机制计算一个输出，该输出是值的加权和，其中每个值的权重由查询和对应键的相似度计算得出。
*   在Seq2Seq+Attention中：解码器隐藏状态是query，编码器隐藏状态是keys和values。

!!! quote "核心结论"
    注意力机制已成为深度学习模型中强大、灵活、普适的指路牌与记忆操作范式。

## 5. Transformer: Attention Is All You Need?

[Vaswani et al., 2017] 提出的Transformer模型，完全摒弃了RNN结构，仅依赖注意力机制来捕捉输入和输出之间的依赖关系。

### 5.1 自注意力 (Self-Attention)

自注意力允许输入序列中的每个位置关注输入序列中的所有其他位置（包括自身），以计算该位置的新表示。

**将自注意力类比为“模糊的”哈希表**：
*   **Query (Q)**: 当前词，用于查询信息。
*   **Key (K)**: 序列中的其他词，用于与Query匹配。
*   **Value (V)**: 序列中其他词的实际内容。
Query和Key计算相似度（注意力分数），该分数作为权重，对Values进行加权求和。

**自注意力计算步骤** (对于输入词嵌入 $x_i$):
1.  **生成Q, K, V向量**：
    $$ q_i = W^Q x_i $$
    $$ k_i = W^K x_i $$
    $$ v_i = W^V x_i $$
    其中 $W^Q, W^K, W^V$ 是可学习的权重矩阵。

2.  **计算注意力分数 (Attention Scores)**：Query与所有Keys的点积。为了梯度稳定，通常会进行缩放。
    $$ e_{ij} = \frac{q_i^T k_j}{\sqrt{d_k}} $$
    其中 $d_k$ 是key向量的维度。

3.  **归一化分数 (Softmax)**：对分数进行softmax，得到注意力权重 $\alpha_{ij}$。
    $$ \alpha_{ij} = \text{softmax}_j(e_{ij}) = \frac{\exp(e_{ij})}{\sum_{l=1}^{T_x} \exp(e_{il})} $$

4.  **计算输出 (Weighted Sum of Values)**：用注意力权重对Value向量进行加权求和。
    $$ o_i = \sum_{j=1}^{T_x} \alpha_{ij} v_j $$
    $o_i$ 即为词 $x_i$ 经过自注意力层后的新表示。

**向量化表示**：
输入词嵌入矩阵 $X \in \mathbb{R}^{T_x \times d_{model}}$
1.  $Q = X W^Q$
2.  $K = X W^K$
3.  $V = X W^V$
4.  $Scores = \frac{QK^T}{\sqrt{d_k}}$
5.  $A = \text{softmax}(Scores)$ (按行softmax)
6.  $Output = AV$

### 5.2 解决自注意力的局限

1.  **缺乏非线性**：自注意力本身是线性操作（加权平均）。
    *   **解决方案**：在自注意力层之后添加一个**前馈神经网络 (Feed-Forward Network, FFN)**，通常包含两层线性变换和一个ReLU激活函数。
        $$ \text{FFN}(x) = \max(0, xW_1 + b_1)W_2 + b_2 $$

2.  **无法感知序列顺序**：自注意力对输入顺序不敏感（置换不变性）。
    *   **解决方案**：**位置编码 (Positional Encoding)**。将位置信息编码成向量 $p_i$，并将其加到输入词嵌入 $x_i$ 上。
        $$ x'_{i} = x_i + p_i $$
    *   位置编码向量 $p_i$ 可以是学习得到的，也可以是固定的（如使用不同频率的正弦和余弦函数）。

### 5.3 多头注意力 (Multi-Head Attention)

与其只用一组 $W^Q, W^K, W^V$ 计算一次注意力，多头注意力机制允许模型并行地多次执行注意力计算。
1.  将Q, K, V分别线性投影 $h$ 次（$h$ 是头的数量），得到 $h$ 组不同的 $Q_head, K_head, V_head$。
2.  对每一组 $Q_{head_i}, K_{head_i}, V_{head_i}$ 并行计算自注意力，得到 $h$ 个输出向量 $o_i$。
3.  将这 $h$ 个输出向量拼接 (concatenate) 起来，再通过一个线性变换得到最终输出。
    $$ \text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \dots, \text{head}_h) W^O $$
    $$ \text{head}_i = \text{Attention}(QW_i^Q, KW_i^K, VW_i^V) $$
    其中 $W_i^Q, W_i^K, W_i^V, W^O$ 是可学习的参数矩阵。

**优势**：允许模型在不同位置关注来自不同子空间表征的信息，增强了模型的表达能力。

*(示意图，源自 "Attention Is All You Need" 论文)*

### 5.4 Transformer 整体架构

Transformer模型主要由编码器 (Encoder) 和解码器 (Decoder) 堆栈组成。

!!! note "Encoder 结构"
    每个编码器层包含两个主要的子层：
    1.  **多头自注意力机制 (Multi-Head Self-Attention)**
    2.  **位置全连接前馈网络 (Position-wise Feed-Forward Network)**
    每个子层都采用了残差连接 (Residual Connection) 和层归一化 (Layer Normalization)。
    $$ \text{Output} = \text{LayerNorm}(x + \text{Sublayer}(x)) $$

    *(示意图，源自 "Attention Is All You Need" 论文，左半部分)*

!!! note "Decoder 结构"
    每个解码器层包含三个主要的子层：
    1.  **掩码多头自注意力机制 (Masked Multi-Head Self-Attention)**：
        *   在自注意力计算中，为了防止解码器在预测当前词时“看到”未来的词（作弊），需要对未来的位置进行掩码 (masking)，即将其注意力分数设为 $-\infty$。
    2.  **多头编码器-解码器注意力机制 (Multi-Head Encoder-Decoder Attention)**：
        *   Query ($Q$) 来自前一个解码器层的输出。
        *   Key ($K$) 和 Value ($V$) 来自编码器的最终输出。
        *   这允许解码器的每个位置关注输入序列的所有位置。
    3.  **位置全连接前馈网络 (Position-wise Feed-Forward Network)**
    同样，每个子层都采用了残差连接和层归一化。

    *(示意图，源自 "Attention Is All You Need" 论文，右半部分)*

**最终输出**：
解码器堆栈的输出会经过一个线性层，将向量投影到词汇表大小的维度，然后通过一个Softmax层生成下一个词的概率分布。

*(示意图，源自 "Attention Is All You Need" 论文)*

## 6. 总结与展望

Transformer架构凭借其强大的并行计算能力和对长距离依赖的出色建模，已成为现代NLP领域几乎所有最先进模型的基础。随着模型大小、训练数据和计算资源的增加，基于Transformer的语言模型性能仍在持续提升，展现出巨大的潜力。