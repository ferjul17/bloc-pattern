import * as path from 'path';

import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src', 'index.ts'),
      name: 'bloc-pattern',
      fileName: (format) => `bloc-pattern.${format}.js`,
    },
  },
});
