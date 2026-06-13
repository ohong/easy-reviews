# Session: Write a full test suite with acceptance criteria we could test the build against

- **Session ID:** `08112f32-12e5-4e42-b1ba-25cb0ee30298`
- **Started:** 2026-06-13 23:14:53 UTC
- **Ended:** 2026-06-13 23:15:23 UTC
- **Claude Code version:** 2.1.177
- **Git branch:** main

---

## 🧑 User · 2026-06-13 23:15:11 UTC

Write a full test suite with acceptance criteria we could test the build against to ensure all core user flows are working as expected with no bugs.

## 🤖 Assistant · 2026-06-13 23:15:16 UTC

I'll start by exploring the current state of the codebase to understand what exists and what to test against.

**🔧 Tool call: `Bash`**

```json
{
  "command": "ls -la && echo \"---DOCS---\" && ls -la docs/ 2>/dev/null && echo \"---PKG---\" && cat package.json 2>/dev/null && echo \"---no package.json above if empty---\"",
  "description": "List project structure and package.json"
}
```

<details><summary>⚠️ Tool Result (error)</summary>

```
Exit code 1
total 80
drwxr-xr-x    8 ohong  staff    256 Jun 13 16:02 .
drwx------@ 113 ohong  staff   3616 Jun 13 15:00 ..
-rw-r--r--@   1 ohong  staff   6148 Jun 13 15:51 .DS_Store
drwxr-xr-x@  13 ohong  staff    416 Jun 13 16:00 .git
-rw-r--r--    1 ohong  staff   8640 Jun 13 16:02 CLAUDE.md
drwxr-xr-x    7 ohong  staff    224 Jun 13 15:56 design
-rw-r--r--    1 ohong  staff  17616 Jun 13 16:02 design.md
drwxr-xr-x    4 ohong  staff    128 Jun 13 16:12 docs
---DOCS---
total 64
drwxr-xr-x  4 ohong  staff    128 Jun 13 16:12 .
drwxr-xr-x  8 ohong  staff    256 Jun 13 16:02 ..
-rw-r--r--@ 1 ohong  staff  15135 Jun 13 16:12 copy.md
-rw-r--r--  1 ohong  staff  14304 Jun 13 15:41 spec.md
---PKG---
```

</details>

## 🤖 Assistant · 2026-06-13 23:15:22 UTC

No application code exists yet — this is a pre-build project with a spec. Let me read the spec and supporting docs to derive the test suite against the intended behavior.

**🔧 Tool call: `Read`**

```json
{
  "file_path": "/Users/ohong/dev/easy-reviews/docs/spec.md"
}
```

<details><summary>↩️ Tool Result</summary>

```
1	# Easy Google Reviews — Product Brief & Functional Spec
2	*Working title. v0.1 — MVP scope.*
3	
4	## TL;DR
5	A web app that turns a sub-60-second multiple-choice interview into a well-written, **honest** Google review the user posts themselves. Two ways in: paste a Google Maps URL, or scan a QR a business hands you. The app pulls the business's category and recent reviews, generates a short tailored interview, then writes a review grounded strictly in the user's answers. User edits if they want, taps **Copy & open Google**, pastes into Google's review dialog.
6	
7	The defensibility thesis: this is *writing assistance, not fabrication*. The review only contains facts the user supplied, its tone matches the rating they gave (including critical), and a human posts it manually. That posture — especially supporting honest negative reviews — is what keeps it on the right side of Google's spam detection instead of in its crosshairs.
8	
9	**MVP boundary:** Google only; web only; no accounts/login, no voice, no photos, no business accounts, no monetization. Architected to extend to Airbnb/ClassPass and voice later.
10	
11	---
12	
13	## Positioning & copy
14	Borrow from Outset and Listen Labs: confident, spare, benefit-led copy; the *interview is the product* (one question at a time, warm, fast, a single strong CTA); clean editorial aesthetic with heavy whitespace. The twist on those references: they interview to *extract* research; we interview to *produce* a gift the user gives a business.
15	
16	Lead with the human relationship and ease — never "AI writes your reviews."
17	
18	**Hero candidates**
19	- *"Leave a review they'll remember — in under a minute."*
20	- *"Your favorite spot asked for a review. We'll help you write a great one."*
21	
22	**Subhead**
23	- *"A 60-second interview becomes an honest, well-written Google review — in your words, grounded in your visit."*
24	
25	**Framing principle (the through-line for all copy):** reduce decision fatigue, do a good thing, be remembered. The business appreciates it; you get the goodwill (and maybe the discount).
26	
27	---
28	
29	## Core user flow (happy path)
30	*Derived backwards from the end goal — "business remembers you" — then stated forwards.*
31	
32	1. **Entry.** User arrives via a pasted Maps URL or a business QR/link (`/review?placeId=…`).
33	2. **Resolve & confirm.** App resolves to a `place_id`, then shows a **confirmation card** (name, address, thumbnail) so a mis-resolution is caught before any work. *(Critical — see resolver risk.)*
34	3. **Prepare interview.** App fetches business category + up to ~5 reviews, generates (or loads cached) a 4–5 question set tailored to the category.
35	4. **Interview (<60s).** First question is an overall **1–5 rating**; remaining questions branch on it (highlights vs. what went wrong vs. mixed). Mostly single-select, one multi-select "what stood out," plus one optional free-text "anything else?"
36	5. **Generate.** Model writes one ~40–80 word review, grounded only in the answers, tone matched to the rating.
37	6. **Edit & post.** Inline-editable textarea + **Regenerate**. Result screen shows a **suggested star count** (the user's rating). **Copy & open Google** copies the text and deep-links to Google's review dialog, where the user sets stars and pastes.
38	
39	---
40	
41	## Functional requirements
42	
43	### FR-1 — Entry & business resolution
44	- **FR-1.1** Accept a pasted Google Maps URL: short links (`maps.app.goo.gl/*`, `goo.gl/maps/*`) and long `/maps/place/...@lat,lng...` URLs.
45	- **FR-1.2** Accept a QR/deep-link route `/review?placeId=<id>` that bypasses resolution entirely.
46	- **FR-1.3** Resolver pipeline (server-side):
47	  1. Follow redirects to expand short links.
48	  2. Parse business name from `/maps/place/<name>/` and coords from `@<lat>,<lng>`.
49	  3. Resolve via Places **Text Search (New)** using name + coordinate bias → take top candidate's `place_id`.
50	  4. Confirm by name similarity; if low confidence o
... [truncated, 14828 chars total]
```

</details>

**🔧 Tool call: `Read`**

```json
{
  "file_path": "/Users/ohong/dev/easy-reviews/docs/copy.md"
}
```

<details><summary>↩️ Tool Result</summary>

```
1	# Easy Reviews — Copy
2	
3	> The canonical copy for the landing page and key web-app screens. Frontend agents should pull strings from here so wording stays consistent across surfaces. Voice follows [design.md](../design.md) §8 and the integrity model in [spec.md](spec.md): warm, spare, benefit-led, human. **Never imply "AI writes your reviews"** — lead with the person and the business.
4	>
5	> Format: each screen lists the **shipping copy** first, then **alternatives** for headlines/CTAs, then short **why** notes. Words wrapped in _italics_ mark the single serif-italic emphasis the design calls for.
6	
7	---
8	
9	## Voice cheat-sheet (apply everywhere)
10	
11	- Lead with the **human + the business**, never the tool or the AI.
12	- Short, editorial, lowercase-friendly. One idea per line.
13	- Reassure **honesty and control** in passing, not in disclaimers: "in your words," "you stay in control," "grounded in your answers."
14	- Buttons carry **momentum**: action verb + forward arrow.
15	- Honest negatives are welcome — copy never assumes a 5★. Say "review," not "great review," in neutral moments.
16	- No exclamation points. No buzzwords (streamline, effortless-as-a-claim, AI-powered).
17	
18	---
19	
20	## 1. Landing page
21	
22	**Nav:** `Easy Reviews` (logo) · `How it works`
23	*(MVP has no auth — omit Sign in / Sign up.)*
24	
25	**Headline:** Turn a quick check-in into a _Google review_.
26	
27	**Subheadline:** Answer a few taps and get a review draft written in your words — grounded in your visit, ready in under a minute.
28	
29	**Entry options:**
30	- Input placeholder: `Paste a Google Maps link`
31	- Secondary: `Scan a QR` (for in-store codes)
32	- Helper under input: Paste a link to the place, or scan the code on your receipt.
33	
34	**Primary CTA:** Start in 45 sec →
35	
36	**Trust microcopy (under CTA):** No account needed. You post it yourself.
37	
38	**Value row (3 up):**
39	
40	| Fast | In your words | You stay in control |
41	|---|---|---|
42	| Under 60 seconds, start to copy. | Built only from what you tell us. Nothing invented. | You edit it and post it from your own Google account. |
43	
44	### Alternatives
45	**Headline**
46	- A — _Turn a quick check-in into a Google review._ — *(shipping)* mirrors the mockup; concrete verb, names the outcome, italic on the payoff word.
47	- B — _Your favorite spot asked for a review. We'll help you write a good one._ — relationship-led; warmer, longer. Good for QR/referral traffic.
48	- C — _Leave a review they'll remember — in under a minute._ — benefit + speed; less explicit about Google.
49	
50	**Primary CTA**
51	- A — `Start in 45 sec →` — *(shipping)* speed promise doubles as the CTA.
52	- B — `Write my review →` — outcome-led, first person.
53	- C — `Start the check-in →` — matches the "check-in" frame used elsewhere.
54	
55	### Why
56	- Headline names the transformation (check-in → review) instead of describing the tool. "Check-in" is light and low-commitment; "review" is the payoff.
57	- Subhead front-loads the two objections this product must answer immediately: *is it really mine?* ("in your words... grounded in your visit") and *is it fast?* ("under a minute").
58	- "No account needed. You post it yourself." kills the two biggest hesitations (signup friction + loss of control) in seven words.
59	- Value row is benefits, not features — each line ends in what it means for the user.
60	
61	---
62	
63	## 1a. How it works (landing section)
64	
65	*Anchored from the `How it works` nav link. Three steps, one line each — mirrors the actual flow.*
66	
67	**Section title:** Three taps from visit to _review_.
68	
69	| 1 · Point us to the place | 2 · Answer a few taps | 3 · Copy & post |
70	|---|---|---|
71	| Paste a Google Maps link or scan the code on your receipt. | A short check-in, tailored to where you went. Honest is fine. | We draft it in your words. You edit, then post from your own account. |
72	
73	**Closing line (under steps):** No account, no app, nothing invented
... [truncated, 16051 chars total]
```

</details>
