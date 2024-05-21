import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFound from "./site/NotFound";
import Nav from "./Component/nav";
import Home from "./site/home";
import Foot from "./Component/fooooooot";

function App() {
  return (
    <Router>
      <header>
        <Nav />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer>
        <Foot />
      </footer>
    </Router>
  );
}

export default App;
