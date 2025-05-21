# 傅立叶变换

## 连续时间傅立叶变换

### 非周期信号

$$
\begin{aligned}
x(t) &= \frac{1}{2\pi}\int_{-\infty}^{+\infty}X(j\omega)e^{j\omega t} d\omega \\
X(j\omega) &= \int_{-\infty}^{+\infty} x(t)e^{-j\omega t} dt
\end{aligned}
$$

### 周期信号

$$
\begin{aligned}
X(j\omega) &= \sum_{k = -\infty}^{+\infty}2\pi a_k\delta(\omega - k\omega_0) \\
x(t) &= \sum_{k = -\infty}^{+\infty}a_ke^{jk\omega_0t}
\end{aligned}
$$

## 离散时间傅立叶变换

