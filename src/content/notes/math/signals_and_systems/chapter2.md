# 离散时间傅里叶变换

离散时间傅里叶变换是将离散时间序列从时域转换到频域的数学工具。它揭示了离散时间信号中包含的频率成分。与连续时间傅里叶变换不同，DTFT 的结果 $X(e^{j\omega})$ 是一个关于连续频率变量 $\omega$ 的**周期函数**，周期为 $2\pi$。

## 1. 非周期序列的 DTFT

对于一个非周期离散时间序列 $x[n]$，其离散时间傅里叶变换 $X(e^{j\omega})$ 定义为：

$$
X(e^{j\omega}) = \mathcal{F}\{x[n]\} = \sum_{n = -\infty}^{+\infty} x[n]e^{-j\omega n} \quad \quad (1)
$$

其中：

*   $n$ 是离散时间整数索引。
*   $\omega$ 是归一化数字角频率，单位是弧度/样本 ($\text{rad/sample}$)。它是一个连续变量。
*   $e^{j\omega}$ 表示在复平面上的单位圆。
*   $X(e^{j\omega})$ 通常是一个复数函数，表示信号在频率 $\omega$ 处的幅度和相位。
    *   幅度谱：$|X(e^{j\omega})|$
    *   相位谱：$\angle X(e^{j\omega})$

**周期性**：$X(e^{j\omega})$ 是以 $2\pi$ 为周期的，即 $X(e^{j(\omega+2\pi k)}) = X(e^{j\omega})$ 对于任意整数 $k$。因此，我们通常只分析主值区间，如 $-\pi \le \omega < \pi$ 或 $0 \le \omega < 2\pi$。

离散时间傅里叶反变换 (Inverse DTFT, IDTFT) 用于从频域表示 $X(e^{j\omega})$ 恢复时域序列 $x[n]$：

$$
x[n] = \mathcal{F}^{-1}\{X(e^{j\omega})\} = \frac{1}{2\pi}\int_{2\pi} X(e^{j\omega})e^{j\omega n} d\omega \quad \quad (2)
$$

积分区间可以是任何长度为 $2\pi$ 的区间，例如 $[-\pi, \pi]$ 或 $[0, 2\pi]$。

公式 (1) 和 (2) 构成了 DTFT 对。

**存在条件**：

一个序列 $x[n]$ 存在 DTFT 的充分条件是该序列绝对可和，即：

$$
\sum_{n = -\infty}^{+\infty} |x[n]| < \infty
$$

对于不满足此条件的某些序列（如单位阶跃序列），其 DTFT 可能不收敛，或者需要在广义函数（如冲激函数）的意义下定义。有限能量序列（$\sum_{n = -\infty}^{+\infty} |x[n]|^2 < \infty$）也存在 DTFT，但求和可能只在均方意义下收敛。

## 2. 周期序列的 DTFT

对于周期为 $N$ 的周期序列 $x[n]$（即 $x[n] = x[n+N]$），它可以表示为离散傅里叶级数 (DFS)：

$$
x[n] = \sum_{k = \langle N \rangle} a_k e^{jk(2\pi/N)n} = \sum_{k=0}^{N-1} a_k e^{jk\omega_k n}
$$

其中 $\omega_k = \frac{2\pi k}{N}$ 是离散的谐波频率，$a_k$ 是 DFS 系数：

$$
a_k = \frac{1}{N}\sum_{n = \langle N \rangle} x[n]e^{-jk(2\pi/N)n} = \frac{1}{N}\sum_{n=0}^{N-1} x[n]e^{-jk\omega_k n}
$$

符号 $\sum_{k = \langle N \rangle}$ 表示对任意 $N$ 个连续整数求和。

周期序列的 DTFT 可以通过对 DFS 中的每一项取 DTFT 得到。利用 $e^{j\omega_0 n} \stackrel{\mathcal{F}}{\longleftrightarrow} 2\pi\sum_{l=-\infty}^{+\infty}\delta(\omega - \omega_0 - 2\pi l)$ 这一变换对（注意这里的冲激串是由于 DTFT 的周期性），我们得到：

$$
X(e^{j\omega}) = \mathcal{F}\left\{\sum_{k=0}^{N-1} a_k e^{jk(2\pi/N)n}\right\} = \sum_{k=0}^{N-1} a_k \mathcal{F}\{e^{jk(2\pi/N)n}\}
$$

$$
X(e^{j\omega}) = \sum_{k=0}^{N-1} 2\pi a_k \sum_{l=-\infty}^{+\infty} \delta\left(\omega - \frac{2\pi k}{N} - 2\pi l\right)
$$

在主值区间 $[0, 2\pi)$ 内，这简化为：

$$
X(e^{j\omega}) = \sum_{k=0}^{N-1} 2\pi a_k \delta\left(\omega - \frac{2\pi k}{N}\right), \quad \text{for } \omega \in [0, 2\pi) \quad \quad (3)
$$

这表明周期序列的 DTFT 是在其谐波频率 $\frac{2\pi k}{N}$ 处的一系列冲激函数，冲激的强度（面积）为 $2\pi a_k$。

## DTFT 的性质

DTFT 具有许多与 CTFT 类似的性质。设 $x[n] \stackrel{\mathcal{F}}{\longleftrightarrow} X(e^{j\omega})$ 和 $y[n] \stackrel{\mathcal{F}}{\longleftrightarrow} Y(e^{j\omega})$。

1.  **线性 (Linearity)**：

    $ax[n] + by[n] \stackrel{\mathcal{F}}{\longleftrightarrow} aX(e^{j\omega}) + bY(e^{j\omega})$

3.  **时移 (Time Shifting)**：

    $x[n-n_0] \stackrel{\mathcal{F}}{\longleftrightarrow} e^{-j\omega n_0}X(e^{j\omega})$

    时域的整数延迟 $n_0$ 对应于频域乘以一个线性相移因子 $e^{-j\omega n_0}$。

5.  **频移 (Frequency Shifting / Modulation)**：

    $e^{j\omega_0 n}x[n] \stackrel{\mathcal{F}}{\longleftrightarrow} X(e^{j(\omega - \omega_0)})$

    时域乘以复指数 $e^{j\omega_0 n}$ 对应于频域的频谱搬移。

7.  **时间反转 (Time Reversal)**：

    $x[-n] \stackrel{\mathcal{F}}{\longleftrightarrow} X(e^{-j\omega})$

    如果 $x[n]$ 是实序列，则 $X(e^{-j\omega}) = X^*(e^{j\omega})$。

9.  **共轭对称性 (Conjugate Symmetry for Real Sequences)**：

    如果 $x[n]$ 是实序列，则 $X(e^{j\omega}) = X^*(e^{-j\omega})$。
    这意味着：

    *   幅度谱是偶对称的：$|X(e^{j\omega})| = |X(e^{-j\omega})|$
    *   相位谱是奇对称的：$\angle X(e^{j\omega}) = -\angle X(e^{-j\omega})$

11. **卷积 (Convolution)**：

    $x[n] * y[n] = \sum_{k = -\infty}^{+\infty} x[k]y[n-k] \stackrel{\mathcal{F}}{\longleftrightarrow} X(e^{j\omega})Y(e^{j\omega})$

    时域卷积对应频域相乘。这是分析离散时间 LTI 系统的核心性质。

13. **相乘 (Multiplication / Windowing)**：

    $x[n]y[n] \stackrel{\mathcal{F}}{\longleftrightarrow} \frac{1}{2\pi}X(e^{j\omega}) \circledast Y(e^{j\omega}) = \frac{1}{2\pi}\int_{2\pi} X(e^{j\theta})Y(e^{j(\omega-\theta)})d\theta$
    
    时域相乘对应频域的周期卷积（并除以 $2\pi$）。

15. **差分 (Differencing in Time Domain)**：

    $x[n] - x[n-1] \stackrel{\mathcal{F}}{\longleftrightarrow} (1 - e^{-j\omega})X(e^{j\omega})$
    
    这类似于连续时间中的微分，通常会增强高频成分。

17. **累加 (Accumulation in Time Domain)**：

    $\sum_{k=-\infty}^{n} x[k] \stackrel{\mathcal{F}}{\longleftrightarrow} \frac{1}{1-e^{-j\omega}}X(e^{j\omega}) + \pi X(e^{j0})\sum_{k=-\infty}^{+\infty}\delta(\omega - 2\pi k)$
    
    其中 $X(e^{j0}) = \sum_{n=-\infty}^{+\infty} x[n]$ 是序列的直流分量（所有样本之和）。如果 $X(e^{j0})=0$，则简化为 $\frac{1}{1-e^{-j\omega}}X(e^{j\omega})$。

19. **频域微分 (Differentiation in Frequency Domain)**：

    $nx[n] \stackrel{\mathcal{F}}{\longleftrightarrow} j\frac{dX(e^{j\omega})}{d\omega}$

21. **帕塞瓦尔定理 (Parseval's Relation / Energy Conservation)**：

    $\sum_{n=-\infty}^{+\infty} |x[n]|^2 = \frac{1}{2\pi}\int_{2\pi} |X(e^{j\omega})|^2 d\omega$

    这表示序列在时域的总能量等于其在频域的总能量（在一个周期内积分并除以 $2\pi$）。$|X(e^{j\omega})|^2$ 被称为能量谱密度。

## DTFT 与差分方程的联系

DTFT 是分析由线性常系数差分方程 (Linear Constant-Coefficient Difference Equations, LCCDEs) 描述的离散时间 LTI 系统的强大工具。

考虑一个 LTI 系统，其输入 $x[n]$ 和输出 $y[n]$ 由以下差分方程描述：

$$
\sum_{k=0}^{N} a_k y[n-k] = \sum_{m=0}^{M} b_m x[n-m]
$$

其中 $a_k$ 和 $b_m$ 是常数，通常假设 $a_0 \neq 0$（如果 $a_0=0$，可以通过移位使新的 $a_0 \neq 0$）。通常将 $a_0$ 归一化为 1。

**1. 求解频率响应 $H(e^{j\omega})$**

对差分方程两边同时进行 DTFT，利用时移性质 $\mathcal{F}\{z[n-n_0]\} = e^{-j\omega n_0}Z(e^{j\omega})$（这里假设初始条件为零，或者我们关心的是系统的零状态响应或频率特性）：

$$
\mathcal{F}\left\{\sum_{k=0}^{N} a_k y[n-k]\right\} = \mathcal{F}\left\{\sum_{m=0}^{M} b_m x[n-m]\right\}
$$

$$
\sum_{k=0}^{N} a_k e^{-j\omega k} Y(e^{j\omega}) = \sum_{m=0}^{M} b_m e^{-j\omega m} X(e^{j\omega})
$$

整理得到：

$$
Y(e^{j\omega}) \left(\sum_{k=0}^{N} a_k e^{-j\omega k}\right) = X(e^{j\omega}) \left(\sum_{m=0}^{M} b_m e^{-j\omega m}\right)
$$

系统的**频率响应** $H(e^{j\omega})$ 定义为输出的 DTFT 与输入的 DTFT 之比：

$$
H(e^{j\omega}) = \frac{Y(e^{j\omega})}{X(e^{j\omega})} = \frac{\sum_{m=0}^{M} b_m e^{-j\omega m}}{\sum_{k=0}^{N} a_k e^{-j\omega k}}
$$

频率响应 $H(e^{j\omega})$ 描述了系统对不同频率复指数输入 $e^{j\omega n}$ 的响应特性。$|H(e^{j\omega})|$ 是系统的幅频响应，$\angle H(e^{j\omega})$ 是系统的相频响应。

**2. 求解系统输出**

一旦得到频率响应 $H(e^{j\omega})$ 和输入序列的 DTFT $X(e^{j\omega})$，输出序列的 DTFT $Y(e^{j\omega})$ 就可以通过以下关系得到：

$$
Y(e^{j\omega}) = H(e^{j\omega})X(e^{j\omega})
$$

然后，可以通过 DTFT 反变换得到时域输出 $y[n]$：

$$
y[n] = \mathcal{F}^{-1}\{Y(e^{j\omega})\} = \mathcal{F}^{-1}\{H(e^{j\omega})X(e^{j\omega})\}
$$

这对应于时域的卷积运算 $y[n] = h[n] * x[n]$，其中 $h[n] = \mathcal{F}^{-1}\{H(e^{j\omega})\}$ 是系统的冲激响应。

**3. 稳态响应**

如果输入是一个复指数序列 $x[n] = e^{j\omega_0 n}$，LTI 系统的稳态输出也是同频率的复指数序列，但幅度和相位会根据频率响应 $H(e^{j\omega_0})$ 进行调整。

输入 $x[n] = e^{j\omega_0 n}$ 的 DTFT 是 $X(e^{j\omega}) = 2\pi\sum_{l=-\infty}^{+\infty}\delta(\omega - \omega_0 - 2\pi l)$。

则输出的 DTFT 为 $Y(e^{j\omega}) = H(e^{j\omega}) \cdot 2\pi\sum_{l=-\infty}^{+\infty}\delta(\omega - \omega_0 - 2\pi l) = H(e^{j\omega_0}) \cdot 2\pi\sum_{l=-\infty}^{+\infty}\delta(\omega - \omega_0 - 2\pi l)$。

对其进行 DTFT 反变换得到稳态输出：

$$
y_{ss}[n] = H(e^{j\omega_0})e^{j\omega_0 n}
$$

这意味着如果输入是 $e^{j\omega_0 n}$，输出就是输入乘以系统在该频率处的频率响应值 $H(e^{j\omega_0})$。

对于实正弦输入 $x[n] = A\cos(\omega_0 n)$，稳态输出为：

$$
y_{ss}[n] = A|H(e^{j\omega_0})|\cos(\omega_0 n + \angle H(e^{j\omega_0}))
$$

总结来说，DTFT 通过将差分方程转换为频域中的代数方程，极大地简化了离散时间 LTI 系统的分析，特别是对于求解频率响应和确定系统对各种频率成分的响应行为。