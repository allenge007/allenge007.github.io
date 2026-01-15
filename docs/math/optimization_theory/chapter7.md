# lec7:

## 多目标优化问题

### 帕累托最优解

### 帕累托最优值

### 帕累托最优面

## 对偶理论

!!! note

    $$
    \min\{f_0(x)\} \\
    {\rm subjected\ to\ } f_i(x) \le 0, h_j(x) = 0
    $$

### Lagrange 函数

!!! note

    $$
    L(x, \lambda, v) = f_0(x) + \sum \lambda_if_i(x) + \sum v_jg_j(x) \\
    {\rm dom}\ L = D \times R^m\times R^n
    $$

    $\lambda, v$ 为拉格朗日乘子、对偶变量（dual variable）

    $x$ 为原变量。


### 对偶函数

!!! note

    $$　
    g(\lambda, v) = \inf\limits_{x\in D} L(x, \lambda, v)
    $$

    1. 性质一：凹函数
        若干个线性函数的极小值为凹函数。
    2. 性质二：

