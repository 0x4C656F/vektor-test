import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { Provider } from "react-redux";
import store from "./store";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </StrictMode>,
);
