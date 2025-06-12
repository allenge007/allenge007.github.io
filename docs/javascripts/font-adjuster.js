document.addEventListener('DOMContentLoaded', function () {
    const htmlElement = document.documentElement;
    const step = 1; // 每次调整 1px (作用于根元素，rem 单位会相应缩放)
    const storageKey = 'preferredFontSize';

    // 获取初始/默认字体大小 (从 CSS 计算得到)
    let defaultFontSize;
    try {
        defaultFontSize = parseFloat(getComputedStyle(htmlElement).fontSize);
    } catch (e) {
        console.error("Could not get default font size:", e);
        defaultFontSize = 16; // 备用默认值
    }

    const minSize = defaultFontSize - 4; // 允许缩小的最小值 (例如，比默认小 4px)
    const maxSize = defaultFontSize + 8; // 允许放大的最大值 (例如，比默认大 8px)

    function applyFontSize(size) {
        const newSize = Math.max(minSize, Math.min(size, maxSize));
        htmlElement.style.fontSize = newSize + 'px';
        localStorage.setItem(storageKey, newSize);
    }

    function getCurrentEffectiveFontSize() {
        if (htmlElement.style.fontSize) {
            return parseFloat(htmlElement.style.fontSize);
        }
        return defaultFontSize; // 如果没有内联样式，则返回初始计算的默认值
    }

    function increaseFontSize() {
        applyFontSize(getCurrentEffectiveFontSize() + step);
    }

    function decreaseFontSize() {
        applyFontSize(getCurrentEffectiveFontSize() - step);
    }

    function resetFontSize() {
        localStorage.removeItem(storageKey);
        htmlElement.style.fontSize = ''; // 移除内联样式，恢复到 CSS 定义的默认大小
    }

    // 页面加载时应用存储的字体大小
    const storedSize = localStorage.getItem(storageKey);
    if (storedSize) {
        const numericStoredSize = parseFloat(storedSize);
        // 确保存储的大小在当前允许范围内
        if (numericStoredSize >= minSize && numericStoredSize <= maxSize) {
            htmlElement.style.fontSize = numericStoredSize + 'px';
        } else {
            // 如果超出范围，则重置
            resetFontSize();
        }
    }

    // 将功能绑定到按钮 (你需要创建这些按钮并赋予它们相应的 ID)
    const increaseButton = document.getElementById('increase-font-button');
    const decreaseButton = document.getElementById('decrease-font-button');
    const resetButton = document.getElementById('reset-font-button');

    if (increaseButton) {
        increaseButton.addEventListener('click', increaseFontSize);
    }
    if (decreaseButton) {
        decreaseButton.addEventListener('click', decreaseFontSize);
    }
    if (resetButton) {
        resetButton.addEventListener('click', resetFontSize);
    }
});