# 信号与系统

## 引言：信号与系统是什么？

!!! note "一些直观的理解（不一定正确）"

    1.  **信号 (Signal)**：随时间（或其他自变量）变化的一系列数据或函数。它可以是声音、图像、电压、股价等等。
    2.  **系统 (System)**：能够对信号进行处理或响应的数学模型或物理实体。系统接收输入信号，并产生输出信号，可以看作是一种对信号进行变换的函数或算子。

本文旨在梳理信号与系统的核心概念，从基本信号类型、系统特性到重要的分析工具如卷积和傅里叶级数。

## 一、信号 (Signals)

信号是信息的载体，理解其特性和基本类型是分析系统的基础。

### 1. 信号的基本概念与性质

#### a. 连续时间信号与离散时间信号

*   **连续时间信号 (Continuous-Time Signal)**：定义在连续时间轴上的信号，自变量 $t$ 是连续的。通常表示为 $x(t)$。
*   **离散时间信号 (Discrete-Time Signal)**：仅在离散时间点上有定义的信号，自变量 $n$ 是整数。通常表示为 $x[n]$。

在本章内容的讨论中，我们首先关注连续时间信号，后续会引入离散时间信号的概念。

#### b. 信号的基本性质

*   **周期性 (Periodicity)**：
    *   **连续时间信号**：如果一个信号 $x(t)$ 满足 $x(t) = x(t+T)$ 对所有 $t$ 和某个正常数 $T$ 成立，则称该信号是周期的，最小的这样的 $T$ 称为基波周期。
    *   **离散时间信号**：如果一个信号 $x[n]$ 满足 $x[n] = x[n+N]$ 对所有 $n$ 和某个正整数 $N$ 成立，则称该信号是周期的，最小的这样的 $N$ 称为基波周期。
*   **奇偶性 (Even and Odd Symmetry)**：
    *   偶信号 (Even Signal)：$x(-t) = x(t)$ (连续时间) 或 $x[-n] = x[n]$ (离散时间)
    *   奇信号 (Odd Signal)：$x(-t) = -x(t)$ (连续时间) 或 $x[-n] = -x[n]$ (离散时间)
    任何信号都可以分解为其偶分量和奇分量之和：$x(t) = x_e(t) + x_o(t)$，其中 $x_e(t) = \frac{1}{2}[x(t) + x(-t)]$，$x_o(t) = \frac{1}{2}[x(t) - x(-t)]$。对于离散时间信号同理。

### 2. 基本信号与奇异函数

#### a. 基本周期与非周期信号

*   **指数信号 (Exponential Signals)**
    *   连续时间：$x(t) = Ce^{at}$ (其中 $C$ 和 $a$ 通常为复数)
    *   离散时间：$x[n] = C\alpha^n$ (其中 $C$ 和 $\alpha$ 通常为复数)

*   **正弦信号与复指数信号 (Sinusoidal and Complex Exponential Signals)**

    !!! abstract "欧拉公式 (Euler's Formula)"
        这是连接复指数与三角函数的核心桥梁：
        $$
        e^{jx} = \cos(x) + j\sin(x)
        $$
        由此可得：
        $$
        \cos(x) = \frac{e^{jx} + e^{-jx}}{2}
        $$
        $$
        \sin(x) = \frac{e^{jx} - e^{-jx}}{2j}
        $$

    *   **连续时间周期复指数信号**:
        $$
        x(t) = e^{j\omega_0t}
        $$
        我们称 $\omega_0$ 为 **基波角频率**。其周期为 $T = 2\pi/|\omega_0|$ (当 $\omega_0 \neq 0$)。

        ??? tip "关于连续时间复指数信号的周期性证明"

            令 $e^{j\omega_0t} = e^{j\omega_0(t + T)}$，有 $e^{j\omega_0T} = 1$。

            根据欧拉公式，$e^{j\omega_0T} = \cos(\omega_0T) + j\sin(\omega_0T) = 1$。
            
            这意味着 $\cos(\omega_0T)=1$ 且 $\sin(\omega_0T)=0$。
            
            因此，$\omega_0T$ 必须是 $2\pi$ 的整数倍，即 $\omega_0T = 2k\pi, \quad k \in \mathbb{Z}$。
            
            - 若 $\omega_0 = 0$，则 $x(t) = 1$，是周期信号，但周期未明确定义（或任意周期）。
            - 若 $\omega_0 \neq 0$，则最小正周期 $T = \frac{2\pi}{|\omega_0|}$ (对应 $k=1$ 或 $k=-1$ 取绝对值)。

    *   **连续时间正弦信号**:
        $$
        x(t) = A\cos(\omega_0t + \phi)
        $$
        正弦信号是周期的，周期为 $T = 2\pi/|\omega_0|$。

        !!! note "正弦信号与复指数信号的关系"
            利用欧拉公式，正弦信号可以表示为复指数信号的和：

            $$
            A\cos(\omega_0t + \phi) = \frac{A}{2}e^{j(\omega_0t + \phi)} + \frac{A}{2}e^{-j(\omega_0t + \phi)}
            $$

            也可以看作复指数信号的实部：

            $$
            A\cos(\omega_0t + \phi) = \Re \left\{ Ae^{j(\omega_0t + \phi)} \right\}
            $$

    *   **离散时间周期复指数信号**:

        $x[n] = e^{j\Omega_0n}$。该信号是周期的当且仅当 $\Omega_0/(2\pi)$ 是一个有理数。若 $\Omega_0/(2\pi) = M/N$ (其中 $M, N$ 为整数且 $N>0$，为最简分数)，则基波周期为 $N$。

    *   **谐波关系 (Harmonic Relationship)**:

        一组成谐波关系的复指数信号集合，是指所有信号的频率都是某个基波频率 $\omega_0$ (或 $\Omega_0$) 的整数倍。例如，对于连续时间信号，集合 $\{\dots, e^{-j2\omega_0t}, e^{-j\omega_0t}, 1, e^{j\omega_0t}, e^{j2\omega_0t}, \dots \}$ 中的信号具有谐波关系。这些信号都是周期的，并且具有公共周期 $T_0 = 2\pi/\omega_0$ (或其整数倍)。

#### b. 奇异函数 (Singularity Functions)

奇异函数是在数学和工程中非常有用的理想化函数，它们在某些点上表现出不寻常的行为（如不连续或导数不存在）。

*   **单位冲激函数 (Unit Impulse Function)**
    *   **连续时间 (狄拉克$\delta$函数)**: $\delta(t)$
        单位冲激函数是理解 LTI 系统特性（冲激响应）和信号采样的核心。
        *   **直观理解**：可以将其视为一个宽度极小、高度极大，但面积始终为1的脉冲。
            考虑一个矩形脉冲 $p_\Delta(t)$：
            $$
            p_\Delta(t) = \begin{cases} \frac{1}{\Delta}, & 0 < t < \Delta \\ 0, & \text{otherwise} \end{cases}
            $$
            这个脉冲的面积是 $\frac{1}{\Delta} \cdot \Delta = 1$。
            单位冲激函数可以看作是当 $\Delta \to 0$ 时 $p_\Delta(t)$ 的极限：
            $$
            \delta(t) = \lim_{\Delta \to 0} p_\Delta(t)
            $$
            在 $t=0$ 时，$\delta(0) = \infty$；在 $t \neq 0$ 时，$\delta(t) = 0$。
        *   **严格定义 (通过积分性质)**：$\delta(t)$ 不是传统意义上的函数，而是一个广义函数或分布。它通常通过其作用于其他“良好”测试函数 $\phi(t)$ 的积分来定义：
            1.  $\delta(t) = 0$  对于 $t \neq 0$
            2.  $\int_{-\infty}^{+\infty} \delta(t) dt = 1$ (面积为1)
        *   **筛选特性 (Sifting Property)**：这是冲激函数最重要的性质。对于在 $t=t_0$ 处连续的任何函数 $g(t)$：
            $$
            \int_{-\infty}^{+\infty} g(t)\delta(t-t_0) dt = g(t_0)
            $$
            特别地，$\int_{-\infty}^{+\infty} g(t)\delta(t) dt = g(0)$。
        *   **其他性质**：
            *   $\delta(at) = \frac{1}{|a|}\delta(t)$ (尺度变换)
            *   $g(t)\delta(t-t_0) = g(t_0)\delta(t-t_0)$ (如果 $g(t)$ 在 $t_0$ 处连续)
            *   $\delta(t)$ 是一个偶函数：$\delta(-t) = \delta(t)$。
    *   **离散时间 (单位采样序列)**: $\delta[n]$
        $$
        \delta[n] = \begin{cases} 1, & n = 0 \\ 0, & n \neq 0 \end{cases}
        $$
        *   **筛选特性**: 对于任意序列 $x[n]$:
            $$
            \sum_{k=-\infty}^{+\infty} x[k]\delta[n-k] = x[n]
            $$
            特别地，$\sum_{k=-\infty}^{+\infty} x[k]\delta[k] = x[0]$。

*   **单位阶跃函数 (Unit Step Function)**
    *   **连续时间**: $u(t)$

        $$
        u(t) = \begin{cases} 1, & t > 0 \\ 0, & t < 0 \end{cases}
        $$

        在 $t=0$ 处的值有时定义为 $0.5$，有时未定义，或根据上下文取 $0$ 或 $1$。

        *   **与冲激函数的关系**：

            $u(t) = \int_{-\infty}^{t} \delta(\tau) d\tau$
            $\delta(t) = \frac{du(t)}{dt}$ (在广义函数意义下)

    *   **离散时间**: $u[n]$
        $$
        u[n] = \begin{cases} 1, & n \ge 0 \\ 0, & n < 0 \end{cases}
        $$
        *   **与单位采样序列的关系**:
            $u[n] = \sum_{k=-\infty}^{n} \delta[k] = \sum_{m=0}^{\infty} \delta[n-m]$
            $\delta[n] = u[n] - u[n-1]$

*   **单位斜坡函数 (Unit Ramp Function)**
    *   **连续时间**: $r(t)$

        $$
        r(t) = t u(t) = \begin{cases} t, & t \ge 0 \\ 0, & t < 0 \end{cases}
        $$

        它是单位阶跃函数的积分：$r(t) = \int_{-\infty}^{t} u(\tau) d\tau$。

        其导数是单位阶跃函数：$\frac{dr(t)}{dt} = u(t)$ (对于 $t \neq 0$)。

    *   **离散时间**: $r[n]$

        $$
        r[n] = n u[n] = \begin{cases} n, & n \ge 0 \\ 0, & n < 0 \end{cases}
        $$

## 二、系统 (Systems)

系统是对信号进行处理或变换的实体。理解系统的特性对于分析其行为至关重要。

### 1. 系统基本概念与性质

*   **概述**：系统可以由一个或多个输入信号以及一个或多个输出信号来描述。我们主要关注单输入单输出 (SISO) 系统。
*   **主要性质**：
    *   **线性 (Linearity)**：满足叠加原理。如果输入 $x_1(t) \to y_1(t)$ 和 $x_2(t) \to y_2(t)$，则对于任意常数 $a, b$，有 $ax_1(t) + bx_2(t) \to ay_1(t) + by_2(t)$。
    *   **时不变性 (Time-Invariance)**：系统的行为不随时间变化。如果输入 $x(t) \to y(t)$，则 $x(t-t_0) \to y(t-t_0)$ 对任意 $t_0$ 成立。
    *   **因果性 (Causality)**：系统在任意时刻的输出仅取决于当前和过去的输入，不取决于未来的输入。
    *   **稳定性 (Stability)**：有界输入产生有界输出 (BIBO 稳定)。如果输入 $|x(t)| \le M_x < \infty$，则输出 $|y(t)| \le M_y < \infty$。

### 2. 线性时不变 (LTI) 系统

LTI 系统因其数学上的易处理性和广泛的应用性而特别重要。

*   **定义与重要性**：同时满足线性和时不变性的系统称为 LTI 系统。许多物理过程可以近似为 LTI 系统。
*   **冲激响应 (Impulse Response)**：LTI 系统对单位冲激输入的响应。
    *   **连续时间 LTI 系统的冲激响应 $h(t)$**：当输入为 $\delta(t)$ 时，系统的输出为 $h(t)$。
    *   **离散时间 LTI 系统的冲激响应 $h[n]$**：当输入为 $\delta[n]$ 时，系统的输出为 $h[n]$。
    冲激响应 $h(t)$ 或 $h[n]$ 完全表征了一个 LTI 系统。

### 3. LTI 系统的时域分析：卷积 (Convolution)

卷积是描述 LTI 系统输出的核心运算。它表明，LTI 系统对任意输入的响应，可以通过输入信号与系统冲激响应的卷积来得到。

#### a. 连续时间卷积

*   **定义与计算**：对于一个输入信号为 $x(t)$，冲激响应为 $h(t)$ 的连续时间 LTI 系统，其输出 $y(t)$ 为 $x(t)$ 与 $h(t)$ 的卷积，记为 $y(t) = x(t) * h(t)$：
    $$
    y(t) = \int_{-\infty}^{+\infty} x(\tau)h(t-\tau)d\tau
    $$
    这个积分也称为卷积积分。
*   **卷积的意义**：它将输入信号分解为一系列加权和移位的冲激信号，然后利用系统的线性和时不变性，将各个冲激响应叠加得到总输出。
*   **卷积的性质**：
    *   交换律：$x(t) * h(t) = h(t) * x(t)$
    *   结合律：$[x_1(t) * x_2(t)] * x_3(t) = x_1(t) * [x_2(t) * x_3(t)]$
    *   分配律：$x_1(t) * [h_1(t) + h_2(t)] = x_1(t) * h_1(t) + x_1(t) * h_2(t)$

#### b. 离散时间卷积

*   **定义与计算**：对于一个输入信号为 $x[n]$，冲激响应为 $h[n]$ 的离散时间 LTI 系统，其输出 $y[n]$ 为 $x[n]$ 与 $h[n]$ 的卷积，记为 $y[n] = x[n] * h[n]$：
    $$
    y[n] = \sum_{k=-\infty}^{+\infty} x[k]h[n-k]
    $$
    这个求和也称为卷积和。
*   **卷积的意义**：与连续时间类似，它表示输入序列的每个样本点通过系统后的响应的叠加。
*   **卷积的性质**：同样满足交换律、结合律和分配律。

## 三、周期信号的频域分析：傅里叶级数 (Fourier Series for Periodic Signals)

傅里叶级数是将一个**周期信号**表示为一系列具有谐波关系的复指数信号（或正弦和余弦信号）的加权和。这是从时域到频域分析周期信号的基础。

### 1. 连续时间周期信号的傅里叶级数 (Continuous-Time Fourier Series - CTFS)

#### a. 核心思想

任何“行为良好”的周期信号 $x(t)$（周期为 $T_0$，基波角频率 $\omega_0 = 2\pi/T_0$）都可以分解为直流分量、基波分量以及各次谐波分量的叠加。

#### b. 复指数形式的傅里叶级数

周期信号 $x(t)$ 可以表示为（综合式）：
$$
x(t) = \sum_{k = -\infty}^{+\infty} a_k e^{jk\omega_0t} \quad \quad (\text{CTFS Synthesis})
$$
其中：

*   $k$ 是整数，代表谐波次数 ($k=0$ 是直流分量，$k=\pm 1$ 是基波分量，$k=\pm 2$ 是二次谐波，以此类推)。
*   $e^{jk\omega_0t}$ 是一组成谐波关系的复指数基函数。
*   $a_k$ 是复傅里叶级数系数，表示第 $k$ 次谐波的复振幅（包含幅度和相位信息）。

傅里叶级数系数 $a_k$ 通过以下分析式计算：
$$
a_k = \frac{1}{T_0} \int_{T_0} x(t)e^{-jk\omega_0t} dt \quad \quad (\text{CTFS Analysis})
$$
积分区间可以是任意一个周期 $T_0$ (例如从 $0$ 到 $T_0$，或从 $-T_0/2$ 到 $T_0/2$)。

??? details "傅里叶级数系数 $a_k$ 的推导"
    为了求解系数 $a_k$，我们将综合式两边乘以 $e^{-jn\omega_0t}$ (其中 $n$ 是某个特定的整数)，然后在一个周期 $T_0$ 上积分：
    $$
    \int_{T_0} x(t)e^{-jn\omega_0t} dt = \int_{T_0} \left( \sum_{k = -\infty}^{+\infty} a_k e^{jk\omega_0t} \right) e^{-jn\omega_0t} dt
    $$
    假设可以交换积分和求和的顺序：
    $$
    \int_{T_0} x(t)e^{-jn\omega_0t} dt = \sum_{k = -\infty}^{+\infty} a_k \int_{T_0} e^{j(k-n)\omega_0t} dt
    $$
    考虑积分项 $\int_{T_0} e^{j(k-n)\omega_0t} dt$：

    *   **当 $k = n$ 时**：$\int_{T_0} e^{j(0)\omega_0t} dt = \int_{T_0} 1 dt = T_0$
    *   **当 $k \neq n$ 时**：令 $m = k-n \neq 0$。
        $\int_{T_0} e^{jm\omega_0t} dt = \left[ \frac{1}{jm\omega_0}e^{jm\omega_0t} \right]_{t_1}^{t_1+T_0} = \frac{1}{jm\omega_0}e^{jm\omega_0t_1}(e^{jm\omega_0T_0} - 1)$
        
        因为 $\omega_0T_0 = 2\pi$，所以 $e^{jm\omega_0T_0} = e^{jm2\pi} = 1$。
        
        因此，当 $k \neq n$ 时，$\int_{T_0} e^{j(k-n)\omega_0t} dt = 0$。
    这个性质称为复指数信号集 $\{e^{jk\omega_0t}\}$ 在一个周期上的**正交性**。
    所以，在求和式中，只有当 $k=n$ 时积分项不为零：

    $$
    \int_{T_0} x(t)e^{-jn\omega_0t} dt = a_n T_0
    $$

    因此，傅里叶级数系数 $a_n$ (将 $n$ 替换回 $k$) 为分析式。

#### c. 三角形式的傅里叶级数

利用欧拉公式，并且注意到对于实信号 $x(t)$，有 $a_{-k} = a_k^*$ (共轭对称性)，复指数形式可以转换为三角形式：
$$
x(t) = A_0 + \sum_{k=1}^{+\infty} [A_k \cos(k\omega_0t) + B_k \sin(k\omega_0t)]
$$
或者
$$
x(t) = C_0 + \sum_{k=1}^{+\infty} C_k \cos(k\omega_0t + \phi_k)
$$
其中系数 $A_0, A_k, B_k$ 或 $C_0, C_k, \phi_k$ 可以通过 $a_k$ 导出：

*   $A_0 = a_0 = C_0$ (直流分量)
*   $A_k = a_k + a_{-k} = 2\Re\{a_k\}$  (对于 $k \ge 1$)
*   $B_k = j(a_k - a_{-k}) = -2\Im\{a_k\}$ (对于 $k \ge 1$)
*   $C_k = 2|a_k|$ (对于 $k \ge 1$)
*   $\phi_k = \angle a_k$ (对于 $k \ge 1$) 
    
    (注意：这里 $\cos(A+B)$ 展开后，如果 $a_k = |a_k|e^{j\angle a_k}$，则 $C_k \cos(k\omega_0t + \phi_k)$ 对应的是 $a_k e^{jk\omega_0t} + a_{-k}e^{-jk\omega_0t}$。更常见的定义是 $a_k = \frac{A_k - jB_k}{2}$，则 $C_k = \sqrt{A_k^2 + B_k^2}$，$\phi_k = \text{atan2}(-B_k, A_k)$。或者，若 $x(t) = C_0 + \sum C_k \cos(k\omega_0 t - \theta_k)$, 则 $a_k = \frac{C_k}{2}e^{-j\theta_k}$ for $k>0$, $a_0=C_0$, $a_k = a_{-k}^*$.)

通常，我们直接使用 $a_k$ 来描述频谱：

*   $|a_k|$：第 $k$ 次谐波的**幅度谱**。
*   $\angle a_k$：第 $k$ 次谐波的**相位谱**。
*   $k=0$ 时，$a_0 = \frac{1}{T_0}\int_{T_0}x(t)dt$ 是信号的平均值或直流分量。

#### d. 傅里叶级数的存在条件 (狄利克雷条件 Dirichlet Conditions)

如果周期信号 $x(t)$ 在一个周期内满足狄利克雷条件：

1.  绝对可积：$\int_{T_0} |x(t)| dt < \infty$。
2.  只有有限个极大值和极小值。
3.  只有有限个第一类间断点（跳变间断点）。

则 $x(t)$ 的傅里叶级数收敛。在 $x(t)$ 的连续点处，级数收敛于 $x(t)$；在间断点处，级数收敛于该点左右极限的平均值 $\frac{1}{2}[x(t^+) + x(t^-)]$。

### 2. 离散时间周期信号的傅里叶级数 (Discrete-Time Fourier Series - DTFS or DFS)

对于周期为 $N$ 的离散时间信号 $x[n]$ (即 $x[n] = x[n+N]$ 对所有 $n$ 成立)，它也可以表示为一组谐波相关的复指数序列的线性组合。

#### a. 综合式与分析式

*   **综合式 (Synthesis Equation)**:

    $$
    x[n] = \sum_{k=\langle N \rangle} a_k e^{j k \Omega_0 n} = \sum_{k=0}^{N-1} a_k e^{j k (2\pi/N) n}
    $$

    其中 $\Omega_0 = 2\pi/N$ 是离散时间基波角频率。求和 $\sum_{k=\langle N \rangle}$ 表示对任意 $N$ 个连续整数 $k$ 进行求和 (通常取 $k=0, 1, \dots, N-1$)。

*   **分析式 (Analysis Equation)**:

    $$
    a_k = \frac{1}{N} \sum_{n=\langle N \rangle} x[n] e^{-j k \Omega_0 n} = \frac{1}{N} \sum_{n=0}^{N-1} x[n] e^{-j k (2\pi/N) n}
    $$

    求和 $\sum_{n=\langle N \rangle}$ 表示对任意 $N$ 个连续整数 $n$ (通常是信号的一个周期 $n=0, 1, \dots, N-1$) 进行求和。

#### b. 系数 $a_k$ 的性质

*   **周期性**: 傅里叶级数系数 $a_k$ 本身也是周期为 $N$ 的序列，即 $a_{k+N} = a_k$。这意味着对于一个周期为 $N$ 的离散时间信号，其傅里叶级数只有 $N$ 个独立的不相同的系数 (例如 $a_0, a_1, \dots, a_{N-1}$)。

#### c. 与 CTFS 的类比

DTFS 在概念上与 CTFS 非常相似：

*   都是将周期信号分解为谐波相关的复指数之和。
*   CTFS 的基函数 $e^{jk\omega_0t}$ 有无限多个且互不相同。
*   DTFS 的基函数 $e^{jk(2\pi/N)n}$ 只有 $N$ 个互不相同的 (因为 $e^{j(k+N)(2\pi/N)n} = e^{jk(2\pi/N)n}e^{j2\pi n} = e^{jk(2\pi/N)n}$)。
*   CTFS 的积分对应 DTFS 的求和。