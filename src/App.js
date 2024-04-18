import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFound from "./site/NotFound";
import Nav from "./Component/nav";
import Home from "./site/home";

function App() {
  return (
    <Router>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer></footer>
    </Router>
  );
}

export default App;
