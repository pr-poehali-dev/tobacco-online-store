import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    """API для получения категорий товаров"""
    
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
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    try:
        cur.execute(f"""
            SELECT c.id, c.moysklad_id, c.name, c.parent_id, COUNT(p.id) as products_count
            FROM {schema}.categories c
            LEFT JOIN {schema}.products p ON c.id = p.category_id AND p.is_active = TRUE
            GROUP BY c.id, c.moysklad_id, c.name, c.parent_id
            ORDER BY c.name
        """)
        
        categories = []
        for row in cur.fetchall():
            categories.append({
                'id': row[0],
                'moysklad_id': row[1],
                'name': row[2],
                'parent_id': row[3],
                'products_count': row[4]
            })
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'categories': categories
            })
        }
    
    except Exception as e:
        if conn:
            conn.close()
        return error_response(f'Ошибка получения категорий: {str(e)}')


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
