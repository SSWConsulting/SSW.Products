import yaml

def write_mdx_file(file_path: str, frontmatter: str, body: str):
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write('---\n')
        yaml.dump(frontmatter, f)
        f.write('---\n')
        if(body):
            f.write(body)