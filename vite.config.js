import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createProxy } from './build/vite/proxy';
import { createVitePlugins } from './build/vite/plugin';

const VITE_PROXY = [["/api","http://172.18.90.214:8082/api"]]
// const VITE_PROXY = [[]]

const viteEnv = {
  VITE_USE_MOCK: true
}
export default ({ command }) => {
  const isBuild = command === 'build';

  return defineConfig({
    server: {
      host: true,
      proxy: createProxy(VITE_PROXY),
			headers: {
				'Access-Control-Allow-Origin': '*',
			}
    },
    plugins: createVitePlugins(viteEnv, isBuild),
		build: {
			sourcemap: true
		},
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
