import { useCallback, useEffect, useState } from "react";

import api from "../../api/axios";
import DirectorCard from "../../components/directors/DirectorCard";
import DashboardLayout from "../../layouts/DashboardLayout";

const Directors = () => {
  const [marketDirectors, setMarketDirectors] = useState([]);
  const [ownedDirectors, setOwnedDirectors] = useState([]);
  const [activeTab, setActiveTab] = useState("market");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMarketDirectors = useCallback(async () => {
    const res = await api.get("/directors");
    setMarketDirectors(res.data.directors || []);
  }, []);

  const fetchOwnedDirectors = useCallback(async () => {
    const res = await api.get("/directors/owned");
    setOwnedDirectors(res.data.directors || []);
  }, []);

  const loadDirectors = useCallback(async () => {
    try {
      setError("");
      setLoading(true);
      await Promise.all([fetchMarketDirectors(), fetchOwnedDirectors()]);
    } catch (loadError) {
      console.error(loadError);
      setError(
        loadError?.response?.data?.message || "Failed to load directors",
      );
    } finally {
      setLoading(false);
    }
  }, [fetchMarketDirectors, fetchOwnedDirectors]);

  useEffect(() => {
    const refreshTimer = window.setTimeout(loadDirectors, 0);

    return () => window.clearTimeout(refreshTimer);
  }, [loadDirectors]);

  const handleHire = async (index) => {
    try {
      setActionLoading(true);
      setError("");
      const res = await api.post(`/directors/hire/${index}`);
      setMarketDirectors(res.data.marketDirectors || []);
      setOwnedDirectors(res.data.ownedDirectors || []);
      setActiveTab("owned");
    } catch (hireError) {
      console.error(hireError);
      setError(hireError?.response?.data?.message || "Failed to hire director");
    } finally {
      setActionLoading(false);
    }
  };

  const handleFire = async (index) => {
    try {
      setActionLoading(true);
      setError("");
      const res = await api.post(`/directors/fire/${index}`);
      setMarketDirectors(res.data.marketDirectors || []);
      setOwnedDirectors(res.data.ownedDirectors || []);
      setActiveTab("market");
    } catch (fireError) {
      console.error(fireError);
      setError(
        fireError?.response?.data?.message || "Failed to release director",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const currentDirectors =
    activeTab === "market" ? marketDirectors : ownedDirectors;

  const renderDirectors = () => {
    if (currentDirectors.length === 0) {
      return (
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-12 text-center">
          <h2 className="mb-3 text-2xl font-bold text-white">
            {activeTab === "market"
              ? "No Market Directors"
              : "No Owned Directors"}
          </h2>
          <p className="text-slate-400">
            {activeTab === "market"
              ? "The director market is currently empty."
              : "Hire directors from the market to build your creative team."}
          </p>
        </div>
      );
    }

    return (
      <div className={actionLoading ? "pointer-events-none opacity-70" : ""}>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {currentDirectors.map((director, index) => (
            <DirectorCard
              key={director.id || `${director.name}-${index}`}
              director={director}
              index={index}
              mode={activeTab}
              onHire={handleHire}
              onFire={handleFire}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">Directors</h1>
            <p className="mt-2 text-slate-400">
              Hire directors and manage your studio&apos;s creative leadership.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab("market")}
              className={`rounded-xl px-5 py-3 font-semibold transition ${
                activeTab === "market"
                  ? "bg-violet-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Market ({marketDirectors.length})
            </button>

            <button
              onClick={() => setActiveTab("owned")}
              className={`rounded-xl px-5 py-3 font-semibold transition ${
                activeTab === "owned"
                  ? "bg-violet-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Owned ({ownedDirectors.length})
            </button>

            <button
              onClick={loadDirectors}
              disabled={loading || actionLoading}
              className="rounded-xl bg-slate-800 px-5 py-3 font-semibold text-slate-300 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
            <p className="text-sm text-slate-400">Market Directors</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {marketDirectors.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
            <p className="text-sm text-slate-400">Owned Directors</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {ownedDirectors.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
            <p className="text-sm text-slate-400">Viewing</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {currentDirectors.length}
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-800 bg-[#111827] p-12 text-center">
            <h2 className="text-2xl font-bold text-white">Loading...</h2>
          </div>
        ) : (
          renderDirectors()
        )}
      </div>
    </DashboardLayout>
  );
};

export default Directors;
