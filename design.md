# Easy Reviews — Design System

> The single source of truth for the look and feel of Easy Reviews. **Every frontend change must conform to this file.** When the mockups in [`/design`](./design) and this doc disagree, this doc wins; when this doc is silent, match the nearest mockup and add the pattern here.
>
> Reference mockups: [`web-landing`](./design/web-landing.png), [`web-select`](./design/web-select.png), [`web-questions`](./design/web-questions.png), [`web-draft`](./design/web-draft.png), [`web-ready`](./design/web-ready.png).
>
> Hex values and font names below are read from the mockups and are **starting tokens** — refine them once against real pixel-sampled values, then treat as fixed. Confidence is flagged where it matters.

---

## 1. Design soul (read this first)

**Editorial garden.** Warm, calm, and human — the opposite of a SaaS form. Think a beautifully set magazine page crossed with a botanical print: cream paper, deep-green ink, hand-drawn flowers blooming in from the margins. The interview *is* the product, so every screen should feel unhurried, generous with whitespace, and quietly confident.

Three words to hold in your head on every screen: **warm, grounded, effortless.**

- **Warm** — cream paper, soft earth tones, friendly serif headlines. Never cold, clinical, or grey-on-white.
- **Grounded** — the botanical/earth palette is not decoration for its own sake; it *embodies* the product's integrity promise ("grounded in your answers," reviews rooted in real visits). Plants, roots, soil. Keep it honest and unflashy.
- **Effortless** — one clear action per screen, large tap targets, obvious primary button. The user should never wonder what to do next.

**Influences:** Outset and Listen Labs — confident, spare, benefit-led copy; one question at a time; a single strong CTA; heavy whitespace. The twist: those tools interview to *extract*; we interview to help the user *give a gift* to a business. The aesthetic should feel like a thank-you note, not a survey.

**Anti-patterns (do not do these):** dense dashboards; pure-white `#FFF` page backgrounds; cold blue "tech" accents; drop shadows that look like Material Design; cramped forms; more than one primary button per view; emoji as UI; AI/robot imagery. We never say or imply "AI writes your review" — the visuals lead with the human and the business.

---

## 2. Color

A warm, earthy palette: cream paper, deep olive-green ink, with terracotta / mustard / sage botanicals as accents. Greens dominate functional UI; the warm florals are decorative and used sparingly for life and warmth.

### Core tokens

| Token | Hex (approx) | Role |
|---|---|---|
| `--paper` | `#F7F2E5` | App background ("paper"). The default canvas everywhere. |
| `--paper-tint` | `#F1EAD6` | Slightly deeper paper for inset/alt sections, subtle fills. |
| `--card` | `#FFFFFF` | Card / surface background. Sits on paper with a soft border + shadow. |
| `--ink` | `#2C3318` | Primary text & headlines. Near-black deep green, not pure black. |
| `--ink-soft` | `#5B6347` | Secondary text, captions, muted labels. |
| `--ink-faint` | `#8A8C76` | Placeholder text, disabled, fine print. |
| `--forest` | `#3C4A23` | **Primary brand green.** Primary buttons, key icons, emphasis. |
| `--forest-hover` | `#33401D` | Primary button hover/active. |
| `--olive` | `#5C6B2F` | Logo/wordmark green, links, mid-tone accents. |
| `--sage` | `#8B9D5B` | Soft green for secondary chips, leaf fills, success-ish states. |
| `--line` | `#E3DBC6` | Hairline borders on cards, inputs, dividers (warm, low-contrast). |

### Accent / botanical tokens (decorative + highlights)

| Token | Hex (approx) | Role |
|---|---|---|
| `--terracotta` | `#D9694A` | Coral/poppy decoration; warm accent, sparing. |
| `--mustard` | `#E6B33C` | Daisy decoration; warm highlight. |
| `--star` | `#E0A11E` | **Rating stars** (amber-gold). Reserved for star ratings — don't reuse as a UI accent. |
| `--success` | `#5C6B2F` | Confirmation / "grounded" / positive (reuse `--olive`). |

> **Rule of restraint:** functional UI (text, buttons, borders, chips) lives in the **green + cream + ink** family. Terracotta and mustard appear almost exclusively in the **corner botanical illustrations** and the occasional warm highlight — never as button fills or large blocks. The amber `--star` is reserved for rating stars so it always reads as "rating."

### Usage rules
- Page background is **always `--paper`**, never white. White is for cards/surfaces only.
- Primary actions: `--forest` fill, `--card`/white text.
- Body copy: `--ink` on paper or card. Secondary copy: `--ink-soft`. Never put `--ink-faint` on important text.
- Borders are warm and quiet (`--line`) — we separate with hairlines + shadow, not heavy strokes.
- Maintain WCAG AA (4.5:1) for body text. `--ink` on `--paper` and white-on-`--forest` both pass comfortably; verify any new pairing before shipping.

---

## 3. Typography

Two families: an **editorial serif** for display/headlines and a **clean grotesque sans** for UI and body. The serif carries the warmth and the brand; the sans carries clarity.

- **Display / headings — serif.** Mockups use a soft, modern old-style serif with expressive italics (e.g. "_Google review_", "ready."). **Recommended: [Fraunces](https://fonts.google.com/specimen/Fraunces)** (variable, free), which matches the wedge serifs and characterful italic. *(Confidence: medium — confirm against the source file; [Tiempos] or [Recoleta] are fallbacks if Fraunces isn't an exact match.)* Use the italic optical-size for emphasized words.
- **Body / UI — sans.** Clean neutral grotesque. **Recommended: [Inter](https://fonts.google.com/specimen/Inter)** (or **Geist**, also fine). *(Confidence: medium.)*

```
--font-serif: 'Fraunces', Georgia, 'Times New Roman', serif;
--font-sans:  'Inter', system-ui, -apple-system, sans-serif;
```

### Type scale (desktop; scale down ~1 step on mobile)

| Use | Family | Size / line-height | Weight | Notes |
|---|---|---|---|---|
| Hero / page title (`h1`) | serif | 44–56px / 1.05 | 500–600 | Tight leading. Italicize the key phrase only (e.g. "_Google review_"). |
| Section title (`h2`) | serif | 30–36px / 1.1 | 500 | e.g. "What stood out most?", "Here's your draft." |
| Card / sub-head (`h3`) | serif **or** sans | 20–22px / 1.25 | 500–600 | Business name uses sans-semibold; editorial headers use serif. |
| Body | sans | 16px / 1.55 | 400 | Default. Generated review text sits here, readable and relaxed. |
| Body-small / caption | sans | 14px / 1.45 | 400 | Secondary labels, addresses, helper text in `--ink-soft`. |
| Micro / overline | sans | 12–13px / 1.3 | 500 | Step labels, badges, fine print. Often `--ink-soft`, sometimes uppercase with light tracking. |

### Rules
- **One serif headline per screen** is the anchor. Don't scatter serif everywhere — it loses its weight.
- Use serif **italic** for the single emphasized word/phrase in a headline. Never italicize whole sentences.
- Body and all interactive labels are **sans**. Buttons are sans, medium weight.
- Generous line-height on body (≥1.5) — this is a reading product.

---

## 4. Spacing, radius, shadow, layout

**Spacing** — 4px base scale: `4, 8, 12, 16, 24, 32, 48, 64`. Lean generous; whitespace is a feature, not waste. Section vertical rhythm on desktop is large (48–96px between major blocks).

**Radius** — soft, friendly, consistent:
```
--radius-sm: 10px;   /* chips, small controls, inputs */
--radius-md: 16px;   /* cards, option tiles */
--radius-lg: 24px;   /* large surfaces, modals */
--radius-pill: 999px; /* primary/secondary buttons, badges, step dots */
```
Buttons and badges are **pill-shaped**. Cards and tiles use `--radius-md`. Nothing in this product has sharp 0px corners.

**Shadow** — soft, warm, low — never harsh Material elevation:
```
--shadow-card: 0 1px 2px rgba(44,51,24,.04), 0 8px 24px rgba(44,51,24,.06);
--shadow-pop:  0 4px 12px rgba(44,51,24,.08), 0 16px 40px rgba(44,51,24,.10);
```
Shadows are tinted with the ink-green, not neutral grey. Cards get `--shadow-card`; raised/active elements (open option modal, primary CTA on hover) get `--shadow-pop`.

**Layout**
- **Max content width ~1120px**, centered, with comfortable gutters.
- **Landing / draft / ready:** two-column — editorial text/actions on the left, a visual or business/preview card on the right.
- **Interview (questions):** single centered column, content card floated on paper. One question fills the focus area.
- **Botanical illustrations bleed from the page corners** (see §7) behind content — they frame, never crowd. Content always sits on clear paper with safe margins.
- **Mobile:** single column throughout; columns stack (text above card); botanicals reduce to one or two corner accents; tap targets ≥44px.

---

## 5. Components

General: rounded, warm, soft-bordered, one clear primary per view. Built on **Tailwind + shadcn/ui** (per the stack) — restyle shadcn primitives with these tokens rather than shipping defaults. **Framer Motion** drives interview transitions (see §6).

### Buttons
- **Primary** — `--forest` fill, white text, pill, medium weight, comfortable padding (~`12px 24px`). Often a trailing arrow `→` for forward motion ("Start in 45 sec →", "Continue →", "Open Google Maps →"). Hover → `--forest-hover` + slight lift (`--shadow-pop`). **One per screen.**
- **Secondary / ghost** — transparent or `--card` fill, `--line` border, `--ink` text, pill. For "Back", "Copy review again", "Not the right business?".
- **Tertiary / text link** — `--olive`, underline on hover. For low-emphasis actions ("Skip", "Continue to share" when secondary).
- **Small inline editor chips** (draft screen: "Shorter", "More casual", "Reset") — small pill, `--line` border, `--card` fill, sans-14, often a leading mini-icon.

### Cards & surfaces
- White (`--card`) on paper, `--radius-md`, `--line` 1px border, `--shadow-card`.
- **Business card** (recurring hero element): rounded thumbnail photo, leaf/brand glyph, business name (sans-semibold), category + price + amber star rating with review count. This card is the product's recurring "anchor" — keep it visually consistent across landing, select, questions, draft, and ready screens.

### Option tiles & chips (interview)
- **Selectable tiles** ("What stood out most?"): grid of square-ish tiles, `--radius-md`, `--card`/`--paper-tint` fill, a simple line **icon** above a short **label** (Atmosphere, Friendly staff, Coffee, Food, Speed, Value, Cleanliness, Nothing special). Selected = `--forest` border + soft `--sage`/green tint fill + checked affordance.
- **Small chips** ("How did it feel?": Cozy, Bright, Calm, Modern): pill, leading mini-icon, `--line` border default, green fill/border when selected. Multi-select shows multiple actives.
- Always indicate single- vs multi-select in a quiet helper line ("Pick up to 3").

### Rating (Q1)
- 1–5 **amber stars** (`--star`), large and tappable. Filled vs outline states. This is the gateway question — make it feel premium and obvious.

### Badges / pills
- **Trust badges**: lock icon + "You stay in control", shield/leaf + "Grounded in your answers" — small pill, `--paper-tint` or subtle green tint, `--ink-soft` text. These reinforce the integrity model and should appear at key moments (landing, draft, ready).
- **Category / theme tags** ("Atmosphere", "Service", "Seasonal drinks"): quiet pills, `--paper-tint` fill, `--ink-soft`.

### Inputs
- Text input / URL paste: `--card` fill, `--line` border, `--radius-sm`, sans-16, `--ink-faint` placeholder. Paired actions sit inline (e.g. "Paste Google Maps URL" with a "Scan QR" affordance beside it).
- Textarea (draft review): same styling, generous height, clearly editable, body type at reading size.

### Progress / stepper
- **Top step rail**: `Find → Answer → Review → Post`, each a small labeled dot/icon (magnifier, pencil, star, Google "G"), connected, with the current step emphasized in `--forest` and completed steps marked. Keep it lightweight and editorial.
- **Question counter**: "Question 2 of 5" + a thin progress bar in `--forest` on `--line` track.

### Third-party / Google handoff
- "Post on Google" / "Open Google Maps" uses the **official multicolor Google "G"** per Google brand rules. This is the *only* place multicolor brand color appears — everywhere else stays in palette.
- The "How to post in 3 simple steps" panel uses numbered cards with small, friendly illustrative thumbnails matching the palette.

---

## 6. Motion

Per the spec, Framer Motion gives the interview its Outset/Listen-Labs polish. Motion is **smooth, soft, and quick** — it should feel like turning a page, never bouncy or attention-seeking.

- **Question transitions:** one-question-at-a-time. Advance = gentle slide + fade (outgoing left/up, incoming from right/down), ~250–350ms, soft ease-out. Back reverses it.
- **Selection feedback:** tiles/chips animate fill + border on select in ~120–150ms; subtle scale (≤1.02) press feedback.
- **Primary CTA:** small lift on hover (translateY -1–2px + shadow grow).
- **Draft reveal / "Here's your draft":** the generated text can fade/rise in gently to feel "written for you."
- **Botanicals:** static, or at most a very slow, subtle parallax/drift on scroll. They must never distract from the content.
- **Respect `prefers-reduced-motion`:** replace slides/parallax with simple fades; keep durations short. Always provide the reduced path.

Defaults: durations 150–350ms; easing soft ease-out (`cubic-bezier(.22,.61,.36,1)` or similar). Avoid spring overshoot except for tiny, intentional delight.

---

## 7. Botanical illustration & imagery

The hand-drawn florals are the brand's signature. They convey "grounded," warm, and human.

- **Motifs:** coral/terracotta poppies, mustard daisies with orange centers, sage and olive leaves/fronds — flat, slightly textured, illustrative (not photoreal, not corporate vector-gradient).
- **Placement:** bleed in from page **corners and edges** behind content (top-right daisy cluster, left/bottom-left poppies, right-edge leaves). They frame the composition and fill negative space at the margins.
- **Density:** generous on the landing and "ready" hero moments; **dialed back** during the interview so focus stays on the question. Never let illustration reduce text contrast or crowd interactive elements — content sits on clean paper with safe spacing.
- **Photography:** business thumbnails come from Places. Always rounded (`--radius-md`), warm, never full-bleed edge-to-edge of the viewport — they live inside cards.
- **Iconography:** simple, single-weight **line icons** in `--ink`/`--forest` (Lucide-style fits shadcn). Friendly and minimal; match stroke weight everywhere. No filled/duotone tech icons, no emoji in UI.
- **Logo:** the green sunflower/sunburst glyph + "Easy Reviews" wordmark. Keep clear space around it; render in `--forest`/`--olive` on paper.

---

## 8. Voice & copy (visual tone)

Copy is part of the design. Warm, spare, benefit-led, human.

- Lead with the **human + the business**, never the AI ("Turn a quick check-in into a _Google review_", "Your favorite spot asked for a review").
- Headlines short and editorial, lowercase-friendly, one italic emphasis ("Here's your draft.", "Your review is ready.").
- Reassure control and honesty inline: "You stay in control", "Grounded in your answers", "in your words".
- Buttons are action + momentum: "Start 45-sec check-in →", "Continue →", "Open Google Maps →".
- Never imply fabrication, bulk reviews, or "we post for you." The tone mirrors the integrity model in [docs/spec.md](./docs/spec.md).

---

## 9. Implementation notes for agents

- **Stack:** Next.js (App Router) + Tailwind + shadcn/ui + Framer Motion. Define the tokens above as CSS variables on `:root` and map them into `tailwind.config` (`theme.extend.colors`, `borderRadius`, `boxShadow`, `fontFamily`) so utilities like `bg-paper`, `text-ink`, `bg-forest`, `rounded-md`, `shadow-card` exist. Don't hardcode hex in components — reference tokens.
- **Restyle, don't reinvent:** wrap shadcn primitives (Button, Card, Badge, Input, Progress) with these tokens. New components should compose from the same primitives so every surface stays cohesive.
- **The business card and the step rail are shared components** — build them once and reuse across all screens; they are the through-line that makes the product feel like one piece.
- **Mobile-first parity:** every screen must work in a single column with ≥44px targets; the interview must be completable one-handed in <60s.
- **Accessibility:** AA contrast on all text; visible focus rings (use `--forest` ring on `--paper`); honor `prefers-reduced-motion`; stars and selection states need non-color affordances (fill/check), not color alone.

### ⚠️ Known mockup/scope mismatch
The mockups show **"Sign in / Sign up"** in the top nav, but the **MVP has no auth/accounts** (see [docs/spec.md](./docs/spec.md) §FR-5 and CLAUDE.md). **For MVP, omit Sign in/Sign up** from the nav — keep only the logo, "How it works", and (optionally) a single primary CTA. Treat the auth UI in the mockups as a post-MVP placeholder, not a build target. Flag any other spec/mockup conflicts the same way rather than guessing.

---

*Tokens are starting values read from the mockups; sample the source files to lock exact hex/fonts, then keep this file authoritative. Update this doc whenever a new pattern is introduced so it never drifts from what ships.*
