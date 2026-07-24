import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
      },
    },
  };
});


// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vite.dev/config/
// export default defineConfig({
// // <<<<<<< Updated upstream
//   plugins: [react()],
//   define: {
//     'process.env': '{}',
//     'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? "http://localhost:5001"),
//   },
// })
// // =======
// // 	plugins: [react()],
// // 	server: {
// // 		proxy: {
// // 			"/api": {
// // 				target: "http://localhost:5001",
// // 				changeOrigin: true,
// // 			},
// // 		},
// // 	},
// // });
// // >>>>>>> Stashed changes
