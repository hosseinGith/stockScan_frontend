import { Link, NavLink, useNavigate } from "react-router";
import ChangeTheme from "../../../components/common/ChangeTheme";
import Logo from "../../../components/common/Logo";
import Footer from "../../../components/layout/Footer";
import apiClient, { api } from "../../../api/axois";
import { useAppSelector } from "../../../stores/hooks";
import type { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  const userData = useAppSelector((state) => state.data.user);
  const navigate = useNavigate();
  async function checkUserAndLogin() {
    if (userData) navigate("/app");

    const response = await apiClient.get(api.users.getUserInitialInfo);
    if (response.data.id) navigate("/app");
    else navigate("/auth");
  }
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <section className="flex w-full justify-between sm:items-center sm:flex-row flex-col">
          <Link
            to="/"
            className="text-lg font-bold text-(--foreground-h) max-w-32"
          >
            <Logo />
          </Link>
          <div className="*:hover:text-(--primery) *:transition flex gap-2 items-center sm:mr-0 mr-auto">
            <NavLink to={"#"}>خدمات</NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? "text-(--primery) hover:text-(--main-text)!" : ""
              }
              to={"/doctors"}
            >
              پزشکان
            </NavLink>
            <NavLink to={"#"}>تماس</NavLink>
            <button
              onClick={checkUserAndLogin}
              className="button not-hover:bg-(--primery) font-bold not-hover:text-(--primery-text) text-(--primery) boderWithHoverBtn px-6! "
            >
              ورود
            </button>
            <ChangeTheme />
          </div>
        </section>
      </header>
      {children}
      <Footer />
    </div>
  );
};
export default Layout;
