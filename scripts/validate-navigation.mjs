import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
const shell=readFileSync("index.html","utf8");
const html=readFileSync("src/ThriveApp.jsx","utf8")+readFileSync("src/index.css","utf8");
const entry=readFileSync("src/main.jsx","utf8");
const source=readFileSync("src/ExploreCreate.jsx","utf8");
const pkg=JSON.parse(readFileSync("package.json","utf8"));
const workflow=readFileSync(".github/workflows/deploy.yml","utf8");
const checks=[
 ["Vite builds root index.html",()=>{assert.match(pkg.scripts.build,/vite build/);assert.match(shell,/<div id="root"><\/div>/);assert.match(shell,/type="module" src="\/src\/main.jsx"/);assert.doesNotMatch(shell,/text\/babel|unpkg.com/);}],
 ["Single module root render",()=>{assert.match(entry,/from "\.\/ThriveApp.jsx"/);assert.equal((entry.match(/createRoot/g)||[]).length,1);assert.doesNotMatch(html,/ReactDOM|root\.render/);}],
 ["Explore route and consumer role menus",()=>{assert.match(html,/explore:<ExploreCreate\/>/);for(const role of ["Youth","Family","Veteran"]){const block=html.match(new RegExp(role+": \\[([\\s\\S]*?)(?=\\n    (?:Youth|Family|Veteran|School|Provider|Admin):|\\n  };)"));assert.ok(block,role+" menu missing");assert.match(block[0],/id:"explore"/,role+" explore link missing");}}],
 ["Activity navigation does not overwrite hash",()=>{assert.doesNotMatch(html,/href="#activities"/);assert.match(html,/id="activities" tabIndex=\{-1\}/);}],
 ["Browser history listeners and role guard",()=>{assert.match(html,/pushState/);assert.match(html,/popstate/);assert.match(html,/hashchange/);assert.match(html,/Page not available for this account/);assert.match(html,/Page not found/);}],
 ["Mobile navigation",()=>{assert.match(html,/mobile-nav-trigger/);assert.match(html,/mobile-drawer/);assert.match(html,/aria-label="Open navigation"/);}],
 ["Explore activity source",()=>{for(const c of ["Coping & Calm","Breathing","Art & Creativity","Move & Exercise","Cook & Nourish","Knit & Crochet","Create Music"])assert.ok(source.includes(c),c+" missing");}],
 ["Deployment entrypoint note",()=>{assert.match(workflow,/npm run build/);assert.match(workflow,/path: dist/);}]
];
let failures=0;
for(const [name,run] of checks){try{run();console.log("PASS",name)}catch(e){failures++;console.error("FAIL",name,e.message)}}
if(failures)process.exitCode=1;

