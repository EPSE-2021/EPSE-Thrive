import React, {useEffect, useState, useCallback} from "react";
import {PublicClientApplication, InteractionRequiredAuthError} from "@azure/msal-browser";
import StaffOnboarding from "./StaffOnboarding.jsx";
import DemoApp from "./ThriveApp.jsx";

const enabled = import.meta.env.VITE_CONSUMER_AUTH_ENABLED === "true";
const clientId = import.meta.env.VITE_CIAM_CLIENT_ID;
const tenantId = import.meta.env.VITE_CIAM_TENANT_ID;
const subdomain = import.meta.env.VITE_CIAM_SUBDOMAIN;
const apiScope = import.meta.env.VITE_CIAM_API_SCOPE;
const apiBase = import.meta.env.VITE_API_BASE_URL;
const configured = Boolean(clientId && tenantId && subdomain && apiScope && apiBase);
let identity;
let ready;
function getIdentity() {
  if (!configured) throw new Error("Customer sign-in configuration is incomplete.");
  if (!identity) {
    const destination = new URL(apiBase);
    if (destination.protocol !== "https:" &&
        !(destination.protocol === "http:" && ["localhost","127.0.0.1"].includes(destination.hostname))) {
      throw new Error("The account service must use HTTPS.");
    }
    identity = new PublicClientApplication({
      auth: {clientId, authority: `https://${subdomain}.ciamlogin.com/${tenantId}`,
        knownAuthorities: [`${subdomain}.ciamlogin.com`],
        redirectUri: window.location.origin + import.meta.env.BASE_URL,
        postLogoutRedirectUri: window.location.origin + import.meta.env.BASE_URL,
        navigateToLoginRequestUrl: false},
      cache: {cacheLocation: "memoryStorage"}
    });
    ready = identity.initialize().then(() => identity.handleRedirectPromise());
  }
  return {identity, ready};
}
export default function ConsumerApp() {
  const [demo,setDemo] = useState(false);
  const [account,setAccount] = useState(null);
  const [verified,setVerified] = useState(false);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  useEffect(() => {
    if (!enabled || !configured) return;
    let active=true;
    try {
      const {identity,ready}=getIdentity();
      ready.then(result => {
        const selected=result?.account || identity.getAllAccounts()[0];
        if (selected) identity.setActiveAccount(selected);
        if(active) setAccount(selected || null);
      }).catch(() => {if(active)setError("Sign-in could not be completed. Please try again.");});
    } catch {setError("Customer sign-in configuration needs attention.");}
    return()=>{active=false;};
  },[]);
  const signIn=async()=>{
    setBusy(true); setError("");
    try {
      const {identity,ready}=getIdentity();
      await ready;
      await identity.loginRedirect({scopes:[apiScope], prompt:"select_account"});
    } catch {setError("Sign-in could not start. Please try again.");setBusy(false);}
  };
  const request=useCallback(async(path, options={})=>{
    const {identity,ready}=getIdentity();await ready;
    let result;
    try {result=await identity.acquireTokenSilent({account,scopes:[apiScope]});}
    catch(err) {
      if(err instanceof InteractionRequiredAuthError) {
        await identity.acquireTokenRedirect({account,scopes:[apiScope]});
        throw new Error("Complete sign-in to continue.");
      }
      throw err;
    }
    const response=await fetch(new URL(path,apiBase.endsWith("/")?apiBase:apiBase+"/"),{
      method:options.method||"GET",headers:{Authorization:`Bearer ${result.accessToken}`,
        ...(options.body?{"Content-Type":"application/json"}:{})},
      ...(options.body?{body:JSON.stringify(options.body)}:{}),cache:"no-store",credentials:"omit"});
    if(!response.ok) {
      let detail;try {detail=(await response.json()).detail;} catch {}
      throw new Error(typeof detail==="string"?detail:"The account service could not complete the request.");
    }
    return response.json();
  },[account]);
  const verify=async()=>{
    setBusy(true);setError("");setVerified(false);
    try {
      const profile=await request("me");
      if(profile.account_mode!=="consumer"||!profile.subject) throw new Error("Invalid account response");
      setVerified(true);
    } catch {setError("Your account service could not be verified. Please try again.");}
    finally {setBusy(false);}
  };
  const signOut=async()=>{
    setBusy(true);setVerified(false);setError("");
    try {const {identity,ready}=getIdentity();await ready;await identity.logoutRedirect({account});}
    catch {setBusy(false);setError("Sign-out could not complete. Please try again.");}
  };
  if (!enabled || demo) return <><DemoApp/>{demo&&<button onClick={()=>setDemo(false)} style={{position:"fixed",bottom:12,right:12,zIndex:9999}}>Return to account sign-in</button>}</>;
  return <main style={{minHeight:"100vh",background:"linear-gradient(135deg,#2F3E9E,#00B8A9)",display:"grid",placeItems:"center",padding:24}}>
    <section style={{background:"white",padding:32,borderRadius:18,maxWidth:480,width:"100%"}}>
      <h1>EPSE-Thrive</h1>
      {account ? <>
        <h2>Your account is signed in</h2>
        <p>{verified?"The EPSE-Thrive account service verified your sign-in.":"Verify the connection to your EPSE-Thrive account service."}</p>
        <button disabled={busy} onClick={verify}>Verify account connection</button>
        <button disabled={busy} onClick={signOut}>Sign out</button>
        <p>Wellness records, care-team access and messaging are still being prepared.</p>
        {verified&&<StaffOnboarding request={request}/>}
      </> : <>
        <h2>Create an account or sign in</h2>
        <p>Continue to our secure sign-in page to register using an email verification code. Available social sign-in options appear there.</p>
        <button disabled={busy||!configured} onClick={signIn}>Continue to secure sign-in</button>
        {!configured&&<p>Customer sign-in is awaiting configuration.</p>}
      </>}
      {error&&<p role="alert">{error}</p>}
      <hr/>
      <button onClick={()=>setDemo(true)}>Explore the fictional demo</button>
    </section>
  </main>;
}
