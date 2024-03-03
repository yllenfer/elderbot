import { resolve } from "path";
import { defineConfig } from "vite";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();


export default defineConfig({
  root: "src/",
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        register: resolve(__dirname, 'src/user/register.html'),
        login: resolve(__dirname, 'src/user/login.html'),
      },
    },
  },
  server: {
    base: "/",
  },

});
