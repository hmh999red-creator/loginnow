import { useNavigate } from "react-router-dom";

const cards = [
  {
    title: "Products",
    description: "Browse and manage your full product catalog.",
    icon: "📦",
    path: "/products",
    tag: "Manage inventory & pricing",
    bg: "from-red-600 to-red-800",
  },
  {
    title: "Brands",
    description: "View and organize all your product brands.",
    icon: "🏷️",
    path: "/brands",
    tag: "Control brand identity",
    bg: "from-gray-800 to-gray-900",
  },
  {
    title: "Categories",
    description: "Structure your products into smart categories.",
    icon: "📂",
    path: "/categories",
    tag: "Organize efficiently",
    bg: "from-red-700 to-red-900",
  },
];

function HomePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="min-h-screen bg-gray-950">

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-700 via-red-600 to-red-800 px-10 py-24">
        {/* decorative circles */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white opacity-5 rounded-full" />
        <div className="absolute -bottom-32 -left-10 w-72 h-72 bg-white opacity-5 rounded-full" />

        <div className="relative max-w-5xl mx-auto">
          <p className="text-red-300 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-red-300 inline-block" />
            Welcome back, {user?.name || "Guest"}
          </p>
          <h1 className="text-6xl font-black text-white mb-6 leading-none tracking-tight">
            LoginNow<br />
            <span className="text-red-200">Dashboard</span>
          </h1>
          <p className="text-red-100 text-lg max-w-lg opacity-80">
            Your central hub for managing products, brands, and categories — built for speed and precision.
          </p>

          {/* Stats row */}
          <div className="flex gap-8 mt-12">
            {["Products", "Brands", "Categories", "Orders"].map((label) => (
              <div key={label} className="border-l-2 border-red-400 pl-4">
                <p className="text-white text-xs uppercase tracking-widest opacity-60">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto px-10 py-16">
        <p className="text-gray-500 text-xs uppercase tracking-widest mb-8 flex items-center gap-3">
          <span className="w-6 h-px bg-gray-600 inline-block" />
          Quick Access
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((card) => (
            <div
              key={card.title}
              onClick={() => navigate(card.path)}
              className={`relative overflow-hidden cursor-pointer rounded-2xl bg-gradient-to-br ${card.bg} p-8 group transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-8 translate-x-8" />
              <div className="text-4xl mb-6">{card.icon}</div>
              <h3 className="text-white text-2xl font-black mb-2">{card.title}</h3>
              <p className="text-white opacity-60 text-sm mb-6">{card.description}</p>
              <span className="text-white text-xs uppercase tracking-widest opacity-40 group-hover:opacity-80 transition flex items-center gap-2">
                {card.tag}
                <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 py-6 text-center text-gray-600 text-xs tracking-widest uppercase">
        LoginNow © {new Date().getFullYear()} — Built with React & Laravel
      </div>
    </div>
  );
}

export default HomePage;