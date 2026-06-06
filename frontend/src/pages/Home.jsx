import "../styles/Home.css";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="homeContainer">

      <Navbar />

      <div className="homeContent">

        <div>
          <h1 className="homeTitle">
            Bienvenido
          </h1>

          <p className="homeText">
            Aprender es crecer un poco cada día.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Home;