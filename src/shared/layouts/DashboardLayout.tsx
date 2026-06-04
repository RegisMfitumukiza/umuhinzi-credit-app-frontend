import { Outlet } from "react-router-dom";

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};