const rarityStyles = {
  Common: "bg-slate-500/20 text-slate-300 border border-slate-500/30",
  Uncommon: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  Rare: "bg-sky-500/20 text-sky-300 border border-sky-500/30",
  Epic: "bg-violet-500/20 text-violet-300 border border-violet-500/30",
  Legendary: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
};

const cardStyles = {
  Common: "hover:border-slate-500",
  Uncommon: "hover:border-emerald-500",
  Rare: "hover:border-sky-500",
  Epic: "hover:border-violet-500",
  Legendary: "hover:border-amber-500",
};

const formatMoney = (amount) => Number(amount || 0).toLocaleString();

const DirectorCard = ({ director, index, mode, onHire, onFire }) => {
  const avatar = `https://api.dicebear.com/7.x/personas/svg?seed=${director.avatarSeed}`;

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border border-slate-800 bg-linear-to-br from-[#0f172a] via-[#111827] to-[#0b1120] p-6 transition-all duration-300 hover:-translate-y-1 ${cardStyles[director.rarity]}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold tracking-wide ${rarityStyles[director.rarity]}`}
        >
          {director.rarity}
        </span>

        <span className="text-xs text-slate-400">
          Age {Math.floor(Number(director.age || 0))}
        </span>
      </div>

      <div className="flex flex-col items-center">
        <img
          src={avatar}
          alt={director.name}
          className="h-24 w-24 rounded-full border border-slate-700 bg-slate-800"
        />

        <h2 className="mt-4 text-center text-xl font-bold text-white">
          {director.name}
        </h2>

        <p className="text-sm text-slate-400">{director.status}</p>
        <p className="mt-2 text-xs text-slate-500">
          Contract {director.contractYears || 1} year
          {Number(director.contractYears || 1) === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-5 space-y-2 text-slate-300">
        <div className="flex justify-between">
          <span>Creativity</span>
          <span>{director.creativity}</span>
        </div>

        <div className="flex justify-between">
          <span>Reliability</span>
          <span>{director.reliability}</span>
        </div>

        <div className="flex justify-between">
          <span>Leadership</span>
          <span>{director.leadership}</span>
        </div>

        <div className="flex justify-between">
          <span>Reputation</span>
          <span>{director.reputation}</span>
        </div>

        <div className="flex justify-between">
          <span>Morale</span>
          <span>{director.morale}</span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {director.genreExpertise?.map((genre, idx) => (
          <span
            key={`${genre}-${idx}`}
            className="rounded-full bg-violet-500/20 px-3 py-1 text-xs text-violet-300"
          >
            {genre}
          </span>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 rounded-2xl border border-slate-800 bg-slate-950/40 p-3 text-center">
        <div>
          <p className="text-lg font-bold text-white">
            {director.moviesDirected || 0}
          </p>
          <p className="text-xs text-slate-500">Movies</p>
        </div>

        <div>
          <p className="text-lg font-bold text-green-400">
            {director.hitMovies || 0}
          </p>
          <p className="text-xs text-slate-500">Hits</p>
        </div>

        <div>
          <p className="text-lg font-bold text-red-400">
            {director.flopMovies || 0}
          </p>
          <p className="text-xs text-slate-500">Flops</p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-lg font-bold text-green-400">
          ₹{formatMoney(director.salary)}
          <span className="ml-1 text-xs text-slate-400">/week</span>
        </p>
      </div>

      {mode === "market" && (
        <button
          onClick={() => onHire(index)}
          className="mt-4 w-full rounded-xl bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-700"
        >
          Hire Director
        </button>
      )}

      {mode === "owned" && (
        <button
          onClick={() => onFire(index)}
          className="mt-4 w-full rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700"
        >
          Release Director
        </button>
      )}
    </div>
  );
};

export default DirectorCard;
