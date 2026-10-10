// EPSE-Thrive Explore & Create: self-directed activities. No health data collected.
import React, { useState } from "react";
const activities = [
 {id:"ground",category:"Coping & Calm",title:"5–4–3–2–1 Grounding",minutes:5,steps:["Name five things you can see.","Notice four things you can feel.","Listen for three sounds.","Notice two scents.","Notice one taste or take a slow comfortable breath."]},
 {id:"breath",category:"Breathing",title:"Gentle Breathing",minutes:2,steps:["Breathe comfortably; don't force or hold your breath.","Follow the expanding and contracting circle.","Stop or return to normal breathing whenever you want."]},
 {id:"art",category:"Art & Creativity",title:"Draw Your Happy Place",minutes:15,steps:["Choose pencils, paint, or a digital canvas.","Draw a place—real or imagined—where you feel comfortable.","Add three details that make it yours."]},
 {id:"move",category:"Move & Exercise",title:"Five-Minute Movement Break",minutes:5,steps:["March or walk gently for one minute.","Roll shoulders slowly for thirty seconds.","Stretch arms comfortably.","Walk or move at your own pace for two minutes.","Cool down gently; stop if uncomfortable."]},
 {id:"cook",category:"Cook & Nourish",title:"Colorful Yogurt Bowl",minutes:5,steps:["Check ingredients for allergies.","Spoon plain yogurt into a bowl.","Add washed berries or sliced fruit.","Top with oats or seeds if suitable.","Enjoy; substitute dairy-free yogurt if preferred."]},
 {id:"craft",category:"Knit & Crochet",title:"First Crochet Chain",minutes:10,steps:["Gather yarn and a suitable crochet hook.","Make a slip knot and place it on the hook.","Wrap yarn over the hook and pull through the loop.","Repeat slowly to create a chain.","Try making ten chain stitches."]},
];
export default function ExploreCreate(){
 const [category,setCategory]=useState("All");
 const [selected,setSelected]=useState(null);
 const [favorites,setFavorites]=useState([]);
 const [step,setStep]=useState(0);
 const [phase,setPhase]=useState("In");
 const [running,setRunning]=useState(false);
 const categories=["All",...new Set(activities.map(x=>x.category)),"Create Music"];
 const visible=activities.filter(x=>category==="All"||x.category===category);
 React.useEffect(()=>{if(!running)return;const id=setInterval(()=>setPhase(p=>p==="In"?"Out":"In"),4000);return()=>clearInterval(id)},[running]);
 return <main style={{fontFamily:"system-ui",padding:20,maxWidth:920,margin:"auto",color:"#172554"}}>
 <a href="#activities">Skip to activities</a><h1>Explore & Create</h1><p>Choose something you enjoy. No personal health information required.</p>
 <nav aria-label="Activity categories" style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>{categories.map(c=><button key={c} aria-pressed={category===c} onClick={()=>{setCategory(c);setSelected(null);setRunning(false)}} style={{padding:"10px 14px",borderRadius:22,border:"1px solid #008f86",background:category===c?"#007f78":"white",color:category===c?"white":"#163e5a",cursor:"pointer"}}>{c}</button>)}</nav>
 {category==="Create Music"?<section><h2>Create Music</h2><p>Explore original AI-generated music across genres. Music creation is coming after provider, licensing and safety review.</p></section>:<div id="activities" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16}}>{visible.map(a=><article key={a.id} style={{border:"1px solid #cbd5e1",borderRadius:14,padding:18,background:"#fff"}}><small>{a.category} · {a.minutes} min</small><h2 style={{fontSize:20}}>{a.title}</h2><button onClick={()=>{setSelected(a.id);setStep(0);setRunning(false)}}>Try now</button>{" "}<button aria-pressed={favorites.includes(a.id)} onClick={()=>setFavorites(p=>p.includes(a.id)?p.filter(x=>x!==a.id):[...p,a.id])}>{favorites.includes(a.id)?"Saved ✓":"Save"}</button>{selected===a.id&&<section aria-label={a.title+" instructions"}><ol>{a.steps.map((s,i)=><li key={i} style={{fontWeight:i===step?"bold":"normal",margin:"8px 0"}}>{s}</li>)}</ol><button disabled={step===0} onClick={()=>setStep(s=>s-1)}>Previous</button>{" "}<button disabled={step===a.steps.length-1} onClick={()=>setStep(s=>s+1)}>Next</button>{a.id==="breath"&&<div style={{marginTop:16}}><div aria-live="polite" style={{width:120,height:120,borderRadius:"50%",background:"#99f6e4",display:"grid",placeItems:"center",margin:"16px auto",transform:running&&phase==="In"?"scale(1.2)":"scale(1)",transition:"transform 4s ease"}}>{running?(phase==="In"?"Breathe in":"Breathe out"):"At your pace"}</div><button onClick={()=>setRunning(x=>!x)}>{running?"Stop breathing guide":"Start breathing guide"}</button></div>}</section>}</article>)}</div>}
 <p style={{marginTop:28,fontSize:13}}>Activities are for general well-being and learning, not medical treatment. Stop any activity that causes discomfort.</p></main>;
}
