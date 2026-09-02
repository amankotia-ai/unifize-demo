# Synthetic audience audit: the current Unifize platform page

**Everything in this report is synthetic.** Six model-simulated personas reacted to the page. No real users were involved. Synthetic verbatims are marked and must never be presented as customer quotes. Treat the direction as useful and the magnitudes as unproven.

| | |
|---|---|
| Stimulus | https://www.unifize.com/platform, fetched and DOM-checked 2026-09-02 (see `stimulus.md`). The same copy exists in the rebuild as the unmounted component `src/components/sections/PlatformSection.tsx`. |
| Decision informed | The rebuild has ported this page nearly verbatim. What should the rebuilt platform page keep, cut, or reframe, per segment? |
| Panel | 6 draft personas in `marketing/audiences/` (status: draft, awaiting Ben / Lakshman approval) |
| Method | One isolated reactor per persona, separate synthesis agent, adversarial verifier. Run 1 was rejected by the verifier and re-run (see Method notes). |
| Verifier verdict on run 2 | Needs revision. The corrections below are applied; only conclusions the verifier allowed to surface appear here. |
| Source age | Newest evidence behind the personas is 2026-05-11. Run date 2026-09-02. Nearly four months; refresh the panel once a confirmed ICP exists. |
| Context Engine | Unreachable this session (no local engine, Notion not authorised). This file is the write-back until it is. |

## Resonance distribution

Anchors: 0 repelled or lost, 1 indifferent, 2 interested with reservations, 3 compelled.

| persona | segment | resonance | next action | confidence |
|---|---|---|---|---|
| cio-category-researcher | CIO / CEO, cold, category research | 0 | bounce | medium |
| cfo-regulated-mfg | Finance | 1 | bounce | medium |
| vp-quality-med-device | Quality (medical devices), primary buyer | 2 | keep-reading | medium |
| regulatory-affairs-lead | Regulatory | 2 | talk-to-sales (investigative) | medium |
| ops-director-regulated-mfg | Operations | 2 | talk-to-sales (investigative) | medium |
| ehs-process-owner | Non-QMS process owner (EH&S) | 2 | keep-reading (downgraded by harness, see Method) | medium |

Shape: no persona reaches 3. The four regulated-workflow chairs cluster at 2, each blocked by a different named objection. The cold category researcher bounces. Finance is indifferent.

Weighting caveat the verifier required: per `call_latest.md` line 44 and `brief-a.md` line 61, the founders estimate 95 percent of prospects arrive through a link and explicitly decline to design for the 5 percent cold case. The CIO result is real but should not be over-prioritised on this page.

## What the page does well (verified positives)

These are the only page elements any persona cited as working, with counts from the reactions' positives arrays.

| element | count | who |
|---|---|---|
| Cycle Time Tracking and configurable dashboards | 3 | CFO, Ops, VP Quality |
| Real-Time Audit Trail and Comprehensive Audit Trails | 2 | Regulatory, VP Quality |
| CFR Part 11 Compliant eSignatures (appears in two feature groups) | 2 | Regulatory, VP Quality |
| Revision Management / Version Control | 2 | Regulatory, VP Quality |
| No-Code Process Builder, "without reliance on IT" | 2 | EH&S, Ops |
| SharePoint / OneDrive integration | 2 | Ops, VP Quality |
| Reminder and Escalation Workflows | 2 | EH&S, Ops |
| SSO/SAML and SOC-2 storage; customer logo row | 1 each | CIO |
| "Measurable outcomes" and the "about 30% faster" testimonial | 1 each | CFO |

## Verified findings

Each finding carries the segment and the business stake. Counts come from the reactions' objections arrays only.

**1. Duplicate testimonial quotes undercut every proof claim on the page.**
Three of the four testimonial cards carry identical quote text under different names (DOM-verified). Objected: 4 of 6 (CFO, Ops, Regulatory, VP Quality). Noticed without objecting: CIO. Silent: EH&S.
Context reason: the page's only quantified proof ("about 30% faster") sits in the same slider, and the primary buyer (Quality) and the Regulatory gatekeeper both read duplicated attribution as a traceability failure from a vendor selling traceability. This is copy hygiene, not repositioning, and is the highest-leverage, lowest-risk fix on the page.
Stakes: validate-with-real. Replacement quotes touch real customer names (Wilson Lin, Denis Machoka, Jesse Kolstad, Clarissa Archer) and need customer sign-off.

**2. The "Founded in 2018" company paragraph renders seven times, once under every feature group, and it is the only place the page says "system of record" and "system of collaboration".**
Objected: 2 (CIO, Ops). Noticed as filler: 4 (CFO, EH&S, Regulatory, VP Quality).
Context reason: the one sentence that could carry the rebuild's positioning ("combining the system of record with the system of collaboration") is currently buried in repeated investor copy, so the cold category researcher reads it as filler rather than as the argument. The rebuild copy in `PlatformSection.tsx` drops this paragraph, which is correct; the live page should lose it too.
Stakes: none beyond the repositioning flag in finding 4.

**3. The page never names the buyer's record types or says where it sits in their stack.**
Objected: CAPA / deviation / change order absent (VP Quality); incident / permit type workflows absent (EH&S); replaces-or-sits-beside the QMS never stated (VP Quality, Ops); ERP, MES, Outlook and Teams never named while Slack is a feature card (Ops).
Context reason: the primary buyer's own vocabulary (CAPA, ECO, SOP) is a positioning asset per project memory and Ben's feedback in `ben<>abhishek_28_4_26.md` lines 66-70 ("this just looks like another Asana"), and Slack is a hard ban per `homepage_words_first.md` line 75 because the target buyer is a Microsoft shop. The rebuild copy still lists "Slack Integration" and still says "records" and "processes" only.
Stakes: none.

**4. The page makes no category claim, so the cold researcher reads it as a conduit or a QMS rebrand and bounces.**
Objected: CIO (3 objections: conduit between systems, QMS feature language, category sentence buried in boilerplate).
Context reason: this is the reading Lakshman gave as a buyer in `ben<>abhishek_11_5_26.md` lines 41-42 ("Unifize is a third party integration, not the actual systems"), now reproduced by the persona built from it. Weight it by the 5 percent cold-case estimate above.
Stakes: validate-with-real. Stating a category claim on the platform page is a repositioning decision tied to the wider rebuild.

**5. Finance has no path above indifferent on this page.**
Objected: CFO (feature list is not a business case; every CTA is Book a Demo; the one number is undermined by finding 1).
Context reason: Ben's requirement in `ben<>abhishek_28_4_26.md` lines 143-146 that the site show "money on the table" a CFO would act on is not met here; the calculator CTA planned in `brief-a.md` line 40 would be the natural fix.
Stakes: validate-with-real. Any dollar or payback figure must come from real customer data.

**6. Compliance badges are labels without substantiation.**
Objected: Regulatory (CFR Part 11, SOC-2 and audit-trail claims with no export sample, no validation statement; Chat Driven Process Records does not say the chat becomes an immutable part of the controlled record). Note: the computer-system-validation objection is an inference from the regulated context, not a transcript quote; the chat-to-record objection is grounded in `ben<>abhishek_7_5_26 copy.md` line 142.
Context reason: the Regulatory chair is the audit gatekeeper in `brief-a.md` section 03; a compliance label with nothing behind it is what this persona says kills a deal.
Stakes: validate-with-real. Any added compliance substantiation needs review by whoever owns Unifize's actual compliance posture.

## Verdict: keep, cut, reframe

**Keep** (for Quality, Regulatory, Operations, EH&S): the named feature vocabulary that landed: Real-Time Audit Trail, CFR Part 11 eSignatures, Revision Management / Version Control, Cycle Time Tracking, No-Code Process Builder, Reminder and Escalation Workflows, SharePoint / OneDrive.

**Cut** (every segment): the seven-times repeated company paragraph; the duplicated testimonial quotes (fix or reduce to unique cards). Also the em dashes in the copy (8 on the live page, and one carried into `PlatformSection.tsx` in the intro paragraph) per the brand rule.

**Reframe**, per segment:
- Quality and Regulatory: name CAPA, deviation and change order in the feature copy; say plainly whether Unifize replaces or sits beside a QMS; add one substantiation point for the compliance badges (audit trail export example, validation statement, or a sentence on chat-to-record immutability).
- Operations: name Outlook and Teams; drop Slack from the feature list; put one real before-and-after cycle-time example higher on the page.
- Finance: one credible, real cost or payback figure, or route Finance to the coordination-tax calculator instead of this page.
- CIO / cold: one explicit category sentence in the hero or H1, weighted by the 5 percent estimate.
- EH&S / non-QMS: one non-quality workflow example and one non-quality customer title. (The persona's named workflows are illustrative placeholders; the source only says "two coordination-tax-heavy workflows".)

**Confidence: medium.** The four regulated-workflow personas converge on the same page elements from different primary sources, which is stronger than any single read. Thresholds (how big a number, how much substantiation) are inferred from stated evaluation habits, not observed.

## Calibration hooks (score these when real data exists)

Predictions this panel is making. Record hit or miss through `context-io` / `log_outcome` once the engine is reachable, after the `outcome-auditor` certifies the measurement.

1. If the duplicated quotes and the repeated paragraph are removed, sales first-call notes tagged "credibility" or "proof" for platform-page visitors drop to zero over the next 20 demos.
2. If one explicit category sentence is added to the hero or H1, bounce rate on /platform for new visitors falls versus the current baseline.
3. If a real cost or payback figure is added near Cycle Time Tracking, Finance-titled visitors' scroll depth and CTA clicks on /platform rise versus baseline.
4. If one non-quality workflow example and one non-quality testimonial are added, the share of demo requests from non-quality titles rises versus baseline.
5. If CAPA, deviation and change order are named and the QMS relationship is stated, Quality-titled visitors' demo-request rate from /platform rises versus baseline.
6. If one compliance substantiation point is added, Regulatory-titled first calls stop opening with a Part 11 validation question (tag in call notes).
7. If Outlook and Teams are named and a before-and-after cycle-time example is added, Operations-titled visitors' demo-request rate from /platform rises versus baseline.

## Method notes and what the verifier changed

- Run 1 was rejected. My first persona drafts sourced their "repels" vocabulary from the page under test, which made a six-way "everyone hates the boilerplate" result circular; the reactor prompt also named category options (QMS, workflow tool, integration layer), and my `call_latest.md` line pointers were offset by 76 lines. All three were fixed and the panel re-run. Run 1 artefacts are not in this folder.
- Run 2 verifier corrections applied here: objection counts recounted from objections arrays only; the "only elements cited as positives" overclaim removed; SharePoint / OneDrive added to Keep; CIO reframe weighted by the 5 percent cold-case estimate; EH&S nextAction downgraded from talk-to-sales to keep-reading because the reaction gave no investigative justification and its own verbatim said "before I book anything"; three synthesis claims dropped (a split and two surprises resting on nextAction differences among the 2-scorers, and a "three personas independently said template" claim that the verifier judged a generator artefact); citation off-by-ones fixed in the persona files; infoDiet and stack fields marked not evidenced; the regulatory validation objection marked as inference; the EH&S workflow names marked illustrative.
- Known weakness for the next run: the stimulus file carried a "what the page does not contain" list and a decision framing that reactors could see. Future runs should hand reactors only a neutral render and keep the decision context in the harness.
- Panel status remains draft. The verifier passed all six personas on traceability with the fixes above, but they must not be set to active until Ben / Lakshman confirm the persona set (`homepage_words_first.md` line 95).

## Files

- `stimulus.md`: the page as rendered plus DOM render notes.
- `reactor-prompt.md`: the neutral prompt each isolated reactor received.
- `*.json`: the six raw reactions (EH&S carries the harness downgrade note).
- `synthesis-raw-unverified.md`: the synthesis agent's output before verifier corrections, kept for audit.
