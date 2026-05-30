import {
  LayoutDashboard,
  Film,
  Users,
  Building2,
  TrendingUp,
  FileBarChart,
} from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-72 bg-[#0B1020] border-r border-slate-800 p-6">
      <h1 className="text-3xl font-bold text-violet-500 mb-10">CineVerse</h1>

      <nav className="space-y-3">
        <Link
          to="/"
          className="
              w-full
              flex
              items-center
              gap-3
              p-3
              rounded-xl
              text-slate-300
              hover:bg-slate-800
              "
        >
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        <Link
          to="/scripts"
          className="
              w-full
              flex
              items-center
              gap-3
              p-3
              rounded-xl
              text-slate-300
              hover:bg-slate-800
              "
        >
          <Film size={20} />
          Scripts
        </Link>

        <button className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-300 hover:bg-slate-800">
          <Users size={20} />
          Talent
        </button>

        <button className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-300 hover:bg-slate-800">
          <Building2 size={20} />
          Studio
        </button>

        <button className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-300 hover:bg-slate-800">
          <TrendingUp size={20} />
          Market
        </button>

        <button className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-300 hover:bg-slate-800">
          <FileBarChart size={20} />
          Reports
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
