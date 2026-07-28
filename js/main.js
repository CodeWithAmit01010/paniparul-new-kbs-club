/* ==========================================================================
   1. INITIALIZATION & DATA STORES (Assets Paths Added)
   ========================================================================== */
const galleryData = [
    { id: 1, category: 'idol', title: 'Maa Saraswati Idol', src: 'assets/idol.png' },
    { id: 2, category: 'culture', title: 'Prize Distribution', src: 'assets/cultural.jpeg' },
    { id: 3, category: 'decoration', title: 'Pandal Lighting', src: 'assets/pandal.jpg' },
    { id: 4, category: 'idol', title: 'Program Stage Lighting', src: 'assets/programstagelight.jpeg' },
    { id: 5, category: 'culture', title: '❤️🤍💚🇮🇳 Independence Day Celebration', src: 'assets/celebration.jpeg' },
    { id: 6, category: 'decoration', title: '🍱 Food Distribution to Children', src: 'assets/food.jpeg' }
];

const membersData = [
    { name: "Arun Bera ",role: "President", age: 26, blood: "A+", since: "2018", photo: "assets/arun.jpeg" },
    { name: "Soumik Jana", role: "Secretary", age: 21, blood: "B+", since: "2018", photo: "assets/soumik.jpeg" },
    { name: "Rahul Maity", role: "Treasurer", age: 21, blood: "O+", since: "2018", photo: "assets/rahul.jpeg" },
    { name: "Bandan Maity", role: "Executive", age: 36, blood: "AB+", since: "2018", photo: "assets/bandan.jpeg" },
    { name: "Ranjit Jana", role: "Executive", age: 24, blood: "O+", since: "2028", photo: "assets/ranjit.jpeg" },
    { name: "Sourav Maity", role: "Executive", age: 38, blood: "B+", since: "2018", photo: "assets/member-default.jpg" }
];

let wishesData = [
    { name: "Anup Naskar", msg: "Wishing Paniparul New K.B.S Club a grand and prosperous Saraswati Puja!" },
    { name: "Bandan Maity", msg: "May Maa Saraswati bless all students with wisdom and knowledge." }
];

/* ==========================================================================
   2. DOM READY & CORE CONTROLLERS
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMouseGlow();
    initTypingEffect();
    initClockAndCountdown();
    renderGallery('all');
    renderMembers();
    renderWishes();
    initCanvasFX();
    initEasterEgg();
    autoThemeByTime();
    initMusicController();
});

// Header Background Scroll Handler
function initHeaderScroll() {
    const header = document.getElementById('header');
    const progress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll progress calculation
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPos = (window.scrollY / totalHeight) * 100;
        progress.style.width = scrollPos + '%';
    });

    // Mobile Hamburger Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Mouse Glow Tracking
function initMouseGlow() {
    const glow = document.getElementById('cursor-glow');
    window.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
}

// Typing Effect in Hero
function initTypingEffect() {
    const textArray = [
        "Preserving Traditional Heritage...",
        "Fostering Education & Devotion...",
        "Uniting Our Community Every Year..."
    ];
    let arrayIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const target = document.getElementById('hero-typing');

    function type() {
        const currentText = textArray[arrayIdx];
        if (isDeleting) {
            target.textContent = currentText.substring(0, charIdx - 1);
            charIdx--;
        } else {
            target.textContent = currentText.substring(0, charIdx + 1);
            charIdx++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIdx === currentText.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            arrayIdx = (arrayIdx + 1) % textArray.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }
    type();
}

/* ==========================================================================
   3. LIVE DIGITAL CLOCK & DYNAMIC SARASWATI PUJA COUNTDOWN
   ========================================================================== */
function initClockAndCountdown() {
    function updateClockAndCountdown() {
        const now = new Date();

        // IST Clock Display
        const istOffset = 5.5 * 60 * 60 * 1000;
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const istTime = new Date(utc + istOffset);

        document.getElementById('clock-time').textContent = istTime.toLocaleTimeString('en-IN');
        document.getElementById('clock-date').textContent = istTime.toLocaleDateString('en-IN', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

        // Dynamic target for Saraswati Puja (Basant Panchami roughly Feb 14)
        let targetYear = istTime.getFullYear();
        let pujaDate = new Date(targetYear, 1, 14, 8, 0, 0); 
        
        if (istTime > pujaDate) {
            pujaDate = new Date(targetYear + 1, 1, 14, 8, 0, 0); 
        }

        const diff = pujaDate - istTime;

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('cd-days').textContent = String(d).padStart(2, '0');
        document.getElementById('cd-hours').textContent = String(h).padStart(2, '0');
        document.getElementById('cd-mins').textContent = String(m).padStart(2, '0');
        document.getElementById('cd-secs').textContent = String(s).padStart(2, '0');
    }

    updateClockAndCountdown();
    setInterval(updateClockAndCountdown, 1000);
}

/* ==========================================================================
   4. GALLERY & LIGHTBOX CONTROLLER
   ========================================================================== */
function renderGallery(cat) {
    const grid = document.getElementById('gallery-grid');
    grid.innerHTML = '';

    const filtered = cat === 'all' ? galleryData : galleryData.filter(item => item.category === cat);

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'glass-card gallery-card';
        card.onclick = () => openLightbox(item.src);
        card.innerHTML = `
            <img src="${item.src}" alt="${item.title}" loading="lazy" onerror="this.src='assets/logo.png'">
            <div class="gallery-overlay">
                <h4 style="color:#fff;">${item.title}</h4>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterGallery(category, event) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    renderGallery(category);
}

function openLightbox(src) {
    const lb = document.getElementById('lightbox');
    document.getElementById('lightbox-img').src = src;
    lb.classList.add('active');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
}

/* ==========================================================================
   5. MEMBERS DIRECTORY CONTROLLER
   ========================================================================== */
function renderMembers() {
    const grid = document.getElementById('members-grid');
    const search = document.getElementById('member-search').value.toLowerCase();
    const roleFilter = document.getElementById('member-role-filter').value;

    grid.innerHTML = '';

    const filtered = membersData.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(search);
        const matchesRole = roleFilter === 'all' || m.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    filtered.forEach(m => {
        const card = document.createElement('div');
        card.className = 'glass-card member-card';
        card.innerHTML = `
            <img src="${m.photo}" alt="${m.name}" class="member-avatar" onerror="this.src='assets/logo.png'">
            <div class="member-name">${m.name}</div>
            <div class="member-role">${m.role}</div>
            <div class="member-details">
                Member Since: ${m.since}<br>
                Blood Group: ${m.blood}
            </div>
        `;
        grid.appendChild(card);
    });
}

/* ==========================================================================
   6. VISITOR WISH WALL
   ========================================================================== */
function renderWishes() {
    const grid = document.getElementById('wish-wall-grid');
    grid.innerHTML = '';

    wishesData.forEach(w => {
        const card = document.createElement('div');
        card.className = 'glass-card wish-card';
        card.innerHTML = `
            <div class="wish-author">${w.name}</div>
            <div class="wish-msg">"${w.msg}"</div>
        `;
        grid.appendChild(card);
    });
}

function handleWishSubmit(e) {
    e.preventDefault();
    const nameInput = document.getElementById('wish-name');
    const msgInput = document.getElementById('wish-message');

    if (nameInput.value && msgInput.value) {
        wishesData.unshift({
            name: nameInput.value,
            msg: msgInput.value
        });
        renderWishes();
        nameInput.value = '';
        msgInput.value = '';
        alert('Thank you! Your Saraswati Puja wish has been posted to the wall.');
    }
}

/* ==========================================================================
   7. INTERACTIVE VIRTUAL RITUALS (Diya & Pushpanjali Physics)
   ========================================================================== */
function toggleDiya() {
    const diya = document.getElementById('virtual-diya');
    const status = document.getElementById('diya-status');
    diya.classList.toggle('lit');

    if (diya.classList.contains('lit')) {
        status.textContent = 'Lit & Blessed ✨';
        status.style.color = 'var(--accent-gold-light)';
    } else {
        status.textContent = 'Click to light';
        status.style.color = 'var(--accent-gold)';
    }
}

function offerPushpanjali() {
    for (let i = 0; i < 35; i++) {
        spawnPetal();
    }
    alert('🌸 Pushpanjali offered to Goddess Saraswati! May wisdom and prosperity fill your life.');
}

/* ==========================================================================
   8. CANVAS ENGINE FOR FLOWER PETALS & PARTICLES
   ========================================================================== */
let petals = [];
function initCanvasFX() {
    const canvas = document.getElementById('fx-canvas');
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        petals.forEach((p, idx) => {
            p.y += p.speedY;
            p.x += Math.sin(p.angle) * p.speedX;
            p.angle += 0.02;
            p.rotation += p.rotSpeed;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            if (p.y > canvas.height + 20) {
                petals.splice(idx, 1);
            }
        });

        requestAnimationFrame(animate);
    }
    animate();
}

function spawnPetal() {
    const colors = ['#f39c12', '#e67e22', '#f1c40f', '#e74c3c', '#ffffff'];
    petals.push({
        x: Math.random() * window.innerWidth,
        y: -20,
        size: Math.random() * 8 + 6,
        speedY: Math.random() * 2 + 1.5,
        speedX: Math.random() * 1.5 + 0.5,
        angle: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: Math.random() * 0.05 - 0.025,
        color: colors[Math.floor(Math.random() * colors.length)]
    });
}

/* ==========================================================================
   9. REAL AUDIO MP3 CONTROLLER (Autoplay + Toggle for assets/music.mp3)
   ========================================================================== */
function initMusicController() {
    const audio = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-toggle');
    let isPlaying = false;
    
    function playAudio() {
        audio.play().then(() => {
            isPlaying = true;
            musicBtn.style.background = 'var(--accent-gold)';
            musicBtn.style.color = 'var(--bg-primary)';
        }).catch(err => {
            console.log("Autoplay waiting for user interaction...");
        });
    }

    function pauseAudio() {
        audio.pause();
        isPlaying = false;
        musicBtn.style.background = 'rgba(255,255,255,0.05)';
        musicBtn.style.color = 'var(--accent-gold)';
    }

    // Manual toggle button
    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isPlaying) {
            playAudio();
        } else {
            pauseAudio();
        }
    });

    // Autoplay on first scroll/touch/click
    function handleFirstUserInteraction() {
        if (!isPlaying) {
            playAudio();
        }
        window.removeEventListener('scroll', handleFirstUserInteraction);
        window.removeEventListener('click', handleFirstUserInteraction);
        window.removeEventListener('touchstart', handleFirstUserInteraction);
    }

    window.addEventListener('scroll', handleFirstUserInteraction, { once: true });
    window.addEventListener('click', handleFirstUserInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstUserInteraction, { once: true });
}

/* ==========================================================================
   10. THEME SWITCHER & EASTER EGG ("KBS")
   ========================================================================== */
const themeBtn = document.getElementById('theme-toggle');
themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        themeBtn.textContent = '🌙';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeBtn.textContent = '☀️';
    }
});

function autoThemeByTime() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) {
        document.documentElement.setAttribute('data-theme', 'light');
        themeBtn.textContent = '☀️';
    }
}

function initEasterEgg() {
    let keyBuffer = '';
    window.addEventListener('keydown', (e) => {
        keyBuffer += e.key.toUpperCase();
        if (keyBuffer.length > 3) {
            keyBuffer = keyBuffer.substring(keyBuffer.length - 3);
        }
        if (keyBuffer === 'KBS') {
            const banner = document.getElementById('easter-egg-banner');
            banner.classList.add('active');
            for (let i = 0; i < 50; i++) spawnPetal();
            setTimeout(() => {
                banner.classList.remove('active');
            }, 5000);
        }
    });
}