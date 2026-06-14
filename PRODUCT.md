# Product

## Register

product

## Users

Two audiences, one product:

- **Reviewers (primary)** — a real customer who just visited a place and was asked for a Google review. Context: on a phone, often in or just outside the business, low patience, low motivation. The job: *leave an honest review without facing the dreaded blank box* — in under 60 seconds, in their own words, posted by them. They are not "writing"; they're answering a few taps (`/start` → `/review/[placeId]`).
- **Businesses (secondary, QR self-serve)** — an owner who wants more honest reviews without nagging customers. The job: get a QR/link that turns visits into reviews, with the reassurance it's not a rating farm (`/for-business`).

The interface meets people at the moment of fading goodwill and must convert it before it evaporates.

## Product Purpose

Easy Reviews turns a sub-60-second multiple-choice interview into an honest, well-written Google review that the user posts themselves. It exists to remove the blank-box friction that kills most review intent, without ever fabricating, bulk-posting, or implying "AI writes your review." Every draft is grounded in the user's own tapped answers, and the user stays in control of the final text and the act of posting.

Success looks like: a reviewer completing the flow one-handed in under 60 seconds and posting a review they feel is genuinely theirs; a business gaining more real reviews from a single QR/link with confidence in the product's integrity.

## Brand Personality

- **Three words:** warm, grounded, effortless.
- **Voice:** spare, editorial, benefit-led, human — *a thank-you note, not a survey*. Lead with the person and the business; **never imply "AI writes your review."** Reassure honesty and control inline ("in your words," "you stay in control," "grounded in your answers") — never as legal disclaimers.
- **Emotional goal:** calm confidence. The user should feel they did a good thing easily, and that the result is genuinely theirs.

## Anti-references

Do NOT look like:

- Dense SaaS dashboards or cramped forms.
- Pure-`#FFF` page backgrounds (white is for cards only).
- Cold blue "tech" accents; Material-style drop shadows.
- More than one primary button per view.
- Emoji-as-UI.
- **Any AI/robot imagery.** The visuals always lead with the human and the business, never the machine.

Reference points for the *right* feel: Outset, Listen Labs — confident, spare, one-question-at-a-time, single strong CTA, heavy whitespace. The twist: they interview to *extract* research; we interview to help the user *give a gift*.

## Design Principles

1. **Effortless is the tie-breaker.** When warm, grounded, and effortless conflict, *effortless wins*. One obvious action per screen; if a flourish adds friction, cut it. The sub-60-second, one-handed flow is sacred.
2. **Grounding made visible.** The integrity promise is a design element, not fine print — recap chips that turn answers into the review, quiet trust badges ("Grounded in your answers," "You stay in control") at landing, draft, and ready.
3. **Restraint with character.** A single editorial anchor per screen carries the warmth; everything else stays calm and functional. Don't scatter character — concentrate it.
4. **One product, shared parts.** The business card and the step rail (Find → Answer → Review → Post) are the through-line — build once, reuse on every screen so the whole flow feels like a single piece.
5. **Accessible by construction.** Trust is the product; an interface that excludes people undermines it. Verify every new pairing and interaction against the bar in the section below before shipping.

## Accessibility & Inclusion

- **WCAG AA** (4.5:1 body text contrast), not AAA.
- Visible focus rings on interactive elements.
- Non-color affordances for selection and ratings (fill + check, not hue alone) so the flow works for color-blind users.
- A `prefers-reduced-motion` path that swaps slide transitions for fades.
- One-handed, mobile-first completion with ≥44px tap targets — the primary reviewer is on a phone.

---

> Visual system (palette, type, components, motion) lives in [`docs/design.md`](docs/design.md); voice in [`docs/copy.md`](docs/copy.md). **On conflict, `docs/design.md` wins.** This file answers who/what/why; those answer how it looks.
