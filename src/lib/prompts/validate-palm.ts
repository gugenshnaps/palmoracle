export const VALIDATE_PALM_SYSTEM = `Ты валидатор изображений для развлекательного приложения PalmOracle AI (хиромантия).
Отвечай ТОЛЬКО валидным JSON без markdown.`;

export const VALIDATE_PALM_USER = `Проверь фото:

1. Есть ли человеческая ладонь
2. Ладонь занимает достаточно кадра (оцени palmCoverage 0-100)
3. Видны ли все основные пальцы
4. Освещение: good / ok / poor
5. Сильное размытие: blur true/false

valid = true только если isPalm, fullyVisible, allFingersVisible, palmCoverage >= 60, lighting не poor, blur = false.

Формат:
{
  "isPalm": true,
  "fullyVisible": true,
  "allFingersVisible": true,
  "palmCoverage": 82,
  "lighting": "good",
  "blur": false,
  "qualityScore": 92,
  "valid": true,
  "message": "Фото подходит для анализа",
  "rejectReason": null
}

Если не valid — понятный rejectReason и message на русском для пользователя.`;
