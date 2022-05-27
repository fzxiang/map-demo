import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createProxy } from './build/vite/proxy';
import { createVitePlugins } from './build/vite/plugin';

const VITE_PROXY = [["/map/api","http://10.130.0.55:8082/map/api"]]
// const VITE_PROXY = [[]]

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
