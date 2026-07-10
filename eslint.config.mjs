// @ts-check
import eslint from '@eslint/js';
import angular from 'angular-eslint';
import prettierConfig from 'eslint-config-prettier';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// This migration intentionally keeps the rule set lenient so that swapping the
// lint toolchain does not require touching any source file:
// - rules that the current codebase does not satisfy yet and that describe a
//   preference (style, modernization) are turned 'off',
// - rules that point at potentially real issues in existing code are demoted
//   to 'warn' so they stay visible without failing CI.
// Individual rules can be promoted back to 'error' in focused follow-ups once
// the code they flag has been cleaned up.
export default tseslint.config(
    {
        ignores: ['**/dist/**', '**/node_modules/**', '**/.angular/**', '**/out-tsc/**']
    },
    {
        files: ['**/*.ts', '**/*.mts'],
        extends: [eslint.configs.recommended, ...tseslint.configs.recommended, ...angular.configs.tsRecommended],
        processor: angular.processInlineTemplates,
        plugins: { prettier },
        rules: {
            '@angular-eslint/component-class-suffix': 'off',
            '@angular-eslint/component-selector': 'off',
            '@angular-eslint/directive-selector': 'warn',
            '@angular-eslint/no-empty-lifecycle-method': 'warn',
            '@angular-eslint/no-input-rename': 'off',
            '@angular-eslint/no-output-native': 'warn',
            '@angular-eslint/no-output-on-prefix': 'off',
            '@angular-eslint/no-output-rename': 'warn',
            '@angular-eslint/prefer-inject': 'off',
            '@angular-eslint/prefer-on-push-component-change-detection': 'off',
            '@angular-eslint/prefer-standalone': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-duplicate-enum-values': 'warn',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-inferrable-types': 'off',
            '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-this-alias': 'off',
            '@typescript-eslint/no-unsafe-declaration-merging': 'off',
            '@typescript-eslint/no-unsafe-function-type': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-wrapper-object-types': 'warn',
            curly: 'off',
            'no-case-declarations': 'off',
            'no-console': 'off',
            'no-constant-binary-expression': 'warn',
            'no-constant-condition': 'warn',
            'no-dupe-else-if': 'warn',
            'no-duplicate-case': 'warn',
            'no-extra-boolean-cast': 'warn',
            'no-fallthrough': 'off',
            'no-prototype-builtins': 'off',
            'no-regex-spaces': 'warn',
            'no-unsafe-optional-chaining': 'warn',
            'no-useless-assignment': 'off',
            'no-useless-escape': 'off',
            'no-var': 'off',
            'prefer-const': 'off',
            'valid-typeof': 'warn'
        }
    },
    {
        files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
        extends: [eslint.configs.recommended],
        languageOptions: {
            globals: {
                ...globals.node
            }
        },
        rules: {
            'no-console': 'off',
            'no-regex-spaces': 'warn',
            'no-undef': 'warn',
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none', ignoreRestSiblings: true }],
            'no-useless-assignment': 'off',
            'no-useless-escape': 'off'
        }
    },
    {
        files: ['**/*.html'],
        extends: [...angular.configs.templateRecommended],
        rules: {
            '@angular-eslint/template/eqeqeq': 'warn',
            '@angular-eslint/template/prefer-control-flow': 'off'
        }
    },
    prettierConfig
);
