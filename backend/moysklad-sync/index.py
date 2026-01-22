import json
import os
import requests
import psycopg2
from typing import Dict, List, Any

def handler(event: dict, context) -> dict:
    """Синхронизация товаров и категорий с МойСклад"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    token = os.environ.get('MOYSKLAD_TOKEN')
    db_url = os.environ.get('DATABASE_URL')
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    
    if not token:
        return error_response('MOYSKLAD_TOKEN не настроен')
    
    if not db_url:
        return error_response('DATABASE_URL не настроен')
    
    if method == 'POST':
        return sync_products(token, db_url, schema)
    elif method == 'GET':
        return get_sync_status(db_url, schema)
    
    return error_response('Метод не поддерживается', 405)


def sync_products(token: str, db_url: str, schema: str) -> dict:
    """Синхронизация всех товаров из МойСклад"""
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Accept-Encoding': 'gzip'
    }
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    try:
        # Синхронизация категорий
        categories_url = 'https://api.moysklad.ru/api/remap/1.2/entity/productfolder'
        categories_response = requests.get(categories_url, headers=headers)
        
        if categories_response.status_code != 200:
            return error_response(f'Ошибка API МойСклад: {categories_response.status_code}')
        
        categories_data = categories_response.json()
        categories_synced = 0
        
        for category in categories_data.get('rows', []):
            cat_id = category['id']
            cat_name = category['name']
            
            cur.execute(f"""
                INSERT INTO {schema}.categories (moysklad_id, name, updated_at)
                VALUES (%s, %s, NOW())
                ON CONFLICT (moysklad_id) 
                DO UPDATE SET name = EXCLUDED.name, updated_at = NOW()
            """, (cat_id, cat_name))
            categories_synced += 1
        
        conn.commit()
        
        # Синхронизация товаров с расширением stock для получения остатков
        products_url = 'https://api.moysklad.ru/api/remap/1.2/entity/product'
        params = {
            'limit': 100,
            'offset': 0,
            'expand': 'stock'
        }
        
        products_synced = 0
        
        while True:
            products_response = requests.get(products_url, headers=headers, params=params)
            
            if products_response.status_code != 200:
                return error_response(f'Ошибка загрузки товаров: {products_response.status_code}')
            
            products_data = products_response.json()
            rows = products_data.get('rows', [])
            
            if not rows:
                break
            
            for product in rows:
                prod_id = product['id']
                prod_name = product['name']
                prod_desc = product.get('description', '')
                prod_article = product.get('article', '')
                
                # Цена продажи
                sale_prices = product.get('salePrices', [])
                price = 0
                if sale_prices and len(sale_prices) > 0:
                    price = sale_prices[0].get('value', 0) / 100
                
                # Остаток - используем поле stock из expand
                stock = product.get('stock', 0)
                
                # Если stock не пришел через expand, пробуем quantity
                if stock == 0:
                    stock = product.get('quantity', 0)
                
                # Логируем для отладки
                print(f"Product: {prod_name}, stock field: {product.get('stock')}, quantity field: {product.get('quantity')}, final stock: {stock}")
                
                # Категория
                category_meta = product.get('productFolder')
                category_id = None
                if category_meta:
                    cat_moysklad_id = category_meta['meta']['href'].split('/')[-1]
                    cur.execute(f"""
                        SELECT id FROM {schema}.categories WHERE moysklad_id = %s
                    """, (cat_moysklad_id,))
                    cat_result = cur.fetchone()
                    if cat_result:
                        category_id = cat_result[0]
                
                # Изображение
                image_url = None
                images = product.get('images')
                if images:
                    images_meta = images.get('meta', {})
                    if images_meta.get('size', 0) > 0:
                        image_href = images_meta['href']
                        images_response = requests.get(image_href, headers=headers)
                        if images_response.status_code == 200:
                            images_data = images_response.json()
                            if images_data.get('rows'):
                                image_url = images_data['rows'][0].get('miniature', {}).get('href')
                
                # Единица измерения
                unit = product.get('uom', {}).get('name', 'шт')
                
                # Штрихкод
                barcodes = product.get('barcodes', [])
                barcode = barcodes[0].get('ean13', '') if barcodes else ''
                
                cur.execute(f"""
                    INSERT INTO {schema}.products 
                    (moysklad_id, name, description, article, price, stock_quantity, 
                     category_id, image_url, unit, barcode, updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
                    ON CONFLICT (moysklad_id) 
                    DO UPDATE SET 
                        name = EXCLUDED.name,
                        description = EXCLUDED.description,
                        article = EXCLUDED.article,
                        price = EXCLUDED.price,
                        stock_quantity = EXCLUDED.stock_quantity,
                        category_id = EXCLUDED.category_id,
                        image_url = EXCLUDED.image_url,
                        unit = EXCLUDED.unit,
                        barcode = EXCLUDED.barcode,
                        updated_at = NOW()
                """, (prod_id, prod_name, prod_desc, prod_article, price, stock, 
                      category_id, image_url, unit, barcode))
                
                products_synced += 1
            
            conn.commit()
            
            # Следующая страница
            params['offset'] += params['limit']
            
            if params['offset'] >= products_data.get('meta', {}).get('size', 0):
                break
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'categories_synced': categories_synced,
                'products_synced': products_synced,
                'message': 'Синхронизация завершена успешно'
            })
        }
    
    except Exception as e:
        if conn:
            conn.rollback()
            conn.close()
        return error_response(f'Ошибка синхронизации: {str(e)}')


def get_sync_status(db_url: str, schema: str) -> dict:
    """Получить статус синхронизации"""
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    try:
        cur.execute(f"SELECT COUNT(*) FROM {schema}.categories")
        categories_count = cur.fetchone()[0]
        
        cur.execute(f"SELECT COUNT(*) FROM {schema}.products")
        products_count = cur.fetchone()[0]
        
        cur.execute(f"""
            SELECT MAX(updated_at) FROM {schema}.products
        """)
        last_sync = cur.fetchone()[0]
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'categories': categories_count,
                'products': products_count,
                'last_sync': last_sync.isoformat() if last_sync else None
            })
        }
    
    except Exception as e:
        if conn:
            conn.close()
        return error_response(f'Ошибка получения статуса: {str(e)}')


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