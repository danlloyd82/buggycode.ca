// SVGs for bug, splat, and fly swatter cursor
export const bugSVG = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g fill="none" stroke="green" stroke-width="1">
    <!-- Body -->
    <ellipse cx="16" cy="16" rx="6.4" ry="9.6" fill="lightgreen" stroke="black"/>
    <!-- Legs -->
    <line x1="9.6" y1="9.6" x2="4.8" y2="4.8"/>
    <line x1="9.6" y1="16" x2="3.2" y2="16"/>
    <line x1="9.6" y1="22.4" x2="4.8" y2="27.2"/>
    <line x1="22.4" y1="9.6" x2="27.2" y2="4.8"/>
    <line x1="22.4" y1="16" x2="28.8" y2="16"/>
    <line x1="22.4" y1="22.4" x2="27.2" y2="27.2"/>
    <!-- Antennae -->
    <line x1="14.4" y1="6.4" x2="11.2" y2="1.6"/>
    <line x1="17.6" y1="6.4" x2="20.8" y2="1.6"/>
    <!-- Circuit nodes and lines -->
    <circle cx="16" cy="12.8" r="1.6" fill="black"/>
    <circle cx="16" cy="16" r="1.6" fill="black"/>
    <circle cx="16" cy="19.2" r="1.6" fill="black"/>
    <line x1="16" y1="12.8" x2="16" y2="16"/>
    <line x1="16" y1="16" x2="16" y2="19.2"/>
  </g>
</svg>`;
export const splatSVG = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="16" cy="16" rx="12" ry="8" fill="#4b2e2b"/><ellipse cx="10" cy="10" rx="3" ry="2" fill="#4b2e2b"/><ellipse cx="24" cy="12" rx="2" ry="3" fill="#4b2e2b"/><ellipse cx="18" cy="24" rx="4" ry="2" fill="#4b2e2b"/></svg>`;

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