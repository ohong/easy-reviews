# Session: make this a git project, add a project-specific claude.md and push to my github,

- **Session ID:** `6cbeea4b-fba2-40b8-b0da-9ded66848243`
- **Started:** 2026-06-13 22:23:44 UTC
- **Ended:** 2026-06-13 23:13:07 UTC
- **Claude Code version:** 2.1.173
- **Git branch:** HEAD

---

## 🧑 User · 2026-06-13 22:23:56 UTC

<command-name>/model</command-name>
            <command-message>model</command-message>
            <command-args></command-args>

## 🧑 User · 2026-06-13 22:23:56 UTC

<local-command-stdout>Set model to [1mSonnet 4.6 (default)[22m and saved as your default for new sessions</local-command-stdout>

## 🧑 User · 2026-06-13 22:24:44 UTC

make this a git project, add a project-specific claude.md and push to my github, add @shjavokhir as a collaborator to the repo

## 🤖 Assistant · 2026-06-13 22:24:48 UTC

Let me check what's in the current directory first.

**🔧 Tool call: `Bash`**

```json
{
  "command": "ls -la /Users/ohong/dev/easy-reviews",
  "description": "List files in project directory"
}
```

<details><summary>↩️ Tool Result</summary>

```
total 0
drwxr-xr-x    2 ohong  staff    64 Jun 13 15:00 .
drwx------@ 113 ohong  staff  3616 Jun 13 15:00 ..
```

</details>

## 🤖 Assistant · 2026-06-13 22:24:54 UTC

Empty directory. I'll initialize git, create a CLAUDE.md, set up the GitHub repo, and add the collaborator.

**🔧 Tool call: `Bash`**

```json
{
  "command": "git init",
  "description": "Initialize git repository"
}
```

<details><summary>↩️ Tool Result</summary>

```
Initialized empty Git repository in /Users/ohong/dev/easy-reviews/.git/
```

</details>

**🔧 Tool call: `Write`**

````json
{
  "file_path": "/Users/ohong/dev/easy-reviews/CLAUDE.md",
  "content": "# easy-reviews\n\n## Project Overview\nA tool to make code reviews easier and more efficient.\n\n## Tech Stack\n- Runtime: Bun\n- Language: TypeScript\n\n## Development\n\n### Setup\n```bash\nbun install\n```\n\n### Run\n```bash\nbun dev\n```\n\n### Test\n```bash\nbun test\n```\n\n## Conventions\n- Use Bun for all JS/TS tooling\n- Follow the ohong Engineering Philosophy (see global CLAUDE.md)\n- Keep modules small and focused with clear interfaces\n"
}
````

<details><summary>↩️ Tool Result</summary>

```
File created successfully at: /Users/ohong/dev/easy-reviews/CLAUDE.md (file state is current in your context — no need to Read it back)
```

</details>

**🔧 Tool call: `Bash`**

```json
{
  "command": "git add CLAUDE.md && git commit -m \"$(cat <<'EOF'\nInitial commit\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>\nEOF\n)\"",
  "description": "Stage and commit CLAUDE.md"
}
```

<details><summary>↩️ Tool Result</summary>

```
[main (root-commit) d126528] Initial commit
 1 file changed, 30 insertions(+)
 create mode 100644 CLAUDE.md
```

</details>

**🔧 Tool call: `Bash`**

```json
{
  "command": "gh repo create easy-reviews --private --source=. --remote=origin --push",
  "description": "Create GitHub repo and push"
}
```

<details><summary>↩️ Tool Result</summary>

```
https://github.com/ohong/easy-reviews
To github.com:ohong/easy-reviews.git
 * [new branch]      HEAD -> main
branch 'main' set up to track 'origin/main'.
```

</details>

**🔧 Tool call: `Bash`**

```json
{
  "command": "gh api repos/ohong/easy-reviews/collaborators/shjavokhir -X PUT -f permission=push",
  "description": "Add shjavokhir as collaborator with push access"
}
```

<details><summary>↩️ Tool Result</summary>

```
{"id":322332556,"node_id":"RI_kwDOS5-QM84TNmeM","repository":{"id":1268748339,"node_id":"R_kgDOS5-QMw","name":"easy-reviews","full_name":"ohong/easy-reviews","private":true,"owner":{"login":"ohong","id":15037940,"node_id":"MDQ6VXNlcjE1MDM3OTQw","avatar_url":"https://avatars.githubusercontent.com/u/15037940?v=4","gravatar_id":"","url":"https://api.github.com/users/ohong","html_url":"https://github.com/ohong","followers_url":"https://api.github.com/users/ohong/followers","following_url":"https://api.github.com/users/ohong/following{/other_user}","gists_url":"https://api.github.com/users/ohong/gists{/gist_id}","starred_url":"https://api.github.com/users/ohong/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/ohong/subscriptions","organizations_url":"https://api.github.com/users/ohong/orgs","repos_url":"https://api.github.com/users/ohong/repos","events_url":"https://api.github.com/users/ohong/events{/privacy}","received_events_url":"https://api.github.com/users/ohong/received_events","type":"User","user_view_type":"public","site_admin":false},"html_url":"https://github.com/ohong/easy-reviews","description":null,"fork":false,"url":"https://api.github.com/repos/ohong/easy-reviews","forks_url":"https://api.github.com/repos/ohong/easy-reviews/forks","keys_url":"https://api.github.com/repos/ohong/easy-reviews/keys{/key_id}","collaborators_url":"https://api.github.com/repos/ohong/easy-reviews/collaborators{/collaborator}","teams_url":"https://api.github.com/repos/ohong/easy-reviews/teams","hooks_url":"https://api.github.com/repos/ohong/easy-reviews/hooks","issue_events_url":"https://api.github.com/repos/ohong/easy-reviews/issues/events{/number}","events_url":"https://api.github.com/repos/ohong/easy-reviews/events","assignees_url":"https://api.github.com/repos/ohong/easy-reviews/assignees{/user}","branches_url":"https://api.github.com/repos/ohong/easy-reviews/branches{/branch}","tags_url":"https://api.github.com/repos/ohong/easy-reviews/tags","blobs_url":"https://api.github.com/repos/ohong/easy-reviews/git/blobs{/sha}","git_tags_url":"https://api.github.com/repos/ohong/easy-reviews/git/tags{/sha}","git_refs_url":"https://api.github.com/repos/ohong/easy-reviews/git/refs{/sha}","trees_url":"https://api.github.com/repos/ohong/easy-reviews/git/trees{/sha}","statuses_url":"https://api.github.com/repos/ohong/easy-reviews/statuses/{sha}","languages_url":"https://api.github.com/repos/ohong/easy-reviews/languages","stargazers_url":"https://api.github.com/repos/ohong/easy-reviews/stargazers","contributors_url":"https://api.github.com/repos/ohong/easy-reviews/contributors","subscribers_url":"https://api.github.com/repos/ohong/easy-reviews/subscribers","subscription_url":"https://api.github.com/repos/ohong/easy-reviews/subscription","commits_url":"https://api.github.com/repos/ohong/easy-reviews/commits{/sha}","git_commits_url":"https://api.github.com/repos/ohong/easy-reviews/git/commits{/sha}","comments_url":"https://api.github.com/repos/ohong/easy-reviews/comments{/number}","issue_comment_url":"https://api.github.com/repos/ohong/easy-reviews/issues/comments{/number}","contents_url":"https://api.github.com/repos/ohong/easy-reviews/contents/{+path}","compare_url":"https://api.github.com/repos/ohong/easy-reviews/compare/{base}...{head}","merges_url":"https://api.github.com/repos/ohong/easy-reviews/merges","archive_url":"https://api.github.com/repos/ohong/easy-reviews/{archive_format}{/ref}","downloads_url":"https://api.github.com/repos/ohong/easy-reviews/downloads","issues_url":"https://api.github.com/repos/ohong/easy-reviews/issues{/number}","pulls_url":"https://api.github.com/repos/ohong/easy-reviews/pulls{/number}","milestones_url":"https://api.github.com/repos/ohong/easy-reviews/milestones{/number}","notifications_url":"https://api.github.com/repos/ohong/easy-reviews/notifications{?since,all,participating}","labels_url":"https://api.github.com/repos/ohong/easy-reviews/labels{/name}","releases_url":"https://api.github.com/re
... [truncated, 6185 chars total]
```

</details>

## 🤖 Assistant · 2026-06-13 22:25:32 UTC

Done. Here's what was set up:

- Git repo initialized with an initial commit
- `CLAUDE.md` created with project overview, tech stack (Bun/TypeScript), and dev commands
- Repo pushed to **https://github.com/ohong/easy-reviews** (private)
- `@ShJavokhir` invited as a collaborator with write access (invitation pending their acceptance)

> _system (2026-06-13 22:28:36 UTC): Set up easy-reviews as a new git project with a CLAUDE.md and pushed it to github.com/ohong/easy-reviews. Next step is to start building the actual project. (disable recaps in /config)_

## 🧑 User · 2026-06-13 23:11:23 UTC

<command-name>/login</command-name>
            <command-message>login</command-message>
            <command-args></command-args>

## 🧑 User · 2026-06-13 23:11:23 UTC

<local-command-stdout>Login successful</local-command-stdout>

## 🧑 User · 2026-06-13 23:11:34 UTC

in /docs, create a copy.md, use the copywriting skill to write the key copy for our landing page + key screens of the web app. Just write to the markdown file for now, not the codebase itself.

## 🤖 Assistant · 2026-06-13 23:11:38 UTC

I'll check the existing docs for context, then invoke the copywriting skill.

**🔧 Tool call: `Bash`**

```json
{
  "command": "ls -la /Users/ohong/dev/easy-reviews/docs 2>/dev/null; echo \"---\"; ls -la /Users/ohong/dev/easy-reviews",
  "description": "Check docs directory contents"
}
```

<details><summary>↩️ Tool Result</summary>

```
total 56
drwxr-xr-x  4 ohong  staff    128 Jun 13 16:07 .
drwxr-xr-x  8 ohong  staff    256 Jun 13 16:02 ..
-rw-r--r--  1 ohong  staff  10986 Jun 13 16:07 copy.md
-rw-r--r--  1 ohong  staff  14304 Jun 13 15:41 spec.md
---
total 80
drwxr-xr-x    8 ohong  staff    256 Jun 13 16:02 .
drwx------@ 113 ohong  staff   3616 Jun 13 15:00 ..
-rw-r--r--@   1 ohong  staff   6148 Jun 13 15:51 .DS_Store
drwxr-xr-x@  13 ohong  staff    416 Jun 13 16:00 .git
-rw-r--r--    1 ohong  staff   8640 Jun 13 16:02 CLAUDE.md
drwxr-xr-x    7 ohong  staff    224 Jun 13 15:56 design
-rw-r--r--    1 ohong  staff  17616 Jun 13 16:02 design.md
drwxr-xr-x    4 ohong  staff    128 Jun 13 16:07 docs
```

</details>

## 🤖 Assistant · 2026-06-13 23:11:42 UTC

A `copy.md` already exists. Let me read the spec and existing copy to understand context before invoking the copywriting skill.

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

## 🤖 Assistant · 2026-06-13 23:11:45 UTC

Now let me see the existing copy.md and skim the design system for voice/tone.

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
39	| | |
40	|---|---|
41	| **Fast** — Under 60 seconds, start to copy. |
42	| **In your words** — Built only from what you tell us. Nothing invented. |
43	| **You stay in control** — You edit it and post it from your own Google account. |
44	
45	### Alternatives
46	**Headline**
47	- A — _Turn a quick check-in into a Google review._ — *(shipping)* mirrors the mockup; concrete verb, names the outcome, italic on the payoff word.
48	- B — _Your favorite spot asked for a review. We'll help you write a good one._ — relationship-led; warmer, longer. Good for QR/referral traffic.
49	- C — _Leave a review they'll remember — in under a minute._ — benefit + speed; less explicit about Google.
50	
51	**Primary CTA**
52	- A — `Start in 45 sec →` — *(shipping)* speed promise doubles as the CTA.
53	- B — `Write my review →` — outcome-led, first person.
54	- C — `Start the check-in →` — matches the "check-in" frame used elsewhere.
55	
56	### Why
57	- Headline names the transformation (check-in → review) instead of describing the tool. "Check-in" is light and low-commitment; "review" is the payoff.
58	- Subhead front-loads the two objections this product must answer immediately: *is it really mine?* ("in your words... grounded in your visit") and *is it fast?* ("under a minute").
59	- "No account needed. You post it yourself." kills the two biggest hesitations (signup friction + loss of control) in seven words.
60	- Value row is benefits, not features — each line ends in what it means for the user.
61	
62	---
63	
64	## 2. Confirm business (after a pasted link)
65	
66	**Step rail:** Find · Answer · Review · Post — *Find* active.
67	
68	**Headline:** We found your business.
69	
70	**Subheadline:** We'll tailor a quick check-in for this place. Right spot?
71	
72	**Business card:** name · category · price · ★ rating (count) · address. *(Component, not copy.)*
73	
74	**Context chips:**
75	- `We'll ask about` → the tailored topics (e.g. Atmosphere, Service, Drinks, Food, Value)
76	- `Recent themes` → pulled from reviews (e.g. Cozy, Friendly staff, Seasonal drinks, Quick s
... [truncated, 11609 chars total]
```

</details>

## 🤖 Assistant · 2026-06-13 23:11:51 UTC

A solid `copy.md` already exists. The user explicitly asked me to use the copywriting skill, so let me invoke it to write/refine the copy properly.

**🔧 Tool call: `Skill`**

```json
{
  "skill": "copywriting"
}
```

<details><summary>↩️ Tool Result</summary>

```
Launching skill: copywriting
```

</details>

## 🧑 User · 2026-06-13 23:11:51 UTC

Base directory for this skill: /Users/ohong/.claude/skills/copywriting

# Copywriting

You are an expert conversion copywriter. Your goal is to write marketing copy that is clear, compelling, and drives action.

## Before Writing

**Check for product marketing context first:**
If `.claude/product-marketing-context.md` exists, read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Gather this context (ask if not provided):

### 1. Page Purpose
- What type of page? (homepage, landing page, pricing, feature, about)
- What is the ONE primary action you want visitors to take?

### 2. Audience
- Who is the ideal customer?
- What problem are they trying to solve?
- What objections or hesitations do they have?
- What language do they use to describe their problem?

### 3. Product/Offer
- What are you selling or offering?
- What makes it different from alternatives?
- What's the key transformation or outcome?
- Any proof points (numbers, testimonials, case studies)?

### 4. Context
- Where is traffic coming from? (ads, organic, email)
- What do visitors already know before arriving?

---

## Copywriting Principles

### Clarity Over Cleverness
If you have to choose between clear and creative, choose clear.

### Benefits Over Features
Features: What it does. Benefits: What that means for the customer.

### Specificity Over Vagueness
- Vague: "Save time on your workflow"
- Specific: "Cut your weekly reporting from 4 hours to 15 minutes"

### Customer Language Over Company Language
Use words your customers use. Mirror voice-of-customer from reviews, interviews, support tickets.

### One Idea Per Section
Each section should advance one argument. Build a logical flow down the page.

---

## Writing Style Rules

### Core Principles

1. **Simple over complex** — "Use" not "utilize," "help" not "facilitate"
2. **Specific over vague** — Avoid "streamline," "optimize," "innovative"
3. **Active over passive** — "We generate reports" not "Reports are generated"
4. **Confident over qualified** — Remove "almost," "very," "really"
5. **Show over tell** — Describe the outcome instead of using adverbs
6. **Honest over sensational** — Never fabricate statistics or testimonials

### Quick Quality Check

- Jargon that could confuse outsiders?
- Sentences trying to do too much?
- Passive voice constructions?
- Exclamation points? (remove them)
- Marketing buzzwords without substance?

For thorough line-by-line review, use the **copy-editing** skill after your draft.

---

## Best Practices

### Be Direct
Get to the point. Don't bury the value in qualifications.

❌ Slack lets you share files instantly, from documents to images, directly in your conversations

✅ Need to share a screenshot? Send as many documents, images, and audio files as your heart desires.

### Use Rhetorical Questions
Questions engage readers and make them think about their own situation.
- "Hate returning stuff to Amazon?"
- "Tired of chasing approvals?"

### Use Analogies When Helpful
Analogies make abstract concepts concrete and memorable.

### Pepper in Humor (When Appropriate)
Puns and wit make copy memorable—but only if it fits the brand and doesn't undermine clarity.

---

## Page Structure Framework

### Above the Fold

**Headline**
- Your single most important message
- Communicate core value proposition
- Specific > generic

**Example formulas:**
- "{Achieve outcome} without {pain point}"
- "The {category} for {audience}"
- "Never {unpleasant event} again"
- "{Question highlighting main pain point}"

**For comprehensive headline formulas**: See [references/copy-frameworks.md](references/copy-frameworks.md)

**For natural transition phrases**: See [references/natural-transitions.md](references/natural-transitions.md)

**Subheadline**
- Expands on headline
- Adds specificity
- 1-2 sentences max

**Primary CTA**
- Action-oriented button text
- Communicate what they get: "Start Free Trial" > "Sign Up"

### Core Sections

| Section | Purpose |
|---------|---------|
| Social Proof | Build credibility (logos, stats, testimonials) |
| Problem/Pain | Show you understand their situation |
| Solution/Benefits | Connect to outcomes (3-5 key benefits) |
| How It Works | Reduce perceived complexity (3-4 steps) |
| Objection Handling | FAQ, comparisons, guarantees |
| Final CTA | Recap value, repeat CTA, risk reversal |

**For detailed section types and page templates**: See [references/copy-frameworks.md](references/copy-frameworks.md)

---

## CTA Copy Guidelines

**Weak CTAs (avoid):**
- Submit, Sign Up, Learn More, Click Here, Get Started

**Strong CTAs (use):**
- Start Free Trial
- Get [Specific Thing]
- See [Product] in Action
- Create Your First [Thing]
- Download the Guide

**Formula:** [Action Verb] + [What They Get] + [Qualifier if needed]

Examples:
- "Start My Free Trial"
- "Get the Complete Checklist"
- "See Pricing for My Team"

---

## Page-Specific Guidance

### Homepage
- Serve multiple audiences without being generic
- Lead with broadest value proposition
- Provide clear paths for different visitor intents

### Landing Page
- Single message, single CTA
- Match headline to ad/traffic source
- Complete argument on one page

### Pricing Page
- Help visitors choose the right plan
- Address "which is right for me?" anxiety
- Make recommended plan obvious

### Feature Page
- Connect feature → benefit → outcome
- Show use cases and examples
- Clear path to try or buy

### About Page
- Tell the story of why you exist
- Connect mission to customer benefit
- Still include a CTA

---

## Voice and Tone

Before writing, establish:

**Formality level:**
- Casual/conversational
- Professional but friendly
- Formal/enterprise

**Brand personality:**
- Playful or serious?
- Bold or understated?
- Technical or accessible?

Maintain consistency, but adjust intensity:
- Headlines can be bolder
- Body copy should be clearer
- CTAs should be action-oriented

---

## Output Format

When writing copy, provide:

### Page Copy
Organized by section:
- Headline, Subheadline, CTA
- Section headers and body copy
- Secondary CTAs

### Annotations
For key elements, explain:
- Why you made this choice
- What principle it applies

### Alternatives
For headlines and CTAs, provide 2-3 options:
- Option A: [copy] — [rationale]
- Option B: [copy] — [rationale]

### Meta Content (if relevant)
- Page title (for SEO)
- Meta description

---

## Related Skills

- **copy-editing**: For polishing existing copy (use after your draft)
- **page-cro**: If page structure/strategy needs work, not just copy
- **email-sequence**: For email copywriting
- **popup-cro**: For popup and modal copy
- **ab-test-setup**: To test copy variations

## 🤖 Assistant · 2026-06-13 23:11:56 UTC

Let me check the design system's voice section and any product-marketing context to align the copy.

**🔧 Tool call: `Bash`**

```json
{
  "command": "cat /Users/ohong/dev/easy-reviews/.claude/product-marketing-context.md 2>/dev/null || echo \"NO PMC FILE\"; echo \"==== design.md voice section ====\"; grep -n -A 30 -i \"voice\\|tone\\|\u00a78\\|## 8\\|writing\\|copy\" /Users/ohong/dev/easy-reviews/design.md | head -80",
  "description": "Check product marketing context and design voice"
}
```

<details><summary>↩️ Tool Result</summary>

```
NO PMC FILE
==== design.md voice section ====
17:- **Warm** — cream paper, soft earth tones, friendly serif headlines. Never cold, clinical, or grey-on-white.
18-- **Grounded** — the botanical/earth palette is not decoration for its own sake; it *embodies* the product's integrity promise ("grounded in your answers," reviews rooted in real visits). Plants, roots, soil. Keep it honest and unflashy.
19-- **Effortless** — one clear action per screen, large tap targets, obvious primary button. The user should never wonder what to do next.
20-
21:**Influences:** Outset and Listen Labs — confident, spare, benefit-led copy; one question at a time; a single strong CTA; heavy whitespace. The twist: those tools interview to *extract*; we interview to help the user *give a gift* to a business. The aesthetic should feel like a thank-you note, not a survey.
22-
23-**Anti-patterns (do not do these):** dense dashboards; pure-white `#FFF` page backgrounds; cold blue "tech" accents; drop shadows that look like Material Design; cramped forms; more than one primary button per view; emoji as UI; AI/robot imagery. We never say or imply "AI writes your review" — the visuals lead with the human and the business.
24-
25----
26-
27-## 2. Color
28-
29-A warm, earthy palette: cream paper, deep olive-green ink, with terracotta / mustard / sage botanicals as accents. Greens dominate functional UI; the warm florals are decorative and used sparingly for life and warmth.
30-
31-### Core tokens
32-
33-| Token | Hex (approx) | Role |
34-|---|---|---|
35-| `--paper` | `#F7F2E5` | App background ("paper"). The default canvas everywhere. |
36-| `--paper-tint` | `#F1EAD6` | Slightly deeper paper for inset/alt sections, subtle fills. |
37-| `--card` | `#FFFFFF` | Card / surface background. Sits on paper with a soft border + shadow. |
38-| `--ink` | `#2C3318` | Primary text & headlines. Near-black deep green, not pure black. |
39-| `--ink-soft` | `#5B6347` | Secondary text, captions, muted labels. |
40-| `--ink-faint` | `#8A8C76` | Placeholder text, disabled, fine print. |
41-| `--forest` | `#3C4A23` | **Primary brand green.** Primary buttons, key icons, emphasis. |
42-| `--forest-hover` | `#33401D` | Primary button hover/active. |
43:| `--olive` | `#5C6B2F` | Logo/wordmark green, links, mid-tone accents. |
44-| `--sage` | `#8B9D5B` | Soft green for secondary chips, leaf fills, success-ish states. |
45-| `--line` | `#E3DBC6` | Hairline borders on cards, inputs, dividers (warm, low-contrast). |
46-
47-### Accent / botanical tokens (decorative + highlights)
48-
49-| Token | Hex (approx) | Role |
50-|---|---|---|
51-| `--terracotta` | `#D9694A` | Coral/poppy decoration; warm accent, sparing. |
52-| `--mustard` | `#E6B33C` | Daisy decoration; warm highlight. |
53-| `--star` | `#E0A11E` | **Rating stars** (amber-gold). Reserved for star ratings — don't reuse as a UI accent. |
54-| `--success` | `#5C6B2F` | Confirmation / "grounded" / positive (reuse `--olive`). |
55-
56-> **Rule of restraint:** functional UI (text, buttons, borders, chips) lives in the **green + cream + ink** family. Terracotta and mustard appear almost exclusively in the **corner botanical illustrations** and the occasional warm highlight — never as button fills or large blocks. The amber `--star` is reserved for rating stars so it always reads as "rating."
57-
58-### Usage rules
59-- Page background is **always `--paper`**, never white. White is for cards/surfaces only.
60-- Primary actions: `--forest` fill, `--card`/white text.
61:- Body copy: `--ink` on paper or card. Secondary copy: `--ink-soft`. Never put `--ink-faint` on important text.
62-- Borders are warm and quiet (`--line`) — we separate with hairlines + shadow, not heavy strokes.
63-- Maintain WCAG AA (4.5:1) for body text. `--ink` on `--paper` and white-on-`--forest` both pass comfortably; verify any new pairing before shipping.
64-
65----
66-
67-## 3. Typography
68-
69-Two families: an **editorial serif** for display/headlines and a **clean
... [truncated, 6392 chars total]
```

</details>

## 🤖 Assistant · 2026-06-13 23:12:18 UTC

The existing `copy.md` is already strong and well-aligned. Applying the copywriting skill's rigor, I found genuine gaps it surfaces: **no objection-handling/FAQ**, **no "How it works" copy** (though nav links to it), **no closing CTA** for the landing page, **no SEO meta**, and a **broken value-row table**. Let me make those targeted improvements while preserving the good existing copy.

First, fixing the broken value-row table and adding a landing-page "How it works" + final CTA:

**🔧 Tool call: `Edit`**

```json
{
  "replace_all": false,
  "file_path": "/Users/ohong/dev/easy-reviews/docs/copy.md",
  "old_string": "**Value row (3 up):**\n| | |\n|---|---|\n| **Fast** \u2014 Under 60 seconds, start to copy. |\n| **In your words** \u2014 Built only from what you tell us. Nothing invented. |\n| **You stay in control** \u2014 You edit it and post it from your own Google account. |",
  "new_string": "**Value row (3 up):**\n\n| Fast | In your words | You stay in control |\n|---|---|---|\n| Under 60 seconds, start to copy. | Built only from what you tell us. Nothing invented. | You edit it and post it from your own Google account. |"
}
```

<details><summary>↩️ Tool Result</summary>

```
The file /Users/ohong/dev/easy-reviews/docs/copy.md has been updated successfully. (file state is current in your context — no need to Read it back)
```

</details>

## 🤖 Assistant · 2026-06-13 23:12:23 UTC

Now adding a "How it works" section (the nav links to it but no copy exists) and a closing CTA band. I'll insert after the landing page's "Why" block:

**🔧 Tool call: `Edit`**

```json
{
  "replace_all": false,
  "file_path": "/Users/ohong/dev/easy-reviews/docs/copy.md",
  "old_string": "- \"No account needed. You post it yourself.\" kills the two biggest hesitations (signup friction + loss of control) in seven words.\n- Value row is benefits, not features \u2014 each line ends in what it means for the user.\n\n---\n\n## 2. Confirm business (after a pasted link)",
  "new_string": "- \"No account needed. You post it yourself.\" kills the two biggest hesitations (signup friction + loss of control) in seven words.\n- Value row is benefits, not features \u2014 each line ends in what it means for the user.\n\n---\n\n## 1a. How it works (landing section)\n\n*Anchored from the `How it works` nav link. Three steps, one line each \u2014 mirrors the actual flow.*\n\n**Section title:** Three taps from visit to _review_.\n\n| 1 \u00b7 Point us to the place | 2 \u00b7 Answer a few taps | 3 \u00b7 Copy & post |\n|---|---|---|\n| Paste a Google Maps link or scan the code on your receipt. | A short check-in, tailored to where you went. Honest is fine. | We draft it in your words. You edit, then post from your own account. |\n\n**Closing line (under steps):** No account, no app, nothing invented \u2014 just your visit, written well.\n\n### Why\n- The nav promises \"How it works\"; this delivers it without a separate page. Three steps map 1:1 to entry \u2192 interview \u2192 handoff, so expectations match reality.\n- \"Honest is fine\" appears early \u2014 the integrity model is a feature, not a footnote.\n\n---\n\n## 1b. Landing \u2014 closing CTA band\n\n*Bottom of the landing page. Recap the value, repeat the action, reverse the risk.*\n\n**Headline:** Your visit, in a review they'll _remember_.\n\n**Subheadline:** Under a minute. In your words. Posted by you.\n\n**Primary CTA:** Start in 45 sec \u2192\n\n**Risk reversal (under CTA):** No account. No sign-up. Nothing posts without you.\n\n### Why\n- A page needs a second ask for the reader who scrolled past the hero. This one recaps the three core promises (fast / yours / in control) in three fragments, then repeats the hero CTA verbatim so there's one consistent action.\n- \"Nothing posts without you\" is the strongest risk-reversal we have \u2014 it answers the unspoken fear that the tool acts on the user's behalf.\n\n---\n\n## 2. Confirm business (after a pasted link)"
}
```

<details><summary>↩️ Tool Result</summary>

```
The file /Users/ohong/dev/easy-reviews/docs/copy.md has been updated successfully. (file state is current in your context — no need to Read it back)
```

</details>

## 🤖 Assistant · 2026-06-13 23:12:37 UTC

Now adding the FAQ/objection-handling section and SEO meta. I'll insert before the "Reusable strings" section:

**🔧 Tool call: `Edit`**

```json
{
  "replace_all": false,
  "file_path": "/Users/ohong/dev/easy-reviews/docs/copy.md",
  "old_string": "## 7. Reusable strings",
  "new_string": "## 7. FAQ / objection handling\n\n*Lives on the landing page (collapsible) and answers the hesitations that stop a first-time user. Each answer names the worry and resolves it in two sentences \u2014 no legalese.*\n\n**Is this allowed by Google?**\nYes. You write an honest review about a real visit and post it yourself from your own account \u2014 exactly what Google asks for. We help you find the words; we never post for you.\n\n**Are these really my words?**\nEvery review is built only from the answers you give. We don't invent dishes, names, or details \u2014 if you didn't say it, it's not in there. Edit any line before you post.\n\n**Do I have to leave a good review?**\nNo. Tell us it was rough and the review says so, plainly. We match your rating, up or down \u2014 honest beats glowing.\n\n**Do I need an account?**\nNo account, no app, no sign-up. Paste a link or scan a code and start.\n\n**How long does it take?**\nAbout 45 seconds of taps, then one paste into Google.\n\n**Can I change it after?**\nThe draft is fully editable, and you post it manually \u2014 so you can tweak the wording right up to the moment it goes live, and edit it on Google later too.\n\n### Why\n- These six are the literal objections in the spec's risk section and integrity model: *is it legal, is it mine, must it be positive, is there friction, is it fast, am I in control.* Answering them on-page removes the reasons a cautious user bounces.\n- Every answer restates an integrity pillar (grounded / sentiment-faithful / human-in-the-loop) in plain language \u2014 the defense is the marketing.\n\n---\n\n## 8. SEO / meta\n\n**Page title (landing):** Easy Reviews \u2014 write an honest Google review in under a minute\n\n**Meta description (landing):** Turn a quick check-in into a Google review written in your words. A few taps, a draft grounded in your real visit, and you post it yourself. No account needed.\n\n**Page title (QR self-serve):** Easy Reviews for business \u2014 a QR that turns visits into honest reviews\n\n**Meta description (QR self-serve):** Print a QR code. Customers scan, answer a few taps, and post an honest Google review from their own account. No app, no account, no rating farm.\n\n**Open Graph headline:** Turn a quick check-in into a Google review.\n\n### Why\n- Title leads with the brand, names the outcome (\"honest Google review\"), and the speed promise \u2014 the three things a search-result skimmer needs.\n- Meta description front-loads the same two objections the subhead answers (is it mine / is it fast) plus the friction-killer (\"No account needed\") because that line earns clicks.\n\n---\n\n## 9. Reusable strings"
}
```

<details><summary>↩️ Tool Result</summary>

```
The file /Users/ohong/dev/easy-reviews/docs/copy.md has been updated successfully. (file state is current in your context — no need to Read it back)
```

</details>

## 🤖 Assistant · 2026-06-13 23:12:56 UTC

Let me verify the file is coherent end-to-end and that the reusable strings reflect the new copy.

**🔧 Tool call: `Read`**

```json
{
  "file_path": "/Users/ohong/dev/easy-reviews/docs/copy.md",
  "offset": 280,
  "limit": 60
}
```

<details><summary>↩️ Tool Result</summary>

```
280	
281	**Page title (landing):** Easy Reviews — write an honest Google review in under a minute
282	
283	**Meta description (landing):** Turn a quick check-in into a Google review written in your words. A few taps, a draft grounded in your real visit, and you post it yourself. No account needed.
284	
285	**Page title (QR self-serve):** Easy Reviews for business — a QR that turns visits into honest reviews
286	
287	**Meta description (QR self-serve):** Print a QR code. Customers scan, answer a few taps, and post an honest Google review from their own account. No app, no account, no rating farm.
288	
289	**Open Graph headline:** Turn a quick check-in into a Google review.
290	
291	### Why
292	- Title leads with the brand, names the outcome ("honest Google review"), and the speed promise — the three things a search-result skimmer needs.
293	- Meta description front-loads the same two objections the subhead answers (is it mine / is it fast) plus the friction-killer ("No account needed") because that line earns clicks.
294	
295	---
296	
297	## 9. Reusable strings
298	
299	**Trust badges**
300	- `You post it yourself`
301	- `You stay in control`
302	- `Grounded in your answers`
303	- `In your words`
304	- `No account needed`
305	
306	**Buttons**
307	- Forward: `Continue →`, `Start 45-sec check-in →`, `Write my review →`, `Copy & open Google →`
308	- Quiet: `Back`, `Skip`, `Regenerate`, `Search again`, `Copy again`, `Start over`
309	
310	**Errors & edge cases**
311	- Link isn't a place: That link doesn't point to a business. Paste a Google Maps link to a specific place, or search by name. — action: `Search by name`
312	- Low-confidence match: We're not sure this is the right place. Pick the correct one below. — action: list candidates.
313	- No reviews/category found: We couldn't pull details for this place — you can still write a review from scratch.
314	- Generation failed: That didn't generate. Try again — your answers are saved. — action: `Try again`
315	- Empty interview submit: Add at least a rating so we have something to work from.
316	- Clipboard unsupported: Couldn't copy automatically. Select the text and copy it, then open Google.
317	
318	### Why
319	- Error copy names the cause and the next action in one breath, and never blames the user. Pasted-link failures are expected (spec §risks), so their messages are the most carefully worded — always with a search fallback.
320	
321	---
322	
323	*Keep this file in sync with the UI. When a screen's wording changes, change it here first.*
324	
```

</details>

## 🤖 Assistant · 2026-06-13 23:13:06 UTC

The file is coherent. The copy is written entirely in `docs/copy.md` — nothing touched in the codebase, as requested.

## What I did

The file already had strong copy for the core screens, well-aligned with `design.md` and the integrity model. Applying the copywriting skill's rigor surfaced five genuine gaps, which I filled:

- **§1a How it works** — the landing nav linked to it but no copy existed. Three steps, one line each, mapped 1:1 to the actual flow (entry → interview → handoff).
- **§1b Closing CTA band** — a page needs a second ask for readers who scroll past the hero. Recaps the three promises, repeats the hero CTA, and adds the strongest risk reversal: *"Nothing posts without you."*
- **§7 FAQ / objection handling** — the biggest gap. Six questions answer the exact hesitations from the spec's risk section (*is it legal, is it mine, must it be positive, friction, speed, control*). Each answer quietly restates an integrity pillar — the defense doubles as the marketing.
- **§8 SEO / meta** — page titles + meta descriptions for landing and QR self-serve, plus an OG headline.
- **Fixed** the broken 3-up value-row table (was malformed markdown).

I left the existing screen copy (hero, confirm, interview, draft, handoff, QR) largely intact — it was already specific, benefit-led, buzzword-free, and faithful to the "never imply AI writes your reviews" rule. Rewriting good copy for its own sake would've been churn, not improvement.

**Scope check:** appropriately scoped — additive gap-filling on top of a solid base, not a rewrite.

One open question, extremely concise:
- **FAQ placement** — inline collapsible on the landing page, or a separate `/faq` route? I assumed inline.
