import React from "react";
import { Link } from "react-router-dom";
import GradesOfX from "./movesByGrade/GradesOfX";
import MoveSearch from "./moveSearch/MoveSearch";
import NotesFromCoachesForWrestlers from "./coachingNotes/NotesFromCoachesForWrestlers";
import NavigationBar from "../NavigationBar";
import GradingDashboardMadeByLuke from "../other/GradingDashboardMadeByLuke";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoIosArrowDropup } from "react-icons/io";

function WrestlersView() {
  const [moves, setMoves] = React.useState([]);
  const [levels, setLevels] = React.useState([]);
  const [notesFromCoachesDropDown, setNotesFromCoachesDropDown] =
    React.useState(false);
  const [gradesOfXDropDown, setGradesOfXDropDown] = React.useState(false);
  // const [levelsDropDown, setLevelsDropDown] = React.useState(false);
  const [moveSearchDropDown, setMoveSearchDropDown] = React.useState(false);
  const [moveSearchComponentIsDown, setMoveSearchComponentIsDown] =
    React.useState<boolean>(false);

  let token = localStorage.getItem("token");
  let UID = Number(localStorage.getItem("UID"));

  React.useEffect(() => {
    fetch(`/api/videos/blah/${UID}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((results) => {
        setLevels(results);
      });
  }, []);

  return (
    <div style={{ marginBottom: "2rem" }}>
      <NavigationBar />
      <hr />
      <div className="ml-2">
        <div className="d-flex justify-content-center flex-wrap">
          <button
            className="btn btn-primary m-1"
            style={{ cursor: "pointer" }}
            onClick={() =>
              setNotesFromCoachesDropDown(!notesFromCoachesDropDown)
            }
          >
            Recent coaching notes{" "}
            {notesFromCoachesDropDown ? (
              <IoIosArrowDropup />
            ) : (
              <IoIosArrowDropdown />
            )}
          </button>

          <button
            className="btn btn-primary m-1"
            style={{ cursor: "pointer" }}
            onClick={() => setGradesOfXDropDown(!gradesOfXDropDown)}
          >
            Moves By Grade{" "}
            {gradesOfXDropDown ? <IoIosArrowDropup /> : <IoIosArrowDropdown />}
          </button>

          <button
            className="btn btn-primary m-1"
            style={{ cursor: "pointer" }}
            onClick={() =>
              setMoveSearchComponentIsDown(!moveSearchComponentIsDown)
            }
          >
            Move Search
            {moveSearchComponentIsDown ? (
              <IoIosArrowDropup />
            ) : (
              <IoIosArrowDropdown />
            )}
          </button>

          <Link to={"/AllGradesAllLevels"}>
            <button
              className="btn btn-dark m-1"
              style={{ textDecoration: "underline" }}
            >
              Click here to view all of your grades
            </button>
          </Link>
        </div>
        <hr />
        {notesFromCoachesDropDown && <NotesFromCoachesForWrestlers UID={UID} />}
        {gradesOfXDropDown && <GradesOfX />}
        {moveSearchComponentIsDown && (
          <div style={{ height: "60rem" }}>
            {" "}
            <MoveSearch />
          </div>
        )}
      </div>
    </div>
  );
}

//delete this comment

export default WrestlersView;
