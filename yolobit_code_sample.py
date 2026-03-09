# Code mẫu cho Yolobit để gửi dữ liệu cảm biến qua Serial
# Upload code này lên Yolobit và kết nối với máy tính qua USB

from yolobit import *
from machine import Pin, ADC
import time

# Cấu hình cảm biến (tùy chỉnh theo cảm biến thực tế)
# Ví dụ: sử dụng cảm biến nhiệt độ, độ ẩm DHT11/DHT22, và cảm biến ánh sáng

# Giả lập dữ liệu cảm biến (thay bằng đọc từ cảm biến thực)
def read_temperature():
    # Đọc từ cảm biến nhiệt độ thực tế
    # Ví dụ: từ DHT11/DHT22 hoặc DS18B20
    # Giả lập: random từ 30-90
    import random
    return random.randint(30, 90)

def read_humidity():
    # Đọc từ cảm biến độ ẩm thực tế
    # Ví dụ: từ DHT11/DHT22
    # Giả lập: random từ 0-100
    import random
    return random.randint(0, 100)

def read_light():
    # Đọc từ cảm biến ánh sáng thực tế
    # Ví dụ: từ LDR (quang trở)
    # Giả lập: random từ 0-100
    import random
    return random.randint(0, 100)

# Vòng lặp chính
while True:
    # Đọc dữ liệu từ cảm biến
    temp = read_temperature()
    humidity = read_humidity()
    light = read_light()
    
    # Gửi dữ liệu theo format CSV (khuyến nghị)
    print("temp:{},humidity:{},light:{}".format(temp, humidity, light))
    
    # Hoặc gửi theo format JSON
    # print('{"temp":' + str(temp) + ',"humidity":' + str(humidity) + ',"light":' + str(light) + '}')
    
    # Hoặc gửi theo format số cách nhau bởi dấu cách
    # print(temp, humidity, light)
    
    # Hiển thị lên OLED nếu có
    oled.fill(0)
    oled.text("Temp: {}C".format(temp), 0, 0)
    oled.text("Humid: {}%".format(humidity), 0, 16)
    oled.text("Light: {}%".format(light), 0, 32)
    oled.show()
    
    # Chờ 2 giây trước khi gửi dữ liệu tiếp
    time.sleep(2)


# ============================================================
# CODE MẪU SỬ DỤNG CẢM BIẾN THỰC TẾ
# ============================================================

# VÍ DỤ 1: Sử dụng cảm biến DHT11/DHT22 cho nhiệt độ và độ ẩm
"""
from dht import DHT11, DHT22
from machine import Pin

# Khởi tạo cảm biến DHT11 tại pin P0
dht_sensor = DHT11(Pin(pin0.pin_num))

def read_dht():
    try:
        dht_sensor.measure()
        temp = dht_sensor.temperature()
        humidity = dht_sensor.humidity()
        return temp, humidity
    except:
        return None, None

while True:
    temp, humidity = read_dht()
    if temp is not None and humidity is not None:
        # Đọc cảm biến ánh sáng (LDR)
        light = read_light_sensor()
        print("temp:{},humidity:{},light:{}".format(temp, humidity, light))
    time.sleep(2)
"""

# VÍ DỤ 2: Sử dụng LDR (quang trở) cho cảm biến ánh sáng
"""
from machine import ADC, Pin

# Khởi tạo ADC cho LDR tại pin P1
ldr = ADC(Pin(pin1.pin_num))
ldr.atten(ADC.ATTN_11DB)  # Đo từ 0-3.3V

def read_light_sensor():
    # Đọc giá trị ADC (0-4095)
    adc_value = ldr.read()
    # Chuyển đổi sang phần trăm (0-100%)
    light_percent = int((adc_value / 4095) * 100)
    return light_percent
"""

# VÍ DỤ 3: Sử dụng cảm biến DS18B20 cho nhiệt độ chính xác cao
"""
from ds18x20 import DS18X20
from onewire import OneWire
from machine import Pin

# Khởi tạo OneWire tại pin P2
ow = OneWire(Pin(pin2.pin_num))
ds = DS18X20(ow)

def read_ds18b20():
    try:
        roms = ds.scan()
        if roms:
            ds.convert_temp()
            time.sleep_ms(750)
            temp = ds.read_temp(roms[0])
            return temp
        return None
    except:
        return None
"""
