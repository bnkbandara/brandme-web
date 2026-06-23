/* ================================================================
   BrandMe — script.js
   Personal Branding & Digital Presence
   ================================================================ */

(function(){
  'use strict';

  /* NAV SCROLL */
  const nav = document.getElementById('navbar');
  const ham = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  window.addEventListener('scroll', function(){
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, {passive:true});
  ham.addEventListener('click', function(){
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ navLinks.classList.remove('open'); });
  });

  /* SCROLL REVEAL */
  const reveals = document.querySelectorAll('.reveal');
  const ro = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('vis'); ro.unobserve(e.target); } });
  }, {threshold:0.1});
  reveals.forEach(function(el,i){
    el.style.transitionDelay = (i%4 * 80)+'ms';
    ro.observe(el);
  });

  /* COUNTER ANIMATION */
  function runCounters(parent){
    parent.querySelectorAll('[data-target]').forEach(function(el){
      const target = parseInt(el.getAttribute('data-target'));
      const suffix = el.getAttribute('data-suffix')||'';
      let cur=0; const step=Math.max(1,Math.ceil(target/55));
      const t=setInterval(function(){
        cur=Math.min(cur+step,target);
        el.textContent=cur+suffix;
        if(cur>=target) clearInterval(t);
      },22);
    });
  }
  const statsBanner = document.querySelector('.stats-banner');
  if(statsBanner){
    const co=new IntersectionObserver(function(e){
      if(e[0].isIntersecting){ runCounters(statsBanner); co.disconnect(); }
    },{threshold:0.3});
    co.observe(statsBanner);
  }

  /* SHOWCASE TABS */
  document.querySelectorAll('.sc-tab').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('.sc-tab').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      document.querySelectorAll('.sc-card').forEach(function(card){
        card.classList.toggle('hidden', filter!=='all' && card.getAttribute('data-cat')!==filter);
      });
    });
  });

  /* REVIEWS CAROUSEL */
  const track = document.getElementById('rvTrack');
  const dotsWrap = document.getElementById('rvDots');
  const prevBtn = document.getElementById('rvPrev');
  const nextBtn = document.getElementById('rvNext');
  if(track){
    const cards = Array.from(track.querySelectorAll('.rv-card'));
    const dots = [];
    cards.forEach(function(_,i){
      const d=document.createElement('button');
      d.className='rv-dot'+(i===0?' on':'');
      d.addEventListener('click', function(){ scrollTo(i); });
      dotsWrap.appendChild(d); dots.push(d);
    });
    function scrollTo(i){
      const card=cards[i];
      track.scrollTo({left:card.offsetLeft - (track.clientWidth - card.offsetWidth)/2, behavior:'smooth'});
    }
    function updateDots(){
      const cx=track.scrollLeft+track.clientWidth/2;
      let best=0,bd=Infinity;
      cards.forEach(function(c,i){
        const d=Math.abs(c.offsetLeft+c.offsetWidth/2-cx);
        if(d<bd){bd=d;best=i;}
      });
      dots.forEach(function(d,i){d.classList.toggle('on',i===best);});
    }
    track.addEventListener('scroll', updateDots, {passive:true});
    function activeIdx(){ return dots.findIndex(function(d){return d.classList.contains('on');}) }
    prevBtn.addEventListener('click', function(){ const i=activeIdx(); if(i>0) scrollTo(i-1); });
    nextBtn.addEventListener('click', function(){ const i=activeIdx(); if(i<cards.length-1) scrollTo(i+1); });
    /* drag scroll */
    let down=false,sx,sl;
    track.addEventListener('mousedown',function(e){down=true;sx=e.pageX-track.offsetLeft;sl=track.scrollLeft;});
    track.addEventListener('mouseleave',function(){down=false;});
    track.addEventListener('mouseup',function(){down=false;});
    track.addEventListener('mousemove',function(e){if(!down)return;e.preventDefault();track.scrollLeft=sl-(e.pageX-track.offsetLeft-sx)*1.4;});
  }

  /* CONTACT FORM */
  const form=document.getElementById('contactForm');
  const succ=document.getElementById('formSuccess');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      const n=document.getElementById('fname').value.trim();
      const em=document.getElementById('femail').value.trim();
      if(!n||!em)return;
      const btn=form.querySelector('.form-submit');
      btn.textContent='Sending…'; btn.disabled=true;
      setTimeout(function(){
        form.reset(); btn.textContent='Send Message ✦'; btn.disabled=false;
        succ.style.display='block';
        setTimeout(function(){succ.style.display='none';},6000);
      },1200);
    });
  }

  /* HERO PARTICLES */
  const hero=document.querySelector('.hero');
  if(hero&&!window.matchMedia('(prefers-reduced-motion:reduce)').matches){
    const cv=document.createElement('canvas');
    cv.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;opacity:0.25';
    hero.appendChild(cv);
    const ctx=cv.getContext('2d');
    let W,H,pts;
    function resize(){W=cv.width=hero.offsetWidth;H=cv.height=hero.offsetHeight;}
    function mkPt(){return{x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.4+.3,vx:(Math.random()-.5)*.25,vy:-Math.random()*.35-.1,a:Math.random()*.5+.1};}
    function init(){pts=Array.from({length:50},mkPt);}
    function tick(){
      ctx.clearRect(0,0,W,H);
      pts.forEach(function(p){
        p.x+=p.vx;p.y+=p.vy;
        if(p.y<-4)Object.assign(p,mkPt(),{y:H+4});
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle='rgba(201,168,76,'+p.a+')';ctx.fill();
      });
      requestAnimationFrame(tick);
    }
    resize();init();tick();
    window.addEventListener('resize',function(){resize();init();});
  }
})();