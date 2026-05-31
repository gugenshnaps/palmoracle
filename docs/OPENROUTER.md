# OpenRouter — модели PalmOracle AI

## Бесплатный анализ (сейчас)

**Вход:** фото ладони пользователя  
**Выход:** одна инфографика в стиле референса (молочные карточки, цветные линии, русский текст)

### Основная модель

| Модель | Роль |
|--------|------|
| **`google/gemini-2.5-flash-image`** | Основная: постер с карточками и русским текстом (ближе к ChatGPT-референсу) |
| **`openai/gpt-5-image`** | Запасная; без референса стиля часто даёт только оверлей на фото |

### Запасные

| Модель | Когда использовать |
|--------|-------------------|
| `google/gemini-2.5-flash-image` | Fallback: стабильный image in → image out, `modalities: ["image","text"]` |
| `google/gemini-3.1-flash-image-preview` | Выше качество, `aspect_ratio: 3:4` / `9:16` для мобилки |
| `openai/gpt-5-image-mini` | Экономия на трафике |

### Не использовать для инфографики

- `openai/gpt-4o` — на OpenRouter **только текст на выходе**, хотя принимает картинки
- Flux / Recraft — без вашего референсного фото ладони в одном запросе (другой пайплайн)

## Платный разбор (позже)

Отдельно решим формат. Кандидаты для **текста** (не картинки):

- `openai/gpt-4o` — структурированный JSON с разделами
- `google/gemini-2.5-pro` — длинный контекст

Инфографика остаётся на **image-моделях**, платный слой может быть текст + опционально вторая картинка.

## Промпт

См. `src/lib/prompts/palm-infographic.ts` — тот же текст, что вы используете в GPT Image.

## API

```http
POST https://openrouter.ai/api/v1/chat/completions
```

```json
{
  "model": "openai/gpt-5-image",
  "messages": [{
    "role": "user",
    "content": [
      { "type": "image_url", "image_url": { "url": "data:image/jpeg;base64,..." } },
      "Используй это изображение, чтобы создать полную инфографику..."
    ]
  }],
  "modalities": ["image", "text"],
  "image_config": { "aspect_ratio": "3:4", "image_size": "2K" }
}
```

Ответ: `choices[0].message.images[0].image_url.url` (base64 data URL).

## Реализация в коде

- `src/lib/api/openrouter.ts` → `generatePalmInfographic()`
- `src/lib/api/openrouter-models.ts` → id моделей из `.env`
