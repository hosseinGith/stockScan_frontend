import { Moon, Sun } from "lucide-react";

const ChangeTheme = () => {
  const changeTheme = () => {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      String(Number(document.documentElement.classList.contains("dark"))),
    );
  };
  return (
    <button onClick={changeTheme} className="hover:rotate-270 transition">
      <Moon size={30} className="dark:hidden" fill="#ffcb00"  stroke="#bbb" />
      <Sun size={30} className="not-dark:hidden" fill="#ffcb00" stroke="#fff" />
    </button>
  );
};
export default ChangeTheme;
