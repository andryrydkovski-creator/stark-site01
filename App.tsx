/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as d3 from "d3";
import { 
  MessageCircle, 
  Users, 
  ChevronRight, 
  ShieldCheck, 
  Clock, 
  Activity,
  ArrowRight,
  Play,
  Stethoscope,
  Target,
  Zap,
  CheckCircle2,
  Info
} from "lucide-react";

const APP_URL = "https://ais-dev-vy4v6qikbszp3ecfkh4eel-127538245159.europe-west2.run.app";

const REVIEWS = [
  {
    text: "После сеанса: стало дышаться легче, выйдя на улицу кружилась немного голова. Сон стал крепче и продуктивнее, высыпаюсь даже если нужно встать раньше.",
    author: "Александр"
  },
  {
    text: "Привет легче конечно в разы думаю скоро пройдет... кисти и шею сделал и верхнюю часть спины вообще летаю. Спасибо большое",
    author: "Мария"
  },
  {
    text: "Мое Чудесное преображение благодаря специалисту! Старк сумел создать такую атмосферу, что весь мой внутренний дискомфорт просто растворился.",
    author: "Дмитрий"
  },
  {
    text: "Старк ты конечно фурия, я вообще не сообразила что произошло... за 2 минуты ввернул мне голову на место, я перестала пить таблетки.",
    author: "Елена"
  },
  {
    text: "Результат превзошел ожидания. Боли в пояснице, которые мучили годами, ушли после третьего сеанса. Огромная благодарность!",
    author: "Игорь"
  },
  {
    text: "Очень профессиональный подход. Все четко, по делу, без лишних слов. Позвоночник как новый.",
    author: "Светлана"
  },
  {
    text: "Долго искал специалиста, который действительно понимает биомеханику тела. Старк — мастер своего дела.",
    author: "Николай"
  },
  {
    text: "После правки атланта прошли головные боли, которые не снимались таблетками. Жизнь заиграла новыми красками.",
    author: "Ольга"
  }
];

const SERVICES = [
  {
    title: "Костоправская коррекция",
    description: "Восстановление анатомически правильного положения позвонков. Устранение функциональных блоков.",
    icon: <Target className="w-5 h-5" />,
    specs: ["Правка атланта", "Коррекция таза", "Снятие зажимов"]
  },
  {
    title: "Вакуумная терапия",
    description: "Глубокая декомпрессия мягких тканей с использованием вакуумных банок. Улучшение трофики мышц.",
    icon: <Zap className="w-5 h-5" />,
    specs: ["Лимфодренаж", "Детокс тканей", "Миофасциальный релиз"]
  },
  {
    title: "Висцеральная практика",
    description: "Мануальная терапия внутренних органов. Восстановление подвижности и кровоснабжения ЖКТ.",
    icon: <Activity className="w-5 h-5" />,
    specs: ["Работа с диафрагмой", "Снятие спазмов", "Улучшение метаболизма"]
  }
];

const DISEASES = [
  {
    id: "hernia",
    title: "Межпозвоночная грыжа",
    description: "Грыжа межпозвонкового диска — это выпячивание ядра диска через разрыв фиброзного кольца. Это одно из самых серьезных заболеваний позвоночника, часто приводящее к сдавливанию нервных корешков и спинномозгового канала.",
    symptoms: ["Острая «простреливающая» боль", "Онемение в ногах или руках", "Снижение мышечного тонуса", "Нарушение работы внутренних органов", "Потеря чувствительности"],
    approach: "Мануальная декомпрессия пораженного сегмента, снятие мышечного блока и восстановление питания диска без хирургического вмешательства."
  },
  {
    id: "protrusion",
    title: "Протрузия диска",
    description: "Протрузия — это начальная стадия грыжи, при которой диск выпячивается в позвоночный канал, но фиброзное кольцо еще цело. Это критический момент для начала лечения, чтобы избежать разрыва.",
    symptoms: ["Тянущие боли в пояснице или шее", "Периодические прострелы", "Чувство скованности по утрам", "Головные боли", "Головокружения"],
    approach: "Мягкая правка позвонков для снятия давления на диск, что позволяет ему вернуться в анатомические границы и начать процесс регенерации."
  },
  {
    id: "osteochondrosis",
    title: "Остеохондроз",
    description: "Комплексное поражение тканей позвоночника. Диски теряют влагу, становятся хрупкими, а расстояние между позвонками уменьшается, что ведет к защемлениям нервных окончаниях и сосудов.",
    symptoms: ["Постоянная ноющая боль", "Хруст при поворотах", "Ощущение тяжести в плечах", "Межреберная невралгия", "Онемение пальцев"],
    approach: "Восстановление подвижности суставов позвоночника, улучшение кровоснабжения через вакуумную терапию и висцеральный массаж."
  },
  {
    id: "scoliosis",
    title: "Сколиоз и Кифоз",
    description: "Стойкие искривления позвоночника, которые нарушают работу легких, сердца и органов ЖКТ. Часто являются причиной хронических болей во всем теле и деформации грудной клетки.",
    symptoms: ["Асимметрия плеч и лопаток", "Видимый перекос таза", "Быстрая утомляемость при ходьбе", "Нарушение дыхания", "Боли в области сердца"],
    approach: "Поэтапная коррекция геометрии скелета, работа с мышечным дисбалансом и восстановление правильной осанки через правку атланта и таза."
  },
  {
    id: "sciatica",
    title: "Ишиас и Люмбаго",
    description: "Защемление седалищного нерва или острая боль в пояснице («прострел»). Вызывает резкое ограничение подвижности и мучительные боли, отдающие в нижние конечности.",
    symptoms: ["Боль, отдающая в ягодицу и ногу", "Невозможность разогнуться", "Жжение по ходу нерва", "Слабость в стопе", "Судороги в икрах"],
    approach: "Срочное освобождение защемленного нерва через мануальную правку таза и снятие острого мышечного спазма."
  },
  {
    id: "schmorl",
    title: "Грыжа Шморля",
    description: "Вертикальное продавливание хрящевой ткани диска в тело соседнего позвонка. Часто протекает бессимптомно на ранних стадиях, но ведет к разрушению позвонка.",
    symptoms: ["Локальная усталость спины", "Болезненность при пальпации", "Снижение гибкости позвоночника", "Риск компрессионного перелома"],
    approach: "Улучшение трофики костной ткани и снятие осевой нагрузки на пораженный позвонок через коррекцию соседних сегментов."
  },
  {
    id: "radiculitis",
    title: "Радикулит",
    description: "Воспаление или защемление корешков спинномозговых нервов. Характеризуется внезапными приступами боли при резких движениях или нагрузках.",
    symptoms: ["Резкая боль при движении", "Ощущение «ползания мурашек»", "Снижение рефлексов", "Нарушение чувствительности кожи"],
    approach: "Мануальное устранение компрессии нервного корешка и восстановление проводимости нервных импульсов."
  },
  {
    id: "spondylolisthesis",
    title: "Спондилолистез",
    description: "Смещение (соскальзывание) одного позвонка относительно другого. Это ведет к сужению позвоночного канала и серьезным неврологическим нарушениям.",
    symptoms: ["Боли при разгибании спины", "Напряжение мышц задней поверхности бедра", "Изменение походки", "Слабость в ногах"],
    approach: "Мягкая стабилизирующая правка для возвращения позвонка в анатомически правильное положение и снятия натяжения связок."
  },
  {
    id: "neuralgia",
    title: "Межреберная невралгия",
    description: "Сдавливание или раздражение межреберных нервов. Часто имитирует боли в сердце или легких, вызывая панику у пациента.",
    symptoms: ["Боль при вдохе или кашле", "Точечная болезненность ребер", "Опоясывающая боль в груди", "Повышенное потоотделение"],
    approach: "Освобождение нерва через правку грудного отдела позвоночника и ребер, снятие спазма межреберных мышц."
  },
  {
    id: "dysplasia",
    title: "Дисплазия суставов",
    description: "Нарушение развития сустава, которое может привести к подвывиху или вывиху. Часто встречается в тазобедренных суставах, влияя на всю биомеханику ходьбы.",
    symptoms: ["Ограничение отведения бедра", "Разная длина ног", "Асимметрия кожных складок", "Боли при физической нагрузке"],
    approach: "Мягкая мануальная коррекция положения суставных поверхностей и работа с окружающими связками."
  },
  {
    id: "dorsopathy",
    title: "Дорсопатия",
    description: "Группа заболеваний костно-мышечной системы и соединительной ткани, основным признаком которых является боль в спине и конечностях невисцеральной этиологии.",
    symptoms: ["Хронические боли в спине", "Ограничение подвижности", "Мышечное напряжение", "Иррадиация боли в конечности"],
    approach: "Комплексное восстановление подвижности всех отделов позвоночника и снятие глубоких мышечных зажимов."
  },
  {
    id: "subluxation",
    title: "Подвывих позвонков",
    description: "Частичное смещение суставных поверхностей позвонков, приводящее к нарушению функции сегмента и раздражению нервных окончаний.",
    symptoms: ["Локальная острая боль", "Головокружение (при шейном подвывихе)", "Скованность движений", "Онемение"],
    approach: "Точечная правка для возвращения позвонка в его физиологическое ложе и восстановления нормальной иннервации."
  }
];

function SpineVisualization() {
  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-3xl p-6 border border-slate-200 shadow-xl overflow-hidden h-full min-h-[500px] relative group">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 to-transparent pointer-events-none" />
      <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-6 relative z-10">Анатомическая модель</div>
      <div className="relative flex-grow flex items-center justify-center w-full">
        <img 
          src={`${window.location.origin}/input_file_0.png`} 
          alt="Natural Spine Anatomy" 
          className="h-full max-h-[450px] w-auto object-contain transition-transform duration-1000 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="mt-6 text-center relative z-10">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Детальная визуализация <br /> костных структур
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [activeDisease, setActiveDisease] = useState(DISEASES[0]);
  return (
    <div className="min-h-screen bg-medical-bg selection:bg-medical-blue selection:text-white">
      {/* Header / Navigation */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-medical-line px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src={`${window.location.origin}/input_file_2.png`} 
              alt="STARK KOSTOPRAV" 
              className="w-12 h-12 object-contain"
              referrerPolicy="no-referrer"
            />
            <span className="font-bold tracking-tight text-lg uppercase mono font-display">STARK KOSTOPRAV</span>
          </div>
          <div className="hidden md:flex gap-10 text-[11px] uppercase tracking-widest font-bold text-slate-500">
            <a href="#about" className="hover:text-medical-blue transition-colors">О методе</a>
            <a href="#diseases" className="hover:text-medical-blue transition-colors">Болезни</a>
            <a href="#history" className="hover:text-medical-blue transition-colors">История</a>
            <a href="#services" className="hover:text-medical-blue transition-colors">Услуги</a>
            <a href="#reviews" className="hover:text-medical-blue transition-colors">Результаты</a>
          </div>
          <a 
            href="https://t.me/StarkLimitedMs" 
            className="bg-medical-blue text-white px-5 py-2.5 rounded text-[11px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all"
          >
            Запись на прием
          </a>
        </div>
      </header>

      {/* Hero Section - Authority/Clinical Focus */}
      <section className="relative pt-40 pb-24 px-6 grid-bg overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[11px] font-bold uppercase tracking-widest mb-8 border border-blue-100">
                <ShieldCheck className="w-4 h-4" /> Лицензированная практика
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-medical-blue tracking-tighter leading-[0.9] mb-10 font-display">
                СТАРК <br /> 
                <span className="text-blue-600">КОСТОПРАВ</span>
              </h1>
              <p className="text-slate-500 text-xl md:text-2xl max-w-2xl mb-12 leading-relaxed">
                Профессиональная помощь в лечении заболеваний позвоночника и суставов. Профессиональное костоправство и восстановление подвижности.
              </p>
              
              <div className="flex flex-wrap gap-6">
                <a 
                  href="https://t.me/StarkLimitedMs" 
                  className="bg-blue-600 text-white px-10 py-5 rounded-lg font-bold uppercase text-xs tracking-[0.2em] hover:bg-blue-700 hover:shadow-xl transition-all flex items-center gap-4"
                >
                  Записаться на консультацию <ArrowRight className="w-5 h-5" />
                </a>
                <div className="flex items-center gap-5 px-8 py-5 border border-slate-200 rounded-lg bg-white/50 backdrop-blur-sm">
                  <div className="text-3xl font-black text-medical-blue mono">5+</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-tight">
                    Лет успешной <br /> практики
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="lg:col-span-5 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-[4/5] rounded-3xl overflow-hidden border-8 border-white shadow-2xl bg-gradient-to-b from-slate-50 to-slate-200 group"
            >
              <img 
                src={`${window.location.origin}/input_file_1.png`} 
                alt="Старк - Костоправ" 
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-medical-blue/80 via-transparent to-transparent opacity-40" />
              <div className="absolute bottom-8 left-8 right-8 p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <div className="text-white font-black text-xl uppercase tracking-tighter mb-1">СТАРК</div>
                <div className="text-white/80 text-xs uppercase tracking-[0.2em] font-bold">Мастер мануальной коррекции</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Diseases of the Spine Section - Tabbed Interface */}
      <section id="diseases" className="py-24 px-6 bg-slate-50 border-y border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="text-blue-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Энциклопедия здоровья</div>
            <h2 className="text-4xl md:text-5xl font-black text-medical-blue uppercase tracking-tight font-display">Болезни позвоночника</h2>
            <p className="mt-6 text-slate-500 max-w-2xl mx-auto text-lg">
              Понимая причину боли, мы можем эффективно её устранить. Изучите основные патологии, с которыми я работаю ежедневно.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Tabs Navigation */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DISEASES.map((disease) => (
                <button
                  key={disease.id}
                  onClick={() => setActiveDisease(disease)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                    activeDisease.id === disease.id 
                    ? "bg-blue-600 border-blue-600 text-white shadow-xl" 
                    : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                  }`}
                >
                  <span className="font-bold uppercase tracking-tight text-sm md:text-base leading-tight">{disease.title}</span>
                  <ChevronRight className={`w-3 h-3 transition-transform ${activeDisease.id === disease.id ? "rotate-90" : "group-hover:translate-x-1"}`} />
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="lg:col-span-7 grid grid-cols-1 xl:grid-cols-12 gap-8">
              <div className="xl:col-span-7">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeDisease.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl relative overflow-hidden h-full"
                  >
                    <h3 className="text-xl md:text-2xl font-black text-medical-blue mb-6 uppercase tracking-tight font-display leading-tight">
                      {activeDisease.title}
                    </h3>
                    
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-8 pb-8 border-b border-slate-100">
                      {activeDisease.description}
                    </p>

                    <div className="space-y-10">
                      <div>
                        <div className="text-blue-600 font-black uppercase tracking-widest text-xs mb-5 flex items-center gap-3">
                          <Activity className="w-4 h-4" /> Основные симптомы
                        </div>
                        <ul className="grid grid-cols-1 gap-4">
                          {activeDisease.symptoms.map((symptom, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-800 font-bold text-sm uppercase tracking-tight">
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              {symptom}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-blue-600 font-black uppercase tracking-widest text-xs mb-5 flex items-center gap-3">
                          <ShieldCheck className="w-4 h-4" /> Метод коррекции
                        </div>
                        <p className="text-slate-700 text-sm md:text-base leading-relaxed font-medium bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                          {activeDisease.approach}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="xl:col-span-5">
                <SpineVisualization />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Precision Section */}
      <section className="py-12 border-y border-medical-line bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Опыт практики", value: "5+ Лет" },
            { label: "Методик работы", value: "12+" },
            { label: "Успешных правок", value: "1.2K+" },
            { label: "Поколение мастеров", value: "3-е" }
          ].map((stat, i) => (
            <div key={i} className="text-center md:text-left">
              <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">{stat.label}</div>
              <div className="text-2xl font-black text-medical-blue mono">{stat.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About / Method Section */}
      <section id="about" className="py-24 px-6 bg-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1">
              <div className="text-blue-600 font-black uppercase tracking-[0.4em] text-[10px] mb-6">О специалисте</div>
              <h2 className="text-4xl md:text-6xl font-black text-medical-blue mb-10 leading-tight tracking-tighter font-display">
                МАСТЕРСТВО В <br /> <span className="text-slate-300">ТРЕТЬЕМ ПОКОЛЕНИИ</span>
              </h2>
              <div className="space-y-8 text-slate-500 text-xl leading-relaxed">
                <p>
                  Я продолжаю семейную традицию костоправства, объединяя многолетний опыт предков с современными знаниями о биомеханике человека.
                </p>
                <p>
                  Моя цель — не просто убрать симптом, а восстановить естественную архитектуру вашего тела, чтобы боль больше не возвращалась.
                </p>
              </div>
              
              <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: "Точная диагностика", desc: "Выявление скрытых патологий" },
                  { title: "Мягкие техники", desc: "Безопасная коррекция" },
                  { title: "Быстрый результат", desc: "Облегчение после 1 сеанса" },
                  { title: "Гарантия качества", desc: "Профессиональный подход" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1">
                      <CheckCircle2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-black text-medical-blue uppercase text-sm tracking-tight">{item.title}</div>
                      <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="order-1 lg:order-2 relative">
               <div className="aspect-square rounded-3xl border-[32px] border-slate-50 overflow-hidden relative bg-white shadow-inner">
                  <img 
                    src={`${window.location.origin}/input_file_1.png`} 
                    alt="Anatomy" 
                    className="w-full h-full object-contain p-16 opacity-90"
                    referrerPolicy="no-referrer"
                  />
               </div>
               <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl rotate-12">
                  <div className="text-center">
                    <div className="text-5xl font-black">5+</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest mt-2">Лет опыта</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid - Clinical/Professional */}
      <section id="services" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <div className="text-blue-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Методы лечения</div>
              <h2 className="text-4xl md:text-5xl font-black text-medical-blue uppercase tracking-tight font-display">Эффективные методики коррекции</h2>
            </div>
            <div className="h-px flex-grow bg-slate-100 mb-4 hidden md:block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SERVICES.map((service, idx) => (
              <div key={idx} className="bg-slate-50 p-10 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-2xl hover:border-blue-200 transition-all group">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm mb-10 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-black text-medical-blue mb-6 uppercase tracking-tight font-display">{service.title}</h3>
                <p className="text-slate-500 text-base leading-relaxed mb-10">
                  {service.description}
                </p>
                <div className="space-y-4">
                  {service.specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History / Context Section */}
      <section id="history" className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
                <img 
                  src="https://picsum.photos/seed/history/800/800" 
                  alt="History of Bone Setting" 
                  className="w-full h-full object-cover grayscale opacity-80"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-slate-100 rounded-2xl -z-10" />
            </div>
            <div className="lg:col-span-7">
              <div className="text-blue-600 font-black uppercase tracking-[0.4em] text-[10px] mb-6">Наследие и традиции</div>
              <h2 className="text-4xl md:text-5xl font-black text-medical-blue mb-8 uppercase tracking-tighter leading-tight font-display">
                ИСТОРИЯ <br /> <span className="text-slate-300">КОСТОПРАВСТВА</span>
              </h2>
              <div className="space-y-6 text-slate-500 text-lg leading-relaxed">
                <p>
                  Костоправство — это древнейшее искусство исцеления, которое передавалось из поколения в поколение задолго до появления современной мануальной терапии. Это глубокое понимание механики человеческого тела, основанное на практике и интуиции.
                </p>
                <p>
                  В моей семье это мастерство живет уже три поколения. Я бережно храню старинные техники, дополняя их современными знаниями об анатомии и физиологии, чтобы обеспечить максимальную безопасность и эффективность каждой манипуляции.
                </p>
              </div>
              <div className="mt-10">
                <div className="inline-flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Более 30 лет семейного опыта в терапии</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video / Practice Section */}
      <section className="py-24 px-6 bg-medical-blue text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-4">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mb-6">Видео-фиксация</div>
              <h2 className="text-4xl font-black mb-8 leading-tight uppercase tracking-tighter font-display">
                ИНТЕРВЬЮ И <br /> <span className="text-slate-500">ПРАКТИКА</span>
              </h2>
              <p className="text-slate-400 text-lg mb-10 font-medium">
                Посмотрите интервью и фрагменты работы, чтобы понять принципы воздействия на опорно-двигательный аппарат.
              </p>
              <div className="flex items-center gap-4 p-6 border border-white/10 rounded-xl bg-white/5">
                <div className="p-3 bg-white/10 rounded-lg">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                  Безопасность и <br /> профессионализм
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-8 relative">
              <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group bg-black">
                <video 
                  className="w-full h-full object-cover"
                  poster={`${window.location.origin}/input_file_1.png`}
                  controls
                >
                  <source src={`${window.location.origin}/input_file_0.mp4`} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews / Results Section */}
      <section id="reviews" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mb-4">Клинические случаи</div>
              <h2 className="text-4xl font-black text-medical-blue uppercase tracking-tight font-display">Результаты терапии</h2>
            </div>
            <div className="hidden md:block">
              <div className="flex gap-2">
                <div className="w-12 h-12 border border-medical-line rounded flex items-center justify-center text-slate-300">
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </div>
                <div className="w-12 h-12 border border-medical-blue rounded flex items-center justify-center text-medical-blue">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {REVIEWS.map((review, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-slate-100 flex flex-col justify-between h-full shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-medical-blue rounded-full" />)}
                  </div>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed italic mb-8">
                    "{review.text}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-6 border-t border-slate-200">
                  <div className="text-[10px] font-black uppercase tracking-widest text-medical-blue">
                    {review.author}
                  </div>
                  <div className="h-px flex-grow bg-slate-200" />
                  <CheckCircle2 className="w-3 h-3 text-slate-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Contact Section */}
      <section className="relative py-24 px-6 bg-slate-50 border-t border-medical-line overflow-hidden">
        {/* Background Anatomy Element */}
        <div className="absolute bottom-0 left-0 w-1/3 h-full opacity-[0.03] pointer-events-none">
           <img 
            src={`${window.location.origin}/input_file_1.png`} 
            alt="Anatomy BG" 
            className="w-full h-full object-contain -translate-x-1/4"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block p-4 bg-white rounded-2xl border border-medical-line mb-10">
            <MessageCircle className="w-8 h-8 text-medical-blue" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-medical-blue mb-8 uppercase tracking-tighter font-display">
            ЗАПИСЬ НА <br /> <span className="text-slate-400">КОНСУЛЬТАЦИЮ</span>
          </h2>
          <p className="text-slate-500 text-lg mb-12 max-w-xl mx-auto font-medium">
            Опишите вашу проблему в Telegram, и я проведу предварительную оценку вашего состояния.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a 
              href="https://t.me/StarkLimitedMs" 
              className="bg-medical-blue text-white px-12 py-5 rounded font-black uppercase text-[11px] tracking-[0.2em] hover:shadow-2xl transition-all flex items-center justify-center gap-3"
            >
              Написать в Telegram <MessageCircle className="w-4 h-4" />
            </a>
            <a 
              href="https://t.me/+tWH18iteljUyYzYy" 
              className="bg-white text-medical-blue border border-medical-line px-12 py-5 rounded font-black uppercase text-[11px] tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
            >
              Группа с отзывами <Users className="w-4 h-4" />
            </a>
          </div>
          
          <div className="mt-12 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
            Локация: По предварительной записи
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white border-t border-medical-line">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <img 
              src={`${window.location.origin}/input_file_2.png`} 
              alt="STARK KOSTOPRAV" 
              className="w-8 h-8 object-contain"
              referrerPolicy="no-referrer"
            />
            <span className="font-bold tracking-tight text-sm uppercase mono font-display">STARK KOSTOPRAV</span>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            © 2026 Профессиональное костоправство и реабилитация
          </div>
          <div className="flex gap-6 text-slate-400">
            <a href="https://t.me/StarkLimitedMs" className="hover:text-medical-blue transition-colors">TG</a>
            <a href="https://t.me/+tWH18iteljUyYzYy" className="hover:text-medical-blue transition-colors">COMMUNITY</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
