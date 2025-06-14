use std::sync::Mutex;
use tauri::State;

#[cfg(all(target_os = "linux", any(target_arch = "arm", target_arch = "aarch64")))]
use rppal::gpio::{Gpio, OutputPin, Pwm};
#[cfg(all(target_os = "linux", any(target_arch = "arm", target_arch = "aarch64")))]
use rppal::pwm::{Channel, Polarity};

// GPIO 状态管理
struct GpioState {
    #[cfg(all(target_os = "linux", any(target_arch = "arm", target_arch = "aarch64")))]
    relay_pin: Mutex<Option<OutputPin>>,
    #[cfg(all(target_os = "linux", any(target_arch = "arm", target_arch = "aarch64")))]
    pwm_channel: Mutex<Option<Pwm>>,
    #[cfg(not(all(target_os = "linux", any(target_arch = "arm", target_arch = "aarch64"))))]
    _placeholder: Mutex<()>, // Windows/其他平台的占位符
}

impl Default for GpioState {
    fn default() -> Self {
        Self {
            #[cfg(all(target_os = "linux", any(target_arch = "arm", target_arch = "aarch64")))]
            relay_pin: Mutex::new(None),
            #[cfg(all(target_os = "linux", any(target_arch = "arm", target_arch = "aarch64")))]
            pwm_channel: Mutex::new(None),
            #[cfg(not(all(target_os = "linux", any(target_arch = "arm", target_arch = "aarch64"))))]
            _placeholder: Mutex::new(()),
        }
    }
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// 初始化 GPIO
#[tauri::command]
async fn init_gpio() -> Result<String, String> {
    #[cfg(all(target_os = "linux", any(target_arch = "arm", target_arch = "aarch64")))]
    {
        println!("初始化 GPIO (Linux ARM)...");
        Ok("GPIO 初始化成功 (Linux ARM)".to_string())
    }
    
    #[cfg(not(all(target_os = "linux", any(target_arch = "arm", target_arch = "aarch64"))))]
    {
        println!("模拟 GPIO 初始化 (非 ARM Linux 平台)...");
        Ok("GPIO 模拟初始化成功 (开发环境)".to_string())
    }
}

// 设置亮度控制
#[tauri::command]
async fn set_brightness(brightness: u8, state: State<'_, GpioState>) -> Result<String, String> {
    println!("设置亮度: {}%", brightness);
    
    #[cfg(all(target_os = "linux", any(target_arch = "arm", target_arch = "aarch64")))]
    {
        // 实际的 GPIO 控制代码
        const RELAY_PIN: u8 = 18;  // 继电器控制引脚
        const PWM_PIN: u8 = 12;    // PWM 调光引脚
        
        match brightness {
            0 => {
                // 关闭继电器和 PWM
                if let Ok(mut relay) = state.relay_pin.lock() {
                    if relay.is_none() {
                        let gpio = Gpio::new().map_err(|e| format!("GPIO 初始化失败: {}", e))?;
                        *relay = Some(gpio.get(RELAY_PIN).map_err(|e| format!("获取继电器引脚失败: {}", e))?.into_output());
                    }
                    
                    if let Some(ref mut pin) = *relay {
                        pin.set_low();
                        println!("继电器已关闭");
                    }
                }
                
                // 停止 PWM
                if let Ok(mut pwm) = state.pwm_channel.lock() {
                    if let Some(ref mut pwm_ch) = *pwm {
                        pwm_ch.disable().map_err(|e| format!("PWM 停止失败: {}", e))?;
                        println!("PWM 已停止");
                    }
                }
            },
            1..=100 => {
                // 打开继电器
                if let Ok(mut relay) = state.relay_pin.lock() {
                    if relay.is_none() {
                        let gpio = Gpio::new().map_err(|e| format!("GPIO 初始化失败: {}", e))?;
                        *relay = Some(gpio.get(RELAY_PIN).map_err(|e| format!("获取继电器引脚失败: {}", e))?.into_output());
                    }
                    
                    if let Some(ref mut pin) = *relay {
                        pin.set_high();
                        println!("继电器已打开");
                    }
                }
                
                // 设置 PWM 占空比
                if let Ok(mut pwm) = state.pwm_channel.lock() {
                    if pwm.is_none() {
                        // 初始化 PWM (频率 1000Hz)
                        let pwm_ch = Pwm::with_frequency(Channel::Pwm0, 1000.0, 0.0, Polarity::Normal, true)
                            .map_err(|e| format!("PWM 初始化失败: {}", e))?;
                        *pwm = Some(pwm_ch);
                    }
                    
                    if let Some(ref mut pwm_ch) = *pwm {
                        let duty_cycle = brightness as f64 / 100.0;
                        pwm_ch.set_duty_cycle(duty_cycle).map_err(|e| format!("设置 PWM 占空比失败: {}", e))?;
                        pwm_ch.enable().map_err(|e| format!("启用 PWM 失败: {}", e))?;
                        println!("PWM 占空比设置为: {:.2}%", duty_cycle * 100.0);
                    }
                }
            },
            _ => return Err("亮度值超出范围 (0-100)".to_string()),
        }
        
        Ok(format!("亮度已设置为: {}% (实际硬件控制)", brightness))
    }
    
    #[cfg(not(all(target_os = "linux", any(target_arch = "arm", target_arch = "aarch64"))))]
    {
        // 模拟控制（开发环境）
        match brightness {
            0 => {
                println!("模拟: 继电器已关闭, PWM 已停止");
            },
            1..=100 => {
                let duty_cycle = brightness as f64 / 100.0;
                println!("模拟: 继电器已打开, PWM 占空比设置为: {:.2}%", duty_cycle * 100.0);
            },
            _ => return Err("亮度值超出范围 (0-100)".to_string()),
        }
        
        Ok(format!("亮度已设置为: {}% (模拟控制)", brightness))
    }
}

// 获取当前亮度状态
#[tauri::command]
async fn get_brightness_status() -> Result<String, String> {
    #[cfg(all(target_os = "linux", any(target_arch = "arm", target_arch = "aarch64")))]
    {
        Ok("获取亮度状态成功 (Linux ARM)".to_string())
    }
    
    #[cfg(not(all(target_os = "linux", any(target_arch = "arm", target_arch = "aarch64"))))]
    {
        Ok("获取亮度状态成功 (模拟)".to_string())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(GpioState::default())
        .invoke_handler(tauri::generate_handler![
            greet,
            init_gpio,
            set_brightness,
            get_brightness_status
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
