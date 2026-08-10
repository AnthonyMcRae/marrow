import React, { useState, useEffect, useRef } from "react";
import {
  Feather, Sparkles, Users, ListTree, BookOpen, Plus, RefreshCw,
  Wand2, Download, FilePlus2, ChevronDown, ChevronRight, Copy, Check,
  Trash2, ArrowRight, AlertCircle, Quote, Upload, FileText, X,
  Library, Mic, ShieldCheck, AlertTriangle, PenLine
} from "lucide-react";

/* ----------------------------------------------------------------
   Marrow — a story studio
   Intake -> Foundation -> Deep Cast -> Outline -> Scene
   Generation is powered by live Claude calls.
----------------------------------------------------------------- */

const CSS = `
.mrw {
  --ink-900:#131119; --ink-800:#1B1924; --ink-700:#24222F; --ink-650:#2C2937;
  --line:#39354A; --line-soft:#2E2B3A;
  --paper:#F3EEE2; --paper-2:#E9E2D1; --paper-edge:#D6CCB4;
  --tink:#211C15; --tink-soft:#5C5345;
  --on-dark:#D7D2E0; --muted:#928CA6; --muted-2:#615C73;
  --brass:#C79B49; --brass-bright:#E0BE72; --brass-deep:#9A7730;
  --oxblood:#A24257; --oxblood-soft:#7C2F3E;
  --teal:#4E8A86;
  --serif: "Iowan Old Style","Palatino Linotype",Palatino,Georgia,"Times New Roman",serif;
  --sans: ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  --mono: ui-monospace,"SF Mono","Roboto Mono",Menlo,Consolas,monospace;
  font-family: var(--sans);
  color: var(--on-dark);
  background: radial-gradient(120% 90% at 50% -10%, #211E2C 0%, var(--ink-900) 60%);
  min-height: 760px; display:flex; line-height:1.5; -webkit-font-smoothing:antialiased;
}
.mrw *{box-sizing:border-box;}
.mrw button{font-family:inherit;cursor:pointer;border:none;background:none;color:inherit;}
.mrw ::selection{background:var(--brass);color:#1a1620;}

/* spine rail */
.rail{width:84px;flex:0 0 84px;border-right:1px solid var(--line-soft);
  display:flex;flex-direction:column;align-items:center;padding:22px 0;background:var(--ink-900);}
.mark{font-family:var(--serif);font-weight:600;font-size:13px;letter-spacing:.32em;color:var(--brass);
  writing-mode:vertical-rl;text-orientation:mixed;transform:rotate(180deg);margin-bottom:26px;user-select:none;}
.spine{display:flex;flex-direction:column;gap:0;align-items:center;flex:1;}
.vert{position:relative;display:flex;flex-direction:column;align-items:center;}
.vbtn{width:34px;height:34px;border-radius:9px;border:1px solid var(--line);
  display:grid;place-items:center;color:var(--muted-2);transition:all .25s;background:var(--ink-800);}
.vbtn.done{background:linear-gradient(180deg,var(--brass-bright),var(--brass));color:#241c10;border-color:var(--brass-deep);
  box-shadow:0 0 0 3px rgba(199,155,73,.12);}
.vbtn.active{border-color:var(--brass);color:var(--brass-bright);box-shadow:0 0 0 3px rgba(199,155,73,.18);}
.vbtn.locked{opacity:.4;cursor:not-allowed;}
.vbtn:not(.locked):hover{border-color:var(--brass);color:var(--brass-bright);}
.vstem{width:2px;height:20px;background:var(--line-soft);}
.vstem.lit{background:var(--brass);}
.vlabel{font-family:var(--mono);font-size:8.5px;letter-spacing:.14em;color:var(--muted-2);margin-top:6px;text-transform:uppercase;}

/* main */
.main{flex:1;display:flex;flex-direction:column;min-width:0;}
.topbar{display:flex;align-items:center;gap:14px;padding:16px 26px;border-bottom:1px solid var(--line-soft);}
.ptitle{font-family:var(--serif);font-size:17px;color:var(--on-dark);background:transparent;border:none;outline:none;
  min-width:60px;max-width:420px;flex:1;}
.ptitle::placeholder{color:var(--muted-2);font-style:italic;}
.save{font-family:var(--mono);font-size:10px;letter-spacing:.1em;color:var(--muted-2);text-transform:uppercase;}
.tb-actions{display:flex;gap:8px;}
.ghost{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;color:var(--muted);
  padding:7px 11px;border-radius:8px;border:1px solid var(--line);transition:all .2s;}
.ghost:hover{color:var(--on-dark);border-color:var(--muted-2);}

.scroll{overflow-y:auto;flex:1;}
.wrap{max-width:880px;margin:0 auto;padding:38px 40px 90px;}

.eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.22em;color:var(--brass);text-transform:uppercase;margin-bottom:14px;display:flex;align-items:center;gap:9px;}
.h1{font-family:var(--serif);font-size:34px;line-height:1.12;color:#F4EFE4;margin:0 0 8px;font-weight:600;letter-spacing:-.01em;}
.lede{color:var(--muted);font-size:15px;max-width:560px;margin-bottom:30px;}

/* intake */
.compose{background:var(--ink-800);border:1px solid var(--line);border-radius:16px;padding:6px;}
.compose textarea{width:100%;background:transparent;border:none;outline:none;resize:vertical;color:var(--on-dark);
  font-family:var(--serif);font-size:18px;line-height:1.55;padding:20px 22px;min-height:150px;}
.compose textarea::placeholder{color:var(--muted-2);}
.sparks{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0 26px;}
.spark{font-size:12.5px;color:var(--muted);border:1px dashed var(--line);border-radius:20px;padding:7px 13px;transition:all .2s;}
.spark:hover{color:var(--brass-bright);border-color:var(--brass);border-style:solid;}
.controls{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:14px;}
.ctl label{display:block;font-family:var(--mono);font-size:9.5px;letter-spacing:.14em;color:var(--muted-2);text-transform:uppercase;margin-bottom:6px;}
.ctl select,.ctl input{width:100%;background:var(--ink-700);border:1px solid var(--line);border-radius:9px;color:var(--on-dark);
  font-family:var(--sans);font-size:13px;padding:9px 11px;outline:none;}
.ctl select:focus,.ctl input:focus{border-color:var(--brass);}
.seeds-toggle{display:inline-flex;align-items:center;gap:7px;font-size:13px;color:var(--muted);margin:6px 0 14px;}
.seedrow{display:flex;gap:8px;margin-bottom:8px;}
.seedrow input{flex:1;background:var(--ink-700);border:1px solid var(--line);border-radius:9px;color:var(--on-dark);
  font-size:13px;padding:9px 11px;outline:none;}
.seedrow input:focus{border-color:var(--brass);}

.cta{display:inline-flex;align-items:center;gap:10px;font-size:15px;font-weight:600;color:#241c10;
  background:linear-gradient(180deg,var(--brass-bright),var(--brass));padding:14px 24px;border-radius:11px;
  box-shadow:0 6px 22px rgba(199,155,73,.22);transition:transform .15s,box-shadow .2s;letter-spacing:.01em;}
.cta:hover{transform:translateY(-1px);box-shadow:0 9px 28px rgba(199,155,73,.3);}
.cta:disabled{opacity:.55;cursor:wait;transform:none;box-shadow:none;}
.cta.sm{font-size:13.5px;padding:11px 18px;}
.cta.ox{background:linear-gradient(180deg,var(--oxblood),var(--oxblood-soft));color:#fbe9ec;box-shadow:0 6px 22px rgba(124,47,62,.22);}

/* paper cards */
.paper{background:linear-gradient(180deg,var(--paper),var(--paper-2));color:var(--tink);
  border-radius:14px;padding:26px 28px;border:1px solid var(--paper-edge);position:relative;
  box-shadow:0 14px 40px -18px rgba(0,0,0,.6);}
.paper + .paper{margin-top:18px;}
.meta{font-family:var(--mono);font-size:10px;letter-spacing:.16em;color:#8a7a5a;text-transform:uppercase;margin-bottom:7px;}
.logline{font-family:var(--serif);font-size:24px;line-height:1.3;color:var(--tink);font-weight:600;}
.tagrow{display:flex;flex-wrap:wrap;gap:7px;margin-top:16px;}
.tag{font-family:var(--mono);font-size:10.5px;letter-spacing:.08em;color:#6b5e44;background:rgba(124,103,60,.1);
  border:1px solid rgba(124,103,60,.2);border-radius:6px;padding:5px 9px;text-transform:uppercase;}
.divid{height:1px;background:rgba(124,103,60,.2);margin:22px 0;}
.prose{font-family:var(--serif);font-size:16px;line-height:1.62;color:#332b1f;}
.pull{font-family:var(--serif);font-style:italic;font-size:18px;line-height:1.5;color:var(--oxblood-soft);
  border-left:3px solid var(--brass);padding-left:16px;margin:4px 0;}
.flabel{font-family:var(--mono);font-size:10px;letter-spacing:.14em;color:#8a7a5a;text-transform:uppercase;margin:18px 0 5px;}

/* editable */
.edit{cursor:text;border-radius:6px;transition:background .15s;outline:none;}
.edit:hover{background:rgba(124,103,60,.07);}
.edit:focus{background:rgba(124,103,60,.1);box-shadow:0 0 0 2px rgba(199,155,73,.4);}

/* character dossier */
.dossier{background:linear-gradient(180deg,var(--paper),var(--paper-2));color:var(--tink);border:1px solid var(--paper-edge);
  border-radius:14px;margin-bottom:16px;overflow:hidden;box-shadow:0 12px 34px -20px rgba(0,0,0,.55);}
.dhead{display:flex;align-items:center;gap:14px;padding:18px 22px;cursor:pointer;}
.dhead:hover{background:rgba(124,103,60,.05);}
.dnum{font-family:var(--mono);font-size:11px;color:#a08a5c;width:22px;flex:0 0 22px;}
.dname{font-family:var(--serif);font-size:20px;font-weight:600;color:var(--tink);line-height:1.1;}
.drole{font-family:var(--mono);font-size:10px;letter-spacing:.13em;color:var(--oxblood-soft);text-transform:uppercase;margin-top:3px;}
.done-line{font-size:13.5px;color:var(--tink-soft);margin-top:2px;font-family:var(--serif);font-style:italic;}
.dbody{padding:4px 22px 24px;}
.psy{display:grid;grid-template-columns:1fr 1fr;gap:2px;background:rgba(124,103,60,.18);border-radius:10px;overflow:hidden;margin:6px 0 18px;}
.cell{background:var(--paper);padding:13px 15px;}
.cell .k{font-family:var(--mono);font-size:9.5px;letter-spacing:.13em;color:var(--oxblood-soft);text-transform:uppercase;margin-bottom:5px;}
.cell .v{font-size:14px;line-height:1.45;color:#3a3122;}
.voicebox{background:rgba(78,138,134,.08);border:1px solid rgba(78,138,134,.25);border-radius:10px;padding:14px 16px;margin:6px 0 16px;}
.vsample{font-family:var(--serif);font-style:italic;font-size:16px;color:#234b48;line-height:1.5;display:flex;gap:8px;}
.arc{display:flex;align-items:stretch;gap:0;margin:8px 0 16px;}
.arcstep{flex:1;padding:12px 14px;background:var(--paper);border:1px solid var(--paper-edge);position:relative;}
.arcstep:first-child{border-radius:10px 0 0 10px;}
.arcstep:last-child{border-radius:0 10px 10px 0;}
.arcstep .k{font-family:var(--mono);font-size:9px;letter-spacing:.12em;color:#a08a5c;text-transform:uppercase;margin-bottom:5px;}
.arcstep .v{font-size:12.5px;line-height:1.4;color:#3a3122;}
.rel{display:flex;gap:8px;font-size:13px;color:#3a3122;margin:5px 0;}
.rel b{color:var(--oxblood-soft);font-weight:600;}
.dactions{display:flex;gap:8px;margin-top:6px;flex-wrap:wrap;}
.mini{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;color:#6b5e44;border:1px solid var(--paper-edge);
  background:var(--paper);border-radius:7px;padding:6px 10px;transition:all .18s;}
.mini:hover{border-color:var(--brass);color:var(--brass-deep);}
.mini.danger:hover{border-color:var(--oxblood);color:var(--oxblood);}

/* outline */
.act{margin-bottom:26px;}
.actname{font-family:var(--serif);font-size:20px;color:#F4EFE4;font-weight:600;margin-bottom:4px;}
.actsum{color:var(--muted);font-size:13.5px;margin-bottom:14px;}
.chap{background:var(--ink-800);border:1px solid var(--line);border-radius:12px;margin-bottom:12px;overflow:hidden;}
.chaphead{display:flex;align-items:baseline;gap:12px;padding:14px 18px;}
.chapno{font-family:var(--mono);font-size:11px;color:var(--brass);}
.chaptitle{font-family:var(--serif);font-size:16px;color:var(--on-dark);font-weight:600;}
.chapsum{color:var(--muted);font-size:13px;margin-left:auto;font-style:italic;}
.beat{display:flex;gap:13px;padding:12px 18px;border-top:1px solid var(--line-soft);align-items:flex-start;}
.beat:hover{background:var(--ink-700);}
.bdot{width:7px;height:7px;border-radius:50%;background:var(--brass);margin-top:6px;flex:0 0 7px;}
.btext{flex:1;}
.bmain{font-size:14px;color:var(--on-dark);line-height:1.45;}
.bmeta{font-family:var(--mono);font-size:10px;letter-spacing:.06em;color:var(--muted-2);margin-top:5px;display:flex;gap:14px;flex-wrap:wrap;}
.bmeta span b{color:var(--teal);font-weight:400;}
.writebtn{align-self:center;display:inline-flex;align-items:center;gap:6px;font-size:11.5px;color:var(--brass);
  border:1px solid var(--line);border-radius:7px;padding:6px 10px;white-space:nowrap;transition:all .18s;}
.writebtn:hover{border-color:var(--brass);background:rgba(199,155,73,.08);}
.writebtn.has{color:var(--teal);border-color:rgba(78,138,134,.4);}
.chapfoot{padding:11px 18px;border-top:1px solid var(--line-soft);display:flex;align-items:center;}
.beatbtn{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--brass);border:1px solid var(--line);border-radius:7px;padding:7px 12px;transition:all .18s;}
.beatbtn:hover{border-color:var(--brass);background:rgba(199,155,73,.08);}
.beatbtn.ox{color:var(--oxblood-soft);border-color:rgba(124,47,62,.45);}
.beatbtn.ox:hover{background:rgba(162,66,87,.1);border-color:var(--oxblood);}
.beatbtn.subtle{color:var(--muted-2);border-color:transparent;padding:6px 8px;}
.beatbtn.subtle:hover{color:var(--brass);background:transparent;}
.beatbtn.brass{color:#241c10;background:linear-gradient(180deg,var(--brass-bright),var(--brass));border-color:var(--brass-deep);}
.beatbtn.brass:hover{background:linear-gradient(180deg,var(--brass-bright),var(--brass));filter:brightness(1.05);}
.switch{display:flex;align-items:center;gap:9px;font-size:13px;color:var(--muted);cursor:pointer;user-select:none;}
.switch input{width:16px;height:16px;accent-color:var(--brass);cursor:pointer;}
.booknav{display:flex;align-items:center;gap:6px;border-bottom:1px solid var(--line-soft);margin-bottom:22px;padding-bottom:0;flex-wrap:wrap;}
.btab{font-size:13.5px;color:var(--muted);padding:9px 4px;margin-right:14px;border-bottom:2px solid transparent;transition:all .18s;display:inline-flex;align-items:center;gap:7px;}
.btab:hover{color:var(--on-dark);}
.btab.on{color:var(--brass-bright);border-bottom-color:var(--brass);}
.badge{display:inline-grid;place-items:center;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:var(--oxblood-soft);color:#fbe9ec;font-size:11px;font-family:var(--mono);}
.mschap{font-family:var(--serif);font-size:20px;color:#241c14;font-weight:600;margin-bottom:18px;padding-bottom:10px;border-bottom:1px solid rgba(124,103,60,.25);}
.mschdot{margin:0 9px;color:#a08a5c;}
.msbreak{text-align:center;color:#a08a5c;letter-spacing:.4em;margin:22px 0;font-size:13px;}
.conflict{display:flex;gap:12px;align-items:flex-start;background:rgba(162,66,87,.1);border:1px solid rgba(162,66,87,.35);border-radius:11px;padding:14px 16px;margin-bottom:12px;}
.cstmt{font-size:14px;color:var(--on-dark);line-height:1.4;}
.cagainst{font-size:12.5px;color:var(--oxblood-bright);margin-top:4px;}
.cnote{font-size:12px;color:var(--muted);margin-top:4px;font-family:var(--mono);letter-spacing:.04em;}
.factcard{background:var(--ink-800);border:1px solid var(--line);border-radius:12px;padding:14px 18px;margin-bottom:12px;}
.factent{font-family:var(--serif);font-size:16px;color:var(--brass-bright);font-weight:600;margin-bottom:8px;text-transform:capitalize;}
.factrow{display:flex;align-items:center;gap:10px;padding:5px 0;}
.factstmt{flex:1;font-size:13.5px;color:var(--on-dark);line-height:1.4;}
.factch{font-family:var(--mono);font-size:10px;color:var(--muted-2);letter-spacing:.08em;text-transform:uppercase;flex:0 0 auto;}
.factx{width:22px;height:22px;border-radius:6px;display:grid;place-items:center;color:var(--muted-2);transition:all .18s;flex:0 0 auto;}
.factx:hover{color:var(--oxblood-bright);background:rgba(162,66,87,.12);}

/* scene / manuscript */
.manuscript{background:linear-gradient(180deg,#F6F1E6,#EDE6D6);color:#221c14;border:1px solid var(--paper-edge);
  border-radius:14px;padding:46px 52px;box-shadow:0 18px 50px -22px rgba(0,0,0,.65);}
.mstext{font-family:var(--serif);font-size:17px;line-height:1.78;color:#2a2418;white-space:pre-wrap;}
.mstext::first-letter{}
.scenehead{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:18px;gap:16px;}

/* loader / error */
.loader{display:inline-flex;align-items:center;gap:11px;color:var(--brass-bright);font-size:14px;}
.dotpulse{width:9px;height:9px;border-radius:50%;background:var(--brass);}
@media (prefers-reduced-motion: no-preference){
  .dotpulse{animation:pulse 1.1s ease-in-out infinite;}
  .spin{animation:spin 1s linear infinite;}
}
@keyframes pulse{0%,100%{opacity:.3;transform:scale(.85);}50%{opacity:1;transform:scale(1.1);}}
@keyframes spin{to{transform:rotate(360deg);}}
.errnote{display:flex;gap:10px;align-items:flex-start;background:rgba(162,66,87,.1);border:1px solid rgba(162,66,87,.35);
  border-radius:10px;padding:13px 15px;color:#e9b8c2;font-size:13px;margin:14px 0;}
.busy{display:flex;flex-direction:column;align-items:center;gap:16px;padding:60px 20px;text-align:center;}
.busy .big{font-family:var(--serif);font-size:19px;color:var(--on-dark);}
.subtle{color:var(--muted-2);font-size:12.5px;}
.center-empty{text-align:center;padding:50px 20px;color:var(--muted);}
.overlay{position:fixed;inset:0;background:rgba(10,9,15,.72);display:flex;align-items:center;justify-content:center;padding:24px;z-index:50;}
.sheet{width:100%;max-width:600px;max-height:84vh;display:flex;flex-direction:column;background:var(--ink-800);border:1px solid var(--line);border-radius:16px;padding:22px;box-shadow:0 30px 80px -20px rgba(0,0,0,.7);}
.sheethead{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;}
.sheettitle{font-family:var(--serif);font-size:19px;color:#F4EFE4;font-weight:600;}
.iconbtn{width:30px;height:30px;border-radius:8px;display:grid;place-items:center;color:var(--muted);border:1px solid var(--line);transition:all .18s;}
.iconbtn:hover{color:var(--on-dark);border-color:var(--muted-2);}
.sheetnote{font-size:13px;color:var(--muted);line-height:1.5;margin:6px 0 14px;}
.sheettext{width:100%;flex:1;min-height:200px;resize:none;background:var(--ink-900);border:1px solid var(--line);border-radius:10px;
  color:var(--on-dark);font-family:var(--mono);font-size:12px;line-height:1.5;padding:14px;outline:none;}
.sheettext:focus{border-color:var(--brass);}
.sheetactions{display:flex;gap:10px;margin-top:14px;}

.section-foot{display:flex;justify-content:space-between;align-items:center;margin-top:26px;gap:12px;flex-wrap:wrap;}
.addbtn{display:inline-flex;align-items:center;gap:7px;font-size:13px;color:var(--muted);border:1px dashed var(--line);
  border-radius:10px;padding:11px 16px;transition:all .2s;}
.addbtn:hover{color:var(--brass-bright);border-color:var(--brass);border-style:solid;}
.addbtn:disabled{opacity:.4;cursor:default;color:var(--muted-2);border-color:var(--line);border-style:dashed;}
.cta:disabled{opacity:.5;cursor:default;transform:none;box-shadow:none;}
@media (max-width:640px){
  .wrap{padding:28px 18px 80px;} .h1{font-size:27px;} .psy{grid-template-columns:1fr;}
  .manuscript{padding:30px 24px;} .arc{flex-direction:column;}
  .arcstep:first-child{border-radius:10px 10px 0 0;} .arcstep:last-child{border-radius:0 0 10px 10px;}
}
`;

const STAGES = [
  { id: "intake", label: "Spark", icon: Sparkles },
  { id: "foundation", label: "Found", icon: Feather },
  { id: "cast", label: "Cast", icon: Users },
  { id: "outline", label: "Spine", icon: ListTree },
  { id: "scene", label: "Scene", icon: BookOpen },
  { id: "book", label: "Book", icon: Library },
];

const SPARKS = [
  "A grief counsellor starts receiving letters from her own future self — and they're warnings.",
  "On a generation ship, the only person who remembers Earth is the ship's accused murderer.",
  "Two rival lighthouse keepers on the same rock must share one working bulb through a season of wrecks.",
  "A small-town baker discovers her recipes are quietly rewriting the memories of everyone who eats them.",
];

const GENRES = ["", "Literary", "Fantasy", "Science fiction", "Mystery / thriller", "Romance", "Horror", "Historical", "Speculative", "Young adult"];
const TONES = ["", "Dark & literary", "Warm & hopeful", "Tense & propulsive", "Wry & comic", "Melancholic", "Epic & mythic", "Intimate & quiet", "Gothic"];
const POVS = ["", "First person", "Close third", "Omniscient third", "Second person", "Multiple POV"];
const STRUCTS = ["Three-act", "Save the Cat beat sheet", "Hero's journey", "Five-act", "Kishōtenketsu"];

/* ---------- Claude API (via your Netlify function proxy) ---------- */
async function callClaude(prompt, maxTokens = 3000, timeoutMs = 120000) {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: ctrl.signal,
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: maxTokens,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) {
      let detail = "";
      try { const j = await res.json(); detail = (j && (j.error?.message || j.error)) || ""; } catch (e) {}
      throw new Error("Claude request failed (" + res.status + ")" + (detail ? ": " + detail : "") + ".");
    }
    const data = await res.json();
    return (data.content || []).map((b) => (b.type === "text" ? b.text : "")).join("").trim();
  } catch (e) {
    if (e.name === "AbortError") throw new Error("stalled — no response in " + Math.round(timeoutMs / 1000) + "s");
    throw e;
  } finally {
    clearTimeout(to);
  }
}
function repairJSON(s) {
  // Walk the string, tracking open brackets / string state, then close anything
  // left dangling from a truncated response.
  let inStr = false, esc = false;
  const stack = [];
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === "{") stack.push("}");
    else if (ch === "[") stack.push("]");
    else if (ch === "}" || ch === "]") stack.pop();
  }
  let out = s;
  if (inStr) out += '"';               // close an open string
  out = out.trim().replace(/,\s*$/, ""); // drop trailing comma
  // drop a dangling "key": with no value
  if (/:\s*$/.test(out)) out = out.replace(/,?\s*"[^"]*"\s*:\s*$/, "").trim().replace(/,\s*$/, "");
  while (stack.length) out += stack.pop(); // close open brackets
  return out;
}

function parseJSON(text) {
  let t = text.trim().replace(/^```(?:json)?/i, "").replace(/```\s*$/i, "").trim();
  const starts = ["{", "["].map((c) => t.indexOf(c)).filter((i) => i >= 0);
  if (starts.length) t = t.slice(Math.min(...starts));
  try { return JSON.parse(t); } catch (e) {}
  try {
    const end = Math.max(t.lastIndexOf("}"), t.lastIndexOf("]"));
    if (end > 0) return JSON.parse(t.slice(0, end + 1));
  } catch (e) {}
  try { return JSON.parse(repairJSON(t)); } catch (e) {}
  throw new Error("The response came back incomplete — tap Regenerate to try again.");
}
const uid = () => Math.random().toString(36).slice(2, 9);
const charReady = (c) => (c.status ? c.status === "ready" : !!c.want);
const normalizeOutline = (o) => {
  o?.acts?.forEach((a) => a.chapters?.forEach((ch) => {
    if (!ch.id) ch.id = uid();
    if (ch.beats?.length) {
      ch.beats.forEach((b) => { if (!b.id) b.id = uid(); });
      if (!ch.beatStatus) ch.beatStatus = "ready";
    }
  }));
  return o;
};
const flatChapters = (o) => {
  const list = [];
  o?.acts?.forEach((a) => a.chapters?.forEach((ch) => list.push({ ch, actName: a.name })));
  return list;
};
const escapeHtml = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ---------- editable text ---------- */
function Editable({ value, onChange, className, multiline, placeholder }) {
  const ref = useRef(null);
  return (
    <span
      ref={ref}
      className={"edit " + (className || "")}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onBlur={(e) => onChange(e.currentTarget.textContent)}
      style={multiline ? { display: "block" } : {}}
      data-ph={placeholder}
    >
      {value}
    </span>
  );
}

/* ---------- prompts ---------- */
const pFoundation = (k) => `You are a seasoned developmental editor and story architect. A writer has handed you a raw idea. Expand it into a rich, specific story foundation that gives them something exciting to react to.

WRITER'S IDEA:
"""${k.idea}"""

PREFERENCES (may be blank — infer tastefully if so):
- Genre: ${k.genre || "(open)"}
- Tone: ${k.tone || "(open)"}
- POV: ${k.pov || "(open)"}
- Intended length: ${k.length || "(open)"}
${k.seeds.length ? "- Character seeds the writer already has: " + k.seeds.join("; ") : "- The writer has no characters yet."}

Return ONLY a JSON object — no markdown, no commentary — with exactly this shape:
{
 "titleSuggestions": ["three evocative title ideas"],
 "logline": "one vivid sentence: protagonist + goal + obstacle + stakes",
 "genre": "...", "tone": "...", "pov": "...",
 "setting": "place, time period, and the mood of the world in 1-2 sentences",
 "premise": "a rich paragraph: the situation, the inciting trouble, and the engine that keeps the story moving",
 "dramaticQuestion": "the yes/no question the whole book answers",
 "conflict": "the central conflict in 1-2 sentences — the external clash and the internal pressure beneath it",
 "theme": "the argument the story makes about being human — phrased as a claim, not a topic",
 "stakes": "what is lost if the protagonist fails — personally, and beyond them",
 "comps": ["two or three 'in the vein of' touchstones for vibe"]
}
Be specific, surprising, and free of cliché.`;

const pCastList = (f, seeds, count) => `You are casting a novel. Given this foundation, propose the core cast that will generate the most dramatic friction.

FOUNDATION:
${JSON.stringify(f)}

${seeds.length ? "Honour and incorporate these seeds the writer already has — flesh them out, don't replace them:\n" + seeds.join("\n") : "The writer has no characters yet — invent the cast this premise demands."}

Propose ${count} characters. Include a protagonist, a true antagonist or opposing force, and the key relationships around them. Each character must want something that collides with someone else's want.

Return ONLY a JSON array — no markdown:
[{ "name":"...", "role":"protagonist|antagonist|ally|love interest|foil|mentor|rival|...", "oneLine":"who they are and the trouble they bring, in one sentence", "seedNote":"what to remember when developing them deeply" }]`;

const pCharacter = (f, stub, existing) => `You are a novelist who builds characters from the inside out. Develop this character into a contradictory, living person grounded in the story.

STORY FOUNDATION:
${JSON.stringify(f)}

CHARACTER:
name: ${stub.name}
role: ${stub.role}
notes: ${stub.oneLine} ${stub.seedNote || ""}
${existing ? "Deepen and sharpen this existing material rather than discarding it:\n" + JSON.stringify(existing) : ""}

Use real craft. The WANT is the conscious external goal. The NEED is the internal truth they must learn to become whole. The LIE is the false belief they currently live by. The WOUND is the formative past event that planted the lie (the ghost). The FLAW is how the lie shows up as behaviour. The arc moves them from the lie toward the need.

Return ONLY a JSON object — no markdown:
{
 "name":"...", "role":"...", "archetype":"a fresh archetype, not a cliché", "age":"...",
 "oneLine":"who they are and the trouble they bring, in one sentence",
 "physical":"appearance plus ONE signature physical detail that reveals character",
 "mannerism":"a specific recurring gesture or habit",
 "voice":{"description":"how they speak — diction, rhythm, what they avoid saying","sampleLine":"one line of dialogue only they would say"},
 "want":"external goal", "need":"internal truth", "theLie":"the false belief they live by", "theWound":"the formative backstory event",
 "flaw":"fatal flaw", "virtue":"redeeming strength",
 "arc":{"start":"who they are at the open","turn":"the moment or cost that forces change","end":"who they become — or fail to"},
 "relationships":[{"to":"another character or force","dynamic":"the charged dynamic in a phrase"}],
 "secret":"something they hide that could detonate the plot"
}
Specific, surprising, internally consistent. No therapy-speak.`;

const pOutline = (f, cast, structure, chapters) => `You are a story architect. Build the chapter-level skeleton — NO scene beats yet — that will deliver the arcs below.

FOUNDATION:
${JSON.stringify(f)}

CAST (with arcs):
${JSON.stringify(cast.map((c) => ({ name: c.name, role: c.role, want: c.want, need: c.need, arc: c.arc })))}

Use the "${structure}" structure. Aim for roughly ${chapters} chapters across the acts. Each chapter summary should name the concrete turn that chapter delivers — what changes by the end of it — not a vague topic.

Return ONLY JSON — no markdown:
{
 "structure":"${structure}",
 "acts":[{ "name":"Act I — ...", "summary":"one line on the act's movement",
   "chapters":[{ "number":1, "title":"...", "summary":"one or two sentences: what happens and the turn it delivers" }]
 }]
}`;

const pChapterBeats = (f, cast, structure, chapter, actName, prev, next) => `You are a story architect breaking a single chapter into scene beats.

FOUNDATION:
${JSON.stringify(f)}

CAST (with arcs):
${JSON.stringify(cast.map((c) => ({ name: c.name, role: c.role, want: c.want, need: c.need, flaw: c.flaw, arc: c.arc })))}

STRUCTURE: ${structure}

THE CHAPTER TO BREAK DOWN (in ${actName}):
Chapter ${chapter.number}: ${chapter.title} — ${chapter.summary}

CONTINUITY CONTEXT:
${prev ? `Just before — Ch ${prev.number}: ${prev.title} — ${prev.summary}` : "This is the opening; establish the world and the protagonist's normal before it breaks."}
${next ? `Coming next — Ch ${next.number}: ${next.title} — ${next.summary}` : "This is the final chapter; it must resolve the dramatic question."}

Break THIS chapter into 2–4 scene beats. Every beat must do double work — advance the plot AND turn a character. Concrete and consequence-focused (e.g. "Mara finds the letter and chooses to burn it", not "Mara feels conflicted"). The beats must flow out of the previous chapter and set up the next.

Return ONLY a JSON array — no markdown:
[{ "beat":"what happens, consequence-focused", "pov":"whose POV", "purpose":"what it accomplishes for the story", "conflict":"the friction", "outcome":"what concretely changes" }]`;

const pScene = (f, cast, beat, ctx = {}) => `You are writing a scene of a novel. Write it as finished, publishable prose in the story's own voice.

VOICE & WORLD:
genre: ${f.genre}; tone: ${f.tone}; pov: ${f.pov}
setting: ${f.setting}
theme (let it breathe underneath — never state it): ${f.theme}

CHARACTERS (honour each distinct voice):
${cast.map((c) => `- ${c.name} (${c.role}): speaks ${c.voice?.description || ""}. e.g. ${c.voice?.sampleLine || ""}. wants ${c.want}; needs ${c.need}; flaw: ${c.flaw}`).join("\n")}
${ctx.canon ? `\nESTABLISHED FACTS — these are already true; do not contradict them:\n${ctx.canon}` : ""}
${ctx.prevTail ? `\nThe previous scene ended like this — continue naturally from it, don't repeat it:\n"""${ctx.prevTail}"""` : "\nThis is the opening scene of the book."}

THE BEAT TO DRAMATIZE:
${beat.beat}
POV: ${beat.pov} · purpose: ${beat.purpose} · conflict: ${beat.conflict} · intended turn: ${beat.outcome}

Write 700–900 words. Show, don't tell. Let the conflict surface through action and dialogue, not narration. Flow on from the previous scene without recapping it. End on the beat's turn. Output ONLY the prose — no title, no notes, no headings.`;

const pExtract = (existing, chapterNumber, prose) => `You are the continuity editor for a novel. Read this chapter's prose and extract the concrete, story-critical FACTS it establishes — physical descriptions, relationships, who knows what, world rules, locations, objects, and timeline events. Then check each against the facts already on record and flag any contradictions.

FACTS ALREADY ON RECORD:
${existing.length ? existing.map((x) => `- (${x.entity}) ${x.statement}`).join("\n") : "(none yet)"}

CHAPTER ${chapterNumber} PROSE:
"""${prose.slice(0, 6000)}"""

Return ONLY JSON — no markdown:
{
 "facts":[{ "entity":"the character / place / thing this is about", "statement":"the established fact in a short clause", "type":"character|world|relationship|event|object" }],
 "conflicts":[{ "statement":"the new detail", "against":"the recorded fact it contradicts", "note":"what to reconcile" }]
}
Only record facts a later chapter must respect. Skip mood and prose flourishes. If nothing conflicts, return an empty conflicts array.`;

const pVoice = (sample, prose) => `You are a prose stylist. Rewrite the SCENE below so it reads as though written by the author of the STYLE SAMPLE — matching their sentence rhythm, vocabulary, paragraph length, punctuation habits, and how they handle dialogue and description. Keep every plot event, line of dialogue, and beat exactly the same. Change only the voice. Do not summarize or shorten.

STYLE SAMPLE:
"""${sample.slice(0, 4000)}"""

SCENE TO REWRITE:
"""${prose}"""

Output ONLY the rewritten scene prose — no notes, no headings.`;

/* ---------- main ---------- */
const blank = () => ({
  id: uid(), title: "", createdAt: Date.now(),
  intake: { idea: "", seeds: [], genre: "", tone: "", pov: "", length: "", structure: "Three-act", castCount: 5, voiceSample: "", autoVoice: false },
  foundation: null, cast: [], outline: null, canon: { facts: [], conflicts: [] },
  view: "intake", scene: null,
});

export default function Marrow() {
  const [p, setP] = useState(blank());
  const [loading, setLoading] = useState(null); // {label}
  const [error, setError] = useState(null);
  const [showSeeds, setShowSeeds] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [bookTab, setBookTab] = useState("manuscript");
  const [open, setOpen] = useState({}); // char id -> bool
  const [progress, setProgress] = useState(null); // {done,total}
  const [saved, setSaved] = useState("");
  const [copied, setCopied] = useState(false);
  const [modal, setModal] = useState(null);          // export panel: { title, filename, content, mime, note }
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [modalCopied, setModalCopied] = useState(false);
  const loadedRef = useRef(false);
  const scrollRef = useRef(null);
  const [now, setNow] = useState(Date.now());
  const [activeStart, setActiveStart] = useState(null); // when the current character began
  const [gen, setGen] = useState(null); // { label, start, done, total, chapterId } for scenes/drafting/analysis

  useEffect(() => { scrollRef.current?.scrollTo({ top: 0 }); }, [p.view]);

  // tick once a second while anything is actively generating
  const someGenerating = p.cast.some((c) => c.status === "generating");
  const someChapterGenerating = !!p.outline?.acts?.some((a) => a.chapters?.some((ch) => ch.beatStatus === "generating"));
  const ticking = someGenerating || someChapterGenerating || !!gen;
  useEffect(() => {
    if (!ticking) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [ticking]);
  const elapsed = activeStart ? Math.max(0, Math.floor((now - activeStart) / 1000)) : 0;
  const genElapsed = gen ? Math.max(0, Math.floor((now - gen.start) / 1000)) : 0;

  /* load + autosave via browser localStorage */
  useEffect(() => {
    try {
      const v = localStorage.getItem("marrow_project");
      if (v) { const proj = JSON.parse(v); if (proj.outline) normalizeOutline(proj.outline); setP(proj); }
    } catch (e) {}
    loadedRef.current = true;   // only start autosaving after we've tried to load
  }, []);
  useEffect(() => {
    if (!loadedRef.current) return;
    setSaved("saving");
    const t = setTimeout(() => {
      try { localStorage.setItem("marrow_project", JSON.stringify(p)); setSaved("saved"); setTimeout(() => setSaved(""), 1600); }
      catch (e) { setSaved(""); }
    }, 700);
    return () => clearTimeout(t);
  }, [p]);

  const set = (patch) => setP((x) => ({ ...x, ...patch }));
  const setIntake = (patch) => setP((x) => ({ ...x, intake: { ...x.intake, ...patch } }));
  const go = (view) => set({ view });

  const writtenScenes = () => {
    let n = 0;
    p.outline?.acts?.forEach((a) => a.chapters?.forEach((ch) => ch.beats?.forEach((b) => { if (b.sceneText) n++; })));
    return n;
  };
  const stageDone = {
    intake: !!p.intake.idea.trim(),
    foundation: !!p.foundation,
    cast: p.cast.length > 0,
    outline: !!p.outline,
    scene: !!p.scene,
    book: writtenScenes() > 0,
  };
  const unlocked = (id) => {
    if (id === "intake") return true;
    if (id === "foundation") return stageDone.intake;
    if (id === "cast") return stageDone.foundation;
    if (id === "outline") return stageDone.cast;
    if (id === "scene") return stageDone.outline;
    if (id === "book") return stageDone.outline;
  };

  /* ----- generators ----- */
  async function genFoundation() {
    if (!p.intake.idea.trim()) return;
    setError(null); setLoading({ label: "Reading the idea, finding its shape…" });
    try {
      const txt = await callClaude(pFoundation({ ...p.intake, seeds: p.intake.seeds.filter(Boolean) }), 6000);
      const f = parseJSON(txt);
      set({ foundation: f, view: "foundation", title: p.title || (f.titleSuggestions?.[0] || "Untitled") });
    } catch (e) { setError(e.message || "Couldn't build the foundation. Try again."); }
    setLoading(null);
  }

  async function genCast() {
    setError(null);
    set({ view: "cast" });            // jump to the cast view first, so the click visibly does something
    setProgress(null);
    setLoading({ label: "Casting the story…" });
    try {
      const foundation = p.foundation;
      const seeds = p.intake.seeds.filter(Boolean);
      const listTxt = await callClaude(pCastList(foundation, seeds, p.intake.castCount), 2500, 90000);
      const stubs = parseJSON(listTxt).slice(0, p.intake.castCount);
      let cast = stubs.map((s) => ({ id: uid(), ...s, status: "queued" }));
      setP((x) => ({ ...x, cast }));
      setLoading(null);
      setProgress({ done: 0, total: cast.length });
      for (let i = 0; i < cast.length; i++) {
        const id = cast[i].id;
        setActiveStart(Date.now());
        cast = cast.map((c) => (c.id === id ? { ...c, status: "generating" } : c));
        setP((x) => ({ ...x, cast }));
        try {
          const full = parseJSON(await callClaude(pCharacter(foundation, cast[i]), 6000, 150000));
          cast = cast.map((c) => (c.id === id ? { id, ...full, status: "ready" } : c));
          setOpen((o) => ({ ...o, [id]: i === 0 }));
        } catch (e) {
          cast = cast.map((c) => (c.id === id ? { ...c, status: "failed" } : c));
        }
        setP((x) => ({ ...x, cast }));
        setProgress({ done: i + 1, total: cast.length });
      }
      setActiveStart(null);
      setProgress(null);
    } catch (e) { setError(e.message || "Couldn't cast the story. Tap the button to retry."); setLoading(null); setProgress(null); setActiveStart(null); }
  }

  async function deepen(charId) {
    const c = p.cast.find((x) => x.id === charId);
    setError(null); setActiveStart(Date.now());
    setP((x) => ({ ...x, cast: x.cast.map((y) => (y.id === charId ? { ...y, status: "generating" } : y)) }));
    try {
      const full = parseJSON(await callClaude(pCharacter(p.foundation, c, charReady(c) ? c : null), 6000, 150000));
      setP((x) => ({ ...x, cast: x.cast.map((y) => (y.id === charId ? { id: charId, ...full, status: "ready" } : y)) }));
      setOpen((o) => ({ ...o, [charId]: true }));
    } catch (e) {
      setP((x) => ({ ...x, cast: x.cast.map((y) => (y.id === charId ? { ...y, status: "failed" } : y)) }));
      setError(e.message);
    }
    setActiveStart(null);
  }

  async function addCharacter() {
    setError(null);
    const stub = { id: uid(), name: "New character", role: "supporting", oneLine: "A figure the story has been missing.", seedNote: "Invent someone who complicates the protagonist's path.", status: "generating" };
    setActiveStart(Date.now());
    setP((x) => ({ ...x, cast: [...x.cast, stub] }));
    setOpen((o) => ({ ...o, [stub.id]: true }));
    try {
      const full = parseJSON(await callClaude(pCharacter(p.foundation, stub), 6000, 150000));
      setP((x) => ({ ...x, cast: x.cast.map((y) => (y.id === stub.id ? { id: stub.id, ...full, status: "ready" } : y)) }));
    } catch (e) {
      setP((x) => ({ ...x, cast: x.cast.map((y) => (y.id === stub.id ? { ...y, status: "failed" } : y)) }));
      setError(e.message);
    }
    setActiveStart(null);
  }

  async function genOutline() {
    setError(null);
    set({ view: "outline" });          // jump to the outline view first
    setLoading({ label: "Mapping the spine of the story…" });
    try {
      const foundation = p.foundation, cast = p.cast;
      const target = p.intake.length?.includes("Short") ? 8 : p.intake.length?.includes("Epic") ? 18 : 12;
      const o = parseJSON(await callClaude(pOutline(foundation, cast, p.intake.structure, target), 4000));
      o.acts?.forEach((a) => a.chapters?.forEach((ch) => { ch.id = uid(); ch.beats = []; ch.beatStatus = "none"; }));
      set({ outline: o });
    } catch (e) { setError(e.message || "Couldn't map the outline. Tap Regenerate to retry."); }
    setLoading(null);
  }

  // immutably update one chapter by id
  const patchChapter = (chapterId, patch) =>
    setP((x) => {
      if (!x.outline) return x;
      const outline = { ...x.outline, acts: x.outline.acts.map((a) => ({ ...a, chapters: a.chapters.map((ch) => (ch.id === chapterId ? { ...ch, ...patch } : ch)) })) };
      return { ...x, outline };
    });

  async function genBeats(chapterId) {
    setError(null);
    const flat = flatChapters(p.outline);
    const idx = flat.findIndex((e) => e.ch.id === chapterId);
    if (idx < 0) return;
    const { ch, actName } = flat[idx];
    const prev = idx > 0 ? flat[idx - 1].ch : null;
    const next = idx < flat.length - 1 ? flat[idx + 1].ch : null;
    patchChapter(chapterId, { beatStatus: "generating", beatStart: Date.now() });
    try {
      const arr = parseJSON(await callClaude(pChapterBeats(p.foundation, p.cast, p.outline.structure, ch, actName, prev, next), 3500, 120000));
      const beats = (Array.isArray(arr) ? arr : []).map((b) => ({ id: uid(), ...b }));
      patchChapter(chapterId, { beats, beatStatus: "ready", beatStart: null });
    } catch (e) {
      patchChapter(chapterId, { beatStatus: "failed", beatStart: null });
      setError(e.message);
    }
  }

  async function genAllBeats() {
    const ids = flatChapters(p.outline).filter((e) => e.ch.beatStatus !== "ready").map((e) => e.ch.id);
    for (const id of ids) { await genBeats(id); }
  }

  // ----- continuity helpers -----
  const orderedBeats = () => {
    const list = [];
    p.outline?.acts?.forEach((a) => a.chapters?.forEach((ch) => ch.beats?.forEach((b) => list.push(b))));
    return list;
  };
  const prevTailFor = (beatId) => {
    const list = orderedBeats();
    const i = list.findIndex((b) => b.id === beatId);
    for (let j = i - 1; j >= 0; j--) { if (list[j].sceneText) return list[j].sceneText.slice(-700); }
    return "";
  };
  const canonText = () => {
    const facts = p.canon?.facts || [];
    if (!facts.length) return "";
    return facts.slice(0, 50).map((x) => `- (${x.entity}) ${x.statement}`).join("\n");
  };
  // write the scene text for a beat, optionally voice-matched; returns the text
  async function produceScene(beat, prevTailOverride) {
    const prevTail = prevTailOverride !== undefined ? prevTailOverride : prevTailFor(beat.id);
    let text = await callClaude(pScene(p.foundation, p.cast, beat, { prevTail, canon: canonText() }), 6000);
    if (p.intake.voiceSample?.trim() && p.intake.autoVoice) {
      try { text = await callClaude(pVoice(p.intake.voiceSample, text), 6000); } catch (e) {}
    }
    return text;
  }
  const storeScene = (beatId, text) =>
    setP((x) => {
      const outline = JSON.parse(JSON.stringify(x.outline));
      outline.acts.forEach((a) => a.chapters.forEach((ch) => ch.beats?.forEach((b) => { if (b.id === beatId) b.sceneText = text; })));
      const scene = x.scene && x.scene.beat.id === beatId ? { ...x.scene, text } : x.scene;
      return { ...x, outline, scene };
    });

  async function writeScene(beat) {
    setError(null); set({ view: "scene", scene: { beat, text: beat.sceneText || "" } });
    setGen({ label: "Writing the scene", start: Date.now() });
    try {
      const text = await produceScene(beat);
      storeScene(beat.id, text);
      set({ scene: { beat, text } });
    } catch (e) { setError(e.message || "Couldn't write the scene. Try again."); }
    setGen(null);
  }

  async function matchVoice() {
    if (!p.scene || !p.intake.voiceSample?.trim()) return;
    setError(null); setGen({ label: "Matching your voice", start: Date.now() });
    try {
      const text = await callClaude(pVoice(p.intake.voiceSample, p.scene.text), 6000);
      storeScene(p.scene.beat.id, text);
      set({ scene: { ...p.scene, text } });
    } catch (e) { setError(e.message || "Couldn't match the voice. Try again."); }
    setGen(null);
  }

  async function extractCanon(chapterId, proseOverride) {
    const flat = flatChapters(p.outline);
    const entry = flat.find((e) => e.ch.id === chapterId);
    if (!entry) return;
    const ch = entry.ch;
    const prose = proseOverride || (ch.beats || []).map((b) => b.sceneText).filter(Boolean).join("\n\n");
    if (!prose.trim()) return;
    try {
      const r = parseJSON(await callClaude(pExtract(p.canon?.facts || [], ch.number, prose), 3500, 120000));
      const newFacts = (r.facts || []).map((x) => ({ id: uid(), chapter: ch.number, ...x }));
      const newConf = (r.conflicts || []).map((x) => ({ id: uid(), chapter: ch.number, ...x }));
      setP((x) => ({ ...x, canon: { facts: [...(x.canon?.facts || []), ...newFacts], conflicts: [...(x.canon?.conflicts || []), ...newConf] } }));
    } catch (e) {}
  }

  async function draftChapter(chapterId) {
    setError(null);
    const flat = flatChapters(p.outline);
    const entry = flat.find((e) => e.ch.id === chapterId);
    if (!entry || !entry.ch.beats?.length) { setError("Break this chapter into beats first."); return; }
    const beats = entry.ch.beats;
    setGen({ label: "Drafting the chapter", start: Date.now(), done: 0, total: beats.length, chapterId });
    try {
      let tail = prevTailFor(beats[0].id);   // tail of the last written scene before this chapter
      const texts = [];
      for (let i = 0; i < beats.length; i++) {
        const text = await produceScene(beats[i], tail);
        storeScene(beats[i].id, text);
        texts.push(text);
        tail = text.slice(-700);             // next scene continues from this one
        setGen((g) => g ? { ...g, done: i + 1 } : g);
      }
      setGen({ label: "Scanning for continuity", start: Date.now(), chapterId });
      await extractCanon(chapterId, texts.join("\n\n"));
    } catch (e) { setError(e.message || "Couldn't finish drafting the chapter."); }
    setGen(null);
  }

  async function scanAllContinuity() {
    setError(null);
    setP((x) => ({ ...x, canon: { facts: [], conflicts: [] } }));
    const chs = flatChapters(p.outline).filter((e) => (e.ch.beats || []).some((b) => b.sceneText));
    for (let i = 0; i < chs.length; i++) {
      setGen({ label: "Re-scanning continuity", start: Date.now(), done: i, total: chs.length });
      await extractCanon(chs[i].ch.id);
    }
    setGen(null);
  }

  /* ----- field editors ----- */
  const editFound = (key, val) => setP((x) => ({ ...x, foundation: { ...x.foundation, [key]: val } }));
  const editChar = (id, key, val) => setP((x) => ({ ...x, cast: x.cast.map((c) => (c.id === id ? { ...c, [key]: val } : c)) }));
  const editCharNested = (id, key, sub, val) =>
    setP((x) => ({ ...x, cast: x.cast.map((c) => (c.id === id ? { ...c, [key]: { ...c[key], [sub]: val } } : c)) }));
  const removeChar = (id) => setP((x) => ({ ...x, cast: x.cast.filter((c) => c.id !== id) }));
  const editAct = (ai, key, val) => setP((x) => { const o = JSON.parse(JSON.stringify(x.outline)); o.acts[ai][key] = val; return { ...x, outline: o }; });
  const editBeat = (beatId, key, val) => setP((x) => { const o = JSON.parse(JSON.stringify(x.outline)); o.acts.forEach((a) => a.chapters.forEach((ch) => ch.beats?.forEach((b) => { if (b.id === beatId) b[key] = val; }))); return { ...x, outline: o }; });
  const removeFact = (id) => setP((x) => ({ ...x, canon: { ...x.canon, facts: x.canon.facts.filter((f) => f.id !== id) } }));
  const dismissConflict = (id) => setP((x) => ({ ...x, canon: { ...x.canon, conflicts: x.canon.conflicts.filter((c) => c.id !== id) } }));

  /* ----- export / import ----- */
  const slug = (s) => (s || "marrow").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").toLowerCase();

  function buildBible() {
    const f = p.foundation; let md = `# ${p.title || "Untitled"}\n\n`;
    if (f) {
      md += `**Logline.** ${f.logline}\n\n`;
      md += `- **Genre:** ${f.genre} · **Tone:** ${f.tone} · **POV:** ${f.pov}\n`;
      md += `- **Setting:** ${f.setting}\n- **Dramatic question:** ${f.dramaticQuestion}\n\n`;
      md += `**Premise.** ${f.premise}\n\n**Conflict.** ${f.conflict}\n\n**Theme.** ${f.theme}\n\n**Stakes.** ${f.stakes}\n\n`;
    }
    if (p.cast.length) {
      md += `\n## Cast\n\n`;
      p.cast.forEach((c) => {
        md += `### ${c.name} — *${c.role}*\n${c.oneLine || ""}\n\n`;
        md += `- **Want:** ${c.want}\n- **Need:** ${c.need}\n- **The lie:** ${c.theLie}\n- **The wound:** ${c.theWound}\n- **Flaw:** ${c.flaw} · **Virtue:** ${c.virtue}\n`;
        if (c.voice) md += `- **Voice:** ${c.voice.description} — *"${c.voice.sampleLine}"*\n`;
        if (c.arc) md += `- **Arc:** ${c.arc.start} → ${c.arc.turn} → ${c.arc.end}\n`;
        if (c.secret) md += `- **Secret:** ${c.secret}\n`;
        md += `\n`;
      });
    }
    if (p.outline) {
      md += `\n## Outline (${p.outline.structure})\n\n`;
      p.outline.acts?.forEach((a) => {
        md += `### ${a.name}\n${a.summary || ""}\n\n`;
        a.chapters?.forEach((ch) => {
          md += `**Ch. ${ch.number}. ${ch.title}** — ${ch.summary || ""}\n`;
          ch.beats?.forEach((b) => { md += `  - ${b.beat} _(${b.pov})_\n`; if (b.sceneText) md += `\n${b.sceneText}\n\n`; });
          md += `\n`;
        });
      });
    }
    return md;
  }

  function buildManuscript() {
    let md = `# ${p.title || "Untitled"}\n\n`;
    p.outline?.acts?.forEach((a) => {
      a.chapters?.forEach((ch) => {
        const scenes = (ch.beats || []).map((b) => b.sceneText).filter(Boolean);
        if (!scenes.length) return;
        md += `\n## Chapter ${ch.number}. ${ch.title}\n\n`;
        md += scenes.join("\n\n* * *\n\n") + "\n";
      });
    });
    return md;
  }
  function buildManuscriptDoc() {
    // HTML that Word opens as a document
    let body = `<h1>${escapeHtml(p.title || "Untitled")}</h1>`;
    p.outline?.acts?.forEach((a) => a.chapters?.forEach((ch) => {
      const scenes = (ch.beats || []).map((b) => b.sceneText).filter(Boolean);
      if (!scenes.length) return;
      body += `<h2>Chapter ${ch.number}. ${escapeHtml(ch.title)}</h2>`;
      scenes.forEach((s, i) => {
        if (i) body += `<p style="text-align:center">* * *</p>`;
        s.split(/\n\n+/).forEach((para) => { body += `<p>${escapeHtml(para).replace(/\n/g, "<br/>")}</p>`; });
      });
    }));
    return `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'><head><meta charset='utf-8'><style>body{font-family:Georgia,serif;font-size:12pt;line-height:1.5} h1{font-size:22pt} h2{font-size:15pt;page-break-before:always}</style></head><body>${body}</body></html>`;
  }

  function tryDownload(filename, content, mime) {
    try {
      const url = URL.createObjectURL(new Blob([content], { type: mime }));
      const a = document.createElement("a");
      a.href = url; a.download = filename; a.style.display = "none";
      document.body.appendChild(a); a.click();
      setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 1500);
    } catch (e) {}
  }

  const openSave = () => {
    const content = JSON.stringify(p, null, 2);
    try { navigator.clipboard?.writeText(content); } catch (e) {}   // one-click backup: already on your clipboard
    setModal({
      title: "Save your story", filename: slug(p.title || "marrow-project") + ".json", mime: "application/json",
      content, copiedAlready: true,
      note: "Copied to your clipboard — paste it somewhere safe. To restore later, even in a future version of Marrow, choose Open and paste it back. This is the reliable way to keep your work across updates.",
    });
  };
  const openBible = () => setModal({
    title: "Story bible", filename: slug(p.title || "story-bible") + ".md", mime: "text/markdown",
    content: buildBible(), note: "Your full story bible in Markdown — foundation, cast, outline, and any scenes you've written.",
  });
  const openManuscript = () => setModal({
    title: "Export manuscript", filename: slug(p.title || "manuscript") + ".doc", mime: "application/msword",
    content: buildManuscript(), downloadContent: buildManuscriptDoc(),
    note: "Your full manuscript. Copy the text, or use Try download for a .doc that opens in Word (downloads may be blocked inside this preview — copy always works).",
  });

  function loadProject() {
    try {
      const proj = JSON.parse(importText.trim());
      if (!proj || typeof proj !== "object" || !proj.intake) throw new Error("missing");
      if (proj.outline) normalizeOutline(proj.outline);
      loadedRef.current = true;
      setP(proj); setImportOpen(false); setImportText(""); setError(null); setOpen({});
    } catch (e) { setError("That doesn't look like saved Marrow data. Paste the full text you copied from Save."); }
  }

  function reset() { if (window.confirm("Start a new story? This clears the current one. (Use Save first if you want to keep it.)")) { setP(blank()); setOpen({}); setError(null); } }

  /* ---------------- render ---------------- */
  return (
    <div className="mrw">
      <style>{CSS}</style>

      {/* spine rail */}
      <div className="rail">
        <div className="mark">MARROW</div>
        <div className="spine">
          {STAGES.map((s, i) => {
            const Icon = s.icon;
            const u = unlocked(s.id);
            const cls = ["vbtn", stageDone[s.id] ? "done" : "", p.view === s.id ? "active" : "", !u ? "locked" : ""].join(" ");
            return (
              <div className="vert" key={s.id}>
                <button className={cls} disabled={!u} onClick={() => u && go(s.id)} title={s.label}>
                  <Icon size={16} />
                </button>
                <div className="vlabel">{s.label}</div>
                {i < STAGES.length - 1 && <div className={"vstem " + (stageDone[s.id] ? "lit" : "")} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* main */}
      <div className="main">
        <div className="topbar">
          <Feather size={17} color="var(--brass)" />
          <input className="ptitle" value={p.title} placeholder="Untitled story"
            onChange={(e) => set({ title: e.target.value })} />
          <span className="save">{saved === "saving" ? "saving…" : saved === "saved" ? "saved ✓" : ""}</span>
          <div className="tb-actions">
            <button className="ghost" onClick={openSave} title="Save your story as text you can keep"><Download size={14} /> Save</button>
            <button className="ghost" onClick={() => { setImportText(""); setImportOpen(true); }} title="Restore from saved text"><Upload size={14} /> Open</button>
            <button className="ghost" onClick={openBible} title="Export the story bible"><FileText size={14} /> Bible</button>
            <button className="ghost" onClick={reset} title="New story"><FilePlus2 size={14} /> New</button>
          </div>
        </div>

        <div className="scroll" ref={scrollRef}>
          <div className="wrap">
            {error && <div className="errnote"><AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} /><div>{error}</div></div>}

            {/* INTAKE */}
            {p.view === "intake" && (
              <>
                <div className="eyebrow"><Sparkles size={13} /> The spark</div>
                <h1 className="h1">What's the story?</h1>
                <p className="lede">Give me a sentence or a page — a premise, a fragment, a feeling. Characters if you have them, none if you don't. I'll forge a foundation you can shape.</p>

                <div className="compose">
                  <textarea value={p.intake.idea} placeholder="A lighthouse keeper who only writes letters she never sends…"
                    onChange={(e) => setIntake({ idea: e.target.value })} />
                </div>

                <div className="sparks">
                  {SPARKS.map((s, i) => <button key={i} className="spark" onClick={() => setIntake({ idea: s })}>{s.slice(0, 54)}…</button>)}
                </div>

                <div className="controls">
                  <div className="ctl"><label>Genre</label>
                    <select value={p.intake.genre} onChange={(e) => setIntake({ genre: e.target.value })}>{GENRES.map((g) => <option key={g} value={g}>{g || "Let the idea decide"}</option>)}</select></div>
                  <div className="ctl"><label>Tone</label>
                    <select value={p.intake.tone} onChange={(e) => setIntake({ tone: e.target.value })}>{TONES.map((g) => <option key={g} value={g}>{g || "Let the idea decide"}</option>)}</select></div>
                  <div className="ctl"><label>Point of view</label>
                    <select value={p.intake.pov} onChange={(e) => setIntake({ pov: e.target.value })}>{POVS.map((g) => <option key={g} value={g}>{g || "Let the idea decide"}</option>)}</select></div>
                  <div className="ctl"><label>Cast size</label>
                    <select value={p.intake.castCount} onChange={(e) => setIntake({ castCount: +e.target.value })}>{[3, 4, 5, 6, 7].map((n) => <option key={n} value={n}>{n} characters</option>)}</select></div>
                </div>

                <button className="seeds-toggle" onClick={() => setShowSeeds((s) => !s)}>
                  {showSeeds ? <ChevronDown size={15} /> : <ChevronRight size={15} />} I already have some characters
                </button>
                {showSeeds && (
                  <div style={{ marginBottom: 18 }}>
                    {[...p.intake.seeds, ""].map((sd, i) => (
                      <div className="seedrow" key={i}>
                        <input value={sd} placeholder={"Character " + (i + 1) + " — name and a line about them"}
                          onChange={(e) => { const seeds = [...p.intake.seeds]; seeds[i] = e.target.value; setIntake({ seeds: seeds.filter((_, idx) => idx <= i || seeds[idx]) }); }} />
                      </div>
                    ))}
                  </div>
                )}

                <button className="seeds-toggle" onClick={() => setShowVoice((s) => !s)}>
                  {showVoice ? <ChevronDown size={15} /> : <ChevronRight size={15} />} <Mic size={14} style={{ margin: "0 2px" }} /> Write in my voice (optional)
                </button>
                {showVoice && (
                  <div style={{ marginBottom: 18 }}>
                    <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "2px 0 10px" }}>Paste a few paragraphs of your own writing — or any style you want to emulate. Scenes can be rewritten to match its rhythm and vocabulary.</p>
                    <div className="compose" style={{ marginBottom: 10 }}>
                      <textarea style={{ minHeight: 110, fontSize: 15 }} value={p.intake.voiceSample}
                        placeholder="Paste a sample of the prose voice you want…"
                        onChange={(e) => setIntake({ voiceSample: e.target.value })} />
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={p.intake.autoVoice} onChange={(e) => setIntake({ autoVoice: e.target.checked })} />
                      <span>Apply my voice automatically as scenes are written</span>
                    </label>
                  </div>
                )}

                <div style={{ marginTop: 10 }}>
                  {loading ? <Busy label={loading.label} /> :
                    <button className="cta" disabled={!p.intake.idea.trim()} onClick={genFoundation}>
                      <Wand2 size={17} /> Forge the foundation
                    </button>}
                </div>
              </>
            )}

            {/* FOUNDATION */}
            {p.view === "foundation" && p.foundation && (
              <>
                <div className="eyebrow"><Feather size={13} /> The foundation</div>
                <h1 className="h1">{p.title}</h1>
                <p className="lede">Everything downstream grows from here. Click any line to edit it; nothing's locked.</p>

                <div className="paper">
                  <div className="meta">Logline</div>
                  <Editable className="logline" value={p.foundation.logline} onChange={(v) => editFound("logline", v)} multiline />
                  <div className="tagrow">
                    <span className="tag">{p.foundation.genre}</span>
                    <span className="tag">{p.foundation.tone}</span>
                    <span className="tag">{p.foundation.pov}</span>
                  </div>
                  <div className="divid" />
                  <div className="flabel">The world</div>
                  <Editable className="prose" value={p.foundation.setting} onChange={(v) => editFound("setting", v)} multiline />
                  <div className="flabel">Premise</div>
                  <Editable className="prose" value={p.foundation.premise} onChange={(v) => editFound("premise", v)} multiline />
                  <div className="divid" />
                  <div className="flabel">Dramatic question</div>
                  <Editable className="prose" value={p.foundation.dramaticQuestion} onChange={(v) => editFound("dramaticQuestion", v)} multiline />
                  <div className="flabel">Central conflict</div>
                  <Editable className="prose" value={p.foundation.conflict} onChange={(v) => editFound("conflict", v)} multiline />
                  <div className="flabel">Stakes</div>
                  <Editable className="prose" value={p.foundation.stakes} onChange={(v) => editFound("stakes", v)} multiline />
                  <div className="divid" />
                  <div className="flabel">Theme</div>
                  <div className="pull"><Editable value={p.foundation.theme} onChange={(v) => editFound("theme", v)} multiline /></div>
                  {p.foundation.comps?.length > 0 && <>
                    <div className="flabel">In the vein of</div>
                    <div className="prose" style={{ fontStyle: "italic" }}>{p.foundation.comps.join(" · ")}</div>
                  </>}
                </div>

                <div className="section-foot">
                  <button className="ghost" onClick={genFoundation}><RefreshCw size={14} /> Regenerate</button>
                  {p.cast.length === 0
                    ? <button className="cta sm" onClick={genCast}><Users size={16} /> Develop the cast <ArrowRight size={15} /></button>
                    : <button className="cta sm" onClick={() => go("cast")}>Go to the cast <ArrowRight size={15} /></button>}
                </div>
              </>
            )}

            {/* CAST */}
            {p.view === "cast" && (
              <>
                <div className="eyebrow"><Users size={13} /> The cast — built from the inside out</div>
                <h1 className="h1">Who lives here</h1>
                <p className="lede">Each character is built on want vs. need, the lie they believe, and the wound underneath it — the engine of a real arc. Expand any dossier to read and edit it.</p>

                {loading && p.cast.length === 0 && <Busy label={loading.label} />}

                {progress && <div className="loader" style={{ marginBottom: 18 }}>
                  <span className="dotpulse" />{progress.label || `Developing characters… ${progress.done}/${progress.total}`}
                </div>}

                {p.cast.length === 0 && !progress && !loading && (
                  <div className="center-empty">No cast yet. <button className="cta sm" style={{ marginLeft: 10 }} onClick={genCast}><Users size={15} /> Develop the cast</button></div>
                )}

                {p.cast.map((c, i) => (
                  <CharacterCard key={c.id} c={c} i={i} isOpen={!!open[c.id]} elapsed={elapsed}
                    toggle={() => setOpen((o) => ({ ...o, [c.id]: !o[c.id] }))}
                    onEdit={editChar} onEditNested={editCharNested}
                    onDeepen={() => deepen(c.id)} onRemove={() => removeChar(c.id)} />
                ))}

                {p.cast.length > 0 && (
                  <div className="section-foot">
                    <button className="addbtn" onClick={addCharacter} disabled={someGenerating || !!progress}><Plus size={15} /> Add a character</button>
                    <button className="cta sm" disabled={someGenerating || !!progress} onClick={p.outline ? () => go("outline") : genOutline}>
                      <ListTree size={16} /> {p.outline ? "Go to the outline" : "Map the outline"} <ArrowRight size={15} />
                    </button>
                  </div>
                )}
              </>
            )}

            {/* OUTLINE */}
            {p.view === "outline" && (
              <>
                <div className="eyebrow"><ListTree size={13} /> The spine</div>
                <h1 className="h1">How it unfolds</h1>
                <p className="lede">A chapter-level map of the whole book. Break any chapter into scene beats when you're ready, then turn any beat into prose — doing it chapter by chapter keeps each step sharp and accurate.</p>

                {loading && p.view === "outline" && !p.outline ? <Busy label={loading.label} /> : null}

                {p.outline && (
                  <>
                    {(() => {
                      const flat = flatChapters(p.outline);
                      const total = flat.length;
                      const done = flat.filter((e) => (e.ch.beatStatus || (e.ch.beats?.length ? "ready" : "none")) === "ready").length;
                      return (
                        <div style={{ marginBottom: 22, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                          <span className="tag">{p.outline.structure}</span>
                          {done < total
                            ? <button className="cta sm" disabled={someChapterGenerating} onClick={genAllBeats}><ListTree size={15} /> Break all chapters into beats · {done}/{total}</button>
                            : <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--mono)", letterSpacing: ".06em", textTransform: "uppercase" }}>all {total} chapters have beats</span>}
                        </div>
                      );
                    })()}

                    {p.outline.acts?.map((a, ai) => (
                      <div className="act" key={ai}>
                        <div className="actname"><Editable value={a.name} onChange={(v) => editAct(ai, "name", v)} /></div>
                        <div className="actsum"><Editable value={a.summary} onChange={(v) => editAct(ai, "summary", v)} /></div>
                        {a.chapters?.map((ch) => {
                          const st = ch.beatStatus || (ch.beats?.length ? "ready" : "none");
                          const chElapsed = ch.beatStart ? Math.max(0, Math.floor((now - ch.beatStart) / 1000)) : 0;
                          const drafting = gen && gen.chapterId === ch.id;
                          const written = (ch.beats || []).filter((b) => b.sceneText).length;
                          return (
                            <div className="chap" key={ch.id}>
                              <div className="chaphead">
                                <span className="chapno">CH {ch.number}</span>
                                <span className="chaptitle"><Editable value={ch.title} onChange={(v) => patchChapter(ch.id, { title: v })} /></span>
                                <span className="chapsum"><Editable value={ch.summary} onChange={(v) => patchChapter(ch.id, { summary: v })} /></span>
                              </div>
                              {st === "ready" && ch.beats?.map((b) => (
                                <div className="beat" key={b.id}>
                                  <span className="bdot" style={b.sceneText ? { background: "var(--teal)" } : {}} />
                                  <div className="btext">
                                    <div className="bmain"><Editable value={b.beat} onChange={(v) => editBeat(b.id, "beat", v)} /></div>
                                    <div className="bmeta">
                                      <span>POV <b>{b.pov}</b></span>
                                      {b.conflict && <span>FRICTION {b.conflict}</span>}
                                    </div>
                                  </div>
                                  <button className={"writebtn " + (b.sceneText ? "has" : "")} onClick={() => writeScene(b)}>
                                    <BookOpen size={13} /> {b.sceneText ? "Read scene" : "Write scene"}
                                  </button>
                                </div>
                              ))}
                              <div className="chapfoot" style={{ gap: 10 }}>
                                {st === "none" && <button className="beatbtn" onClick={() => genBeats(ch.id)}><ListTree size={13} /> Break into scene beats</button>}
                                {st === "generating" && <span className="loader" style={{ fontSize: 12 }}><span className="dotpulse" />breaking into beats · {chElapsed}s</span>}
                                {st === "failed" && <button className="beatbtn ox" onClick={() => genBeats(ch.id)}><RefreshCw size={13} /> Stalled — retry beats</button>}
                                {st === "ready" && !drafting && (
                                  <>
                                    <button className="beatbtn brass" onClick={() => draftChapter(ch.id)}><PenLine size={13} /> {written ? "Redraft chapter" : "Draft this chapter"}</button>
                                    {written === ch.beats.length && written > 0 && <span style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--teal)", letterSpacing: ".06em" }}>drafted</span>}
                                    <button className="beatbtn subtle" onClick={() => genBeats(ch.id)}><RefreshCw size={12} /> Regenerate beats</button>
                                  </>
                                )}
                                {drafting && <span className="loader" style={{ fontSize: 12 }}><span className="dotpulse" />{gen.label}{gen.total ? ` · scene ${Math.min(gen.done + 1, gen.total)}/${gen.total}` : ""} · {genElapsed}s</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                    <div className="section-foot">
                      <button className="ghost" onClick={() => { if (!p.outline.acts.some((a) => a.chapters.some((c) => c.beats?.length)) || window.confirm("Regenerate the chapter skeleton? This discards any beats you've already generated.")) genOutline(); }}><RefreshCw size={14} /> Regenerate skeleton</button>
                      {stageDone.book && <button className="cta sm" onClick={() => go("book")}><Library size={15} /> Read the manuscript <ArrowRight size={15} /></button>}
                    </div>
                  </>
                )}
              </>
            )}

            {/* SCENE */}
            {p.view === "scene" && p.scene && (
              <>
                <div className="scenehead">
                  <div>
                    <div className="eyebrow"><BookOpen size={13} /> A scene</div>
                    <h1 className="h1" style={{ fontSize: 24, maxWidth: 620 }}>{p.scene.beat.beat}</h1>
                  </div>
                </div>

                {gen ? <Busy label={`${gen.label} · ${genElapsed}s`} /> : (
                  <>
                    <div className="manuscript">
                      <div className="mstext">{p.scene.text}</div>
                    </div>
                    <div className="section-foot">
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button className="ghost" onClick={() => writeScene(p.scene.beat)}><RefreshCw size={14} /> Rewrite</button>
                        {p.intake.voiceSample?.trim() && <button className="ghost" onClick={matchVoice}><Mic size={14} /> Match my voice</button>}
                        <button className="ghost" onClick={() => { navigator.clipboard?.writeText(p.scene.text); setCopied(true); setTimeout(() => setCopied(false), 1400); }}>
                          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <button className="cta sm ox" onClick={() => go("outline")}><ListTree size={15} /> Back to the outline</button>
                    </div>
                  </>
                )}
              </>
            )}

            {/* BOOK */}
            {p.view === "book" && (
              <>
                <div className="eyebrow"><Library size={13} /> The book</div>
                <h1 className="h1">{p.title || "Your manuscript"}</h1>
                {(() => {
                  let words = 0;
                  p.outline?.acts?.forEach((a) => a.chapters?.forEach((ch) => ch.beats?.forEach((b) => { if (b.sceneText) words += b.sceneText.trim().split(/\s+/).length; })));
                  return <p className="lede">{words.toLocaleString()} words written · {writtenScenes()} scenes. Draft chapters from the outline; they flow on from each other and stay true to what's already been established.</p>;
                })()}

                <div className="booknav">
                  <button className={"btab " + (bookTab === "manuscript" ? "on" : "")} onClick={() => setBookTab("manuscript")}>Manuscript</button>
                  <button className={"btab " + (bookTab === "continuity" ? "on" : "")} onClick={() => setBookTab("continuity")}>
                    Continuity{p.canon?.conflicts?.length ? <span className="badge">{p.canon.conflicts.length}</span> : null}
                  </button>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                    <button className="ghost" onClick={openManuscript}><Download size={14} /> Export</button>
                    <button className="ghost" onClick={openBible}><FileText size={14} /> Bible</button>
                  </div>
                </div>

                {bookTab === "manuscript" && (
                  writtenScenes() === 0
                    ? <div className="center-empty">No scenes written yet.<br /><button className="cta sm" style={{ marginTop: 14 }} onClick={() => go("outline")}><ListTree size={15} /> Go to the outline and draft a chapter</button></div>
                    : <div className="manuscript">
                        {p.outline.acts.map((a) => a.chapters.map((ch) => {
                          const scenes = (ch.beats || []).filter((b) => b.sceneText);
                          if (!scenes.length) return null;
                          return (
                            <div key={ch.id} style={{ marginBottom: 30 }}>
                              <div className="mschap">Chapter {ch.number}<span className="mschdot">·</span>{ch.title}</div>
                              {scenes.map((b, i) => (
                                <React.Fragment key={b.id}>
                                  {i ? <div className="msbreak">* * *</div> : null}
                                  <div className="mstext">{b.sceneText}</div>
                                </React.Fragment>
                              ))}
                            </div>
                          );
                        }))}
                      </div>
                )}

                {bookTab === "continuity" && (
                  <div>
                    <p className="lede" style={{ marginBottom: 16 }}>Marrow reads each chapter as it's drafted and records what it establishes, then checks new chapters against it. This is what keeps a long book from contradicting itself.</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
                      <button className="cta sm" disabled={!!gen} onClick={scanAllContinuity}><ShieldCheck size={15} /> {p.canon?.facts?.length ? "Re-scan whole book" : "Scan the book for facts"}</button>
                      {gen && /continuity/i.test(gen.label) && <span className="loader" style={{ fontSize: 12 }}><span className="dotpulse" />{gen.label}{gen.total ? ` · ${gen.done}/${gen.total}` : ""} · {genElapsed}s</span>}
                    </div>

                    {p.canon?.conflicts?.map((c) => (
                      <div className="conflict" key={c.id}>
                        <AlertTriangle size={17} style={{ flexShrink: 0, color: "var(--oxblood-bright)", marginTop: 1 }} />
                        <div style={{ flex: 1 }}>
                          <div className="cstmt">{c.statement}</div>
                          <div className="cagainst">contradicts: {c.against}</div>
                          {c.note && <div className="cnote">{c.note}</div>}
                          <div className="cnote" style={{ opacity: .7 }}>chapter {c.chapter}</div>
                        </div>
                        <button className="mini" onClick={() => dismissConflict(c.id)}>Dismiss</button>
                      </div>
                    ))}

                    {(() => {
                      const facts = p.canon?.facts || [];
                      if (!facts.length) return <div className="center-empty">No facts recorded yet. Draft a chapter, or scan the book above.</div>;
                      const groups = {};
                      facts.forEach((f) => { (groups[f.entity] = groups[f.entity] || []).push(f); });
                      return Object.entries(groups).map(([entity, fs]) => (
                        <div className="factcard" key={entity}>
                          <div className="factent">{entity}</div>
                          {fs.map((f) => (
                            <div className="factrow" key={f.id}>
                              <span className="bdot" style={{ background: "var(--brass)" }} />
                              <span className="factstmt">{f.statement}</span>
                              <span className="factch">ch {f.chapter}</span>
                              <button className="factx" onClick={() => removeFact(f.id)} aria-label="Remove"><X size={12} /></button>
                            </div>
                          ))}
                        </div>
                      ));
                    })()}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {modal && (
        <div className="overlay" onClick={() => setModal(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheethead">
              <div className="sheettitle">{modal.title}</div>
              <button className="iconbtn" onClick={() => setModal(null)} aria-label="Close"><X size={16} /></button>
            </div>
            {modal.note && <div className="sheetnote">{modal.note}</div>}
            <textarea className="sheettext" readOnly value={modal.content} onFocus={(e) => e.target.select()} />
            <div className="sheetactions">
              <button className="cta sm" onClick={() => { navigator.clipboard?.writeText(modal.content); setModalCopied(true); setTimeout(() => setModalCopied(false), 1500); }}>
                {modalCopied ? <Check size={15} /> : <Copy size={15} />} {modalCopied ? "Copied" : "Copy all"}
              </button>
              <button className="ghost" onClick={() => tryDownload(modal.filename, modal.downloadContent || modal.content, modal.mime)}><Download size={14} /> Try download</button>
            </div>
          </div>
        </div>
      )}

      {importOpen && (
        <div className="overlay" onClick={() => setImportOpen(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheethead">
              <div className="sheettitle">Open a saved story</div>
              <button className="iconbtn" onClick={() => setImportOpen(false)} aria-label="Close"><X size={16} /></button>
            </div>
            <div className="sheetnote">Paste the text you copied from Save. This replaces whatever's currently open.</div>
            <textarea className="sheettext" placeholder="Paste your saved story text here…" value={importText} onChange={(e) => setImportText(e.target.value)} />
            <div className="sheetactions">
              <button className="cta sm" disabled={!importText.trim()} onClick={loadProject}><Upload size={15} /> Load this story</button>
              <button className="ghost" onClick={() => setImportOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- subcomponents ---------- */
function Busy({ label }) {
  const lines = ["Holding the thread…", "Letting it find its shape…", "Almost there…"];
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % lines.length), 2600); return () => clearInterval(t); }, []);
  return (
    <div className="busy">
      <span className="dotpulse" style={{ width: 12, height: 12 }} />
      <div className="big">{label}</div>
      <div className="subtle">{lines[i]}</div>
    </div>
  );
}

function Cell({ k, v, onChange }) {
  return (
    <div className="cell">
      <div className="k">{k}</div>
      <div className="v">{onChange ? <Editable value={v} onChange={onChange} multiline /> : v}</div>
    </div>
  );
}

function CharacterCard({ c, i, isOpen, toggle, onEdit, onEditNested, onDeepen, onRemove, elapsed }) {
  const status = c.status || (c.want ? "ready" : "queued");
  const ready = status === "ready";
  return (
    <div className="dossier">
      <div className="dhead" onClick={toggle}>
        <span className="dnum">{String(i + 1).padStart(2, "0")}</span>
        {isOpen ? <ChevronDown size={16} color="#a08a5c" /> : <ChevronRight size={16} color="#a08a5c" />}
        <div style={{ flex: 1 }}>
          <div className="dname">{c.name}</div>
          <div className="drole">{c.role}</div>
          {c.oneLine && <div className="done-line">{c.oneLine}</div>}
        </div>
        {status === "generating" && (
          <span className="loader" style={{ fontSize: 11, color: "#9a7730", whiteSpace: "nowrap" }}>
            <span className="dotpulse" />developing · {elapsed}s
          </span>
        )}
        {status === "queued" && (
          <span style={{ fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: ".12em", color: "#a99e85", textTransform: "uppercase" }}>waiting</span>
        )}
        {status === "failed" && (
          <button className="mini" onClick={(e) => { e.stopPropagation(); onDeepen(); }}
            style={{ color: "var(--oxblood-soft)", borderColor: "rgba(124,47,62,.45)", whiteSpace: "nowrap" }}>
            <RefreshCw size={12} /> Stalled — retry
          </button>
        )}
      </div>

      {isOpen && ready && (
        <div className="dbody">
          <div className="psy">
            <Cell k="Want — the goal" v={c.want} onChange={(v) => onEdit(c.id, "want", v)} />
            <Cell k="Need — the truth" v={c.need} onChange={(v) => onEdit(c.id, "need", v)} />
            <Cell k="The lie they believe" v={c.theLie} onChange={(v) => onEdit(c.id, "theLie", v)} />
            <Cell k="The wound" v={c.theWound} onChange={(v) => onEdit(c.id, "theWound", v)} />
            <Cell k="Fatal flaw" v={c.flaw} onChange={(v) => onEdit(c.id, "flaw", v)} />
            <Cell k="Redeeming virtue" v={c.virtue} onChange={(v) => onEdit(c.id, "virtue", v)} />
          </div>

          {c.voice && (
            <div className="voicebox">
              <div className="flabel" style={{ margin: "0 0 7px", color: "#3a7370" }}>Voice — {c.voice.description}</div>
              <div className="vsample"><Quote size={15} style={{ flexShrink: 0, marginTop: 3, opacity: .5 }} />
                <Editable value={c.voice.sampleLine} onChange={(v) => onEditNested(c.id, "voice", "sampleLine", v)} multiline /></div>
            </div>
          )}

          {c.arc && (
            <>
              <div className="flabel">The arc</div>
              <div className="arc">
                <div className="arcstep"><div className="k">Start</div><div className="v"><Editable value={c.arc.start} onChange={(v) => onEditNested(c.id, "arc", "start", v)} multiline /></div></div>
                <div className="arcstep"><div className="k">Turn</div><div className="v"><Editable value={c.arc.turn} onChange={(v) => onEditNested(c.id, "arc", "turn", v)} multiline /></div></div>
                <div className="arcstep"><div className="k">End</div><div className="v"><Editable value={c.arc.end} onChange={(v) => onEditNested(c.id, "arc", "end", v)} multiline /></div></div>
              </div>
            </>
          )}

          {(c.physical || c.mannerism) && (
            <>
              <div className="flabel">On the page</div>
              {c.physical && <div className="prose" style={{ fontSize: 14 }}>{c.physical}</div>}
              {c.mannerism && <div className="prose" style={{ fontSize: 14, marginTop: 6, fontStyle: "italic", color: "#6b5e44" }}>Tell: {c.mannerism}</div>}
            </>
          )}

          {c.relationships?.length > 0 && (
            <>
              <div className="flabel">Charged relationships</div>
              {c.relationships.map((r, j) => <div className="rel" key={j}><b>{r.to}</b> — {r.dynamic}</div>)}
            </>
          )}

          {c.secret && <><div className="flabel">Secret</div><div className="prose" style={{ fontSize: 14, color: "var(--oxblood-soft)" }}>{c.secret}</div></>}

          <div className="dactions">
            <button className="mini" onClick={onDeepen}><Wand2 size={13} /> Deepen further</button>
            <button className="mini danger" onClick={onRemove}><Trash2 size={13} /> Remove</button>
          </div>
        </div>
      )}
    </div>
  );
}
