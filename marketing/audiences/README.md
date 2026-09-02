# Synthetic audience panel (DRAFT, awaiting founder approval)

Status: draft. Built 2026-09-02 by the Panorama synthetic-audience skill.

These personas are synthetic instruments derived from the ICP evidence in this repo. They are not real people and their simulated verbatims are never real user quotes. Nothing here is active until Ben / Lakshman approve or edit it. Founder edits are ground truth and are never overwritten by a refresh.

## Provenance caveat

The Panorama Context Engine was not reachable in the session that built this panel (no local engine, Notion connector not authorised). Every attribute therefore traces to a document in this repo or in session memory, listed under `derivedFrom.sources` in each file:

- `repo:brief-a.md` (Homepage Hierarchy Concept A, 2026-04-27)
- `repo:homepage_words_first.md` (Words-first hierarchy review, 2026-04-28)
- `repo:call_latest.md` (GTM alignment call transcript)
- `repo:ben<>abhishek_28_4_26.md`, `_29_4_26.md`, `_4_5_26.md`, `_7_5_26 copy.md`, `_11_5_26.md` (call transcripts)
- `memory:project_unifize.md` (session memory: ISO/FDA-regulated manufacturers, Microsoft-shop stack bias)
- `live:unifize.com/platform` (used ONLY for the job titles on real customer testimonials; never for vocabulary, because that page is also the first stimulus and sourcing vocabulary from it would make the panel circular)

Dates: `call_latest.md` carries no date in its text; its file modification date is 2026-04-27. The newest transcript is 2026-05-11, which is the `derivedFrom.icpUpdatedAt` proxy used in every file.

The authoritative persona set is still an open question in `homepage_words_first.md` ("Lakshman to confirm authoritative persona set"). Treat segment names here as proposals.

## Panel

| id | segment | why it is on the panel |
|---|---|---|
| vp-quality-med-device | Quality (medical devices) | Primary buyer, only segment with Advocacy-grade proof |
| ops-director-regulated-mfg | Operations | Cycle-time owner, the persona dashboards are built for |
| regulatory-affairs-lead | Regulatory | Audit-readiness and Part 11 gatekeeper |
| cfo-regulated-mfg | Finance | The money chair the brief says the site has to satisfy |
| cio-category-researcher | CIO / CEO (cold, category research) | The homepage brief's named cold visitor |
| ehs-process-owner | Non-QMS process owner (EH&S) | The "tribe" example from call_latest: coordination-tax-heavy workflows outside quality |

## Simulations

| date | stimulus | verdict | record |
|---|---|---|---|
| 2026-09-02 | Live platform page (unifize.com/platform) | 0/1/2/2/2/2, nobody compelled; cut duplicated testimonials and repeated boilerplate, name record types and stack, state the category claim once | `simulations/2026-09-02-platform-page/REPORT.md` |

Calibration: 0 predictions scored so far. Score the hooks in each REPORT.md when real measurements exist.
