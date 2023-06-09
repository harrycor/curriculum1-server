import * as React from "react";
import { Link } from "react-router-dom";

const Home = (props: HomeProps) => {
  return (
    <>
      <div className="row">
        <img
          className="mx-auto"
          src="https://i.ibb.co/S505hdx/private-lesson-photo-1.png"
          alt="a good pic"
        />
      </div>

      <h1 className="text text-center">Welcome to WrestlingCurriculum.com</h1>
      <main>
        <section className="d-flex mt-4 justify-content-center">
          <div className="d-flex">
            <Link to={`/login`} className="mb-2 mr-2 btn btn-primary">
              Login
            </Link>
          </div>
          <div className="d-flex">
            <a
              target={"_blank"}
              href={`https://find.wrestlingtournaments.com/curriculum-create-account/`}
              className="mb-2 ml-2 btn btn-secondary"
            >
              Create An Account
            </a>
          </div>
          <div className="d-flex">
            <Link
              to={`/createTeamAccount`}
              className="mb-2 ml-2 btn btn-secondary"
            >
              Create A Team Account
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

interface HomeProps {}

export default Home;
