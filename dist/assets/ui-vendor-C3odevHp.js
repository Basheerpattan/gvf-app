import{r as D,R as j}from"./react-vendor-Cq6QLrk_.js";let ar={data:""},nr=e=>{if(typeof window=="object"){let r=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return r.nonce=window.__nonce__,r.parentNode||(e||document.head).appendChild(r),r.firstChild}return e||ar},or=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,lr=/\/\*[^]*?\*\/|  +/g,pt=/\n+/g,le=(e,r)=>{let t="",i="",d="";for(let l in e){let a=e[l];l[0]=="@"?l[1]=="i"?t=l+" "+a+";":i+=l[1]=="f"?le(a,l):l+"{"+le(a,l[1]=="k"?"":r)+"}":typeof a=="object"?i+=le(a,r?r.replace(/([^,])+/g,u=>l.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,v=>/&/.test(v)?v.replace(/&/g,u):u?u+" "+v:v)):l):a!=null&&(l=l[1]=="-"?l:l.replace(/[A-Z]/g,"-$&").toLowerCase(),d+=le.p?le.p(l,a):l+":"+a+";")}return t+(r&&d?r+"{"+d+"}":d)+i},oe={},Ct=e=>{if(typeof e=="object"){let r="";for(let t in e)r+=t+Ct(e[t]);return r}return e},dr=(e,r,t,i,d)=>{let l=Ct(e),a=oe[l]||(oe[l]=(v=>{let b=0,w=11;for(;b<v.length;)w=101*w+v.charCodeAt(b++)>>>0;return"go"+w})(l));if(!oe[a]){let v=l!==e?e:(b=>{let w,V,O=[{}];for(;w=or.exec(b.replace(lr,""));)w[4]?O.shift():w[3]?(V=w[3].replace(pt," ").trim(),O.unshift(O[0][V]=O[0][V]||{})):O[0][w[1]]=w[2].replace(pt," ").trim();return O[0]})(e);oe[a]=le(d?{["@keyframes "+a]:v}:v,t?"":"."+a)}let u=t&&oe.g;return t&&(oe.g=oe[a]),((v,b,w,V)=>{V?b.data=b.data.replace(V,v):b.data.indexOf(v)===-1&&(b.data=w?v+b.data:b.data+v)})(oe[a],r,i,u),a},ur=(e,r,t)=>e.reduce((i,d,l)=>{let a=r[l];if(a&&a.call){let u=a(t),v=u&&u.props&&u.props.className||/^go/.test(u)&&u;a=v?"."+v:u&&typeof u=="object"?u.props?"":le(u,""):u===!1?"":u}return i+d+(a??"")},"");function Ie(e){let r=this||{},t=e.call?e(r.p):e;return dr(t.unshift?t.raw?ur(t,[].slice.call(arguments,1),r.p):t.reduce((i,d)=>Object.assign(i,d&&d.call?d(r.p):d),{}):t,nr(r.target),r.g,r.o,r.k)}let Ot,Ke,Xe;Ie.bind({g:1});let ae=Ie.bind({k:1});function cr(e,r,t,i){le.p=r,Ot=e,Ke=t,Xe=i}function de(e,r){let t=this||{};return function(){let i=arguments;function d(l,a){let u=Object.assign({},l),v=u.className||d.className;t.p=Object.assign({theme:Ke&&Ke()},u),t.o=/go\d/.test(v),u.className=Ie.apply(t,i)+(v?" "+v:"");let b=e;return e[0]&&(b=u.as||e,delete u.as),Xe&&b[0]&&Xe(u),Ot(b,u)}return d}}var fr=e=>typeof e=="function",Te=(e,r)=>fr(e)?e(r):e,yr=(()=>{let e=0;return()=>(++e).toString()})(),St=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let r=matchMedia("(prefers-reduced-motion: reduce)");e=!r||r.matches}return e}})(),hr=20,tt="default",Tt=(e,r)=>{let{toastLimit:t}=e.settings;switch(r.type){case 0:return{...e,toasts:[r.toast,...e.toasts].slice(0,t)};case 1:return{...e,toasts:e.toasts.map(a=>a.id===r.toast.id?{...a,...r.toast}:a)};case 2:let{toast:i}=r;return Tt(e,{type:e.toasts.find(a=>a.id===i.id)?1:0,toast:i});case 3:let{toastId:d}=r;return{...e,toasts:e.toasts.map(a=>a.id===d||d===void 0?{...a,dismissed:!0,visible:!1}:a)};case 4:return r.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(a=>a.id!==r.toastId)};case 5:return{...e,pausedAt:r.time};case 6:let l=r.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(a=>({...a,pauseDuration:a.pauseDuration+l}))}}},Oe=[],Lt={toasts:[],pausedAt:void 0,settings:{toastLimit:hr}},re={},Rt=(e,r=tt)=>{re[r]=Tt(re[r]||Lt,e),Oe.forEach(([t,i])=>{t===r&&i(re[r])})},It=e=>Object.keys(re).forEach(r=>Rt(e,r)),gr=e=>Object.keys(re).find(r=>re[r].toasts.some(t=>t.id===e)),Ne=(e=tt)=>r=>{Rt(r,e)},mr={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},vr=(e={},r=tt)=>{let[t,i]=D.useState(re[r]||Lt),d=D.useRef(re[r]);D.useEffect(()=>(d.current!==re[r]&&i(re[r]),Oe.push([r,i]),()=>{let a=Oe.findIndex(([u])=>u===r);a>-1&&Oe.splice(a,1)}),[r]);let l=t.toasts.map(a=>{var u,v,b;return{...e,...e[a.type],...a,removeDelay:a.removeDelay||((u=e[a.type])==null?void 0:u.removeDelay)||(e==null?void 0:e.removeDelay),duration:a.duration||((v=e[a.type])==null?void 0:v.duration)||(e==null?void 0:e.duration)||mr[a.type],style:{...e.style,...(b=e[a.type])==null?void 0:b.style,...a.style}}});return{...t,toasts:l}},pr=(e,r="blank",t)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:r,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...t,id:(t==null?void 0:t.id)||yr()}),Ve=e=>(r,t)=>{let i=pr(r,e,t);return Ne(i.toasterId||gr(i.id))({type:2,toast:i}),i.id},H=(e,r)=>Ve("blank")(e,r);H.error=Ve("error");H.success=Ve("success");H.loading=Ve("loading");H.custom=Ve("custom");H.dismiss=(e,r)=>{let t={type:3,toastId:e};r?Ne(r)(t):It(t)};H.dismissAll=e=>H.dismiss(void 0,e);H.remove=(e,r)=>{let t={type:4,toastId:e};r?Ne(r)(t):It(t)};H.removeAll=e=>H.remove(void 0,e);H.promise=(e,r,t)=>{let i=H.loading(r.loading,{...t,...t==null?void 0:t.loading});return typeof e=="function"&&(e=e()),e.then(d=>{let l=r.success?Te(r.success,d):void 0;return l?H.success(l,{id:i,...t,...t==null?void 0:t.success}):H.dismiss(i),d}).catch(d=>{let l=r.error?Te(r.error,d):void 0;l?H.error(l,{id:i,...t,...t==null?void 0:t.error}):H.dismiss(i)}),e};var kr=1e3,xr=(e,r="default")=>{let{toasts:t,pausedAt:i}=vr(e,r),d=D.useRef(new Map).current,l=D.useCallback((V,O=kr)=>{if(d.has(V))return;let I=setTimeout(()=>{d.delete(V),a({type:4,toastId:V})},O);d.set(V,I)},[]);D.useEffect(()=>{if(i)return;let V=Date.now(),O=t.map(I=>{if(I.duration===1/0)return;let A=(I.duration||0)+I.pauseDuration-(V-I.createdAt);if(A<0){I.visible&&H.dismiss(I.id);return}return setTimeout(()=>H.dismiss(I.id,r),A)});return()=>{O.forEach(I=>I&&clearTimeout(I))}},[t,i,r]);let a=D.useCallback(Ne(r),[r]),u=D.useCallback(()=>{a({type:5,time:Date.now()})},[a]),v=D.useCallback((V,O)=>{a({type:1,toast:{id:V,height:O}})},[a]),b=D.useCallback(()=>{i&&a({type:6,time:Date.now()})},[i,a]),w=D.useCallback((V,O)=>{let{reverseOrder:I=!1,gutter:A=8,defaultPosition:F}=O||{},x=t.filter(C=>(C.position||F)===(V.position||F)&&C.height),fe=x.findIndex(C=>C.id===V.id),E=x.filter((C,N)=>N<fe&&C.visible).length;return x.filter(C=>C.visible).slice(...I?[E+1]:[0,E]).reduce((C,N)=>C+(N.height||0)+A,0)},[t]);return D.useEffect(()=>{t.forEach(V=>{if(V.dismissed)l(V.id,V.removeDelay);else{let O=d.get(V.id);O&&(clearTimeout(O),d.delete(V.id))}})},[t,l]),{toasts:t,handlers:{updateHeight:v,startPause:u,endPause:b,calculateOffset:w}}},br=ae`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,wr=ae`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Vr=ae`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,_r=de("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${br} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${wr} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${Vr} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,Ar=ae`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,Fr=de("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${Ar} 1s linear infinite;
`,Er=ae`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,Dr=ae`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,Mr=de("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Er} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${Dr} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,Cr=de("div")`
  position: absolute;
`,Or=de("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Sr=ae`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Tr=de("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Sr} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Lr=({toast:e})=>{let{icon:r,type:t,iconTheme:i}=e;return r!==void 0?typeof r=="string"?D.createElement(Tr,null,r):r:t==="blank"?null:D.createElement(Or,null,D.createElement(Fr,{...i}),t!=="loading"&&D.createElement(Cr,null,t==="error"?D.createElement(_r,{...i}):D.createElement(Mr,{...i})))},Rr=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,Ir=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,Nr="0%{opacity:0;} 100%{opacity:1;}",Pr="0%{opacity:1;} 100%{opacity:0;}",Ur=de("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,qr=de("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,zr=(e,r)=>{let t=e.includes("top")?1:-1,[i,d]=St()?[Nr,Pr]:[Rr(t),Ir(t)];return{animation:r?`${ae(i)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${ae(d)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},Hr=D.memo(({toast:e,position:r,style:t,children:i})=>{let d=e.height?zr(e.position||r||"top-center",e.visible):{opacity:0},l=D.createElement(Lr,{toast:e}),a=D.createElement(qr,{...e.ariaProps},Te(e.message,e));return D.createElement(Ur,{className:e.className,style:{...d,...t,...e.style}},typeof i=="function"?i({icon:l,message:a}):D.createElement(D.Fragment,null,l,a))});cr(D.createElement);var $r=({id:e,className:r,style:t,onHeightUpdate:i,children:d})=>{let l=D.useCallback(a=>{if(a){let u=()=>{let v=a.getBoundingClientRect().height;i(e,v)};u(),new MutationObserver(u).observe(a,{subtree:!0,childList:!0,characterData:!0})}},[e,i]);return D.createElement("div",{ref:l,className:r,style:t},d)},Br=(e,r)=>{let t=e.includes("top"),i=t?{top:0}:{bottom:0},d=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:St()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${r*(t?1:-1)}px)`,...i,...d}},jr=Ie`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,Me=16,xs=({reverseOrder:e,position:r="top-center",toastOptions:t,gutter:i,children:d,toasterId:l,containerStyle:a,containerClassName:u})=>{let{toasts:v,handlers:b}=xr(t,l);return D.createElement("div",{"data-rht-toaster":l||"",style:{position:"fixed",zIndex:9999,top:Me,left:Me,right:Me,bottom:Me,pointerEvents:"none",...a},className:u,onMouseEnter:b.startPause,onMouseLeave:b.endPause},v.map(w=>{let V=w.position||r,O=b.calculateOffset(w,{reverseOrder:e,gutter:i,defaultPosition:r}),I=Br(V,O);return D.createElement($r,{id:w.id,key:w.id,onHeightUpdate:b.updateHeight,className:w.visible?jr:"",style:I},w.type==="custom"?Te(w.message,w):d?d(w):D.createElement(Hr,{toast:w,position:V}))}))},bs=H;/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var Wr={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gr=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase().trim(),k=(e,r)=>{const t=D.forwardRef(({color:i="currentColor",size:d=24,strokeWidth:l=2,absoluteStrokeWidth:a,className:u="",children:v,...b},w)=>D.createElement("svg",{ref:w,...Wr,width:d,height:d,stroke:i,strokeWidth:a?Number(l)*24/Number(d):l,className:["lucide",`lucide-${Gr(e)}`,u].join(" "),...b},[...r.map(([V,O])=>D.createElement(V,O)),...Array.isArray(v)?v:[v]]));return t.displayName=`${e}`,t};/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ws=k("ArrowDown",[["path",{d:"M12 5v14",key:"s699le"}],["path",{d:"m19 12-7 7-7-7",key:"1idqje"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vs=k("Award",[["circle",{cx:"12",cy:"8",r:"6",key:"1vp47v"}],["path",{d:"M15.477 12.89 17 22l-5-3-5 3 1.523-9.11",key:"em7aur"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _s=k("CheckCircle",[["path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14",key:"g774vq"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const As=k("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fs=k("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Es=k("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ds=k("ExternalLink",[["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}],["polyline",{points:"15 3 21 3 21 9",key:"mznyad"}],["line",{x1:"10",x2:"21",y1:"14",y2:"3",key:"18c3s4"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ms=k("EyeOff",[["path",{d:"M9.88 9.88a3 3 0 1 0 4.24 4.24",key:"1jxqfv"}],["path",{d:"M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68",key:"9wicm4"}],["path",{d:"M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61",key:"1jreej"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cs=k("Eye",[["path",{d:"M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z",key:"rwhkz3"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Os=k("FileText",[["path",{d:"M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z",key:"1nnpy2"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["line",{x1:"16",x2:"8",y1:"13",y2:"13",key:"14keom"}],["line",{x1:"16",x2:"8",y1:"17",y2:"17",key:"17nazh"}],["line",{x1:"10",x2:"8",y1:"9",y2:"9",key:"1a5vjj"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ss=k("Globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ts=k("GripVertical",[["circle",{cx:"9",cy:"12",r:"1",key:"1vctgf"}],["circle",{cx:"9",cy:"5",r:"1",key:"hp0tcf"}],["circle",{cx:"9",cy:"19",r:"1",key:"fkjjf6"}],["circle",{cx:"15",cy:"12",r:"1",key:"1tmaij"}],["circle",{cx:"15",cy:"5",r:"1",key:"19l28e"}],["circle",{cx:"15",cy:"19",r:"1",key:"f4zoj3"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ls=k("Heart",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rs=k("Image",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Is=k("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ns=k("LayoutDashboard",[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ps=k("LayoutGrid",[["rect",{width:"7",height:"7",x:"3",y:"3",rx:"1",key:"1g98yp"}],["rect",{width:"7",height:"7",x:"14",y:"3",rx:"1",key:"6d4xhi"}],["rect",{width:"7",height:"7",x:"14",y:"14",rx:"1",key:"nxv5o0"}],["rect",{width:"7",height:"7",x:"3",y:"14",rx:"1",key:"1bb6yr"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Us=k("Leaf",[["path",{d:"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",key:"nnexq3"}],["path",{d:"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",key:"mt58a7"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qs=k("Loader2",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zs=k("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hs=k("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $s=k("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bs=k("MapPin",[["path",{d:"M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z",key:"2oe9fu"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const js=k("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ws=k("MessageSquare",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gs=k("Monitor",[["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["line",{x1:"8",x2:"16",y1:"21",y2:"21",key:"1svkeh"}],["line",{x1:"12",x2:"12",y1:"17",y2:"21",key:"vw1qmm"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zs=k("Pencil",[["path",{d:"M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z",key:"5qss01"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ys=k("Phone",[["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ks=k("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xs=k("Save",[["path",{d:"M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z",key:"1owoqh"}],["polyline",{points:"17 21 17 13 7 13 7 21",key:"1md35c"}],["polyline",{points:"7 3 7 8 15 8",key:"8nz8an"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Js=k("Send",[["path",{d:"m22 2-7 20-4-9-9-4Z",key:"1q3vgg"}],["path",{d:"M22 2 11 13",key:"nzbqef"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qs=k("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ei=k("Shield",[["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",key:"1irkt0"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ti=k("Star",[["polygon",{points:"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2",key:"8f66p6"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ri=k("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const si=k("TrendingUp",[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ii=k("Trophy",[["path",{d:"M6 9H4.5a2.5 2.5 0 0 1 0-5H6",key:"17hqa7"}],["path",{d:"M18 9h1.5a2.5 2.5 0 0 0 0-5H18",key:"lmptdp"}],["path",{d:"M4 22h16",key:"57wxv0"}],["path",{d:"M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22",key:"1nw9bq"}],["path",{d:"M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22",key:"1np0yb"}],["path",{d:"M18 2H6v7a6 6 0 0 0 12 0V2Z",key:"u46fv3"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ai=k("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ni=k("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oi=k("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const li=k("Video",[["path",{d:"m22 8-6 4 6 4V8Z",key:"50v9me"}],["rect",{width:"14",height:"12",x:"2",y:"6",rx:"2",ry:"2",key:"1rqjg6"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const di=k("WifiOff",[["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}],["path",{d:"M8.5 16.5a5 5 0 0 1 7 0",key:"sej527"}],["path",{d:"M2 8.82a15 15 0 0 1 4.17-2.65",key:"11utq1"}],["path",{d:"M10.66 5c4.01-.36 8.14.9 11.34 3.76",key:"hxefdu"}],["path",{d:"M16.85 11.25a10 10 0 0 1 2.22 1.68",key:"q734kn"}],["path",{d:"M5 13a10 10 0 0 1 5.24-2.76",key:"piq4yl"}],["line",{x1:"12",x2:"12.01",y1:"20",y2:"20",key:"of4bc4"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ui=k("Wifi",[["path",{d:"M5 13a10 10 0 0 1 14 0",key:"6v8j51"}],["path",{d:"M8.5 16.5a5 5 0 0 1 7 0",key:"sej527"}],["path",{d:"M2 8.82a15 15 0 0 1 20 0",key:"dnpr2z"}],["line",{x1:"12",x2:"12.01",y1:"20",y2:"20",key:"of4bc4"}]]);/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ci=k("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);var _e=e=>e.type==="checkbox",ce=e=>e instanceof Date,B=e=>e==null;const Nt=e=>typeof e=="object";var R=e=>!B(e)&&!Array.isArray(e)&&Nt(e)&&!ce(e),Zr=e=>R(e)&&e.target?_e(e.target)?e.target.checked:e.target.value:e,Yr=(e,r)=>r.split(".").some((t,i,d)=>!isNaN(Number(t))&&e.has(d.slice(0,i).join("."))),Pt=e=>{const r=e.constructor&&e.constructor.prototype;return R(r)&&r.hasOwnProperty("isPrototypeOf")},Pe=typeof window<"u"&&typeof window.HTMLElement<"u"&&typeof document<"u";function U(e){if(e instanceof Date)return new Date(e);const r=typeof FileList<"u"&&e instanceof FileList;if(Pe&&(e instanceof Blob||r))return e;const t=Array.isArray(e);if(!t&&!(R(e)&&Pt(e)))return e;const i=t?[]:Object.create(Object.getPrototypeOf(e));for(const d in e)Object.prototype.hasOwnProperty.call(e,d)&&(i[d]=U(e[d]));return i}const me={BLUR:"blur",FOCUS_OUT:"focusout",SUBMIT:"submit",TRIGGER:"trigger",VALID:"valid"},Q={onBlur:"onBlur",onChange:"onChange",onSubmit:"onSubmit",onTouched:"onTouched",all:"all"},J={max:"max",min:"min",maxLength:"maxLength",minLength:"minLength",pattern:"pattern",required:"required",validate:"validate"},Ut="root",qt=["__proto__","constructor","prototype"],Kr=/^\w*$/;var Ae=e=>Kr.test(e),T=e=>e===void 0;const Xr=/[.[\]'"]/;var Ue=e=>e.split(Xr).filter(Boolean),m=(e,r,t)=>{if(!r||!R(e))return t;const i=Ae(r)?[r]:Ue(r);if(i.some(l=>qt.includes(l)))return t;const d=i.reduce((l,a)=>B(l)?void 0:l[a],e);return T(d)||d===e?T(e[r])?t:e[r]:d},ee=e=>typeof e=="boolean",X=e=>typeof e=="function",S=(e,r,t)=>{let i=-1;const d=Ae(r)?[r]:Ue(r),l=d.length,a=l-1;for(;++i<l;){const u=d[i];let v=t;if(i!==a){const b=e[u];v=R(b)||Array.isArray(b)?b:isNaN(+d[i+1])?{}:[]}if(qt.includes(u))return;e[u]=v,e=e[u]}};const Jr=j.createContext(null);Jr.displayName="HookFormControlContext";var Qr=(e,r,t,i=!0)=>{const d={};for(const l in e)Object.defineProperty(d,l,{get:()=>{const a=l;return r._proxyFormState[a]!==Q.all&&(r._proxyFormState[a]=!i||Q.all),e[a]}});return d};const es=Pe?j.useLayoutEffect:j.useEffect;var W=e=>typeof e=="string",ts=(e,r,t,i,d)=>W(e)?(i&&r.watch.add(e),m(t,e,d)):Array.isArray(e)?e.map(l=>(i&&r.watch.add(l),m(t,l))):(i&&(r.watchAll=!0),t),Je=e=>B(e)||!Nt(e);const kt=(e,r)=>r.length===0&&!Array.isArray(e)&&!Pt(e);function te(e,r,t=new WeakMap){if(e===r)return!0;if(Je(e)||Je(r))return Object.is(e,r);if(ce(e)&&ce(r))return Object.is(e.getTime(),r.getTime());const i=Object.keys(e),d=Object.keys(r);if(i.length!==d.length)return!1;if(kt(e,i)||kt(r,d))return Object.is(e,r);if(!i.length&&Array.isArray(e)!==Array.isArray(r))return!1;const l=t.get(e);if(l&&l.has(r))return!0;if(l)l.add(r);else{const a=new WeakSet;a.add(r),t.set(e,a)}for(const a of i){const u=e[a];if(!(a in r))return!1;if(a!=="ref"){const v=r[a];if(ce(u)&&ce(v)||(R(u)||Array.isArray(u))&&(R(v)||Array.isArray(v))?!te(u,v,t):!Object.is(u,v))return!1}}return!0}const rs=j.createContext(null);rs.displayName="HookFormContext";var ss=(e,r,t,i,d)=>r?{...t[e],types:{...t[e]&&t[e].types?t[e].types:{},[i]:d||!0}}:{},zt=e=>Array.isArray(e)?e.filter(Boolean):[],Se=e=>Array.isArray(e)?e:[e],xt=()=>{let e=[];return{get observers(){return e},next:d=>{for(const l of e)l.next&&l.next(d)},subscribe:d=>(e.push(d),{unsubscribe:()=>{e=e.filter(l=>l!==d)}}),unsubscribe:()=>{e=[]}}};function Ht(e,r){const t={};for(const i in e)if(e.hasOwnProperty(i)){const d=e[i],l=r[i];if(d&&R(d)&&l){const a=Ht(d,l);R(a)&&(t[i]=a)}else e[i]&&(t[i]=l)}return t}var $=e=>R(e)&&!Object.keys(e).length,rt=e=>e.type==="file",Le=e=>{if(!Pe)return!1;const r=e?e.ownerDocument:0;return e instanceof(r&&r.defaultView?r.defaultView.HTMLElement:HTMLElement)},$t=e=>e.type==="select-multiple",st=e=>e.type==="radio",is=e=>st(e)||_e(e),Ge=e=>Le(e)&&e.isConnected;function as(e,r){const t=r.slice(0,-1).length;let i=0;for(;i<t;){if(B(e)){e=void 0;break}e=e[r[i]],i++}return e}function ns(e){for(const r in e)if(e.hasOwnProperty(r)&&!T(e[r]))return!1;return!0}function q(e,r){if(W(r)&&Object.prototype.hasOwnProperty.call(e,r))return delete e[r],e;const t=Array.isArray(r)?r:Ae(r)?[r]:Ue(r),i=t.length===1?e:as(e,t),d=t.length-1,l=t[d];return i&&delete i[l],d!==0&&(R(i)&&$(i)||Array.isArray(i)&&ns(i))&&q(e,t.slice(0,-1)),e}var os=e=>{for(const r in e)if(X(e[r]))return!0;return!1};function Bt(e){return Array.isArray(e)||R(e)&&!os(e)}function Qe(e,r={}){for(const t in e){const i=e[t];Bt(i)?(r[t]=Array.isArray(i)?[]:{},Qe(i,r[t])):T(i)||(r[t]=!0)}return r}function et(e){if(e!==!1){if(e===!0)return!0;if(Array.isArray(e)){const r=e.map(t=>et(t));return r.some(t=>t!==void 0)?r:void 0}if(R(e)){const r={};for(const t in e){const i=et(e[t]);T(i)||(r[t]=i)}return Object.keys(r).length?r:void 0}}}function ue(e,r,t){t||(t=Qe(r));for(const i in e){const d=e[i];if(Bt(d))T(r)||Je(t[i])?t[i]=Qe(d,Array.isArray(d)?[]:{}):ue(d,B(r)?{}:r[i],t[i]);else{const l=r[i];t[i]=!te(d,l)}}return et(t)||{}}const bt={value:!1,isValid:!1},wt={value:!0,isValid:!0};var jt=e=>{if(Array.isArray(e)){if(e.length>1){const r=e.filter(t=>t&&t.checked&&!t.disabled).map(t=>t.value);return{value:r,isValid:!!r.length}}return e[0].checked&&!e[0].disabled?e[0].attributes&&!T(e[0].attributes.value)?T(e[0].value)||e[0].value===""?wt:{value:e[0].value,isValid:!0}:wt:bt}return bt},Wt=(e,{valueAsNumber:r,valueAsDate:t,setValueAs:i})=>T(e)?e:r?e===""?NaN:e&&+e:t&&W(e)?new Date(e):i?i(e):e;const Vt={isValid:!1,value:null};var Gt=e=>Array.isArray(e)?e.reduce((r,t)=>t&&t.checked&&!t.disabled?{isValid:!0,value:t.value}:r,Vt):Vt;function _t(e){const r=e.ref;return rt(r)?r.files:st(r)?Gt(e.refs).value:$t(r)?[...r.selectedOptions].map(({value:t})=>t):_e(r)?jt(e.refs).value:Wt(T(r.value)?e.ref.value:r.value,e)}var ls=(e,r,t,i)=>{const d={};for(const l of e){const a=m(r,l);a&&S(d,l,a._f)}return{criteriaMode:t,names:[...e],fields:d,shouldUseNativeValidation:i}},Re=e=>e instanceof RegExp,be=e=>T(e)?e:Re(e)?e.source:R(e)?Re(e.value)?e.value.source:e.value:e,Ce=e=>({isOnSubmit:!e||e===Q.onSubmit,isOnBlur:e===Q.onBlur,isOnChange:e===Q.onChange,isOnAll:e===Q.all,isOnTouch:e===Q.onTouched});const At="AsyncFunction";var ds=e=>{if(!e||!e.validate)return!1;if(X(e.validate))return e.validate.constructor.name===At;if(R(e.validate)){for(const r in e.validate)if(e.validate[r].constructor.name===At)return!0}return!1},us=e=>e.mount&&(e.required||e.min||e.max||e.maxLength||e.minLength||e.pattern||e.validate),Ze=(e,r,t)=>{if(t)return!1;if(r.watchAll||r.watch.has(e))return!0;for(const i of r.watch)if(e.startsWith(i)&&e.charAt(i.length)===".")return!0;return!1};const we=(e,r,t,i)=>{for(const d of t||Object.keys(e)){const l=m(e,d);if(l){const{_f:a,...u}=l;if(a){if(a.refs&&a.refs[0]&&r(a.refs[0],d)&&!i)return!0;if(a.ref&&r(a.ref,a.name)&&!i)return!0;if(we(u,r))break}else if(R(u)&&we(u,r))break}}};function Ft(e,r,t){const i=m(e,t);if(i||Ae(t))return{error:i,name:t};const d=t.split(".");for(;d.length;){const l=d.join("."),a=m(r,l),u=m(e,l);if(a&&!Array.isArray(a)&&t!==l)return{name:t};if(u&&u.type)return{name:l,error:u};if(u&&u.root&&u.root.type)return{name:`${l}.root`,error:u.root};d.pop()}return{name:t}}var cs=(e,r,t,i)=>{t(e);const{name:d,...l}=e,a=Object.keys(l);return!a.length||i&&a.length>=Object.keys(r).length||a.find(u=>r[u]===(!i||Q.all))},fs=(e,r,t)=>!e||!r||e===r||Se(e).some(i=>i&&(t?i===r:i.startsWith(r)||r.startsWith(i))),ys=(e,r,t,i,d)=>d.isOnAll?!1:!t&&d.isOnTouch?!(r||e):(t?i.isOnBlur:d.isOnBlur)?!e:(t?i.isOnChange:d.isOnChange)?e:!0,hs=(e,r)=>!zt(m(e,r)).length&&q(e,r),Et=(e,r,t)=>{const i=m(e,t),d=Array.isArray(i)?i:[];return S(d,Ut,r[t]),S(e,t,d),e};function Dt(e,r,t="validate"){if(W(e)||Array.isArray(e)&&e.every(W)||ee(e)&&!e)return{type:t,message:W(e)?e:"",ref:r}}var ve=e=>R(e)&&!Re(e)?e:{value:e,message:""},Mt=async(e,r,t,i,d,l)=>{const{ref:a,refs:u,required:v,maxLength:b,minLength:w,min:V,max:O,pattern:I,validate:A,name:F,valueAsNumber:x,mount:fe}=e._f,E=m(t,F);if(!fe||r.has(F))return{};const C=u?u[0]:a,N=M=>{if(d&&C.reportValidity){const _=ee(M)?"":M||"";u?u.forEach(P=>P.setCustomValidity(_)):C.setCustomValidity(_),C.reportValidity()}},z={},Fe=st(a),Ee=_e(a),qe=Fe||Ee,ye=(x||rt(a))&&T(a.value)&&T(E)||Le(a)&&a.value===""||E===""||Array.isArray(E)&&!E.length,ne=ss.bind(null,F,i,z),pe=(M,_,P,G=J.maxLength,Z=J.minLength)=>{const se=M?_:P;z[F]={type:M?G:Z,message:se,ref:a,...ne(M?G:Z,se)}};if(l?!Array.isArray(E)||!E.length:v&&(!qe&&(ye||B(E))||ee(E)&&!E||Ee&&!jt(u).isValid||Fe&&!Gt(u).isValid)){const{value:M,message:_}=W(v)?{value:!!v,message:v}:ve(v);if(M&&(z[F]={type:J.required,message:_,ref:C,...ne(J.required,_)},!i))return N(_),z}if(!ye&&(!B(V)||!B(O))){let M,_;const P=ve(O),G=ve(V);if(!B(E)&&!isNaN(E)){const Z=a.valueAsNumber||E&&+E;B(P.value)||(M=Z>P.value),B(G.value)||(_=Z<G.value)}else{const Z=a.valueAsDate||new Date(E),se=ze=>new Date(new Date().toDateString()+" "+ze),K=a.type=="time",he=a.type=="week";W(P.value)&&E&&(M=K?se(E)>se(P.value):he?E>P.value:Z>new Date(P.value)),W(G.value)&&E&&(_=K?se(E)<se(G.value):he?E<G.value:Z<new Date(G.value))}if((M||_)&&(pe(!!M,P.message,G.message,J.max,J.min),!i))return N(z[F].message),z}if((b||w)&&!ye&&(W(E)||l&&Array.isArray(E))){const M=ve(b),_=ve(w),P=!B(M.value)&&E.length>+M.value,G=!B(_.value)&&E.length<+_.value;if((P||G)&&(pe(P,M.message,_.message),!i))return N(z[F].message),z}if(I&&!ye&&W(E)){const{value:M,message:_}=ve(I);if(Re(M)&&!E.match(M)&&(z[F]={type:J.pattern,message:_,ref:a,...ne(J.pattern,_)},!i))return N(_),z}if(A){if(X(A)){const M=await A(E,t),_=Dt(M,C);if(_&&(z[F]={..._,...ne(J.validate,_.message)},!i))return N(_.message),z}else if(R(A)){let M={};for(const _ in A){if(!$(M)&&!i)break;const P=Dt(await A[_](E,t),C,_);P&&(M={...P,...ne(_,P.message)},N(P.message),i&&(z[F]=M))}if(!$(M)&&(z[F]={ref:C,...M},!i))return z}}return N(!0),z};const gs={mode:Q.onSubmit,reValidateMode:Q.onChange,shouldFocusError:!0},Ye="form",Zt={submitCount:0,isDirty:!1,isReady:!1,isValidating:!1,isSubmitted:!1,isSubmitting:!1,isSubmitSuccessful:!1,isValid:!1,touchedFields:{},dirtyFields:{},validatingFields:{}};function ms(e={}){let r={...gs,...e},t={...U(Zt),isLoading:X(r.defaultValues),errors:r.errors||{},disabled:r.disabled||!1},i={},d=R(r.defaultValues)||R(r.values)?U(r.defaultValues||r.values)||{}:{},l=r.shouldUnregister?{}:U(d),a={action:!1,mount:!1,watch:!1,keepIsValid:!1},u={mount:new Set,disabled:new Set,unMount:new Set,array:new Set,watch:new Set,registerName:new Set},v,b=0,w=0,V=Ce(r.mode),O=Ce(r.reValidateMode);const I={isDirty:!1,dirtyFields:!1,validatingFields:!1,touchedFields:!1,isValidating:!1,isValid:!1,errors:!1},A={...I};let F={...A};const x={array:xt(),state:xt()},fe=r.criteriaMode===Q.all,E=s=>n=>{clearTimeout(b),b=setTimeout(s,n)},C=async s=>{if(!a.keepIsValid&&!r.disabled&&(A.isValid||F.isValid||s)){let n;r.resolver?(n=$((await _()).errors),N()):n=await Z({fields:i,onlyCheckValid:!0,eventType:me.VALID}),n!==t.isValid&&x.state.next({isValid:n})}},N=(s,n)=>{!r.disabled&&(A.isValidating||A.validatingFields||F.isValidating||F.validatingFields)&&((s||Array.from(u.mount)).forEach(o=>{o&&(n?S(t.validatingFields,o,n):q(t.validatingFields,o))}),x.state.next({validatingFields:t.validatingFields,isValidating:!$(t.validatingFields)}))},z=()=>{t.dirtyFields=ue(d,l)},Fe=(s,n=[],o,c,f=!0,h=!0)=>{if(c&&o&&!r.disabled){if(a.action=!0,h&&Array.isArray(m(i,s))){const y=o(m(i,s),c.argA,c.argB);f&&S(i,s,y)}if(h&&Array.isArray(m(t.errors,s))){const y=o(m(t.errors,s),c.argA,c.argB);f&&S(t.errors,s,y),hs(t.errors,s)}if((A.touchedFields||F.touchedFields)&&h&&Array.isArray(m(t.touchedFields,s))){const y=o(m(t.touchedFields,s),c.argA,c.argB);f&&S(t.touchedFields,s,y)}(A.dirtyFields||F.dirtyFields)&&z(),x.state.next({name:s,isDirty:K(s,n),dirtyFields:t.dirtyFields,errors:t.errors,isValid:t.isValid})}else S(l,s,n)},Ee=(s,n)=>{S(t.errors,s,n),t.errors={...t.errors},x.state.next({errors:t.errors})},qe=s=>{t.errors=s,x.state.next({errors:t.errors,isValid:!1})},ye=s=>{const n=Ae(s)?[s]:Ue(s);let o=l,c=d;for(let f=0;f<n.length-1;f++){const h=n[f];if(o=B(o)?o:o[h],c=B(c)?c:c[h],o===null&&c!==null)return!0}return!1},ne=(s,n,o,c)=>{const f=m(i,s);if(f){if(ye(s))return;const h=T(m(l,s)),y=m(l,s,T(o)?m(d,s):o);T(y)||c&&c.defaultChecked||n?S(l,s,n?y:_t(f._f)):He(s,y),a.mount&&!a.action&&(C(),h&&t.isDirty&&(A.isDirty||F.isDirty)&&(K()||(t.isDirty=!1,x.state.next({...t}))),e.shouldUnregister&&h&&!T(m(l,s))&&Ze(s,u)&&(a.watch=!0))}},pe=(s,n,o,c,f)=>{let h=!1,y=!1;const g={name:s};if(!r.disabled){if(!o||c){const p=te(m(d,s),n);(A.isDirty||F.isDirty)&&(y=t.isDirty,t.isDirty=g.isDirty=!p||K(),h=y!==g.isDirty),y=!!m(t.dirtyFields,s),p!==t.isDirty?t.dirtyFields=ue(d,l):p?q(t.dirtyFields,s):S(t.dirtyFields,s,!0),g.dirtyFields=t.dirtyFields,h=h||(A.dirtyFields||F.dirtyFields)&&y!==!p}if(o){const p=m(t.touchedFields,s);p||(S(t.touchedFields,s,o),g.touchedFields=t.touchedFields,h=h||(A.touchedFields||F.touchedFields)&&p!==o)}h&&f&&x.state.next(g)}return h?g:{}},M=(s,n,o,c)=>{const f=m(t.errors,s),h=(A.isValid||F.isValid)&&ee(n)&&t.isValid!==n;if(r.delayError&&o?(v=E(()=>Ee(s,o)),v(r.delayError)):(clearTimeout(b),v=null,o?S(t.errors,s,o):q(t.errors,s),t.errors={...t.errors}),(o?!te(f,o):f)||!$(c)||h){const y={...c,...h&&ee(n)?{isValid:n}:{},errors:t.errors,name:s};t={...t,...y},x.state.next(y)}},_=async s=>(N(s,!0),await r.resolver(l,r.context,ls(s||u.mount,i,r.criteriaMode,r.shouldUseNativeValidation))),P=async s=>{const{errors:n}=await _(s);if(N(s),s){for(const o of s){const c=m(n,o);c?u.array.has(o)&&R(c)&&!Object.keys(c).some(f=>!Number.isNaN(Number(f)))?Et(t.errors,{[o]:c},o):S(t.errors,o,c):q(t.errors,o)}t.errors={...t.errors}}else t.errors=n;return n},G=async({name:s,eventType:n})=>{if(e.validate){const o=await e.validate({formValues:l,formState:t,name:s,eventType:n});if(R(o))for(const c in o){const f=o[c];f&&De(`${Ye}.${c}`,{message:W(f.message)?f.message:"",type:f.type||J.validate})}else W(o)||!o?De(Ye,{message:o||"",type:J.validate}):dt(Ye);return o}return!0},Z=async({fields:s,onlyCheckValid:n,name:o,eventType:c,context:f={valid:!0,runRootValidation:!1}})=>{if(e.validate&&(f.runRootValidation=!0,!await G({name:o,eventType:c})&&(f.valid=!1,n)))return f.valid;for(const h in s){const y=s[h];if(y){const{_f:g,...p}=y;if(g){const L=u.array.has(g.name),Y=y._f&&ds(y._f),ge=A.validatingFields||A.isValidating||F.validatingFields||F.isValidating;Y&&ge&&N([g.name],!0);const ie=await Mt(y,u.disabled,l,fe,r.shouldUseNativeValidation&&!n,L);if(Y&&ge&&N([g.name]),ie[g.name]&&(f.valid=!1,n)||(!n&&(m(ie,g.name)?L?Et(t.errors,ie,g.name):S(t.errors,g.name,ie[g.name]):q(t.errors,g.name)),e.shouldUseNativeValidation&&ie[g.name]))break}!$(p)&&await Z({context:f,onlyCheckValid:n,fields:p,name:h,eventType:c})}}return f.valid},se=()=>{for(const s of u.unMount){const n=m(i,s);n&&(n._f.refs?n._f.refs.every(o=>!Ge(o)):!Ge(n._f.ref))&&Be(s)}u.unMount=new Set},K=(s,n)=>!r.disabled&&(s&&n&&S(l,s,n),!te(a.mount?l:d,d)),he=(s,n,o)=>ts(s,u,{...a.mount?l:T(n)?d:W(s)?{[s]:n}:n},o,n),ze=s=>zt(m(a.mount?l:d,s,r.shouldUnregister?m(d,s,[]):[])),He=(s,n,o={},c=!1,f=!1)=>{const h=m(i,s);let y=n;if(h){const g=h._f;g&&(!g.disabled&&S(l,s,Wt(n,g)),y=Le(g.ref)&&B(n)?"":n,$t(g.ref)?[...g.ref.options].forEach(p=>p.selected=y.includes(p.value)):g.refs?_e(g.ref)?g.refs.forEach(p=>{(!p.defaultChecked||!p.disabled)&&(Array.isArray(y)?p.checked=!!y.find(L=>L===p.value):p.checked=y===p.value||!!y)}):g.refs.forEach(p=>p.checked=p.value===y):rt(g.ref)?g.ref.value="":(g.ref.value=y,!g.ref.type&&!f&&x.state.next({name:s,values:c?l:U(l)})))}(o.shouldDirty||o.shouldTouch)&&pe(s,y,o.shouldTouch,o.shouldDirty,!f),o.shouldValidate&&$e(s)},it=(s,n,o,c=!1,f=!1)=>{for(const h in n){if(!n.hasOwnProperty(h))return;const y=n[h],g=s+"."+h,p=m(i,g);(u.array.has(s)||R(y)||p&&!p._f)&&!ce(y)?it(g,y,o,c,f):He(g,y,o,c,f)}},at=(s,n,o,c,f=!1)=>{const h=m(i,s),y=u.array.has(s),g=c?n:U(n),p=m(l,s),L=te(p,g);if(L||S(l,s,g),y)x.array.next({name:s,values:c?l:U(l)}),(A.isDirty||A.dirtyFields||F.isDirty||F.dirtyFields)&&o.shouldDirty&&(z(),f||x.state.next({name:s,dirtyFields:t.dirtyFields,isDirty:K(s,g)}));else{const Y=Array.isArray(g)&&!g.length||$(g);!h||h._f||B(g)||Y?He(s,g,o,c,f):it(s,g,o,c,f)}if(!L&&!f){const Y=Ze(s,u),ge=c?l:U(l);x.state.next({...Y&&t,name:a.mount||Y?s:void 0,values:ge})}},ke=(s,n,o={})=>at(s,n,o,!1),Yt=(s,n={})=>{const o=X(s)?s(l):s;if(!te(l,o)){l={...l,...o};for(const c of u.mount)at(c,m(o,c),n,!0,!0);x.state.next({...t,name:void 0,type:void 0,...w?{values:l}:{}}),n.shouldValidate&&C()}},nt=async s=>{a.mount=!0;const n=s.target;let o=n.name,c=!0;const f=m(i,o),h=y=>{c=Number.isNaN(y)||ce(y)&&isNaN(y.getTime())||te(y,m(l,o,y))};if(f){let y,g;const p=n.type?_t(f._f):Zr(s),L=s.type===me.BLUR||s.type===me.FOCUS_OUT,Y=!us(f._f)&&!e.validate&&!r.resolver&&!m(t.errors,o)&&!f._f.deps,ge=Y||ys(L,m(t.touchedFields,o),t.isSubmitted,O,V),ie=Ze(o,u,L);S(l,o,p),L?(!n||!n.readOnly)&&(f._f.onBlur&&f._f.onBlur(s),v&&v(0)):f._f.onChange&&f._f.onChange(s);const xe=pe(o,p,L),sr=!$(xe)||ie;if(!L&&x.state.next({name:o,type:s.type,...w?{values:U(l)}:{}}),ge)return(!Y||!t.isValid)&&(A.isValid||F.isValid)&&(r.mode==="onBlur"?L&&C():L||C()),sr&&x.state.next({name:o,...ie?{}:xe});if(!r.resolver&&e.validate&&await G({name:o,eventType:s.type}),!L&&ie&&x.state.next({...t}),r.resolver){const{errors:mt}=await _([o]);if(N([o]),h(p),!c){!$(xe)&&x.state.next(xe);return}const ir=Ft(t.errors,i,o),vt=Ft(mt,i,ir.name||o);y=vt.error,o=vt.name,g=$(mt)}else N([o],!0),y=(await Mt(f,u.disabled,l,fe,r.shouldUseNativeValidation))[o],N([o]),h(p),c&&(y?g=!1:(A.isValid||F.isValid)&&(g=await Z({fields:i,onlyCheckValid:!0,name:o,eventType:s.type})));c&&(f._f.deps&&(!Array.isArray(f._f.deps)||f._f.deps.length>0)&&$e(f._f.deps),M(o,g,y,xe))}},ot=(s,n)=>{if(m(t.errors,n)&&s.focus)return s.focus(),1},$e=async(s,n={})=>{let o,c;const f=Se(s);if(r.resolver){const h=await P(T(s)?s:f);o=$(h),c=s?!f.some(y=>m(h,y)):o}else s?(c=(await Promise.all(f.map(async h=>{const y=m(i,h);return await Z({fields:y&&y._f?{[h]:y}:y,eventType:me.TRIGGER})}))).every(Boolean),!(!c&&!t.isValid)&&C()):c=o=await Z({fields:i,name:s,eventType:me.TRIGGER});return x.state.next({...!W(s)||(A.isValid||F.isValid)&&o!==t.isValid?{}:{name:s},...r.resolver||!s?{isValid:o}:{},errors:t.errors}),n.shouldFocus&&!c&&we(i,ot,s?f:u.mount),c},Kt=(s,n)=>{let o={...a.mount?l:d};return n&&(o=Ht(n.dirtyFields?t.dirtyFields:t.touchedFields,o)),T(s)?o:W(s)?m(o,s):s.map(c=>m(o,c))},lt=(s,n)=>({invalid:!!m((n||t).errors,s),isDirty:!!m((n||t).dirtyFields,s),error:m((n||t).errors,s),isValidating:!!m(t.validatingFields,s),isTouched:!!m((n||t).touchedFields,s)}),dt=s=>{const n=s?Se(s):void 0;n==null||n.forEach(o=>q(t.errors,o)),n?n.forEach(o=>{x.state.next({name:o,errors:t.errors})}):x.state.next({errors:{}})},De=(s,n,o)=>{const c=(m(i,s,{_f:{}})._f||{}).ref,f=m(t.errors,s)||{},{ref:h,message:y,type:g,...p}=f;S(t.errors,s,{...p,...n,ref:c}),x.state.next({name:s,errors:t.errors,isValid:!1}),o&&o.shouldFocus&&c&&c.focus&&c.focus()},Xt=(s,n)=>{if(X(s)){w++;const{unsubscribe:o}=x.state.subscribe({next:f=>"values"in f&&s(f.values||he(void 0,n),f)});let c=!1;return{unsubscribe:()=>{c||(c=!0,w--,o())}}}return he(s,n,!0)},ut=s=>{var n;const o=!!(!((n=s.formState)===null||n===void 0)&&n.values);o&&w++;const{unsubscribe:c}=x.state.subscribe({next:h=>{if(fs(s.name,h.name,s.exact)&&cs(h,s.formState||A,rr,s.reRenderRoot)){const y={...l};s.callback({values:y,...t,...h,defaultValues:d})}}});if(!o)return c;let f=!1;return()=>{f||(f=!0,w--,c())}},Jt=s=>(a.mount=!0,F={...F,...s.formState},ut({...s,formState:{...I,...s.formState}})),Be=(s,n={})=>{for(const o of s?Se(s):u.mount)u.mount.delete(o),u.array.delete(o),n.keepValue||(q(i,o),q(l,o)),!n.keepError&&q(t.errors,o),!n.keepDirty&&q(t.dirtyFields,o),!n.keepTouched&&q(t.touchedFields,o),!n.keepIsValidating&&q(t.validatingFields,o),!r.shouldUnregister&&!n.keepDefaultValue&&q(d,o);x.state.next({values:U(l)}),x.state.next({...t,...n.keepDirty?{isDirty:K()}:{}}),!n.keepIsValid&&C()},ct=({disabled:s,name:n})=>{if(ee(s)&&a.mount||s||u.disabled.has(n)){const f=u.disabled.has(n)!==!!s;s?u.disabled.add(n):u.disabled.delete(n),f&&a.mount&&!a.action&&C()}},je=(s,n={})=>{let o=m(i,s);const c=ee(n.disabled)||ee(r.disabled),f=!u.registerName.has(s)&&o&&o._f&&!o._f.mount;return S(i,s,{...o||{},_f:{...o&&o._f?o._f:{ref:{name:s}},name:s,mount:!0,...n}}),u.mount.add(s),o&&!f?ct({disabled:ee(n.disabled)?n.disabled:r.disabled,name:s}):ne(s,!0,n.value),{...c?{disabled:n.disabled||r.disabled}:{},...r.progressive?{required:!!n.required,min:be(n.min),max:be(n.max),minLength:be(n.minLength),maxLength:be(n.maxLength),pattern:be(n.pattern)}:{},name:s,onChange:nt,onBlur:nt,ref:h=>{if(h){u.registerName.add(s),je(s,n),u.registerName.delete(s),o=m(i,s);const y=T(h.value)&&h.querySelectorAll&&h.querySelectorAll("input,select,textarea")[0]||h,g=is(y),p=o._f.refs||[];if(g?p.find(L=>L===y):y===o._f.ref)return;S(i,s,{_f:{...o._f,...g?{refs:[...p.filter(Ge),y,...Array.isArray(m(d,s))?[{}]:[]],ref:{type:y.type,name:s}}:{ref:y}}}),ne(s,!1,void 0,y)}else o=m(i,s,{}),o._f&&(o._f.mount=!1),(r.shouldUnregister||n.shouldUnregister)&&!(Yr(u.array,s)&&a.action)&&u.unMount.add(s)}}},We=()=>r.shouldFocusError&&!r.shouldUseNativeValidation&&we(i,ot,u.mount),Qt=s=>{ee(s)&&(x.state.next({disabled:s}),we(i,(n,o)=>{const c=m(i,o);c&&(n.disabled=c._f.disabled||s,Array.isArray(c._f.refs)&&c._f.refs.forEach(f=>{f.disabled=c._f.disabled||s}))},0,!1))},ft=(s,n)=>async o=>{let c;o&&(o.preventDefault&&o.preventDefault(),o.persist&&o.persist());let f=U(l);if(x.state.next({isSubmitting:!0}),r.resolver){const{errors:h,values:y}=await _();N(),t.errors=h,f=U(y)}else await Z({fields:i,eventType:me.SUBMIT});if(u.disabled.size)for(const h of u.disabled)q(f,h);if(q(t.errors,Ut),$(t.errors)){x.state.next({errors:{}});try{await s(f,o)}catch(h){c=h}}else n&&await n({...t.errors},o),We(),setTimeout(We);if(x.state.next({isSubmitted:!0,isSubmitting:!1,isSubmitSuccessful:$(t.errors)&&!c,submitCount:t.submitCount+1,errors:t.errors}),c)throw c},er=(s,n={})=>{m(i,s)&&(T(n.defaultValue)?ke(s,U(m(d,s))):(ke(s,n.defaultValue),S(d,s,U(n.defaultValue))),n.keepTouched||q(t.touchedFields,s),n.keepDirty||(q(t.dirtyFields,s),t.isDirty=n.defaultValue?K(s,U(m(d,s))):K()),n.keepError||(q(t.errors,s),A.isValid&&C()),x.state.next({...t}))},yt=(s,n={})=>{const o=s?U(s):d,c=U(o),f=$(s),h=c;if(n.keepDefaultValues||(d=o),!n.keepValues){if(n.keepDirtyValues){const y=new Set([...u.mount,...Object.keys(ue(d,l))]);for(const g of Array.from(y)){const p=m(t.dirtyFields,g),L=m(l,g),Y=m(h,g);p&&!T(L)?S(h,g,L):!p&&!T(Y)&&ke(g,Y)}}else{if(Pe&&T(s))for(const y of u.mount){const g=m(i,y);if(g&&g._f){const p=Array.isArray(g._f.refs)?g._f.refs[0]:g._f.ref;if(Le(p)){const L=p.closest("form");if(L){L.reset();break}}}}if(n.keepFieldsRef)for(const y of u.mount)ke(y,m(h,y));else i={}}if(r.shouldUnregister){if(l=n.keepDefaultValues?U(d):{},n.keepFieldsRef)for(const y of u.mount)S(l,y,m(h,y))}else l=U(h);x.array.next({values:{...h}}),x.state.next({values:{...h}})}u={mount:n.keepDirtyValues?u.mount:new Set,unMount:new Set,array:new Set,registerName:new Set,disabled:new Set,watch:new Set,watchAll:!1,focus:""},a.mount=!A.isValid||!!n.keepIsValid||!!n.keepDirtyValues||!r.shouldUnregister&&!$(h),a.watch=!!r.shouldUnregister,a.keepIsValid=!!n.keepIsValid,a.action=!1,n.keepErrors||(t.errors={}),x.state.next({submitCount:n.keepSubmitCount?t.submitCount:0,isDirty:f?!1:n.keepDirty?t.isDirty:n.keepValues?K():!!(n.keepDefaultValues&&!te(s,d)),isSubmitted:n.keepIsSubmitted?t.isSubmitted:!1,dirtyFields:f?{}:n.keepDirtyValues?n.keepDefaultValues&&l?ue(d,l):t.dirtyFields:n.keepDefaultValues&&s?ue(d,s):n.keepDirty?t.dirtyFields:{},touchedFields:n.keepTouched?t.touchedFields:{},errors:n.keepErrors?t.errors:{},isSubmitSuccessful:n.keepIsSubmitSuccessful?t.isSubmitSuccessful:!1,isSubmitting:!1,defaultValues:d})},ht=(s,n)=>yt(X(s)?s(l):s,{...r.resetOptions,...n}),tr=(s,n={})=>{const o=m(i,s),c=o&&o._f;if(c){const f=c.refs?c.refs[0]:c.ref;f.focus&&setTimeout(()=>{f.focus(),n.shouldSelect&&X(f.select)&&f.select()})}},rr=s=>{t={...t,...s}},gt={control:{register:je,unregister:Be,getFieldState:lt,handleSubmit:ft,setError:De,_subscribe:ut,_runSchema:_,_updateIsValidating:N,_focusError:We,_getWatch:he,_getDirty:K,_setValid:C,_setFieldArray:Fe,_setDisabledField:ct,_setErrors:qe,_getFieldArray:ze,_reset:yt,_resetDefaultValues:()=>X(r.defaultValues)&&r.defaultValues().then(s=>{ht(s,r.resetOptions),x.state.next({isLoading:!1})}),_removeUnmounted:se,_disableForm:Qt,_subjects:x,_proxyFormState:A,get _fields(){return i},get _formValues(){return l},get _state(){return a},set _state(s){a=s},get _defaultValues(){return d},get _names(){return u},set _names(s){u=s},get _formState(){return t},get _options(){return r},set _options(s){r={...r,...s},V=Ce(r.mode),O=Ce(r.reValidateMode)}},subscribe:Jt,trigger:$e,register:je,handleSubmit:ft,watch:Xt,setValue:ke,setValues:Yt,getValues:Kt,reset:ht,resetField:er,resetDefaultValues:(s,n={})=>{if(d=U(s),!n.keepDirty){const o=ue(d,l);t.dirtyFields=o,t.isDirty=!$(o)}n.keepIsValid||C(),x.state.next({...t,defaultValues:d})},clearErrors:dt,unregister:Be,setError:De,setFocus:tr,getFieldState:lt};return{...gt,formControl:gt}}function fi(e={}){const r=j.useRef(void 0),t=j.useRef(void 0),i=j.useRef(e.formControl),[d,l]=j.useState(()=>({...U(Zt),isLoading:X(e.defaultValues),errors:e.errors||{},disabled:e.disabled||!1,defaultValues:X(e.defaultValues)?void 0:e.defaultValues}));if(!r.current||e.formControl&&i.current!==e.formControl)if(i.current=e.formControl,e.formControl)r.current={...e.formControl,formState:d},e.defaultValues&&!X(e.defaultValues)&&e.formControl.reset(e.defaultValues,e.resetOptions);else{const{formControl:u,...v}=ms(e);r.current={...v,formState:d}}const a=r.current.control;return a._options=e,es(()=>{const u=a._subscribe({formState:a._proxyFormState,callback:()=>l({...a._formState,defaultValues:a._defaultValues}),reRenderRoot:!0});return l(v=>({...v,isReady:!0})),a._formState.isReady=!0,u},[a]),j.useEffect(()=>a._disableForm(e.disabled),[a,e.disabled]),j.useEffect(()=>{e.mode&&(a._options.mode=e.mode),e.reValidateMode&&(a._options.reValidateMode=e.reValidateMode)},[a,e.mode,e.reValidateMode]),j.useEffect(()=>{e.errors&&(a._setErrors(e.errors),a._focusError())},[a,e.errors]),j.useEffect(()=>{e.shouldUnregister&&a._subjects.state.next({values:a._getWatch()})},[a,e.shouldUnregister]),j.useEffect(()=>{if(a._proxyFormState.isDirty){const u=a._getDirty();u!==d.isDirty&&a._subjects.state.next({isDirty:u})}},[a,d.isDirty]),j.useEffect(()=>{var u;e.values&&!te(e.values,t.current)?(a._reset(e.values,{keepFieldsRef:!0,...a._options.resetOptions}),!((u=a._options.resetOptions)===null||u===void 0)&&u.keepIsValid||a._setValid(),t.current=e.values,l(v=>({...v}))):a._resetDefaultValues()},[a,e.values]),j.useEffect(()=>{a._state.mount||(a._setValid(),a._state.mount=!0),a._state.watch&&(a._state.watch=!1,a._subjects.state.next({...a._formState})),a._removeUnmounted()}),r.current.formState=j.useMemo(()=>Qr(d,a),[a,d]),r.current}export{ws as A,Ks as B,_s as C,Zs as D,Ms as E,Os as F,Ss as G,Ls as H,Rs as I,Ts as J,di as K,Us as L,js as M,xs as N,Ys as P,ei as S,ii as T,oi as U,li as V,ui as W,ci as X,ti as a,Vs as b,Es as c,ni as d,Ws as e,Js as f,$s as g,Bs as h,zs as i,Cs as j,qs as k,Fs as l,As as m,Ns as n,Qs as o,Hs as p,Gs as q,Is as r,Ps as s,Xs as t,fi as u,ai as v,Ds as w,si as x,ri as y,bs as z};
