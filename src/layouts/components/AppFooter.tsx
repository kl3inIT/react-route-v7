import { Toolbar } from 'primereact/toolbar';

export function AppFooter() {
    return (
        <Toolbar
            start={<span>© 2025 React Router V7 Demo</span>}
            center={<span>Kl3inIT</span>}
            end={<span>v1.0.0</span>}
        />
    );
}
