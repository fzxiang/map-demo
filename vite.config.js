import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createProxy } from './build/vite/proxy';
import { createVitePlugins } from './build/vite/plugin';

const VITE_PROXY = [["/api","http://172.18.90.213:8082/api"]]
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
		css: {
			preprocessorOptions: {
				less: {
					// modifyVars: generateModifyVars(),
					// javascriptEnabled: true,
				},
			},
		},
  })

}
