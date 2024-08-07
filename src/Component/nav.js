import { Link, useNavigate } from "react-router-dom";
import {auth} from "../firebase";

function Nav({user}) {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await auth.signOut();
      alert("Logout successful!");
      navigate("/Login");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <div className="container">
      <nav>
        <ul>
          <li>
            {window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches ? (
              <a href="/">
                <img
                  src={`${process.env.PUBLIC_URL}/img/logo_dark.jpg`}
                  alt="Cashflow"
                  className="logo"
                />
              </a>
            ) : (
              <a href="/">
                <img
                  src={`${process.env.PUBLIC_URL}/img/logo_light.jpg`}
                  alt="Cashflow"
                  className="logo"
                />
              </a>
            )}
          </li>
        </ul>
        <ul>
          <li>
            <Link to="/Dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/Manage">Manage</Link>
          </li>
          <li>
            <details className="dropdown">
              <summary>
                {user ? user.email : "Account"}
              </summary>
              <ul dir="rtl">
                {user ? (
                    <>
                      <li>
                        <button onClick={logout}>Logout</button>
                      </li>
                      <li>
                        <a href="/Profile">Profile</a>
                      </li>
                    </>
                ) : (
                    <li>
                      <Link to="/Login">Login</Link>
                    </li>
                )}
              </ul>
            </details>
          </li>
        </ul>
      </nav>
      <br/>
      <br/>
    </div>
  );
}

export default Nav;
