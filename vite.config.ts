import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tsconfigPaths()],
    define: {
      'process.env': {
        'SECURE_LOCAL_STORAGE_HASH_KEY': JSON.stringify(env.SECURE_LOCAL_STORAGE_HASH_KEY)
      },
    },
  }

})
