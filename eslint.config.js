import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import { globalIgnores } from "eslint/config";

export default tseslint.config(
    globalIgnores(['**/node_modules/**', 'dist/**', '**/*.js', '**/*.spec.ts']),
    eslint.configs.recommended,
    tseslint.configs.strict,
    tseslint.configs.stylistic,
    {
        rules: {
            "@typescript-eslint/no-inferrable-types": "off",
            "@typescript-eslint/no-explicit-any": 'off',
            "@typescript-eslint/no-unsafe-function-type": 'off',
            "@typescript-eslint/no-extraneous-class": 'warn',
            "@typescript-eslint/prefer-function-type": 'warn',
        }
    }
);