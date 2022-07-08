import { defineConfig } from 'vite'
import { createProxy } from './build/vite/proxy';
import { createVitePlugins } from './build/vite/plugin';

const VITE_PROXY = [["/api","http://172.18.90.214:8082/api"]]

const viteEnv = {
  VITE_USE_MOCK: true
}
export default ({ command }) => {
  const isBuild = command === 'build';

  return defineConfig({
		esbuild: {
			drop: ['console', 'debugger'],
		},
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
