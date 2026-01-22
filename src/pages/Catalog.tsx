import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';

const FUNCTIONS_API = {
  products: 'https://functions.poehali.dev/4a0fff15-2ece-44a9-ac3e-24395f30cecf',
  categories: 'https://functions.poehali.dev/a7dcbfa3-eba8-419f-aba0-781be745c05f',
  sync: 'https://functions.poehali.dev/97940e34-d561-47af-aa9f-1f36c40570f8'
};

interface Product {
  id: number;
  moysklad_id: string;
  name: string;
  description: string;
  article: string;
  price: number;
  stock_quantity: number;
  category_id: number;
  image_url: string;
  unit: string;
  barcode: string;
  category_name: string;
}

interface Category {
  id: number;
  moysklad_id: string;
  name: string;
  parent_id: number;
  products_count: number;
}

const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchQuery]);

  const loadCategories = async () => {
    try {
      const response = await fetch(FUNCTIONS_API.categories);
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      let url = FUNCTIONS_API.products;
      const params = new URLSearchParams();
      
      if (selectedCategory) {
        params.append('category_id', selectedCategory.toString());
      }
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      if (params.toString()) {
        url += '?' + params.toString();
      }

      const response = await fetch(url);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncProducts = async () => {
    setSyncing(true);
    try {
      const response = await fetch(FUNCTIONS_API.sync, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Синхронизация завершена",
          description: `Загружено категорий: ${data.categories_synced}, товаров: ${data.products_synced}`,
        });
        loadCategories();
        loadProducts();
      } else {
        throw new Error(data.error || 'Ошибка синхронизации');
      }
    } catch (error) {
      toast({
        title: "Ошибка синхронизации",
        description: error instanceof Error ? error.message : 'Попробуйте позже',
        variant: "destructive"
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">Каталог товаров</h1>
            <Button 
              onClick={syncProducts} 
              disabled={syncing}
              className="gap-2"
            >
              <Icon name={syncing ? "Loader2" : "RefreshCw"} className={syncing ? "animate-spin" : ""} size={16} />
              {syncing ? 'Синхронизация...' : 'Синхронизировать'}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 space-y-4">
          <Input
            type="search"
            placeholder="Поиск по названию, артикулу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(null)}
            >
              Все товары
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name} ({category.products_count})
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="w-full h-48 mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-10 w-full" />
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <Icon name="Package" size={64} className="mx-auto mb-4 text-slate-300" />
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">Товары не найдены</h2>
            <p className="text-slate-500 mb-6">
              {searchQuery || selectedCategory 
                ? 'Попробуйте изменить параметры поиска' 
                : 'Нажмите "Синхронизировать" для загрузки товаров из МойСклад'}
            </p>
            {!searchQuery && !selectedCategory && (
              <Button onClick={syncProducts} disabled={syncing}>
                <Icon name="RefreshCw" size={16} className="mr-2" />
                Синхронизировать склад
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {product.image_url && (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="mb-2">
                    {product.category_name && (
                      <Badge variant="secondary" className="mb-2">
                        {product.category_name}
                      </Badge>
                    )}
                    {product.article && (
                      <Badge variant="outline" className="ml-2">
                        {product.article}
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  {product.description && (
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-slate-900">
                      {product.price.toFixed(2)} ₽
                    </span>
                    <div className="text-sm text-slate-500">
                      <Icon name="Package" size={14} className="inline mr-1" />
                      {product.stock_quantity} {product.unit}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    disabled={product.stock_quantity === 0}
                  >
                    {product.stock_quantity > 0 ? (
                      <>
                        <Icon name="ShoppingCart" size={16} className="mr-2" />
                        В корзину
                      </>
                    ) : (
                      'Нет в наличии'
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
