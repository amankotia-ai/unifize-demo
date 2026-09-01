# Unifize Homepage Process Visualization — Working Brief

> Synthesis of everything to keep in mind for the homepage process visual flow.
> Anchored on the Positioning Strategy v3.8, the Concept Exploration Brief,
> the ben↔abhishek call of 29 Apr 2026, and nine rounds of iteration.

---

## 1. The mission, distilled

Design the central visual flow for the Unifize homepage. This isn't a single
graphic — it's the entire opening arc of the page. The Concept Exploration
Brief calls it *"the single most important visual in the entire Unifize
brand,"* appearing on the homepage hero, in every sales deck, in investor
materials, and in thought leadership. The failure mode is binary: a scrolling
VP Quality leaves before the diagnosis lands, and the page does no work.

The visual flow must do three things in sequence: **vindicate** the buyer
(recognition of pain), **diagnose** the structure (why it exists), and
**introduce** Unifize (the governed layer that solves it). The single biggest
mistake across the prior thirty-plus explorations — and one I made directly —
is collapsing those three jobs into one frame.

## 2. The buyer

Primary entry persona is **Quality Governance (PES-3)** — VP Quality, Director
of Quality, Head of Compliance. Secondary: Operations / Manufacturing leaders,
IT Risk, CFO. Cross-functional buyer, mid-to-large regulated org (500+),
across medical device, pharma, aerospace, automotive, specialty chemicals,
food. They have absorbed coordination tax for years without a name for it.
They are skeptical of new platforms. The page must trigger recognition first
("yes, that's my Tuesday") before any architectural claim.

The lived reality: every workday split between systems of record (QMS, ERP,
PLM, DMS) and systems of collaboration (email, Teams, Excel, SharePoint,
Slack, meetings). Decisions made in chat. Signatures with no traceable
justification. Records reconstructed from memory before audits. The four
canonical pain processes — pulled verbatim from the strategy doc — are:
**document control, change control, audit prep, document revisions.** When
stuck for an example, those four are always defensible.

## 3. Vocabulary — use and avoid

**Use** (in this order of preference):

- *Coordination Tax* (capitalised, the named problem)
- *non-value-addition time* (the broader concept; Coordination Tax is its
  previously-unmeasurable subset)
- *systems of record / systems of collaboration*
- *governed layer*, *governed thread*, *accountable thread*
- *shared operational source of truth*
- *AI governor*
- For the running record example: **Change Request (CR-241)** — generic
  across all regulated industries. CAPA is too quality-specific and alienates
  non-Quality buyers.

**Avoid:**

- "regulated manufacturing" → use specific industry or "regulated processes"
- "workflow" → deprecated, use "process"
- "two clocks" / "state clock" / "event clock" → retired
- "core platform" in customer-facing copy
- "consulting" / "professional services" → use "practitioners who built a platform"
- Calling Unifize a *system of coordination* — Unifize is **not** a coordination
  tool; coordination tools **are** the problem
- Numbering the symptoms ("six conditions") — Raj specifically said keep it open
- Outcome claims without a measurement rule per Proof Maturity

## 4. The five-scroll flow Ben actually wants

This is the structural fix. **Unifize enters at scroll 5, not scroll 1.**

| # | Scroll | Job | Visual |
|---|--------|-----|--------|
| 01 | Outcome | Hook with "measure non-value-addition time" | Process before/after bars + single big stat. **No SoR/SoC/Unifize.** |
| 02 | Symptoms | Open-ended list of recognisable scenes | Vertical scrolling list, "+ more" at bottom |
| 03 | Coordination Tax | Name the pattern | Pure typographic moment, no diagram |
| 04 | Root cause | Show the structural separation | Two zones (SoR / SoC) with hatched void between. **Still no Unifize.** |
| 05 | Unifize | Solution | Same two columns from scroll 4, middle now filled with Unifize governed thread |

**Scroll 1 — Outcome.** *"Unifize helps you measure non-value-addition time
that was previously impossible to measure."* List the four canonical
processes with quantified before/after reductions. Just the outcome and the
processes it touches.

**Scroll 2 — Symptoms.** Concrete moments — *"the approval lands in a Teams
call, the record waits weeks to catch up,"* *"the signature exists, the
justification is somewhere else,"* *"the record gets built from memory after
the fact."* Three to five visible, plus an explicit "+ more" so it never
feels conclusive.

**Scroll 3 — Coordination Tax.** *"These aren't random. They have a name."*
The name lands big. One-sentence definition: the previously unmeasurable
subset of non-value-addition time.

**Scroll 4 — Structural root cause.** Now the gap diagram appears: SoR on one
side, SoC on the other, an explicit void between. Ben said "the line concept
isn't working" and "the iceberg isn't working" — so the gap is not a
horizontal stripe and not a vertical stack with a waterline. Two side-by-side
zones with a hatched void is the geometry that lands.

**Scroll 5 — Unifize.** The same two columns from scroll 4, but the empty
middle is now the Unifize governed thread, with named decisions, evidence,
and approvals binding the gap closed. The continuity from scroll 4 to 5 —
same problem, gap solved — is the proof. AI governor enters here.

## 5. What's been tried and what it teaches us

Ten-plus prior page variants in the codebase covered metaphor space: iceberg,
two timelines, data lattice, split world, linear nodes, isometric stack,
Gantt before/after, blueprint spine, receipt calculator, node grid + storm.
None stuck because all of them tried to do too much in one frame and most
leaned on metaphor.

In our nine rounds: polished animated SVG concepts were rejected as too
polished too soon; sixteen rough napkin sketches missed the essence; five
sketches across the brief's directions were closer but still abstract; the
"Tuesday Morning" screenshot mocks were close but in the wrong position; the
Coordination Tax Statement landed conceptually but as a diagnosis treatment,
not a hero. **Variant B** — two columns of the same record, 4 events vs. 312
artifacts, black bar at the bottom naming Coordination Tax — is the only
treatment the user actively endorsed; it now lives as scroll 4. The
three-column SoR / Unifize / SoC composition built for the hero is
structurally correct *but in the wrong place* — that's the bridge between
scroll 4 and scroll 5, not the hero.

## 6. Visual principles

**Recognition over comprehension.** The test is not "does this read clearly?"
— it is "does the buyer say *yes that's exactly mine* in five seconds?" If
they pause to read a label before the visual lands, the visual has failed.

**Specificity over metaphor.** Real artifacts (filenames like
`CAPA_log_v17_FINAL_v2.xlsx`, subject lines like *"FW: FW: RE: CR-241 —
anyone?"*, status labels like *"Awaiting Reg sign-off · 14 days"*) carry
recognition weight that no metaphor can. Unless the metaphor is the
strategy's own (Coordination Tax, governed thread), avoid metaphors for the
diagnosis.

**One job per scroll.** Each scroll does exactly one thing. The hero is
*outcome.* Symptoms is *recognition.* Coordination Tax is *naming.* Root
cause is *diagnosis.* Unifize is *solution.* When a scroll tries to do two
jobs, both fail.

**Pain → name → number.** This is the order. The buyer recognises the pain,
the pattern gets a name, the name gets a number. Reverse it and you sound
like SAP — abstract, nebulous, marketing-led. This is Ben's specific guardrail.

**Show, don't explain.** Captions are the last resort. The visual should
carry the punchline before any label is read.

## 7. The aesthetic

- **Black-and-white primary.** Unifize blue (`#0052FF`) reserved exclusively
  for Unifize-specific elements — never for Coordination Tax, never for the
  gap, never for SoR or SoC items.
- **Hairline borders**, not heavy frames.
- **Type stack**: Newsreader serif for hero typography (italics carry
  emotional emphasis). Inter Tight for body and UI. JetBrains Mono for tags,
  technical labels, monospace data.
- **Density-tile fields** are the visual grammar for "uncaptured volume" —
  Variant B's pattern.
- **Tone**: sober, almost clinical — finance-document-feel rather than
  marketing-chart-feel.
- **Movement**: measured, not flashy. Bars filling, symptoms entering
  one-by-one, the gap closing — not parallax and orbit.

## 8. Traps to watch for

1. **Plugging Unifize in too early.** Any time a hero composition includes
   the SoR / Unifize / SoC architecture, it has collapsed scrolls 1-5 into
   scroll 1. The hero shows the *outcome.* The architecture lives at scroll 4-5.
2. **Generating before asking.** Surface confusion, ask, don't assume.
3. **Polishing before the structure lands.** Sketch fidelity is correct until
   Ben approves the sequence.
4. **Making the visual a chart.** Charts are the diagnosis section's job, not
   the hero's. Heroes vindicate; charts explain.
5. **Treating Coordination Tax as the headline.** It's the *third* thing a
   buyer hears — after outcome and symptoms.

## 9. References to anchor on

| Source | What it gives |
|--------|---------------|
| [Positioning Strategy v3.8](https://www.notion.so/32f860e6b45e81e1aeb6dbebaa604562) | Vocabulary, four pain processes, persona, competitive frame |
| [Concept Exploration Brief](https://www.notion.so/339860e6b45e81baadbed84cf4cc1832) | Exploration 1 (the gap visual) — the brief I'm solving |
| `Vindication_Diagnose_Mirror.html` | Three-act structural reference |
| `ben<>abhishek_29_4_26.md` | The call where Ben articulated the five-scroll flow |
| `HomeLinearStudio.tsx` | Current shipped implementation; the visual being replaced |
| `unifize-coordination-tax.html` (Variant B) | User-endorsed two-column diagnosis treatment |
| `unifize-five-scroll-flow.html` | Round 9 — current canonical flow |

## 10. The forward principle

Every next iteration should answer one question: **which scroll am I working
on, and what is that scroll's single job?**

- If I'm building a hero that contains the structural diagnosis → wrong scroll.
- If I'm naming Coordination Tax before showing symptoms → wrong order.
- If I'm sketching a metaphor when a concrete artifact would do → wrong fidelity.

The page works when scroll 1 vindicates without explaining, scroll 2 makes
the buyer feel seen without naming what they're feeling, scroll 3 names what
they're feeling, scroll 4 explains why, and scroll 5 — and **only** scroll 5
— introduces Unifize as the answer.

---

*Last updated: 2026-05-04. Maintained against the call notes and the v3.8
Positioning Strategy. Update when either changes.*
