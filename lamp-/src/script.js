// 获取随机背景图片（fj API）
function setRandomBackground() {
    const imageUrl = 'https://t.alcy.cc/fj';
    // 添加时间戳防止缓存
    const timestampedUrl = `${imageUrl}?t=${Date.now()}`;
    
    // 预加载图片
    const img = new Image();
    img.onload = function() {
        // 图片加载完成后再设置背景
        document.body.style.backgroundImage = `url(${timestampedUrl})`;
        
        // 保存背景到localStorage
        localStorage.setItem('mainPageBackground', timestampedUrl);
        
        // 短暂延迟后移除加载状态，确保液态玻璃效果同步
        setTimeout(() => {
            const clockContainer = document.querySelector('.clock-container');
            if (clockContainer.classList.contains('loading')) {
                clockContainer.classList.remove('loading');
            }
        }, 100);
    };
    
    img.onerror = function() {
        // 图片加载失败时也移除加载状态
        const clockContainer = document.querySelector('.clock-container');
        if (clockContainer.classList.contains('loading')) {
            clockContainer.classList.remove('loading');
        }
    };
    
    img.src = timestampedUrl;
}

// 预加载倒计时页面背景图片并跳转
function preloadAndNavigate() {
    // 保存当前主页背景
    const currentBg = document.body.style.backgroundImage;
    if (currentBg) {
        const urlMatch = currentBg.match(/url\(["']?([^"']*)["']?\)/);
        if (urlMatch) {
            localStorage.setItem('mainPageBackground', urlMatch[1]);
        }
    }
    
    // 检查是否有保存的倒计时背景
    const savedCountdownBackground = localStorage.getItem('countdownBackground');
    
    if (savedCountdownBackground) {
        // 预加载保存的背景
        const img = new Image();
        img.onload = function() {
            window.location.href = 'countdown.html';
        };
        img.onerror = function() {
            window.location.href = 'countdown.html';
        };
        img.src = savedCountdownBackground;
    } else {
        // 没有保存的背景，预加载fj背景
        const imageUrl = 'https://t.alcy.cc/fj';
        const timestampedUrl = `${imageUrl}?t=${Date.now()}`;
        
        const img = new Image();
        img.onload = function() {
            localStorage.setItem('countdownBackground', timestampedUrl);
            window.location.href = 'countdown.html';
        };
        img.onerror = function() {
            window.location.href = 'countdown.html';
        };
        img.src = timestampedUrl;
    }
}

// 更新时钟显示
function updateClock() {
    const now = new Date();
    
    // 格式化时间
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    
    // 更新DOM
    document.getElementById('time').textContent = timeString;
}

// 点击时钟切换背景
function handleClockClick() {
    const clockContainer = document.querySelector('.clock-container');
    
    // 添加加载动画
    clockContainer.classList.add('loading');
    
    // 刷新背景图片（fj API）
    setRandomBackground();
}

// 调用后端设置亮度
async function setBrightnessHardware(brightness) {
    try {
        if (window.__TAURI__) {
            const result = await window.__TAURI__.core.invoke('set_brightness', { brightness: brightness });
            console.log('后端响应:', result);
            return true;
        } else {
            console.log('非 Tauri 环境，模拟设置亮度:', brightness + '%');
            return true;
        }
    } catch (error) {
        console.error('设置亮度失败:', error);
        return false;
    }
}

// 亮度滑块功能 - 简化版本，确保可拖动
function initBrightnessSlider() {
    const slider = document.getElementById('brightness-slider');
    const sliderFill = document.getElementById('slider-fill');
    const sliderContainer = document.querySelector('.brightness-slider-container');
    const leftIcon = document.querySelector('.brightness-icon-left');
    const rightIcon = document.querySelector('.brightness-icon-right');
    
    if (!slider) {
        console.error('滑块元素未找到');
        return;
    }
    
    console.log('滑块初始化成功'); // 调试日志
    
    // 从localStorage获取保存的亮度值，默认0
    const savedBrightness = localStorage.getItem('brightness') || '0';
    slider.value = savedBrightness;
    
    let isDragging = false;
    let lastHardwareValue = -1; // 记录上次发送到硬件的值，避免重复发送
    
    // 更新滑块显示和拉伸效果
    function updateSliderDisplay(value) {
        const numValue = parseInt(value);
        const percentage = numValue + '%';
        
        console.log('更新滑块显示:', numValue); // 调试日志
        
        // 更新进度条
        if (sliderFill) {
            sliderFill.style.width = percentage;
        }
        
        // 更新图标透明度
        if (leftIcon && rightIcon) {
            const normalizedValue = numValue / 100;
            leftIcon.style.opacity = 0.4 + (0.6 * (1 - normalizedValue));
            rightIcon.style.opacity = 0.4 + (0.6 * normalizedValue);
        }
        
        // 实时拉伸效果 - 只在拖拽时有效
        if (isDragging && sliderContainer) {
            let stretchX = 1;
            let stretchY = 1;
            
            if (numValue >= 100) {
                // 在右边界时水平拉伸
                stretchX = 1.05; // 轻微拉伸5%
                stretchY = 0.98; // 轻微压扁2%
            } else if (numValue <= 0) {
                // 在左边界时水平拉伸
                stretchX = 1.05; // 轻微拉伸5%
                stretchY = 0.98; // 轻微压扁2%
            }
            
            sliderContainer.style.transform = `scale(1.02) scaleX(${stretchX}) scaleY(${stretchY})`;
        } else if (sliderContainer) {
            // 不拖拽时恢复正常
            sliderContainer.style.transform = '';
        }
        
        // 保存亮度值
        localStorage.setItem('brightness', numValue);
        console.log('亮度设置为:', numValue + '%');
        
        // 发送到硬件（避免重复发送相同值）
        if (lastHardwareValue !== numValue) {
            lastHardwareValue = numValue;
            setBrightnessHardware(numValue);
        }
    }
    
    // 初始化显示
    updateSliderDisplay(savedBrightness);
    
    // 开始拖动
    function startDrag(e) {
        isDragging = true;
        console.log('开始拖动');
        
        // 立即更新一次以应用拉伸效果
        updateSliderDisplay(slider.value);
    }
    
    // 结束拖动
    function endDrag() {
        if (isDragging) {
            isDragging = false;
            console.log('结束拖动');
            
            // 恢复正常状态
            updateSliderDisplay(slider.value);
        }
    }
    
    // 滑块值改变事件
    slider.addEventListener('input', function(e) {
        console.log('input事件触发:', e.target.value);
        updateSliderDisplay(e.target.value);
    });
    
    slider.addEventListener('change', function(e) {
        console.log('change事件触发:', e.target.value);
        updateSliderDisplay(e.target.value);
    });
    
    // 拖动开始事件
    slider.addEventListener('mousedown', function(e) {
        console.log('mousedown事件触发');
        startDrag(e);
    });
    
    slider.addEventListener('touchstart', function(e) {
        console.log('touchstart事件触发');
        startDrag(e);
    }, { passive: true });
    
    // 拖动结束事件
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
    document.addEventListener('touchcancel', endDrag);
    
    // 测试滑块是否可点击
    slider.addEventListener('click', function(e) {
        console.log('滑块点击事件触发:', e.target.value);
    });
}

// 长按检测变量
let pressTimer = null;
let isLongPress = false;

// 处理长按开始
function handlePressStart(event) {
    // 阻止事件冒泡
    event.preventDefault();
    event.stopPropagation();
    
    isLongPress = false;
    pressTimer = setTimeout(() => {
        isLongPress = true;
        // 长按1.5秒后预加载图片并跳转到倒计时页面
        preloadAndNavigate();
    }, 1500);
}

// 处理长按结束
function handlePressEnd(event) {
    // 阻止事件冒泡
    event.preventDefault();
    event.stopPropagation();
    
    if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
    }
    
    // 如果不是长按，执行原来的点击换背景功能
    if (!isLongPress) {
        handleClockClick();
    }
}

// 初始化 GPIO（页面加载时调用）
async function initGPIO() {
    try {
        if (window.__TAURI__) {
            const result = await window.__TAURI__.core.invoke('init_gpio');
            console.log('GPIO 初始化:', result);
        }
    } catch (error) {
        console.error('GPIO 初始化失败:', error);
    }
}

// 页面加载时初始化
window.addEventListener('load', function() {
    console.log('页面加载完成'); // 调试日志
    
    // 初始化 GPIO
    initGPIO();
    
    // 检查是否有保存的主页背景
    const savedBackground = localStorage.getItem('mainPageBackground');
    
    if (savedBackground) {
        // 使用保存的背景
        document.body.style.backgroundImage = `url(${savedBackground})`;
    } else {
        // 设置初始背景为fj
        setRandomBackground();
    }
    
    // 初始化时钟
    updateClock();
    
    // 初始化亮度滑块
    initBrightnessSlider();
    
    // 添加时钟长按和点击事件监听器
    const clockContainer = document.querySelector('.clock-container');
    
    // 鼠标事件 - 只监听按下和释放，不监听移动
    clockContainer.addEventListener('mousedown', handlePressStart);
    clockContainer.addEventListener('mouseup', handlePressEnd);
    
    // 触摸事件（移动设备）
    clockContainer.addEventListener('touchstart', handlePressStart);
    clockContainer.addEventListener('touchend', handlePressEnd);
    clockContainer.addEventListener('touchcancel', handlePressEnd);
});

// 每秒更新时钟
setInterval(updateClock, 1000);

// 每10分钟自动更换背景图片（fj）
setInterval(setRandomBackground, 600000);