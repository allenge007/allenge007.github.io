# 机器学习 - 聚类

## 1. 什么是聚类 (Clustering)？

聚类是一种无监督学习技术，其目标是：
> Finding groups of objects such that the objects in a group will be similar (or related) to one another and different from (or unrelated to) the objects in other groups.
> (寻找一组对象，使得同一组内的对象彼此相似（或相关），而与不同组内的对象不同（或不相关）。)

**核心思想：**

*   **簇内距离最小化 (Intra-cluster distances are minimized)**
*   **簇间距离最大化 (Inter-cluster distances are maximized)**

### 1.1 聚类的应用

*   **理解 (Understanding):**
    *   将相关文档分组以便浏览
    *   将具有相似功能的基因和蛋白质分组
    *   将价格波动相似的股票分组
*   **概括 (Summarization):**
    *   减少大型数据集的规模 (例如：Clustering precipitation in Australia)

### 1.2 聚类与监督分类/简单分割的区别

*   **监督分类 (Supervised classification):** 拥有类别标签信息 (Have class label information)。
*   **简单分割 (Simple segmentation):** 例如按姓氏字母顺序将学生分组注册，这并非基于数据内在相似性。

### 1.3 关键问题：确定簇的数量

聚类分析中一个基本的问题是确定数据中到底有多少个簇。例如，同一数据集可能被看作有2个、4个或6个簇。
(PPT中图示：Six Clusters, Two Clusters, Four Clusters)

---

## 2. 不同类型的聚类方法

### 2.1 分割式聚类 vs. 层次聚类

*   **分割式聚类 (Partitional Clustering):**
    *   将数据对象划分为不重叠的子集（簇），使得每个数据对象恰好属于一个子集。
    *   需要预先指定簇的数量 (e.g., K-Means)。
    *   *(PPT图示：A Partitional Clustering)*

*   **层次聚类 (Hierarchical clustering):**
    *   一组嵌套簇，组织为层次树结构 (树状图/谱系图 Dendrogram)。
    *   不需要预先指定簇的数量。
    *   *(PPT图示：Traditional Hierarchical Clustering, Non-traditional Hierarchical Clustering, Traditional Dendrogram, Non-traditional Dendrogram)*

### 2.2 其他聚类类型的区分

*   **模糊聚类 (Fuzzy) vs. 非模糊聚类 (Non-fuzzy):**
    *   在模糊聚类中，一个数据点可以属于每个簇，但具有不同的权重（0到1之间），权重之和为1。概率聚类有相似特征。
*   **部分聚类 (Partial) vs. 完全聚类 (Complete):**
    *   有时我们只想对数据的一部分进行聚类。
*   **异质聚类 (Heterogeneous) vs. 同质聚类 (Homogeneous):**
    *   簇的大小、形状和密度可能差异很大。

---

## 3. 不同类型的簇 (Types of Clusters)

根据簇的特性，可以分为以下几种类型：

*   **分离良好的簇 (Well-separated clusters):**
    *   簇是一组点，使得簇中的任何点与该簇中其他任何点的距离都小于其与簇外任何点的距离。
    *   *(PPT图示：3 well-separated clusters)*

*   **基于中心的簇 (Center-based clusters):**
    *   簇是一组对象，使得簇中的对象与其“中心”的距离比与其他任何簇中心的距离更近。
    *   中心通常是：
        *   **质心 (Centroid):** 簇中所有点的平均值。
        *   **中心点 (Medoid):** 簇中最具“代表性”的点。
    *   *(PPT图示：4 center-based clusters)*

*   **基于邻近性的簇 (Contiguous clusters / Nearest neighbor or Transitive):**
    *   簇是一组点，使得簇中的一个点与簇中一个或多个其他点的距离比与簇外任何点的距离更近。
    *   *(PPT图示：8 contiguous clusters)*

*   **基于密度的簇 (Density-based clusters):**
    *   簇是点的高密度区域，被低密度区域与其他高密度区域分隔开。
    *   适用于簇形状不规则或相互缠绕，且存在噪声和离群点的情况。
    *   *(PPT图示：6 density-based clusters)*

*   **基于属性或概念的簇 (Property or Conceptual / Shared Property):**
    *   寻找共享某些共同属性或代表特定概念的簇。
    *   *(PPT图示：2 Overlapping Circles)*

*   **基于目标函数的簇 (Described by an Objective Function):**
    *   寻找使目标函数最小化或最大化的簇。
    *   穷举法 (Enumerate all possible ways) 是NP难问题。
    *   层次聚类算法通常具有局部目标；分割式算法通常具有全局目标。

---

## 4. 相似性与不相似性度量 (Proximity Measures)

聚类的核心在于如何度量数据点之间的“远近”关系。

*   **图论视角：**
    *   将聚类问题映射到图论域：数据点为节点，点之间的邻近度（相似性/不相似性）为带权边。
    *   聚类等价于将图分解为连通分量。
    *   目标：最小化簇间边的权重，最大化簇内边的权重。

*   **常用距离/相似度函数：**
    *   **闵可夫斯基距离 (Minkowski Distance):**

        $d_p(x_i, x_j) = \left( \sum_{k=1}^{d} |x_{ik} - x_{jk}|^p \right)^{1/p}$
        其中 $d$ 是数据维度。

    *   **曼哈顿距离 (Manhattan Distance / L1 Norm):** $p=1$

        $d_1(x_i, x_j) = \sum_{k=1}^{d} |x_{ik} - x_{jk}|$

    *   **欧几里得距离 (Euclidean Distance / L2 Norm):** $p=2$

        $d_2(x_i, x_j) = \sqrt{\sum_{k=1}^{d} (x_{ik} - x_{jk})^2}$

    *   **切比雪夫距离 (Chebyshev Distance / L-infinity Norm):** $p \to \infty$
        
        $d_{\infty}(x_i, x_j) = \max_{k} |x_{ik} - x_{jk}|$

    *   **(PPT中提及) 最小距离 (L-minus-infinity Norm):** $p \to -\infty$

        $d_{-\infty}(x_i, x_j) = \min_{k} |x_{ik} - x_{jk}|$

    *   **余弦相似度 (Cosine Similarity) / 余弦距离 (Cosine Distance):**

        余弦相似度: $\cos(x_i, x_j) = \frac{x_i \cdot x_j}{||x_i||_2 ||x_j||_2}$
        余弦距离: $d_{cos}(x_i, x_j) = 1 - \cos(x_i, x_j)$

    *   **关系：** `Similarity = 1 - Dissimilarity`

---

## 5. 主要聚类算法

### 5.1 层次聚类 (Hierarchical Clustering)

*   **基本思想 (凝聚型 Agglomerative):**
    1.  开始时，将每个观测看作一个单独的簇。
    2.  重复执行以下两步：
        a.  识别出距离最近的两个簇。
        b.  合并这两个最相似的簇。
    3.  此迭代过程持续到所有簇都合并为一个簇。
*   *(PPT中提及：Omit, because... 暗示本讲重点不在此，但基本概念已给出)*

### 5.2 K-均值聚类 (K-Means Clustering)

K-Means是一种经典的分割式聚类算法。

*   **核心思想：**
    *   每个簇关联一个质心 (centroid)。
    *   每个点被分配给与其最近的质心所在的簇。
    *   必须预先指定簇的数量 $K$。

*   **基本算法步骤：**
    1.  **选择初始质心 (Initialization):** 随机选择 $K$ 个数据点作为初始质心。
    2.  **分配数据点 (Assignment):** 将每个数据点分配给离它最近的质心所代表的簇。
    3.  **更新质心 (Update):** 重新计算每个簇的质心（通常是簇内所有点的均值）。
    4.  **迭代 (Iteration):** 重复步骤2和3，直到质心不再发生显著变化或达到最大迭代次数。

*   **重要特性：**
    *   初始质心通常随机选择，导致每次运行结果可能不同。
    *   “邻近度”通常用欧几里得距离、余弦相似度等度量。
    *   K-Means对于常见的相似性度量会收敛。
    *   大部分收敛发生在最初几次迭代中。
    *   **停止条件：** 通常是质心不再变化，或只有很少的点改变簇分配。
    *   **复杂度：** $O(n \cdot K \cdot I \cdot d)$
        *   $n$: 数据点数量
        *   $K$: 簇的数量
        *   $I$: 迭代次数
        *   $d$: 数据点属性数量 (维度)

*   **评估K-Means聚类质量：SSE (Sum of Squared Error)**
    *   对于每个点，其误差是到最近簇中心的距离。SSE是这些误差的平方和。
    *   $SSE = \sum_{i=1}^{K} \sum_{x \in C_i} dist(m_i, x)^2$

        其中 $C_i$ 是第 $i$ 个簇，$m_i$ 是 $C_i$ 的质心 (代表点)。可以证明 $m_i$ 对应于簇的均值。
    *   SSE越小，聚类效果越好。

    *   **注意：** 简单增加K值会降低SSE，但这不一定代表更好的聚类。一个好的、K值较小的聚类可能比一个差的、K值较大的聚类有更低的SSE。

*   **选择K值：肘部法则 (Elbow Method)**
    *   绘制不同K值下的SSE折线图。
    *   如果折线图看起来像一个手臂，那么“肘部”对应的K值通常是最佳选择。

*   **K-Means的初始化问题：**
    *   如果初始质心选择不当，可能导致次优聚类结果。
    *   随机选择K个初始质心时，恰好从每个“真实”簇中选出一个质心的概率较小，尤其当K较大时。
        *   例如，若K=10，概率约为 $10!/10^{10} \approx 0.00036$。

*   **初始化问题的解决方案：**
    *   **多次运行 (Multiple runs):** 运行多次K-Means，选择SSE最小的结果。
    *   **采样与层次聚类：** 对数据采样，使用层次聚类确定初始质心。
    *   **选择多于K个初始质心：** 然后从中选择分布最广的K个。
    *   **二分K-Means (Bisecting K-Means):** 不易受初始化问题影响。它是一种K-Means的变体，可以产生分割式或层次式聚类。

        1.  初始将所有点视为一个簇。
        2.  重复以下步骤直到产生K个簇：

            1.  选择一个簇进行分裂（通常是SSE最大的簇或最大的簇）。

            2.  对此簇应用基本的K-Means算法（K=2）将其一分为二。

*   **处理空簇问题：**
    *   如果K-Means迭代中出现空簇，需要选择一个替换质心：
        *   选择对SSE贡献最大的点。
        *   从SSE最高的簇中选择一个点。
        *   如果存在多个空簇，可重复上述策略。

*   **预处理和后处理：**
    *   **预处理 (Pre-processing):** 标准化数据、消除离群点。
    *   **后处理 (Post-processing):**
        *   消除可能代表离群点的小簇。
        *   分裂“松散”的簇（SSE相对较高的簇）。
        *   合并“相近”且SSE相对较低的簇。

*   **K-Means的局限性：**
    *   难以处理不同大小 (Sizes)、不同密度 (Densities)、非球状 (Non-globular shapes) 的簇。
    *   对离群点 (Outliers) 敏感。
    *   *(PPT图示说明了K-Means在这些情况下的不良表现)*
    *   一种解决方案是使用更多的簇来拟合复杂形状，然后合并。

*   **K-Means++ 初始化：**
    *   一种更智能的初始化方法，旨在选择分散的初始质心。
    1.  从数据集中均匀随机选择第一个质心 $c_1$。
    2.  对 $i$ 从 2 到 $K$ 重复：
        *   对每个数据点 $x$，计算其到已选择的最近质心的距离 $D(x)$。
        *   根据概率 $P(x) = \frac{D(x)^2}{\sum_{j} D(x_j)^2}$ 从数据点中选择下一个质心 $c_i$。
        *   （直观上，距离现有质心越远的点，越有可能被选为下一个质心。）
    *   **缺点：** 需要K轮数据遍历，对于大规模数据和大的K值，扩展性不佳。

*   **K-Means|| 初始化：**
    *   针对K-Means++的扩展性问题提出。
    *   **主要思路：** 并非每次遍历只采样一个点，而是每次遍历采样 $O(K)$ 个点，重复该采样过程约 $O(\log n)$ 次（实际中几次即可），得到 $O(K \log n)$ 个候选点。
    *   然后对这 $O(K \log n)$ 个点聚类成 $K$ 个点，作为初始聚类中心。

*   **K-Means 示例计算：**

    !!!question "问题"
        假设有如下八个点：P1(1,2), P2(2,4), P3(1,9), P4(6,5), P5(4,2), P6(7,2), P7(8,2), P8(4,3)。
        
        使用K-Means算法对其进行聚类。
        
        设K=2，初始聚类两个中心点坐标分别为 $c_1=(1,2)$，$c_2=(8,2)$。算法使用曼哈顿距离（L1距离）作为距离度量。
        
        请计算一次迭代后的聚类中心坐标，并写出上述八个点分别属于哪个簇。
    
    ??? answer "解答"
        1.  **初始质心：** $c_1 = (1,2)$, $c_2 = (8,2)$
        2.  **计算各点到质心的曼哈顿距离并分配簇：**
            $d((x_a, y_a), (x_b, y_b)) = |x_a - x_b| + |y_a - y_b|$


        | 点   | 坐标   | 到 $c_1(1,2)$ 距离 | 到 $c_2(8,2)$ 距离 | 分配到簇 |
        |------|--------|--------------------|--------------------|----------|
        | P1   | (1,2)  | $|1-1|+|2-2|=0$    | $|1-8|+|2-2|=7$    | 簇1      |
        | P2   | (2,4)  | $|2-1|+|4-2|=3$    | $|2-8|+|4-2|=8$    | 簇1      |
        | P3   | (1,9)  | $|1-1|+|9-2|=7$    | $|1-8|+|9-2|=14$   | 簇1      |
        | P4   | (6,5)  | $|6-1|+|5-2|=8$    | $|6-8|+|5-2|=5$    | 簇2      |
        | P5   | (4,2)  | $|4-1|+|2-2|=3$    | $|4-8|+|2-2|=4$    | 簇1      |
        | P6   | (7,2)  | $|7-1|+|2-2|=6$    | $|7-8|+|2-2|=1$    | 簇2      |
        | P7   | (8,2)  | $|8-1|+|2-2|=7$    | $|8-8|+|2-2|=0$    | 簇2      |
        | P8   | (4,3)  | $|4-1|+|3-2|=4$    | $|4-8|+|3-2|=5$    | 簇1      |


        3.  **当前簇分配：**
            *   簇1: {P1(1,2), P2(2,4), P3(1,9), P5(4,2), P8(4,3)}
            *   簇2: {P4(6,5), P6(7,2), P7(8,2)}

        4.  **重新计算质心（各簇内点的坐标均值）：**
            *   新 $c_1'$:
                $x = (1+2+1+4+4)/5 = 12/5 = 2.4$
                $y = (2+4+9+2+3)/5 = 20/5 = 4$
                $c_1' = (2.4, 4)$
            *   新 $c_2'$:
                $x = (6+7+8)/3 = 21/3 = 7$
                $y = (5+2+2)/3 = 9/3 = 3$
                $c_2' = (7, 3)$

        **一次迭代后的结果：**
        *   簇1的中心点变为 $(2.4, 4)$，包含点 {P1, P2, P3, P5, P8}。
        *   簇2的中心点变为 $(7, 3)$，包含点 {P4, P6, P7}。

### 5.3 DBSCAN (Density-Based Spatial Clustering of Applications with Noise)

DBSCAN是一种基于密度的聚类算法。

*   **核心概念：**
    *   **Eps (ε):** 定义邻域的半径。
    *   **MinPts:** 定义核心点所需的邻域内最小点数。
    *   **核心点 (Core point):** 如果一个点在其Eps邻域内至少有MinPts个点（包括自身）。
    *   **边界点 (Border point):** 不是核心点，但落在某个核心点的Eps邻域内。
    *   **噪声点 (Noise point):** 既不是核心点也不是边界点。
    *   *(PPT图示：Point types: core, border and noise)*

*   **算法思想：**
    1.  从任意未访问点开始。
    2.  如果该点是核心点，则创建一个新簇，并将所有从该点密度可达（直接或间接通过其他核心点）的点加入该簇。
    3.  如果该点是边界点或噪声点，则暂时标记为噪声点，并处理下一个未访问点。
    4.  重复直到所有点都被访问。

*   **优点：**
    *   能发现任意形状的簇。
    *   能有效处理噪声数据。
    *   不需要预先指定簇的数量。
    *   *(PPT图示：Clusters (DBSCAN results showing resistance to noise and handling different shapes))*

*   **局限性：**
    *   对于密度差异很大的簇，效果不佳。
    *   对于高维数据，由于“维度灾难”，基于欧氏距离的密度定义可能失效。

*   **参数选择 (Eps 和 MinPts):**
    *   **MinPts:** 通常根据经验或领域知识设定，一般不小于3。
    *   **Eps:** 可以通过绘制 **k-距离图 (k-distance graph)** 来辅助选择。
        *   计算每个点到其第k个最近邻的距离 (k通常设为MinPts-1或MinPts)。
        *   将这些距离排序并绘制。
        *   图中的“拐点 (elbow/knee)”可以作为Eps的候选值。

*   **DBSCAN 复杂度与学术严谨性 (重要启示)：**
    *   原始DBSCAN论文 (KDD 1996) 声称平均运行时复杂度为 $O(N \log N)$ (其中N为数据点数)。
    *   后续许多论文也错误地引用了这个复杂度。
    *   SIGMOD 2015最佳论文 "DBSCAN Revisited: Mis-Claim, Un-Fixability, and Approximation" 指出：
        *   对于 $d \ge 3$ (维度)，DBSCAN 不可能有 $O(N \log N)$ 的时间复杂度。
        *   证明了在 $d \ge 3$ 时，DBSCAN问题至少需要 $\Omega(N^{4/3})$ 的时间来解决。
        *   提出了 $\rho$-approximate DBSCAN 作为高维大数据集上DBSCAN的替代方案。
    *   **启示：** 保持怀疑精神、善于思考和发现问题。科学研究的发展是在曲折中不断前进的。

---

## 6. K-Means 与 DBSCAN 的比较

| 特性                 | K-Means                                     | DBSCAN                                           |
|----------------------|---------------------------------------------|--------------------------------------------------|
| **聚类类型**         | 分割式，所有对象均分配到簇                    | 基于密度，可剔除噪声点                             |
| **簇概念**           | 基于原型/中心 (Prototype-based)             | 基于密度 (Density-based)                         |
| **簇形状**           | 倾向于球状簇，难以处理非球状簇                | 可处理任意形状的簇                               |
| **簇大小/密度差异**  | 对不同大小/密度的簇处理不佳                   | 对不同大小簇处理较好，但对密度差异大时表现不佳     |
| **参数定义**         | 需要定义簇中心 (如均值)                     | 需要定义密度 (Eps, MinPts)                       |
| **高维稀疏数据**     | 表现良好 (如文本聚类)                       | 使用欧氏距离定义密度时表现差 (维度灾难)            |
| **数据分布假设**     | 隐式假设数据呈球状高斯分布                    | 无特定假设，更灵活                               |
| **属性使用**         | 通常使用所有属性                            | 通常使用所有属性                                 |
| **簇数量**           | 用户预先定义 (K)                            | 自动确定 (由Eps, MinPts间接决定)                 |
| **对噪声敏感度**     | 敏感                                        | 不敏感，能识别噪声                               |

---

## 7. 聚类有效性评估 (Cluster Validity)

如何评估聚类结果的好坏？这是一个重要问题，但具有主观性 ("clusters are in the eye of the beholder!")。

### 7.1 为什么需要评估？

*   确定数据中是否存在非随机的簇结构 (聚类趋势)。
*   比较不同聚类算法的结果。
*   比较同一算法在不同参数下的两组簇。
*   将聚类结果与外部已知信息 (如类别标签) 进行比较。
*   评估聚类结果对数据的拟合程度 (不依赖外部信息)。
*   确定“正确”的簇数量。

### 7.2 评估指标的分类

*   **外部指标 (External Index):**
    *   用于衡量聚类标签与外部提供的类别标签的匹配程度。
    *   例如：熵 (Entropy)、F-measure, Jaccard Index, Rand Index.

*   **内部指标 (Internal Index):**
    *   用于衡量聚类结构的优良性，不依赖外部信息。关注簇的**内聚性 (Cohesion)** 和 **分离性 (Separation)**。
    *   例如：SSE (Sum of Squared Error)、轮廓系数 (Silhouette Coefficient)、Davies-Bouldin Index。

*   **相对指标 (Relative Index):**
    *   用于比较两种不同的聚类或簇。通常使用外部或内部指标来实现此功能。
    *   例如：使用SSE比较不同K值下K-Means的结果。

### 7.3 常用评估方法和指标

*   **基于矩阵的方法：**
    *   **邻近度矩阵 (Proximity Matrix):** 存储点对间的相似性或不相似性。
    *   **关联矩阵 ("Incidence" Matrix):** $N \times N$ 矩阵，若点 $i$ 和点 $j$ 属于同一簇，则 $(i,j)$ 元素为1，否则为0。
    *   计算这两个矩阵之间的**相关系数 (Correlation)**。高相关性表示同簇的点彼此接近。
    *   对于某些基于密度或邻近度的簇，此方法可能效果不佳。
    *   *(PPT图示：Correlation of incidence and proximity matrices for K-means clusterings)*

*   **可视化检查：**
    *   根据簇标签对相似度矩阵进行排序，并进行可视化检查。
    *   *(PPT图示：Visualizing similarity matrix for DBSCAN, K-means, Complete Linkage)*
    *   随机数据中的簇通常不那么清晰。复杂图形中的簇分离性可能不好。

*   **内部指标 - SSE (Sum of Squared Error):**
    *   已在K-Means部分讨论。可用于比较不同聚类或估计簇数量 (肘部法则)。
    *   *(PPT图示：SSE curve for a more complicated data set)*

*   **内聚性 (Cohesion) 与 分离性 (Separation):**
    *   **内聚性：** 衡量簇内对象的相关密切程度。
        *   例如：簇内平方和 (Within cluster sum of squares, WSS)，即SSE。

        $SSE = \sum_{i=1}^{K} \sum_{x \in C_i} dist^2(m_i, x)$
    
    *   **分离性：** 衡量一个簇与其他簇的区别或分离程度。
        *   例如：簇间平方和 (Between cluster sum of squares, BSS)。

        $SSB = \sum_{i=1}^{K} n_i \cdot dist^2(m_i, m)$
        其中 $n_i$ 是簇 $C_i$ 的大小，$m_i$ 是簇 $C_i$ 的中心，$m$ 是整个数据集的中心。
    
    *   **总平方和 (Total Sum of Squares, TSS):**

        $TSS = \sum_{x \in D} dist^2(x, m)$ (D是整个数据集)
    
    *   **关系：** $TSS = SSE + SSB$ (对于以均值为中心的平方距离度量)。当TSS固定时，最小化SSE等价于最大化SSB。
    
    *   *(PPT图示：Example calculation of SSE, SSB, Total for K=1 and K=2 clusters)*

*   **基于邻近图的方法：**
    *   **簇内聚性：** 簇内所有链接的权重之和。
    *   **簇分离性：** 簇内节点与簇外节点之间链接的权重之和。
    *   *(PPT图示：cohesion & separation in a graph)*

---

## 8. 总结

聚类是机器学习中的一个重要分支，旨在发现数据中潜在的群组结构。本讲介绍了聚类的基本概念、不同类型的聚类方法和簇、常用的相似性度量、核心算法（如K-Means和DBSCAN）及其优缺点、参数选择、以及聚类结果的评估方法。理解这些内容对于在实际应用中选择和使用合适的聚类技术至关重要。

---
**参考文献与扩展阅读：**

*   Ester, Martin, et al. "A density-based algorithm for discovering clusters in large spatial databases with noise." Kdd. Vol. 96. No. 34. 1996.
*   Gan, Junhao, and Yufei Tao. "DBSCAN Revisited: Mis-Claim, Un-Fixability, and Approximation." Proceedings of the 2015 ACM SIGMOD International Conference on Management of Data. ACM, 2015.
*   [K-Means可视化](https://www.naftaliharris.com/blog/visualizing-k-means-clustering/)
*   [Elbow Method可视化](https://bl.ocks.org/rpgove/0060ff3b656618e9136b)