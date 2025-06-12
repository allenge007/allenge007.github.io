# 连续时间傅立叶变换

## 非周期信号

我们可以使用傅里叶变换对来分析非周期信号。而反变换如公式 (2) 所示。

$$
\begin{align}
X(j\omega) &= \int_{-\infty}^{+\infty} x(t)e^{-j\omega t} dt \\
x(t) &= \frac{1}{2\pi}\int_{-\infty}^{+\infty}X(j\omega)e^{j\omega t} d\omega
\end{align}
$$

## 周期信号

$$
\begin{aligned}
X(j\omega) &= \sum_{k = -\infty}^{+\infty}2\pi a_k\delta(\omega - k\omega_0) \\
x(t) &= \sum_{k = -\infty}^{+\infty}a_ke^{jk\omega_0t}
\end{aligned}
$$

## 常用变换及其推导过程

$$
\sum_{k = -\infty}^{+\infty} a_ke^{j\omega_0 t}\stackrel{\mathcal{F}}{\longleftrightarrow} 2\pi{\sum_{k = -\infty}^{+\infty}}a_k\delta(\omega - k\omega_0)
$$

$$
e^{jk\omega_0t} \stackrel{\mathcal{F}}{\longleftrightarrow} 2\pi\delta(\omega - k\omega_0)
$$

## 推导过程