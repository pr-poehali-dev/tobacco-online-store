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
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderData, setOrderData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    comment: ''
  });
  const { toast } = useToast();

  const products: Product[] = [
    {
      id: 1,
      name: 'Nordic Spirit Premium',
      category: 'Никотиновые подушки',
      price: 450,
      origin: 'Швеция',
      image: 'https://cdn.poehali.dev/projects/87b8c9c8-4511-4de7-9fa0-4e5a617fd150/files/493544bb-985b-4c8d-b118-9f8fa38d9998.jpg',
      description: 'Премиальные никотиновые подушечки с освежающим мятным вкусом'
    },
    {
      id: 2,
      name: 'Velo Ice Cool',
      category: 'Никотиновые подушки',
      price: 420,
      origin: 'Дания',
      image: 'https://cdn.poehali.dev/projects/87b8c9c8-4511-4de7-9fa0-4e5a617fd150/files/493544bb-985b-4c8d-b118-9f8fa38d9998.jpg',
      description: 'Интенсивный холодок и долгое действие'
    },
    {
      id: 3,
      name: 'White Fox Double Mint',
      category: 'Никотиновые подушки',
      price: 480,
      origin: 'Швеция',
      image: 'https://cdn.poehali.dev/projects/87b8c9c8-4511-4de7-9fa0-4e5a617fd150/files/493544bb-985b-4c8d-b118-9f8fa38d9998.jpg',
      description: 'Двойная мята для истинных ценителей'
    },
    {
      id: 4,
      name: 'Copenhagen Premium Cut',
      category: 'Жевательный табак',
      price: 890,
      origin: 'США',
      image: 'https://cdn.poehali.dev/projects/87b8c9c8-4511-4de7-9fa0-4e5a617fd150/files/e2dae898-25a5-4167-98f8-4f1ee4841071.jpg',
      description: 'Классический американский жевательный табак премиум качества'
    },
    {
      id: 5,
      name: 'Grizzly Dark Wintergreen',
      category: 'Жевательный табак',
      price: 850,
      origin: 'США',
      image: 'https://cdn.poehali.dev/projects/87b8c9c8-4511-4de7-9fa0-4e5a617fd150/files/e2dae898-25a5-4167-98f8-4f1ee4841071.jpg',
      description: 'Насыщенный вкус с нотками зимней свежести'
    },
    {
      id: 6,
      name: 'Skoal Classic',
      category: 'Жевательный табак',
      price: 920,
      origin: 'США',
      image: 'https://cdn.poehali.dev/projects/87b8c9c8-4511-4de7-9fa0-4e5a617fd150/files/e2dae898-25a5-4167-98f8-4f1ee4841071.jpg',
      description: 'Традиционный рецепт с богатым табачным вкусом'
    },
    {
      id: 7,
      name: 'NicStrip Mint',
      category: 'Никотиновые пластинки',
      price: 350,
      origin: 'Германия',
      image: 'https://cdn.poehali.dev/projects/87b8c9c8-4511-4de7-9fa0-4e5a617fd150/files/0f71a1e6-7660-4b7b-93df-5323349155a6.jpg',
      description: 'Инновационные пластинки с мгновенным эффектом'
    },
    {
      id: 8,
      name: 'FreshStrips Strong',
      category: 'Никотиновые пластинки',
      price: 380,
      origin: 'Швейцария',
      image: 'https://cdn.poehali.dev/projects/87b8c9c8-4511-4de7-9fa0-4e5a617fd150/files/0f71a1e6-7660-4b7b-93df-5323349155a6.jpg',
      description: 'Усиленная формула для максимального эффекта'
    },
    {
      id: 9,
      name: 'QuickNic Original',
      category: 'Никотиновые пластинки',
      price: 330,
      origin: 'Нидерланды',
      image: 'https://cdn.poehali.dev/projects/87b8c9c8-4511-4de7-9fa0-4e5a617fd150/files/0f71a1e6-7660-4b7b-93df-5323349155a6.jpg',
      description: 'Оригинальный вкус без лишних добавок'
    }
  ];

  const categories = ['Все', 'Никотиновые подушки', 'Жевательный табак', 'Никотиновые пластинки'];

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
              <a href="#brands" className="text-muted-foreground hover:text-accent transition-colors">Бренды</a>
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
                      
                      {!showCheckout ? (
                        <div className="space-y-4">
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Итого:</span>
                            <span className="text-accent">{totalPrice.toLocaleString('ru-RU')} ₽</span>
                          </div>
                          <Button className="w-full" size="lg" onClick={() => setShowCheckout(true)}>
                            Оформить заказ
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4 animate-fade-in">
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start" 
                            onClick={() => setShowCheckout(false)}
                          >
                            <Icon name="ArrowLeft" size={18} className="mr-2" />
                            Вернуться к корзине
                          </Button>
                          
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="name" className="text-foreground">Имя *</Label>
                              <Input 
                                id="name" 
                                placeholder="Введите ваше имя"
                                value={orderData.name}
                                onChange={(e) => setOrderData({...orderData, name: e.target.value})}
                                className="mt-1"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="phone" className="text-foreground">Телефон *</Label>
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
                              <Label htmlFor="email" className="text-foreground">Email *</Label>
                              <Input 
                                id="email" 
                                type="email"
                                placeholder="example@email.com"
                                value={orderData.email}
                                onChange={(e) => setOrderData({...orderData, email: e.target.value})}
                                className="mt-1"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="address" className="text-foreground">Адрес доставки *</Label>
                              <Textarea 
                                id="address" 
                                placeholder="Город, улица, дом, квартира"
                                value={orderData.address}
                                onChange={(e) => setOrderData({...orderData, address: e.target.value})}
                                className="mt-1 min-h-20"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="comment" className="text-foreground">Комментарий к заказу</Label>
                              <Textarea 
                                id="comment" 
                                placeholder="Дополнительная информация"
                                value={orderData.comment}
                                onChange={(e) => setOrderData({...orderData, comment: e.target.value})}
                                className="mt-1 min-h-20"
                              />
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-4">
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Товары ({cart.length}):</span>
                                <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Доставка:</span>
                                <span className="text-accent">Бесплатно</span>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div className="flex justify-between text-lg font-semibold">
                              <span>Итого:</span>
                              <span className="text-accent">{totalPrice.toLocaleString('ru-RU')} ₽</span>
                            </div>
                            
                            <Button 
                              className="w-full" 
                              size="lg"
                              onClick={() => {
                                if (!orderData.name || !orderData.phone || !orderData.email || !orderData.address) {
                                  toast({
                                    title: "Заполните обязательные поля",
                                    description: "Пожалуйста, укажите имя, телефон, email и адрес доставки",
                                    variant: "destructive"
                                  });
                                  return;
                                }
                                
                                toast({
                                  title: "Заказ оформлен!",
                                  description: "Мы свяжемся с вами в ближайшее время для подтверждения",
                                });
                                
                                setCart([]);
                                setShowCheckout(false);
                                setOrderData({ name: '', phone: '', email: '', address: '', comment: '' });
                              }}
                            >
                              <Icon name="Check" size={20} className="mr-2" />
                              Подтвердить заказ
                            </Button>
                          </div>
                        </div>
                      )}
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
              Премиум никотиновые продукты
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Никотиновые подушки, жевательный табак и пластинки высшего качества
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

      {/* Brands Section */}
      <section id="brands" className="py-24 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Премиальные бренды</h2>
            <p className="text-xl text-muted-foreground">Работаем только с проверенными производителями</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: 'Nordic Spirit', country: 'Швеция' },
              { name: 'Velo', country: 'Дания' },
              { name: 'White Fox', country: 'Швеция' },
              { name: 'Copenhagen', country: 'США' },
              { name: 'Grizzly', country: 'США' },
              { name: 'Skoal', country: 'США' },
              { name: 'NicStrip', country: 'Германия' },
              { name: 'FreshStrips', country: 'Швейцария' },
              { name: 'QuickNic', country: 'Нидерланды' },
              { name: 'Zyn', country: 'Швеция' },
              { name: 'On!', country: 'США' },
              { name: 'Lyft', country: 'Швеция' }
            ].map((brand, idx) => (
              <Card key={idx} className="p-6 text-center hover-scale cursor-pointer group">
                <div className="mb-3">
                  <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Icon name="Sparkles" size={32} className="text-accent" />
                  </div>
                </div>
                <h3 className="font-semibold mb-1">{brand.name}</h3>
                <p className="text-xs text-muted-foreground">{brand.country}</p>
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
              Мы специализируемся на премиальных никотиновых продуктах нового поколения. 
              Каждая позиция в нашем каталоге — оригинальная продукция от ведущих мировых производителей.
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
                text: 'Отличные никотиновые подушки! Чистый вкус и быстрый эффект.',
                rating: 5
              },
              {
                name: 'Дмитрий К.',
                text: 'Перешёл на никотиновые пластинки — очень удобно и незаметно!',
                rating: 5
              },
              {
                name: 'Сергей В.',
                text: 'Большой выбор жевательного табака. Доставка быстрая!',
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
                Премиум никотиновые продукты высшего качества
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Каталог</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-colors">Никотиновые подушки</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Жевательный табак</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Никотиновые пластинки</a></li>
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