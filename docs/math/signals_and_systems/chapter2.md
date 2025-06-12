# 离散时间傅里叶变换

## 非周期信号

$$
\begin{aligned}
x[n] &= \frac{1}{2\pi}\int_{2\pi} X(e^{j\omega})e^{j\omega n} d\omega \\
X(e^{j\omega}) &= \sum_{n = -\infty}^{+\infty} x[n]e^{-j\omega n}
\end{aligned}
$$

## 周期信号

考虑周期信号的傅立叶级数

$$
x[n] = \sum_{k = \langle N \rangle} a_ke^{jk(2\pi/N)n}
$$

可以得到傅立叶变换

$$
X(e^{j\omega}) = \sum_{k = -\infty}^{+\infty} 2\pi a_k\delta(\omega - \frac{2\pi k}{N})
$$