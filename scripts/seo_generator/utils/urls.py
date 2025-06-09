def path_to_url(path:str, website_url: str):
   path = path[2:]
   path = path.replace("\\", "/")
   path = path.replace("index.mdx", "")
   path = path.replace(".mdx", "")
   path = path.replace(".json", "")
   path = path.replace("pages/", "")
   return website_url + path
