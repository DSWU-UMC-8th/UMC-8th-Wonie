import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div className="h-dvh flex flex-col">
      <nav>네브바</nav>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default HomeLayout;
