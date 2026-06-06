import Link from 'next/link';
import { ArrowRight, CheckCircle2, Link as LinkIcon, Smartphone, Wallet } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="font-bold text-xl text-green-600 flex items-center gap-2">
          <Wallet className="w-6 h-6" />
          PayLink.kz
        </div>
        <Link 
          href="/login"
          className="text-sm font-medium bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors"
        >
          Войти
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-12 md:py-24 text-center max-w-4xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
          Удобный прием оплат для вашего микро-бизнеса
        </h1>
        <p className="text-lg text-slate-600 mb-10 max-w-2xl">
          Создавайте ссылки на оплату за пару кликов и отправляйте их клиентам в WhatsApp. 
          Идеально для репетиторов, мастеров красоты, клининга и фрилансеров в Казахстане.
        </p>

        <Link 
          href="/login"
          className="bg-green-600 text-white text-lg font-semibold px-8 py-4 rounded-full hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 mb-16"
        >
          Начать бесплатно <ArrowRight className="w-5 h-5" />
        </Link>

        <div className="grid md:grid-cols-3 gap-8 w-full">
          <div className="bg-white p-6 rounded-2xl shadow-sm border text-left">
            <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <LinkIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-slate-900">Простые ссылки</h3>
            <p className="text-slate-600 text-sm">
              Генерируйте уникальные ссылки на оплату с указанной суммой и описанием услуги.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border text-left">
            <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-slate-900">Отправка в WhatsApp</h3>
            <p className="text-slate-600 text-sm">
              В один клик отправляйте ссылку клиенту. Ему останется только перейти и перевести деньги.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border text-left">
            <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-slate-900">Учет оплат</h3>
            <p className="text-slate-600 text-sm">
              Клиент нажимает &quot;Я оплатил&quot; на странице, и вы сразу видите статус в своем личном кабинете.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t py-8 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} PayLink.kz. Все права защищены.</p>
        <p className="mt-2 text-xs">MVP Версия</p>
      </footer>
    </div>
  );
}
