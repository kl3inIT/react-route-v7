import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";

// PrimeReact imports
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import "./index.css";
import { RouterProvider } from "react-router/dom";
import { router } from "./routes/router.tsx";
import { AuthProvider } from "./services/auth/AuthProvider";
import { QueryProvider } from "./api/QueryProvider";
import { NotificationProvider } from "./services/notification";
import { LayoutProvider } from "./layouts";
import { store } from "./store/store";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ReduxProvider store={store}>
            <QueryProvider>
                <PrimeReactProvider>
                    <LayoutProvider>
                        <NotificationProvider>
                            <AuthProvider>
                                <RouterProvider router={router} />
                            </AuthProvider>
                        </NotificationProvider>
                    </LayoutProvider>
                </PrimeReactProvider>
            </QueryProvider>
        </ReduxProvider>
    </StrictMode>
);
