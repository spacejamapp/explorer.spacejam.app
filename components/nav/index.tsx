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
  /*  {
    title: "Builder",
    items: [
      {
        title: "Build my App",
        href: "/stf",
        description: "Write JAM program in Zink",
      },
      {
        title: "JSON-RPC API",
        href: "/jamnp",
        description: "JSON-RPC API for JAM program",
      },
      // {
      //   title: "Index my App",
      //   href: "/jamnp",
      //   description: "Index JAM program with Endex",
      // },
    ],
  }, */
  /* {
    title: "Validator",
    items: [
      {
        title: "Standard",
        href: "https://docs.spacejam.app/validator#standard",
        description: "Run a full validator node",
        target: "_blank",
      },
      {
        title: "Customized",
        href: "https://docs.spacejam.app/validator#customized",
        description: "Customize with SpaceJam Hooks",
        target: "_blank",
      },
    ],
    annotated: true,
  }, */
  /*   {
    title: "Conformance",
    items: [
      {
        title: "STF",
        href: "/stf",
        description: "State transition functions",
      },
      {
        title: "JAMSNP",
        href: "/jamnp",
        description: "JAM simple network protocol",
      },
    ],
  }, */
  {
    title: "About",
    items: [
      {
        title: "Github",
        href: "https://github.com/spacejamapp",
        description: "Contribute to SpaceJam",
        target: "_blank",
      },
      {
        title: "Twitter",
        href: "https://x.com/spacejamapp",
        description: "Follow us on Twitter",
        target: "_blank",
      },
      {
        title: "Telegram",
        href: "https://t.me/spacejamapp",
        description: "Join our Telegram channel",
        target: "_blank",
      },
      {
        title: "Jobs",
        href: "jobs",
        description: "Work with us",
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
