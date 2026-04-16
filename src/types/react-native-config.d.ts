// src/types/react-native-config.d.ts
declare module "react-native-config" {
  interface Env {
    API_URL: string;
    // add other variables here, e.g.
    // APP_ENV: string;
    // VITE_API_URL: string;
  }

  const Config: Env;
  export default Config;
}