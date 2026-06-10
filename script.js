// =============================================
//   Alex Rivera — Portfolio JS
//   yes I know this file is getting long
//   but every feature in here was FUN to build
// =============================================


// ---- CUSTOM CURSOR ----
// spent an embarrassing amount of time on this
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
});

// ring follows with smooth lag — classic lerp
function lerpCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(lerpCursor);
}
lerpCursor();

// interactive states
document.querySelectorAll('a, button, .skill-card, .csocial, .pr-btn, .nav-cta').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});
document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
document.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));


// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


// ---- SCROLL REVEAL ----
const revealEls = document.querySelectorAll('.reveal-up');
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));


// ---- TYPING ANIMATION ----
// I built this from scratch — no library, just recursion and vibes
const phrases = [
    'clean interfaces.',
    'accessible UIs.',
    'responsive layouts.',
    'too many side projects.',
    'actually useful things.',
    'the occasional bug 😅',
];
let pi = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typed');

function type() {
    const phrase = phrases[pi];
    typedEl.textContent = deleting
        ? phrase.slice(0, ci--)
        : phrase.slice(0, ci++);

    let delay = deleting ? 45 : 80;

    if (!deleting && ci > phrase.length) {
        deleting = true; delay = 1600;
    } else if (deleting && ci < 0) {
        deleting = false; ci = 0;
        pi = (pi + 1) % phrases.length; delay = 280;
    }
    setTimeout(type, delay);
}
setTimeout(type, 1400);


// ---- ACTIVE NAV HIGHLIGHT ----
// tracks which section is in view and colors the right nav link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(a => {
                const active = a.getAttribute('href') === `#${id}`;
                a.style.color = active ? 'var(--accent)' : '';
            });
        }
    });
}, { threshold: 0.4 });
sections.forEach(s => sectionObs.observe(s));


// ---- 3D TILT EFFECT on avatar card ----
// makes the card feel alive — took forever to get right
const avatarCard = document.getElementById('avatarCard');
if (avatarCard) {
    avatarCard.addEventListener('mousemove', e => {
        const rect = avatarCard.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        const rx = dy * -10;
        const ry = dx * 10;
        avatarCard.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
        avatarCard.style.boxShadow = `${-ry * 2}px ${rx * 2}px 40px rgba(0,0,0,.5)`;
    });
    avatarCard.addEventListener('mouseleave', () => {
        avatarCard.style.transform = '';
        avatarCard.style.boxShadow = '';
    });
}


// ---- FLOATING CODE DECORATIONS — parallax on scroll ----
const decos = [
    { el: document.getElementById('deco1'), speed: 0.04 },
    { el: document.getElementById('deco2'), speed: 0.07 },
    { el: document.getElementById('deco3'), speed: 0.05 },
    { el: document.getElementById('deco4'), speed: 0.06 },
];
window.addEventListener('scroll', () => {
    const y = window.scrollY;
    decos.forEach(({ el, speed }) => {
        if (el) el.style.transform = `translateY(${y * speed}px)`;
    });
}, { passive: true });


// ---- SUBJECT PILL SELECTOR (contact form) ----
const pills = document.querySelectorAll('.spill');
pills.forEach(pill => {
    pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
    });
});


// ---- CONTACT FORM SUBMIT ----
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');

form.addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const subject = document.querySelector('.spill.active')?.dataset.val || 'message';

    // loading state
    submitBtn.disabled = true;
    btnText.textContent = 'sending...';

    // fake async delay (real app: replace with fetch to your API)
    await new Promise(r => setTimeout(r, 1000));

    // success state
    submitBtn.classList.add('success');
    btnText.textContent = '✅ sent!';

    // show a fun alert then reset
    setTimeout(() => {
        alert(`hey ${name}! 👋 got your ${subject}. Dipa to functional`);
        form.reset();
        pills.forEach((p, i) => p.classList.toggle('active', i === 0));
        setTimeout(() => {
            submitBtn.classList.remove('success');
            submitBtn.disabled = false;
            btnText.textContent = 'send it 🚀';
        }, 500);
    }, 400);
});


// ---- SKILL CARD TOUCH SUPPORT ----
// because flip cards on mobile are awkward without this
const skillCards = document.querySelectorAll('.skill-card');
skillCards.forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
    });
    // keyboard too — accessibility matters!
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'skill card, press to see details');
    card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.classList.toggle('flipped');
        }
    });
});


// ---- KONAMI CODE EASTER EGG ----
// because every junior dev's portfolio needs one
let keys = [];
const code = 'ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a';
document.addEventListener('keydown', e => {
    keys.push(e.key);
    keys = keys.slice(-10);
    if (keys.join(',') === code) launchEasterEgg();
});

function launchEasterEgg() {
    const box = document.createElement('div');
    box.style.cssText = `
    position:fixed; top:50%; left:50%;
    transform: translate(-50%,-50%);
    background: #1E1E2C; border: 1px solid rgba(255,107,71,.4);
    color: #F0EEF8; padding: 32px 48px;
    border-radius: 20px; text-align:center;
    font-family: 'Space Mono', monospace;
    z-index: 9999; line-height: 1.6;
    box-shadow: 0 32px 80px rgba(0,0,0,.8);
    animation: popIn .35s cubic-bezier(.16,1,.3,1) both;
  `;
    box.innerHTML = `
    <div style="font-size:2rem;margin-bottom:12px">🎉</div>
    <div style="font-size:1rem;font-weight:700;margin-bottom:6px">you found it!</div>
    <div style="font-size:.75rem;opacity:.5">konami code unlocked</div>
    <div style="font-size:.75rem;opacity:.4;margin-top:8px">most recruiters don't even get this far</div>
  `;
    // inject keyframe
    if (!document.getElementById('popInStyle')) {
        const s = document.createElement('style');
        s.id = 'popInStyle';
        s.textContent = '@keyframes popIn{from{opacity:0;transform:translate(-50%,-50%) scale(.6)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}';
        document.head.appendChild(s);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 4000);
}


// ---- CONSOLE MESSAGE ----
// for the nerds who open devtools
const s = [
    '%c🧑‍💻 hey dev!',
    '%c built with love (and a concerning amount of caffeine)',
    '%c alex@example.com — let\'s build something',
];
console.log(s[0], 'font-size:22px;font-weight:bold;color:#FF6B47;');
console.log(s[1], 'color:#7C3AED;font-size:13px;');
console.log(s[2], 'color:#34D399;font-size:13px;');