import vue from '@vitejs/plugin-vue';
import { configMockPlugin } from './mock';

export function createVitePlugins(viteEnv, isBuild) {
	const {
		VITE_USE_MOCK,
	} = viteEnv;

	const vitePlugins = [
		// have to
		vue(),
	];

	// vite-plugin-mock
	VITE_USE_MOCK && vitePlugins.push(configMockPlugin(isBuild));

	return vitePlugins;
}
