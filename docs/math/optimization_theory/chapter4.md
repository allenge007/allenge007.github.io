# lec4:

## 保持函数凸性的操作

### 非负加权和

!!! note

    若 $f_1, \dots, f_n$ 为凸，定义域均为 $R^n$，则

    $$
    f = \sum w_if_i, \quad w_i \ge 0
    $$

    为凸。

### 非负积分

!!! note

    若 $f(x, y)$ 对任意 $y\in A$ 均为关于 x 的凸函数，设 $w(y) \le 0, \forall y \in A$ 有

    $$
    g(x) = \int w(y)f(x, y) dy
    $$

    为凸函数。

### 仿射映射

!!! note

    $$
    f: R^m \to R, \quad A\in R^{m\times n}, \quad b\in R^m \\
    g(x) = f(Ax + b), \quad {\rm dom}\ g = \{x | Ax + b \in {\rm dom} f\}
    $$

    若 $f$ 为凸，则 $g$ 为凸。

!!! success

    令 $x, y \in {\rm dom}\ g, \theta\in [0, 1]$

    $$
    g(\theta x + (1 - \theta)y) = f(A(\theta x + (1 - \theta)y) + b) \\
    = f(\theta(Ax + b) + (1 - \theta)(Ay + b))\\
    \le \theta f(Ax + b) + (1 - \theta)f(Ay + b)
    $$

### 两个函数的极大值函数

!!! note

    若 $f_1, f_2$ 为凸，$f(x) = \max \{f_1(x), f_2(x)\}$ 为凸集

    $$
    {\rm dom}\ f = {\rm dom}\ f_1 \cap {\rm dom}\ f_2
    $$

!!! success

    $$
    f(\theta x + (1 - \theta)y) = \max\{f_1(\theta x + (1 - \theta)y), f_2(\theta x + (1 - \theta)y)\} \\
    \le \max \{\theta f_1(x) + (1 - \theta)y, \theta f_2(x) + (1 - \theta)f_2(y)\} \\
    \le \theta \max\{f_1(x), f_2(x) \} + (1 - \theta)\max\{f_1(y), f_2(y)\} \\
    = \theta f(x) + (1 - \theta)f(y)
    $$

### 推广：任意多个函数的极大值函数

!!! note

    若 $\forall y \in A, f(x, y)$ 对于 x 为凸，则

    $$
    f(x) = \sup f(x, y)
    $$

    为凸。

!!! example

    1. 从一点到集合 $C$ 的最远点的距离（无论 C 是否为凸）：

        $$
        f(x) = \sup\limits_{y\in C} ||x-y||_2
        $$

    2. 实对称矩阵的最大特征值

        $$
        f(x) = \lambda_{max} (x), \quad {\rm dom}\ f = S^n \\
        f(x) = \sup\limits_{y\in R^n}\{y^Tx y |\  ||y||_2 = 1\}
        $$

        !!! question

            为什么上下两条式子等价？

### 函数的组合

!!! note

    $$
    h: R^k \to R, \quad g: R^n\to R^k, \quad f = h \dot g : R^n \to R \\
    f(x) = h(g(x)), \quad {\rm dom} f = \{x\in {\rm dom}\ g | g(x) = {\rm dom}\ h\}
    $$

!!! success

    - 考虑简单情况：一维 $n = k = 1$，全空间，$h, g$ 均为二阶可微 （凸 $\leftrightarrow f''(x)\ge 0$）

        $$
        f'(x) = h'(g(x)) g'(x) \\
        f''(x) = h''(g(x))(g'(x))^2 + h'(g(x))g''(x)
        $$

        若 $g$ 为凸（$g''(x) \ge 0$， $h$ 为凸且不降 $h''(g(x))\ge 0, h'(g(x))\ge 0$，则 $f''(x)\ge 0$

        凹，凸，不增 $\to\ f$ 凸

        凹，凹，不降 $\to\ f$ 凹
        
        凸，凹，不增 $\to\ f$ 凹

    - 扩展到复杂情况： 高维，非全空间（凸扩展或凹扩展），$h, g$ 均不二阶可微

        $g$ 凸，$h$ 凸 且 $\widetilde{h}$ 不降，则 $f$ 为凸（类似上面）

!!! example

    1. 若 $g$ 凸，$\exp \{g(x)\}$ 也为凸，（$h = \exp$，凸，不降）

        若 $g$ 凹，$g>0$, $\log \{g(x)\}$ 为凹，（$h = \log$，凹，$\widetilde{h}$ 不降）

        若 $g$ 凹，$g > 0$，$\frac{1}{g(x)}$ 也为凸，（$h(y) = \frac{1}{y}$，凸，$\widetilde{h}$ 不增）

    2. 满足 $\widetilde{h}$ 单调性，但不满足 $h$ 单调性

        $g(x) = x^2, \quad {\rm dom}\ g \in R$ 凸

        $h(y) = 0, \quad {\rm dom}\ h = [1, 2]$，凸，单调不增/单调不减

        $f = h\cdot g = 0, \quad x^2\in[1, 2]$，故 $f$ 非凸。

        !!! tip
            问题在于 $\widetilde{h}$ 不单调！

### 透视函数

!!! note

    $$
    f:R^n \to R, \quad g: R^n\times R_{+ +} \to R, \\ g(x, t) = tf(\frac{x}{t})
    $$

    结论：若 $f$ 为凸，则 $g$ 为凸，若 $f$ 为凹，则 $g$ 为凹。

    如何证明？

!!! tip

    首先证明：${\rm dom}\ g$ 为凸集

    其次证明：$g(x, t)$ 为凸（注意，是联合凸）

!!! example

    1. 欧几里得范数平方的透视

        $$
        f(x) = x^Tx, \quad {\rm dom}\ f = R^n
        $$

        为凸

        $$
        g(x, t) = t(f\frac{x}{t})^T(\frac{x}{t}) = \frac{x^Tx}{t}, \quad x \in {\rm dom}\ f = R^n, t\in R_{++}
        $$

    2. 负对数函数的透视

        $$
        f(x) = -\log x,
        $$

### 函数的共轭(conjugate)

!!! note

    $$
    f: R^n \to R, \quad f^*: R^n \to R
    $$

    $$
    f^*(y) = \sup\limits_{x\in{\rm dom}\ f}(y^Tx-f(x))
    $$

    无论 $f$ 是否为凸，$f^*$ 均为凸

    $$
    \forall x, y^Tx - f(x)
    $$

    是关于 $y$ 的仿射函数，关于 $y$ 为凸。

## 凸集与凸函数的关系

!!! note

    $\alpha$ 次水平集 ($\alpha - sublevel\ set$)

    对于函数 $f: R^n \to R$，定义其 $\alpha$ 次水平集为

    $$
    C_{\alpha} = \{x\in{\rm dom }\ f | f(x)\le \alpha \}
    $$

    - 凸函数的 $\alpha$ 次水平集为凸集

        $$
        \forall x, y \in C_{alpha} \to f(x)\le \alpha, f(y)\le \alpha, \forall \theta \in [0, 1] \\
        f(\theta x + (1 - \theta)y) \le \theta f(x) + (1 - \theta)f(y) \le \alpha
        $$
    
    - 若函数 $\alpha$ 次水平集均为凸集，该函数并不一定为凸集（例如 $-e^x$）

!!! example

    $$
    f(x) = x_1^2 + x_2^2, x = [x_1, x_2]^T
    $$

    画出 $\alpha$ 次水平集