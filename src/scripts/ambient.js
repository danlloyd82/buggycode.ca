import { createBugField } from './bug-field.js';

const STORAGE_KEY = 'buggycode:bugs';

const layer = document.getElementById('bug-field');
const toggle = document.getElementById('bugs-toggle');
const counter = document.getElementById('squash-count');

if (layer) {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let stored = null;
    try {
        stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
        // Storage can throw in private mode. Fall back to the default.
    }

    const field = createBugField({
        layer,
        onScore(count) {
            if (counter) counter.textContent = String(count).padStart(3, '0');
        },
    });

    function apply(enabled, persist) {
        // Unhide before enabling so the layer has measured dimensions.
        layer.hidden = !enabled;
        field.setEnabled(enabled);

        if (toggle) {
            toggle.setAttribute('aria-pressed', String(enabled));
            toggle.dataset.state = enabled ? 'on' : 'off';
        }
        if (!enabled && counter) counter.textContent = '000';

        if (persist) {
            try {
                window.localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off');
            } catch {
                // Ignore: the preference just will not survive a reload.
            }
        }
    }

    apply(stored === null ? !prefersReduced : stored === 'on', false);

    toggle?.addEventListener('click', () => apply(!field.isEnabled(), true));
}
