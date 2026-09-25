import { createBugField } from './bug-field.js';

const illustrationId = Number(new URLSearchParams(window.location.search).get('illustration') || 6);
const heroArt = document.querySelector('.hero-art');
const illustrationFiles = [
    '01-screenprint.webp',
    '02-pixel-beetle.webp',
    '03-etched-crawler.webp',
    '04-glossy-beetle.webp',
    '05-pocket-mascot.webp',
    '06-pixel-crawler-wry.webp',
];
if (heroArt && illustrationId >= 1 && illustrationId <= illustrationFiles.length) {
    const image = document.createElement('img');
    image.className = 'hero-illustration-choice';
    image.src = new URL(`./illustrations/${illustrationFiles[illustrationId - 1]}`, import.meta.url).href;
    image.alt = '';
    heroArt.classList.add('is-illustration-preview');
    heroArt.replaceChildren(image);
}

const layer = document.getElementById('bug-field');
const toggle = document.getElementById('bug-toggle');
const headerScore = document.getElementById('squash-count');

if (layer && toggle) {
    let enabled = false;
    const field = createBugField({
        layer,
        onScore(count) {
            const score = String(count).padStart(3, '0');
            if (headerScore) headerScore.textContent = score;
        },
    });

    toggle.addEventListener('click', () => {
        enabled = !enabled;
        layer.hidden = !enabled;
        field.setEnabled(enabled);
        toggle.setAttribute('aria-pressed', String(enabled));
        toggle.querySelector('span:last-child').textContent = enabled ? 'Pause hunt' : 'Bug hunt';
        toggle.setAttribute('aria-label', enabled ? 'Pause bug hunt' : 'Start bug hunt');
    });
}

const rack = document.querySelector('.cartridge-rack');
const handheld = document.getElementById('handheld');
const screen = document.getElementById('screen');
const channelOsd = document.getElementById('channel-osd');
const screenImage = document.getElementById('screen-image');
const screenCode = document.getElementById('screen-code');
const screenState = document.getElementById('screen-state');
const screenCopy = document.getElementById('screen-copy');
const screenTitle = document.getElementById('screen-title');
const screenDescription = document.getElementById('screen-description');
const deviceAction = document.getElementById('device-action');
const idleScreen = document.querySelector('.screen-idle');
const powerSwitch = document.getElementById('console-power');
const modeSwitch = document.getElementById('console-mode');
const modeLabel = document.getElementById('console-mode-label');
const resetSwitch = document.getElementById('console-reset');
const deviceActionLabel = deviceAction?.querySelector('.device-action-label');
const CRT_ON_MS = 620;
const CRT_OFF_MS = 460;
const CHANNEL_OSD_MS = 2000;
let powerTransitionId = 0;
let powerTransitionFrame = 0;
let powerTransitionTimer = 0;
let channelOsdTimer = 0;
let selectedCartridge = null;

function showChannelOsd() {
    clearTimeout(channelOsdTimer);
    channelOsd?.classList.add('is-visible');
    channelOsdTimer = window.setTimeout(() => channelOsd?.classList.remove('is-visible'), CHANNEL_OSD_MS);
}

function setConsolePower(powered) {
    const transitionId = ++powerTransitionId;
    cancelAnimationFrame(powerTransitionFrame);
    clearTimeout(powerTransitionTimer);
    clearTimeout(channelOsdTimer);
    channelOsd?.classList.remove('is-visible');

    powerSwitch?.setAttribute('aria-pressed', String(powered));
    powerSwitch?.classList.toggle('is-on', powered);
    screen?.classList.remove('is-powering-on', 'is-powering-off');
    if (deviceAction) deviceAction.hidden = true;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        handheld?.classList.toggle('is-off', !powered);
        if (screenState) screenState.textContent = powered ? 'POWER ON' : 'POWER OFF';
        if (powered) {
            if (selectedCartridge && deviceAction) deviceAction.hidden = false;
            showChannelOsd();
        }
        return;
    }

    if (screenState) screenState.textContent = powered ? 'POWERING ON' : 'POWERING OFF';
    if (powered) handheld?.classList.remove('is-off');

    powerTransitionFrame = requestAnimationFrame(() => {
        if (transitionId !== powerTransitionId) return;
        screen?.classList.add(powered ? 'is-powering-on' : 'is-powering-off');
        powerTransitionTimer = window.setTimeout(() => {
            if (transitionId !== powerTransitionId) return;
            screen?.classList.remove('is-powering-on', 'is-powering-off');
            if (!powered) handheld?.classList.add('is-off');
            if (screenState) screenState.textContent = powered ? 'POWER ON' : 'POWER OFF';
            if (powered) {
                if (selectedCartridge && deviceAction) deviceAction.hidden = false;
                showChannelOsd();
            }
        }, powered ? CRT_ON_MS : CRT_OFF_MS);
    });
}

powerSwitch?.addEventListener('click', () => {
    const powered = powerSwitch.getAttribute('aria-pressed') !== 'true';
    setConsolePower(powered);
});

modeSwitch?.addEventListener('click', () => {
    const monochrome = modeSwitch.getAttribute('aria-pressed') !== 'true';
    modeSwitch.setAttribute('aria-pressed', String(monochrome));
    modeSwitch.classList.toggle('is-on', monochrome);
    document.documentElement.classList.toggle('is-monochrome', monochrome);
    screen?.classList.toggle('is-monochrome', monochrome);
    if (modeLabel) modeLabel.textContent = monochrome ? 'B/W' : 'COLOR';
});

resetSwitch?.addEventListener('click', () => {
    for (const item of document.querySelectorAll('.cartridge')) item.setAttribute('aria-pressed', 'false');
    selectedCartridge = null;
    rack?.classList.remove('has-selection');
    handheld?.classList.remove('is-loaded');
    if (screenCopy) screenCopy.hidden = true;
    if (screenImage) screenImage.hidden = true;
    if (idleScreen) idleScreen.hidden = false;
    if (screenCode) screenCode.textContent = 'NO CART';
    if (screenState) screenState.textContent = powerSwitch?.getAttribute('aria-pressed') === 'true' ? 'POWER ON' : 'POWER OFF';
    if (deviceAction) deviceAction.hidden = true;
});

for (const cartridge of document.querySelectorAll('.cartridge')) {
    cartridge.addEventListener('click', () => {
        for (const item of document.querySelectorAll('.cartridge')) {
            item.setAttribute('aria-pressed', String(item === cartridge));
        }

        const data = cartridge.dataset;
        selectedCartridge = cartridge;
        rack?.classList.add('has-selection');
        handheld?.classList.add('is-loaded');
        if (idleScreen) idleScreen.hidden = true;
        if (screenTitle) screenTitle.textContent = data.title;
        if (screenDescription) screenDescription.textContent = `${data.tagline} ${data.description}`;
        if (screenCopy) screenCopy.hidden = false;
        if (screenImage) {
            screenImage.src = data.screen;
            screenImage.alt = data.screenAlt;
            screenImage.hidden = false;
        }
        if (screenCode) screenCode.textContent = data.code;
        if (screenState) screenState.textContent = data.status;
        if (deviceAction) {
            deviceAction.href = data.url;
            if (deviceActionLabel) deviceActionLabel.textContent = data.action;
            deviceAction.dataset.actionType = data.action.startsWith('Play ') ? 'play' : 'read';
            deviceAction.hidden = false;
        }
        if (powerSwitch?.getAttribute('aria-pressed') !== 'true') setConsolePower(true);

        const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
        document.getElementById('device')?.scrollIntoView({ behavior, block: 'nearest' });
    });
}
