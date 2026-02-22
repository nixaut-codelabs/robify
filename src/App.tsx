import "./index.css";
import { Navbar } from "@/components/Navbar";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { Footer } from "@/components/Footer";
import { Router, Routes } from "@/lib/router";
import { HomePage } from "@/pages/HomePage";
import { FastFlagsPage } from "@/pages/FastFlagsPage";
import { ProfilesPage } from "@/pages/ProfilesPage";

const routes = [
  { path: "/", component: HomePage },
  { path: "/fflags", component: FastFlagsPage },
  { path: "/profiles", component: ProfilesPage },
];

export function App() {
  return (
    <Router>
      <div className="relative min-h-screen grid-bg">
        <ParticlesBackground />
        <Navbar />
        <main>
          <Routes routes={routes} />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
