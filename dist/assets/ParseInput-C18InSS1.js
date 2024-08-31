import{_ as V,r as P,o as X,a as s,c as d,b as t,t as a,d as E,e as p,F as C,p as W,f as q,g as k,n as _,h as A,i as j,u as $,j as J,w as Y,B as z,k as H,l as Z,L as G,C as tt,P as et,T as at,m as st}from"./index-NlZmHyiH.js";const f=v=>(W("data-v-72c9666c"),v=v(),q(),v),dt={class:"font-bold text-lg"},nt={class:"text-neutral-500"},ot={class:"font-light"},lt={key:0,class:"error"},it=f(()=>t("br",null,null,-1)),rt={class:"font-light"},ct=["width","height"],ut=f(()=>t("summary",null,"Model",-1)),vt=f(()=>t("td",null,"Manufacturer",-1)),mt=f(()=>t("td",null,"Version",-1)),bt=f(()=>t("td",null,"Encoding",-1)),ht=f(()=>t("td",null,"Bits Per Pixel",-1)),gt=f(()=>t("td",null,"bits per pixel",-1)),pt=f(()=>t("td",null,"Image Dimensions",-1)),ft=f(()=>t("td",null,"pixels",-1)),_t=f(()=>t("td",null,"Resolution",-1)),Ct=f(()=>t("td",null,"DPI",-1)),wt=f(()=>t("td",null,"Color Palette",-1)),yt=f(()=>t("td",null,"Bytes Per Line",-1)),Et=f(()=>t("td",null,"Number of bytes to hold one scan line",-1)),At=f(()=>t("td",null,"Palette Info",-1)),Ot=f(()=>t("td",null,"Number of Planes",-1)),Tt=f(()=>t("td",null,"Number of color planes",-1)),It={__name:"LogoComponent",props:["aea-model"],setup(v){const o=v,c=P(null);console.log("LogoComponent",o.aeaModel);function m(n,h){const L=h.getContext("2d");h.width=n.width,h.height=n.height;const O=L.createImageData(n.width,n.height);let B=0;for(let R=0;R<n.height;R++)for(let x=0;x<n.width;x++){const l=n.getPixelColor(x,R);O.data[B++]=l.r,O.data[B++]=l.g,O.data[B++]=l.b,O.data[B++]=255}L.putImageData(O,0,0)}X(()=>{console.log(o.aeaModel.image.header),m(o.aeaModel.image,c.value)});function i(){return o.aeaModel.image.header}const u=n=>n===10?"ZSoft Corporation":"Unknown",r=n=>({0:"Version 2.5 of PC Paintbrush",2:"Version 2.8 w/ palette information",3:"Version 2.8 w/o palette information",4:"PC Paintbrush for Windows",5:"Version 3.0 and > of PC Paintbrush and PC Paintbrush+, includes Publisher's Paintbrush"})[n]||"Unknown version",b=n=>n===1?"RLE encoding":"Unknown encoding",w=n=>n===1?"Color/BW":"Grayscale";return(n,h)=>(s(),d(C,null,[t("h2",dt,"Logo #"+a(o.aeaModel.id),1),t("div",nt,[E(" Length Specified: "),t("span",ot,a(o.aeaModel.length),1),o.aeaModel.length!==o.aeaModel.image.raw.length?(s(),d("strong",lt," (DOES NOT MATCH ACTUAL LENGTH)")):p("",!0),it,E(" Hex Length: "),t("span",rt,a(o.aeaModel.image.raw.length)+" ("+a(o.aeaModel.image.raw.length/2)+" bytes)",1)]),t("canvas",{style:{"max-width":"100%"},ref_key:"theCanvas",ref:c,width:o.aeaModel.width,height:o.aeaModel.height},null,8,ct),t("details",null,[ut,t("table",null,[t("tbody",null,[t("tr",null,[vt,t("td",null,a(i().manufacturer),1),t("td",null,a(u(i().manufacturer)),1)]),t("tr",null,[mt,t("td",null,a(i().version),1),t("td",null,a(r(i().version)),1)]),t("tr",null,[bt,t("td",null,a(i().encoding),1),t("td",null,a(b(i().encoding)),1)]),t("tr",null,[ht,t("td",null,a(i().bitsPerPixel),1),gt]),t("tr",null,[pt,t("td",null,a(`${i().xMax-i().xMin+1} x ${i().yMax-i().yMin+1}`),1),ft]),t("tr",null,[_t,t("td",null,a(`${i().hDpi} x ${i().vDpi}`),1),Ct]),t("tr",null,[wt,t("td",null,a(i().colormap.length),1),t("td",null,a(`${i().colormap.length/3} colors`),1)]),t("tr",null,[yt,t("td",null,a(i().bytesPerLine),1),Et]),t("tr",null,[At,t("td",null,a(i().paletteInfo),1),t("td",null,a(w(i().paletteInfo)),1)]),t("tr",null,[Ot,t("td",null,a(i().nPlanes),1),Tt])])])])],64))}},Mt=V(It,[["__scopeId","data-v-72c9666c"]]),kt="data:image/png;base64,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",Q=v=>(W("data-v-23608b92"),v=v(),q(),v),Bt={class:"font-bold text-lg"},xt={class:"pectab-container"},Rt=j('<div class="numbers-container" data-v-23608b92><div class="number" data-v-23608b92>1</div><div class="number" data-v-23608b92>2</div><div class="number" data-v-23608b92>3</div><div class="number" data-v-23608b92>4</div><div class="number" data-v-23608b92>5</div><div class="number" data-v-23608b92>6</div><div class="number" data-v-23608b92>7</div><div class="number" data-v-23608b92>8</div><div class="number" data-v-23608b92>9</div><div class="number" data-v-23608b92>10</div><div class="number" data-v-23608b92>11</div><div class="number" data-v-23608b92>12</div><div class="number" data-v-23608b92>13</div><div class="number" data-v-23608b92>14</div><div class="number" data-v-23608b92>15</div><div class="number" data-v-23608b92>16</div><div class="number" data-v-23608b92>17</div><div class="number" data-v-23608b92>18</div><div class="number" data-v-23608b92>19</div><div class="number" data-v-23608b92>20</div><div class="number" data-v-23608b92>21</div><div class="number" data-v-23608b92>22</div><div class="number" data-v-23608b92>23</div><div class="number" data-v-23608b92>24</div><div class="number" data-v-23608b92>25</div><div class="number" data-v-23608b92>26</div><div class="number" data-v-23608b92>27</div><div class="number" data-v-23608b92>28</div><div class="number" data-v-23608b92>29</div><div class="number" data-v-23608b92>30</div><div class="number" data-v-23608b92>31</div><div class="number" data-v-23608b92>32</div><div class="number" data-v-23608b92>33</div><div class="number" data-v-23608b92>34</div><div class="number" data-v-23608b92>35</div><div class="number" data-v-23608b92>36</div><div class="number" data-v-23608b92>37</div><div class="number" data-v-23608b92>38</div><div class="number" data-v-23608b92>39</div><div class="number" data-v-23608b92>40</div><div class="number" data-v-23608b92>41</div><div class="number" data-v-23608b92>42</div><div class="number" data-v-23608b92>43</div><div class="number" data-v-23608b92>44</div><div class="number" data-v-23608b92>45</div><div class="number" data-v-23608b92>46</div><div class="number" data-v-23608b92>47</div><div class="number" data-v-23608b92>48</div><div class="number" data-v-23608b92>49</div><div class="number" data-v-23608b92>50</div><div class="number" data-v-23608b92>51</div><div class="number" data-v-23608b92>52</div><div class="number" data-v-23608b92>53</div><div class="number" data-v-23608b92>54</div><div class="number" data-v-23608b92>55</div><div class="number" data-v-23608b92>56</div><div class="number" data-v-23608b92>57</div><div class="number" data-v-23608b92>58</div><div class="number" data-v-23608b92>59</div><div class="number" data-v-23608b92>60</div><div class="number" data-v-23608b92>61</div><div class="number" data-v-23608b92>62</div><div class="number" data-v-23608b92>63</div><div class="number" data-v-23608b92>64</div><div class="number" data-v-23608b92>65</div><div class="number" data-v-23608b92>66</div><div class="number" data-v-23608b92>67</div><div class="number" data-v-23608b92>68</div><div class="number" data-v-23608b92>69</div><div class="number" data-v-23608b92>70</div><div class="number" data-v-23608b92>71</div><div class="number" data-v-23608b92>72</div></div>',1),Pt={class:"bp-container"},Vt=j('<div class="letters-container" data-v-23608b92><div class="letter" data-v-23608b92>A</div><div class="letter" data-v-23608b92>B</div><div class="letter" data-v-23608b92>C</div><div class="letter" data-v-23608b92>D</div><div class="letter" data-v-23608b92>E</div><div class="letter" data-v-23608b92>F</div><div class="letter" data-v-23608b92>G</div><div class="letter" data-v-23608b92>H</div><div class="letter" data-v-23608b92>I</div><div class="letter" data-v-23608b92>J</div><div class="letter" data-v-23608b92>K</div><div class="letter" data-v-23608b92>L</div><div class="letter" data-v-23608b92>M</div><div class="letter" data-v-23608b92>N</div><div class="letter" data-v-23608b92>O</div><div class="letter" data-v-23608b92>P</div><div class="letter" data-v-23608b92>Q</div><div class="letter" data-v-23608b92>R</div></div>',1),St={class:"boarding-pass"},Lt=Q(()=>t("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 1404 630"},[t("defs",null,[t("pattern",{id:"grid",width:"19.5",height:"35",patternUnits:"userSpaceOnUse"},[t("path",{d:"M 19.5 0 L 0 0 0 35",fill:"none",stroke:"black","stroke-width":"1","stroke-dasharray":"2,2"})])]),t("rect",{width:"100%",height:"100%",fill:"url(#grid)"})],-1)),Wt=["title"],qt={class:"rounded bg-black px-0.5"},Jt=Q(()=>t("summary",null,"Model",-1)),Nt={__name:"PectabComponent",props:["aea-model"],setup(v){const o=v;console.log("PectabComponent",o.aeaModel);function c(){return"#"+Math.floor(Math.random()*16777215).toString(16).padStart(6,"0")}function m(i,u){const r=i.length||1;return{"background-color":c()+"66",width:`calc(${r} * var(--width-pct))`,left:`calc(${parseFloat(u[1])-1} * var(--width-pct))`,top:`calc(${u[0].charCodeAt(0)-65} * var(--height-pct))`}}return(i,u)=>(s(),d(C,null,[t("h2",Bt,"Pectab - Format: "+a(o.aeaModel.format)+" / Version: "+a(o.aeaModel.version),1),t("div",xt,[Rt,t("div",Pt,[Vt,t("div",St,[Lt,(s(!0),d(C,null,k(o.aeaModel.elements,(r,b)=>(s(),d(C,{key:b},[(s(!0),d(C,null,k(r.positions,(w,n)=>(s(),d("div",{key:n,class:"element",style:_(m(r,w)),title:JSON.stringify(r)},[r.barcode?(s(),d("img",{key:0,class:A({rotate:r.barcode.match(/[B-Z]/)}),src:kt},null,2)):p("",!0),t("span",qt,a(b),1)],12,Wt))),128))],64))),128))])])]),t("details",null,[Jt,t("pre",null,a(o.aeaModel.toString()),1)])],64))}},Ft=V(Nt,[["__scopeId","data-v-23608b92"]]),D=v=>(W("data-v-1a30bbf6"),v=v(),q(),v),Ut={class:"font-bold text-lg"},Gt={class:"template-container border border-gray-300"},Kt=D(()=>t("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 1873 825"},null,-1)),jt=D(()=>t("summary",null,"Model",-1)),$t={__name:"BPTemplateComponent",props:["aea-model"],setup(v){const o=v;console.log("TemplateComponent",o.aeaModel);function c(m){let u=(m.y-(m.height||0))/82.55*100;m.constructor.name==="LogoElement"&&(u-=10),u+="%",m.constructor.name==="TextElement"&&(u=`calc(${u} - 1em)`);const r={width:`${m.width/187.33*100}%`,top:u,left:`${m.x/187.33*100}%`};return m.width&&(r.width=`${m.width/187.33*100}%`),m.height&&(r.height=`${m.height/82.55*100}%`),r}return(m,i)=>(s(),d(C,null,[t("h2",Ut,"Boarding Pass Template #"+a(o.aeaModel.id),1),t("div",Gt,[Kt,(s(!0),d(C,null,k(o.aeaModel.elements,(u,r)=>(s(),d(C,{key:r},[u.constructor.name==="TextElement"?(s(),d("pre",{key:0,style:_(c(u))},[t("span",null,a(r),1),E(a(u.text),1)],4)):p("",!0),u.constructor.name==="BoxElement"?(s(),d("div",{key:1,class:"box",style:_(c(u))},[t("span",null,a(r),1)],4)):p("",!0),u.constructor.name==="LogoElement"?(s(),d("div",{key:2,class:"logo",style:_(c(u))},[t("span",null,a(r),1),E(" LOGO ")],4)):p("",!0),u.constructor.name==="LineElement"?(s(),d("div",{key:3,class:"line",style:_(c(u))},null,4)):p("",!0)],64))),128))]),t("details",null,[jt,t("pre",null,a(o.aeaModel.toString()),1)])],64))}},Qt=V($t,[["__scopeId","data-v-1a30bbf6"]]),K="/aeatools/assets/LOGO-BzKF1CxS.png",S=v=>(W("data-v-8335033d"),v=v(),q(),v),Dt={class:"font-bold text-lg inline-block mr-10"},Xt={style:{display:"inline-block"}},Yt=S(()=>t("b",null,"width: ",-1)),zt=S(()=>t("b",null,"mirror @ ",-1)),Ht={class:"grid grid-cols-[min-content_auto]"},Zt=["data-id"],te=["src"],ee=["data-id"],ae=["src"],se=["data-id"],de={class:"elements"},ne=S(()=>t("tr",null,[t("th",null,"ID"),t("th",null,"TYPE"),t("th",null,"MIRROR"),t("th",null,"SIZE"),t("th",null,"POSITION"),t("th",null,"ORIENTATION"),t("th",null,"PREFIX"),t("th",null,"REF"),t("th",null,"COLOUR"),t("th",null,"VALUE")],-1)),oe=["data-id"],le={key:0,class:"prefix"},ie=S(()=>t("h2",null,"Enter BTP data:",-1)),re=["placeholder"],ce={class:"template-container border border-gray-300"},ue=S(()=>t("summary",null,"Model",-1)),ve={__name:"BagTagTableComponent",props:["aea-model"],setup(v){const o=$(),c=v,m=c.aeaModel.tag_width/10,i=c.aeaModel.mirror_point,u=P(null),r=P(null);function b(l){const g=l.type==="SEPARATOR"?l.height/10:l.height;return{width:l.width?l.width+"mm":void 0,height:g?g+"mm":void 0,"font-size":g+"mm","margin-top":-g+"mm",...w(l)}}function w(l){return{top:l.vertical+"mm",left:m-l.horizontal+"mm"}}function n(l){return{["r-"+(l.orientation.rotate||0)]:!0,["a-"+l.orientation.align]:!0,reversed:l.orientation.reversed}}function h({rotate:l,align:g,reversed:e}){return[l&&l+"°",g,e&&"reversed"].filter(y=>!!y)}function L(){return"#"+Math.floor(Math.random()*16777215).toString(16).padStart(6,"0")}c.aeaModel.elements.forEach(l=>l.bg=L());function O(l){[...u.value.querySelectorAll(".highlight")].forEach(g=>g.classList.remove("highlight")),l?(u.value.classList.add("dim"),u.value.querySelector(`id[data-id='${l}']`).classList.add("highlight")):u.value.classList.remove("dim")}const B=l=>`/aeatools/${l}`;function R(l){const g=l.target.value.trim();if(!g.startsWith("BTP")){o.showError("BTP command expected");return}r.value=z(g),console.log(r.value)}function x(l){return c.aeaModel.elements.find(g=>g.id===l)}return(l,g)=>(s(),d(C,null,[t("h2",Dt,"Bag Tag Table #"+a(c.aeaModel.id)+" version:"+a(c.aeaModel.version),1),t("h3",Xt,[Yt,E(a(c.aeaModel.tag_width/10)+"mm ",1),zt,E(a(c.aeaModel.mirror_point)+"mm",1)]),t("section",Ht,[t("div",{class:"bagtag",style:_({width:m+"mm"}),ref_key:"bagtag_div",ref:u},[t("hr",{style:_({left:m/2+"mm"}),class:"dashed midline"},null,4),t("hr",{style:_({top:J(i)+"mm"}),class:"dashed"},null,4),t("div",{style:_({top:J(i)+"mm"}),class:"mirror-text"},"mirror",4),t("ul",{class:"mirrored-elements",style:_({width:m+"mm",height:J(i)+"mm"})},[(s(!0),d(C,null,k(c.aeaModel.elements.filter(e=>e.mirror),e=>{var y,T,I,M;return s(),d("li",{key:e.id,"data-id":e.id,style:_(b(e))},[e.type==="SEPARATOR"?(s(),d("S",{key:0,class:A(n(e))},null,2)):p("",!0),e.type.endsWith("CHARACTER")?(s(),d("C",{key:1,class:A(n(e))},a((y=e.common_data)==null?void 0:y.prefix)+a((I=r.value)==null?void 0:I.elements[(T=e.common_data)==null?void 0:T.ref])+a((M=r.value)==null?void 0:M.elements[e.id]),3)):p("",!0),e.type.endsWith("BARCODE")?(s(),d("img",{key:2,class:A(n(e)),src:B(`${e.choice}.png`)},null,10,te)):p("",!0),e.type==="LOGO"?(s(),d("img",{key:3,class:A(["logo",n(e)]),src:K},null,2)):p("",!0)],12,Zt)}),128))],4),t("ul",null,[(s(!0),d(C,null,k(c.aeaModel.elements,e=>{var y,T,I,M;return s(),d("li",{key:e.id,"data-id":e.id,style:_(b(e))},[e.type==="SEPARATOR"?(s(),d("S",{key:0,class:A(n(e))},null,2)):p("",!0),e.type.endsWith("CHARACTER")?(s(),d("C",{key:1,class:A(n(e))},a((y=e.common_data)==null?void 0:y.prefix)+a((I=r.value)==null?void 0:I.elements[(T=e.common_data)==null?void 0:T.ref])+a((M=r.value)==null?void 0:M.elements[e.id]),3)):p("",!0),e.type.endsWith("BARCODE")?(s(),d("img",{key:2,class:A(n(e)),src:B(`${e.choice}.png`)},null,10,ae)):p("",!0),e.type==="LOGO"?(s(),d("img",{key:3,class:A(["logo",n(e)]),src:K},null,2)):p("",!0)],12,ee)}),128))]),(s(!0),d(C,null,k(c.aeaModel.elements,e=>(s(),d("id",{key:e.id,"data-id":e.id,style:_({...w(e),backgroundColor:e.bg})},a(e.id),13,se))),128))],4),t("div",de,[t("table",{onMouseover:g[0]||(g[0]=e=>{var y;return O((y=e.target.closest("tr"))==null?void 0:y.getAttribute("data-id"))}),onMouseleave:g[1]||(g[1]=e=>O())},[ne,(s(!0),d(C,null,k(c.aeaModel.elements,e=>{var y,T,I,M,N,F,U;return s(),d("tr",{key:e.id,"data-id":e.id},[t("td",{class:"id",style:_({backgroundColor:e.bg})},a(e.id),5),t("td",null,a(e.type.includes("BARCODE")?"BARCODE:"+e.choice:e.type),1),t("td",null,a(e.mirror?"✓":"-"),1),t("td",null,"w:"+a(e.width)+" h:"+a(e.height),1),t("td",null,"x:"+a(e.horizontal)+" v:"+a(e.vertical),1),t("td",null,a(h(e.orientation).join(", ")),1),t("td",null,[(y=e.common_data)!=null&&y.prefix?(s(),d("span",le,a(e.common_data.prefix),1)):p("",!0)]),t("td",null,[(T=e.common_data)!=null&&T.ref?(s(),d("span",{key:0,class:"id",style:_({backgroundColor:x((I=e.common_data)==null?void 0:I.ref).bg})},a(e.common_data.ref),5)):p("",!0)]),t("td",null,a(e.colour_data),1),t("td",null,[E(a((M=e.common_data)==null?void 0:M.prefix)+a((N=r.value)==null?void 0:N.elements[e.id])+" ",1),r.value&&((F=e.common_data)!=null&&F.ref)?(s(),d("var",{key:0,style:_({backgroundColor:x((U=e.common_data)==null?void 0:U.ref).bg})},a(r.value.elements[e.common_data.ref]),5)):p("",!0)])],8,oe)}),128))],32),ie,t("input",{onKeydown:Y(R,["enter"]),placeholder:`BTP${c.aeaModel.id}${c.aeaModel.version}01#...`,class:"p-2 border border-solid border-gray-500 w-full"},null,40,re)])]),t("details",ce,[ue,E(" "+a(c.aeaModel),1)])],64))}},me=V(ve,[["__scopeId","data-v-8335033d"]]),be={class:"font-bold text-lg"},he={open:"",class:"template-container border border-gray-300"},ge=t("summary",null,"Model",-1),pe={__name:"PrintModelComponent",props:["aea-model"],setup(v){const o=v;return(c,m)=>(s(),d(C,null,[t("h2",be,a(o.aeaModel.constructor.name)+" #"+a(o.aeaModel.id),1),t("details",he,[ge,E(" "+a(o.aeaModel),1)])],64))}},fe={class:"p-6 mb-2 h-20 overflow-y-auto whitespace-pre-wrap flex-grow"},_e={__name:"ParseInput",setup(v){const o=$(),c=P([]),m=P(null);function i(b){const w=b.target.value.trim();b.code==="Enter"&&(b.preventDefault(),u(w))}function u(b){if(b.length<4)return;let w=b.substring(0,2);w.startsWith("BT")&&(w+=b[2]);const n=tt[w];if(!n){o.showError(`Unknown command: ${w}`);return}try{const h=n(b);h instanceof G&&h.image,console.log(h.constructor.name,h),c.value.push(h),setTimeout(()=>m.value.scrollIntoView({behavior:"smooth"}),100)}catch(h){o.showError(h.message),console.error(h)}}function r(b){return b instanceof G?Mt:b instanceof et?Ft:b instanceof at?Qt:b instanceof st?me:pe}return(b,w)=>(s(),d(C,null,[t("article",fe,[E(" Enter AEA commands below... "),(s(!0),d(C,null,k(c.value,(n,h)=>(s(),d("div",{key:h,class:"mb-5 border border-gray-400 rounded-lg p-4"},[(s(),H(Z(r(n)),{"aea-model":n},null,8,["aea-model"]))]))),128)),t("div",{ref_key:"btm",ref:m},null,512)]),t("textarea",{class:"w-full border p-2 h-[9rem]",placeholder:`LT3312340A...

Press enter to submit`,onKeydown:i},null,32)],64))}},we=V(_e,[["__scopeId","data-v-afd6a23b"]]);export{we as default};
