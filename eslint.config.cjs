// ESLint v9+ configuration (CJS) - mirror of .eslintrc.json
// ESLint flat config (CJS)
module.exports = [
	// global ignores
	{
		ignores: ['node_modules/**', 'dist/**', '.next/**'],
	},
	// TypeScript rules for .ts and .tsx files
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: require('@typescript-eslint/parser'),
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: 'module',
				ecmaFeatures: { jsx: true },
			},
		},
		plugins: {
			'@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
		},
		// Using explicit rules instead of 'extends' to remain compatible with flat config
		rules: {
			'@typescript-eslint/explicit-module-boundary-types': 'off'
		}
	},

	// JavaScript rules for .js and .jsx files (basic parsing)
	{
		files: ['**/*.js', '**/*.jsx'],
		languageOptions: {
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: 'module',
				ecmaFeatures: { jsx: true },
			},
		},
	},
];
