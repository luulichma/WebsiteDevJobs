"""
Script để convert Mermaid diagram (.mmd) sang PNG
Sử dụng Mermaid.js qua HTML và Playwright hoặc Selenium
"""

import os
import sys
import base64
from pathlib import Path

# Fix encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def create_html_with_mermaid(mermaid_code, output_html):
    """Tạo file HTML có chứa Mermaid diagram"""
    
    html_template = f'''<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <script type="module">
        import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
        mermaid.initialize({{ 
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose'
        }});
    </script>
    <style>
        body {{
            margin: 0;
            padding: 40px;
            background: white;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }}
        .mermaid {{
            background: white;
        }}
    </style>
</head>
<body>
    <div class="mermaid">
{mermaid_code}
    </div>
</body>
</html>'''
    
    with open(output_html, 'w', encoding='utf-8') as f:
        f.write(html_template)
    
    print(f"✅ Đã tạo file HTML: {output_html}")
    return output_html


def convert_with_playwright(html_file, output_png):
    """Convert HTML sang PNG bằng Playwright"""
    try:
        from playwright.sync_api import sync_playwright
        
        with sync_playwright() as p:
            browser = p.chromium.launch()
            # Tăng device_scale_factor để có ảnh chất lượng cao (retina display)
            page = browser.new_page(
                viewport={'width': 1920, 'height': 1080},
                device_scale_factor=3  # 3x resolution cho ảnh sắc nét
            )
            
            # Mở file HTML
            page.goto(f'file:///{os.path.abspath(html_file)}')
            
            # Đợi Mermaid render xong
            page.wait_for_timeout(3000)
            
            # Screenshot phần diagram với quality cao
            diagram = page.locator('.mermaid').first
            diagram.screenshot(path=output_png, scale='device')
            
            browser.close()
            print(f"✅ Đã export PNG bằng Playwright (High-DPI): {output_png}")
            return True
            
    except ImportError:
        print("❌ Chưa cài Playwright. Chạy: pip install playwright && playwright install chromium")
        return False
    except Exception as e:
        print(f"❌ Lỗi Playwright: {e}")
        return False


def convert_with_selenium(html_file, output_png):
    """Convert HTML sang PNG bằng Selenium (fallback)"""
    try:
        from selenium import webdriver
        from selenium.webdriver.common.by import By
        from selenium.webdriver.support.ui import WebDriverWait
        import time
        
        options = webdriver.ChromeOptions()
        options.add_argument('--headless')
        options.add_argument('--window-size=1920,1080')
        
        driver = webdriver.Chrome(options=options)
        driver.get(f'file:///{os.path.abspath(html_file)}')
        
        # Đợi render
        time.sleep(3)
        
        # Screenshot
        element = driver.find_element(By.CLASS_NAME, 'mermaid')
        element.screenshot(output_png)
        
        driver.quit()
        print(f"✅ Đã export PNG bằng Selenium: {output_png}")
        return True
        
    except ImportError:
        print("❌ Chưa cài Selenium. Chạy: pip install selenium")
        return False
    except Exception as e:
        print(f"❌ Lỗi Selenium: {e}")
        return False


def main():
    # Đọc file mermaid input
    if len(sys.argv) > 1:
        mermaid_file = sys.argv[1]
    else:
        mermaid_file = r'd:\WebsiteDevJobs\WebsiteDevJobs\mermaid_diagrams\UC04_ManageProfile.mmd'
    
    if not os.path.exists(mermaid_file):
        print(f"❌ Không tìm thấy file: {mermaid_file}")
        return
    
    # Đọc nội dung Mermaid
    with open(mermaid_file, 'r', encoding='utf-8') as f:
        mermaid_code = f.read()
    
    # Tạo tên file output
    base_name = Path(mermaid_file).stem
    output_dir = Path(mermaid_file).parent.parent / 'diagrams_full'
    output_dir.mkdir(exist_ok=True)
    
    output_html = output_dir / f'{base_name}.html'
    output_png = output_dir / f'{base_name}.png'
    
    # Tạo HTML
    html_path = create_html_with_mermaid(mermaid_code, output_html)
    
    # Thử convert sang PNG
    print("\n🔄 Đang convert sang PNG...")
    
    success = convert_with_playwright(html_path, output_png)
    
    if not success:
        print("\n🔄 Thử dùng Selenium...")
        success = convert_with_selenium(html_path, output_png)
    
    if not success:
        print(f"\n⚠️  Không thể tự động export PNG.")
        print(f"📄 Bạn có thể mở file HTML này bằng browser: {html_path}")
        print(f"   Sau đó screenshot diagram để lưu thành PNG")
    else:
        print(f"\n✅ HOÀN TẤT!")
        print(f"   📄 HTML: {output_html}")
        print(f"   🖼️  PNG:  {output_png}")


if __name__ == '__main__':
    main()
