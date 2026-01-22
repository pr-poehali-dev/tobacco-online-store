import { useState } from 'react';
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

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  image: string;
  origin: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedBrand, setSelectedBrand] = useState('Все бренды');
  const [productQuantities, setProductQuantities] = useState<Record<number, number>>({});
  const [orderData, setOrderData] = useState({
    phone: '',
    telegram: '',
    address: ''
  });
  const { toast } = useToast();

  const products: Product[] = [
    {
      id: 1,
      name: 'Ice Cool',
      brand: 'Nordic Spirit',
      category: 'Никотиновые подушки',
      price: 450,
      origin: 'Швеция',
      image: 'https://cdn.poehali.dev/projects/87b8c9c8-4511-4de7-9fa0-4e5a617fd150/files/ad30f289-d370-45f5-84f6-06cc94f24bdd.jpg',
      description: 'Освежающий мятный вкус, долгое действие'
    },
    {
      id: 2,
      name: 'Freeze Max',
      brand: 'Velo',
      category: 'Никотиновые подушки',
      price: 420,
      origin: 'Дания',
      image: 'https://cdn.poehali.dev/projects/87b8c9c8-4511-4de7-9fa0-4e5a617fd150/files/ad30f289-d370-45f5-84f6-06cc94f24bdd.jpg',
      description: 'Интенсивный холодок и мощный эффект'
    },
    {
      id: 3,
      name: 'Double Mint',
      brand: 'White Fox',
      category: 'Никотиновые подушки',
      price: 480,
      origin: 'Швеция',
      image: 'https://cdn.poehali.dev/projects/87b8c9c8-4511-4de7-9fa0-4e5a617fd150/files/ad30f289-d370-45f5-84f6-06cc94f24bdd.jpg',
      description: 'Двойная мята для истинных ценителей'
    },
    {
      id: 4,
      name: 'Arctic Blue',
      brand: 'Zyn',
      category: 'Никотиновые подушки',
      price: 460,
      origin: 'Швеция',
      image: 'https://cdn.poehali.dev/projects/87b8c9c8-4511-4de7-9fa0-4e5a617fd150/files/ad30f289-d370-45f5-84f6-06cc94f24bdd.jpg',
      description: 'Арктическая свежесть и чистота вкуса'
    },
    {
      id: 5,
      name: 'Premium Cut',
      brand: 'Copenhagen',
      category: 'Жевательный табак',
      price: 890,
      origin: 'США',
      image: 'https://cdn.poehali.dev/projects/87b8c9c8-4511-4de7-9fa0-4e5a617fd150/files/7f945e9b-fe2c-499d-b669-931c3aa27368.jpg',
      description: 'Классический американский вкус премиум-класса'
    },
    {
      id: 6,
      name: 'Dark Wintergreen',
      brand: 'Grizzly',
      category: 'Жевательный табак',
      price: 850,
      origin: 'США',
      image: 'https://cdn.poehali.dev/projects/87b8c9c8-4511-4de7-9fa0-4e5a617fd150/files/7f945e9b-fe2c-499d-b669-931c3aa27368.jpg',
      description: 'Насыщенный табак с нотками зимней свежести'
    },
    {
      id: 7,
      name: 'Classic',
      brand: 'Skoal',
      category: 'Жевательный табак',
      price: 920,
      origin: 'США',
      image: 'https://cdn.poehali.dev/projects/87b8c9c8-4511-4de7-9fa0-4e5a617fd150/files/7f945e9b-fe2c-499d-b669-931c3aa27368.jpg',
      description: 'Традиционный рецепт с богатым вкусом'
    },
    {
      id: 8,
      name: 'Long Cut Straight',
      brand: 'Red Seal',
      category: 'Жевательный табак',
      price: 880,
      origin: 'США',
      image: 'https://cdn.poehali.dev/projects/87b8c9c8-4511-4de7-9fa0-4e5a617fd150/files/7f945e9b-fe2c-499d-b669-931c3aa27368.jpg',
      description: 'Прямая нарезка, аутентичный вкус'
    },
    {
      id: 9,
      name: 'Fresh Mint',
      brand: 'NicStrip',
      category: 'Никотиновые пластинки',
      price: 350,
      origin: 'Германия',
      image: 'https://cdn.poehali.dev/projects/87b8c9c8-4511-4de7-9fa0-4e5a617fd150/files/5e479550-ff54-4712-b949-5a035487ab4c.jpg',
      description: 'Мгновенный эффект, свежий мятный вкус'
    },
    {
      id: 10,
      name: 'Strong',
      brand: 'FreshStrips',
      category: 'Никотиновые пластинки',
      price: 380,
      origin: 'Швейцария',
      image: 'https://cdn.poehali.dev/projects/87b8c9c8-4511-4de7-9fa0-4e5a617fd150/files/5e479550-ff54-4712-b949-5a035487ab4c.jpg',
      description: 'Усиленная формула для максимального эффекта'
    },
    {
      id: 11,
      name: 'Original',
      brand: 'QuickNic',
      category: 'Никотиновые пластинки',
      price: 330,
      origin: 'Нидерланды',
      image: 'https://cdn.poehali.dev/projects/87b8c9c8-4511-4de7-9fa0-4e5a617fd150/files/5e479550-ff54-4712-b949-5a035487ab4c.jpg',
      description: 'Оригинальный вкус без лишних добавок'
    },
    {
      id: 12,
      name: 'Citrus Blast',
      brand: 'On!',
      category: 'Никотиновые пластинки',
      price: 360,
      origin: 'США',
      image: 'https://cdn.poehali.dev/projects/87b8c9c8-4511-4de7-9fa0-4e5a617fd150/files/5e479550-ff54-4712-b949-5a035487ab4c.jpg',
      description: 'Цитрусовый взрыв вкуса и энергии'
    }
  ];

  const categories = ['Все', 'Никотиновые подушки', 'Жевательный табак', 'Никотиновые пластинки'];
  
  const allBrands = ['Все бренды', ...Array.from(new Set(products.map(p => p.brand)))];

  const filteredProducts = products.filter(p => {
    const categoryMatch = selectedCategory === 'Все' || p.category === selectedCategory;
    const brandMatch = selectedBrand === 'Все бренды' || p.brand === selectedBrand;
    return categoryMatch && brandMatch;
  });

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
      description: `${product.brand} ${product.name} - ${quantity} шт.`,
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

    toast({
      title: "Заказ оформлен! ✅",
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
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold">{item.brand} {item.name}</h4>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm text-muted-foreground">
                                    {discountedPrice.toLocaleString('ru-RU')} ₽
                                  </p>
                                  {itemDiscount > 0 && (
                                    <Badge variant="default" className="bg-green-600 text-xs">
                                      -{(itemDiscount * 100).toFixed(0)}%
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  <Button 
                                    size="icon" 
                                    variant="outline" 
                                    className="h-7 w-7"
                                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                  >
                                    <Icon name="Minus" size={14} />
                                  </Button>
                                  <span className="text-sm w-8 text-center">{item.quantity}</span>
                                  <Button 
                                    size="icon" 
                                    variant="outline" 
                                    className="h-7 w-7"
                                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                  >
                                    <Icon name="Plus" size={14} />
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-7 w-7 ml-auto"
                                    onClick={() => removeFromCart(item.id)}
                                  >
                                    <Icon name="Trash2" size={14} />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                      
                      <Separator className="my-6" />
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="phone">Телефон *</Label>
                          <Input 
                            id="phone" 
                            type="tel"
                            placeholder="+7 (___) ___-__-__"
                            value={orderData.phone}
                            onChange={(e) => setOrderData({...orderData, phone: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="telegram">Telegram *</Label>
                          <Input 
                            id="telegram" 
                            placeholder="@username"
                            value={orderData.telegram}
                            onChange={(e) => setOrderData({...orderData, telegram: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="address">Адрес доставки *</Label>
                          <Textarea 
                            id="address" 
                            placeholder="Город, улица, дом, квартира"
                            value={orderData.address}
                            onChange={(e) => setOrderData({...orderData, address: e.target.value})}
                            className="mt-1 min-h-20"
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2 bg-accent/5 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground text-center mb-2">
                          💰 Скидки: 3+ шт. = -5% | 5+ шт. = -10% | 10+ шт. = -15%
                        </div>
                        {totalDiscount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Скидка:</span>
                            <span className="text-green-600 font-semibold">-{totalDiscount.toLocaleString('ru-RU')} ₽</span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Итого:</span>
                          <span className="text-accent">{totalPrice.toLocaleString('ru-RU')} ₽</span>
                        </div>
                      </div>
                      
                      <Button className="w-full" size="lg" onClick={handleCheckout}>
                        <Icon name="Check" size={20} className="mr-2" />
                        Оформить заказ
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 luxury-gradient opacity-50"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h2 className="text-6xl md:text-7xl font-bold mb-6 text-gradient">
              Премиум никотиновые продукты
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Никотиновые подушки, жевательный табак и пластинки высшего качества
            </p>
            <Button size="lg" className="text-lg px-8 hover-scale" onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}>
              <Icon name="Sparkles" size={20} className="mr-2" />
              Перейти к каталогу
            </Button>
          </div>
        </div>
      </section>

      <section id="catalog" className="py-16 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <h3 className="text-center text-lg font-semibold mb-3 text-muted-foreground">Категории</h3>
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat)}
                  className="hover-scale"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="mb-12">
            <h3 className="text-center text-lg font-semibold mb-3 text-muted-foreground">Бренды</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {allBrands.map(brand => (
                <Button
                  key={brand}
                  variant={selectedBrand === brand ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedBrand(brand)}
                  className="hover-scale"
                >
                  {brand}
                </Button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {filteredProducts.map((product, index) => (
                <Card 
                  key={product.id} 
                  className="flex-shrink-0 w-[340px] overflow-hidden group hover:shadow-2xl transition-all duration-300 animate-scale-in snap-start"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                      {product.origin}
                    </Badge>
                  </div>
                  
                  <div className="p-6">
                    <Badge variant="outline" className="mb-3">{product.category}</Badge>
                    <h3 className="text-xl font-semibold mb-1">{product.brand}</h3>
                    <h4 className="text-lg text-muted-foreground mb-2">{product.name}</h4>
                    <p className="text-muted-foreground mb-4 text-sm">{product.description}</p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="h-8 w-8"
                        onClick={() => updateProductQuantity(product.id, -1)}
                      >
                        <Icon name="Minus" size={16} />
                      </Button>
                      <span className="text-lg font-semibold w-12 text-center">
                        {getProductQuantity(product.id)}
                      </span>
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="h-8 w-8"
                        onClick={() => updateProductQuantity(product.id, 1)}
                      >
                        <Icon name="Plus" size={16} />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {calculateDiscount(getProductQuantity(product.id)) > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground line-through">
                            {(product.price * getProductQuantity(product.id)).toLocaleString('ru-RU')} ₽
                          </span>
                          <Badge variant="default" className="bg-green-600">
                            -{(calculateDiscount(getProductQuantity(product.id)) * 100).toFixed(0)}%
                          </Badge>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-accent">
                            {(getDiscountedPrice(product.price, getProductQuantity(product.id)) * getProductQuantity(product.id)).toLocaleString('ru-RU')} ₽
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {getDiscountedPrice(product.price, getProductQuantity(product.id)).toLocaleString('ru-RU')} ₽ за шт.
                          </div>
                        </div>
                        <Button onClick={() => addToCart(product)} className="hover-scale">
                          <Icon name="ShoppingCart" size={18} className="mr-2" />
                          В корзину
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="brands" className="py-24 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Премиальные бренды</h2>
            <p className="text-xl text-muted-foreground">Работаем только с проверенными производителями</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              'Nordic Spirit', 'Velo', 'White Fox', 'Zyn',
              'Copenhagen', 'Grizzly', 'Skoal', 'Red Seal',
              'NicStrip', 'FreshStrips', 'QuickNic', 'On!'
            ].map((brand, idx) => (
              <Card key={idx} className="p-6 text-center hover-scale cursor-pointer group">
                <div className="mb-3">
                  <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Icon name="Sparkles" size={32} className="text-accent" />
                  </div>
                </div>
                <h3 className="font-semibold">{brand}</h3>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-24 luxury-gradient">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Icon name="Award" size={48} className="text-accent mx-auto mb-6" />
            <h2 className="text-5xl font-bold mb-8">Экспертиза и качество</h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              Специализируемся на премиальных никотиновых продуктах нового поколения. 
              Каждая позиция — оригинальная продукция от ведущих мировых производителей.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <Card className="p-8 text-center hover-scale">
                <Icon name="Shield" size={40} className="text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Гарантия качества</h3>
                <p className="text-muted-foreground">100% оригинальная продукция</p>
              </Card>
              
              <Card className="p-8 text-center hover-scale">
                <Icon name="Truck" size={40} className="text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Быстрая доставка</h3>
                <p className="text-muted-foreground">По всей России за 1-3 дня</p>
              </Card>
              
              <Card className="p-8 text-center hover-scale">
                <Icon name="MessageCircle" size={40} className="text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Поддержка 24/7</h3>
                <p className="text-muted-foreground">Консультации в Telegram</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-card py-16 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center gap-2 justify-center mb-4">
              <Icon name="Flame" className="text-accent" size={28} />
              <h3 className="text-xl font-bold">CartelAntitobacco</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Премиум никотиновые продукты высшего качества
            </p>
            <p className="text-sm text-muted-foreground">
              © 2024 CartelAntitobacco. Все права защищены.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Продажа табачных изделий лицам до 18 лет запрещена
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;