-- Таблица категорий товаров из МойСклад
CREATE TABLE IF NOT EXISTS t_p77034440_tobacco_online_store.categories (
    id SERIAL PRIMARY KEY,
    moysklad_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(500) NOT NULL,
    parent_id INTEGER REFERENCES t_p77034440_tobacco_online_store.categories(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Таблица товаров из МойСклад
CREATE TABLE IF NOT EXISTS t_p77034440_tobacco_online_store.products (
    id SERIAL PRIMARY KEY,
    moysklad_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(1000) NOT NULL,
    description TEXT,
    article VARCHAR(255),
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    category_id INTEGER REFERENCES t_p77034440_tobacco_online_store.categories(id),
    image_url TEXT,
    unit VARCHAR(50),
    barcode VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Индексы для быстрого поиска
CREATE INDEX idx_products_category ON t_p77034440_tobacco_online_store.products(category_id);
CREATE INDEX idx_products_active ON t_p77034440_tobacco_online_store.products(is_active);
CREATE INDEX idx_products_moysklad ON t_p77034440_tobacco_online_store.products(moysklad_id);
CREATE INDEX idx_categories_moysklad ON t_p77034440_tobacco_online_store.categories(moysklad_id);