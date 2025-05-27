# 拉普拉斯变换

## 定义

!!!note "定义"

    $$
    X(s) \triangleq \int_{-\infty}^{+\infty} x(t)e^{-st} dt
    $$

## 与傅立叶变换关系

$$
\begin{aligned}
X(s) = X(\sigma + j\omega) = \int_{-\infty}^{+\infty}[x(t)e^{-\sigma t}]e^{-j\omega t} dt \\
\mathcal{L}\{x(t)\} = \mathcal{F}\{x(t)e^{-\sigma t}\}, \quad \sigma\in \R
\end{aligned}
$$

## 逆变换

$$
x(t) = \frac{1}{2\pi j}\int_{\sigma - j\infty}^{\sigma + j\infty}X(s)e^{st} ds
$$