import Icon from '@/components/ui/icon';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    company: [
      { label: 'О компании', href: '#' },
      { label: 'Контакты', href: '#' },
      { label: 'Вакансии', href: '#' },
    ],
    services: [
      { label: 'Условия займа', href: '#' },
      { label: 'Калькулятор', href: '#' },
      { label: 'Личный кабинет', href: '#' },
    ],
    legal: [
      { label: 'Политика конфиденциальности', href: '#' },
      { label: 'Пользовательское соглашение', href: '#' },
      { label: 'Согласие на обработку данных', href: '#' },
    ],
  };

  return (
    <footer className="bg-gradient-to-br from-foreground to-foreground/90 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <span className="text-2xl font-bold">Лабубу Финанс</span>
            </div>
            <p className="text-white/70 mb-4">
              Микрофинансовая организация. Быстрые займы онлайн для граждан РФ.
            </p>
            <div className="flex space-x-3">
              {['Facebook', 'Twitter', 'Instagram'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon name={social as any} size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Компания</h3>
            <ul className="space-y-2">
              {links.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/70 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Услуги</h3>
            <ul className="space-y-2">
              {links.services.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/70 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Icon name="Phone" size={18} className="text-primary" />
                <a href="tel:88001234567" className="text-white/70 hover:text-white transition-colors">
                  8 (800) 123-45-67
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Icon name="Mail" size={18} className="text-primary" />
                <a href="mailto:support@labubu.finance" className="text-white/70 hover:text-white transition-colors">
                  support@labubu.finance
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <Icon name="MapPin" size={18} className="text-primary flex-shrink-0 mt-1" />
                <span className="text-white/70">
                  Москва, ул. Примерная, д. 123
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8">
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {links.legal.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <p className="text-xs text-white/60 leading-relaxed">
              ООО МФК "Лабубу Финанс". Регистрационный номер в Реестре МФО: 1234567890123. 
              Юридический адрес: 123456, г. Москва, ул. Примерная, д. 123. 
              Процентная ставка: 0,3% в день (109,5% годовых). Предоставление займов осуществляется в соответствии с ФЗ-151 "О микрофинансовой деятельности и микрофинансовых организациях".
            </p>
          </div>

          <div className="text-center text-white/60 text-sm">
            © {currentYear} Лабубу Финанс. Все права защищены.
          </div>
        </div>
      </div>
    </footer>
  );
}
