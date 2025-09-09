import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "./providers/AuthProvider.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <AuthProvider>
      <App />
    </AuthProvider>
  </>,
);
