# 连续时间傅里叶变换

傅里叶变换是一种将时域信号转换为频域表示的数学工具。对于连续时间信号，它揭示了信号包含哪些频率成分以及这些成分的幅度和相位。

## 1. 非周期信号的傅里叶变换

对于一个非周期信号 $x(t)$，其傅里叶变换 $X(j\omega)$ 定义为：

$$
X(j\omega) = \mathcal{F}\{x(t)\} = \int_{-\infty}^{+\infty} x(t)e^{-j\omega t} dt \quad \quad (1)
$$

其中：

*   $t$ 是时间变量。
*   $\omega$ 是角频率，单位是弧度/秒 ($\text{rad/s}$)。$\omega = 2\pi f$，其中 $f$ 是频率，单位是赫兹 (Hz)。
*   $j$ 是虚数单位 ($j^2 = -1$)。
*   $X(j\omega)$ 通常是一个复数函数，表示信号在频率 $\omega$ 处的幅度和相位。
    *   幅度谱：$|X(j\omega)|$
    *   相位谱：$\angle X(j\omega)$

傅里叶反变换 (Inverse Fourier Transform, IFT) 用于从频域表示 $X(j\omega)$ 恢复时域信号 $x(t)$：

$$
x(t) = \mathcal{F}^{-1}\{X(j\omega)\} = \frac{1}{2\pi}\int_{-\infty}^{+\infty}X(j\omega)e^{j\omega t} d\omega \quad \quad (2)
$$

公式 (1) 和 (2) 构成了傅里叶变换对。

**存在条件 (狄利克雷条件)**：

一个信号 $x(t)$ 存在傅里叶变换的充分条件是：

1.  $x(t)$ 在任何有限区间内满足狄利克雷条件（即只有有限个第一类间断点，有限个极值点）。
2.  $x(t)$ 绝对可积，即 $\int_{-\infty}^{+\infty} |x(t)| dt < \infty$。

对于不满足绝对可积条件的某些信号（如阶跃函数、周期信号），可以通过引入冲激函数或在极限意义下定义其傅里叶变换。

## 2. 周期信号的傅里叶变换

对于周期为 $T_0$ 的周期信号 $x(t)$，它可以表示为傅里叶级数：

$$
x(t) = \sum_{k = -\infty}^{+\infty}a_k e^{jk\omega_0t}
$$

其中 $\omega_0 = \frac{2\pi}{T_0}$ 是基波角频率，$a_k$ 是傅里叶级数系数：

$$
a_k = \frac{1}{T_0}\int_{T_0} x(t)e^{-jk\omega_0t} dt
$$

周期信号的傅里叶变换可以通过对傅里叶级数中的每一项取傅里叶变换得到。利用 $e^{j\omega_c t} \stackrel{\mathcal{F}}{\longleftrightarrow} 2\pi\delta(\omega - \omega_c)$ 这一变换对，我们得到：

$$
X(j\omega) = \mathcal{F}\left\{\sum_{k = -\infty}^{+\infty}a_k e^{jk\omega_0t}\right\} = \sum_{k = -\infty}^{+\infty}a_k \mathcal{F}\{e^{jk\omega_0t}\}
$$

$$
X(j\omega) = \sum_{k = -\infty}^{+\infty}2\pi a_k\delta(\omega - k\omega_0) \quad \quad (3)
$$

这表明周期信号的傅里叶变换是在其谐波频率 $k\omega_0$ 处的一系列冲激函数，冲激的强度（面积）为 $2\pi a_k$。

## 傅里叶变换的性质

傅里叶变换具有许多重要的性质，这些性质在信号处理和系统分析中非常有用。设 $x(t) \stackrel{\mathcal{F}}{\longleftrightarrow} X(j\omega)$ 和 $y(t) \stackrel{\mathcal{F}}{\longleftrightarrow} Y(j\omega)$。

1.  **线性 (Linearity)**：

    $ax(t) + by(t) \stackrel{\mathcal{F}}{\longleftrightarrow} aX(j\omega) + bY(j\omega)$

3.  **时移 (Time Shifting)**：

    $x(t-t_0) \stackrel{\mathcal{F}}{\longleftrightarrow} e^{-j\omega t_0}X(j\omega)$

    时域的延迟 $t_0$ 对应于频域乘以一个线性相移因子 $e^{-j\omega t_0}$。幅度谱不变，相位谱改变。

5.  **频移 (Frequency Shifting / Modulation)**：

    $e^{j\omega_c t}x(t) \stackrel{\mathcal{F}}{\longleftrightarrow} X(j(\omega - \omega_c))$

    时域乘以复指数 $e^{j\omega_c t}$ 对应于频域的频谱搬移。

7.  **尺度变换 (Time and Frequency Scaling)**：

    $x(at) \stackrel{\mathcal{F}}{\longleftrightarrow} \frac{1}{|a|}X\left(j\frac{\omega}{a}\right)$

    *   如果 $a>1$，时域压缩，频域展宽且幅度减小。
    *   如果 $0<a<1$，时域展宽，频域压缩且幅度增大。
    *   如果 $a=-1$（时间反转）：$x(-t) \stackrel{\mathcal{F}}{\longleftrightarrow} X(-j\omega)$。如果 $x(t)$ 是实信号，则 $X(-j\omega) = X^*(j\omega)$。

9.  **共轭对称性 (Conjugate Symmetry for Real Signals)**：
    如果 $x(t)$ 是实信号，则 $X(j\omega) = X^*(-j\omega)$。

    这意味着：

    *   幅度谱是偶对称的：$|X(j\omega)| = |X(-j\omega)|$
    *   相位谱是奇对称的：$\angle X(j\omega) = -\angle X(-j\omega)$

10. **卷积 (Convolution)**：

    $x(t) * y(t) = \int_{-\infty}^{+\infty} x(\tau)y(t-\tau)d\tau \stackrel{\mathcal{F}}{\longleftrightarrow} X(j\omega)Y(j\omega)$

    时域卷积对应频域相乘。这是傅里叶变换最重要的性质之一，极大地简化了线性时不变 (LTI) 系统的分析。

12. **相乘 (Multiplication / Windowing)**：

    $x(t)y(t) \stackrel{\mathcal{F}}{\longleftrightarrow} \frac{1}{2\pi}X(j\omega) * Y(j\omega) = \frac{1}{2\pi}\int_{-\infty}^{+\infty} X(j\Omega)Y(j(\omega-\Omega))d\Omega$

    时域相乘对应频域卷积（并除以 $2\pi$）。

14. **微分 (Differentiation in Time Domain)**：

    $\frac{dx(t)}{dt} \stackrel{\mathcal{F}}{\longleftrightarrow} j\omega X(j\omega)$

    $\frac{d^n x(t)}{dt^n} \stackrel{\mathcal{F}}{\longleftrightarrow} (j\omega)^n X(j\omega)$

    时域微分增强了信号的高频成分。

16. **积分 (Integration in Time Domain)**：

    $\int_{-\infty}^{t} x(\tau)d\tau \stackrel{\mathcal{F}}{\longleftrightarrow} \frac{1}{j\omega}X(j\omega) + \pi X(0)\delta(\omega)$

    其中 $X(0) = \int_{-\infty}^{+\infty} x(t)dt$ 是信号的直流分量。如果 $X(0)=0$，则简化为 $\frac{1}{j\omega}X(j\omega)$。

    时域积分增强了信号的低频成分。

18. **频域微分 (Differentiation in Frequency Domain)**：

    $(-jt)x(t) \stackrel{\mathcal{F}}{\longleftrightarrow} \frac{dX(j\omega)}{d\omega}$

    $(-jt)^n x(t) \stackrel{\mathcal{F}}{\longleftrightarrow} \frac{d^n X(j\omega)}{d\omega^n}$

20. **对偶性 (Duality)**：

    如果 $x(t) \stackrel{\mathcal{F}}{\longleftrightarrow} X(j\omega)$，则 $X(jt) \stackrel{\mathcal{F}}{\longleftrightarrow} 2\pi x(-\omega)$

    这意味着如果已知一个变换对，可以通过对偶性得到另一个变换对。例如，矩形脉冲的傅里叶变换是 Sa 函数，利用对偶性，Sa 函数的傅里叶变换是矩形脉冲。

22. **帕塞瓦尔定理 (Parseval's Relation / Energy Conservation)**：

    $\int_{-\infty}^{+\infty} |x(t)|^2 dt = \frac{1}{2\pi}\int_{-\infty}^{+\infty} |X(j\omega)|^2 d\omega$

    这表示信号在时域的总能量等于其在频域的总能量（除以 $2\pi$）。$|X(j\omega)|^2$ 被称为能量谱密度。

## 傅里叶变换与微分方程的联系

傅里叶变换是求解线性常系数微分方程 (Linear Constant-Coefficient Differential Equations, LCCDEs) 特别是分析其稳态响应的强大工具。

考虑一个 LTI 系统，其输入 $x(t)$ 和输出 $y(t)$ 由以下微分方程描述：
$$
\sum_{k=0}^{N} a_k \frac{d^k y(t)}{dt^k} = \sum_{m=0}^{M} b_m \frac{d^m x(t)}{dt^m}
$$
其中 $a_k$ 和 $b_m$ 是常数。

**1. 求解频率响应 $H(j\omega)$**

对微分方程两边同时进行傅里叶变换，利用微分性质 $\mathcal{F}\left\{\frac{d^k z(t)}{dt^k}\right\} = (j\omega)^k Z(j\omega)$（这里假设初始条件为零，或者我们关心的是系统的零状态响应或频率特性）：

$$
\mathcal{F}\left\{\sum_{k=0}^{N} a_k \frac{d^k y(t)}{dt^k}\right\} = \mathcal{F}\left\{\sum_{m=0}^{M} b_m \frac{d^m x(t)}{dt^m}\right\}
$$

$$
\sum_{k=0}^{N} a_k (j\omega)^k Y(j\omega) = \sum_{m=0}^{M} b_m (j\omega)^m X(j\omega)
$$

整理得到：

$$
Y(j\omega) \left(\sum_{k=0}^{N} a_k (j\omega)^k\right) = X(j\omega) \left(\sum_{m=0}^{M} b_m (j\omega)^m\right)
$$

系统的**频率响应** $H(j\omega)$ 定义为输出的傅里叶变换与输入的傅里叶变换之比：

$$
H(j\omega) = \frac{Y(j\omega)}{X(j\omega)} = \frac{\sum_{m=0}^{M} b_m (j\omega)^m}{\sum_{k=0}^{N} a_k (j\omega)^k}
$$

频率响应 $H(j\omega)$ 描述了系统对不同频率正弦输入的响应特性。$|H(j\omega)|$ 是系统的幅频响应，$\angle H(j\omega)$ 是系统的相频响应。

**2. 求解系统输出**

一旦得到频率响应 $H(j\omega)$ 和输入信号的傅里叶变换 $X(j\omega)$，输出信号的傅里叶变换 $Y(j\omega)$ 就可以通过以下关系得到：

$$
Y(j\omega) = H(j\omega)X(j\omega)
$$

然后，可以通过傅里叶反变换得到时域输出 $y(t)$：

$$
y(t) = \mathcal{F}^{-1}\{Y(j\omega)\} = \mathcal{F}^{-1}\{H(j\omega)X(j\omega)\}
$$

这对应于时域的卷积运算 $y(t) = h(t) * x(t)$，其中 $h(t) = \mathcal{F}^{-1}\{H(j\omega)\}$ 是系统的冲激响应。

**3. 稳态响应**

如果输入是一个正弦信号，例如 $x(t) = A\cos(\omega_0 t + \phi)$，或者更一般地是复指数 $x(t) = Ae^{j(\omega_0 t + \phi)}$，LTI 系统的稳态输出也是同频率的正弦（或复指数）信号，但幅度和相位会根据频率响应 $H(j\omega_0)$ 进行调整。

对于输入 $x(t) = e^{j\omega_0 t}$，其傅里叶变换是 $X(j\omega) = 2\pi\delta(\omega - \omega_0)$。

则输出的傅里叶变换为 $Y(j\omega) = H(j\omega) \cdot 2\pi\delta(\omega - \omega_0) = H(j\omega_0) \cdot 2\pi\delta(\omega - \omega_0)$。
对其进行傅里叶反变换得到稳态输出：

$$
y_{ss}(t) = H(j\omega_0)e^{j\omega_0 t}
$$

这意味着如果输入是 $e^{j\omega_0 t}$，输出就是输入乘以系统在该频率处的频率响应值 $H(j\omega_0)$。

对于实正弦输入 $x(t) = A\cos(\omega_0 t)$，稳态输出为：

$$
y_{ss}(t) = A|H(j\omega_0)|\cos(\omega_0 t + \angle H(j\omega_0))
$$

**局限性：**
*   傅里叶变换主要用于分析系统的稳态响应或零状态响应。对于包含初始条件的瞬态响应，拉普拉斯变换通常更为方便。
*   傅里叶变换要求信号绝对可积（或在广义函数意义下存在变换）。

总结来说，傅里叶变换通过将微分方程转换为频域中的代数方程，极大地简化了 LTI 系统的分析，特别是对于求解频率响应和确定系统对各种频率成分的响应行为。