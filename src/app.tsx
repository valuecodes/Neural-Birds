import { BackGround } from "./components/back-ground/back-ground";
import { Footer } from "./components/back-ground/footer";
import { Main } from "./components/main-section/main";
import { NavBar } from "./components/nav-bar/nav-bar";
import { GlobalGenerationalProvider } from "./context/global-generational";
import { GlobalInOutProvider } from "./context/global-in-out";
import { GlobalOptionsProvider } from "./context/global-options";
import { GlobalProvider } from "./context/global-state";

import "./app.css";

const App = () => (
  <GlobalProvider>
    <GlobalOptionsProvider>
      <GlobalGenerationalProvider>
        <GlobalInOutProvider>
          <div className="App">
            <NavBar />
            <BackGround />
            <Main />
            <Footer />
          </div>
        </GlobalInOutProvider>
      </GlobalGenerationalProvider>
    </GlobalOptionsProvider>
  </GlobalProvider>
);

export { App };
