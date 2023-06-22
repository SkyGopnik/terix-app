import axios from "axios";
import { SnackbarProvider } from "notistack";
import { createRoot } from "react-dom/client";

import config from "renderer/config";

import { SkeletonTheme } from "react-loading-skeleton";
import { Providers } from "renderer/components/Providers";

import App from "./App";

import "react-tooltip/dist/react-tooltip.css";
import "react-loading-skeleton/dist/skeleton.css";

axios.defaults.baseURL = config.api.baseUrl;

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <Providers>
    <SnackbarProvider
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
    >
      <SkeletonTheme
        baseColor="#262626"
        highlightColor="#343434"
      >
        <App />
      </SkeletonTheme>
    </SnackbarProvider>
  </Providers>
);
