import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createProxy } from './build/vite/proxy';
import { createVitePlugins } from './build/vite/plugin';

const VITE_PROXY = [["/api","http://47.99.102.3:8100/api"]]
const viteEnv = {
  VITE_USE_MOCK: true
}
console.log(import.meta.globEager)
// https://vitejs.dev/config/
export default ({ command }) => {
  const isBuild = command === 'build';

  return defineConfig({
    server: {
      host: true,
      proxy: createProxy(VITE_PROXY),
    },
    plugins: createVitePlugins(viteEnv, isBuild),
  })

}
