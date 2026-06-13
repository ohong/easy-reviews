# Easy Reviews — Copy

> The canonical copy for the landing page and key web-app screens. Frontend agents should pull strings from here so wording stays consistent across surfaces. Voice follows [design.md](../design.md) §8 and the integrity model in [spec.md](spec.md): warm, spare, benefit-led, human. **Never imply "AI writes your reviews"** — lead with the person and the business.
>
> Format: each screen lists the **shipping copy** first, then **alternatives** for headlines/CTAs, then short **why** notes. Words wrapped in _italics_ mark the single serif-italic emphasis the design calls for.

---

## Voice cheat-sheet (apply everywhere)

- Lead with the **human + the business**, never the tool or the AI.
- Short, editorial, lowercase-friendly. One idea per line.
- Reassure **honesty and control** in passing, not in disclaimers: "in your words," "you stay in control," "grounded in your answers."
- Buttons carry **momentum**: action verb + forward arrow.
- Honest negatives are welcome — copy never assumes a 5★. Say "review," not "great review," in neutral moments.
- No exclamation points. No buzzwords (streamline, effortless-as-a-claim, AI-powered).

---

## 1. Landing page

**Nav:** `Easy Reviews` (logo) · `How it works`
*(MVP has no auth — omit Sign in / Sign up.)*

**Headline:** Turn a quick check-in into a _Google review_.

**Subheadline:** Answer a few taps and get a review draft written in your words — grounded in your visit, ready in under a minute.

**Entry options:**
- Input placeholder: `Paste a Google Maps link`
- Secondary: `Scan a QR` (for in-store codes)
- Helper under input: Paste a link to the place, or scan the code on your receipt.

**Primary CTA:** Start in 45 sec →

**Trust microcopy (under CTA):** No account needed. You post it yourself.

**Value row (3 up):**

| Fast | In your words | You stay in control |
|---|---|---|
| Under 60 seconds, start to copy. | Built only from what you tell us. Nothing invented. | You edit it and post it from your own Google account. |

### Alternatives
**Headline**
- A — _Turn a quick check-in into a Google review._ — *(shipping)* mirrors the mockup; concrete verb, names the outcome, italic on the payoff word.
- B — _Your favorite spot asked for a review. We'll help you write a good one._ — relationship-led; warmer, longer. Good for QR/referral traffic.
- C — _Leave a review they'll remember — in under a minute._ — benefit + speed; less explicit about Google.

**Primary CTA**
- A — `Start in 45 sec →` — *(shipping)* speed promise doubles as the CTA.
- B — `Write my review →` — outcome-led, first person.
- C — `Start the check-in →` — matches the "check-in" frame used elsewhere.

### Why
- Headline names the transformation (check-in → review) instead of describing the tool. "Check-in" is light and low-commitment; "review" is the payoff.
- Subhead front-loads the two objections this product must answer immediately: *is it really mine?* ("in your words... grounded in your visit") and *is it fast?* ("under a minute").
- "No account needed. You post it yourself." kills the two biggest hesitations (signup friction + loss of control) in seven words.
- Value row is benefits, not features — each line ends in what it means for the user.

---

## 1a. How it works (landing section)

*Anchored from the `How it works` nav link. Three steps, one line each — mirrors the actual flow.*

**Section title:** Three taps from visit to _review_.

| 1 · Point us to the place | 2 · Answer a few taps | 3 · Copy & post |
|---|---|---|
| Paste a Google Maps link or scan the code on your receipt. | A short check-in, tailored to where you went. Honest is fine. | We draft it in your words. You edit, then post from your own account. |

**Closing line (under steps):** No account, no app, nothing invented — just your visit, written well.

### Why
- The nav promises "How it works"; this delivers it without a separate page. Three steps map 1:1 to entry → interview → handoff, so expectations match reality.
- "Honest is fine" appears early — the integrity model is a feature, not a footnote.

---

## 1b. Landing — closing CTA band

*Bottom of the landing page. Recap the value, repeat the action, reverse the risk.*

**Headline:** Your visit, in a review they'll _remember_.

**Subheadline:** Under a minute. In your words. Posted by you.

**Primary CTA:** Start in 45 sec →

**Risk reversal (under CTA):** No account. No sign-up. Nothing posts without you.

### Why
- A page needs a second ask for the reader who scrolled past the hero. This one recaps the three core promises (fast / yours / in control) in three fragments, then repeats the hero CTA verbatim so there's one consistent action.
- "Nothing posts without you" is the strongest risk-reversal we have — it answers the unspoken fear that the tool acts on the user's behalf.

---

## 2. Confirm business (after a pasted link)

**Step rail:** Find · Answer · Review · Post — *Find* active.

**Headline:** We found your business.

**Subheadline:** We'll tailor a quick check-in for this place. Right spot?

**Business card:** name · category · price · ★ rating (count) · address. *(Component, not copy.)*

**Context chips:**
- `We'll ask about` → the tailored topics (e.g. Atmosphere, Service, Drinks, Food, Value)
- `Recent themes` → pulled from reviews (e.g. Cozy, Friendly staff, Seasonal drinks, Quick service)

**Primary CTA:** Start 45-sec check-in →

**Secondary:** Not the right place? Search again

### Alternatives
**Headline**
- A — _We found your business._ — *(shipping)* plain, reassuring, fast.
- B — _Is this the place?_ — question form; puts confirmation front and center.

**CTA**
- A — `Start 45-sec check-in →` — *(shipping)*
- B — `Yes, this is it →` — confirmation-led; pairs well with headline B.

### Why
- This card exists because pasted-link resolution is the flakiest surface (spec §risks). The copy's job is to make confirming feel effortless and correcting feel safe — hence the prominent, friendly "Search again" escape hatch.
- "Right spot?" invites a quick yes without nagging.

---

## 3. Interview

**Progress:** `Question 2 of 5` + bar. Business name + card stay visible (quiet, collapsed).

### Q1 — Rating (always first)
**Prompt:** Overall, how was it?
**Helper:** Tap a star. This sets the tone — honest is fine.

### Branching prompts (swap on the Q1 rating)
- **≥4 (good):** What made it good?
- **3 (mixed):** What worked, and what didn't?
- **≤2 (rough):** What went wrong?

### Example follow-ups (restaurant/café)
- Single-select: What did you order?
- Multi-select: What stood out most? — helper: `Pick up to 3`
- Mood chips: How did it feel? — helper: `Pick any`
- Free text: Anything else worth mentioning? — placeholder: `Optional — a detail, a name, a moment...` — helper: `Skip if nothing comes to mind.`

**Controls:** `← Back` · `Skip` · `Continue →`
**Empty/last-step CTA:** Write my review →

### Why
- Q1 helper ("honest is fine") signals up front that low ratings are welcome — this is the integrity model doing UX work, and it keeps the tool off Google's 5★-farm radar.
- Branch headers mirror sentiment so a 2★ user is never asked "what made it great?" — sentiment fidelity starts at the question, not just the output.
- Free-text is explicitly optional ("Skip if nothing comes to mind") so the <60s promise holds.

---

## 4. Draft review

**Step rail:** *Review* active.

**Headline:** Here's your draft.

**Subheadline:** Built from your answers. Edit anything — it's yours.

**Answer recap (left rail):** small chips echoing inputs, e.g. `Atmosphere · Cozy`, `Service · Friendly`, `Value · Fair price`. Label: From your answers.

**Editor:** business card + editable review text.

**Refine chips:** `Shorter` · `Longer` · `More casual` · `Reset`

**Grounding badge:** 🔒 Grounded in your answers — only what you told us.

**Primary CTA:** Continue to post →

**Secondary:** Regenerate

### Alternatives
**Headline**
- A — _Here's your draft._ — *(shipping)* personal, calm, no hype.
- B — _Written from your visit._ — leans on grounding/authenticity.
- C — _In your words._ — shortest; reinforces ownership.

### Why
- "Edit anything — it's yours" reinforces human-in-the-loop and lowers the stakes of accepting a draft.
- The recap chips make the grounding *visible*: the user sees their own inputs become the review, which builds trust and invites edits.
- "Grounded in your answers — only what you told us" is the product's defensibility thesis, stated as a quiet reassurance rather than a legal disclaimer.

---

## 5. Ready to post (handoff)

**Step rail:** *Post* active.

**Headline:** Your review is ready.

**Subheadline:** Copy it, open Google Maps, and post it from your own account.

**Suggested stars:** You rated this `★★★★☆`. Set the same in Google.

**Primary CTA:** Copy & open Google →
**Secondary:** Copy again · Start over

**Trust badge:** 🔒 You stay in control — you post it, you can change it.

**How to post (3 steps):**
1. **Open Google Maps** — we'll take you to the review box.
2. **Paste your review** — it's already on your clipboard.
3. **Set your stars and post** — you're done.

**Fine print:** Google opens the review box but can't pre-fill it — paste takes one tap.

### Alternatives
**Headline**
- A — _Your review is ready._ — *(shipping)*
- B — _One paste away._ — emphasizes how little is left to do.

**Primary CTA**
- A — `Copy & open Google →` — *(shipping)* names both actions the button performs.
- B — `Copy & post on Google →` — outcome-led; slightly overpromises since posting is manual.

### Why
- The handoff is the friction point (copy-then-paste, two steps). Copy reframes that as control, not inconvenience: "post it from your own account," "you can change it."
- The 3-step explainer pre-empts confusion about why text and stars aren't already filled in — set expectations *before* the user hits Google's dialog, not after.
- Suggested-stars copy is advisory ("Set the same in Google"), never a claim that we set them.

---

## 6. Business QR self-serve

**Headline:** Get a QR that writes your reviews for you.
**Subheadline:** Customers scan, answer a few taps, and post an honest Google review — no app, no account.

**Search:** placeholder `Search for your business` · helper `Pick your Google listing so the code points to the right place.`

**After selection:** QR preview + link.
- **Primary CTA:** Download QR (PNG) · `Copy link`
- Helper: Print it on receipts, table tents, or the counter.

**Reassurance line:** Reviews stay honest — they're written from each customer's real visit, and customers post them from their own account.

### Why
- This page sells the *business* on the tool, so the value flips to "more good reviews, less asking." But the honesty line stays — it's the reason the tool survives, and businesses should understand it's not a rating farm.
- "no app, no account" removes the customer-friction objection a business owner will immediately have.

---

## 7. FAQ / objection handling

*Lives on the landing page (collapsible) and answers the hesitations that stop a first-time user. Each answer names the worry and resolves it in two sentences — no legalese.*

**Is this allowed by Google?**
Yes. You write an honest review about a real visit and post it yourself from your own account — exactly what Google asks for. We help you find the words; we never post for you.

**Are these really my words?**
Every review is built only from the answers you give. We don't invent dishes, names, or details — if you didn't say it, it's not in there. Edit any line before you post.

**Do I have to leave a good review?**
No. Tell us it was rough and the review says so, plainly. We match your rating, up or down — honest beats glowing.

**Do I need an account?**
No account, no app, no sign-up. Paste a link or scan a code and start.

**How long does it take?**
About 45 seconds of taps, then one paste into Google.

**Can I change it after?**
The draft is fully editable, and you post it manually — so you can tweak the wording right up to the moment it goes live, and edit it on Google later too.

### Why
- These six are the literal objections in the spec's risk section and integrity model: *is it legal, is it mine, must it be positive, is there friction, is it fast, am I in control.* Answering them on-page removes the reasons a cautious user bounces.
- Every answer restates an integrity pillar (grounded / sentiment-faithful / human-in-the-loop) in plain language — the defense is the marketing.

---

## 8. SEO / meta

**Page title (landing):** Easy Reviews — write an honest Google review in under a minute

**Meta description (landing):** Turn a quick check-in into a Google review written in your words. A few taps, a draft grounded in your real visit, and you post it yourself. No account needed.

**Page title (QR self-serve):** Easy Reviews for business — a QR that turns visits into honest reviews

**Meta description (QR self-serve):** Print a QR code. Customers scan, answer a few taps, and post an honest Google review from their own account. No app, no account, no rating farm.

**Open Graph headline:** Turn a quick check-in into a Google review.

### Why
- Title leads with the brand, names the outcome ("honest Google review"), and the speed promise — the three things a search-result skimmer needs.
- Meta description front-loads the same two objections the subhead answers (is it mine / is it fast) plus the friction-killer ("No account needed") because that line earns clicks.

---

## 9. Reusable strings

**Trust badges**
- `You post it yourself`
- `You stay in control`
- `Grounded in your answers`
- `In your words`
- `No account needed`

**Buttons**
- Forward: `Continue →`, `Start 45-sec check-in →`, `Write my review →`, `Copy & open Google →`
- Quiet: `Back`, `Skip`, `Regenerate`, `Search again`, `Copy again`, `Start over`

**Errors & edge cases**
- Link isn't a place: That link doesn't point to a business. Paste a Google Maps link to a specific place, or search by name. — action: `Search by name`
- Low-confidence match: We're not sure this is the right place. Pick the correct one below. — action: list candidates.
- No reviews/category found: We couldn't pull details for this place — you can still write a review from scratch.
- Generation failed: That didn't generate. Try again — your answers are saved. — action: `Try again`
- Empty interview submit: Add at least a rating so we have something to work from.
- Clipboard unsupported: Couldn't copy automatically. Select the text and copy it, then open Google.

### Why
- Error copy names the cause and the next action in one breath, and never blames the user. Pasted-link failures are expected (spec §risks), so their messages are the most carefully worded — always with a search fallback.

---

*Keep this file in sync with the UI. When a screen's wording changes, change it here first.*
