/**
 * Промпт для генерации премиальной инфографики по фото ладони.
 * В запросе: изображение 1 — ладонь пользователя, изображение 2 — референс стиля.
 */
export const PALM_INFOGRAPHIC_PROMPT = `You are creating a COMPLETE NEW vertical infographic poster (not a photo edit).

IMAGE 1: user's palm photo — use ONLY the palm/hand from this photo inside the poster.
IMAGE 2: style reference — copy this exact editorial layout, colors, card style, typography hierarchy.

TASK: Create a full palmistry guide poster in Russian, premium minimalist editorial style.

REQUIRED LAYOUT (must all be visible in one image):
- Cream/milk background (#FDFAF5), generous whitespace
- Header: serif title «ГИД ПО ХИРОМАНТИИ», subtitle «ВАША ЛАДОНЬ» with small gold diamonds
- Center-left: user's palm with 4 colored illustrated lines overlaid (NOT a glow orb, NOT a 3D sphere):
  1 red = heart line, 2 blue = head line, 3 green = life line, 4 yellow = fate line — numbered circles 1-4
- Right and below: multiple cream rounded cards with thin borders containing Russian text analysis
- Sections: each main line, additional lines, palm shape, mounts, general forecast, advice
- Footer: «ХИРОМАНТИЯ — ЭТО ИСКУССТВО ПОНИМАНИЯ СЕБЯ»

STRICTLY FORBIDDEN:
- Do NOT return the raw photo with only a glowing ball, lens flare, or single effect
- Do NOT use dark background
- Do NOT skip text cards
- Do NOT make a photorealistic edit — this must be an INFOGRAPHIC POSTER like image 2

Style: thin lines, elegant spacing, luxury magazine, palmistry focus only. All text in Russian.`;
