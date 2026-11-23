
const $=s=>document.querySelectorAll(s),bar=document.getElementById('bar'),glow=document.getElementById('glow');
addEventListener('scroll',()=>{bar.style.width=scrollY/(document.documentElement.scrollHeight-innerHeight)*100+'%'},{passive:true});
const io=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.06});
$('.rv').forEach(n=>io.observe(n));
// counters
$('[data-n]').forEach(el=>{const n=+el.dataset.n,s=el.dataset.s||'',t0=performance.now();
(function f(t){const p=Math.min((t-t0)/1600,1);el.textContent=Math.round(n*(1-Math.pow(1-p,4)))+s;if(p<1)requestAnimationFrame(f)})(t0)});
// cursor glow + card spotlight + 3D tilt
let mx=innerWidth/2,my=innerHeight*.3;
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;glow.style.left=mx+'px';glow.style.top=my+'px'});
$('.card').forEach(c=>{
c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
c.style.setProperty('--mx',x+'px');c.style.setProperty('--my',y+'px');
if(e.pointerType==='mouse')c.style.transform=`perspective(800px) rotateX(${(.5-y/r.height)*7}deg) rotateY(${(x/r.width-.5)*7}deg) translateY(-4px)`});
c.addEventListener('pointerleave',()=>c.style.transform='')});
// particle network
const cv=document.getElementById('cv'),cx=cv.getContext('2d');let W,H,P=[];
function rs(){const d=Math.min(devicePixelRatio||1,2);W=cv.width=cv.offsetWidth*d;H=cv.height=cv.offsetHeight*d;
P=Array.from({length:Math.min(110,Math.floor(cv.offsetWidth/11))},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.5*d,vy:(Math.random()-.5)*.5*d}))}
rs();addEventListener('resize',rs);
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
(function draw(){cx.clearRect(0,0,W,H);const d=W/cv.offsetWidth,r=cv.getBoundingClientRect(),px=(mx-r.left)*d,py=(my-r.top)*d,L=150*d;
for(const p of P){if(!rm){p.x+=p.vx;p.y+=p.vy}if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
const dx=p.x-px,dy=p.y-py,dd=Math.hypot(dx,dy);if(dd<200*d&&dd>0){p.x+=dx/dd*1.4;p.y+=dy/dd*1.4}
cx.fillStyle='rgba(255,94,138,.85)';cx.beginPath();cx.arc(p.x,p.y,1.8*d,0,7);cx.fill()}
for(let i=0;i<P.length;i++){for(let j=i+1;j<P.length;j++){const a=P[i],b=P[j],q=Math.hypot(a.x-b.x,a.y-b.y);
if(q<L){cx.strokeStyle=`rgba(138,92,255,${(1-q/L)*.5})`;cx.lineWidth=d;cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke()}}
const q=Math.hypot(P[i].x-px,P[i].y-py);if(q<L*1.4){cx.strokeStyle=`rgba(255,94,138,${(1-q/(L*1.4))*.8})`;cx.beginPath();cx.moveTo(P[i].x,P[i].y);cx.lineTo(px,py);cx.stroke()}}
requestAnimationFrame(draw)})();
