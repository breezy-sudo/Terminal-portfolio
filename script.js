const apps = {
    terminal: {
        glyph: '>_', label: 'terminal', x: 40, y: 50, w: 520, h: 380,
        html: `
                    <pre class="banner">+---------------------+
| b r e e z y s u d o |
| status: building    |
+---------------------+</pre>
                    <div id="boot-text">visitor@breezyos:~$ type help<br><span class="meta">psst: try sudo hire-me</span></div>
                    <div id="output"></div>
                    <div id="input-line">
                        <span>&gt;&gt;</span>
                        <input type="text" id="command-input" aria-label="command" autocomplete="off" spellcheck="false" />
                    </div>`
    },
    about: {
        glyph: '@', label: 'about', x: 340, y: 90, w: 480, h: 440,
        html: `
                    <h2>identity.txt</h2>
                    <p>I'm a developer who likes to understand how things work, not just how to use them.</p>

                    <p>I didnt get into development because i wanted to just write code. I like figuring things out.</p>

                    <p>Give me something i dont understand and i'll keep digging until it starts making sense. Most of what i've learnt has come from building, breaking, fixing and building again.</p>
                    
                    <p> I've been building my skills by working on real projects, making mistakes and figuring things out along the way.
                    From frontend to backend systems, every project has taught me something new.
                    </p>

                    <p>I'm still growing, but i'mnot trying to look like i know everything.
                    I care more about getting better, building things that work, and understanding the code behind them.
                    </p>

                    <ul class="plain-list">
                        <li>I learn by building.</li>
                        <li>I turn mistakes into experience.</li>
                        <li>Growth is a system.</li>
                        <li> I'm always working on the next thing.</li>
                    </ul>
                    <p class="meta">Foundation mode. Consistency over noise. Execution over hype.</p>`
    },
    skills: {
        glyph: '{}', label: 'skills', x: 120, y: 90, w: 400, h: 320,
        html: `
                    <h2>skills.dir</h2>
                    <ul class="plain-list">
                        <li>HTML5</li>
                        <li>CSS</li>
                        <li>JavaScript</li>
                        <li>Scratch</li>
                    </ul>`
    },
    work: {
        glyph: '</>', label: 'work', x: 200, y: 70, w: 460, h: 380,
        html: `
                    <h2>github.feed</h2>
                    <ul class="plain-list" id="repo-list"><li class="meta">fetching...</li></ul>
                    <p class="note" id="repo-note"></p>`
    },
    contact: {
        glyph: '✉', label: 'contact', x: 260, y: 90, w: 440, h: 340,
        html: `
                    <h2>contact.cfg</h2>
                    <p><a href="https://mail.google.com/mail/?view=cm&fs=1&to=usmanmbilkisu@gmail.com" target="_blank" rel="noopener">send me an email</a></p>
                    <ul class="plain-list">
                        <li>GITHUB: <a href="https://github.com/breezysudo" target="_blank" rel="noopener">github.com/breezysudo</a></li>
                        <li>LINKEDIN: <a href="https://www.linkedin.com/in/breezysudo" target="_blank" rel="noopener">linkedin.com/in/breezysudo</a></li>
                        <li>X: <a href="https://x.com/@breezySudo" target="_blank" rel="noopener">x.com/@breezySudo</a></li>
                    </ul>`
    }
};

const desktop = document.getElementById('desktop');
const dock = document.getElementById('dock');
const isMobile = () => window.innerWidth < 768;
let topZ = 10;

/* ---------- build windows + dock from the apps object ---------- */
Object.entries(apps).forEach(([id, app]) => {
    const win = document.createElement('section');
    win.className = 'win';
    win.id = 'win-' + id;
    win.innerHTML = `
                <div class="titlebar">
                    <span class="name">${app.label}</span>
                    <button class="close" aria-label="Close ${app.label}">x</button>
                </div>
                <div class="body">${app.html}</div>`;
    desktop.appendChild(win);

    win.addEventListener('pointerdown', () => focusWindow(id));
    win.querySelector('.close').addEventListener('click', () => closeWindow(id));
    makeDraggable(win, win.querySelector('.titlebar'));

    const btn = document.createElement('button');
    btn.className = 'dock-item';
    btn.id = 'dock-' + id;
    btn.innerHTML = `<span class="glyph">${app.glyph}</span><span class="label">${app.label}</span>`;
    btn.addEventListener('click', () => openWindow(id));
    dock.appendChild(btn);
});

/* sizes to the screen, never past it. on mobile it clears inline styles
   so the full-screen CSS rule can win (inline left/top beat stylesheet inset) */
function placeWindow(id) {
    const win = document.getElementById('win-' + id);
    if (isMobile()) {
        win.style.left = win.style.top = win.style.width = win.style.height = '';
        return;
    }
    const app = apps[id];
    const dockSpace = 96;
    const w = Math.min(app.w, window.innerWidth - 24);
    const h = Math.min(app.h, window.innerHeight - 34 - dockSpace);
    const wantLeft = win.style.left ? parseInt(win.style.left, 10) : app.x;
    const wantTop = win.style.top ? parseInt(win.style.top, 10) : app.y;
    win.style.width = w + 'px';
    win.style.height = h + 'px';
    win.style.left = Math.max(12, Math.min(wantLeft, window.innerWidth - w - 12)) + 'px';
    win.style.top = Math.max(8, Math.min(wantTop, window.innerHeight - 34 - h - dockSpace)) + 'px';
}

window.addEventListener('resize', function () {
    document.querySelectorAll('.win.open').forEach(w => placeWindow(w.id.replace('win-', '')));
});

function openWindow(id) {
    placeWindow(id);
    if (isMobile()) {
        document.querySelectorAll('.win.open').forEach(w => w.classList.remove('open'));
    }
    document.getElementById('win-' + id).classList.add('open');
    focusWindow(id);
    if (id === 'work') loadRepos();
    if (id === 'terminal' && !isMobile()) document.getElementById('command-input').focus();
}

function closeWindow(id) {
    document.getElementById('win-' + id).classList.remove('open');
    document.getElementById('dock-' + id).classList.remove('active');
}

function focusWindow(id) {
    topZ++;
    document.getElementById('win-' + id).style.zIndex = topZ;
    document.querySelectorAll('.dock-item').forEach(b => b.classList.remove('active'));
    document.getElementById('dock-' + id).classList.add('active');
}

function makeDraggable(win, handle) {
    handle.addEventListener('pointerdown', function (event) {
        if (isMobile() || event.target.closest('.close')) return;
        const offsetX = event.clientX - win.offsetLeft;
        const offsetY = event.clientY - win.offsetTop;
        handle.setPointerCapture(event.pointerId);
        handle.style.cursor = 'grabbing';

        function move(e) {
            win.style.left = Math.max(0, e.clientX - offsetX) + 'px';
            win.style.top = Math.max(0, e.clientY - offsetY) + 'px';
        }

        function drop() {
            handle.style.cursor = '';
            handle.removeEventListener('pointermove', move);
            handle.removeEventListener('pointerup', drop);
        }

        handle.addEventListener('pointermove', move);
        handle.addEventListener('pointerup', drop);
    });
}

/* ---------- boot sequence (fast, skippable) ---------- */
const bootLines = [
    'breezyOS v1.0.0',
    'checking memory............ ok',
    'loading identity........... ok',
    'mounting github.feed....... ok',
    'reading the clock.......... ok',
    '',
    'welcome, visitor.'
];
const boot = document.getElementById('boot');
const bootOut = document.getElementById('boot-lines');
let bootIndex = 0;
let bootTimer;

function runBoot() {
    if (bootIndex < bootLines.length) {
        bootOut.textContent += bootLines[bootIndex++] + '\n';
        bootTimer = setTimeout(runBoot, 220);
    } else {
        bootTimer = setTimeout(endBoot, 500);
    }
}

function endBoot() {
    clearTimeout(bootTimer);
    boot.classList.add('gone');
    if (!isMobile()) {
        openWindow('terminal');
        openWindow('about');
        focusWindow('terminal');
    }
}

boot.addEventListener('click', endBoot);
document.addEventListener('keydown', function skip() {
    if (!boot.classList.contains('gone')) endBoot();
    document.removeEventListener('keydown', skip);
});
runBoot();

/* ---------- time of day: greeting + soft dawn/dusk haze (day looks like night) ---------- */
const greetings = {
    dawn: 'early start. welcome.',
    day: 'good day. welcome.',
    dusk: 'good evening. welcome.',
    night: 'still up? welcome.'
};
const clock = document.getElementById('clock');

function periodFor(hour) {
    if (hour >= 5 && hour < 9) return 'dawn';
    if (hour >= 9 && hour < 17) return 'day';
    if (hour >= 17 && hour < 20) return 'dusk';
    return 'night';
}

function tick() {
    const now = new Date();
    const period = periodFor(now.getHours());
    document.body.dataset.time = period;
    document.getElementById('hello').textContent = greetings[period];
    clock.textContent = now.toTimeString().slice(0, 5);
}

tick();
setInterval(tick, 10000);

/* live uptime in the welcome panel */
const started = Date.now();
setInterval(function () {
    const secs = Math.floor((Date.now() - started) / 1000);
    document.getElementById('uptime').textContent = Math.floor(secs / 60) + 'm ' + (secs % 60) + 's';
}, 1000);

/* ---------- live github feed, with an honest fallback ---------- */
let reposLoaded = false;

async function loadRepos() {
    if (reposLoaded) return;
    const list = document.getElementById('repo-list');
    const note = document.getElementById('repo-note');
    try {
        const res = await fetch('https://api.github.com/users/breezysudo/repos?sort=updated&per_page=5');
        if (!res.ok) throw new Error(res.status);
        const repos = await res.json();
        list.innerHTML = repos.map(r => `
                    <li><a href="${r.html_url}" target="_blank" rel="noopener">${r.name}</a>
                    <div class="meta">${r.language || 'misc'} / updated ${new Date(r.pushed_at).toLocaleDateString()}</div></li>`).join('');
        note.textContent = 'live from github.com/breezysudo';
        reposLoaded = true;
    } catch (err) {
        list.innerHTML = `
                    <li>sample-project<div class="meta">JavaScript / updated recently</div></li>
                    <li>another-sample<div class="meta">HTML / updated recently</div></li>`;
        note.textContent = 'live feed is blocked inside this preview, so these are sample rows. On your deployed site it will fetch your real repos.';
    }
}

/* ---------- terminal: your commands, same numbering ---------- */
const input = document.getElementById('command-input');
const output = document.getElementById('output');
let typingRun = 0;

const appNames = ['about', 'skills', 'work', 'contact'];

const commands = {
    help: 'Available commands:\n  open <about | skills | work | contact>\n  whoami\n  fortune\n  sudo hire-me\n  clear',
    whoami: 'breezysudo / status: building / I debug, I ship.',
    'sudo hire-me': 'HIRE ME\n-------\nopen to: freelance web projects, collaboration with teams abroad, support and communication roles\nstack: HTML5, CSS, JavaScript\n\nreach me: <a href="https://mail.google.com/mail/?view=cm&fs=1&to=usmanmbilkisu@gmail.com" target="_blank" rel="noopener">send me an email</a>  (or type: open contact)'
};

const fortunes = [
    'Bugs are puzzles.',
    'Errors are feedback.',
    'Growth is a system.',
    'Consistency over noise.',
    'Execution over hype.',
    'Progress, not promises.',
    'While most people wait, I ship.'
];

input.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter') return;
    const cmd = input.value.trim().toLowerCase();
    input.value = '';

    if (cmd === 'clear') {
        typingRun++;
        output.innerHTML = '';
        return;
    }

    if (cmd.startsWith('open ')) {
        const name = cmd.slice(5).trim();
        if (appNames.includes(name)) {
            openWindow(name);
            typeWriter(output, 'opening ' + name + '...', 18);
        } else {
            typeWriter(output, 'open what? try: ' + appNames.join(', '), 18);
        }
        return;
    }

    if (cmd === 'fortune') {
        typeWriter(output, fortunes[Math.floor(Math.random() * fortunes.length)], 18);
        return;
    }

    typeWriter(output, commands[cmd] || 'Unauthorized access is logged', 18);
});

/* types plain text first, then swaps in real HTML so links work.
   typingRun lets a new command cancel the old one mid-type */
function typeWriter(element, html, speed) {
    const run = ++typingRun;
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const text = temp.textContent || '';
    let i = 0;
    element.textContent = '';

    function type() {
        if (run !== typingRun) return;
        if (i < text.length) {
            element.textContent = text.substring(0, ++i);
            setTimeout(type, speed);
        } else {
            element.innerHTML = html;
        }
    }
    type();
}
