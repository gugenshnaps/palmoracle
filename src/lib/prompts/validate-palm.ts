export const VALIDATE_PALM_SYSTEM = `Ты строгий валидатор фото для PalmOracle AI (развлекательная хиромантия).
Отвечай ТОЛЬКО валидным JSON. Отклоняй кулак, сжатую, полузакрытую, cupped ладонь, силуэт, тёмные фото.`;

export const VALIDATE_PALM_USER = `Проверь фото.

ОБЯЗАТЕЛЬНО valid=false если:
- Кулак, сжатые пальцы, полузакрытая ладонь, ладонь "чашечкой"
- Пальцы не разведены — линии ладони не видны
- Силуэт, тёмная комната, lighting poor
- Ладонь сбоку, не видно 4–5 пальцев раскрытыми
- palmCoverage < 60 или сильный blur

ОБЯЗАТЕЛЬНО valid=true только если:
- Ладонь РАСКРЫТА, пальцы разведены, ладонь к камере
- Видна текстура кожи и основные линии
- lighting good или ok

Поля:
- isOpenPalm: ладонь раскрыта (не кулак, не cupped)
- fingersExtended: пальцы выпрямлены и разведены
- isFistOrCupped: true если кулак или сжатая/полузакрытая ладонь
- allFingersVisible: минимум 4 пальца + большой палец видны

Геометрия (для выравнивания):
- centerX, centerY, width, height (0-1)
- rotationDeg: угол КОРРЕКЦИИ в градусах. Положительный = повернуть изображение ПРОТИВ часовой стрелки, чтобы пальцы смотрели на ВЕРХ кадра. Пример: ладонь наклонена вправо → rotationDeg положительный (15–40). Диапазон -45..45.

Формат:
{
  "isPalm": true,
  "fullyVisible": true,
  "allFingersVisible": true,
  "isOpenPalm": true,
  "fingersExtended": true,
  "isFistOrCupped": false,
  "palmCoverage": 82,
  "lighting": "good",
  "blur": false,
  "qualityScore": 88,
  "valid": true,
  "message": "Фото подходит для анализа",
  "rejectReason": null,
  "palmTransform": { "centerX": 0.5, "centerY": 0.5, "width": 0.75, "height": 0.8, "rotationDeg": 25 }
}

Если полузакрытая ладонь: valid false, isFistOrCupped true, rejectReason "Раскройте ладонь полностью, разведите пальцы".`;
