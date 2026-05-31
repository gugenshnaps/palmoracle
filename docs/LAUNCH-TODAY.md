# Запуск PalmOracle AI — сегодня

Чеклист на ~2–3 часа. Цель: бот в Telegram → Web App → реальная инфографика → шаринг в рилсы.

---

## 1. OpenRouter (15 мин)

1. Зарегистрируйтесь на [openrouter.ai](https://openrouter.ai), пополните баланс ($5–10 хватит на тесты).
2. Создайте API key.
3. Локально создайте `.env.local`:

```env
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_VALIDATE_MODEL=openai/gpt-4.1-mini
OPENROUTER_ANALYZE_MODEL=openai/gpt-4.1
OPENROUTER_SITE_URL=https://ВАШ-ДОМЕН.vercel.app
NEXT_PUBLIC_BOT_USERNAME=ваш_бот_без_@
NEXT_PUBLIC_ENABLE_PAYWALL=false
TELEGRAM_BOT_TOKEN=123456:ABC...   # BotFather → /token (секрет, не NEXT_PUBLIC_)
```

Опционально — ответ бота на `/start` (webhook):

```text
BotFather → /setwebhook
https://palmoracle.vercel.app/api/telegram/webhook
```

4. Проверка локально:

```bash
npm run dev
```

Загрузите **своё** фото ладони — на результате должна быть **новая** картинка (не референс). Генерация 30–90 сек.

---

## 2. Деплой на Vercel (20 мин)

1. Репозиторий на GitHub (если ещё нет):

```bash
git init
git add .
git commit -m "PalmOracle MVP launch"
```

2. [vercel.com](https://vercel.com) → Import project → тот же репозиторий.
3. **Environment Variables** — те же, что в `.env.local` (все `OPENROUTER_*` + `NEXT_PUBLIC_BOT_USERNAME`).
4. Deploy → скопируйте URL, например `https://palm-oracle-xxx.vercel.app`.
5. Обновите `OPENROUTER_SITE_URL` в Vercel на этот URL → Redeploy.

---

## 3. Telegram-бот (15 мин)

1. [@BotFather](https://t.me/BotFather) → `/newbot` → имя **PalmOracle AI** → username `palmoracle_bot` (или свой).
2. `/mybots` → ваш бот → **Bot Settings** → **Menu Button** → Configure → **Web App** → URL вашего Vercel.
3. Или: `/setmenubutton` → выберите бота → URL Web App.
4. Опционально: `/setdescription` — «AI-гид по линиям ладони. Развлекательный оракул».
5. `NEXT_PUBLIC_BOT_USERNAME` = username бота **без** `@`.

Проверка: откройте бота в Telegram → кнопка меню / «Открыть» → Web App.

---

## 4. Контент для рилсов (после деплоя)

**Сценарий записи:**

1. Показать вход в бота (3 сек).
2. Загрузить ладонь (5 сек).
3. Анимация анализа (5–10 сек, можно ускорить в монтаже).
4. Раскрыть инфографику → «Поделиться» / скрин для Stories.
5. CTA: «Ссылка в шапке / в боте @username».

**Хук-тексты:**

- «Сняла ладонь — AI нарисовал полный гид по линиям»
- «Не гороскоп: нейросеть разобрала мою ладонь за минуту»

**Метрики спроса (первая неделя):**

- Сколько открыло Web App (Telegram Bot Analytics / свой счётчик позже).
- Сколько дошло до результата (событие `analysis_complete` — добавить позже).
- Комментарии / репосты рилсов.

---

## 5. Что отключено на старте

- Платный разбор (`NEXT_PUBLIC_ENABLE_PAYWALL=false`) — кнопка скрыта.
- Оплата — подключим при появлении спроса.

---

## 6. Если что-то ломается

| Проблема | Решение |
|----------|---------|
| Всегда одна и та же картинка | Нет `OPENROUTER_API_KEY` на Vercel → добавить и redeploy |
| Таймаут / ошибка анализа | Подождать; фото при свете; модель fallback Gemini в env |
| Web App не открывается | URL в BotFather = точный HTTPS Vercel, без слэша в конце |
| Долго грузит | Норма 30–90 сек для image-модели |

---

## 7. Сразу после запуска

- [ ] Пройти флоу с телефона через бота (не только localhost).
- [ ] Один тест с реальным фото ладони.
- [ ] Сохранить/поделиться инфографикой.
- [ ] Записать 1–2 рилса с ссылкой на бота.

Удачи с проверкой спроса.
