import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function TermsSection() {
  const conditions = [
    {
      icon: 'DollarSign',
      title: 'Сумма займа',
      description: 'От 5 000 до 100 000 рублей',
      details: 'Выберите сумму, которая вам нужна. Первый займ до 30 000 рублей.',
    },
    {
      icon: 'Calendar',
      title: 'Срок займа',
      description: 'От 7 до 30 дней',
      details: 'Гибкий график погашения. Возможность продления срока.',
    },
    {
      icon: 'Percent',
      title: 'Процентная ставка',
      description: '0.3% в день',
      details: 'Прозрачная ставка без скрытых комиссий и платежей.',
    },
    {
      icon: 'UserCheck',
      title: 'Требования',
      description: 'Граждане РФ 18-45 лет',
      details: 'Паспорт РФ и действующий номер телефона.',
    },
    {
      icon: 'Clock',
      title: 'Время одобрения',
      description: 'До 5 минут',
      details: 'Автоматическое решение по заявке без звонков.',
    },
    {
      icon: 'Smartphone',
      title: 'Получение денег',
      description: 'Мгновенно на карту',
      details: 'Перевод на карту любого банка круглосуточно.',
    },
  ];

  const documents = [
    'Паспорт гражданина РФ',
    'Номер мобильного телефона',
    'Банковская карта для получения',
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Условия займа
            </span>
          </h2>
          <p className="text-xl text-foreground/70">
            Прозрачные условия без скрытых платежей и сюрпризов
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {conditions.map((item, index) => (
            <Card 
              key={index} 
              className="border-2 hover:border-primary/50 transition-all hover:shadow-xl animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-4">
                  <Icon name={item.icon as any} size={28} className="text-white" />
                </div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <CardDescription className="text-lg font-semibold text-foreground">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">{item.details}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-2xl mx-auto border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Icon name="FileCheck" size={28} className="mr-3 text-primary" />
              Необходимые документы
            </CardTitle>
            <CardDescription>Минимум документов для быстрого оформления</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {documents.map((doc, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="Check" size={16} className="text-primary" />
                  </div>
                  <span className="text-lg">{doc}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
