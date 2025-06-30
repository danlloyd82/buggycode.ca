import { bugSVG, splatSVG, swatterSVG } from './bug_assets.js';

const bugCounter = document.getElementById('bug-counter');
let bugsSwatted = 0;
let bugs = [];
let splats = [];
let swatterCursor = null;

function createSVGElement(svgString) {
    const div = document.createElement('div');
    div.innerHTML = svgString;
    return div.firstChild;
}

function setRotation(el, angleDeg) {
    el.style.transform = `rotate(${angleDeg}deg)`;
    el.style.transformOrigin = '50% 50%';
}

function randomPos() {
    const w = window.innerWidth - 32;
    const h = window.innerHeight - 32;
    return [Math.random() * w, Math.random() * h];
}

function randomDir() {
    const angle = Math.random() * 2 * Math.PI;
    // Slow down bugs by half
    const speed = (0.5 + Math.random() * 1.5) / 2;
    return [Math.cos(angle) * speed, Math.sin(angle) * speed];
}

function spawnBug() {
    const [x, y] = randomPos();
    const [dx, dy] = randomDir();
    const bug = document.createElement('div');
    bug.className = 'bug';
    bug.style.left = x + 'px';
    bug.style.top = y + 'px';
    bug.style.cursor = 'inherit';
    const bugSVGEl = createSVGElement(bugSVG);
    // Set initial rotation
    const angleRad = Math.atan2(dy, dx);
    const angleDeg = angleRad * (180 / Math.PI) + 90;
    setRotation(bugSVGEl, angleDeg);
    // Draw bug SVG 32px lower visually
    bugSVGEl.style.position = 'relative';
    bugSVGEl.style.top = '32px';
    bug.appendChild(bugSVGEl);
    document.body.appendChild(bug);
    const bugObj = { el: bug, x, y, dx, dy, alive: true, angleDeg };
    bugs.push(bugObj);
// Remove per-bug mouseenter/mouseleave cursor logic to avoid conflicts with global handler
bug.addEventListener('mouseenter', () => {});
bug.addEventListener('mouseleave', () => {});
    bug.addEventListener('mousedown', (e) => {
        if (!bugObj.alive) return;
        bugObj.alive = false;
        // Shrink swatter cursor for 100ms before splat (less shrink)
        const shrinkCursor = `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g transform="scale(0.85,0.6) translate(2.4,4)">${swatterSVG.replace(/^[^>]+>|<\/svg>$/g, '')}</g></svg>`;
        document.body.style.cursor = `url('data:image/svg+xml;utf8,${encodeURIComponent(shrinkCursor)}') 16 16, pointer`;
        setTimeout(() => {
            bug.style.display = 'none';
            showSplat(bugObj.x, bugObj.y, bugObj.angleDeg);
            bugsSwatted++;
            bugCounter.textContent = bugsSwatted;
            // Remove dead bug from array
            bugs = bugs.filter(b => b !== bugObj);
        }, 100);
    });
}

function showSplat(x, y, angleDeg = 0) {
    const splat = document.createElement('div');
    splat.className = 'splat';
    splat.style.left = x + 'px';
    // Draw splat SVG 32px lower visually to match bug
    splat.style.top = (y + 32) + 'px';
    const splatSVGEl = createSVGElement(splatSVG);
    setRotation(splatSVGEl, angleDeg);
    splat.appendChild(splatSVGEl);
    document.body.appendChild(splat);
    splats.push(splat);
    setTimeout(() => {
        splat.remove();
        splats = splats.filter(s => s !== splat);
    }, 1200 + Math.random() * 1000);
}

function moveBugs() {
    for (const bug of bugs) {
        if (!bug.alive) continue;
        bug.x += bug.dx;
        bug.y += bug.dy;
        // Bounce off edges
        if (bug.x < 0 || bug.x > window.innerWidth - 32) bug.dx *= -1;
        if (bug.y < 0 || bug.y > window.innerHeight - 32) bug.dy *= -1;
        bug.x = Math.max(0, Math.min(window.innerWidth - 32, bug.x));
        bug.y = Math.max(0, Math.min(window.innerHeight - 32, bug.y));
        bug.el.style.left = bug.x + 'px';
        bug.el.style.top = bug.y + 'px';
        // Update rotation
        const bugSVGEl = bug.el.querySelector('svg');
        if (bugSVGEl) {
            const angleRad = Math.atan2(bug.dy, bug.dx);
            const angleDeg = angleRad * (180 / Math.PI) + 90;
            setRotation(bugSVGEl, angleDeg);
            bug.angleDeg = angleDeg;
        }
        // Randomly change direction
        if (Math.random() < 0.01) {
            const [ndx, ndy] = randomDir();
            bug.dx = ndx;
            bug.dy = ndy;
        }
    }
}

function spawnLoop() {
    if (bugs.length < 8) {
        spawnBug();
    }
    setTimeout(spawnLoop, 1200 + Math.random() * 2000);
}

function animate() {
    moveBugs();
    requestAnimationFrame(animate);
}

// Cursor swatter on bugs
window.addEventListener('mousemove', (e) => {
    let minDist = Infinity;
    let overBug = false;
    // Use elementFromPoint to check if the mouse is over a bug element
    const elem = document.elementFromPoint(e.clientX, e.clientY);
    if (elem && elem.closest && elem.closest('.bug')) {
        overBug = true;
    }
    for (const bug of bugs) {
        if (!bug.alive) continue;
        const bx = bug.x + 16, by = bug.y + 16;
        const dist = Math.hypot(e.clientX - bx, e.clientY - by);
        if (dist < minDist) minDist = dist;
    }
    if (overBug) {
        // Always show swatter when directly over a bug
        document.body.style.cursor = `url('data:image/svg+xml;utf8,${encodeURIComponent(swatterSVG)}') 16 16, pointer`;
    } else if (minDist < 50) {
        // Show swatter when near a bug
        document.body.style.cursor = `url('data:image/svg+xml;utf8,${encodeURIComponent(swatterSVG)}') 16 16, pointer`;
    } else {
        document.body.style.cursor = '';
    }
});

window.addEventListener('mousedown', (e) => {
    // If not on a bug, show a swat animation? (optional)
});

window.addEventListener('resize', () => {
    // Keep bugs in bounds
    for (const bug of bugs) {
        bug.x = Math.max(0, Math.min(window.innerWidth - 32, bug.x));
        bug.y = Math.max(0, Math.min(window.innerHeight - 32, bug.y));
        bug.el.style.left = bug.x + 'px';
        bug.el.style.top = bug.y + 'px';
    }
});

spawnLoop();
animate();
