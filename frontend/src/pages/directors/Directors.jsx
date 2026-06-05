import { useCallback, useEffect, useMemo, useState } from "react";

import api from "../../api/axios";
import DirectorCard from "../../components/directors/DirectorCard";
import DashboardLayout from "../../layouts/DashboardLayout";

const genres = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Romance",
  "Horror",
  "Thriller",
  "Mystery",
  "Sci-Fi",
  "Fantasy",
  "Survival",
  "Sports",
  "Crime",
  "War",
  "Historical",
  "Biography",
  "Political",
  "Animation",
  "Musical",
];

const getHitRate = (director) => {
  const moviesDirected = Number(director.moviesDirected || 0);

  if (moviesDirected === 0) {
    return 0;
  }

  return (Number(director.hitMovies || 0) / moviesDirected) * 100;
};

const getAverageRating = (director) => {
  const ratings = director.ratings || [];

  if (ratings.length > 0) {
    return (
      ratings.reduce((sum, rating) => sum + Number(rating || 0), 0) /
      ratings.length
    );
  }

  const careerRatings = (director.careerHistory || [])
    .map((movie) => movie.movieRating ?? movie.criticScore ?? movie.audienceScore)
    .filter((rating) => rating !== null && rating !== undefined);

  if (careerRatings.length === 0) {
    return 0;
  }

  return (
    careerRatings.reduce((sum, rating) => sum + Number(rating || 0), 0) /
    careerRatings.length
  );
};

const filterAndSortDirectors = (
  directors,
  search,
  selectedGenre,
  ageFilter,
  rarityFilter,
  reputationFilter,
  salaryFilter,
  sortBy,
) => {
  let filtered = directors.map((director, originalIndex) => ({
    ...director,
    originalIndex,
  }));

  const query = search.trim().toLowerCase();

  if (query) {
    filtered = filtered.filter((director) =>
      director.name?.toLowerCase().includes(query),
    );
  }

  if (selectedGenre !== "All") {
    filtered = filtered.filter((director) =>
      director.genreExpertise?.includes(selectedGenre),
    );
  }

  if (ageFilter === "Young") {
    filtered = filtered.filter(
      (director) => director.age >= 18 && director.age <= 30,
    );
  }

  if (ageFilter === "Prime") {
    filtered = filtered.filter(
      (director) => director.age > 30 && director.age <= 60,
    );
  }

  if (ageFilter === "Veteran") {
    filtered = filtered.filter((director) => director.age > 60);
  }

  if (rarityFilter !== "All") {
    filtered = filtered.filter((director) => director.rarity === rarityFilter);
  }

  if (reputationFilter === "Rising") {
    filtered = filtered.filter((director) => director.reputation < 40);
  }

  if (reputationFilter === "Established") {
    filtered = filtered.filter(
      (director) => director.reputation >= 40 && director.reputation < 75,
    );
  }

  if (reputationFilter === "Elite") {
    filtered = filtered.filter((director) => director.reputation >= 75);
  }

  if (salaryFilter === "Budget") {
    filtered = filtered.filter((director) => Number(director.salary || 0) < 75000);
  }

  if (salaryFilter === "MidRange") {
    filtered = filtered.filter(
      (director) =>
        Number(director.salary || 0) >= 75000 &&
        Number(director.salary || 0) < 175000,
    );
  }

  if (salaryFilter === "Premium") {
    filtered = filtered.filter((director) => Number(director.salary || 0) >= 175000);
  }

  switch (sortBy) {
    case "creativityDesc":
      filtered.sort((a, b) => Number(b.creativity || 0) - Number(a.creativity || 0));
      break;
    case "reputationDesc":
      filtered.sort((a, b) => Number(b.reputation || 0) - Number(a.reputation || 0));
      break;
    case "leadershipDesc":
      filtered.sort((a, b) => Number(b.leadership || 0) - Number(a.leadership || 0));
      break;
    case "hitRateDesc":
      filtered.sort((a, b) => getHitRate(b) - getHitRate(a));
      break;
    case "awardsDesc":
      filtered.sort((a, b) => Number(b.awards || 0) - Number(a.awards || 0));
      break;
    case "salaryAsc":
      filtered.sort((a, b) => Number(a.salary || 0) - Number(b.salary || 0));
      break;
    case "salaryDesc":
      filtered.sort((a, b) => Number(b.salary || 0) - Number(a.salary || 0));
      break;
    case "ageAsc":
      filtered.sort((a, b) => Number(a.age || 0) - Number(b.age || 0));
      break;
    case "ageDesc":
      filtered.sort((a, b) => Number(b.age || 0) - Number(a.age || 0));
      break;
    default:
      break;
  }

  return filtered;
};

const Directors = () => {
  const [marketDirectors, setMarketDirectors] = useState([]);
  const [ownedDirectors, setOwnedDirectors] = useState([]);
  const [activeTab, setActiveTab] = useState("market");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [ageFilter, setAgeFilter] = useState("All");
  const [rarityFilter, setRarityFilter] = useState("All");
  const [reputationFilter, setReputationFilter] = useState("All");
  const [salaryFilter, setSalaryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("reputationDesc");

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
      setNotice("");
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
      setNotice("");
      const res = await api.post(`/directors/hire/${index}`);
      setMarketDirectors(res.data.marketDirectors || []);
      setOwnedDirectors(res.data.ownedDirectors || []);
      setActiveTab("owned");
      setNotice(`${res.data.director?.name || "Director"} hired successfully.`);
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
      setNotice("");
      const res = await api.post(`/directors/fire/${index}`);
      setMarketDirectors(res.data.marketDirectors || []);
      setOwnedDirectors(res.data.ownedDirectors || []);
      setActiveTab("market");

      if (res.data.compensation || res.data.fanLoss) {
        setNotice(
          `Director released. Compensation ₹${Number(
            res.data.compensation || 0,
          ).toLocaleString("en-IN")} paid and ${res.data.fanLoss || 0} fans lost.`,
        );
      }
    } catch (fireError) {
      console.error(fireError);
      setError(
        fireError?.response?.data?.message || "Failed to release director",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const filteredMarketDirectors = useMemo(
    () =>
      filterAndSortDirectors(
        marketDirectors,
        search,
        selectedGenre,
        ageFilter,
        rarityFilter,
        reputationFilter,
        salaryFilter,
        sortBy,
      ),
    [
      marketDirectors,
      search,
      selectedGenre,
      ageFilter,
      rarityFilter,
      reputationFilter,
      salaryFilter,
      sortBy,
    ],
  );

  const filteredOwnedDirectors = useMemo(
    () =>
      filterAndSortDirectors(
        ownedDirectors,
        search,
        selectedGenre,
        ageFilter,
        rarityFilter,
        reputationFilter,
        salaryFilter,
        sortBy,
      ),
    [
      ownedDirectors,
      search,
      selectedGenre,
      ageFilter,
      rarityFilter,
      reputationFilter,
      salaryFilter,
      sortBy,
    ],
  );

  const currentDirectors =
    activeTab === "market" ? filteredMarketDirectors : filteredOwnedDirectors;

  const clearFilters = () => {
    setSearch("");
    setSelectedGenre("All");
    setAgeFilter("All");
    setRarityFilter("All");
    setReputationFilter("All");
    setSalaryFilter("All");
    setSortBy("reputationDesc");
  };

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
              ? "No directors match your market filters."
              : "No owned directors match your filters."}
          </p>
        </div>
      );
    }

    return (
      <div className={actionLoading ? "pointer-events-none opacity-70" : ""}>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {currentDirectors.map((director) => (
            <DirectorCard
              key={director.id || `${director.name}-${director.originalIndex}`}
              director={director}
              index={director.originalIndex}
              mode={activeTab}
              onHire={handleHire}
              onFire={handleFire}
              hitRate={getHitRate(director)}
              averageRating={getAverageRating(director)}
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

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-7">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search director name..."
            className="rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
          />

          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-violet-500"
          >
            <option value="All">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>

          <select
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-violet-500"
          >
            <option value="All">All Ages</option>
            <option value="Young">18-30</option>
            <option value="Prime">31-60</option>
            <option value="Veteran">60+</option>
          </select>

          <select
            value={rarityFilter}
            onChange={(e) => setRarityFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-violet-500"
          >
            <option value="All">All Rarities</option>
            <option value="Common">Common</option>
            <option value="Uncommon">Uncommon</option>
            <option value="Rare">Rare</option>
            <option value="Epic">Epic</option>
            <option value="Legendary">Legendary</option>
          </select>

          <select
            value={reputationFilter}
            onChange={(e) => setReputationFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-violet-500"
          >
            <option value="All">All Reputation</option>
            <option value="Rising">Rising (&lt; 40)</option>
            <option value="Established">Established (40-74)</option>
            <option value="Elite">Elite (75+)</option>
          </select>

          <select
            value={salaryFilter}
            onChange={(e) => setSalaryFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-violet-500"
          >
            <option value="All">All Salaries</option>
            <option value="Budget">Budget (&lt; ₹75k)</option>
            <option value="MidRange">Mid-Range</option>
            <option value="Premium">Premium (₹175k+)</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-violet-500"
          >
            <option value="creativityDesc">Creativity ↓</option>
            <option value="reputationDesc">Reputation ↓</option>
            <option value="leadershipDesc">Leadership ↓</option>
            <option value="hitRateDesc">Hit Rate ↓</option>
            <option value="awardsDesc">Awards ↓</option>
            <option value="salaryAsc">Salary ↑</option>
            <option value="salaryDesc">Salary ↓</option>
            <option value="ageAsc">Youngest</option>
            <option value="ageDesc">Oldest</option>
          </select>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>
            Showing {currentDirectors.length} of{" "}
            {activeTab === "market" ? marketDirectors.length : ownedDirectors.length}{" "}
            directors
          </span>
          <button
            onClick={clearFilters}
            className="font-medium text-violet-400 hover:text-violet-300"
          >
            Clear filters
          </button>
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
            <p className="text-sm text-slate-400">Average Rating</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {currentDirectors.length === 0
                ? "0.0"
                : (
                    currentDirectors.reduce(
                      (sum, director) => sum + getAverageRating(director),
                      0,
                    ) / currentDirectors.length
                  ).toFixed(1)}
            </p>
          </div>
        </div>

        {notice && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
            {notice}
          </div>
        )}

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
