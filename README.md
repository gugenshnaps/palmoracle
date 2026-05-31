# PalmOracle AI

Telegram Web App MVP — развлекательный AI-оракул по линиям ладони.

## Стек

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion
- [@twa-dev/sdk](https://github.com/twa-dev/sdk) — Telegram Web App SDK

## Запуск сегодня

Пошаговый чеклист: **[docs/LAUNCH-TODAY.md](docs/LAUNCH-TODAY.md)**

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000). В Telegram подключите URL Web App в настройках бота.

## Структура

```
src/
├── app/                    # Next.js pages & layout
├── components/
│   ├── app/                # Root app + screen router
│   ├── layout/             # Shell, headers
│   ├── palm/               # Scanner animation
│   ├── screens/            # 6 экранов флоу
│   └── ui/                 # Button, GoldCard
└── lib/
    ├── api/
    │   ├── openrouter.ts   # TODO: OpenRouter vision API
    │   └── payments.ts     # TODO: Telegram Stars / ЮKassa
    ├── mock/               # Mock reading data
    ├── store/              # App state (screen flow)
    ├── telegram/           # TWA provider
    └── types/
```

## Экраны

1. **Welcome** — приветствие
2. **Upload** — фото / галерея
3. **Analysis** — анимация сканирования
4. **Free result** — 4 карточки + тизер
5. **Paywall** — преимущества + оплата (mock)
6. **Full reading** — 8 карточек со свайпом

## Подключение API (далее)

### OpenRouter

1. Добавьте `OPENROUTER_API_KEY` в `.env.local`
2. Модели: `openai/gpt-5-image` (инфографика), fallback `google/gemini-2.5-flash-image` — см. `docs/OPENROUTER.md`
3. Запрос идёт через `POST /api/analyze` → `generatePalmInfographic()` в `src/lib/api/openrouter.ts`

### Платежи

1. Реализуйте `initiatePayment()` в `src/lib/api/payments.ts`
2. Варианты: Telegram Stars (`invoice`), ЮKassa, Stripe

## Переменные окружения (шаблон)

```env
OPENROUTER_API_KEY=
OPENROUTER_MODEL=google/gemini-2.0-flash-001
NEXT_PUBLIC_BOT_USERNAME=
```

## Дисклеймер

Продукт развлекательный. Не является медицинской или научной консультацией.
