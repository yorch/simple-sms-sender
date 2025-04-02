import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  experimentalDts: true,
  format: ['cjs', 'esm'],
  splitting: false,
  sourcemap: false,
  clean: true
});
