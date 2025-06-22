// Injects environment variables into the HTML file during build
export default function injectEnv() {
  return {
    name: "inject-env",
    transformIndexHtml(html) {
      const env = {
        VITE_API_URL: process.env.VITE_API_URL,
        PROD: process.env.NODE_ENV === "production",
      };

      const script = `<script>window.__ENV = ${JSON.stringify(env)};</script>`;
      return html.replace("</head>", `${script}</head>`);
    },
  };
}
