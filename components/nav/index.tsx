export interface NavItem {
  title: string;
  href: string;
  description?: string;
  target?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
  annotated?: boolean; // Flag to mark sections as annotated/inactive
}

export const navSections: NavSection[] = [
  {
    title: 'Resources',
    items: [
      {
        title: 'GrayPaper',
        href: 'https://graypaper.com',
        description: 'The site of the graypaper.',
        target: '_blank',
      },
      {
        title: 'JAM',
        href: 'https://jam.web3.foundation',
        description: 'The JAM prize',
        target: '_blank',
      },
    ],
  },
  {
    title: 'About',
    items: [
      {
        title: 'Github',
        href: 'https://github.com/spacejamapp',
        description: 'Contribute to SpaceJam',
        target: '_blank',
      },
      {
        title: 'Twitter',
        href: 'https://x.com/spacejamapp',
        description: 'Follow us on Twitter',
        target: '_blank',
      },
      {
        title: 'Telegram',
        href: 'https://t.me/spacejamapp',
        description: 'Join our Telegram channel',
        target: '_blank',
      },
      {
        title: 'Jobs',
        href: 'jobs',
        description: 'Work with us',
      },
    ],
  },
];

// Optional external links that aren't in dropdown menus
export const externalLinks: NavItem[] = [
  /* {
    title: "Explorer",
    href: "https://explorer.spacejam.app",
    description: "SpaceJam Explorer",
  }, */
];
