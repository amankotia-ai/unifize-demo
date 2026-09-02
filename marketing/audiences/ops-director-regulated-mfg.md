---
id: ops-director-regulated-mfg
name: "Operations director at a regulated manufacturer running on the Microsoft stack"
segment: "Operations"
status: draft
weight: 1.0
derivedFrom:
  icpUpdatedAt: 2026-05-11T00:00:00Z
  sources:
    - "repo:brief-a.md (section 03 chairs: Operations)"
    - "repo:ben<>abhishek_28_4_26.md (lines 143-146: dashboard is for the operations person; cycle times, handoff speed, rework)"
    - "repo:call_latest.md (line 174: the operations manager, the CEO lying in bed thinking why can't I deliver products on time)"
    - "repo:homepage_words_first.md (section 8: Built on the Microsoft stack; Slack hard ban)"
    - "memory:project_unifize.md (Microsoft-shop buyer: Outlook, Teams, SharePoint, Excel; ECO/PO jargon)"
    - "repo:ben<>abhishek_7_5_26 copy.md (line 90: cross-functional work runs through email, meetings, Excel trackers, SharePoint)"
firmographics:
  role: "Director of Operations / Manufacturing"
  reportsTo: "COO"
  companySize: "Mid-size regulated manufacturer"
  industry: "Regulated manufacturing (med device, aerospace, laboratories, CROs per call_latest line 32)"
  stack: ["ERP", "MES", "Outlook", "Teams", "SharePoint", "Excel trackers"]  # partly evidenced (memory: Microsoft-shop bias; 7_5 line 25: SharePoint, paper); the rest is NOT EVIDENCED
jobsToBeDone:
  - "Deliver products on time; shrink cycle time on ECOs, NPIs and supplier issues (call_latest line 174; 28_4 line 143)"
  - "See handoff speed, rework and cycle time on one dashboard (28_4 line 143; 29_4 line 488)"
pains:
  - "Cross-functional work stalls in email threads and Excel trackers between systems (7_5 line 90)"
  - "Rework loops and waiting time inflate calendar days far beyond work days (brief-a section 02: five days of work, ninety-two days of calendar)"
objections:
  - "Another tool for the floor to adopt on top of ERP and MES (28_4 line 66: it should reflect the ERP, QMS, PLM, MES world)"
  - "If it needs IT to configure it, it will not get configured (7_5 line 90: work runs through trackers the team owns; 28_4 line 143: ops wants to see cycle times themselves)"
  - "Slack? We are a Teams shop (words_first Slack hard ban; memory Microsoft stack)"
buyingTriggers:
  - "Missed delivery dates traced to approvals and handoffs, not capacity (call_latest line 174)"
decisionCriteria:
  - "Cycle-time visibility per process, not generic reporting (28_4 line 143)"
  - "Fits Outlook, Teams, SharePoint, Excel without a rip-and-replace"
  - "Configurable by ops, not by a project team"
infoDiet: ["peers at other plants", "ERP and MES vendor ecosystems", "LinkedIn manufacturing content"]  # NOT EVIDENCED in sources; founder to confirm
vocabulary:
  resonates: ["cycle time", "handoff", "rework", "ECO", "PO", "on-time delivery", "escalation"]
  repels: ["Slack named as the collaboration tool (words_first line 75: hard ban; memory: Microsoft-shop stack)", "tooling language that does not name the ERP, MES, QMS world (28_4 line 66)"]
sophistication: "Runs the plant from dashboards and trackers (28_4 line 143); judges software by whether it removes a tracker or adds one (7_5 line 90)"
willingnessToPay: "Not evidenced in sources; do not assume"
calibration:
  predictions: 0
  hits: 0
---

## How they evaluate

Looks for the metric first. If a page shows cycle time, handoff speed and rework going down, they lean in (28_4 line 143). Then checks whether the thing plugs into the Microsoft tools their people already open every morning, because a Slack logo tells them the vendor sells to someone else (words_first section 8). What they forward to the COO is the dashboard. What kills the deal is any hint of an IT project or a second tracker.

## Synthetic phrasing reference (synthetic, never quote as real)

- "Where does this sit between my ERP and my inbox?"
- "Show me the cycle time before and after, on a real ECO."
- "We are a Teams shop. Why is Slack on here?"
