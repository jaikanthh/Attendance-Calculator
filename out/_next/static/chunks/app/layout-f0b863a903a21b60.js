(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[177],{769:(e,r,t)=>{"use strict";t.d(r,{default:()=>v});var s=t(5155),a=t(2115),n=t(6874),i=t.n(n),o=t(6766),l=t(7168),c=t(2098),d=t(3509),h=t(1362);function m(){let{theme:e,setTheme:r}=(0,h.D)(),[t,n]=(0,a.useState)(!1);return((0,a.useEffect)(()=>{n(!0)},[]),t)?(0,s.jsxs)(l.$,{variant:"ghost",size:"icon",className:"rounded-full",onClick:()=>{"dark"===e?r("light"):r("dark")},children:[(0,s.jsx)(c.A,{className:"h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"}),(0,s.jsx)(d.A,{className:"absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"}),(0,s.jsx)("span",{className:"sr-only",children:"Toggle theme"})]}):(0,s.jsxs)(l.$,{variant:"ghost",size:"icon",className:"rounded-full",children:[(0,s.jsx)(c.A,{className:"h-[1.2rem] w-[1.2rem] opacity-50"}),(0,s.jsx)("span",{className:"sr-only",children:"Toggle theme"})]})}var u=t(4416),f=t(4783),x=t(6413),g=t(760);function v(){let[e,r]=(0,a.useState)(!1),[t,n]=(0,a.useState)(!1);(0,a.useEffect)(()=>{let e=()=>{window.scrollY>10?r(!0):r(!1)};return window.addEventListener("scroll",e),()=>window.removeEventListener("scroll",e)},[]);let c=[{name:"Home",href:"/welcome"},{name:"Simple Calculator",href:"/simple"},{name:"LTPS Calculator",href:"/ltps"}];return(0,s.jsxs)("header",{className:"fixed top-0 w-full z-50 transition-all duration-300 px-2 ".concat(e?"bg-background/80 backdrop-blur-md shadow-md py-2":"bg-transparent py-3"),children:[(0,s.jsxs)("div",{className:"container mx-auto px-2 sm:px-4 flex justify-between items-center",children:[(0,s.jsx)(x.P.div,{initial:{opacity:0,x:-20},animate:{opacity:1,x:0},transition:{duration:.5},children:(0,s.jsx)(i(),{href:"/welcome",className:"flex items-center gap-2",children:(0,s.jsx)("div",{className:"relative flex items-center",children:(0,s.jsx)(o.default,{src:"/KL_University_logo.svg",alt:"KL Logo",width:42,height:42,className:"h-9 sm:h-11 w-auto",priority:!0})})})}),(0,s.jsxs)("div",{className:"hidden md:flex items-center gap-4 lg:gap-6",children:[(0,s.jsx)("nav",{children:(0,s.jsx)("ul",{className:"flex gap-4 lg:gap-6",children:c.map((e,r)=>(0,s.jsx)(x.P.li,{initial:{opacity:0,y:-10},animate:{opacity:1,y:0},transition:{duration:.3,delay:.1*r},children:(0,s.jsxs)(i(),{href:e.href,className:"text-foreground/80 hover:text-red-500 transition-colors relative group font-outfit",children:[e.name,(0,s.jsx)("span",{className:"absolute -bottom-1 left-0 right-0 h-0.5 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"})]})},e.name))})}),(0,s.jsx)(m,{})]}),(0,s.jsxs)("div",{className:"md:hidden flex items-center gap-2",children:[(0,s.jsx)(m,{}),(0,s.jsx)(l.$,{variant:"ghost",size:"icon",className:"h-8 w-8",onClick:()=>n(!t),children:t?(0,s.jsx)(u.A,{className:"h-4 w-4"}):(0,s.jsx)(f.A,{className:"h-4 w-4"})})]})]}),(0,s.jsx)(g.N,{children:t&&(0,s.jsx)(x.P.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:0,height:0},transition:{duration:.3},className:"md:hidden bg-background/95 backdrop-blur-md",children:(0,s.jsx)("nav",{className:"container mx-auto px-4 py-3",children:(0,s.jsx)("ul",{className:"flex flex-col gap-3",children:c.map(e=>(0,s.jsx)("li",{children:(0,s.jsx)(i(),{href:e.href,className:"text-foreground/80 hover:text-red-500 transition-colors block py-2 font-outfit",onClick:()=>n(!1),children:e.name})},e.name))})})})})]})}},1858:(e,r,t)=>{Promise.resolve().then(t.t.bind(t,9324,23)),Promise.resolve().then(t.bind(t,769)),Promise.resolve().then(t.bind(t,9304)),Promise.resolve().then(t.t.bind(t,3868,23)),Promise.resolve().then(t.t.bind(t,6622,23))},3999:(e,r,t)=>{"use strict";t.d(r,{cn:()=>n});var s=t(2596),a=t(9688);function n(){for(var e=arguments.length,r=Array(e),t=0;t<e;t++)r[t]=arguments[t];return(0,a.QP)((0,s.$)(r))}},7168:(e,r,t)=>{"use strict";t.d(r,{$:()=>c});var s=t(5155),a=t(2115),n=t(4624),i=t(2085),o=t(3999);let l=(0,i.F)("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground hover:bg-destructive/90",outline:"border border-input bg-background hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}}),c=a.forwardRef((e,r)=>{let{className:t,variant:a,size:i,asChild:c=!1,...d}=e,h=c?n.DX:"button";return(0,s.jsx)(h,{className:(0,o.cn)(l({variant:a,size:i,className:t})),ref:r,...d})});c.displayName="Button"},9304:(e,r,t)=>{"use strict";t.d(r,{ThemeProvider:()=>n});var s=t(5155);t(2115);var a=t(1362);function n(e){let{children:r,...t}=e;return(0,s.jsx)(a.N,{...t,children:r})}},9324:()=>{}},e=>{var r=r=>e(e.s=r);e.O(0,[571,655,874,824,441,684,358],()=>r(1858)),_N_E=e.O()}]);