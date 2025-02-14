/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./app/**/*.{js,ts,jsx,tsx}", 
    "./app/*",
    "./components/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			inter: [
  				'Inter',
  				'sans-serif'
  			],
  			helvetica: [
  				'Helvetica',
  				'Arial',
  				'sans-serif'
  			]
  		},
  		screens: {
  			'3xl': '1920px'
  		},
  		colors: {
  			ssw: {
  				red: '#CC4141',
  				charcoal: '#333333'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    function ({ addComponents }) {
      addComponents({
        // Variant styles
        '.solidRed': {
          backgroundColor: '#CC4141', 
          color: '#FFFFFF', 
        },
        '.solidWhite': {
          backgroundColor: '#FFFFFF', 
          color: '#000000',
          border: '1px solid #000000', 
        },
        '.outlinedWhite': {
          color: '#FFFFFF', 
          border: '1px solid #FFFFFF', 
        },
        // Size styles
        '.small': {
          padding: '0.25rem 0.5rem', 
          fontSize: '0.875rem', 
        },
        '.medium': {
          padding: '0.5rem 1rem', 
          fontSize: '1rem', 
        },
        '.large': {
          padding: '0.75rem 1.5rem',
          fontSize: '1.125rem',
        },
      });
    },
      require("tailwindcss-animate")
],
};
