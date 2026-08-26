[![Tai Sui API](banner.png)](https://roxyapi.com/products/feng-shui-api)

# Tai Sui API

> Tai Sui API for the annual feng shui afflictions of any solar year from 1900 to 2100. Tai Sui and Sui Po on their exact 15 degree mountains, San Sha across its 75 degree span, and the Five Yellow on the annual star plate, every position returned as structured fields rather than prose. Paired with the annual flying stars, the two calls rebuild a whole annual feng shui page. Both return the Li Chun changeover date, so the page flips on the right day. One key covers 14+ spiritual domains. MCP-first, nine languages beyond English including Simplified and Traditional Chinese.

[![Get API Key](https://img.shields.io/badge/Get_API_Key-RoxyAPI-14b8a6?style=for-the-badge&logo=key&logoColor=white)](https://roxyapi.com/pricing)
[![Try Live](https://img.shields.io/badge/Try_API_Live-Free_in_browser-22c55e?style=for-the-badge&logo=swagger&logoColor=white)](https://roxyapi.com/api-reference)
[![Changeover](https://img.shields.io/badge/Changeover-Li_Chun_dated-f59e0b?style=for-the-badge&logo=googlecalendar&logoColor=white)](https://roxyapi.com/products/feng-shui-api)
[![MCP Server](https://img.shields.io/badge/MCP_Server-Streamable_HTTP-8b5cf6?style=for-the-badge&logo=anthropic&logoColor=white)](https://roxyapi.com/docs/mcp)
[![SDK](https://img.shields.io/badge/SDK-TypeScript_+_Python_+_PHP_+_C%23_+_Go_+_WordPress-3b82f6?style=for-the-badge&logo=npm&logoColor=white)](https://roxyapi.com/docs/sdk)

## What is Tai Sui API

Tai Sui is the Grand Duke Jupiter, the annual star that occupies the mountain of the year branch, and he is the entity every annual feng shui article opens with. Three more afflictions sit around him: Sui Po the Year Breaker on the mountain directly opposite, San Sha the Three Killings across a 75 degree span, and the Five Yellow wherever it lands on the annual star plate.

This repo ships working TypeScript, JavaScript, and Python samples against two RoxyAPI feng shui endpoints. `GET /feng-shui/afflictions/{year}` returns the four annual afflictions for any solar year from 1900 to 2100, each with its compass sector, its exact 15 degree mountain, and the degree span it covers. `GET /feng-shui/flying-stars/annual/{year}` returns the annual flying stars for the same year, the nine palace plate that every yearly feng shui guide is built on. Together the two calls are the annual page a publisher rebuilds each year, and change one number in the path to move from tai sui 2027 to tai sui 2028.

One subscription unlocks 14+ spiritual domains: Western astrology, Vedic astrology, Forecast, Human Design, Chinese astrology, Feng Shui, numerology, tarot, biorhythm, I Ching, crystals, dreams, angel numbers, and location.

### One date decides the whole page

The feng shui year does not begin on 1 January and it does not begin at Lunar New Year. It begins at Li Chun, the start of spring in early February. All four afflictions and the entire annual star plate move on that one day.

The li chun changeover is not a fixed calendar date either. It falls on 3 or 4 February depending on the year: 2025 changed over on 2025-02-03, while 2026, 2027, and 2028 all change over on the 4th. In 2026 Lunar New Year lands on 17 February, roughly two weeks after the afflictions have already moved.

An annual page that flips on 1 January serves the wrong sectors for five weeks every single year. One that waits for Lunar New Year serves them for two. Both endpoints return `changeoverDate`, so no caller has to hardcode it, guess it, or recompute it each January.

## Why this API

| Property | Value |
|----------|-------|
| Coverage | 14+ spiritual domains in one subscription |
| Feng shui year | Turns at Li Chun in early February, returned as `changeoverDate` on both endpoints |
| Positions | Compass sector, 24 mountain id and label, and start and end degrees as structured fields |
| Languages | Nine beyond English: Turkish, German, Spanish, Hindi, Portuguese, French, Russian, Simplified Chinese, Traditional Chinese |
| MCP server | `https://roxyapi.com/mcp/feng-shui` (Streamable HTTP, no local setup) |
| SDKs | TypeScript on npm `@roxyapi/sdk`, Python on PyPI `roxy-sdk`, PHP on Packagist `roxyapi/sdk`, C# on NuGet `RoxyApi.Sdk`, Go `github.com/RoxyAPI/sdk-go`, WordPress plugin `roxyapi` |
| Pricing | One key, flat per call, from $39/mo |
| Licensing | Personal and commercial use, including closed source apps. No AGPL or GPL entanglement. [Full terms](https://roxyapi.com/policy/license) |
| Last verified | 2026-Q3 |

## Quick start

1. Get a key at [roxyapi.com/pricing](https://roxyapi.com/pricing)
2. Pick a language below
3. Copy the snippet, run, ship

Both calls take one path parameter, the solar year, and nothing else. No birth data, no coordinates, no compass reading. The annual plate and the four afflictions are universal for the year, so one call each rebuilds the page for every reader at once.

### cURL

```bash
# The four annual afflictions for the solar year
curl https://roxyapi.com/api/v2/feng-shui/afflictions/2027 \
  -H "X-API-Key: $ROXY_API_KEY"

# The annual flying star plate for the same year
curl https://roxyapi.com/api/v2/feng-shui/flying-stars/annual/2027 \
  -H "X-API-Key: $ROXY_API_KEY"
```

### Python

```python
import os
from roxy_sdk import create_roxy

roxy = create_roxy(os.environ["ROXY_API_KEY"])

# The four annual afflictions: Tai Sui, Sui Po, San Sha, Five Yellow
annual = roxy.feng_shui.get_annual_afflictions(year="2027")

print("Feng shui year", annual["year"], "in force from", annual["changeoverDate"])
print("Tai Sui", annual["taiSui"]["direction"], annual["taiSui"]["mountain"]["label"])
print("Sui Po", annual["suiPo"]["direction"], annual["suiPo"]["mountain"]["label"])
print("San Sha", annual["sanSha"]["direction"], annual["sanSha"]["startDegree"], "to", annual["sanSha"]["endDegree"])
print("Five Yellow", annual["fiveYellow"]["palace"], "drained by", annual["fiveYellow"]["remedy"])

# The annual flying star plate the Five Yellow is read off
plate = roxy.feng_shui.get_annual_flying_stars(year="2027")

print("Center star", plate["centerStar"], "from", plate["changeoverDate"])
for palace in plate["palaces"]:
    print(palace["palace"], palace["star"], palace["name"], palace["nature"])
```

### JavaScript (Node)

```js
import { createRoxy } from '@roxyapi/sdk';

const roxy = createRoxy(process.env.ROXY_API_KEY);

// The four annual afflictions: Tai Sui, Sui Po, San Sha, Five Yellow
const { data: annual, error } = await roxy.fengShui.getAnnualAfflictions({ path: { year: 2027 } });

if (error) throw new Error(error.error);

console.log('Feng shui year', annual.year, 'in force from', annual.changeoverDate);
console.log('Tai Sui', annual.taiSui.direction, annual.taiSui.mountain.label);
console.log('Sui Po', annual.suiPo.direction, annual.suiPo.mountain.label);
console.log('San Sha', annual.sanSha.direction, annual.sanSha.startDegree, 'to', annual.sanSha.endDegree);
console.log('Five Yellow', annual.fiveYellow.palace, 'drained by', annual.fiveYellow.remedy);

// The annual flying star plate the Five Yellow is read off
const { data: plate } = await roxy.fengShui.getAnnualFlyingStars({ path: { year: 2027 } });

console.log('Center star', plate.centerStar, 'from', plate.changeoverDate);
plate.palaces.forEach(p => console.log(p.palace, p.star, p.name, p.nature));
```

### TypeScript

```ts
import { createRoxy } from '@roxyapi/sdk';

const roxy = createRoxy(process.env.ROXY_API_KEY!);

// The four annual afflictions: Tai Sui, Sui Po, San Sha, Five Yellow
const { data: annual, error } = await roxy.fengShui.getAnnualAfflictions({ path: { year: 2027 } });

if (error) throw new Error(error.error);

console.log(`Feng shui year ${annual.year}, branch ${annual.yearBranch}, from ${annual.changeoverDate}`);
console.log(`Tai Sui      ${annual.taiSui.direction} ${annual.taiSui.mountain.label} (${annual.taiSui.mountain.startDegree} to ${annual.taiSui.mountain.endDegree} degrees)`);
console.log(`Sui Po       ${annual.suiPo.direction} ${annual.suiPo.mountain.label}`);
console.log(`San Sha      ${annual.sanSha.direction} ${annual.sanSha.startDegree} to ${annual.sanSha.endDegree} degrees`);
console.log(`Five Yellow  ${annual.fiveYellow.palace}, drained by ${annual.fiveYellow.remedy}`);

// The annual flying star plate the Five Yellow is read off
const { data: plate, error: plateError } = await roxy.fengShui.getAnnualFlyingStars({
  path: { year: 2027 },
});

if (plateError) throw new Error(plateError.error);

console.log(`Center star ${plate.centerStar}, in force from ${plate.changeoverDate}`);
for (const palace of plate.palaces) {
  console.log(`  ${palace.palace.padEnd(10)} ${palace.star} ${palace.name.padEnd(12)} remedy ${palace.remedy}`);
}
```

## Request schema

Both endpoints take the same two inputs.

| Field | Type | In | Required | Description |
|-------|------|----|----------|-------------|
| `year` | number | path | yes | Solar year, 1900 to 2100. The year runs from Li Chun to Li Chun, so a date in January belongs to the previous year here |
| `lang` | string | query | no | Response language in BCP 47. One of `en`, `tr`, `de`, `es`, `hi`, `pt`, `fr`, `ru`, `zh-Hans`, `zh-Hant`. Defaults to `en` |

## Response shape

`GET /feng-shui/afflictions/{year}`, with the three parts of San Sha trimmed to the middle one for length.

```json
{
  "year": 2027,
  "yearBranch": "wei",
  "changeoverDate": "2027-02-04",
  "taiSui": {
    "id": "taiSui",
    "name": "Tai Sui",
    "chinese": "太歲",
    "pinyin": "Tài Suì",
    "meaning": "The Grand Duke, who occupies the mountain of the year branch. The standing rule is to sit with your back to Tai Sui and never to face him directly, and to leave that 15 degree mountain undisturbed for the year. Confronting the sector with renovation, demolition or heavy noise is read as the fastest way to a year of obstruction.",
    "mountain": {
      "id": "wei",
      "chinese": "未",
      "pinyin": "Wèi",
      "label": "SW1",
      "direction": "Southwest",
      "yuan": "earth",
      "polarity": "yin",
      "startDegree": 202.5,
      "endDegree": 217.5
    },
    "direction": "Southwest",
    "animal": "goat",
    "clashingAnimal": "ox"
  },
  "suiPo": {
    "id": "suiPo",
    "name": "Sui Po",
    "chinese": "歲破",
    "pinyin": "Suì Pò",
    "meaning": "The Year Breaker, sitting exactly opposite Tai Sui because it is the mountain the year branch clashes with. It reads as things coming apart: agreements that fail late, equipment breaking, plans undone after they looked settled. Like Tai Sui it asks for quiet rather than for a cure.",
    "mountain": {
      "id": "chou",
      "chinese": "丑",
      "pinyin": "Chǒu",
      "label": "NE1",
      "direction": "Northeast",
      "yuan": "earth",
      "polarity": "yin",
      "startDegree": 22.5,
      "endDegree": 37.5
    },
    "direction": "Northeast"
  },
  "sanSha": {
    "id": "sanSha",
    "name": "San Sha",
    "chinese": "三煞",
    "pinyin": "Sān Shà",
    "meaning": "The Three Killings, a 75 degree span opposite the elemental frame of the year. The directional rule is the reverse of Tai Sui: never sit with your back to it, and facing it is safe. Groundbreaking, demolition and drilling in this span are the classic triggers, and the traditional treatment is stillness before any object.",
    "direction": "West",
    "frameElement": "Wood",
    "frameDirection": "East",
    "startDegree": 232.5,
    "endDegree": 307.5,
    "parts": [
      {
        "id": "zai-sha",
        "name": "Disaster Sha",
        "chinese": "災煞",
        "pinyin": "Zāi Shà",
        "meaning": "The middle component, sitting on the cardinal point itself, and the most volatile of the three. It reads as physical harm: sudden illness, accidents and injury, usually falling first on whoever in the household is already least well.",
        "mountain": {
          "id": "you",
          "chinese": "酉",
          "pinyin": "Yǒu",
          "label": "W2",
          "direction": "West",
          "yuan": "heaven",
          "polarity": "yin",
          "startDegree": 262.5,
          "endDegree": 277.5
        }
      }
    ]
  },
  "fiveYellow": {
    "id": "fiveYellow",
    "name": "Five Yellow",
    "chinese": "五黃",
    "pinyin": "Wǔ Huáng",
    "meaning": "The annual position of the 5, which is the one affliction that moves with the flying stars rather than with the year branch. It reads as accident, sudden expense and projects that collapse, and it is amplified by anything of Fire, including strong lighting and red. Drain it with Metal, keep the sector quiet, and start no work there.",
    "palace": "North",
    "star": 5,
    "remedy": "Metal"
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `year` | number | The solar year these positions are for |
| `yearBranch` | string | Earthly Branch of the solar year, in pinyin. Three of the four afflictions are derived from it. Always English pinyin, safe to compare against |
| `changeoverDate` | string | The date all four afflictions move, which is Li Chun and NOT Lunar New Year |
| `taiSui` | object | The Grand Duke, occupying a single 15 degree mountain rather than a whole sector. Precision matters here more than anywhere else in the system, because the neighbouring mountains of the same sector are unaffected |
| `taiSui.id` | string | Stable machine key of the affliction. Always English, safe to switch on |
| `taiSui.name` | string | Display name of the affliction |
| `taiSui.chinese` | string | Chinese characters for the affliction. Data, identical in every language |
| `taiSui.pinyin` | string | Tone-marked pinyin. Data, identical in every language |
| `taiSui.meaning` | string | What the affliction does and the standing rule for handling it |
| `taiSui.mountain` | object | The mountain of the 24, with `id`, `label` such as `SW1`, `chinese`, `pinyin`, `direction`, `yuan`, `polarity`, `startDegree`, and `endDegree` |
| `taiSui.direction` | string | Compass sector, one of North, Northeast, East, Southeast, South, Southwest, West, Northwest. Always English, safe to key styling on |
| `taiSui.animal` | string | Zodiac animal of the year, which shares the sign Tai Sui occupies. Always English, safe to compare against |
| `taiSui.clashingAnimal` | string | The animal directly opposite, which clashes with Tai Sui head on. People of this sign are the ones traditionally advised to take the most care during the year |
| `suiPo` | object | The Year Breaker, always the mountain directly opposite Tai Sui. Same shape as `taiSui` minus the two animal fields |
| `sanSha` | object | The Three Killings. Two readings of its extent are in circulation and both are given: the exact 75 degree branch span in `startDegree` and `endDegree`, and the 45 degree cardinal palace named in `direction` |
| `sanSha.frameElement` | string | The five phase the year branch forms with its trine. The Three Killings always sits in the cardinal direction opposite this frame |
| `sanSha.frameDirection` | string | Compass sector of that frame |
| `sanSha.startDegree` | number | Start of the afflicted span in compass degrees. The span crosses 360 when the affliction is in the north |
| `sanSha.endDegree` | number | End of the afflicted span in compass degrees |
| `sanSha.parts` | array | The three mountains of the span, first to last in compass order. They are one affliction read in three parts, not three separate ones, and disturbing any part is taken to wake the whole. Each carries `id` of `jie-sha`, `zai-sha`, or `sui-sha`, plus `name`, `chinese`, `pinyin`, `meaning`, and `mountain` |
| `fiveYellow` | object | The Five Yellow, read off the annual star plate rather than from the year branch, which is why it is the one of the four with no link to the animal of the year |
| `fiveYellow.palace` | string | Palace the 5 flew to this year, one of the eight sectors or Center. Always English, safe to compare against |
| `fiveYellow.star` | number | Flying star number, always 5 for this affliction |
| `fiveYellow.remedy` | string | The phase that drains the 5, which is what the 5 itself produces. Never treat it with Fire, which produces Earth and feeds it |

`GET /feng-shui/flying-stars/annual/{year}`, with the nine palaces trimmed to two for length.

```json
{
  "year": 2027,
  "centerStar": 9,
  "changeoverDate": "2027-02-04",
  "palaces": [
    {
      "palace": "Center",
      "star": 9,
      "name": "Nine Purple",
      "element": "Fire",
      "nature": "auspicious",
      "enhancer": "Wood",
      "remedy": "Earth",
      "meaning": "Yin Fire in the southern palace, the ruling star from 2024 to 2043. It carries public recognition, celebration, marriage and everything that depends on being seen, which is why it favours media, teaching, design and anything sold on reputation. Its second property matters as much as its first: Fire magnifies whatever shares its palace, so it improves a good star and makes a dangerous one considerably more dangerous. Wood feeds it and Water puts it out."
    },
    {
      "palace": "North",
      "star": 5,
      "name": "Five Yellow",
      "element": "Earth",
      "nature": "inauspicious",
      "enhancer": "Fire",
      "remedy": "Metal",
      "meaning": "Earth of the central palace, the one star with no trigram and no direction of its own, and the affliction every school treats as the most serious. It concentrates misfortune rather than specialising in one kind: accidents, sudden expense, surgery, projects that collapse late. It is activated by disturbance above all, so the standing instruction is to keep its sector quiet, drill nothing into those walls and start no renovation there. Metal drains it, and Fire in any form, including bright red and strong lighting, feeds it."
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `year` | number | The solar year this plate is for |
| `centerStar` | number | The star occupying the centre palace, which is what names the plate |
| `changeoverDate` | string | The date this plate takes effect, which is Li Chun and NOT Lunar New Year |
| `palaces` | array | All nine palaces with the star that flew there, centre first and then along the Lo Shu path. The plate is universal: it is the same for every building on earth |
| `palaces[].palace` | string | One of the eight compass sectors, or Center. Always English, safe to key a grid cell on |
| `palaces[].star` | number | Flying star number, 1 to 9. The number IS the identifier of the star: 8 is always the Eight White Earth star whichever plate it appears on |
| `palaces[].name` | string | Display name of the star in this palace |
| `palaces[].nameLocalized` | string | Star name in the requested language, for display only. Present only when `lang` is set to a language other than English |
| `palaces[].element` | string | Five phase of the star: Wood, Fire, Earth, Metal, or Water. Always English |
| `palaces[].nature` | string | The untimely reading of the star, `auspicious` or `inauspicious` |
| `palaces[].enhancer` | string | The phase that strengthens the star |
| `palaces[].remedy` | string | The phase that drains the star |
| `palaces[].meaning` | string | What the star does in the sector it has flown to this period |

### What is safe to switch on

Branch on `id`, `direction`, `palace`, `animal`, `clashingAnimal`, `yearBranch`, `element`, `nature`, `remedy`, `enhancer`, and `mountain.id` or `mountain.label`. These are stable English machine values under every language. Treat `meaning`, and any `name` beside it, as display copy: render it, never compare against it.

## Common use cases

| Use case | Endpoint flow |
|----------|---------------|
| Annual feng shui guide, rebuilt each year | Call both endpoints once for the year, render the four afflictions and the nine palaces. Bump the year in the path and the page rebuilds itself |
| Flip the page on the correct day | Compare today against `changeoverDate`. Before it, serve the previous year. This is the whole reason the field ships on the response |
| Renovation and groundbreaking check | Read `taiSui.mountain` and `sanSha.startDegree` to `endDegree`, test the compass bearing of the wall against those spans |
| Which signs clash this year | Read `taiSui.animal` and `taiSui.clashingAnimal`, join to your zodiac content by the English animal name |
| Five Yellow sector alert | Read `fiveYellow.palace` and `fiveYellow.remedy`, or find the palace holding star 5 on the annual plate. Both agree by construction |
| Floor plan or compass overlay | Key each of the eight grid cells on `palaces[].palace`, tint by `nature`, and mark the mountains named by the afflictions |
| Monthly rather than annual cadence | Layer `GET /feng-shui/flying-stars/monthly` on top of the annual plate for a faster refresh |
| Localized annual page | Add `?lang=zh-Hans` or any of the nine, keep switching on the English machine values |

## Related endpoints in this domain

- `GET /feng-shui/flying-stars/monthly` (`getMonthlyFlyingStars`) - the monthly overlay for publishers on a monthly rather than annual cadence. Months are solar, so month 1 begins at Li Chun and none of them line up with calendar months
- `GET /feng-shui/flying-stars/stars` (`listFlyingStars`) - the nine-star catalogue with names, elements, home palaces, the period each rules, and the element that drains it
- `POST /feng-shui/flying-stars/natal` (`generateFlyingStarChart`) - the per-building chart the annual overlay sits on top of, cast from construction period and facing direction
- `GET /feng-shui/periods` (`listNinePeriods`) - the 1864 to 2043 table of twenty year periods plus the period in force now, which is what dates every flying star chart

## Use this in your AI agent

Connect Claude, GPT, Gemini, or Cursor to RoxyAPI through the remote MCP server. No Docker. No self hosting. The full MCP tool catalog for this domain is at `https://roxyapi.com/mcp/feng-shui`.

```json
{
  "mcpServers": {
    "feng-shui": {
      "url": "https://roxyapi.com/mcp/feng-shui",
      "headers": { "X-API-Key": "$ROXY_API_KEY" }
    }
  }
}
```

The two tools this repo demonstrates are `get_feng_shui_afflictions_year` and `get_feng_shui_flying_stars_annual_year`.

See [docs/mcp](https://roxyapi.com/docs/mcp) for Claude Desktop, Cursor, Windsurf, VS Code, and Claude Code setup.

## For AI coding agents

This repo ships an [AGENTS.md](AGENTS.md) execution playbook. Cursor, Claude Code, Aider, Codex, Windsurf, RooCode, and Gemini CLI will pick it up automatically. Top level overview lives at [roxyapi.com/AGENTS.md](https://roxyapi.com/AGENTS.md).

## Resources

- [Methodology and gold standard tests](https://roxyapi.com/methodology)
- [Full API reference](https://roxyapi.com/api-reference) interactive Scalar UI
- [Feng shui product page](https://roxyapi.com/products/feng-shui-api)
- [TypeScript SDK on npm](https://www.npmjs.com/package/@roxyapi/sdk)
- [Python SDK on PyPI](https://pypi.org/project/roxy-sdk/)
- [PHP SDK on Packagist](https://packagist.org/packages/roxyapi/sdk)
- [C# SDK on NuGet](https://www.nuget.org/packages/RoxyApi.Sdk)
- [Go SDK on pkg.go.dev](https://pkg.go.dev/github.com/RoxyAPI/sdk-go)
- [WordPress plugin](https://wordpress.org/plugins/roxyapi/)
- [llms.txt](https://roxyapi.com/llms.txt) full LLM citation index
- [Top level AGENTS.md](https://roxyapi.com/AGENTS.md)

## Other RoxyAPI samples

[![Transit Forecast API](https://img.shields.io/badge/Transit_Forecast_API-RoxyAPI-14b8a6?style=flat-square)](https://github.com/RoxyAPI/transit-forecast-api)
[![Moon Phase API](https://img.shields.io/badge/Moon_Phase_API-RoxyAPI-14b8a6?style=flat-square)](https://github.com/RoxyAPI/moon-phase-api)
[![Human Design API](https://img.shields.io/badge/Human_Design_API-RoxyAPI-14b8a6?style=flat-square)](https://github.com/RoxyAPI/human-design-api)
[![Numerology API](https://img.shields.io/badge/Numerology_API-RoxyAPI-14b8a6?style=flat-square)](https://github.com/RoxyAPI/numerology-api)
[![Tarot API](https://img.shields.io/badge/Tarot_API-RoxyAPI-14b8a6?style=flat-square)](https://github.com/RoxyAPI/tarot-api)

## License

MIT for this sample repo. See [LICENSE](LICENSE).

**Catalog licensing:** Personal and commercial use, including closed source proprietary apps. No AGPL or GPL entanglement. RoxyAPI APIs and SDKs are safe to embed in commercial products. Full terms at [roxyapi.com/policy/license](https://roxyapi.com/policy/license).

## Contact

- Site: [roxyapi.com](https://roxyapi.com)
- Status: [roxyapi.com/api-reference](https://roxyapi.com/api-reference)
