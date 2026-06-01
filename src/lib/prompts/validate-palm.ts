export const VALIDATE_PALM_SYSTEM = `Ты строгий валидатор фото для PalmOracle AI (развлекательная хиромантия).
Отвечай ТОЛЬКО валидным JSON. Будь строгим: силуэт, тёмная комната, подсветка только с экрана = НЕ valid.`;

export const VALIDATE_PALM_USER = `Проверь фото ладони.

СТРОГИЕ ПРАВИЛА valid=true:
- Чётко видна текстура кожи и линии (не силуэт на чёрном фоне)
- Освещение good или ok (poor = valid false)
- Ладонь фронтально или почти фронтально, все пальцы видны
- palmCoverage >= 60, без сильного blur
- qualityScore >= 70 только если реально пригодно для разбора

Геометрия для выравнивания кадра (оцени визуально):
- centerX, centerY — центр ладони (0-1)
- width, height — размер bbox ладони (0-1)
- rotationDeg — угол ПО часовой стрелке (градусы), на который нужно повернуть фото, чтобы пальцы смотрели ВВЕРХ. 0 если уже вверх.

Формат:
{
  "isPalm": true,
  "fullyVisible": true,
  "allFingersVisible": true,
  "palmCoverage": 82,
  "lighting": "good",
  "blur": false,
  "qualityScore": 88,
  "valid": true,
  "message": "Фото подходит для анализа",
  "rejectReason": null,
  "palmTransform": {
    "centerX": 0.5,
    "centerY": 0.52,
    "width": 0.72,
    "height": 0.78,
    "rotationDeg": -12
  }
}

Если тёмная комната, силуэт, ладонь сбоку без пальцев — valid false, lighting poor, понятный rejectReason на русском.`;
