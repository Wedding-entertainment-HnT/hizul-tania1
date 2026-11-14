/* app.js — logika & ilustrasi undangan (lanskap, bunga, galeri, RSVP, QR, amplop, musik) */
(function(){
'use strict';
var C=window.CONFIG||{};
var M=C.mempelai||{};
var P=M.pria||{}, W=M.wanita||{};
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function $(s,r){return (r||document).querySelector(s)}
function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
function mk(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function f(n){return Math.round(n*10)/10}

/* =====================================================================
   1) ILUSTRASI — bunga & daun (deterministik, ringan)
   ===================================================================== */
function rng(s){return function(){s=(s*16807)%2147483647;return (s-1)/2147483646}}
var LD=['#2f4757','#3f5c6e','#58788b','#7592a3','#93adbb'], GD=['#b8955a','#cdb078','#a07f45'];
function leaf(x,y,a,k,c,vein){
  return '<g transform="translate('+f(x)+' '+f(y)+') rotate('+f(a)+') scale('+f(k)+')"><path d="M0 0C6 -9 20 -9 28 0C20 9 6 9 0 0Z" fill="'+c+'"/>'+
    (vein?'<path d="M2 0H25" stroke="rgba(255,255,255,.4)" stroke-width=".7" fill="none"/>':'')+'</g>';
}
function flower(x,y,r,R){
  var s='<g transform="translate('+f(x)+' '+f(y)+') rotate('+f(R()*72)+')">',i,a;
  for(i=0;i<5;i++)s+='<ellipse cy="'+f(-r*.55)+'" rx="'+f(r*.42)+'" ry="'+f(r*.62)+'" transform="rotate('+(i*72)+')" fill="#fcfcfa" stroke="#bccad3" stroke-width=".6"/>';
  s+='<circle r="'+f(r*.24)+'" fill="#d8bd7e"/>';
  for(i=0;i<6;i++){a=i*1.047;s+='<circle cx="'+f(Math.cos(a)*r*.36)+'" cy="'+f(Math.sin(a)*r*.36)+'" r="'+f(r*.055)+'" fill="#a8854a"/>'}
  return s+'</g>';
}
function botanical(seed){
  var R=rng(seed),s='',tips=[],i,k,n=9;
  for(i=0;i<n;i++){
    var ang=-(8+i*9.5+R()*6)*Math.PI/180,len=150+R()*200,x0=R()*30,y0=400-R()*30,
        x1=x0+Math.cos(ang)*len,y1=y0+Math.sin(ang)*len,bend=(R()-.5)*90,
        cx=(x0+x1)/2-Math.sin(ang)*bend,cy=(y0+y1)/2+Math.cos(ang)*bend,
        gold=i%3===1,col=gold?GD:LD,cnt=6+Math.floor(R()*5),t;
    s+='<path d="M'+f(x0)+' '+f(y0)+'Q'+f(cx)+' '+f(cy)+' '+f(x1)+' '+f(y1)+'" fill="none" stroke="'+(gold?'#b8955a':'#5b7384')+'" stroke-width="1.5" stroke-linecap="round"/>';
    for(k=1;k<=cnt;k++){
      t=k/(cnt+1);
      var px=(1-t)*(1-t)*x0+2*(1-t)*t*cx+t*t*x1,py=(1-t)*(1-t)*y0+2*(1-t)*t*cy+t*t*y1,
          tx=2*(1-t)*(cx-x0)+2*t*(x1-cx),ty=2*(1-t)*(cy-y0)+2*t*(y1-cy),ta=Math.atan2(ty,tx)*180/Math.PI;
      s+=leaf(px,py,ta+(k%2?1:-1)*(40+R()*30),.55+R()*.6,col[Math.floor(R()*col.length)],gold);
    }
    s+=leaf(x1,y1,Math.atan2(y1-cy,x1-cx)*180/Math.PI,.8,col[0],gold);
    if(!gold)tips.push([x1,y1,cx,cy]);
  }
  tips.forEach(function(p,j){
    if(j%2===0)s+=flower(p[0],p[1],13+R()*9,R);
    else s+='<circle cx="'+f(p[0])+'" cy="'+f(p[1])+'" r="3.2" fill="#fcfcfa" stroke="#bccad3" stroke-width=".5"/>';
    if(j%3===0)s+=flower((p[0]+p[2])/2,(p[1]+p[3])/2,9+R()*5,R);
  });
  return s;
}

/* =====================================================================
   2) ILUSTRASI — lanskap pegunungan berkabut
   ===================================================================== */
function smooth(p){
  var d='M'+p[0][0]+' '+p[0][1],i,a,b,mx;
  for(i=0;i<p.length-1;i++){a=p[i];b=p[i+1];mx=(a[0]+b[0])/2;d+='C'+mx+' '+a[1]+' '+mx+' '+b[1]+' '+b[0]+' '+b[1]}
  return d;
}
function ridgeY(p,x){
  var i,t,a,b,mx,best=1e9,by=p[0][1],bx,y;
  for(i=0;i<p.length-1;i++){
    a=p[i];b=p[i+1];if(x<a[0]||x>b[0])continue;
    for(t=0;t<=1;t+=.02){bx=a[0]+(b[0]-a[0])*(3*t*t-2*t*t*t);if(Math.abs(bx-x)<best){best=Math.abs(bx-x);by=a[1]+(b[1]-a[1])*(3*t*t-2*t*t*t)}}
    return by;
  }
  return by;
}
function conifer(x,y,h,c){
  return '<path d="M'+f(x)+' '+f(y-h)+'L'+f(x+h*.22)+' '+f(y-h*.5)+'L'+f(x+h*.12)+' '+f(y-h*.5)+'L'+f(x+h*.3)+' '+f(y-h*.14)+'L'+f(x+h*.04)+' '+f(y-h*.14)+'L'+f(x+h*.04)+' '+f(y)+
    'L'+f(x-h*.04)+' '+f(y)+'L'+f(x-h*.04)+' '+f(y-h*.14)+'L'+f(x-h*.3)+' '+f(y-h*.14)+'L'+f(x-h*.12)+' '+f(y-h*.5)+'L'+f(x-h*.22)+' '+f(y-h*.5)+'Z" fill="'+c+'"/>';
}
function roundTree(x,y,h,c,c2){
  return '<path d="M'+f(x)+' '+f(y)+'V'+f(y-h*.5)+'" stroke="'+c2+'" stroke-width="'+f(Math.max(1,h*.06))+'"/>'+
    '<circle cx="'+f(x)+'" cy="'+f(y-h*.72)+'" r="'+f(h*.28)+'" fill="'+c+'"/><circle cx="'+f(x-h*.17)+'" cy="'+f(y-h*.55)+'" r="'+f(h*.2)+'" fill="'+c+'"/><circle cx="'+f(x+h*.18)+'" cy="'+f(y-h*.56)+'" r="'+f(h*.2)+'" fill="'+c+'"/>';
}
function scene(uid,par){
  var R=rng(77),g=function(n){return uid+n},s;
  var r1=[[0,350],[70,300],[135,338],[215,246],[285,318],[345,276],[400,326]],
      r2=[[0,470],[90,408],[170,448],[262,376],[340,430],[400,396]],
      r3=[[0,580],[60,538],[150,572],[240,518],[330,560],[400,528]],
      r4=[[0,690],[100,648],[200,684],[300,640],[400,672]],i,x,y;
  s='<svg viewBox="0 0 400 800" preserveAspectRatio="'+(par||'xMidYMax slice')+'" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>'+
   '<linearGradient id="'+g('sky')+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6ecf2"/><stop offset=".5" stop-color="#eef2f6"/><stop offset="1" stop-color="#f3f5f7"/></linearGradient>'+
   '<linearGradient id="'+g('m1')+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c3d0dc"/><stop offset="1" stop-color="#e5ebf1"/></linearGradient>'+
   '<linearGradient id="'+g('m2')+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#aebfce"/><stop offset="1" stop-color="#d7e1e9"/></linearGradient>'+
   '<linearGradient id="'+g('m3')+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#97adbf"/><stop offset="1" stop-color="#c3d3de"/></linearGradient>'+
   '<linearGradient id="'+g('m4')+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7f9ab0"/><stop offset="1" stop-color="#aec3d1"/></linearGradient>'+
   '<linearGradient id="'+g('mist')+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".55" stop-color="#fff" stop-opacity=".78"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'+
   '<radialGradient id="'+g('cl')+'"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>'+
   '</defs>'+
   '<rect width="400" height="800" fill="url(#'+g('sky')+')"/>'+
   '<circle cx="290" cy="168" r="66" fill="#fff" opacity=".62"/><circle cx="290" cy="168" r="78" fill="none" stroke="#fff" stroke-width="1" opacity=".7"/>'+
   '<ellipse class="cloud" cx="110" cy="150" rx="120" ry="20" fill="url(#'+g('cl')+')"/>'+
   '<ellipse class="cloud b" cx="300" cy="238" rx="130" ry="18" fill="url(#'+g('cl')+')"/>'+
   '<path d="'+smooth(r1)+'L400 800L0 800Z" fill="url(#'+g('m1')+')"/>'+
   '<rect y="300" width="400" height="120" fill="url(#'+g('mist')+')"/>';
  for(i=0;i<9;i++){x=18+i*44+R()*14;y=ridgeY(r1,x);s+=conifer(x,y+6,16+R()*10,'#b4c4d2')}
  s+='<path d="'+smooth(r2)+'L400 800L0 800Z" fill="url(#'+g('m2')+')"/>'+
     '<ellipse class="cloud b" cx="150" cy="448" rx="170" ry="26" fill="url(#'+g('cl')+')"/>';
  for(i=0;i<10;i++){x=10+i*40+R()*16;y=ridgeY(r2,x);s+=(i%3?conifer(x,y+8,26+R()*14,'#9eb2c3'):roundTree(x,y+8,30+R()*12,'#a6b9c8','#8ea5b6'))}
  s+='<rect y="500" width="400" height="110" fill="url(#'+g('mist')+')"/>'+
     '<path d="'+smooth(r3)+'L400 800L0 800Z" fill="url(#'+g('m3')+')"/>';
  for(i=0;i<10;i++){x=8+i*42+R()*18;y=ridgeY(r3,x);s+=(i%2?conifer(x,y+8,40+R()*20,'#7f98ac'):roundTree(x,y+8,46+R()*16,'#8aa2b5','#71899c'))}
  s+='<rect y="610" width="400" height="110" fill="url(#'+g('mist')+')" opacity=".8"/>'+
     '<path d="'+smooth(r4)+'L400 800L0 800Z" fill="url(#'+g('m4')+')"/>';
  for(i=0;i<8;i++){x=14+i*52+R()*20;y=ridgeY(r4,x);s+=(i%2?conifer(x,y+10,62+R()*24,'#667f94'):roundTree(x,y+10,70+R()*20,'#728da1','#5e788c'))}
  s+='<rect y="700" width="400" height="100" fill="url(#'+g('mist')+')" opacity=".55"/></svg>';
  return s;
}

/* ---------- pasang ilustrasi ---------- */
(function(){
  var d=$('#symbols');
  if(d)d.innerHTML=
    '<linearGradient id="chipg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e6d09a"/><stop offset=".5" stop-color="#b8955a"/><stop offset="1" stop-color="#d9bf86"/></linearGradient>'+
    '<symbol id="bot1" viewBox="0 0 400 400">'+botanical(11)+'</symbol><symbol id="bot2" viewBox="0 0 400 400">'+botanical(29)+'</symbol>';
  $$('[data-scene]').forEach(function(e,i){e.innerHTML=scene('s'+i+'-',e.getAttribute('data-scene')==='gate'?'xMidYMid slice':'xMidYMax slice')});
})();

/* =====================================================================
   3) TEKS DARI CONFIG
   ===================================================================== */
var namaP=P.nama||'Hizul Wahyudin', namaW=W.nama||'Tania Renata';
var panP=P.panggilan||namaP.split(' ')[0], panW=W.panggilan||namaW.split(' ')[0];
$$('[data-n]').forEach(function(e){
  var k=e.getAttribute('data-n');
  e.textContent=k==='pria'?namaP:k==='wanita'?namaW:k==='pria-p'?panP:panW;
});
$$('[data-parents]').forEach(function(e){
  var o=e.getAttribute('data-parents')==='pria'?P:W,a=[];
  if(o.ayah)a.push('Bapak '+o.ayah);if(o.ibu)a.push('Ibu '+o.ibu);
  e.textContent=a.join(' & ');if(!a.length)e.style.display='none';
});
(function(){
  var d=new Date(C.tanggalIso);if(isNaN(d))return;
  var t=d.toLocaleDateString('id-ID',{timeZone:'Asia/Jakarta',day:'2-digit',month:'2-digit',year:'numeric'}).replace(/\//g,' . ');
  $$('[data-date]').forEach(function(e){e.textContent=t});
})();
/* foto berdua (opsional): config foto.bersama, kalau kosong pakai galeri pertama */
(function(){
  var src=(C.foto&&C.foto.bersama)||(C.galeri&&C.galeri[0]);if(!src)return;
  var im=$('[data-couple]');if(!im)return;
  im.onload=function(){$('#couple-wide').hidden=false};im.src=src;
})();

/* =====================================================================
   4) COVER — buka pintu
   ===================================================================== */
var cover=$('#cover'),opened=false,audio=$('#bgm'),mbtn=$('#music');
function setMusic(on){
  if(!audio||!C.musik)return;
  if(on){var p=audio.play();if(p&&p.catch)p.catch(function(){});mbtn.classList.add('on')}
  else{audio.pause();mbtn.classList.remove('on')}
}
function openInvite(){
  if(opened)return;opened=true;
  cover.classList.add('open');
  setTimeout(function(){cover.classList.add('zoom');document.body.classList.remove('lock');document.body.classList.add('opened');window.scrollTo(0,0)},reduce?50:1150);
  setTimeout(function(){cover.remove()},reduce?200:2500);
  if(C.musik){mbtn.hidden=false;setMusic(true)}
}
$('#btn-open').addEventListener('click',openInvite);
if(mbtn)mbtn.addEventListener('click',function(){setMusic(!mbtn.classList.contains('on'))});
document.addEventListener('visibilitychange',function(){if(document.hidden&&audio&&!audio.paused){audio.pause();mbtn.dataset.was=1}else if(!document.hidden&&mbtn&&mbtn.dataset.was){delete mbtn.dataset.was;if(mbtn.classList.contains('on'))audio.play().catch(function(){})}});

/* =====================================================================
   5) MUNCUL SAAT DIGULIR
   ===================================================================== */
(function(){
  var els=$$('.rv');
  els.forEach(function(e){e.style.setProperty('--dl',e.getAttribute('data-d')||0)});
  if(!('IntersectionObserver' in window)||reduce){els.forEach(function(e){e.classList.add('in')});return}
  var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  els.forEach(function(e){io.observe(e)});
})();

/* =====================================================================
   6) HITUNG MUNDUR
   ===================================================================== */
(function(){
  var t=new Date(C.tanggalIso).getTime();if(isNaN(t))return;
  var ids={d:$('#cd-d'),h:$('#cd-h'),m:$('#cd-m'),s:$('#cd-s')};
  function p(n){return n<10?'0'+n:''+n}
  function tick(){
    var x=Math.max(0,t-Date.now()),s=Math.floor(x/1000);
    ids.d.textContent=p(Math.floor(s/86400));ids.h.textContent=p(Math.floor(s%86400/3600));
    ids.m.textContent=p(Math.floor(s%3600/60));ids.s.textContent=p(s%60);
  }
  tick();setInterval(tick,1000);
})();

/* =====================================================================
   7) KALENDER .ics
   ===================================================================== */
(function(){
  var b=$('#btn-ics');if(!b)return;
  b.addEventListener('click',function(){
    var s=new Date(C.tanggalIso);if(isNaN(s)){toast('Tanggal acara belum diatur');return}
    var e=new Date(s.getTime()+(C.durasiJam||4)*3600000);
    function z(d){return d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')}
    function esc(t){return String(t||'').replace(/([,;\\])/g,'\\$1').replace(/\n/g,'\\n')}
    var ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Undangan//ID','BEGIN:VEVENT','UID:'+z(s)+'@undangan','DTSTAMP:'+z(new Date()),
      'DTSTART:'+z(s),'DTEND:'+z(e),'SUMMARY:'+esc(C.judulKalender),'DESCRIPTION:'+esc(C.detailKalender),
      'LOCATION:'+esc((C.tempat||'')+', '+(C.alamat||'')),'END:VEVENT','END:VCALENDAR'].join('\r\n');
    var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar;charset=utf-8'}));
    a.download='undangan-pernikahan.ics';document.body.appendChild(a);a.click();
    setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},1500);
  });
})();

/* =====================================================================
   8) GALERI + LIGHTBOX (geser / panah)
   ===================================================================== */
(function(){
  var box=$('#gallery'),list=C.galeri||[],lb=$('#lightbox'),lbi=$('#lightbox-img'),cnt=$('#lb-count'),cur=0;
  if(!box)return;
  if(!list.length){box.closest('section').hidden=true;return}
  list.forEach(function(src,i){
    var it=mk('div','g-item'),im=new Image();im.alt='Galeri '+(i+1);im.loading='lazy';im.decoding='async';
    im.onerror=function(){it.remove()};im.src=src;it.appendChild(im);box.appendChild(it);
  });
  function imgs(){return $$('.g-item img',box)}
  function show(i){var a=imgs();if(!a.length)return;cur=(i+a.length)%a.length;lbi.src=a[cur].src;cnt.textContent=(cur+1)+' / '+a.length}
  function close(){lb.hidden=true;document.body.style.overflow=''}
  box.addEventListener('click',function(e){
    var it=e.target.closest('.g-item');if(!it)return;
    show(imgs().indexOf($('img',it)));lb.hidden=false;document.body.style.overflow='hidden';
  });
  $('.lb-x',lb).addEventListener('click',close);
  $('.prev',lb).addEventListener('click',function(e){e.stopPropagation();show(cur-1)});
  $('.next',lb).addEventListener('click',function(e){e.stopPropagation();show(cur+1)});
  lb.addEventListener('click',function(e){if(e.target===lb)close()});
  document.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1)});
  var x0=null;
  lb.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',function(e){if(x0==null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>45)show(cur+(dx<0?1:-1));x0=null},{passive:true});
})();

/* =====================================================================
   9) TOAST, SALIN
   ===================================================================== */
var tt;
function toast(m){var t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){t.classList.remove('show')},3200)}
function salin(teks,pesan){
  function fb(){var ta=mk('textarea');ta.value=teks;ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();
    try{document.execCommand('copy');toast(pesan)}catch(e){toast('Gagal menyalin. Salin manual: '+teks)}ta.remove()}
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(teks).then(function(){toast(pesan)}).catch(fb);else fb();
}

/* =====================================================================
   10) RSVP & DINDING UCAPAN
   ===================================================================== */
var wall=$('#wall');
function tgl(iso){try{return iso?new Date(iso).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}):''}catch(e){return ''}}
function renderWall(list){
  wall.innerHTML='';
  if(!list||!list.length){wall.appendChild(mk('p','wall-empty','Belum ada ucapan. Jadilah yang pertama mengirimkan doa untuk kedua mempelai.'));return}
  list.forEach(function(it){
    var c=mk('div','wc'),b=mk('div'),n=String(it.nama||'Tamu');
    c.appendChild(mk('div','wc-av',n.charAt(0).toUpperCase()));
    b.appendChild(mk('div','wc-n',n));b.appendChild(mk('div','wc-t',it.pesan||''));
    var d=tgl(it.waktu);if(d)b.appendChild(mk('div','wc-d',d));
    c.appendChild(b);wall.appendChild(c);
  });
}
function loadWall(){
  if(!window.google||!google.script||!google.script.run){renderWall([]);return}
  google.script.run.withSuccessHandler(renderWall).withFailureHandler(function(){renderWall([])}).ambilUcapan();
}
loadWall();

var nm=$('#rsvp-nama');if(nm&&window.NAMA_TAMU)nm.value=window.NAMA_TAMU;
$('#rsvp-form').addEventListener('submit',function(e){
  e.preventDefault();
  var btn=$('#rsvp-submit'),form=this,
      data={nama:nm.value.trim(),jumlah:$('#rsvp-jumlah').value,status:$('#rsvp-status').value,pesan:$('#rsvp-pesan').value.trim()};
  if(!data.nama){toast('Mohon isi nama Anda');return}
  btn.disabled=true;btn.textContent='Mengirim...';
  function done(){btn.disabled=false;btn.textContent='Kirim Konfirmasi'}
  google.script.run
    .withSuccessHandler(function(r){
      done();toast((r&&r.message)||'Terima kasih!');
      if(r&&r.success){form.reset();if(window.NAMA_TAMU)nm.value=window.NAMA_TAMU;setTimeout(loadWall,3000);setTimeout(loadWall,9000)}
    })
    .withFailureHandler(function(){done();toast('Gagal mengirim. Silakan coba lagi.')})
    .kirimRSVP(data);
});

/* =====================================================================
   11) TIKET QR
   ===================================================================== */
(function(){
  var box=$('#qr-box'),sec=$('#tiket-sec'),n=window.NAMA_TAMU||'';
  if(!box||!n||!C.qrAktif||!C.apiUrl)return;
  fetch(C.apiUrl+'?aksi=qr&to='+encodeURIComponent(n),{redirect:'follow'}).then(function(r){return r.json()}).then(function(d){
    if(!d||!d.kode)return;
    var url=location.href.split('?')[0].split('#')[0].replace(/[^\/]*$/,'')+'checkin.html?cek='+encodeURIComponent(n)+'&k='+d.kode;
    sec.hidden=false;box.innerHTML='';
    if(typeof QRCode==='undefined'){box.textContent='QR belum dapat dimuat. Muat ulang halaman ini.';return}
    try{new QRCode(box,{text:url,width:200,height:200,colorDark:'#1c2630',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M})}
    catch(e){box.textContent='QR belum dapat dimuat. Muat ulang halaman ini.'}
  }).catch(function(){});
})();

/* =====================================================================
   12) AMPLOP DIGITAL — salin, rekening lain, alamat kado
   ===================================================================== */
(function(){
  var cb=$('#btn-copy');
  if(cb)cb.addEventListener('click',function(){salin($('#bank-num').textContent.trim(),'Nomor rekening berhasil disalin')});
  var host=$('#gift-list');if(!host)return;
  function chip(){return '<svg class="chip" viewBox="0 0 40 30" width="38" height="28" aria-hidden="true"><rect width="40" height="30" rx="5" fill="url(#chipg)"/><path d="M0 10h40M0 20h40M14 0v30M26 0v30" stroke="rgba(90,60,20,.35)" stroke-width=".8" fill="none"/></svg>'}
  (C.rekeningLain||[]).forEach(function(r){
    if(!r||!r.nomor)return;
    var c=mk('div','bank-card');c.innerHTML=chip();
    c.appendChild(mk('div','b-name',r.nama||'Rekening'));c.appendChild(mk('div','b-num',r.nomor));c.appendChild(mk('div','b-own','a.n. '+(r.atasNama||'')));
    var b=mk('button','btn ghost sm','Salin Nomor');b.type='button';
    b.addEventListener('click',function(){salin(String(r.nomor),'Nomor '+(r.nama||'rekening')+' berhasil disalin')});
    c.appendChild(b);host.appendChild(c);
  });
  var k=C.kado||{};
  if(k.alamat){
    var c=mk('div','bank-card');c.appendChild(mk('div','b-name','Kirim Kado'));
    c.appendChild(mk('div','b-addr',[k.penerima,k.alamat,k.telepon?'Telp: '+k.telepon:''].filter(Boolean).join('\n')));
    var b=mk('button','btn ghost sm','Salin Alamat');b.type='button';
    b.addEventListener('click',function(){salin([k.penerima,k.alamat,k.telepon?'Telp: '+k.telepon:''].filter(Boolean).join('\n'),'Alamat kado berhasil disalin')});
    c.appendChild(b);host.appendChild(c);
  }
})();

})();
