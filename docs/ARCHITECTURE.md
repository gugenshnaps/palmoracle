# PalmOracle — архитектура v2

## Поток

1. Upload → фото ладони (сжатие на клиенте)
2. `POST /api/validate` → GPT Vision (4.1-mini) → JSON проверки
3. Quality check UI → галочки, qualityScore
4. `POST /api/analyze` → GPT Vision (4.1) → JSON 4 линий + teaser доп. линий
5. Free result → `PalmGuidePoster` (React, молочные карточки)
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
