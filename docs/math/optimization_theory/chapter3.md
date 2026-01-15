# lec3:

## 二阶条件

!!! note

    $$
    若\ f:R^n\to R \ 可微, 则 f 为凸函数 \Leftrightarrow {\rm dom} f 为凸集\\
    \forall x \in {\rm dom} f,\quad D^2f(x) \succeq 0, \quad f''(x) \ge 0
    $$

范数

极大值函数（无法用二阶条件分析）

$$
f(x) = \max \{ x_1, \dots, x_n \}
$$

$$
\forall x, y \in R^n, \forall \theta \in [0, 1] \\
f(\theta x + (1 - \theta)y) = \max\{ \theta x_1 + (1 - \theta)y_1, \dots, \theta x_n + (1 - \theta)y_n\} \\
\le \theta \max\{ x_i\} + (1 - \theta)\max\{y_i\}\\
\theta f(x) + (1 - \theta)f(y) = \theta \max\{x_i\} + (1 - \theta)\max\{y_i\}
$$

解析近似：构造函数，无穷阶可微

logsumexp

$$
f(x) = \log (e^{x_1} + \dots + e^{x_n})
$$

$$
\max\{x_i\} \longleftrightarrow \log(\sum e^{x_i}) \\
e^{\max \{x_i\}} \le \sum e^{x_i} \le ne^{\max\{x_i\}} \\
\max \{x_i\} \le \log(\sum e^{x_i}) \le \log n + \max\{x_i\}
$$

证明凸性：

$$
\frac{\partial f}{\partial x_i} = \frac{1}{\sum e^{x_i}}e^{x_i} \\
\frac{\partial ^ 2 f}{\partial x_i\partial y_i} = -(\sum e^{x_i})^{-2}e^{x_j}e^{x_i} \quad (i\neq j) \\
\frac{\partial^2 f}{\partial x_i\partial x_i} = -(\sum e^{x_i})^{-2}e^{x_i}e^{x_i} + (\sum e^{x_i})^{-1}e^{x_i}\\
=(\sum e^{x_i})^{-2}[-e^{x_ix_i} + (\sum e^{x_i})e^{x_i}] \\
= (\sum e^{x_i})^{-2}
\begin{pmatrix}
-e^{x_1}e^(x_1) + (\sum e^{x_i})e^{x_1}, \dots, -e^{x_1}e^{x_n}\\
-e^{x_1}e^{x_n}m, \dots, -e^{x_n}e^{x_n} + (\sum e^{x_i})e^{x_n}
\end{pmatrix} \\
H = (1^T z){\rm Diag} z - zz^T \\
\forall v \in R^n, v^THv = (1^tz)v^T{\rm Diag}(z) v - v^T zz^Tv \\
= (\sum z_i)(\sum z_iv_i^2) - (\sum z_iv_i)^2\\
a_i = \sqrt z_i v_i, b_i = \sqrt z_i \\
v^THv = (b^Tb)(a^Ta) - (a^Tb)^2 \ge 0
$$

!!! question

    习题：
    
    $$
    f(x) = \log \det (x), x \succ 0
    $$

    是否为凹函数？

!!! tip

    考虑一维形式？（凹函数）

!!! note

    一个标量函数 $f(x)$（其中 $x$ 是一个矩阵）是凹函数的二阶条件是，其 Hessian 矩阵是负半定的。对于矩阵变量的函数，这等价于证明其在任意方向上的二阶方向导数均非正。

    具体来说，我们需要证明对于任意正定矩阵 $x \succ 0$ 和任意对称矩阵 $V$，下式成立：
    $$
    \frac{d^2}{dt^2} f(x+tV) \bigg|_{t=0} \le 0
    $$

    ### 证明步骤

    1.  **定义辅助函数**
        设 $x$ 是一个 $n \times n$ 的正定矩阵，$V$ 是一个任意的 $n \times n$ 对称矩阵。我们定义一个单变量函数 $g(t)$：
        $$
        g(t) = f(x+tV) = \log \det (x+tV)
        $$
        我们的目标是计算 $g''(t)$ 并在 $t=0$ 处求值。

    2.  **计算一阶导数 $g'(t)$**
        我们使用链式法则以及矩阵行列式的导数公式：$\frac{d}{dt} \det(A(t)) = \det(A(t)) \text{tr}(A(t)^{-1} \frac{d A(t)}{dt})$。
        由此可得对数行列式的导数公式：
        $$
        \frac{d}{dt} \log \det(A(t)) = \frac{1}{\det(A(t))} \frac{d}{dt} \det(A(t)) = \text{tr}\left(A(t)^{-1} \frac{d A(t)}{dt}\right)
        $$
        在我们的问题中，$A(t) = x+tV$，因此 $\frac{d A(t)}{dt} = V$。
        将此代入公式，我们得到 $g(t)$ 的一阶导数：
        $$
        g'(t) = \text{tr}\left((x+tV)^{-1} V\right)
        $$

    3.  **计算二阶导数 $g''(t)$**
        接下来，我们对 $g'(t)$ 求导。这需要用到矩阵逆的导数公式：$\frac{d}{dt} A(t)^{-1} = -A(t)^{-1} \left(\frac{d A(t)}{dt}\right) A(t)^{-1}$。
        $$
        \begin{aligned}
        g''(t) &= \frac{d}{dt} \text{tr}\left((x+tV)^{-1} V\right) \\
        &= \text{tr}\left(\frac{d}{dt}\left((x+tV)^{-1}\right) V\right) \\
        &= \text{tr}\left(-\left((x+tV)^{-1} \frac{d(x+tV)}{dt} (x+tV)^{-1}\right) V\right) \\
        &= \text{tr}\left(-(x+tV)^{-1} V (x+tV)^{-1} V\right)
        \end{aligned}
        $$
    

    4.  **在 $t=0$ 处求值**
        将 $t=0$ 代入 $g''(t)$ 的表达式：
        $$
        g''(0) = -\text{tr}\left(x^{-1} V x^{-1} V\right)
        $$

    5.  **证明 $g''(0) \le 0$**
        我们需要证明 $-\text{tr}\left(x^{-1} V x^{-1} V\right) \le 0$，这等价于证明 $\text{tr}\left(x^{-1} V x^{-1} V\right) \ge 0$。

        *   因为 $x$ 是正定矩阵 ($x \succ 0$)，所以它的逆 $x^{-1}$ 也是正定矩阵。
        *   因为 $x^{-1}$ 是正定的，所以它存在一个唯一的正定平方根，我们记为 $(x^{-1/2})$。
        *   利用迹 (trace) 的循环性质 $\text{tr}(AB) = \text{tr}(BA)$，我们可以重写表达式：
            $$
            \begin{aligned}
            \text{tr}(x^{-1} V x^{-1} V) &= \text{tr}(x^{-1/2} x^{-1/2} V x^{-1/2} x^{-1/2} V) \\
            &= \text{tr}\left((x^{-1/2} V x^{-1/2}) (x^{-1/2} V x^{-1/2})\right)
            \end{aligned}
            $$
        *   我们定义一个新矩阵 $A = x^{-1/2} V x^{-1/2}$。
        *   因为 $x^{-1/2}$ 和 $V$ 都是对称矩阵，所以 $A$ 也是一个对称矩阵。
        *   表达式变为 $\text{tr}(A^2)$。
        *   对于任何实对称矩阵 $A$，其迹可以表示为其特征值 $\lambda_i$ 的和。因此，$A^2$ 的特征值为 $\lambda_i^2$。
            $$
            \text{tr}(A^2) = \sum_{i=1}^n \lambda_i(A^2) = \sum_{i=1}^n (\lambda_i(A))^2
            $$
        *   由于特征值 $\lambda_i(A)$ 是实数，它们的平方 $(\lambda_i(A))^2$ 必然是非负的。
        *   因此，它们的和也必然是非负的：
            $$
            \text{tr}(A^2) = \sum_{i=1}^n (\lambda_i(A))^2 \ge 0
            $$
        *   这就证明了 $\text{tr}\left(x^{-1} V x^{-1} V\right) \ge 0$。

    6.  **结论**
        因为 $\text{tr}\left(x^{-1} V x^{-1} V\right) \ge 0$，所以：
        $$
        g''(0) = -\text{tr}\left(x^{-1} V x^{-1} V\right) \le 0
        $$
        由于二阶方向导数对于任意方向 $V$ 都是非正的，这表明函数 $f(x)$ 的 Hessian 矩阵是负半定的。因此，函数 $f(x) = \log \det (x)$ 在其定义域（所有正定矩阵的集合）上是凹函数。