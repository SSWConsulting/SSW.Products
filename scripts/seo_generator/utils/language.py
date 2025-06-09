import os
from openai import OpenAI


description_prompt = """
        Provide a meta description for the content provided assuming it will be hosted on a web
        page. YOUR RESPONSE MUST BE UNDER 150 CHARACTERS OR UNDER. DO NOT INCLUDE AIR QUOTES IN
        YOUR RESPONSE.
    """

title_prompt = """
        Provide a title tag for the content provided assuming it will be hosted on a web
        page. YOUR RESPONSE MUST BE UNDER 70 CHARACTERS OR UNDER. DO NOT INCLUDE AIR QUOTES IN
        YOUR RESPONSE.
    """

def generate_title(url: str):
    title = ""
    while (title == "" or len(title) > 70):
        title = call_open_ai(url, title_prompt)
    return title
    
def generate_description(url: str):
    description = ""
    while (description == "" or len(description) > 150):
        description = call_open_ai(url, description_prompt)
    return description


def call_open_ai(url: str, prompt: str) -> str:
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
             "content": prompt
          },
          {
            "role":"user",
            "content": url
          }
       ],
       model="gpt-4o-mini",
       temperature=0.2, #A lower temperature indicates a more concise but less creative response
    )

    description = chat_completion.choices[0].message.content
    return description