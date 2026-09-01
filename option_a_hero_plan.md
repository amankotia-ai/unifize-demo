# Option A. Hero visual plan.

> Working stance: **structural diagnosis, framed as outcome.**
> The rails ARE the diagnosis. The headline IS the outcome. The recognition rotator IS the audience qualifier. One beat of synchronized motion ties all three together.

---

## What this hero has to do, in order

1. Pass the audience test in two seconds. A 30-year regulated-process veteran sees ERP / QMS / PLM / MES and FDA-grade language. Not Outlook, not email, not generic office stuff.
2. Pass the five-second rule on the visual. The shape of the gap between the rails has to land before the headline is read.
3. Lead with outcome, not problem. The headline is a cycle-time promise. The diagnosis is the proof underneath it.
4. Carry the rotating "you'll recognise it" widget from `/linear`. Visual and verbal recognition rotate in lockstep.
5. Reserve platform blue for the "With Unifize" rail only. The "Without" rail stays in factory neutrals.

---

## The visual, anatomically

```
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│  ●  ONE RECORD · TWO TIMELINES               ●  YOU'LL RECOGNISE IT.   │
│                                                 Approval stuck across  │
│  Approval cycles in days.                       three signoffs.        │
│  Not months.                                                           │
│                                              ┌──────────────────────┐  │
│  ERP, QMS, PLM, MES already record what is   │ APPROVAL CYCLE       │  │
│  true. Unifize closes the calendar gap       │ ERP · QMS · PLM · MES│  │
│  between them.                               │                      │  │
│                                              │ Without Unifize 92d  │  │
│  [ Book a demo  → ]   See the structure →    │ ▓▓░░░░▓▓░░░░░░▓░░▓▓  │  │
│                                              │  QMS    PLM   ERP MES│  │
│                                              │                      │  │
│                                              │ ─── 71 days returned │  │
│                                              │                      │  │
│                                              │ With Unifize    21d  │  │
│                                              │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │  │
│                                              │                      │  │
│                                              │ Day 0  −77%   Day 92 │  │
│                                              └──────────────────────┘  │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

Two columns inside the hero band.

**Left.**

- Eyebrow line, mono caps with blue dot: **ONE RECORD · TWO TIMELINES.**
- H1: **Approval cycles in days. Not months.** Outcome-first. Says what changes, not what is broken.
- Sub: **ERP, QMS, PLM, MES already record what is true. Unifize closes the calendar gap between them.** Industry vocabulary in the first eight words. "Calendar gap" carries the diagnosis without explaining it.
- CTA: primary "Book a demo," ghost "See the structure" anchored to the symptoms section.

**Right. The rails diagram.**

- Recognition rotator above the chart, mono caps: **YOU'LL RECOGNISE IT.** plus a rotating line, taken from the curated Apr 28 PAIN_POINTS list. Pattern matches `/linear`'s `.lin-pain` widget.
- Chart eyebrow: rotating domain plus systems. Default reads **APPROVAL CYCLE · ERP · QMS · PLM · MES.** Swaps in sync with the recognition rotator below it.
- Top rail "Without Unifize." Active segments dark. Wait segments amber or muted neutral. Stage labels under the segments name the systems where the wait happens (QMS, PLM, ERP, MES).
- Divider with the wait delta, e.g. "71 days returned."
- Bottom rail "With Unifize." All active. Platform blue. No wait segments. Same stages, compressed.
- Axis row: "Day 0" left, percentage delta center, "Day 92" right.

**No specific customer numbers** until we have a Validated metric per Proof Maturity. The 92 / 21 / 71 / 77% labels stay as illustrative shape, not customer claim. We label them "directional" or strip the digits and use bar widths only. Final call on copy below.

---

## Motion plan

One synchronized beat, two rotating surfaces.

**Beat duration: 6 seconds per domain.** Slower than `/linear`'s 2.6s because the chart also re-animates. We trade snap for clarity.

**Per beat:**

- The recognition rotator line fades in (translateY plus blur, the existing `lin-pain-in` keyframe ports straight in).
- The chart eyebrow domain label swaps (Approval cycle → Change control → Doc revisions → Document risk).
- The "Without Unifize" rail re-draws with the new domain's wait pattern. Stage labels under the segments swap to the systems involved.
- The "With Unifize" rail re-draws compressed. Always blue, always active.
- The cycle-time delta counts up to that domain's percentage.

**Domains in rotation, in order:**

1. **Approval cycle.** Lead. Ben's preferred. Stages: Request → QMS review → Regulatory check → Sign-off → ERP update.
2. **Change control.** Stages: ECO raised → Engineering review → QMS impact → PLM update → MES release.
3. **Document revisions.** Stages: Draft → QA review → Doc Control approval → Training rollout → Effective date.
4. **Document risk.** Stages: Risk identified → Severity assessment → Mitigation plan → Sign-off → Periodic review.

Four domains. Loop every 24 seconds.

**Reduced-motion fallback:** rotation pauses, hero settles on Approval cycle as the canonical example. Recognition eyebrow stays static on a single line. No animation runs.

**Why this motion plan over alternatives.** I considered keeping the recognition eyebrow at 2.6s and the chart static. That decouples the surfaces but makes the chart feel dead. The whole point of the synchronized beat is to teach the visitor in one pulse that the gap shape is **the same in every domain.** That is the diagnosis. Letting the chart rotate alongside the eyebrow is what does that work.

---

## Color discipline

- **Without Unifize rail.** Active segments use ink (`#0B0D11`) or the dark text token. Wait segments use the warm amber from the existing Option A token (`--warm-accent: #F59E0B`) or a muted neutral. Reads as "the work and the wait."
- **With Unifize rail.** Platform blue (`#0052FF` or the existing accent token). Reads as "the platform's outcome."
- **Recognition rotator dot.** Platform blue. Existing `/linear` pattern.
- **Eyebrow lines and dividers.** Border tokens, no color value of their own.

Memory rule check: blue stays on the platform side only. The "Without" rail does not get blue. The recognition dot is fine because it belongs to the platform rotator.

---

## Copy to lock before tomorrow

- **Eyebrow left:** ONE RECORD · TWO TIMELINES.
- **H1 candidates.** Pick one before the call.
  - **A.** Approval cycles in days. Not months.
  - **B.** Approvals that fit the calendar.
  - **C.** Days of work, not months of waiting.
- **Sub.** ERP, QMS, PLM, MES already record what is true. Unifize closes the calendar gap between them.
- **CTA.** Book a demo. Ghost: See the structure.
- **Recognition rotator label.** YOU'LL RECOGNISE IT.
- **Chart eyebrow.** Rotates: APPROVAL CYCLE · ERP · QMS · PLM · MES → CHANGE CONTROL · ENG · QMS · PLM · MES → and so on.
- **Wait delta label.** "71 days returned" if we keep numbers, "Wait collapses" if we strip them.
- **Cycle-time callout.** "−77% cycle time" if we keep numbers, "Days, not months" if we strip them.

---

## What this hero asks Ben to accept

1. Outcome-led headline. Cycle-time promise sits on top, diagnosis sits underneath. The page does not open by naming the problem. It opens by naming what changes.
2. Industry vocabulary in the first eight words of the sub. ERP, QMS, PLM, MES, regulated-process. The qualification gate is in the copy, not just the visual.
3. Synchronized rotation as the single motion idea. Recognition rotator and chart rotate together. No second motion track on the hero.
4. Numbers strip-out unless we get Med Devices to Validated. We ship illustrative shape, not customer claim. Numbers come back when the proof does.

---

## Open calls before I build

1. **Headline pick.** A, B, or C from the candidate set above.
2. **Numbers in or out.** Ship the rails with 92 / 21 / 71 / 77 as illustrative, or strip to qualitative ("days, not months") until a Validated number lands.
3. **Domain rotation depth.** Four (Approval, Change control, Doc revisions, Risk) or five (add MRB / Supplier CAR for breadth)?
4. **Microsoft tools placement.** Show SharePoint, Teams, Outlook, Excel as small badges on the wait segments of the "Without" rail, or keep the rail clean and let Microsoft visibility live in a later section?
5. **Recognition rotator cadence.** Sync with chart at 6s, or keep the rotator at 2.6s for energy and let the chart rotate independently every 6s (two-track)?

If you give me 1, 2, and 3 I can produce a built version of this hero by Wednesday morning. 4 and 5 can be tweaked live in the call.

---

## Sources

- /src/pages/HomeOptionA.tsx (current rails hero)
- /src/pages/HomeLinear.tsx lines 4-19 and 150-184 (recognition rotator pattern)
- ben<>abhishek_28_4_26.md (Apr 28 hero direction narrowing)
- call_latest.md (E1 five-second rule, audience test, Microsoft co-stack rule)
