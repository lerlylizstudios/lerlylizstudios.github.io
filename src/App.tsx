// Hand-rolled page switch + drawer nav (no router), mirroring the reference.
// The dev-only /styleguide route stays reachable in development.
import { lazy, Suspense, useEffect, useState } from "react";
import type { Page } from "./nav";
import { useData, type Settings } from "./lib/useData";
import { SiteHeader } from "./components/SiteHeader";
import { Drawer } from "./components/Drawer";
import { Footer } from "./components/Footer";
import { GrainDefs, Grain } from "./art/svg";
import { Home } from "./pages/Home";
import { Gallery } from "./pages/Gallery";
import { Order } from "./pages/Order";
import { About } from "./pages/About";
import { FAQ } from "./pages/FAQ";

const StyleGuide = lazy(() => import("./styleguide/StyleGuide"));
// The owner CMS. Lazy so its GitHub/canvas code never ships to normal visitors.
const Admin = lazy(() => import("./admin/Admin"));

const SETTINGS_FALLBACK: Settings = {
  commissionsOpen: true,
  listingDescription: "",
  howItWorks: [],
};

const isAdminHash = () => window.location.hash.replace(/^#/, "") === "admin";

export default function App() {
  // Dev-only design system route — kept as its own branch so the app's hooks
  // aren't declared conditionally.
  if (import.meta.env.DEV && window.location.pathname.replace(/\/$/, "") === "/styleguide") {
    return (
      <Suspense fallback={null}>
        <StyleGuide />
      </Suspense>
    );
  }
  return <Root />;
}

// Top-level switch between the owner CMS (#admin) and the public site.
function Root() {
  const [admin, setAdmin] = useState(isAdminHash);
  useEffect(() => {
    const onHash = () => setAdmin(isAdminHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  if (admin) {
    return (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    );
  }
  return <SiteApp />;
}

const PAGES: Page[] = ["home", "gallery", "order", "about", "faq"];
const pageFromHash = (): Page => {
  const h = window.location.hash.replace(/^#/, "") as Page;
  return PAGES.includes(h) ? h : "home";
};

function SiteApp() {
  const [page, setPage] = useState<Page>(pageFromHash);
  const [menuOpen, setMenuOpen] = useState(false);

  // Hash sync — deep-linkable pages + working browser back/forward, no router.
  useEffect(() => {
    const onHash = () => {
      setPage(pageFromHash());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Commissions state seeds from settings.json (owner-controlled in the admin)
  // and drives the badge + CTAs sitewide.
  const settings = useData<Settings>("/content/settings.json", SETTINGS_FALLBACK);
  const commissionsOpen = settings.commissionsOpen;

  const nav = (p: Page) => {
    setMenuOpen(false);
    window.location.hash = p === "home" ? "" : p; // fires hashchange -> setPage
    setPage(p);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <GrainDefs />
      <Grain />
      <SiteHeader nav={nav} onMenuOpen={() => setMenuOpen(true)} />
      <Drawer open={menuOpen} current={page} onClose={() => setMenuOpen(false)} nav={nav} />

      <main className="flex-1">
        {page === "home" && <Home nav={nav} commissionsOpen={commissionsOpen} />}
        {page === "gallery" && <Gallery nav={nav} />}
        {page === "order" && <Order settings={settings} commissionsOpen={commissionsOpen} />}
        {page === "about" && <About />}
        {page === "faq" && <FAQ nav={nav} />}
      </main>

      <Footer nav={nav} />
    </div>
  );
}
