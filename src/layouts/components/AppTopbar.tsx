import {useContext, useRef} from "react";
import {Link, useNavigate} from "react-router";
import {useAuth} from "react-oidc-context";
import {Button} from "primereact/button";
import {Menu} from "primereact/menu";
import {Badge} from "primereact/badge";
import {Avatar} from "primereact/avatar";
import {Toolbar} from "primereact/toolbar";
import type {MenuItem} from "primereact/menuitem";
import {LayoutContext} from "@/layouts";
import {ROUTES} from "@/config/routes.config";
import {IconField} from 'primereact/iconfield';
import {InputIcon} from 'primereact/inputicon';
import {InputText} from 'primereact/inputtext';

export function AppTopbar() {
    const {onMenuToggle} = useContext(LayoutContext);
    const auth = useAuth();
    const navigate = useNavigate();
    const userMenuRef = useRef<Menu>(null);

    const user = auth.user?.profile;

    const userMenuItems: MenuItem[] = [
        {
            label: user?.name || user?.preferred_username || "User",
            disabled: true,
            style: {fontWeight: "bold"},
        },
        {separator: true},
        {
            label: "Thông tin cá nhân",
            icon: "pi pi-user",
            command: () => navigate(ROUTES.PROFILE),
        },
        {
            label: "Cài đặt",
            icon: "pi pi-cog",
            command: () => navigate(ROUTES.SETTINGS),
        },
        {separator: true},
        {
            label: "Đăng xuất",
            icon: "pi pi-sign-out",
            command: () => auth.signoutRedirect(),
        },
    ];

    const startContent = (
        <>
            <Link to="/" className="no-underline flex align-items-center gap-2">
                <i className="pi pi-prime text-primary text-2xl"/>
                <span className="font-bold text-xl text-900">Admin Panel</span>
            </Link>
            <Button
                className="ml-2"
                icon="pi pi-bars"
                onClick={onMenuToggle}
            />
        </>
    );

    const centerContent = (
        <IconField iconPosition="left">
            <InputIcon className="pi pi-search"/>
            <InputText placeholder="Search"/>
        </IconField>
    );
    const endContent = (
        <>
            <Button
                icon="pi pi-bell"
                rounded
                text
                severity="secondary"
            >
                <Badge value="3" severity="danger"/>
            </Button>

            <Avatar
                label={user?.name?.charAt(0).toUpperCase() || "U"}
                shape="circle"
                onClick={(e) => userMenuRef.current?.toggle(e)}
            />
            <Menu model={userMenuItems} popup ref={userMenuRef}/>
        </>
    );

    return (
        <Toolbar
            start={startContent}
            center={centerContent}
            end={endContent}
        />
    );
}
