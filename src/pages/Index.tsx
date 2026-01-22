import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

interface CartItem extends Product {
  quantity: number;
}

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [productQuantities, setProductQuantities] = useState<Record<number, number>>({});
  const [orderData, setOrderData] = useState({
    phone: '',
    telegram: '',
    address: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const initializeData = async () => {
      const lastSync = localStorage.getItem('lastSync');
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;

      if (!lastSync || now - parseInt(lastSync) > oneHour) {
        await syncProducts();
        localStorage.setItem('lastSync', now.toString());
      }
      
      loadCategories();
      loadProducts();
    };

    initializeData();
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
    try {
      const response = await fetch(FUNCTIONS_API.sync, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Ошибка синхронизации');
      }
    } catch (error) {
      console.error('Ошибка синхронизации:', error);
    }
  };

  const calculateDiscount = (quantity: number) => {
    if (quantity >= 10) return 0.15;
    if (quantity >= 5) return 0.10;
    if (quantity >= 3) return 0.05;
    return 0;
  };

  const getDiscountedPrice = (price: number, quantity: number) => {
    const discount = calculateDiscount(quantity);
    return price * (1 - discount);
  };

  const getProductQuantity = (productId: number) => {
    return productQuantities[productId] || 1;
  };

  const updateProductQuantity = (productId: number, delta: number) => {
    setProductQuantities(prev => {
      const current = prev[productId] || 1;
      const newValue = Math.max(1, current + delta);
      return { ...prev, [productId]: newValue };
    });
  };

  const addToCart = (product: Product) => {
    const quantity = getProductQuantity(product.id);
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    
    toast({
      title: "Добавлено в корзину",
      description: `${product.name} - ${quantity} шт.`,
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
    } else {
      setCart(prev => prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = cart.reduce((sum, item) => {
    const discountedPrice = getDiscountedPrice(item.price, item.quantity);
    return sum + (discountedPrice * item.quantity);
  }, 0);
  
  const totalDiscount = cart.reduce((sum, item) => {
    const discount = calculateDiscount(item.quantity);
    return sum + (item.price * item.quantity * discount);
  }, 0);

  const handleCheckout = () => {
    if (!orderData.phone || !orderData.telegram || !orderData.address) {
      toast({
        title: "Заполните все поля",
        description: "Укажите телефон, Telegram и адрес доставки",
        variant: "destructive"
      });
      return;
    }

    const orderText = `
🛒 НОВЫЙ ЗАКАЗ

📦 Товары:
${cart.map(item => {
  const discount = calculateDiscount(item.quantity);
  const discountedPrice = getDiscountedPrice(item.price, item.quantity);
  return `• ${item.name} (${item.article || 'б/н'})
  Количество: ${item.quantity} ${item.unit}
  Цена: ${item.price.toFixed(2)} ₽${discount > 0 ? ` (скидка ${(discount * 100).toFixed(0)}%)` : ''}
  Итого: ${(discountedPrice * item.quantity).toFixed(2)} ₽`;
}).join('\n\n')}

💰 Сумма заказа: ${totalPrice.toFixed(2)} ₽
${totalDiscount > 0 ? `💸 Скидка: ${totalDiscount.toFixed(2)} ₽` : ''}

📞 Контакты:
Телефон: ${orderData.phone}
Telegram: ${orderData.telegram}

📍 Адрес доставки:
${orderData.address}
    `.trim();

    const encodedText = encodeURIComponent(orderText);
    window.open(`https://t.me/share/url?url=${encodedText}`, '_blank');
    
    toast({
      title: "Заказ оформлен!",
      description: "Мы свяжемся с вами в ближайшее время",
    });

    setCart([]);
    setOrderData({ phone: '', telegram: '', address: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Flame" className="text-accent" size={32} />
              <h1 className="text-3xl font-bold text-gradient">CartelAntitobacco</h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="/catalog" className="text-muted-foreground hover:text-accent transition-colors">МойСклад</a>
              <a href="#catalog" className="text-muted-foreground hover:text-accent transition-colors">Каталог</a>
              <a href="#brands" className="text-muted-foreground hover:text-accent transition-colors">Бренды</a>
              <a href="#about" className="text-muted-foreground hover:text-accent transition-colors">О нас</a>
            </nav>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-2xl">Корзина</SheetTitle>
                </SheetHeader>
                
                <div className="mt-8 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Корзина пуста</p>
                  ) : (
                    <>
                      {cart.map(item => {
                        const itemDiscount = calculateDiscount(item.quantity);
                        const discountedPrice = getDiscountedPrice(item.price, item.quantity);
                        return (
                          <Card key={item.id} className="p-4">
                            <div className="flex gap-4">
                              {item.image_url && (
                                <img 
                                  src={item.image_url} 
                                  alt={item.name}
                                  className="w-20 h-20 object-cover rounded-lg"
                                />
                              )}
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h3 className="font-semibold">{item.name}</h3>
                                    {item.article && (
                                      <p className="text-sm text-muted-foreground">{item.article}</p>
                                    )}
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => removeFromCart(item.id)}
                                  >
                                    <Icon name="Trash2" size={16} />
                                  </Button>
                                </div>
                                
                                {itemDiscount > 0 && (
                                  <Badge variant="secondary" className="mb-2">
                                    Скидка {(itemDiscount * 100).toFixed(0)}%
                                  </Badge>
                                )}
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="icon"
                                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                    >
                                      <Icon name="Minus" size={16} />
                                    </Button>
                                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                                    <Button 
                                      variant="outline" 
                                      size="icon"
                                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                    >
                                      <Icon name="Plus" size={16} />
                                    </Button>
                                  </div>
                                  <div className="text-right">
                                    {itemDiscount > 0 && (
                                      <div className="text-sm text-muted-foreground line-through">
                                        {(item.price * item.quantity).toFixed(2)} ₽
                                      </div>
                                    )}
                                    <div className="font-bold">
                                      {(discountedPrice * item.quantity).toFixed(2)} ₽
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        );
                      })}

                      <Separator className="my-6" />

                      <div className="space-y-2">
                        {totalDiscount > 0 && (
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Скидка:</span>
                            <span className="text-green-600 font-medium">-{totalDiscount.toFixed(2)} ₽</span>
                          </div>
                        )}
                        <div className="flex justify-between text-xl font-bold">
                          <span>Итого:</span>
                          <span>{totalPrice.toFixed(2)} ₽</span>
                        </div>
                      </div>

                      <div className="bg-muted/50 p-4 rounded-lg space-y-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Icon name="Gift" size={16} />
                          <span>Система скидок:</span>
                        </div>
                        <div className="space-y-1 text-muted-foreground">
                          <div>• 3-4 шт. — скидка 5%</div>
                          <div>• 5-9 шт. — скидка 10%</div>
                          <div>• 10+ шт. — скидка 15%</div>
                        </div>
                      </div>

                      <Separator className="my-6" />

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="phone">Телефон *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+7 (999) 123-45-67"
                            value={orderData.phone}
                            onChange={(e) => setOrderData(prev => ({ ...prev, phone: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="telegram">Telegram *</Label>
                          <Input
                            id="telegram"
                            type="text"
                            placeholder="@username"
                            value={orderData.telegram}
                            onChange={(e) => setOrderData(prev => ({ ...prev, telegram: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="address">Адрес доставки *</Label>
                          <Textarea
                            id="address"
                            placeholder="Улица, дом, квартира"
                            value={orderData.address}
                            onChange={(e) => setOrderData(prev => ({ ...prev, address: e.target.value }))}
                            rows={3}
                          />
                        </div>
                      </div>

                      <Button 
                        onClick={handleCheckout} 
                        className="w-full" 
                        size="lg"
                      >
                        Оформить заказ через Telegram
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <section className="py-20 px-6 text-center bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-4xl">
          <Badge className="mb-4" variant="secondary">
            <Icon name="TrendingDown" size={14} className="mr-1" />
            Свобода выбора
          </Badge>
          <h2 className="text-5xl font-bold mb-6 text-gradient leading-tight">
            Альтернативы традиционному табаку
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Качественная продукция из Европы и США. Быстрая доставка по городу. Система накопительных скидок.
          </p>
          <Button size="lg" className="gap-2" onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}>
            <Icon name="Package" size={20} />
            Смотреть каталог
          </Button>
        </div>
      </section>

      <section id="catalog" className="py-16 px-6 bg-muted/20">
        <div className="container mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">Каталог товаров</h2>
            
            <div className="mb-6">
              <Input
                type="search"
                placeholder="Поиск по названию, артикулу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
            </div>

            <div className="flex flex-wrap gap-3">
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
                  <Skeleton className="w-full h-64 mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </Card>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <Icon name="Package" size={64} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-2xl font-semibold mb-2">Товары не найдены</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || selectedCategory 
                  ? 'Попробуйте изменить параметры поиска' 
                  : 'Перейдите в раздел "МойСклад" для синхронизации товаров'}
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/catalog'}>
                <Icon name="RefreshCw" size={16} className="mr-2" />
                Перейти к синхронизации
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const quantity = getProductQuantity(product.id);
                const discount = calculateDiscount(quantity);
                const discountedPrice = getDiscountedPrice(product.price, quantity);

                return (
                  <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all group">
                    {product.image_url && (
                      <div className="relative overflow-hidden">
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.stock_quantity > 0 ? (
                          <Badge className="absolute top-3 right-3 bg-green-500">
                            В наличии
                          </Badge>
                        ) : (
                          <Badge className="absolute top-3 right-3 bg-red-500">
                            Нет в наличии
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="p-5">
                      <div className="mb-3">
                        {product.category_name && (
                          <Badge variant="secondary">
                            {product.category_name}
                          </Badge>
                        )}
                        {product.article && (
                          <Badge variant="outline" className="ml-2">
                            {product.article}
                          </Badge>
                        )}
                      </div>

                      <h3 className="font-bold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
                        {product.name}
                      </h3>

                      {product.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      <div className="space-y-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold">{discountedPrice.toFixed(2)} ₽</span>
                          {discount > 0 && (
                            <>
                              <span className="text-sm text-muted-foreground line-through">
                                {product.price.toFixed(2)} ₽
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                -{(discount * 100).toFixed(0)}%
                              </Badge>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Icon name="Package" size={14} />
                          <span>{product.stock_quantity} {product.unit}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center border rounded-lg">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => updateProductQuantity(product.id, -1)}
                              disabled={quantity <= 1}
                            >
                              <Icon name="Minus" size={16} />
                            </Button>
                            <span className="w-12 text-center font-medium">{quantity}</span>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => updateProductQuantity(product.id, 1)}
                            >
                              <Icon name="Plus" size={16} />
                            </Button>
                          </div>
                          <Button 
                            onClick={() => addToCart(product)} 
                            className="flex-1 gap-2"
                            disabled={product.stock_quantity === 0}
                          >
                            <Icon name="ShoppingCart" size={16} />
                            В корзину
                          </Button>
                        </div>

                        {discount > 0 && (
                          <p className="text-xs text-green-600 font-medium">
                            Скидка {(discount * 100).toFixed(0)}% применена
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section id="brands" className="py-16 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Популярные бренды</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.slice(0, 6).map((category) => (
              <Card key={category.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {
                setSelectedCategory(category.id);
                document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                <h3 className="font-semibold text-lg">{category.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{category.products_count} товаров</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-16 px-6 bg-muted/20">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">О нас</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Мы предлагаем альтернативные продукты высокого качества из Европы и США. 
              Наша миссия — предоставить взрослым людям свободу выбора и доступ к современным решениям.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <Icon name="Shield" className="mx-auto mb-3 text-accent" size={40} />
                <h3 className="font-semibold mb-2">Качество</h3>
                <p className="text-sm text-muted-foreground">Только оригинальная продукция от проверенных производителей</p>
              </div>
              <div>
                <Icon name="Truck" className="mx-auto mb-3 text-accent" size={40} />
                <h3 className="font-semibold mb-2">Доставка</h3>
                <p className="text-sm text-muted-foreground">Быстрая доставка по городу в течение 1-2 дней</p>
              </div>
              <div>
                <Icon name="Gift" className="mx-auto mb-3 text-accent" size={40} />
                <h3 className="font-semibold mb-2">Скидки</h3>
                <p className="text-sm text-muted-foreground">Система накопительных скидок до 15% при оптовых заказах</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 px-6">
        <div className="container mx-auto text-center text-muted-foreground">
          <p className="mb-2">© 2024 CartelAntitobacco. Все права защищены.</p>
          <p className="text-sm">Продукция предназначена для лиц старше 18 лет.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;