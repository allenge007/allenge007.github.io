# lec1: 仿射与凸性

## 仿射 (Affine Transformation)

### 仿射集（空间） (Affine Space)

!!! note
    $$
    \forall x_1, x_2\in C, \{\theta x_1 + (1 - \theta)x_2, \forall \theta \in R\} \subseteq C
    $$

如何理解？

设想一个没有原点的向量空间，其中向量只有方向和大小。假设有甲乙两人，其中甲知道一个空间中真正的原点，但是乙认为另一个点 $p$ 才是真正的原点。

现在求两个向量之和 $a + b$。乙画出 $p\to a$ 和 $p\to b$，再用平行四边形找出二者之和 $p + (a - p) + (b - p)$

### 仿射组合

!!! note

    $$
    x_1, \dots, x_k \in C \\
    \theta_1, \dots, \theta_k \in C \\
    \sum\theta_i=1\\
    \sum \theta_i x_i
    $$

### 仿射包

!!! note
    包含某集合的最小仿射集

    $$
    {\rm aff \ } C \triangleq \{ \sum \theta_i x_i | \forall x_i \in C, \forall \theta_i \ge 0, \sum \theta_i = 1 \}
    $$



## 凸集

!!! note
    $$
    \forall x_1, x_2 \in C, \{ \theta x_1 + (1 - \theta)x_2, \forall \theta\in [0, 1]\} \subseteq C
    $$

## 凸组合

!!! note

    $$
    x_1, \dots, x_n \in C \\
    \theta_1, \dots, \theta_k \in R \\
    \sum \theta_i = 1, \theta_i \ge 0 \\
    \sum \theta_i x_i
    $$

## 凸包

!!! note

    $$
    {\rm Conv\ } C = \{\theta_1x_1 + , \dots, +  \theta_n x_n\}
    $$

!!! example

    1. 凸多边形是凸集。可以任取凸多边形内两点连线，证明其为凸集。
    2. 超平面：$\{x | a^Tx = b, a\neq 0\}, a, b, x\in R^n$，可见，超平面将 $R^n$ 空间分为了 2 部分。超平面显然是一个凸集，因为在该平面上任取 2 点连成的线段仍然在该平面内。
    3. 半空间：$\{x | a^Tx \ge b, a\neq 0\}$ 或 $\{x | a^Tx \le b, a\neq 0\}$，这就是上述超平面将 $R^n$ 分为的两个空间。

## 凸锥

!!! note

    $$
    \forall x_1, x_2 \in C, \forall \theta_1, \theta_2 \ge 0 \\
    \{ \theta_1 x_1 + \theta_2 x_2 \} \subseteq C
    $$

## 凸锥组合

!!! note

    $$
    x_1, \dots, x_n \in C \\
    \theta_1, \dots, \theta_n \in R, \forall \theta_i\ge 0\\
    \sum \theta_i x_i
    $$

## 凸锥包

