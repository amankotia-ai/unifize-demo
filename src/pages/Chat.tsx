import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const CHAT_STYLES = `
.chat-root {
  --u-primary: #0052FF;
  --u-primary-hover: #003ECC;
  --u-primary-tint: #F0F4FF;
  --u-primary-border: #D6E0FF;
  --u-font: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --u-mono: 'JetBrains Mono', ui-monospace, monospace;

  --r-1: 2px; --r-2: 3px; --r-3: 5px; --r-4: 8px;
  --d: 1;

  --n-0: #FFFFFF; --n-25: #FBFBFC; --n-50: #F6F7F8;
  --n-100: #EEF0F2; --n-150: #E4E7EB; --n-200: #D8DCE1;
  --n-300: #B8BEC7; --n-400: #8B93A0; --n-500: #646B78;
  --n-600: #454B56; --n-700: #2B2F38; --n-800: #181B22; --n-900: #0B0D11;

  --s-ok: #0B8A5C; --s-ok-tint: #E8F5EF;
  --s-warn: #B4731A; --s-warn-tint: #FBF2E2;
  --s-err: #C4303A; --s-err-tint: #FBEBEC;

  --border: var(--n-150);
  --border-strong: var(--n-200);
  --text: var(--n-800);
  --text-muted: var(--n-500);
  --text-faint: var(--n-400);

  --shadow-md: 0 4px 12px -2px rgba(11,13,17,0.06), 0 0 0 1px rgba(11,13,17,0.05);
  --shadow-lg: 0 20px 40px -12px rgba(11,13,17,0.10), 0 0 0 1px rgba(11,13,17,0.05);

  font-family: var(--u-font);
  -webkit-font-smoothing: antialiased;
  background: var(--n-25);
  color: var(--text);
  font-size: 14px;
  letter-spacing: -0.005em;
  height: 100vh;
  overflow: hidden;
}
.chat-root * { box-sizing: border-box; }
.chat-root .mono { font-family: var(--u-mono); }

/* Shell: nav | list | thread | checklist */
.chat-root .app {
  display: grid;
  grid-template-columns: 56px 320px 1fr 340px;
  grid-template-rows: 100vh;
  height: 100vh;
  min-width: 0;
}
@media (max-width: 1280px) {
  .chat-root .app { grid-template-columns: 56px 280px 1fr 320px; }
}
.chat-root.embed .app { grid-template-columns: 56px 1fr 340px; }
.chat-root.embed .list { display: none; }
@media (max-width: 1280px) {
  .chat-root.embed .app { grid-template-columns: 56px 1fr 320px; }
}

/* ============= NAV ============= */
.chat-root .nav {
  background: var(--n-0);
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column; align-items: center;
  padding: 14px 0;
  gap: 4px;
}
.chat-root .nav-logo {
  width: 32px; height: 32px;
  background: var(--u-primary);
  color: white;
  border-radius: var(--r-2);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 14px;
  letter-spacing: -0.03em;
  margin-bottom: 14px;
  text-decoration: none;
}
.chat-root .nav-item {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  color: var(--n-400);
  border-radius: var(--r-2);
  cursor: pointer;
  position: relative;
  text-decoration: none;
}
.chat-root .nav-item:hover { background: var(--n-50); color: var(--n-700); }
.chat-root .nav-item.active { background: var(--u-primary-tint); color: var(--u-primary); }
.chat-root .nav-item.active::before {
  content: ''; position: absolute; left: -10px; top: 6px; bottom: 6px;
  width: 2px; background: var(--u-primary);
}
.chat-root .nav-spacer { flex: 1; }
.chat-root .nav-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(180deg, #C4D0E8, #8F9FBF);
}

/* ============= LIST ============= */
.chat-root .list {
  background: var(--n-0);
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column;
  min-width: 0;
}
.chat-root .list-head {
  padding: 14px 16px 10px;
  border-bottom: 1px solid var(--border);
}
.chat-root .list-head .top {
  display: flex; align-items: center; justify-content: space-between;
  gap: 8px;
}
.chat-root .list-head .org {
  font-family: var(--u-mono); font-size: 10px;
  text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--text-faint);
}
.chat-root .list-head .title {
  font-size: 16px; font-weight: 600; letter-spacing: -0.015em;
  margin-top: 4px;
  display: flex; align-items: baseline; gap: 8px;
}
.chat-root .list-head .title .count {
  font-family: var(--u-mono); font-weight: 400; font-size: 11px; color: var(--text-faint);
}
.chat-root .search {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 10px;
  background: var(--n-50);
  border: 1px solid var(--border);
  border-radius: var(--r-2);
  margin-top: 10px;
  font-size: 13px;
}
.chat-root .search input { all: unset; flex: 1; font-size: 13px; }
.chat-root .search .kbd {
  font-family: var(--u-mono); font-size: 10px;
  padding: 1px 5px; border: 1px solid var(--border);
  border-radius: 2px; color: var(--text-faint);
}
.chat-root .list-filters {
  padding: 5px 16px; display: flex; gap: 4px;
  border-bottom: 1px solid var(--border); background: var(--n-25);
}
.chat-root .chip {
  font-size: 12px; font-weight: 500;
  padding: 4px 9px; border-radius: var(--r-1);
  color: var(--text-muted); cursor: pointer;
  display: inline-flex; align-items: center; gap: 5px;
  background: transparent; border: none;
}
.chat-root .chip.active {
  background: var(--n-0); color: var(--text);
  box-shadow: inset 0 0 0 1px var(--border-strong);
}
.chat-root .chip .n { font-family: var(--u-mono); font-size: 10px; color: var(--text-faint); }
.chat-root .list-scroll { flex: 1; overflow: auto; }

.chat-root .conv {
  padding: 12px 16px; border-bottom: 1px solid var(--border);
  cursor: pointer; position: relative;
  min-width: 0;
}
.chat-root .conv:hover { background: var(--n-25); }
.chat-root .conv.selected { background: var(--u-primary-tint); }
.chat-root .conv.selected::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0;
  width: 2px; background: var(--u-primary);
}
.chat-root .conv.unread .conv-title { font-weight: 600; }
.chat-root .conv-top {
  display: flex; justify-content: space-between;
  gap: 8px; align-items: baseline;
}
.chat-root .conv-title {
  font-size: 13px; font-weight: 500; letter-spacing: -0.005em;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  min-width: 0;
}
.chat-root .conv-time {
  font-family: var(--u-mono); font-size: 10px;
  color: var(--text-faint); flex-shrink: 0;
}
.chat-root .conv-preview {
  font-size: 12px; color: var(--text-muted); margin-top: 2px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.chat-root .conv-meta {
  display: flex; align-items: center; gap: 6px;
  margin-top: 8px; font-size: 10px;
}
.chat-root .conv-tag {
  font-family: var(--u-mono); font-size: 10px; letter-spacing: 0.02em;
  padding: 1px 5px; border-radius: 2px;
  color: var(--text-muted); background: var(--n-100);
}
.chat-root .conv-sender {
  font-size: 11px; color: var(--text-faint);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  min-width: 0; flex: 1;
}
.chat-root .conv-unread {
  background: var(--u-primary); color: white;
  font-family: var(--u-mono); font-size: 10px;
  padding: 1px 5px; border-radius: 8px;
  font-weight: 600;
}

.chat-root .badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 10px; font-weight: 500;
  padding: 2px 6px; border-radius: var(--r-1);
  line-height: 1.5;
}
.chat-root .badge .pulse { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
.chat-root .badge-ok { background: var(--s-ok-tint); color: var(--s-ok); }
.chat-root .badge-warn { background: var(--s-warn-tint); color: var(--s-warn); }
.chat-root .badge-err { background: var(--s-err-tint); color: var(--s-err); }
.chat-root .badge-info { background: var(--u-primary-tint); color: var(--u-primary); }
.chat-root .badge-neutral { background: var(--n-100); color: var(--n-600); }

/* ============= THREAD ============= */
.chat-root .thread {
  display: flex; flex-direction: column;
  background: linear-gradient(180deg, #F5F8FF 0%, #E0E9FF 100%);
  min-width: 0;
  min-height: 0; overflow: hidden;
}
.chat-root .thread-head {
  padding: 14px 22px 12px;
  border-bottom: 1px solid var(--border);
  background: var(--n-0);
}
.chat-root .thread-head .id-row { display: flex; align-items: center; gap: 10px; }
.chat-root .thread-head .nc {
  font-family: var(--u-mono); font-size: 11px;
  color: var(--text-faint); letter-spacing: 0.04em;
}
.chat-root .thread-head h2 {
  font-size: 20px; font-weight: 600;
  letter-spacing: -0.02em; margin: 6px 0 0;
}
.chat-root .thread-meta {
  display: flex; gap: 14px; margin-top: 12px; align-items: center;
  font-size: 12px; color: var(--text-muted); flex-wrap: wrap;
}
.chat-root .meta-chip { display: flex; gap: 6px; align-items: center; }
.chat-root .meta-chip .k {
  font-family: var(--u-mono); font-size: 10px;
  text-transform: uppercase; color: var(--text-faint); letter-spacing: 0.06em;
}
.chat-root .meta-chip .v {
  font-size: 12px; color: var(--text); font-weight: 500;
  display: flex; align-items: center; gap: 5px;
}
.chat-root .meta-chip .avatar {
  width: 18px; height: 18px; border-radius: 50%;
  background: var(--n-150); color: var(--n-600);
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 8px; font-weight: 600;
}

.chat-root .thread-body {
  flex: 1; overflow: auto;
  padding: 18px 22px 20px;
  display: flex; flex-direction: column; gap: 14px;
}

.chat-root .day-sep {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 0 2px;
}
.chat-root .day-sep .line { flex: 1; height: 1px; background: var(--border); }
.chat-root .day-sep .label {
  font-family: var(--u-mono); font-size: 10px;
  color: var(--text-faint); text-transform: uppercase;
  letter-spacing: 0.08em;
}

.chat-root .msg { display: grid; grid-template-columns: 30px 1fr; gap: 10px; min-width: 0; }
.chat-root .msg-av {
  width: 30px; height: 30px; border-radius: 50%;
  background: var(--n-0); color: var(--n-700);
  border: 1px solid var(--border-strong);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 600;
  flex-shrink: 0;
}
.chat-root .msg-av.bot {
  background: var(--u-primary); color: #FFFFFF;
  border-color: var(--u-primary);
}
.chat-root .msg-body { min-width: 0; }
.chat-root .msg-name-row { display: flex; gap: 8px; align-items: baseline; }
.chat-root .msg-name { font-size: 13px; font-weight: 600; }
.chat-root .msg-name.bot { color: var(--u-primary); }
.chat-root .msg-time { font-family: var(--u-mono); font-size: 10px; color: var(--text-faint); }
.chat-root .msg-text {
  font-size: 13px; color: var(--text);
  margin-top: 2px; line-height: 1.55;
  overflow-wrap: break-word;
}

/* Bot/checklist card inside thread */
.chat-root .bot-card {
  margin-top: 8px;
  border: 1px solid var(--border);
  border-radius: var(--r-3);
  overflow: hidden;
  background: var(--n-0);
}
.chat-root .bot-card-head {
  padding: 10px 14px;
  background: var(--n-25);
  border-bottom: 1px solid var(--border);
  display: flex; justify-content: space-between; align-items: baseline;
}
.chat-root .bot-card-head .t {
  font-family: var(--u-mono); font-size: 10px;
  text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-faint);
}
.chat-root .bot-card-head .title {
  font-size: 13px; font-weight: 600; letter-spacing: -0.01em;
  margin-top: 2px;
}
.chat-root .bot-card-body { padding: 10px 14px; display: flex; flex-direction: column; gap: 6px; }
.chat-root .bot-row {
  display: flex; align-items: center; gap: 10px;
  font-size: 12px;
  padding: 4px 0;
}
.chat-root .bot-row input[type=checkbox] {
  accent-color: var(--u-primary);
  width: 13px; height: 13px;
}
.chat-root .bot-row .k { flex: 1; color: var(--text); }
.chat-root .bot-row.done .k {
  color: var(--text-muted);
  text-decoration: line-through;
  text-decoration-color: var(--n-200);
}
.chat-root .bot-row .v {
  font-family: var(--u-mono); font-size: 11px; color: var(--text-muted);
}

/* System event (joined, linked, etc.) */
.chat-root .sys {
  font-family: var(--u-mono); font-size: 10px;
  text-transform: uppercase; letter-spacing: 0.06em;
  color: var(--text-faint);
  padding: 4px 10px;
  border-left: 2px solid var(--border-strong);
  margin-left: 4px;
}

/* Composer */
.chat-root .composer {
  border-top: 1px solid var(--border); padding: 12px 22px 14px;
  background: var(--n-0);
}
.chat-root .composer-box {
  display: flex; flex-direction: column; gap: 8px;
  background: var(--n-0);
  border: 1px solid var(--border-strong);
  border-radius: var(--r-3);
  padding: 10px 12px;
}
.chat-root .composer-box:focus-within {
  border-color: var(--u-primary);
  box-shadow: 0 0 0 3px var(--u-primary-tint);
}
.chat-root .composer-input {
  all: unset;
  font-family: var(--u-font); font-size: 13px;
  min-height: 22px;
  color: var(--text);
}
.chat-root .composer-input:empty::before {
  content: attr(data-placeholder);
  color: var(--text-faint);
}
.chat-root .composer-tools {
  display: flex; align-items: center; gap: 4px;
}
.chat-root .tool {
  all: unset; width: 24px; height: 24px;
  display: flex; align-items: center; justify-content: center;
  border-radius: var(--r-1); color: var(--text-faint); cursor: pointer;
}
.chat-root .tool:hover { background: var(--n-100); color: var(--text); }
.chat-root .composer-tools .spacer { flex: 1; }
.chat-root .btn {
  font-family: var(--u-font); font-size: 13px; font-weight: 500;
  line-height: 1; padding: 7px 12px; border-radius: var(--r-2);
  border: 1px solid transparent; background: transparent; color: var(--text);
  cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
  letter-spacing: -0.005em;
}
.chat-root .btn-primary { background: var(--u-primary); color: white; }
.chat-root .btn-primary:hover { background: var(--u-primary-hover); }
.chat-root .btn-secondary { background: var(--n-0); border-color: var(--border-strong); }
.chat-root .btn-secondary:hover { background: var(--n-50); }
.chat-root .btn-ghost { color: var(--text-muted); }
.chat-root .btn-ghost:hover { background: var(--n-100); color: var(--text); }
.chat-root .btn-sm { padding: 5px 9px; font-size: 12px; }
.chat-root .btn .kbd {
  font-family: var(--u-mono); font-size: 10px;
  padding: 1px 5px; background: rgba(255,255,255,0.18);
  border-radius: 2px; color: rgba(255,255,255,0.85);
  margin-left: 4px;
}

/* ============= CHECKLIST ============= */
.chat-root .check {
  border-left: 1px solid var(--border);
  background: var(--n-0);
  display: flex; flex-direction: column;
  min-width: 0;
}
.chat-root .check-head {
  padding: 22px 18px 18px;
  border-bottom: 1px solid var(--border);
}
.chat-root .check-head .eyebrow {
  font-family: var(--u-mono); font-size: 10px;
  text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--text-faint);
  display: flex; align-items: center; gap: 8px;
}
.chat-root .check-head h3 {
  font-size: 15px; font-weight: 600;
  letter-spacing: -0.015em; margin: 4px 0 0;
}
.chat-root .check-progress {
  padding: 18px 18px 20px; border-bottom: 1px solid var(--border);
}
.chat-root .check-progress .row {
  display: flex; justify-content: space-between;
  font-size: 12px; align-items: baseline;
}
.chat-root .check-progress .row span:first-child { font-weight: 500; }
.chat-root .check-progress .row .frac {
  font-family: var(--u-mono); color: var(--text-muted); font-size: 11px;
}
.chat-root .prog-bar {
  height: 3px; background: var(--n-100);
  border-radius: 2px; margin-top: 8px; overflow: hidden;
}
.chat-root .prog-bar .fill { height: 100%; background: var(--u-primary); }

.chat-root .check-body { flex: 1; overflow: auto; }
.chat-root .sec { border-bottom: 1px solid var(--border); }
.chat-root .sec-head {
  padding: 11px 18px;
  display: flex; align-items: center; gap: 10px;
  cursor: pointer;
}
.chat-root .sec-head .dot { width: 6px; height: 6px; border-radius: 50%; }
.chat-root .sec-head .dot.done { background: var(--s-ok); }
.chat-root .sec-head .dot.active { background: var(--u-primary); box-shadow: 0 0 0 3px var(--u-primary-tint); }
.chat-root .sec-head .dot.pend { background: var(--n-200); }
.chat-root .sec-head .t { flex: 1; font-size: 13px; font-weight: 500; }
.chat-root .sec-head .t.done { color: var(--text-muted); }
.chat-root .sec-head .frac { font-family: var(--u-mono); font-size: 11px; color: var(--text-faint); }
.chat-root .sec-head .caret {
  color: var(--text-faint);
  transition: transform 120ms;
  transform: rotate(0deg);
  display: inline-flex;
}
.chat-root .sec-head.open .caret { transform: rotate(90deg); }
.chat-root .sec-items {
  padding: 4px 18px 14px 36px;
  display: none; flex-direction: column; gap: 6px;
}
.chat-root .sec.open .sec-items { display: flex; }
.chat-root .item {
  display: flex; align-items: center; gap: 10px;
  font-size: 12px; padding: 5px 0;
}
.chat-root .item input[type=checkbox] {
  accent-color: var(--u-primary);
  width: 13px; height: 13px;
}
.chat-root .item .label { flex: 1; color: var(--text); }
.chat-root .item.done .label {
  color: var(--text-muted);
  text-decoration: line-through;
  text-decoration-color: var(--n-200);
}
.chat-root .item .value { font-family: var(--u-mono); font-size: 11px; color: var(--text-muted); }

.chat-root .check-actions {
  padding: 12px 18px;
  border-top: 1px solid var(--border);
  display: flex; gap: 8px;
}
`;

const NavIcon = ({ children }: { children: React.ReactNode }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    {children}
  </svg>
);

type ConvStatusKind = "info" | "ok" | "warn" | "err";
type Conv = {
  sel?: boolean;
  unread?: boolean;
  title: string;
  prev: string;
  sender: string;
  tag: string;
  time: string;
  status: string;
  statusKind: ConvStatusKind;
  unreadCount: number;
};

const CONVS: Conv[] = [
  { sel: true, unread: false, title: "Assembly defect in final inspection", prev: "Daniel: CAR is DUE TODAY and ready for verification.", sender: "Daniel Storm", tag: "NC-25", time: "10:42", status: "IDENTIFIED", statusKind: "info", unreadCount: 0 },
  { sel: false, unread: true, title: "Version Control SOP", prev: "Mace: Nothing pending as of now.", sender: "Anakin Skywalker", tag: "DOC-25", time: "07:30", status: "COMPLETE", statusKind: "ok", unreadCount: 2 },
  { sel: false, unread: true, title: "Spec mismatch · delivery packaging", prev: "Anakin: Let me know if you need anything", sender: "Luke Skywalker", tag: "NC-14", time: "05:28", status: "COMPLETE", statusKind: "ok", unreadCount: 3 },
  { sel: false, unread: false, title: "IX974 Release · Batch #271", prev: "Anakin: Add-ons still pending", sender: "Obi-Wan Kenobi", tag: "LOT-271", time: "05:23", status: "COMPLETE", statusKind: "ok", unreadCount: 0 },
  { sel: false, unread: false, title: "Update CAD model for NC46-XR", prev: "Luke: Roger that. Will get it done.", sender: "Han Solo", tag: "CHG-34", time: "04:50", status: "COMPLETE", statusKind: "ok", unreadCount: 0 },
  { sel: false, unread: true, title: "Process map · stage 2 assembly", prev: "Han: Waiting for approval", sender: "Princess Leia", tag: "DOC-12", time: "04:18", status: "PENDING", statusKind: "warn", unreadCount: 1 },
  { sel: false, unread: false, title: "IX974 Release · Batch #234", prev: "Obi-Wan: Just sent the review", sender: "Chewbacca", tag: "LOT-234", time: "Yesterday", status: "COMPLETE", statusKind: "ok", unreadCount: 0 },
  { sel: false, unread: false, title: "Product quality pre-release evaluation SOP", prev: "Princess: ETA please. Need this to plan my scope.", sender: "Wedge Antilles", tag: "DOC-33", time: "Yesterday", status: "COMPLETE", statusKind: "ok", unreadCount: 0 },
  { sel: false, unread: false, title: "Calibration failure · torque tool", prev: "Han: Verified on Line 3.", sender: "Han Solo", tag: "NC-19", time: "Apr 16", status: "COMPLETE", statusKind: "ok", unreadCount: 0 },
  { sel: false, unread: false, title: "Paint thickness below spec", prev: "Leia: Still under investigation", sender: "Leia Organa", tag: "NC-18", time: "Apr 14", status: "OVERDUE", statusKind: "err", unreadCount: 0 },
];

type BotItem = { c: boolean; l: string; v: string };
type Message =
  | { type: "day"; label: string }
  | { type: "sys"; text: string }
  | { type: "msg"; name: string; initials: string; time: string; text: string }
  | { type: "bot" | "bot-assistant"; title: string; section: string; items: BotItem[] };

const MESSAGES: Message[] = [
  { type: "day", label: "Apr 18" },
  { type: "sys", text: "Lisa Martin created this conversation · linked to NC-25" },
  { type: "msg", name: "Lisa Martin", initials: "LM", time: "09:02", text: "We've found an assembly defect during the final inspection. Let's investigate and find out what went wrong." },
  { type: "msg", name: "Lisa Martin", initials: "LM", time: "09:12", text: "Adding disposition action to Scrap. We'll isolate and scrap the defective assemblies to prevent further issues." },
  { type: "bot", title: "Updated checklist", section: "Disposition action", items: [{ c: true, l: "Scrap", v: "12 units" }] },
  { type: "msg", name: "Daniel Storm", initials: "DS", time: "09:42", text: "Just had a look at the issue — I'll raise a Corrective Action Request to prevent this from happening ever again." },
  {
    type: "bot",
    title: "Updated checklist",
    section: "Corrective Action Request (CAR)",
    items: [
      { c: true, l: "CAR-41 · Prevent recurrence of assembly defects", v: "Linked" },
      { c: true, l: "Record owner", v: "Daniel Storm" },
    ],
  },
  { type: "day", label: "Today" },
  { type: "msg", name: "Rupa Kapoor", initials: "RK", time: "10:14", text: "Reviewed incoming materials — traceability points to a secondary supplier. Likely a contributing factor." },
  {
    type: "bot-assistant",
    title: "Root cause analysis",
    section: "RCA-12",
    items: [
      { c: true, l: "Material inconsistency", v: "High confidence" },
      { c: false, l: "Operator training gap", v: "Investigating" },
      { c: false, l: "Jig alignment", v: "Investigating" },
    ],
  },
  { type: "msg", name: "Daniel Storm", initials: "DS", time: "10:38", text: "Thanks — I'll create corrective actions for each cause. @Lisa @Rupa please review." },
];

type SectionState = "done" | "active" | "pend";
type Section = {
  t: string;
  state: SectionState;
  n: number;
  nt: number;
  open?: boolean;
  items?: { c: boolean; l: string; v: string }[];
};

const SECS: Section[] = [
  { t: "Inputs", state: "done", n: 4, nt: 4 },
  {
    t: "Basic information",
    state: "done",
    n: 6,
    nt: 6,
    items: [
      { c: true, l: "CAR opened by", v: "Daniel Storm" },
      { c: true, l: "Source NC", v: "NC-25" },
      { c: true, l: "Severity", v: "High" },
      { c: true, l: "Customer impact", v: "Internal only" },
      { c: true, l: "Target closure date", v: "Apr 28" },
      { c: true, l: "Owner", v: "Daniel Storm" },
    ],
  },
  { t: "Disposition action", state: "done", n: 3, nt: 3 },
  {
    t: "Corrective Action Request(s)",
    state: "active",
    n: 2,
    nt: 5,
    open: true,
    items: [
      { c: true, l: "Update Process Control Plan", v: "Daniel" },
      { c: true, l: "Retrain line operators", v: "Lisa" },
      { c: false, l: "Revise inspection criteria", v: "Pending" },
      { c: false, l: "Vendor corrective note sent", v: "Pending" },
      { c: false, l: "Incoming spec update", v: "Pending" },
    ],
  },
  { t: "Verification & Validation", state: "pend", n: 0, nt: 4 },
  { t: "Approval(s)", state: "pend", n: 0, nt: 2 },
  { t: "Generate PDF report", state: "pend", n: 0, nt: 1 },
  { t: "Related records", state: "pend", n: 0, nt: 3 },
];

const Chat = () => {
  const [openSections, setOpenSections] = useState<Record<number, boolean>>(() => {
    const init: Record<number, boolean> = {};
    SECS.forEach((s, i) => { if (s.open) init[i] = true; });
    return init;
  });
  const composerRef = useRef<HTMLDivElement>(null);
  const embed =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("embed") === "1";

  useEffect(() => {
    document.title = "Unifize — Chat";
  }, []);

  const toggleSection = (i: number) =>
    setOpenSections((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className={`chat-root${embed ? " embed" : ""}`}>
      <style>{CHAT_STYLES}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;550;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <div className="app">
        {/* Nav */}
        <aside className="nav">
          <Link to="/" className="nav-logo" title="Home">U</Link>
          <Link to="/" className="nav-item" title="Home">
            <NavIcon>
              <path d="M3 8L9 3.5 15 8v6.5a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5V8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            </NavIcon>
          </Link>
          <Link to="/chat" className="nav-item active" title="Conversations">
            <NavIcon>
              <path d="M3 5a1 1 0 011-1h10a1 1 0 011 1v7a1 1 0 01-1 1H7l-4 3V5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            </NavIcon>
          </Link>
          <Link to="/chat" className="nav-item" title="Documents">
            <NavIcon>
              <path d="M5 2.5h5.5L14 6v8.5a1 1 0 01-1 1H5a1 1 0 01-1-1v-11a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              <path d="M10 2.5V6h4" stroke="currentColor" strokeWidth="1.4" />
            </NavIcon>
          </Link>
          <Link to="/dashboard" className="nav-item" title="Dashboard">
            <NavIcon>
              <rect x="3" y="3" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.4" />
              <rect x="9.5" y="3" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.4" />
              <rect x="3" y="9.5" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.4" />
              <rect x="9.5" y="9.5" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.4" />
            </NavIcon>
          </Link>
          <Link to="/dashboard" className="nav-item" title="People">
            <NavIcon>
              <circle cx="9" cy="7" r="2.8" stroke="currentColor" strokeWidth="1.4" />
              <path d="M3.5 15c1.2-2.8 3.4-3.9 5.5-3.9s4.3 1.1 5.5 3.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </NavIcon>
          </Link>
          <div className="nav-spacer" />
          <div className="nav-item" title="Settings">
            <NavIcon>
              <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M9 3.5V2m0 14v-1.5m5.5-5.5H16M2 9h1.5M12.9 5.1L14 4M4 14l1.1-1.1M12.9 12.9L14 14M4 4l1.1 1.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </NavIcon>
          </div>
          <div className="nav-avatar" />
        </aside>

        {/* List */}
        <aside className="list">
          <div className="list-head">
            <div className="top">
              <div>
                <div className="org">Engineering Industries</div>
                <div className="title">
                  My Conversations <span className="count">999+</span>
                </div>
              </div>
              <button className="btn btn-primary btn-sm">
                + New <span className="kbd">N</span>
              </button>
            </div>
            <div className="search">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <input placeholder="Search conversations" />
              <span className="kbd">⌘K</span>
            </div>
          </div>
          <div className="list-filters">
            <button className="chip active">All <span className="n">24</span></button>
            <button className="chip">Unread <span className="n">6</span></button>
            <button className="chip">Mine <span className="n">12</span></button>
            <button className="chip">Pinned <span className="n">3</span></button>
          </div>
          <div className="list-scroll">
            {CONVS.map((c, i) => (
              <div
                key={i}
                className={`conv${c.sel ? " selected" : ""}${c.unread ? " unread" : ""}`}
              >
                <div className="conv-top">
                  <div className="conv-title">{c.title}</div>
                  <div className="conv-time">{c.time}</div>
                </div>
                <div className="conv-preview">{c.prev}</div>
                <div className="conv-meta">
                  <span className="conv-tag">{c.tag}</span>
                  <span className="conv-sender">{c.sender}</span>
                  {c.unreadCount > 0 ? (
                    <span className="conv-unread">{c.unreadCount}</span>
                  ) : (
                    <span className={`badge badge-${c.statusKind}`}>
                      <span className="pulse" />
                      {c.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Thread */}
        <section className="thread">
          <div className="thread-head">
            <div className="id-row">
              <span className="badge badge-info"><span className="pulse" />IDENTIFIED</span>
              <span className="nc">NC-25</span>
              <span className="nc">·</span>
              <span className="nc">Opened Apr 18</span>
            </div>
            <h2>Assembly defect detected in final inspection</h2>
            <div className="thread-meta">
              <div className="meta-chip">
                <span className="k">Owner</span>
                <span className="v"><span className="avatar">LM</span>Lisa Martin</span>
              </div>
              <div className="meta-chip">
                <span className="k">Participants</span>
                <span className="v">
                  <span className="avatar" style={{ marginRight: -4 }}>DS</span>
                  <span className="avatar" style={{ marginRight: -4 }}>RK</span>
                  <span className="avatar" style={{ marginRight: -4 }}>HS</span>
                  <span className="avatar">+2</span>
                </span>
              </div>
              <div className="meta-chip"><span className="k">Due</span><span className="v">Apr 24</span></div>
              <div className="meta-chip"><span className="k">Priority</span><span className="v">Normal</span></div>
              <div className="meta-chip"><span className="k">Linked</span><span className="v">CAR-41 · RCA-12</span></div>
            </div>
          </div>

          <div className="thread-body">
            {MESSAGES.map((m, i) => {
              if (m.type === "day") {
                return (
                  <div key={i} className="day-sep">
                    <div className="line" />
                    <div className="label">{m.label}</div>
                    <div className="line" />
                  </div>
                );
              }
              if (m.type === "sys") {
                return <div key={i} className="sys">· {m.text}</div>;
              }
              if (m.type === "msg") {
                return (
                  <div key={i} className="msg">
                    <div className="msg-av">{m.initials}</div>
                    <div className="msg-body">
                      <div className="msg-name-row">
                        <span className="msg-name">{m.name}</span>
                        <span className="msg-time">{m.time}</span>
                      </div>
                      <div className="msg-text">{m.text}</div>
                    </div>
                  </div>
                );
              }
              return (
                <div key={i} className="msg">
                  <div className="msg-av bot">U</div>
                  <div className="msg-body">
                    <div className="msg-name-row">
                      <span className="msg-name bot">Unifize Assistant</span>
                      <span className="msg-time">auto-updated</span>
                    </div>
                    <div className="bot-card">
                      <div className="bot-card-head">
                        <div>
                          <div className="t">{m.title}</div>
                          <div className="title">{m.section}</div>
                        </div>
                        <span className="badge badge-info"><span className="pulse" />LINKED</span>
                      </div>
                      <div className="bot-card-body">
                        {m.items.map((it, j) => (
                          <div key={j} className={`bot-row${it.c ? " done" : ""}`}>
                            <input type="checkbox" defaultChecked={it.c} />
                            <span className="k">{it.l}</span>
                            <span className="v">{it.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="composer">
            <div className="composer-box">
              <div
                ref={composerRef}
                className="composer-input"
                contentEditable
                data-placeholder="Reply to NC-25…"
                suppressContentEditableWarning
              />
              <div className="composer-tools">
                <button className="tool" title="Attach">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M12 7l-5 5a3 3 0 01-4-4l6-6a2 2 0 013 3l-6 6a1 1 0 01-1-1l5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button className="tool" title="Mention">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M10.5 8v1a1.8 1.8 0 003.5 0V8a6 6 0 10-2.5 4.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </button>
                <button className="tool" title="Link record">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M6 10l4-4M7 5l1.5-1.5a2 2 0 013 3L11 8M9 11l-1.5 1.5a2 2 0 01-3-3L6 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </button>
                <button className="tool" title="AI">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2l1.5 4L13 7.5 9.5 9 8 13 6.5 9 3 7.5 6.5 6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="spacer" />
                <button className="btn btn-ghost btn-sm">Save draft</button>
                <button className="btn btn-primary btn-sm">
                  Send <span className="kbd">↩</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Checklist */}
        <aside className="check">
          <div className="check-head">
            <div className="eyebrow">
              <span>CAR-41 · Checklist</span>
              <span style={{ marginLeft: "auto", fontFamily: "var(--u-mono)", color: "var(--text-faint)" }}>v4.2</span>
            </div>
            <h3>Corrective action request</h3>
          </div>
          <div className="check-progress">
            <div className="row">
              <span>Completion</span>
              <span className="frac">5/8 sections</span>
            </div>
            <div className="prog-bar"><div className="fill" style={{ width: "62.5%" }} /></div>
          </div>
          <div className="check-body">
            {SECS.map((s, i) => {
              const open = openSections[i] ?? false;
              return (
                <div key={i} className={`sec${open ? " open" : ""}`}>
                  <div
                    className={`sec-head${open ? " open" : ""}`}
                    onClick={() => toggleSection(i)}
                  >
                    <span className={`dot ${s.state}`} />
                    <span className={`t${s.state === "done" ? " done" : ""}`}>{s.t}</span>
                    <span className="frac">{s.n}/{s.nt}</span>
                    <span className="caret">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                    </span>
                  </div>
                  {s.items && (
                    <div className="sec-items">
                      {s.items.map((it, j) => (
                        <div key={j} className={`item${it.c ? " done" : ""}`}>
                          <input type="checkbox" defaultChecked={it.c} />
                          <span className="label">{it.l}</span>
                          <span className="value">{it.v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="check-actions">
            <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v8m0 0l-3-3m3 3l3-3M3 13h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Export PDF
            </button>
            <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>Approve CAR</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Chat;
