import { useGlobalGenerational } from "~/context/global-generational";
import { useGlobalState } from "~/context/global-state";
import type { ActivePage } from "~/types";
import { images } from "~/utils/images";

const NavBar = () => {
  const { setActivePage, activePage } = useGlobalState();
  const { resetGenerationalData } = useGlobalGenerational();

  // Switching pages starts every view from a fresh run.
  const navigate = (page: ActivePage) => {
    if (page !== activePage) {
      resetGenerationalData();
    }
    setActivePage(page);
  };

  return (
    <div className="navbar">
      <div className="logo">
        <img
          style={{
            display:
              window.innerWidth < 1050 && activePage !== "landing"
                ? "none"
                : "",
          }}
          alt="Main Logo"
          className="mainLogo"
          src={images.mainLogo}
        />
      </div>
      <button type="button" onClick={() => navigate("simulation")}>
        Simulation
      </button>
      <button type="button" onClick={() => navigate("playMode")}>
        Play
      </button>
    </div>
  );
};

export { NavBar };
