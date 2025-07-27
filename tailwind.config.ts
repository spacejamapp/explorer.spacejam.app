import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-jetbrains-mono)', 'Inter', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      height: {
        header: '4rem',
        page: 'calc(100dvh - 4rem)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'hsl(var(--foreground))',
            hr: {
              borderColor: 'hsl(var(--border))',
              marginTop: '3em',
              marginBottom: '3em',
            },
            'h1, h2, h3': {
              letterSpacing: '-0.025em',
            },
            h2: {
              marginBottom: '1em',
            },
            h3: {
              marginTop: '1.5em',
              marginBottom: '0.5em',
            },
            'h4, h5, h6': {
              marginTop: '1em',
              marginBottom: '0.5em',
            },
            pre: {
              backgroundColor: 'transparent',
              borderRadius: '0.5rem',
              padding: '0',
              marginTop: '1em',
              marginBottom: '1em',
              color: 'inherit',
              '> code': {
                backgroundColor: 'transparent',
                borderRadius: 0,
                padding: 0,
                color: 'inherit',
                fontSize: '0.875em',
                '&::before': {
                  content: 'none',
                },
                '&::after': {
                  content: 'none',
                },
              },
            },
            code: {
              backgroundColor: 'hsl(var(--muted))',
              borderRadius: '0.25rem',
              padding: '0.2em 0.4em',
              fontSize: '0.875em',
              fontWeight: '400',
              '&::before': {
                content: 'none',
              },
              '&::after': {
                content: 'none',
              },
            },
            'pre code': {
              backgroundColor: 'transparent',
              borderRadius: 0,
              padding: 0,
              fontSize: 'inherit',
              fontWeight: 'inherit',
            },
          },
        },
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        white: 'hsl(0 0% 100%)',
        black: 'hsl(0 0% 0%)',
        transparent: 'transparent',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'aurora': {
          from: {
            backgroundPosition: '50% 50%, 50% 50%',
          },
          to: {
            backgroundPosition: '350% 50%, 350% 50%',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'aurora': 'aurora 60s linear infinite',
      },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('tailwindcss-animate'), 
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/typography'),
    // Custom plugin for aurora background utilities
    function({ addUtilities }) {
      const newUtilities = {
        '.aurora-gradients': {
          '--white-gradient': 'repeating-linear-gradient(100deg,rgba(255,255,255,0.03) 0%,rgba(255,255,255,0.03) 7%,transparent 10%,transparent 12%,rgba(255,255,255,0.03) 16%)',
          '--dark-gradient': 'repeating-linear-gradient(100deg,rgba(0,0,0,0.03) 0%,rgba(0,0,0,0.03) 7%,transparent 10%,transparent 12%,rgba(0,0,0,0.03) 16%)',
          '--aurora': 'repeating-linear-gradient(100deg,rgba(236,72,153,0.3) 10%,rgba(168,85,247,0.3) 15%,rgba(34,211,238,0.3) 20%,rgba(168,85,247,0.2) 25%,rgba(236,72,153,0.3) 30%)',
        },
        '.aurora-base': {
          'background-image': 'var(--white-gradient), var(--aurora)',
          'background-size': '300%, 200%',
          'background-position': '50% 50%, 50% 50%',
        },
        '.aurora-dark': {
          'background-image': 'var(--dark-gradient), var(--aurora)',
        },
        '.aurora-after': {
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: '0',
            'background-image': 'var(--white-gradient), var(--aurora)',
            'background-size': '200%, 100%',
            'mix-blend-mode': 'difference',
            animation: 'aurora 60s linear infinite',
          }
        },
        '.aurora-after-dark': {
          '&::after': {
            'background-image': 'var(--dark-gradient), var(--aurora)',
          }
        },
        '.aurora-mask': {
          'mask-image': 'radial-gradient(ellipse at center top, black 10%, transparent 70%)',
        }
      }
      addUtilities(newUtilities)
    }
  ],
} satisfies Config;

export default config;
