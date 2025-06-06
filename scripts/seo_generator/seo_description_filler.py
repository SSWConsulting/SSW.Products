import os
import frontmatter
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options
import time
from dotenv import load_dotenv
from bs4 import BeautifulSoup
from openai import OpenAI
from openpyxl import Workbook
import yaml  # PyYAML is required for YAML parsing



website_url = "https://www.yakshaver.ai/"

web_page_paths = [ 
   "docs",
   "pages",
   "privacy",
]

tenant = "YakShaver"

system_prompt = """
        Provide a meta description for the content provided assuming it will be hosted on a web
        page. YOUR RESPONSE MUST BE UNDER 150 CHARACTERS OR UNDER. DO NOT INCLUDE AIR QUOTES IN
        YOUR RESPONSE.
    """

def export_to_xlsx(data:list[dict], filename: str):
    wb = Workbook()
    ws = wb.active
    if not data:
        raise ValueError("Data is empty")
    keys:list[str] = list(data[0].keys())
    ws.append(keys)
    for row in data:
        ws.append(list(row.values()))
    wb.save(filename)

# TODO - Replace with an olm for reduced cost
def query_meta_description_gpt(query: str) -> str:
    openai_api_key = os.getenv("OPENAI_API_KEY")
    if not openai_api_key:
        raise Exception("OpenAI API key not set")
    client = OpenAI(
       api_key = openai_api_key
    )
    chat_completion = client.chat.completions.create(
       messages = [
          {
             "role": "system",
             "content": system_prompt
          },
          {
            "role":"user",
            "content": query
          }
       ],
       model="gpt-4o-mini",
       temperature=0.2, #A lower temperature indicates a more concise but less creative response
    )

    description = chat_completion.choices[0].message.content
    return description

def extract_text_from_html(html_content : str):
    # Read the HTML
    # Create a BeautifulSoup object
    soup = BeautifulSoup(html_content, 'html.parser')
    # Extract all the text
    text = soup.get_text()
    return text

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

# def find_term_line_numbers(terms: list[str], lines:list[str] ) -> dict:
#     # using a dictionary to reduce the number of times the array must be traversed
#     search_term_locations : dict = {}
#     for term in terms:
#        search_term_locations[term] = -1
#     for line_index, line in enumerate(lines):
#        # nested loops are yucky
#         for term in terms:
#           if line.startswith(term):
#             if term == title_field:
#               # in case the title is spread across multiple lines
#               while lines[line_index + 1 ].startswith("    "):
#                 line_index += 1


#             search_term_locations[term] = line_index
#     return search_term_locations

def path_to_url(path:str):
   path = path[2:]
   path = path.replace("\\", "/")
   path = path.replace("index.mdx", "")
   path = path.replace(".mdx", "")
   path = path.replace("pages/", "")

   return website_url + path

def update_frontmatter(frontmatter: str, description: str) -> str:
    data = yaml.safe_load(frontmatter) or {}
    if 'seo' not in data or not isinstance(data['seo'], dict):
        data['seo'] = {}
    data['seo']['description'] = description
    return yaml.dump(data, sort_keys=False, allow_unicode=True).strip()


def write_mdx_file(file_path: str, frontmatter: str, body: str):
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write('---\n')
        yaml.dump(frontmatter, f)
        f.write('---\n')
        if(body):
            f.write(body)


def find_mdx_with_seo(all_folder_paths: list[str]):
    load_dotenv()
    descriptions: list[dict] = []
    for folder in all_folder_paths:
        for root, _, files in os.walk(f"../../content/{folder}/{tenant}"):
            for file in files:
                if file.endswith('.mdx'):
                    file_path = os.path.join(root, file)

                    page = frontmatter.load(file_path)

                    for key in page.metadata.keys():
                            print(f"key: {key}")
                    new_seo = {
                        "description": "test_description",
                        "title": "test_title",    
                    }
                    if 'seo' in page.metadata.keys():
                        continue
                    page.metadata['seo'] = new_seo
                    write_mdx_file(file_path, page.metadata, page.content)

    if len(descriptions) == 0:
        print("All pages already have meta descriptions")
        return
    export_to_xlsx(descriptions, "seo_descriptions.xlsx")



find_mdx_with_seo(web_page_paths)




