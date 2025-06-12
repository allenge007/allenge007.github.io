# z 变换

z 变换是离散时间信号与系统分析中的一个重要数学工具，它将离散时间序列（通常是时间变量 $n$ 的函数）转换为复频率变量 $z$ 的函数。它在数字信号处理、数字控制系统等领域扮演着与拉普拉斯变换在连续时间系统中类似的角色。

!!! abstract "双边 z 变换定义"
    对于一个离散时间序列 $x[n]$，其双边 z 变换 $X(z)$ 定义为：
    $$
    X(z) \triangleq \mathcal{Z}\{x[n]\} = \sum_{n = -\infty}^{+\infty} x[n] z^{-n}
    $$
    其中，$z$ 是一个复变量。这个定义也被称为双边 (bilateral) z 变换，因为它对序列的所有值（从 $n=-\infty$ 到 $n=+\infty$）进行求和。

## 与离散时间傅里叶变换 (DTFT) 的关系

z 变换可以看作是离散时间傅里叶变换 (DTFT) 的一种推广。回顾 DTFT 的定义：

$$
X(e^{j\omega}) = \mathcal{F}\{x[n]\} = \sum_{n=-\infty}^{+\infty} x[n] e^{-j\omega n}
$$

如果我们令 z 变换中的复变量 $z = re^{j\omega}$，其中 $r$ 是 $z$ 的模，$e^{j\omega}$ 是单位圆上的点，那么：

$$
X(re^{j\omega}) = \sum_{n=-\infty}^{+\infty} x[n] (re^{j\omega})^{-n} = \sum_{n=-\infty}^{+\infty} (x[n]r^{-n}) e^{-j\omega n}
$$

这表明 $X(re^{j\omega})$ 是序列 $x[n]r^{-n}$ 的离散时间傅里叶变换。

特别地，当 $z$ 位于 $s$ 平面上的**单位圆**时，即 $|z|=1$ 或 $r=1$，则 $z = e^{j\omega}$，此时 z 变换就等于 DTFT：
$$
X(z) \Big|_{z=e^{j\omega}} = X(e^{j\omega})
$$
因此，DTFT 可以看作是 z 变换在单位圆上的取值。如果一个序列的 z 变换的收敛域 (ROC) 包含单位圆，那么该序列的 DTFT 就存在。

## 收敛域 (Region of Convergence, ROC)

由于 z 变换是一个无穷级数，它不一定对所有的复数 $z$ 都收敛。使级数 $\sum_{n = -\infty}^{+\infty} x[n] z^{-n}$ 收敛的 $z$ 值的集合称为**收敛域 (ROC)**。ROC 是 $z$ 平面上的一个区域。

ROC 对于确定 z 变换的唯一性以及分析离散时间系统的性质（如稳定性、因果性）至关重要。对于一个给定的 $X(z)$，可能存在多个不同的时间序列 $x[n]$ 对应它，但如果同时指定了 $X(z)$ 及其 ROC，则 $x[n]$ 是唯一的。

**ROC 的一些性质：**

1.  ROC 是 $z$ 平面上的一个环形区域，以原点为中心。它可以延伸到 $z=0$ 或 $z=\infty$。
2.  ROC 不包含任何极点 (poles)。
3.  如果 $x[n]$ 是有限长序列，则 ROC 是整个 $z$ 平面，可能除去 $z=0$ 和/或 $z=\infty$。
    *   如果 $x[n]$ 仅在 $0 \le n \le N-1$ 非零，ROC 是整个 $z$ 平面，除了可能的 $z=0$（如果 $x[n]$ 在 $n>0$ 有值）和 $z=\infty$（如果 $x[n]$ 在 $n<0$ 有值）。
    *   如果 $x[n]$ 是因果的有限长序列 ($x[n]=0$ for $n<0$ and $n \ge N$)，ROC 是整个 $z$ 平面，可能除去 $z=0$。
    *   如果 $x[n]$ 是反因果的有限长序列 ($x[n]=0$ for $n>0$ and $n \le -M$)，ROC 是整个 $z$ 平面，可能除去 $z=\infty$。
4.  如果 $x[n]$ 是右边序列（即当 $n < N_1$ 时 $x[n]=0$），则 ROC 是一个圆的外部，形如 $|z| > r_{max}$，并可能包含 $z=\infty$。
5.  如果 $x[n]$ 是左边序列（即当 $n > N_2$ 时 $x[n]=0$），则 ROC 是一个圆的内部，形如 $|z| < r_{min}$，并可能包含 $z=0$。
6.  如果 $x[n]$ 是双边序列，则 ROC 可能是一个环形区域 $r_1 < |z| < r_2$，或者不存在。
7.  对于有理的 $X(z)$，ROC 的边界由极点决定。

## 逆 z 变换 (Inverse z-Transform)

逆 z 变换用于从频域表示 $X(z)$ 恢复离散时间序列 $x[n]$。其定义为：

$$
x[n] = \mathcal{Z}^{-1}\{X(z)\} = \frac{1}{2\pi j}\oint_C X(z)z^{n-1} dz
$$

这个积分是在 $z$ 平面上的复围线积分，积分路径 $C$ 是一条在 $X(z)$ 的收敛域 (ROC) 内逆时针环绕原点的闭合路径。

在实际应用中，通常使用以下方法求逆变换：

1.  **幂级数展开法**：将 $X(z)$ 展开成关于 $z^{-1}$（对于因果序列）或 $z$（对于反因果序列）的幂级数，级数的系数即为 $x[n]$。
2.  **部分分式展开法**：将有理函数 $X(z)$ 分解为简单分式的和，然后利用已知的 z 变换对查表得到每一项的逆变换。这是最常用的方法。
3.  **留数法**：直接计算围线积分，通过计算 $X(z)z^{n-1}$ 在 ROC 内的极点的留数得到。

## z 变换的性质

z 变换具有许多有用的性质，这些性质在分析离散时间信号和系统时非常方便。设 $\mathcal{Z}\{x[n]\} = X(z)$，ROC 为 $R_x$；$\mathcal{Z}\{y[n]\} = Y(z)$，ROC 为 $R_y$。

1.  **线性 (Linearity)**：

    $\mathcal{Z}\{ax_1[n] + bx_2[n]\} = aX_1(z) + bX_2(z)$

    ROC: 至少为 $R_{x1} \cap R_{x2}$

3.  **时移 (Time Shifting)**：

    $\mathcal{Z}\{x[n-n_0]\} = z^{-n_0}X(z)$

    ROC: $R_x$ (可能除去 $z=0$ 如果 $n_0 > 0$，或 $z=\infty$ 如果 $n_0 < 0$)

4.  **z 域尺度变换 (Scaling in z-domain / Multiplication by an Exponential Sequence)**：

    $\mathcal{Z}\{a^n x[n]\} = X(a^{-1}z)$

    ROC: $|a|R_x = \{z \text{ s.t. } z/a \in R_x\}$

5.  **时间反转 (Time Reversal)**：

    $\mathcal{Z}\{x[-n]\} = X(z^{-1})$

    ROC: $R_x^{-1} = \{z \text{ s.t. } z^{-1} \in R_x\}$

6.  **共轭 (Conjugation)**：

    $\mathcal{Z}\{x^*[n]\} = X^*(z^*)$

    ROC: $R_x$

7.  **卷积 (Convolution)**：

    $\mathcal{Z}\{x_1[n] * x_2[n]\} = X_1(z)X_2(z)$

    ROC: 至少为 $R_{x1} \cap R_{x2}$

    这是 z 变换最重要的性质之一，它将时域的卷积运算转换为了 z 域的乘积运算。

8.  **z 域微分 (Differentiation in z-domain / Multiplication by n)**：

    $\mathcal{Z}\{nx[n]\} = -z \frac{dX(z)}{dz}$
    ROC: $R_x$

9.  **初值定理 (Initial Value Theorem)**：

    如果 $x[n]$ 是因果序列 (即 $x[n]=0$ for $n<0$)，则：

    $x[0] = \lim_{z \to \infty} X(z)$

10. **终值定理 (Final Value Theorem)**：

    如果 $x[n]$ 是因果序列，并且 $(z-1)X(z)$ 的极点都在单位圆内部（不包括 $z=1$），则：

    $\lim_{N \to \infty} x[N] = \lim_{z \to 1} (z-1)X(z)$

## 使用 z 变换求解差分方程

z 变换是将线性常系数差分方程 (LCCDE) 转换为代数方程的强大工具，从而简化求解过程。

考虑一个一般的 LCCDE：

$$
\sum_{k=0}^{N} a_k y[n-k] = \sum_{m=0}^{M} b_m x[n-m]
$$

其中 $y[n]$ 是输出序列，$x[n]$ 是输入序列。

**求解步骤（通常使用单边 z 变换处理初始条件）：**

1.  **对差分方程两边取 z 变换**：
    利用 z 变换的线性和时移性质。如果考虑初始条件，应使用单边 z 变换。
    例如，对于双边 z 变换（不考虑初始条件，或假设初始松弛）：

    $\sum_{k=0}^{N} a_k z^{-k}Y(z) = \sum_{m=0}^{M} b_m z^{-m}X(z)$
    
    $Y(z) \left(\sum_{k=0}^{N} a_k z^{-k}\right) = X(z) \left(\sum_{m=0}^{M} b_m z^{-m}\right)$

2.  **求解 $Y(z)$**：

    得到系统函数 (传递函数) $H(z) = \frac{Y(z)}{X(z)}$：

    $$
    H(z) = \frac{\sum_{m=0}^{M} b_m z^{-m}}{\sum_{k=0}^{N} a_k z^{-k}} = z^{N-M} \frac{\sum_{m=0}^{M} b_m z^{M-m}}{\sum_{k=0}^{N} a_k z^{N-k}}
    $$

    然后 $Y(z) = H(z)X(z)$。

4.  **对 $Y(z)$ 取逆 z 变换得到 $y[n]$**：

    使用部分分式展开法和 z 变换表求 $Y(z)$ 的逆 z 变换。

---

## 单边 z 变换 (Unilateral z-Transform)

单边 z 变换主要用于分析因果离散时间序列和系统，特别是那些在 $n<0$ 时值为零的序列。它在求解带有初始条件的差分方程时非常有用。

!!! abstract "单边 z 变换定义"
    对于一个序列 $x[n]$，其单边 z 变换 $\mathcal{X}(z)$ (有时也用 $X_u(z)$ 或 $X_+(z)$ 表示) 定义为：
    $$
    \mathcal{X}(z) \triangleq \mathcal{Z}_u\{x[n]\} = \sum_{n=0}^{+\infty} x[n] z^{-n}
    $$
    注意积分下限是从 $n=0$ 开始。

### 主要特点和应用

1.  **处理因果序列**：由于求和从 $n=0$ 开始，单边 z 变换自动忽略了 $n<0$ 时的序列行为。对于因果序列（即对于 $n<0$，$x[n]=0$ 的序列），其单边和双边 z 变换是相同的。
2.  **求解差分方程（带初始条件）**：单边 z 变换的一个关键优势在于它能方便地处理差分方程的初始条件。其时移性质包含了初始条件项：
    *   **延迟性质 (Time Delay)**：

        $\mathcal{Z}_u\{x[n-k]\} = z^{-k}\mathcal{X}(z) + \sum_{m=1}^{k} x[-m]z^{-(k-m)}$  (对于 $k>0$)

        例如，对于 $k=1$: $\mathcal{Z}_u\{x[n-1]\} = z^{-1}\mathcal{X}(z) + x[-1]$

        对于 $k=2$: $\mathcal{Z}_u\{x[n-2]\} = z^{-2}\mathcal{X}(z) + x[-2] + x[-1]z^{-1}$

        如果序列是因果的，即 $x[-1]=x[-2]=\dots=0$，则简化为 $\mathcal{Z}_u\{x[n-k]\} = z^{-k}\mathcal{X}(z)$。

    *   **超前性质 (Time Advance)**：

        $\mathcal{Z}_u\{x[n+k]\} = z^{k}\mathcal{X}(z) - \sum_{m=0}^{k-1} x[m]z^{k-m}$ (对于 $k>0$)

        例如，对于 $k=1$: $\mathcal{Z}_u\{x[n+1]\} = z\mathcal{X}(z) - zx[0]$

        对于 $k=2$: $\mathcal{Z}_u\{x[n+2]\} = z^2\mathcal{X}(z) - z^2x[0] - zx[1]$

    这些性质使得将差分方程转换为代数方程时，初始条件可以直接代入。

### 使用单边 z 变换求解差分方程（带初始条件）

**求解步骤如下：**

1.  **对差分方程两边取单边 z 变换**：
    对差分方程中的每一项应用单边 z 变换，并利用其时移性质代入初始条件。
    例如，对于 $ay[n] + by[n-1] = cx[n]$，初始条件为 $y[-1]$:
    $a\mathcal{Y}(z) + b(z^{-1}\mathcal{Y}(z) + y[-1]) = c\mathcal{X}(z)$

2.  **代入初始条件和输入**：
    将给定的初始条件和输入信号的单边 z 变换 $\mathcal{X}(z)$ 代入。

3.  **求解 $\mathcal{Y}(z)$**：
    得到关于 $\mathcal{Y}(z)$ 的代数方程，求解它。$\mathcal{Y}(z)$ 通常包含零状态响应部分（由输入产生）和零输入响应部分（由初始条件产生）。

4.  **对 $\mathcal{Y}(z)$ 取逆 z 变换得到 $y[n]$ for $n \ge 0$**：
    使用部分分式展开法和 z 变换表求逆变换。

**示例：**
考虑差分方程 $y[n] - 0.5y[n-1] = u[n]$，初始条件 $y[-1]=1$。

1.  **取单边 z 变换**：

    $\mathcal{Z}_u\{y[n]\} - 0.5\mathcal{Z}_u\{y[n-1]\} = \mathcal{Z}_u\{u[n]\}$

    $\mathcal{Y}(z) - 0.5(z^{-1}\mathcal{Y}(z) + y[-1]) = \frac{1}{1-z^{-1}}$ (因为 $u[n]$ 的 z 变换是 $\frac{z}{z-1} = \frac{1}{1-z^{-1}}$ for $|z|>1$)

3.  **代入初始条件**：

    $\mathcal{Y}(z) - 0.5(z^{-1}\mathcal{Y}(z) + 1) = \frac{1}{1-z^{-1}}$

4.  **求解 $\mathcal{Y}(z)$**：

    $\mathcal{Y}(z)(1 - 0.5z^{-1}) - 0.5 = \frac{1}{1-z^{-1}}$

    $\mathcal{Y}(z)(1 - 0.5z^{-1}) = 0.5 + \frac{1}{1-z^{-1}} = \frac{0.5 - 0.5z^{-1} + 1}{1-z^{-1}} = \frac{1.5 - 0.5z^{-1}}{1-z^{-1}}$

    $\mathcal{Y}(z) = \frac{1.5 - 0.5z^{-1}}{(1-0.5z^{-1})(1-z^{-1})}$

    $\mathcal{Y}(z) = \frac{1.5z^2 - 0.5z}{(z-0.5)(z-1)}$ (乘以 $z^2/z^2$)

5.  **取逆 z 变换**：

    使用部分分式展开 $\frac{\mathcal{Y}(z)}{z}$ (一种常用的技巧) 或者直接对 $\mathcal{Y}(z)$ 展开：

    $\frac{1.5z - 0.5}{(z-0.5)(z-1)} = \frac{A}{z-0.5} + \frac{B}{z-1}$

    $A = \left.\frac{1.5z-0.5}{z-1}\right|_{z=0.5} = \frac{0.75-0.5}{0.5-1} = \frac{0.25}{-0.5} = -0.5$

    $B = \left.\frac{1.5z-0.5}{z-0.5}\right|_{z=1} = \frac{1.5-0.5}{1-0.5} = \frac{1}{0.5} = 2$

    所以，$\mathcal{Y}(z) = \frac{-0.5z}{z-0.5} + \frac{2z}{z-1}$ (这里我调整了形式以匹配 $a^n u[n] \leftrightarrow \frac{z}{z-a}$)
    或者，如果直接对 $\mathcal{Y}(z) = \frac{-0.5}{1-0.5z^{-1}} + \frac{2}{1-z^{-1}}$ (这是更直接的形式)

    $y[n] = -0.5(0.5)^n u[n] + 2(1)^n u[n] = 2u[n] - (0.5)^{n+1}u[n]$ for $n \ge 0$.

z 变换是分析和设计离散时间系统的基石，其性质和应用与连续时间系统中的拉普拉斯变换高度平行。