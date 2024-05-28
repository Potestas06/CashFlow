import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFound from "./site/NotFound";
import Nav from "./Component/nav";
import Home from "./site/home";
import Foot from "./Component/fooooooot";
import Login from "./site/login";
import Register from "./site/register";
import Manage from "./site/manag";

function App() {
  return (
    <Router>
      <header>
        <Nav />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/manage" element={<Manage />} />
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
