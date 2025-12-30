import { useAuth } from "react-oidc-context";
import { useLoaderData } from "react-router";
import { Card } from "primereact/card";
import type { loader } from "./loader";

type LoaderData = Awaited<ReturnType<typeof loader>>;

export default function DashboardPage() {
    const auth = useAuth();
    const user = auth.user?.profile;
    const { stats } = useLoaderData() as LoaderData;

    return (
        <>
            <h1 className="text-3xl font-bold text-900 mb-4">Dashboard</h1>

            <Card className="mb-4">
                <div className="flex align-items-center gap-3">
                    <i className="pi pi-user text-4xl text-primary"></i>
                    <div>
                        <h2 className="m-0 text-xl">
                            Xin chào, {user?.name || user?.preferred_username}!
                        </h2>
                        <p className="text-500 m-0">{user?.email}</p>
                    </div>
                </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid">
                <div className="col-12 md:col-6 lg:col-3">
                    <Card className="h-full">
                        <div className="text-center">
                            <i className="pi pi-users text-4xl text-blue-500 mb-3"></i>
                            <h3 className="m-0 text-2xl font-bold">
                                {stats.users.toLocaleString()}
                            </h3>
                            <p className="text-500 m-0">Người dùng</p>
                        </div>
                    </Card>
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <Card className="h-full">
                        <div className="text-center">
                            <i className="pi pi-shopping-cart text-4xl text-green-500 mb-3"></i>
                            <h3 className="m-0 text-2xl font-bold">
                                {stats.orders.toLocaleString()}
                            </h3>
                            <p className="text-500 m-0">Đơn hàng</p>
                        </div>
                    </Card>
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <Card className="h-full">
                        <div className="text-center">
                            <i className="pi pi-box text-4xl text-orange-500 mb-3"></i>
                            <h3 className="m-0 text-2xl font-bold">
                                {stats.products.toLocaleString()}
                            </h3>
                            <p className="text-500 m-0">Sản phẩm</p>
                        </div>
                    </Card>
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <Card className="h-full">
                        <div className="text-center">
                            <i className="pi pi-dollar text-4xl text-purple-500 mb-3"></i>
                            <h3 className="m-0 text-2xl font-bold">
                                ${stats.revenue.toLocaleString()}
                            </h3>
                            <p className="text-500 m-0">Doanh thu</p>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
}



