/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig, loadEnv } from 'vite';
// additional config to direct the vite build to src directory
// https://vitejs.dev/config/#conditional-config
// https://vitejs.dev/config/shared-options.html#root

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd()); 
  const commonConfig = {
    server: {
      cors: true,
    },
    define: {
      'process.env': env, 
    },
  };

  if (command === 'build') {
    return {
      ...commonConfig,
      root: 'src',
      build: {
        minify: false,
        rollupOptions: {
          output: {
            dir: './dist',
          },
          input: './src/index.html',
        },
      },
    };
  }

  // Configuración para desarrollo
  return {
    ...commonConfig,
    root: 'src',
    server: {
      cors: true,
      historyApiFallback: true,
    },
  };
});
