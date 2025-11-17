import os
import json
from datetime import datetime

DATA_FOLDER = "data"

def read_json(filename):
    """Lee un archivo JSON y retorna su contenido"""
    path = os.path.join(DATA_FOLDER, filename)
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        return []

def write_json(filename, data):
    """Escribe datos en un archivo JSON"""
    path = os.path.join(DATA_FOLDER, filename)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def get_next_id(filename, id_field='id'):
    """Obtiene el siguiente ID disponible"""
    data = read_json(filename)
    if not data:
        return 1
    return max(item[id_field] for item in data) + 1

def find_by_id(filename, id_value, id_field='id'):
    """Busca un elemento por ID"""
    data = read_json(filename)
    for item in data:
        if item[id_field] == id_value:
            return item
    return None

def find_by_field(filename, field_name, field_value):
    """Busca un elemento por un campo específico"""
    data = read_json(filename)
    for item in data:
        if item.get(field_name) == field_value:
            return item
    return None

def update_item(filename, id_value, updated_data, id_field='id'):
    """Actualiza un elemento existente"""
    data = read_json(filename)
    for i, item in enumerate(data):
        if item[id_field] == id_value:
            data[i].update(updated_data)
            write_json(filename, data)
            return data[i]
    return None

def delete_item(filename, id_value, id_field='id'):
    """Elimina un elemento por ID"""
    data = read_json(filename)
    data = [item for item in data if item[id_field] != id_value]
    write_json(filename, data)
    return True

def add_item(filename, item):
    """Agrega un nuevo elemento"""
    data = read_json(filename)
    data.append(item)
    write_json(filename, data)
    return item
