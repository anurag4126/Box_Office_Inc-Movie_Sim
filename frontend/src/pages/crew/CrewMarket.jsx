import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Users, Briefcase, Star, TrendingUp, Filter } from "lucide-react";
import { showToast } from "../../features/ui/toastSlice";

const CrewMarket = () => {
  const dispatch = useDispatch();
  const [crewTeams, setCrewTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rarityFilter, setRarityFilter] = useState("All");

  const fetchCrewTeams = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/crew");
      setCrewTeams(res.data.crewTeams || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCrewTeams();
  }, [fetchCrewTeams]);

  const handleHire = async (id) => {
    if (loading) return;
    try {
      setLoading(true);
      await api.post(`/crew/hire/${id}`);
      dispatch(showToast({ message: "Crew team hired successfully!", type: "success" }));
      fetchCrewTeams();
    } catch (error) {
      dispatch(showToast({
        message: error?.response?.data?.message || "Failed to hire crew team",
        type: "error"
      }));
    } finally {
        setLoading(false);
    }
  };

  const filteredCrew = useMemo(() => {
    return crewTeams.filter(crew => {
      const matchesSearch = crew.name.toLowerCase().includes(search.toLowerCase());
      const matchesRarity = rarityFilter === "All" || crew.rarity === rarityFilter;
      return matchesSearch && matchesRarity;
    });
  }, [crewTeams, search, rarityFilter]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-white">Crew Market</h1>
          <p className="text-slate-400 mt-2">Hire professional production units to bring your movies to life.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search crew teams..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#111827] border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-600"
            />
          </div>
          <select
            value={rarityFilter}
            onChange={(e) => setRarityFilter(e.target.value)}
            className="bg-[#111827] border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-600"
          >
            <option value="All">All Rarities</option>
            <option value="COMMON">Common</option>
            <option value="UNCOMMON">Uncommon</option>
            <option value="RARE">Rare</option>
            <option value="EPIC">Epic</option>
            <option value="LEGENDARY">Legendary</option>
          </select>
        </div>

        {loading ? (
          <div className="text-white text-center py-10">Loading crew teams...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCrew.map((crew, idx) => (
              <div key={crew.id} className="bg-[#111827] border border-slate-800 rounded-2xl p-6 hover:border-violet-600 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors">{crew.name}</h3>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                    crew.rarity === 'LEGENDARY' ? 'bg-orange-500/20 text-orange-500' :
                    crew.rarity === 'EPIC' ? 'bg-purple-500/20 text-purple-500' :
                    crew.rarity === 'RARE' ? 'bg-blue-500/20 text-blue-500' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {crew.rarity}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div className="text-slate-400">Technical: <span className="text-white">{crew.technicalQuality}</span></div>
                  <div className="text-slate-400">Creativity: <span className="text-white">{crew.creativity}</span></div>
                  <div className="text-slate-400">Reliability: <span className="text-white">{crew.reliability}</span></div>
                  <div className="text-slate-400">VFX: <span className="text-white">{crew.vfxQuality}</span></div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="text-violet-400 font-bold">₹{crew.salary.toLocaleString()}/wk</div>
                  <button
                    disabled={loading}
                    onClick={() => handleHire(crew.id)}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50"
                  >
                    {loading ? "Hiring..." : "Hire Team"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CrewMarket;
