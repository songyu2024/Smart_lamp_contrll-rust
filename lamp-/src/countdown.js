// 设置目标日期：2026年6月7日上午9点
const targetDate = new Date("2026-06-07T09:00:00");

// 长按检测变量
let pressTimer = null;
let isLongPress = false;

// 背景状态管理
let currentBackground = null;

// 更新倒计时
function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
        // 高考已经开始
        document.getElementById('days').textContent = '000';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        document.querySelector('.title').textContent = '高考进行中';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById('days').textContent = String(days).padStart(3, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// 每秒更新倒计时
setInterval(updateCountdown, 1000);
updateCountdown();

// 切换背景到指定API
function changeBackgroundToApi(apiName) {
    const timestampedUrl = `https://t.alcy.cc/${apiName}?t=${Date.now()}`;
    
    const img = new Image();
    img.onload = function() {
        document.body.style.backgroundImage = `url(${timestampedUrl})`;
        currentBackground = timestampedUrl;
    };
    img.src = timestampedUrl;
}

// 设置背景（默认fj）
function setRandomBackground() {
    changeBackgroundToApi('fj');
}

// 预加载主页面背景图片并返回
function preloadAndGoBack() {
    // 获取从localStorage中保存的背景
    const savedBackground = localStorage.getItem('mainPageBackground');
    
    if (savedBackground) {
        // 预加载保存的背景
        const img = new Image();
        img.onload = function() {
            // 图片加载完成后再跳转
            window.location.href = 'index.html';
        };
        img.onerror = function() {
            // 即使加载失败也跳转
            window.location.href = 'index.html';
        };
        img.src = savedBackground;
    } else {
        // 没有保存的背景，直接跳转
        window.location.href = 'index.html';
    }
}

// 一言API功能 - 使用主API和备用API
function loadHitokoto() {
    const apiList = [
        { 
            url: "https://v1.hitokoto.cn/",
            handler: (data) => data.hitokoto
        },
        { 
            url: "https://api.nxvav.cn/api/yiyan",
            handler: (data) => typeof data === 'string' ? data : data.hitokoto || data.content || data.text
        }
    ];
    
    function tryApi(index) {
        if (index >= apiList.length) {
            document.getElementById("quote").textContent = "今天也要加油鸭！";
            return;
        }
        
        const api = apiList[index];
        
        fetch(api.url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`API响应错误: ${response.status}`);
                }
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    return response.json();
                } else {
                    return response.text();
                }
            })
            .then(data => {
                try {
                    if (typeof data === 'string' && data.trim().startsWith('{')) {
                        data = JSON.parse(data);
                    }
                    
                    const quote = api.handler(data);
                    if (quote) {
                        document.getElementById("quote").textContent = quote;
                    } else {
                        throw new Error("无法从响应中获取一言");
                    }
                } catch (err) {
                    tryApi(index + 1);
                }
            })
            .catch(err => {
                tryApi(index + 1);
            });
    }
    
    tryApi(0);
}

// 天气功能
function fetchWeather() {
    fetch('https://api.vvhan.com/api/weather')
        .then(response => {
            if (!response.ok) {
                throw new Error(`天气API响应错误: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.data) {
                const weatherType = data.data.type || '未知';
                const highTemp = data.data.high || '--';
                const lowTemp = data.data.low || '--';
                
                document.getElementById('weather-type').textContent = weatherType;
                document.getElementById('weather-temp').textContent = `${highTemp}/${lowTemp}`;
            } else {
                throw new Error('无法获取天气数据');
            }
        })
        .catch(error => {
            document.getElementById('weather-type').textContent = '获取失败';
            document.getElementById('weather-temp').textContent = '--°C/--°C';
        });
}

// 添加加载动画（修复字体变暗问题）
function addLoadingAnimation(element) {
    const textElement = element.querySelector('.liquidGlass-text');
    if (textElement) {
        textElement.classList.add('loading-animation');
        
        // 0.5秒后移除动画，减少闪烁时间
        setTimeout(() => {
            textElement.classList.remove('loading-animation');
        }, 500);
    }
}

// 处理倒计时卡片长按开始
function handleCountdownPressStart(event) {
    // 阻止事件冒泡，防止触发其他事件
    event.preventDefault();
    event.stopPropagation();
    
    isLongPress = false;
    
    pressTimer = setTimeout(() => {
        isLongPress = true;
        // 长按1.5秒后预加载图片并返回时钟页面
        preloadAndGoBack();
    }, 1500);
}

// 处理倒计时卡片长按结束
function handleCountdownPressEnd(event) {
    // 阻止事件冒泡
    event.preventDefault();
    event.stopPropagation();
    
    if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
    }
    
    // 如果不是长按，切换背景并添加动画
    if (!isLongPress) {
        const countdownCard = document.getElementById('countdown-card');
        addLoadingAnimation(countdownCard);
        setRandomBackground(); // 使用fj API
    }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否有保存的倒计时背景
    const savedCountdownBackground = localStorage.getItem('countdownBackground');
    
    if (savedCountdownBackground) {
        // 使用保存的背景
        document.body.style.backgroundImage = `url(${savedCountdownBackground})`;
        currentBackground = savedCountdownBackground;
    } else {
        // 设置初始背景为fj
        setRandomBackground();
    }
    
    // 加载一言和天气
    loadHitokoto();
    fetchWeather();
    
    // 倒计时卡片长按和点击事件
    const countdownCard = document.getElementById('countdown-card');
    
    // 鼠标事件 - 只监听按下和释放，不监听移动
    countdownCard.addEventListener('mousedown', handleCountdownPressStart);
    countdownCard.addEventListener('mouseup', handleCountdownPressEnd);
    
    // 触摸事件（移动设备）
    countdownCard.addEventListener('touchstart', handleCountdownPressStart);
    countdownCard.addEventListener('touchend', handleCountdownPressEnd);
    countdownCard.addEventListener('touchcancel', handleCountdownPressEnd);
    
    // 天气卡片点击 - 切换moe背景
    const weatherCard = document.querySelector('.weather-card');
    weatherCard.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        // 添加加载动画
        addLoadingAnimation(weatherCard);
        
        // 切换到moe API
        changeBackgroundToApi('moe');
    });
    
    // 一言卡片点击 - 刷新一言
    const quoteCard = document.querySelector('.quote-card');
    quoteCard.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        // 添加加载动画
        addLoadingAnimation(quoteCard);
        
        document.getElementById('quote').textContent = "加载中...";
        loadHitokoto();
    });
});

// 页面卸载时保存当前背景
window.addEventListener('beforeunload', function() {
    if (currentBackground) {
        localStorage.setItem('countdownBackground', currentBackground);
    }
});

// 自动刷新
setInterval(setRandomBackground, 10 * 60 * 1000); // 10分钟刷新背景（fj）
setInterval(function() {
    document.getElementById('quote').textContent = "加载中...";
    loadHitokoto();
}, 2 * 60 * 1000); // 2分钟刷新一言
setInterval(fetchWeather, 2 * 60 * 1000); // 2分钟刷新天气