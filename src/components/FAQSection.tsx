import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';

export default function FAQSection() {
  const faqs = [
    {
      question: 'Кто может получить займ?',
      answer: 'Займ могут получить граждане РФ в возрасте от 18 до 45 лет с действующим паспортом и мобильным телефоном. Не требуется справка о доходах или поручители.',
    },
    {
      question: 'Как быстро я получу деньги?',
      answer: 'После одобрения заявки деньги поступают на вашу карту в течение 5-15 минут. Одобрение заявки происходит автоматически и занимает до 5 минут.',
    },
    {
      question: 'Какие документы нужны?',
      answer: 'Для оформления займа потребуется только паспорт гражданина РФ, действующий номер мобильного телефона и банковская карта для получения средств.',
    },
    {
      question: 'Могу ли я досрочно погасить займ?',
      answer: 'Да, вы можете погасить займ досрочно в любой момент без штрафов и комиссий. Проценты будут пересчитаны за фактическое количество дней пользования займом.',
    },
    {
      question: 'Что делать, если не могу вовремя вернуть деньги?',
      answer: 'Свяжитесь с нами до окончания срока займа. Мы можем предложить продление срока или реструктуризацию платежа. Важно не допускать просрочек.',
    },
    {
      question: 'Есть ли скрытые платежи?',
      answer: 'Нет, все платежи прозрачны. Вы платите только 0.3% в день от суммы займа. Никаких дополнительных комиссий, страховок или скрытых платежей.',
    },
    {
      question: 'Можно ли взять второй займ?',
      answer: 'Да, после успешного погашения первого займа вы можете оформить повторный займ на более выгодных условиях с увеличенным лимитом до 100 000 рублей.',
    },
    {
      question: 'Как происходит проверка заявки?',
      answer: 'Проверка происходит автоматически через системы безопасности. Мы проверяем данные паспорта, кредитную историю и платежеспособность без звонков и визитов.',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Вопросы и ответы
            </span>
          </h2>
          <p className="text-xl text-foreground/70">
            Ответы на самые частые вопросы о наших займах
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-2 border-border rounded-2xl px-6 hover:border-primary/50 transition-all animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <AccordionTrigger className="text-lg font-semibold hover:text-primary text-left py-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Icon name="HelpCircle" size={20} className="text-white" />
                    </div>
                    <span>{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-base text-foreground/70 pl-12 pr-4 pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 text-center">
            <Icon name="MessageCircle" size={48} className="text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Не нашли ответ?</h3>
            <p className="text-foreground/70 mb-6">
              Свяжитесь с нами, и мы с радостью ответим на все ваши вопросы
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:88001234567" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-xl hover:opacity-90 transition-opacity font-medium">
                <Icon name="Phone" size={20} className="mr-2" />
                8 (800) 123-45-67
              </a>
              <a href="mailto:support@labubu.finance" className="inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-primary text-primary rounded-xl hover:bg-primary/5 transition-colors font-medium">
                <Icon name="Mail" size={20} className="mr-2" />
                support@labubu.finance
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
