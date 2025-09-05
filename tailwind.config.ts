import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'sans': ['SF Pro Text', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
				'display': ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
				'mono': ['SF Mono', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
			},
			fontSize: {
				// Standardized text sizes following Apple's design system
				'xs': ['12px', { lineHeight: '16px', letterSpacing: '0' }],
				'sm': ['14px', { lineHeight: '20px', letterSpacing: '-0.006em' }],
				'base': ['16px', { lineHeight: '24px', letterSpacing: '-0.011em' }],
				'lg': ['18px', { lineHeight: '28px', letterSpacing: '-0.014em' }],
				'xl': ['20px', { lineHeight: '28px', letterSpacing: '-0.017em' }],
				'2xl': ['24px', { lineHeight: '32px', letterSpacing: '-0.019em' }],
				'3xl': ['28px', { lineHeight: '36px', letterSpacing: '-0.021em' }],
				'4xl': ['34px', { lineHeight: '40px', letterSpacing: '-0.022em' }],
				'5xl': ['48px', { lineHeight: '56px', letterSpacing: '-0.022em' }],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				dashboard: {
					bg: 'hsl(var(--dashboard-bg))',
					card: 'hsl(var(--dashboard-card))',
					'card-hover': 'hsl(var(--dashboard-card-hover))',
					border: 'hsl(var(--dashboard-border))',
					'text-primary': 'hsl(var(--dashboard-text-primary))',
					'text-secondary': 'hsl(var(--dashboard-text-secondary))',
					'text-muted': 'hsl(var(--dashboard-text-muted))',
					'accent-green': 'hsl(var(--dashboard-accent-green))',
					'accent-blue': 'hsl(var(--dashboard-accent-blue))',
					success: 'hsl(var(--dashboard-success))',
					warning: 'hsl(var(--dashboard-warning))',
					'action-orange': 'hsl(var(--dashboard-action-orange))',
					'critical-red': 'hsl(var(--dashboard-critical-red))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
