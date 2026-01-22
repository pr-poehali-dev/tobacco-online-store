import json
import os
import psycopg2
from typing import Optional

def handler(event: dict, context) -> dict:
    """API для получения товаров из базы данных"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    if method != 'GET':
        return error_response('Метод не поддерживается', 405)
    
    db_url = os.environ.get('DATABASE_URL')
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    
    if not db_url:
        return error_response('DATABASE_URL не настроен')
    
    query_params = event.get('queryStringParameters') or {}
    category_id = query_params.get('category_id')
    search = query_params.get('search')
    limit = int(query_params.get('limit', 50))
    offset = int(query_params.get('offset', 0))
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    try:
        # Построение запроса
        where_clauses = ['p.is_active = TRUE']
        params = []
        
        if category_id:
            where_clauses.append(f'p.category_id = %s')
            params.append(int(category_id))
        
        if search:
            where_clauses.append(f'(p.name ILIKE %s OR p.description ILIKE %s OR p.article ILIKE %s)')
            search_term = f'%{search}%'
            params.extend([search_term, search_term, search_term])
        
        where_sql = ' AND '.join(where_clauses)
        
        # Получение товаров
        cur.execute(f"""
            SELECT 
                p.id, p.moysklad_id, p.name, p.description, p.article,
                p.price, p.stock_quantity, p.category_id, p.image_url,
                p.unit, p.barcode, c.name as category_name
            FROM {schema}.products p
            LEFT JOIN {schema}.categories c ON p.category_id = c.id
            WHERE {where_sql}
            ORDER BY p.name
            LIMIT %s OFFSET %s
        """, params + [limit, offset])
        
        products = []
        for row in cur.fetchall():
            products.append({
                'id': row[0],
                'moysklad_id': row[1],
                'name': row[2],
                'description': row[3],
                'article': row[4],
                'price': float(row[5]) if row[5] else 0,
                'stock_quantity': row[6],
                'category_id': row[7],
                'image_url': row[8],
                'unit': row[9],
                'barcode': row[10],
                'category_name': row[11]
            })
        
        # Получение общего количества
        cur.execute(f"""
            SELECT COUNT(*) 
            FROM {schema}.products p
            WHERE {where_sql}
        """, params)
        
        total = cur.fetchone()[0]
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'products': products,
                'total': total,
                'limit': limit,
                'offset': offset
            })
        }
    
    except Exception as e:
        if conn:
            conn.close()
        return error_response(f'Ошибка получения товаров: {str(e)}')


def error_response(message: str, status: int = 400) -> dict:
    """Вернуть ошибку"""
    return {
        'statusCode': status,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': message})
    }
