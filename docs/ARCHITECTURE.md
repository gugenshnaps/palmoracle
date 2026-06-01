# PalmOracle — архитектура v2

## Поток

1. Upload → фото + подсказки по свету
2. `POST /api/validate`:
   - **Метрики** (sharp): яркость, контраст, доля тёмных пикселей, blur
   - **GPT Vision** (4.1-mini): строгий JSON + `palmTransform`
   - **Normalize** (sharp): crop, поворот пальцами вверх, кадр 4:5
3. Quality check UI → галочки, «выравниваем кадр»
4. `POST /api/analyze` → на **нормализованном** фото → JSON 4 линий
5. Free result → гид + SVG линии на выровненной ладони
6. Paywall → дополнительные линии (замок на гиде)
7. После оплаты → `includePaidLines: true` → полный текст доп. линий

## Бесплатно

- Линия сердца, головы, жизни, судьбы (полный текст)
- Список доп. линий (blur + lock)
- Редкий знак (teaser)

## Платно

- Полная расшифровка дополнительных линий

## Модели (OpenRouter)

- Validate: `openai/gpt-4.1-mini`
- Analyze: `openai/gpt-4.1`

Image-gen не используется.
