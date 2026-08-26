# AGENTS.md for Tai Sui API

This repo teaches AI coding agents (Cursor, Claude Code, Aider, Codex, Windsurf, RooCode, Gemini CLI) how to use the RoxyAPI feng shui annual afflictions and annual flying stars endpoints.

## Endpoints
Both are GET, both take one path parameter, both are in the `feng-shui` domain (one of 14+ in the RoxyAPI catalog), both authenticate with the `X-API-Key` header.

| Endpoint | Operation ID | MCP tool |
|---|---|---|
| `https://roxyapi.com/api/v2/feng-shui/afflictions/{year}` | `getAnnualAfflictions` | `get_feng_shui_afflictions_year` |
| `https://roxyapi.com/api/v2/feng-shui/flying-stars/annual/{year}` | `getAnnualFlyingStars` | `get_feng_shui_flying_stars_annual_year` |

Both MCP tools live on `https://roxyapi.com/mcp/feng-shui`. The operation IDs match the SDK method names in camelCase for TypeScript and in snake_case for Python.

## TypeScript SDK
```ts
import { createRoxy } from '@roxyapi/sdk';
const roxy = createRoxy(process.env.ROXY_API_KEY!);

const { data: annual } = await roxy.fengShui.getAnnualAfflictions({ path: { year: 2027 } });
const { data: plate } = await roxy.fengShui.getAnnualFlyingStars({ path: { year: 2027 } });
```

## Python SDK
```python
import os
from roxy_sdk import create_roxy
roxy = create_roxy(os.environ["ROXY_API_KEY"])

annual = roxy.feng_shui.get_annual_afflictions(year="2027")
plate = roxy.feng_shui.get_annual_flying_stars(year="2027")
```

## Setup step (no location lookup, no birth data)
Neither endpoint takes coordinates, a timezone, a birth date, or a compass bearing. The four afflictions and the annual plate are properties of the solar year itself, identical for every reader and every building on earth, so there is nothing to geocode. Do NOT call `/location/search` for these endpoints and do not invent a latitude or longitude parameter. Pass the year and nothing else.

## Request fields
Identical on both endpoints.
- `year` (number, path, required): solar year, 1900 to 2100. The year runs from Li Chun to Li Chun, so a date in January belongs to the previous year here
- `lang` (string, query, optional): BCP 47 language code. One of `en`, `tr`, `de`, `es`, `hi`, `pt`, `fr`, `ru`, `zh-Hans`, `zh-Hant`. Defaults to `en`

## Response top level keys, afflictions
- `year`: the solar year these positions are for
- `yearBranch`: Earthly Branch of the solar year in pinyin. Three of the four afflictions are derived from it
- `changeoverDate`: the date all four afflictions move, which is Li Chun and NOT Lunar New Year
- `taiSui`: the Grand Duke on the mountain of the year branch. `id`, `name`, `chinese`, `pinyin`, `meaning`, `mountain`, `direction`, `animal`, `clashingAnimal`
- `suiPo`: the Year Breaker on the mountain directly opposite Tai Sui. Same shape minus the two animal fields
- `sanSha`: the Three Killings. `id`, `name`, `chinese`, `pinyin`, `meaning`, `direction`, `frameElement`, `frameDirection`, `startDegree`, `endDegree`, `parts[]`
- `fiveYellow`: the annual 5. `id`, `name`, `chinese`, `pinyin`, `meaning`, `palace`, `star`, `remedy`

Every `mountain` object carries `id`, `label` such as `SW1`, `chinese`, `pinyin`, `direction`, `yuan`, `polarity`, `startDegree`, `endDegree`.

## Response top level keys, annual flying stars
- `year`: the solar year this plate is for
- `centerStar`: the star occupying the centre palace, which is what names the plate
- `changeoverDate`: the date this plate takes effect, same Li Chun date as the afflictions
- `palaces[]`: all nine palaces, centre first and then along the Lo Shu path. Each has `palace`, `star`, `name`, `nameLocalized` when `lang` is not English, `element`, `nature`, `enhancer`, `remedy`, `meaning`

## Domain rules
- **The feng shui year turns at Li Chun in early February, never on 1 January and never at Lunar New Year.** Read `changeoverDate` off the response and compare it against today before deciding which year to serve. Before the changeover the previous year is still in force. The date is not fixed either: it falls on 3 or 4 February depending on the year, so never hardcode it.
- Tai Sui occupies a single 15 degree mountain, not a whole 45 degree sector. Use `taiSui.mountain.startDegree` and `endDegree` for anything that tests a compass bearing, and `taiSui.direction` only for a coarse sector label.
- San Sha publishes both readings in circulation: the exact 75 degree branch span in `startDegree` and `endDegree`, and the 45 degree cardinal palace in `direction`. Its span crosses 360 when the affliction is in the north, so a naive `start <= x && x <= end` test fails there. Handle the wrap.
- The three parts of San Sha are one affliction read in three, not three separate ones. Disturbing any part is taken to wake the whole.
- The Five Yellow is the one of the four that comes from the star plate rather than the year branch, so it is also the one with no link to the animal of the year. `fiveYellow.palace` and the palace holding star 5 on the annual plate always agree, by construction.
- `remedy` is the phase the star produces, because a harmful star is drained by giving it somewhere to go rather than fought with the phase that controls it. `enhancer` is the phase that produces the star.
- Branch on `id`, `direction`, `palace`, `animal`, `clashingAnimal`, `yearBranch`, `element`, `nature`, `remedy`, `enhancer`, `mountain.id`, and `mountain.label`. These stay stable English machine values under every language. Treat `meaning`, and any `name` beside it, as display copy: render it, never compare against it.
- Both endpoints are pure year lookups with no request body and no conventions to resolve, so a stored response stays valid forever and caches hard.

## Related endpoints
- `GET /feng-shui/flying-stars/monthly` (`getMonthlyFlyingStars`): the monthly overlay on top of the annual plate. Months are SOLAR, so month 1 begins at Li Chun and none of them line up with calendar months
- `GET /feng-shui/flying-stars/stars` (`listFlyingStars`): the nine-star catalogue with names, elements, home palaces, the period each rules, and the element that drains it
- `POST /feng-shui/flying-stars/natal` (`generateFlyingStarChart`): the per-building chart the annual overlay sits on top of, cast from construction period and facing direction. Facing is one of the 24 mountains by id or label, or a compass bearing in `facingDegrees`
- `GET /feng-shui/periods` (`listNinePeriods`): the 1864 to 2043 table of twenty year periods plus the period in force now, which is what dates every flying star chart

## Verified
2026-Q3 against `https://roxyapi.com/api/v2/openapi.json`. Re-fetch the spec for ground truth before changing this file.

## Discovery
- Full catalog: https://roxyapi.com/AGENTS.md
- LLM index: https://roxyapi.com/llms.txt
- Methodology: https://roxyapi.com/methodology
