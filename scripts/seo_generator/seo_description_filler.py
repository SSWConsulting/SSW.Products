import os
import frontmatter
from utils.excel import export_to_xlsx
from utils.language import generate_description, generate_title
from selenium import webdriver
from utils.markdown import write_mdx_file
from dotenv import load_dotenv
from utils.urls import path_to_url
from openai import OpenAI
import json
from openpyxl import Workbook
import yaml  # PyYAML is required for YAML parsing
from utils.urls import path_to_url

website_url = "https://www.yakshaver.ai/"

web_page_paths = [ 
   "docs",
   "pages",
   "privacy",
]


page_paths = [
    "../../content/docs/YakShaver",
    "../../content/pages/YakShaver",
    "../../content/privacy/YakShaver",
]

tenant = "YakShaver"

def populate_metadata(seo: dict, url: str) -> dict:
    if not 'description' in seo.keys():
        seo['description'] = generate_description(url)
    if not 'title' in seo.keys():
        seo['title'] = generate_title(url)
    return seo


def update_frontmatter(frontmatter: str, description: str) -> str:
    data = yaml.safe_load(frontmatter) or {}
    if 'seo' not in data or not isinstance(data['seo'], dict):
        data['seo'] = {}
    data['seo']['description'] = description
    return yaml.dump(data, sort_keys=False, allow_unicode=True).strip()

def main():
    find_mdx_with_seo(web_page_paths)

    

def find_mdx_with_seo(all_folder_paths: list[str]):
    load_dotenv()
    descriptions: list[dict] = []
    for folder in all_folder_paths:
        for root, _, files in os.walk(f"../../content/{folder}/{tenant}"):
            for file in files:
                file_path = os.path.join(root, file)
                
                url = path_to_url(file_path, website_url)

                if file.endswith('.mdx'):
                    page = frontmatter.load(file_path)
                    for key in page.metadata.keys():
                            print(f"key: {key}")

                    generate_seo_data(page.metadata, url)
                    # if 'seo' in page.metadata.keys():
                    #     page.metadata['seo'] = populate_metadata(page.metadata['seo'], url)
                    #     continue
                    # page.metadata['seo'] = populate_metadata({}, url)
                    write_mdx_file(file_path, page.metadata, page.content)
                    continue
                if file.endswith('.json'):
                    with open(file_path, "r", encoding="utf-8") as f:
                        data = json.load(f)
                        generate_seo_data(data, url)
                        # if 'seo' in data:
                        #     data['seo'] = populate_metadata(data['seo'], url)
                        # else:
                        #     data['seo'] = populate_metadata({}, url)
                        with open(file_path, "w",  encoding="utf-8") as f:
                            json.dump(data, f, indent=2, ensure_ascii=False)

    # if len(descriptions) == 0:
    #     print("All pages already have meta descriptions")
    #     return
    # export_to_xlsx(descriptions, "seo_descriptions.xlsx")


def generate_seo_data(metadata: dict, url: str):
    if not 'seo' in metadata.keys():
        metadata['seo'] = {}
    seo = metadata['seo']
    if not 'description' in seo.keys():
        seo['description'] = generate_description(url)
    if not 'title' in seo.keys():
        seo['title'] = generate_title(url)
    print("new title", seo['title'])
    print("new description", seo['description'])

if __name__ == "__main__":
    main()

