from openpyxl import Workbook



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