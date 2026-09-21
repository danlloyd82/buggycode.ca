export type Polarity = 'cyan' | 'magenta' | 'gold';

export interface Capture {
    src: string;
    alt: string;
}

export interface Project {
    /** Cartridge code, printed on the label. */
    code: string;
    name: string;
    /** Colours the cartridge spine. Carries meaning, not decoration. */
    polarity: Polarity;
    tagline: string;
    status: string;
    description: string;
    tech: string[];
    url?: string;
    urlLabel?: string;
    /** Internal route to a project sub-page, for projects with a write-up. */
    page?: string;
    pageLabel?: string;
    captures: Capture[];
}

export const projects: Project[] = [
    {
        code: 'NB-01',
        name: 'Node Buster',
        polarity: 'cyan',
        tagline: 'Polarize. Match. Overload.',
        status: 'Playable',
        description:
            'A falling-block puzzle where colour clears the board and polarity does the rest: a match tugs opposite charges into the gap, so one clear can drag a block into the next. Built small enough to run on a retro Linux handheld, then cross-compiled to everything else, browser included.',
        tech: ['C / C++', 'raylib', 'WebAssembly', 'Gamepad API'],
        url: 'https://game.buggycode.ca',
        urlLabel: 'Play Node Buster',
        captures: [
            {
                src: '/carts/nb-01.png',
                alt: 'Node Buster running inside its own handheld shell, with the main menu showing on the device screen.',
            },
        ],
    },
    {
        code: 'PLNK-02',
        name: 'Plinkopolis',
        polarity: 'magenta',
        tagline: 'Ten districts, one night.',
        status: 'Playable',
        description:
            'A pachinko-flavoured peg game with a crank instead of a mouse, played across ten districts of a city after dark. Portrait playfield, full-screen atmosphere, one continuous night.',
        tech: ['Phaser 4', 'Vite', 'WebGL'],
        url: 'https://plinkopolis.buggycode.ca',
        urlLabel: 'Play Plinkopolis',
        captures: [
            {
                src: '/carts/plnk-02.jpg',
                alt: 'Plinkopolis mid-level on Midnight Metro, showing the score, the remaining ball count and the peg counter.',
            },
        ],
    },
    {
        code: 'QT-03',
        name: 'Qtronic',
        polarity: 'gold',
        tagline: 'Every library, one window.',
        status: 'In development',
        description:
            'A desktop music player for your local files, YouTube Music without the ads, and your Spotify Premium account. One queue, whichever of the three a track happens to live in.',
        tech: ['Qt', 'C++', 'Desktop'],
        page: '/qtronic',
        pageLabel: 'Open the project page',
        captures: [
            {
                src: '/carts/qt-03.jpg',
                alt: 'Qtronic showing a Spotify library, with the current track and transport controls along the top bar.',
            },
        ],
    },
];
