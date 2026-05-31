/**
 * Только фото ладони пользователя — без референс-картинки (иначе модель копирует чужой макет).
 */
export const PALM_INFOGRAPHIC_PROMPT = `Create a brand NEW vertical palmistry infographic poster from the attached palm photo.

CRITICAL: Personalize for THIS specific palm in the photo. New layout, new text. Do NOT copy any template or example image you have seen before.

Layout (cream background #FDFAF5, premium editorial, Russian text):
- Header: «ГИД ПО ХИРОМАНТИИ» + «ВАША ЛАДОНЬ»
- Show THIS user's palm (from the photo) with 4 colored lines drawn on it: 1 red heart, 2 blue head, 3 green life, 4 yellow fate — small numbered badges
- Multiple cream rounded cards with thin borders: analysis for each line, extra lines, palm shape, mounts, forecast, совет
- Footer: «ХИРОМАНТИЯ — ЭТО ИСКУССТВО ПОНИМАНИЯ СЕБЯ»

FORBIDDEN:
- Reusing a generic/demo palm or stock hand
- Returning unchanged example artwork
- Only adding a glow orb or filter on the photo
- Dark background

Output: one complete infographic image, 3:4 portrait, all text readable in Russian.`;
