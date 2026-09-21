export const bugSVG = `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <g fill="none" style="stroke:var(--bug-line)" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">
    <path class="leg leg-b" style="transform-origin:11.2px 14.2px" d="M11.2 14.2 L5.4 14 L1.9 16.4"/>
    <path class="leg leg-a" style="transform-origin:12.4px 11.4px" d="M12.4 11.4 L7.2 8 L3.6 9.8"/>
    <path class="leg leg-a" style="transform-origin:10.8px 16.8px" d="M10.8 16.8 L6 19.4 L3 22.8"/>
    <path class="leg leg-a" style="transform-origin:19.6px 11.4px" d="M19.6 11.4 L24.8 8 L28.4 9.8"/>
    <path class="leg leg-b" style="transform-origin:20.8px 14.2px" d="M20.8 14.2 L26.6 14 L30.1 16.4"/>
    <path class="leg leg-a" style="transform-origin:21.2px 16.8px" d="M21.2 16.8 L26 19.4 L29 22.8"/>
  </g>
  <g fill="none" style="stroke:var(--bug-line)" stroke-width="1.05" stroke-linecap="round">
    <path class="antenna" style="transform-origin:15.2px 4.9px" d="M15.2 4.9 C14 3.4 13 2.4 11.6 1.4"/>
    <path class="antenna antenna-r" style="transform-origin:16.8px 4.9px" d="M16.8 4.9 C18 3.4 19 2.4 20.4 1.4"/>
  </g>
  <g class="bug-body">
    <ellipse cx="16" cy="17.5" rx="5.6" ry="8.4" style="fill:var(--bug-body);stroke:var(--bug-line)" stroke-width="1.15"/>
    <g style="stroke:var(--bug-line)" stroke-width="0.9" fill="none">
      <line x1="16" y1="15" x2="16" y2="20"/>
      <line x1="16" y1="17.5" x2="13.2" y2="16.2"/>
      <line x1="16" y1="17.5" x2="18.8" y2="16.2"/>
    </g>
    <g style="fill:var(--bug-line)">
      <circle cx="16" cy="15" r="1.1"/>
      <circle cx="16" cy="17.5" r="1.1"/>
      <circle cx="16" cy="20" r="1.1"/>
    </g>
    <ellipse cx="16" cy="7.1" rx="3.1" ry="2.8" style="fill:var(--bug-head);stroke:var(--bug-line)" stroke-width="1.15"/>
  </g>
</svg>`;

export const splatSVG = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g style="fill:var(--bug-body)"><ellipse cx="16" cy="16" rx="12" ry="8"/><ellipse cx="10" cy="10" rx="3" ry="2"/><ellipse cx="24" cy="12" rx="2" ry="3"/><ellipse cx="18" cy="24" rx="4" ry="2"/></g></svg>`;

export const swatterSVG = `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- Handle -->
  <rect x="30" y="32" width="4" height="28" fill="black"/>
  
  <!-- Swatter head -->
  <rect x="20" y="8" width="24" height="24" fill="white" stroke="black" stroke-width="2"/>
  
  <!-- Mesh lines vertical -->
  <line x1="24" y1="8" x2="24" y2="32" stroke="black" stroke-width="1"/>
  <line x1="28" y1="8" x2="28" y2="32" stroke="black" stroke-width="1"/>
  <line x1="32" y1="8" x2="32" y2="32" stroke="black" stroke-width="1"/>
  <line x1="36" y1="8" x2="36" y2="32" stroke="black" stroke-width="1"/>
  <line x1="40" y1="8" x2="40" y2="32" stroke="black" stroke-width="1"/>
  
  <!-- Mesh lines horizontal -->
  <line x1="20" y1="12" x2="44" y2="12" stroke="black" stroke-width="1"/>
  <line x1="20" y1="16" x2="44" y2="16" stroke="black" stroke-width="1"/>
  <line x1="20" y1="20" x2="44" y2="20" stroke="black" stroke-width="1"/>
  <line x1="20" y1="24" x2="44" y2="24" stroke="black" stroke-width="1"/>
  <line x1="20" y1="28" x2="44" y2="28" stroke="black" stroke-width="1"/>
</svg>`;
