import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    port: 8119,
    // proxy: {
    //   "/api/tradingview": {
    //     target: "http://127.0.0.1:8118",
    //     changeOrigin: true,
    //   },
    // },
  },
});
