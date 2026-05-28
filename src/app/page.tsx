import { Metadata } from 'next';
import Link from 'next/link';
import {
  FileText,
  MessageCircleQuestion,
  RefreshCcw,
  Search,
  MessageCircle,
  Link as LinkIcon,
  TrendingUp,
  Check,
  ArrowRight
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'TiendaBase — Catálogo online para tu negocio',
  description: 'Creá tu catálogo online autogestionable gratis y en 5 minutos. Compartilo por WhatsApp, aparecé en Google y aumentá tus ventas sin pagar comisiones.',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Hero Section */}
      <section className="px-4 py-20 md:py-32 flex flex-col items-center text-center bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Tu catálogo online,<br className="hidden md:block" /> listo en 5 minutos
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Compartilo por WhatsApp, aparecé en Google y dejá de responder las mismas preguntas.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/admin/register"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Crear mi catálogo gratis <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/almacen-deco"
              className="w-full sm:w-auto px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full font-semibold text-lg transition-all flex items-center justify-center"
            >
              Ver demo
            </Link>
          </div>
        </div>
      </section>

      {/* El Problema */}
      <section className="px-4 py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-2">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">¿Mandás PDFs pesados por WhatsApp?</h3>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-2">
                <MessageCircleQuestion className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">¿Tus clientes te preguntan lo mismo 30 veces?</h3>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-2">
                <RefreshCcw className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">¿Tu catálogo vive desactualizado?</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Características Clave (Features) */}
      <section className="px-4 py-24 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Todo lo que necesitás para vender más, más fácil
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="flex gap-6 p-6 md:p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="shrink-0 w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <Search className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Catálogo con buscador interactivo</h3>
                <p className="text-gray-600 leading-relaxed">Tus clientes encuentran rápido lo que buscan sin marearse. Chau a las listas interminables.</p>
              </div>
            </div>
            <div className="flex gap-6 p-6 md:p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="shrink-0 w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Botón de WhatsApp directo por producto</h3>
                <p className="text-gray-600 leading-relaxed">Recibí mensajes con el producto exacto que les interesa. Cero confusiones.</p>
              </div>
            </div>
            <div className="flex gap-6 p-6 md:p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="shrink-0 w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                <LinkIcon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Link único compartible + QR</h3>
                <p className="text-gray-600 leading-relaxed">Un solo link para tu biografía de Instagram o para enviar a tus contactos.</p>
              </div>
            </div>
            <div className="flex gap-6 p-6 md:p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="shrink-0 w-14 h-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Posicionamiento SEO en Google</h3>
                <p className="text-gray-600 leading-relaxed">Aparecé cuando la gente busca tus productos en tu ciudad. Atraé clientes nuevos gratis.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planes y Precios */}
      <section className="px-4 py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Planes simples y transparentes</h2>
            <p className="mt-4 text-xl text-gray-500">Empezá gratis. Pasate a Pro cuando quieras aparecer en Google.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {/* Gratis */}
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-200 shadow-sm flex flex-col">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Plan Gratis</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl md:text-5xl font-extrabold text-gray-900">$0</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-gray-600">
                  <Check className="w-6 h-6 text-green-500 shrink-0" />
                  <span>Productos y categorías ilimitados</span>
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <Check className="w-6 h-6 text-green-500 shrink-0" />
                  <span>Buscador y modal de detalles</span>
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <Check className="w-6 h-6 text-green-500 shrink-0" />
                  <span>Botón de WhatsApp directo</span>
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <Check className="w-6 h-6 text-green-500 shrink-0" />
                  <span>Panel autogestionable (PWA)</span>
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <Check className="w-6 h-6 text-green-500 shrink-0" />
                  <span>Link compartible del catálogo</span>
                </li>
              </ul>
              <Link
                href="/admin/register"
                className="w-full py-4 px-6 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-2xl font-semibold text-center transition-colors mt-auto"
              >
                Empezar gratis
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-gray-900 p-8 md:p-10 rounded-3xl border border-gray-800 shadow-xl flex flex-col relative transform md:-translate-y-4 md:scale-105 z-10">
              <div className="absolute top-0 right-8 -translate-y-1/2">
                <span className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase">
                  Recomendado
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Plan Pro</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl md:text-5xl font-extrabold text-white">ARG $17.000</span>
                <span className="text-gray-400 font-medium">/mes</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-gray-300">
                  <Check className="w-6 h-6 text-blue-400 shrink-0" />
                  <span className="text-white font-medium">Todo lo del plan Gratis</span>
                </li>
                <li className="flex items-start gap-3 text-gray-300">
                  <Check className="w-6 h-6 text-blue-400 shrink-0" />
                  <span>Dominio propio (.com.ar)</span>
                </li>
                <li className="flex items-start gap-3 text-gray-300">
                  <Check className="w-6 h-6 text-blue-400 shrink-0" />
                  <span>Filtros avanzados de precios</span>
                </li>
                <li className="flex items-start gap-3 text-gray-300">
                  <Check className="w-6 h-6 text-blue-400 shrink-0" />
                  <span>URLs individuales por producto (SEO en Google)</span>
                </li>
              </ul>
              <a
                href="https://wa.me/5493454190771?text=Hola%2C%20quiero%20activar%20el%20plan%20Pro%20de%20TiendaBase"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-semibold text-center transition-colors mt-auto block"
              >
                Subir de nivel
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="px-4 py-24 bg-blue-600 text-white text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-extrabold">¿Listo para vender mejor?</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Configurás tu catálogo hoy, tus clientes te compran más fácil mañana.
          </p>
          <div className="pt-4">
            <Link
              href="/admin/register"
              className="inline-block w-full sm:w-auto px-10 py-5 bg-white text-blue-600 hover:bg-gray-50 rounded-full font-bold text-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Empezá hoy, gratis
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
