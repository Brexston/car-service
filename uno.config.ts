import {
	defineConfig,
	presetAttributify,
	presetIcons,
	presetUno,
	transformerDirectives,
} from 'unocss';

export default defineConfig({
	presets: [
		presetUno(),
		presetAttributify(),
		presetIcons(),
	],
	transformers: [transformerDirectives()],
	theme: {
		colors: {
			ios: {
				'bg': '#F2F2F4',
				'card': '#FFFFFF',
				'text': '#0B0B0C',
				'muted': '#8E8E93',
				'fill': '#ECECF0',
				'fill2': '#E4E4E9',
				'accent': '#0B0B0C',
				'accent-text': '#FFFFFF',
				'blue': '#007AFF',
				'green': '#34C759',
				'orange': '#FF9500',
				'red': '#FF3B30',
			},
		},
		borderRadius: {
			'ios': '20px',
			'ios-sm': '14px',
			'ios-pill': '9999px',
		},
		boxShadow: {
			'ios-fab': '0 4px 16px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.12)',
			'ios-card': '0 1px 4px rgba(0,0,0,0.04)',
		},
		fontFamily: {
			sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
		},
	},
	shortcuts: {
		'btn-reset': 'border-0 bg-transparent p-0 m-0 appearance-none outline-none cursor-pointer select-none touch-manipulation',
		'tabbar': 'fixed bottom-0 inset-x-0 z-50 max-w-lg mx-auto flex justify-around items-stretch px-2 pt-1.5 pb-[calc(6px+env(safe-area-inset-bottom,0px))] bg-[rgba(255,255,255,0.82)] backdrop-blur-[20px] backdrop-saturate-150 border-t border-[rgba(60,60,67,0.12)]',
		'tab-item': 'btn-reset flex-1 flex flex-col items-center justify-center gap-0.5 py-1 min-w-0 transition-colors duration-150 active:opacity-60',
		'tab-item-label': 'text-[10px] font-semibold leading-tight text-center',
		'ios-card': 'bg-ios-card rounded-ios',
		'ios-card-tap': 'ios-card transition-opacity duration-150 active:opacity-80',
		'ios-pill': 'btn-reset bg-ios-fill text-ios-text font-medium rounded-ios-pill px-5 py-3.5 text-center transition-opacity duration-150 active:opacity-70',
		'ios-pill-sm': 'bg-ios-fill text-ios-text font-medium rounded-ios-pill px-4 py-2.5 text-sm transition-opacity duration-150 active:opacity-70',
		'btn-accent': 'btn-reset bg-ios-accent text-ios-accent-text font-semibold rounded-ios-sm px-5 py-3.5 transition-opacity duration-150 active:opacity-80',
		'btn-secondary': 'btn-reset ios-pill w-full',
		'btn-ghost': 'btn-reset text-ios-blue font-medium px-4 py-2 rounded-ios-sm transition-opacity active:opacity-60',
		'input-field': 'w-full bg-ios-card rounded-ios-sm px-4 py-3.5 text-ios-text placeholder-ios-muted outline-none border-0',
		'page-container': 'max-w-lg mx-auto px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))]',
		'page-title': 'text-3xl font-bold text-ios-text tracking-tight',
		'page-subtitle': 'text-ios-muted mt-1',
		'hairline-t': 'border-t border-[rgba(60,60,67,0.12)]',
		'hairline-b': 'border-b border-[rgba(60,60,67,0.12)]',
	},
});
