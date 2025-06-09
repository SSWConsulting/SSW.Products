from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup


def get_site_text(url):
    # Setup Chrome options
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Ensure the browser runs in headless mode
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chromedriver_path = os.getenv("CHROME_DRIVER_PATH")
    if not chromedriver_path:
       raise Exception("Chromedriver path not set")
    # Initialize the Chrome driver
    service = ChromeService(executable_path=chromedriver_path)  # Update the path to the chromedriver
    driver = webdriver.Chrome(service=service, options=chrome_options)

    try:
        # Open the URL
        driver.get(url)
        # Give some extra time for JavaScript to finish executing (optional)
        time.sleep(2)
        page_source = driver.page_source
        page_source = extract_text_from_html(page_source)
    finally:
        driver.quit()
    return page_source

def extract_text_from_html(html_content : str):
    # Read the HTML
    # Create a BeautifulSoup object
    soup = BeautifulSoup(html_content, 'html.parser')
    # Extract all the text
    text = soup.get_text()
    return text