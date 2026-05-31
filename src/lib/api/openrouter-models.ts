/**
 * Модели OpenRouter для PalmOracle AI.
 *
 * @see https://openrouter.ai/docs/guides/overview/multimodal/image-generation
 * @see https://openrouter.ai/docs/guides/features/server-tools/image-generation
 */

/** Бесплатный разбор: фото ладони → инфографика (image in → image out) */
/** Gemini лучше собирает постер с текстом и карточками; GPT Image — запасной */
export const INFOGRAPHIC_MODEL_PRIMARY =
  process.env.OPENROUTER_INFOGRAPHIC_MODEL ??
  "google/gemini-2.5-flash-image";

export const INFOGRAPHIC_MODEL_FALLBACK =
  process.env.OPENROUTER_INFOGRAPHIC_MODEL_FALLBACK ??
  "openai/gpt-5-image";

/** Премиум (позже): текстовый глубокий разбор — не инфографика */
export const PAID_TEXT_MODEL =
  process.env.OPENROUTER_PAID_TEXT_MODEL ?? "openai/gpt-4o";

/**
 * Рекомендуемые модели на OpenRouter:
 *
 * 1. openai/gpt-5-image — основная (ваш «GPT Image»), image generation
 * 2. openai/gpt-5-image-mini — дешевле, для A/B или лимитов
 * 3. google/gemini-2.5-flash-image — fallback: фото + промпт → картинка, modalities image+text
 * 4. google/gemini-3.1-flash-image-preview — выше качество, aspect 3:4 / 9:16 для мобилки
 *
 * НЕ подходят для инфографики (только текст на выходе):
 * - openai/gpt-4o, gpt-4o-mini — vision in, text out
 */

export const INFOGRAPHIC_IMAGE_CONFIG = {
  aspect_ratio: "3:4" as const,
  image_size: "2K" as const,
};
