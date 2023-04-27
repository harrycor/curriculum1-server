import React from "react";

function GradesOfX() {
  const [movesAndGrades, setMovesAndGrades] = React.useState([]);
  let token = localStorage.getItem("token");
  let UID = localStorage.getItem("UID");

  const onGradeChange = (event: any) => {
    let grade = event.target.value;
    fetch(
      `/api/grades/allSpecificCurrentGradesForASingleWrestler/${UID}/${grade}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((results) => {
        setMovesAndGrades(results);
      });
  };
  return (
    <>
      <label className="h4">
        Show me all of the moves where I have a grade of :{" "}
      </label>
      <input
        type="number"
        onChange={onGradeChange}
        // placeholder="insert 1, 2, or 3"
      />
      <p>(Limit 10 results)</p>
      <div className="container">
        <div className="col-12">
          <div>
            <h3>{
              // @ts-ignore
              movesAndGrades.length != 0 ? `Moves You Have a ${movesAndGrades[0].grade} on`  :"Please insert 1, 2, or 3"
            }</h3>
            {movesAndGrades.map((move: any) => {
              return (
                <div key={move.id}>
                  <hr />
                  <h5>
                    {move.number_for_ordering}. {move.name_of_video}
                  </h5>
                  <div className="m-2">
                    <a href={move.url_to_video} target="_blank">
                      <h6>Link to Detailed Video</h6>
                    </a>
                  </div>
                  <div className="m-2">
                    <a href={move.url_to_looped_video} target="_blank">
                      <h6>Link to Looped Video</h6>
                    </a>
                  </div>

                  <h5>Coaches' notes: {move.movement_notes}</h5>
                  <hr />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default GradesOfX;
