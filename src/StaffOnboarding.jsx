import React, {useEffect, useState} from 'react';

const roles = ['provider','intake_coordinator','supervisor','org_admin'];
const orgTypes = ['cmhc','fqhc','hospital_bh','private_practice','school','community_partner'];
const label = value => value.replaceAll('_',' ');

export default function StaffOnboarding({request}) {
  const [orgs,setOrgs]=useState([]), [members,setMembers]=useState([]);
  const [queue,setQueue]=useState([]), [adminOrg,setAdminOrg]=useState('');
  const [error,setError]=useState(''), [message,setMessage]=useState(''), [busy,setBusy]=useState(false);
  const [orgId,setOrgId]=useState(''), [role,setRole]=useState('provider');
  const [name,setName]=useState(''), [credentials,setCredentials]=useState('');
  const [orgName,setOrgName]=useState(''), [orgType,setOrgType]=useState('private_practice');
  const [npi,setNpi]=useState(''), [medicaid,setMedicaid]=useState(false), [languages,setLanguages]=useState('en');
  const [allowedRoles,setAllowedRoles]=useState([...roles]);
  const [platformReview,setPlatformReview]=useState(false);
  const [administratorName,setAdministratorName]=useState('');
  const refresh=async()=>{
    const [organizations,memberships,capabilities]=await Promise.all([request('staff/organizations'),request('staff/me'),request('staff/capabilities')]);
    setOrgs(organizations);setMembers(memberships);setPlatformReview(capabilities.platform_review===true);
  };
  useEffect(()=>{refresh().catch(()=>setError('Onboarding could not load. Check the account connection and try again.'));},[request]);
  const run=async(action)=>{
    setBusy(true);setError('');setMessage('');
    try {await action();await refresh();}
    catch(e){setError(e.message || 'The request could not be completed.');}
    finally{setBusy(false);}
  };
  const selected=orgs.find(o=>o.id===orgId);
  const admins=members.filter(m=>m.status==='approved'&&m.approved_role==='org_admin');
  return <section aria-label="Organization and staff onboarding">
    <h2>Organizations and staff</h2>
    {error&&<p role="alert">{error}</p>}{message&&<p role="status">{message}</p>}
    <button disabled={busy} onClick={()=>run(refresh)}>Refresh onboarding</button>
    <form onSubmit={e=>{e.preventDefault();run(async()=>{
      await request('staff/memberships',{method:'POST',body:{org_id:orgId,full_name:name,credentials,requested_role:role}});
      setMessage('Your staff request was submitted for organization approval.');
    });}}>
      <h3>Join an organization</h3>
      <label>Full name<input required maxLength={200} value={name} onChange={e=>setName(e.target.value)}/></label>
      <label>Credentials<input maxLength={2000} placeholder="LCSW, LPC, MD…" value={credentials} onChange={e=>setCredentials(e.target.value)}/></label>
      <label>Organization<select required value={orgId} onChange={e=>{
        setOrgId(e.target.value);setRole(orgs.find(o=>o.id===e.target.value)?.allowed_roles[0]||'provider');
      }}><option value="">Select an organization</option>{orgs.filter(o=>o.status==='approved').map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select></label>
      <label>Requested role<select value={role} onChange={e=>setRole(e.target.value)}>{(selected?.allowed_roles||roles).map(r=><option key={r} value={r}>{label(r)}</option>)}</select></label>
      <p>Your organization administrator approves your role before staff access is activated.</p>
      <button disabled={busy||!orgId}>Submit staff request</button>
    </form>
    <h3>Your staff memberships</h3>
    {!members.length&&<p>No staff memberships yet.</p>}
    <ul>{members.map(m=><li key={m.id}>{orgs.find(o=>o.id===m.org_id)?.name||'Organization'} — {label(m.approved_role||m.requested_role)} — {m.status}</li>)}</ul>
    <form onSubmit={e=>{e.preventDefault();run(async()=>{
      await request('staff/organizations',{method:'POST',body:{name:orgName,administrator_name:administratorName,type:orgType,npi:npi||null,
        medicaid_accepted:medicaid,languages_supported:languages.split(',').map(s=>s.trim()).filter(Boolean),allowed_roles:allowedRoles}});
      setMessage('Organization registration submitted for platform review.');
    });}}>
      <h3>Register a new organization</h3>
      <label>Organization name<input required maxLength={200} value={orgName} onChange={e=>setOrgName(e.target.value)}/></label>
      <label>Organization administrator full name<input required maxLength={200} value={administratorName} onChange={e=>setAdministratorName(e.target.value)}/></label>
      <label>Organization type<select value={orgType} onChange={e=>setOrgType(e.target.value)}>{orgTypes.map(t=><option key={t} value={t}>{label(t)}</option>)}</select></label>
      <label>NPI (optional)<input pattern="[0-9]{10}" value={npi} onChange={e=>setNpi(e.target.value)}/></label>
      <label><input type="checkbox" checked={medicaid} onChange={e=>setMedicaid(e.target.checked)}/>Accepts Medicaid</label>
      <label>Supported language codes, separated by commas<input required value={languages} onChange={e=>setLanguages(e.target.value)}/></label>
      <fieldset><legend>Staff roles available in this organization</legend>{roles.map(r=><label key={r}><input type="checkbox" checked={allowedRoles.includes(r)} onChange={e=>setAllowedRoles(p=>e.target.checked?[...p,r]:p.filter(x=>x!==r))}/>{label(r)}</label>)}</fieldset>
      <p>Registration requires platform approval. Your administrator account is established after that review.</p>
      <button disabled={busy||!allowedRoles.length}>Submit organization registration</button>
    </form>
    <ul>{orgs.filter(o=>o.status!=='approved').map(o=><li key={o.id}>{o.name} — {o.status}</li>)}</ul>
    {platformReview&&<section><h3>Review organization registrations</h3>
      <p>Approve only after confirming the organization and its requesting administrator.</p>
      {orgs.filter(o=>o.status==='pending').map(o=><div key={o.id}>{o.name} — {label(o.type)} — NPI: {o.npi||'Not supplied'}
        {['approved','rejected'].map(status=><button key={status} disabled={busy} onClick={()=>run(async()=>{
          await request(`staff/organizations/${o.id}`,{method:'PATCH',body:{status}});
        })}>{status==='approved'?'Approve organization':'Reject organization'}</button>)}
      </div>)}
    </section>}
    {!!admins.length&&<section><h3>Review staff requests</h3>
      <label>Your organization<select value={adminOrg} onChange={e=>{setAdminOrg(e.target.value);setQueue([]);}}><option value="">Select</option>{admins.map(m=><option key={m.id} value={m.org_id}>{orgs.find(o=>o.id===m.org_id)?.name||m.org_id}</option>)}</select></label>
      <button disabled={busy||!adminOrg} onClick={()=>run(async()=>setQueue(await request(`staff/organizations/${adminOrg}/memberships`)))}>Load staff requests</button>
      <ul>{queue.map(m=><li key={m.id}>{m.full_name} — {m.credentials||'No credentials supplied'} — {label(m.requested_role)} — {m.status}
        {m.status==='pending'&&['approved','rejected'].map(status=><button key={status} disabled={busy} onClick={()=>run(async()=>{
          await request(`staff/organizations/${adminOrg}/memberships/${m.id}`,{method:'PATCH',body:{status}});
          setQueue(await request(`staff/organizations/${adminOrg}/memberships`));
        })}>{status==='approved'?'Approve':'Reject'}</button>)}</li>)}</ul>
    </section>}
  </section>;
}
