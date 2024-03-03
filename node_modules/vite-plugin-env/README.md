
# Vite plugin Env

Inject custom envs into your vite bundle. 

## Install

`npm i -D vite-plugin-env`

### `vite.config.js`
```typescript
import { resolve } from "path"
import { env } from "vite-plugin-stachtml"
export default defineConfig( viteConfig => {
	return {
		build: {
			rollupOptions: {
				input: [ resolve('src/index.html') ]
			},
			outDir: resolve('dist'),
		},
		plugins: {
			env({
				MY_CUSTOM_ENV : "Hello from vite config"
			})
		}
	}
})
```

### `index.ts`

```typescript
console.log( import.meta.env.MY_CUSTOM_ENV )
```