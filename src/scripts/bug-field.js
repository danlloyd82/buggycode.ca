import { bugSVG, splatSVG, swatterSVG } from './bug-assets.js';

const BUG_SIZE = 32;
const BUG_HALF = BUG_SIZE / 2;
const MAX_BUGS = 7;
const MIN_SPEED = 26;
const MAX_SPEED = 88;
const ACCEL = 90;
const DECEL = 170;
const TURN_GAIN = 1.8;
const REST_CHANCE = 0.14;
const MIN_REST = 0.35;
const MAX_REST = 1.5;
const SPLAT_MS = 1100;
const MAX_FRAME_SECONDS = 0.05;
const TAU = Math.PI * 2;
const RAD_TO_DEG = 180 / Math.PI;

const MOUSE_HIT_RADIUS = 24;
const TOUCH_HIT_RADIUS = 44;
const CURSOR_RADIUS = 44;

// Each bug is one of the three polarities, so the swarm reads as a mix
// rather than a single colour.
const POLARITIES = ['cyan', 'magenta', 'gold'];

// Bugs must never steal a click meant for the page.
const INTERACTIVE = 'a, button, input, select, textarea, summary, [role="button"], [role="link"], [contenteditable="true"]';

const squashedSwatter = `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g transform="scale(0.9 0.55) translate(3.56 16.36)">${swatterSVG.replace(/^[^>]+>|<\/svg>$/g, '')}</g></svg>`;

const CURSORS = {
    swatter: `url('data:image/svg+xml;utf8,${encodeURIComponent(swatterSVG)}') 32 20, pointer`,
    squish: `url('data:image/svg+xml;utf8,${encodeURIComponent(squashedSwatter)}') 32 20, pointer`,
};

function createSVGElement(svgString) {
    const div = document.createElement('div');
    div.innerHTML = svgString;
    return div.firstChild;
}

function wrapAngle(angle) {
    return angle - TAU * Math.floor((angle + Math.PI) / TAU);
}

function isInteractive(target) {
    return target instanceof Element && target.closest(INTERACTIVE) !== null;
}

export function createBugField({ layer, onScore }) {
    const bugs = [];
    let swatted = 0;
    let enabled = false;
    let cursorName = '';
    let squishTimer = 0;
    let rafId = 0;
    let previousTime = 0;
    let spawnCooldown = 0;
    let listening = false;

    const width = () => layer.clientWidth || window.innerWidth;
    const height = () => layer.clientHeight || window.innerHeight;
    const maxX = () => Math.max(0, width() - BUG_SIZE);
    const maxY = () => Math.max(0, height() - BUG_SIZE);

    function setCursor(name) {
        if (name === cursorName) return;
        cursorName = name;
        document.body.style.cursor = name ? CURSORS[name] : '';
    }

    function applyHeading(bug) {
        bug.svg.style.transform = `rotate(${bug.heading * RAD_TO_DEG + 90}deg)`;
    }

    function applyGait(bug) {
        const seconds = Math.min(1.1, Math.max(0.18, 22 / Math.max(bug.speed, 8)));
        const gait = seconds.toFixed(2) + 's';
        if (gait === bug.gait) return;
        bug.gait = gait;
        bug.svg.style.setProperty('--gait', gait);
    }

    function spawnBug() {
        const cruise = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
        const polarity = POLARITIES[Math.floor(Math.random() * POLARITIES.length)];
        const el = document.createElement('div');
        el.className = 'bug';
        el.dataset.polarity = polarity;
        const svg = createSVGElement(bugSVG);
        el.appendChild(svg);
        layer.appendChild(el);

        const bug = {
            el,
            svg,
            polarity,
            x: Math.random() * maxX(),
            y: Math.random() * maxY(),
            heading: Math.random() * TAU,
            speed: cruise * 0.5,
            cruise,
            restUntil: 0,
            phase: Math.random() * TAU,
            wanderRate: 0.8 + Math.random() * 1.2,
            seed: Math.random() * TAU,
            gait: '',
        };

        el.style.transform = `translate3d(${bug.x}px, ${bug.y}px, 0)`;
        applyHeading(bug);
        applyGait(bug);
        bugs.push(bug);
    }

    /** Nearest live bug to a point, within `radius` of its centre. */
    function hitTest(x, y, radius) {
        let closest = null;
        let closestDist = radius;
        for (const bug of bugs) {
            const dist = Math.hypot(x - (bug.x + BUG_HALF), y - (bug.y + BUG_HALF));
            if (dist < closestDist) {
                closestDist = dist;
                closest = bug;
            }
        }
        return closest;
    }

    function showSplat(x, y, angleDeg, polarity) {
        const el = document.createElement('div');
        el.className = 'splat';
        el.dataset.polarity = polarity;
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        const svg = createSVGElement(splatSVG);
        svg.style.transform = `rotate(${angleDeg}deg)`;
        el.appendChild(svg);
        layer.appendChild(el);
        setTimeout(() => el.remove(), SPLAT_MS);
    }

    function swat(bug, showSquish) {
        const index = bugs.indexOf(bug);
        if (index === -1) return;

        bugs.splice(index, 1);
        showSplat(bug.x, bug.y, bug.heading * RAD_TO_DEG + 90, bug.polarity);
        bug.el.remove();

        if (onScore) onScore(++swatted);

        if (showSquish) {
            setCursor('squish');
            clearTimeout(squishTimer);
            squishTimer = setTimeout(() => setCursor(''), 120);
        }
    }

    function update(dt) {
        const limitX = maxX();
        const limitY = maxY();

        for (const bug of bugs) {
            if (bug.restUntil > 0) {
                bug.restUntil -= dt;
                bug.speed = Math.max(0, bug.speed - DECEL * dt);
            } else {
                bug.speed = Math.min(bug.cruise, bug.speed + ACCEL * dt);
                bug.phase = (bug.phase + bug.wanderRate * dt) % TAU;
                const steer = Math.sin(bug.phase) + 0.55 * Math.sin(bug.phase * 2.3 + bug.seed);
                bug.heading = wrapAngle(bug.heading + steer * TURN_GAIN * dt);
                if (Math.random() < REST_CHANCE * dt) {
                    bug.restUntil = MIN_REST + Math.random() * (MAX_REST - MIN_REST);
                }
            }

            const step = bug.speed * dt;
            bug.x += Math.cos(bug.heading) * step;
            bug.y += Math.sin(bug.heading) * step;

            if (bug.x <= 0) {
                bug.x = 0;
                bug.heading = wrapAngle(Math.PI - bug.heading);
            } else if (bug.x >= limitX) {
                bug.x = limitX;
                bug.heading = wrapAngle(Math.PI - bug.heading);
            }

            if (bug.y <= 0) {
                bug.y = 0;
                bug.heading = wrapAngle(-bug.heading);
            } else if (bug.y >= limitY) {
                bug.y = limitY;
                bug.heading = wrapAngle(-bug.heading);
            }

            bug.el.style.transform = `translate3d(${bug.x}px, ${bug.y}px, 0)`;
            applyHeading(bug);
            applyGait(bug);
        }
    }

    function animate(now) {
        const dt = previousTime ? Math.min((now - previousTime) / 1000, MAX_FRAME_SECONDS) : 0;
        previousTime = now;

        update(dt);

        spawnCooldown -= dt;
        if (spawnCooldown <= 0) {
            if (bugs.length < MAX_BUGS) spawnBug();
            spawnCooldown = 1.2 + Math.random() * 2;
        }

        rafId = requestAnimationFrame(animate);
    }

    function onPointerDown(event) {
        if (!enabled || !event.isPrimary) return;
        // A click on a link or button belongs to the page. Step aside.
        if (isInteractive(event.target)) return;

        const radius = event.pointerType === 'mouse' ? MOUSE_HIT_RADIUS : TOUCH_HIT_RADIUS;
        const bug = hitTest(event.clientX, event.clientY, radius);
        if (!bug) return;

        if (event.pointerType !== 'mouse') event.preventDefault();
        swat(bug, event.pointerType === 'mouse');
    }

    function onMouseMove(event) {
        if (!enabled) return;
        clearTimeout(squishTimer);
        if (isInteractive(event.target)) {
            setCursor('');
            return;
        }
        setCursor(hitTest(event.clientX, event.clientY, CURSOR_RADIUS) ? 'swatter' : '');
    }

    function onResize() {
        const limitX = maxX();
        const limitY = maxY();
        for (const bug of bugs) {
            bug.x = Math.max(0, Math.min(limitX, bug.x));
            bug.y = Math.max(0, Math.min(limitY, bug.y));
            bug.el.style.transform = `translate3d(${bug.x}px, ${bug.y}px, 0)`;
        }
    }

    function listen(on) {
        if (on === listening) return;
        listening = on;
        const method = on ? 'addEventListener' : 'removeEventListener';
        window[method]('pointerdown', onPointerDown);
        window[method]('mousemove', onMouseMove);
        window[method]('resize', onResize);
    }

    function clearBugs() {
        for (const bug of bugs) bug.el.remove();
        bugs.length = 0;
        for (const splat of layer.querySelectorAll('.splat')) splat.remove();
    }

    function setEnabled(next) {
        if (next === enabled) return;
        enabled = next;

        if (enabled) {
            previousTime = 0;
            spawnCooldown = 0;
            listen(true);
            rafId = requestAnimationFrame(animate);
        } else {
            listen(false);
            cancelAnimationFrame(rafId);
            rafId = 0;
            clearTimeout(squishTimer);
            clearBugs();
            setCursor('');
        }
    }

    return {
        setEnabled,
        isEnabled: () => enabled,
        getScore: () => swatted,
        destroy: () => setEnabled(false),
    };
}
