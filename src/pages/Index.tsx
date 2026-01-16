import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
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

  const products: Product[] = [
    {
      id: 1,
      name: 'Cuban Robusto Reserve',
      category: 'Сигары',
      price: 8500,
      origin: 'Куба',
      image: 'https://cdn.poehali.dev/projects/87b8c9c8-4511-4de7-9fa0-4e5a617fd150/files/61d37ee3-7e58-48d3-a38f-32bcd2081a3c.jpg',
      description: 'Премиальная сигара с богатым вкусом и длительным послевкусием'
    },
    {
      id: 2,
      name: 'Davidoff Churchill',
      category: 'Сигары',
      price: 12000,
      origin: 'Доминикана',
      image: 'https://cdn.poehali.dev/projects/87b8c9c8-4511-4de7-9fa0-4e5a617fd150/files/61d37ee3-7e58-48d3-a38f-32bcd2081a3c.jpg',
      description: 'Элегантная сигара с утонченным ароматом'
    },
    {
      id: 3,
      name: 'Peterson Pipe Collection',
      category: 'Трубки',
      price: 15000,
      origin: 'Ирландия',
      image: 'https://cdn.poehali.dev/projects/87b8c9c8-4511-4de7-9fa0-4e5a617fd150/files/793eb1fd-19d3-47c9-ac31-ed1aec9ecbf0.jpg',
      description: 'Коллекционная трубка ручной работы'
    },
    {
      id: 4,
      name: 'English Mixture Premium',
      category: 'Табак',
      price: 3500,
      origin: 'Англия',
      image: 'https://cdn.poehali.dev/projects/87b8c9c8-4511-4de7-9fa0-4e5a617fd150/files/b5416b2c-12ef-44f9-8d1d-e41ff2013504.jpg',
      description: 'Классическая английская смесь табака'
    },
    {
      id: 5,
      name: 'Virginia Gold Leaf',
      category: 'Табак',
      price: 4200,
      origin: 'США',
      image: 'https://cdn.poehali.dev/projects/87b8c9c8-4511-4de7-9fa0-4e5a617fd150/files/b5416b2c-12ef-44f9-8d1d-e41ff2013504.jpg',
      description: 'Натуральная вирджиния высшего качества'
    },
    {
      id: 6,
      name: 'Chacom Pipe Elegant',
      category: 'Трубки',
      price: 9500,
      origin: 'Франция',
      image: 'https://cdn.poehali.dev/projects/87b8c9c8-4511-4de7-9fa0-4e5a617fd150/files/793eb1fd-19d3-47c9-ac31-ed1aec9ecbf0.jpg',
      description: 'Французское качество и стиль'
    }
  ];

  const categories = ['Все', 'Сигары', 'Трубки', 'Табак', 'Аксессуары'];

  const filteredProducts = selectedCategory === 'Все' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
    } else {
      setCart(prev => prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Flame" className="text-accent" size={32} />
              <h1 className="text-3xl font-bold text-gradient">CartelAntitobacco</h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#catalog" className="text-muted-foreground hover:text-accent transition-colors">Каталог</a>
              <a href="#about" className="text-muted-foreground hover:text-accent transition-colors">О нас</a>
              <a href="#reviews" className="text-muted-foreground hover:text-accent transition-colors">Отзывы</a>
              <a href="#contact" className="text-muted-foreground hover:text-accent transition-colors">Контакты</a>
            </nav>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  {cart.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle className="text-2xl">Корзина</SheetTitle>
                </SheetHeader>
                
                <div className="mt-8 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Корзина пуста</p>
                  ) : (
                    <>
                      {cart.map(item => (
                        <Card key={item.id} className="p-4">
                          <div className="flex gap-4">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold">{item.name}</h4>
                              <p className="text-sm text-muted-foreground">{item.price.toLocaleString('ru-RU')} ₽</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button 
                                  size="icon" 
                                  variant="outline" 
                                  className="h-7 w-7"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <Icon name="Minus" size={14} />
                                </Button>
                                <span className="text-sm w-8 text-center">{item.quantity}</span>
                                <Button 
                                  size="icon" 
                                  variant="outline" 
                                  className="h-7 w-7"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
                      ))}
                      
                      <Separator className="my-6" />
                      
                      <div className="space-y-4">
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Итого:</span>
                          <span className="text-accent">{totalPrice.toLocaleString('ru-RU')} ₽</span>
                        </div>
                        <Button className="w-full" size="lg">
                          Оформить заказ
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 luxury-gradient opacity-50"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h2 className="text-6xl md:text-7xl font-bold mb-6 text-gradient">
              Искусство табачной культуры
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Эксклюзивная коллекция премиальных сигар, табаков и аксессуаров для истинных ценителей
            </p>
            <Button size="lg" className="text-lg px-8 hover-scale">
              <Icon name="Sparkles" size={20} className="mr-2" />
              Перейти к каталогу
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="catalog" className="py-16 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center mb-12">
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

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <Card 
                key={product.id} 
                className="overflow-hidden group hover:shadow-2xl transition-all duration-300 animate-scale-in"
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
                  <h3 className="text-2xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-muted-foreground mb-4 text-sm">{product.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-accent">
                      {product.price.toLocaleString('ru-RU')} ₽
                    </span>
                    <Button onClick={() => addToCart(product)} className="hover-scale">
                      <Icon name="ShoppingCart" size={18} className="mr-2" />
                      В корзину
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Section */}
      <section id="about" className="py-24 luxury-gradient">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Icon name="Award" size={48} className="text-accent mx-auto mb-6" />
            <h2 className="text-5xl font-bold mb-8">Экспертиза и качество</h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              Более 20 лет мы отбираем лучшие табачные изделия со всего мира. 
              Каждая позиция в нашем каталоге прошла строгий отбор и соответствует 
              высочайшим стандартам качества.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <Card className="p-8 text-center hover-scale">
                <Icon name="Shield" size={40} className="text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Гарантия качества</h3>
                <p className="text-muted-foreground">100% оригинальная продукция</p>
              </Card>
              
              <Card className="p-8 text-center hover-scale">
                <Icon name="Truck" size={40} className="text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Доставка</h3>
                <p className="text-muted-foreground">По всей России за 1-3 дня</p>
              </Card>
              
              <Card className="p-8 text-center hover-scale">
                <Icon name="HeadphonesIcon" size={40} className="text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Поддержка 24/7</h3>
                <p className="text-muted-foreground">Консультации экспертов</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-24 bg-card/30">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-16">Отзывы клиентов</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Александр М.',
                text: 'Восхитительная коллекция кубинских сигар! Качество обслуживания на высоте.',
                rating: 5
              },
              {
                name: 'Дмитрий К.',
                text: 'Наконец нашёл место, где можно купить настоящие премиальные трубки. Рекомендую!',
                rating: 5
              },
              {
                name: 'Сергей В.',
                text: 'Отличный выбор табаков, быстрая доставка. Буду заказывать ещё.',
                rating: 5
              }
            ].map((review, idx) => (
              <Card key={idx} className="p-6 hover-scale">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Icon key={i} name="Star" size={18} className="text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{review.text}"</p>
                <p className="font-semibold">{review.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-card py-16 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Flame" className="text-accent" size={28} />
                <h3 className="text-xl font-bold">CartelAntitobacco</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Премиальные табачные изделия для ценителей
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Каталог</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-colors">Сигары</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Трубки</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Табак</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Аксессуары</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Информация</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-colors">О компании</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Доставка</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Оплата</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Гарантии</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  <span>+7 (495) 123-45-67</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  <span>info@cartel.ru</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="MapPin" size={16} />
                  <span>Москва, ул. Примерная, 1</span>
                </li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-8" />
          
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 CartelAntitobacco. Все права защищены.</p>
            <p className="mt-2">Продажа табачных изделий лицам до 18 лет запрещена</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
