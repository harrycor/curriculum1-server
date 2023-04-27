import React, { useEffect, useState } from "react";
import { IGradeWithWrestlerInfo, IMove, IWrestler } from "../../../types";
import SelectMoveToGrade from "./SelectMoveToGrade";
import SelectWrestlersToGrade from "./SelectWrestlersToGrade";
import classNames from "classnames";
import Previous5Logins from "../allGradesAllLevelsFor2Wrestlers/Previous5Logins";
import SubmitNoteForWrestler from "../allGradesAllLevelsFor2Wrestlers/SubmitNoteForWrestler";

export default function GradeMultipleWrestlers(props: IProps) {
  const [wrestlersSelectedToGrade, setWrestlersSelectedToGrade] = useState<
    IWrestler[]
  >([]);
  const [moveSelectedToGrade, setMoveSelectedToGrade] = useState<IMove>();
  const [eachWrestlersGradeOnTheMove, setEachWrestlersGradeOnTheMove] =
    useState<IGradeWithWrestlerInfo[]>([]);
  const [newGrade, setNewGrade] = useState<any>({});
  const [newNote, setNewNote] = useState<any>({});
  const [booleanForRerender, setBooleanForRerender] = useState(false);

  let token = localStorage.getItem("token");
  let UID = localStorage.getItem("UID");

  useEffect(() => {
    if (wrestlersSelectedToGrade.length > 0) {
      let allWrestlerIds: number[] = [];
      for (let x = 0; x < wrestlersSelectedToGrade.length; x++) {
        allWrestlerIds.push(wrestlersSelectedToGrade[x].user_id);
      }

      fetch("/api/grades/getAllGradesForSelectedWrestlers", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          videoId: moveSelectedToGrade ? moveSelectedToGrade.id : 0,
          allWrestlerIds,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((result: IGradeWithWrestlerInfo[]) => {
          let mostRecentGradeForEachWrestler: IGradeWithWrestlerInfo[] = [];
          //Only accept the most recent grade for each wrestler. They are ordered coming in.
          for (let y = 0; y < allWrestlerIds.length; y++) {
            for (let x = 0; x < result.length; x++) {
              if (result[x].student_user_id == allWrestlerIds[y]) {
                mostRecentGradeForEachWrestler.push(result[x]);
                break;
              }
            }
          }

          //add fake grades for wrestlers who don't have grades at all.
          for (let q = 0; q < wrestlersSelectedToGrade.length; q++) {
            for (let w = 0; w < mostRecentGradeForEachWrestler.length; w++) {
              if (
                wrestlersSelectedToGrade[q].user_id ==
                mostRecentGradeForEachWrestler[w].student_user_id
              ) {
                break; // the wrestler already has a grade
              }

              //adds new grade for wrestlers who don't have a grade
              if (w == mostRecentGradeForEachWrestler.length - 1) {
                console.log("Fake grade added");
                mostRecentGradeForEachWrestler.push({
                  // id: 0,
                  video_id: moveSelectedToGrade?.id,
                  // coach_user_id: null,
                  student_user_id: wrestlersSelectedToGrade[q].user_id,
                  // grade: 0,
                  // created_at: new Date(), //not sure what this does
                  movement_notes:
                    "This wrestler hasn't been graded on this yet",
                  first_name: wrestlersSelectedToGrade[q].first_name,
                  last_name: wrestlersSelectedToGrade[q].last_name,
                  // notes: "This wrestler has never been graded",
                  // maximum_grade: 3,
                });
                break;
              }
            }
            if (mostRecentGradeForEachWrestler.length == 0) {
              console.log("First fake grade added");
              mostRecentGradeForEachWrestler.push({
                // id: 0,
                video_id: moveSelectedToGrade?.id
                  ? moveSelectedToGrade.id
                  : undefined,
                // coach_user_id: null,
                student_user_id: wrestlersSelectedToGrade[q].user_id,
                // grade: 0,
                // created_at: new Date(), //not sure what this does
                movement_notes: "This wrestler hasn't been graded on this yet",
                first_name: wrestlersSelectedToGrade[q].first_name,
                last_name: wrestlersSelectedToGrade[q].last_name,
                // notes: "This wrestler has never been graded",
                // maximum_grade: 3,
              });
            }
          }

          mostRecentGradeForEachWrestler.sort((a, b) => {
            return a.last_name
              .toLowerCase()
              .localeCompare(b.last_name.toLowerCase());
          });

          mostRecentGradeForEachWrestler.sort((a, b) => {
            return a.first_name
              .toLowerCase()
              .localeCompare(b.first_name.toLowerCase());
          });

          setEachWrestlersGradeOnTheMove(mostRecentGradeForEachWrestler);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [wrestlersSelectedToGrade, moveSelectedToGrade, booleanForRerender]);

  let addWrestlersToTheArray = (wrestler: IWrestler) => {
    for (let z = 0; z < wrestlersSelectedToGrade.length; z++) {
      if (wrestlersSelectedToGrade[z].id == wrestler.id) {
        console.log("already had this wrestler added");
        return;
      }
    }

    setWrestlersSelectedToGrade((prevState) => [...prevState, wrestler]);
  };

  const onNoteChange = (event: any) => {
    setNewNote((prevState: any) => {
      return {
        ...prevState,
        [event.target.name]: event.target.value,
      };
    });
  };

  const onGradeChange = (event: any) => {
    setNewGrade((prevState: any) => {
      return {
        ...prevState,
        [event.target.name]: event.target.value,
      };
    });
  };

  let submitNewGradeOrNewNote = (
    video_id: number | undefined,
    user_id: number,
    grade: number | undefined,
    note: string | undefined,
    maximum_grade: number
  ) => {
    if (grade == undefined || video_id == undefined) {
      return;
    }
    if (grade > maximum_grade) {
      alert(
        `GRADE NOT SUBMITTED! You cannot submit a grade higher than a maximum of ${maximum_grade} for this move`
      );
    } else if (grade < 0) {
      alert(
        "GRADE NOT SUBMITTED! You cannot submit a grade of a negative number"
      );
    } else {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          video_id: video_id,
          coach_user_id: Number(UID),
          student_user_id: user_id,
          grade: Number(grade),
          movement_notes: note,
        }),
      };
      fetch(`/api/grades/`, requestOptions).then((res) => {
        if (res.ok) {
          alert(
            `A grade of ${grade} was entered for wrestler with user ID: ${user_id}`
          );
          setBooleanForRerender(!booleanForRerender); //harry, is this correct?
        } else {
          alert(
            "GRADE NOT SUBMITTED! Something went wrong, try logging in again"
          );
        }
      });
    }
  };

  return (
    <>
      <h1>Grade Multiple Wrestlers</h1>
      <SelectWrestlersToGrade addWrestlersToTheArray={addWrestlersToTheArray} />
      <SelectMoveToGrade setMoveSelectedToGrade={setMoveSelectedToGrade} />
      <table className="table table-border" style={{ position: "relative", zIndex: 10 }}>
        <thead className="sticky-top">
          <tr style={{ position:"relative", zIndex: 5 }}>
            <th>Name</th>
            <th>Grade</th>
            <th>New grade</th>
            <th>Submit grade</th>
            <th>Note</th>
            <th>New note</th>
            <th>Submit note</th>
            <th>Last login</th>
            <th>General Note</th>
          </tr>
        </thead>
        <tbody>
          {eachWrestlersGradeOnTheMove.map((gradeWithWrestlerInfo, index) => {
            return (
              <tr
                key={gradeWithWrestlerInfo.student_user_id}
                className={`${classNames({
                  gradeOf3: gradeWithWrestlerInfo.grade === 3,
                  gradeOf2: gradeWithWrestlerInfo.grade === 2,
                  gradeOf1: gradeWithWrestlerInfo.grade === 1,
                  gradeOfIncorrect: gradeWithWrestlerInfo.grade
                    ? gradeWithWrestlerInfo.grade > 3 ||
                      gradeWithWrestlerInfo.grade < 0
                    : false,
                  notGradeable: gradeWithWrestlerInfo.maximum_grade === 0,
                })} my-1 p-2`}
              >
                <td>
                  {gradeWithWrestlerInfo.first_name}{" "}
                  {gradeWithWrestlerInfo.last_name}
                </td>
                <td>{gradeWithWrestlerInfo.grade}</td>
                <td>
                  <input
                    name={`${gradeWithWrestlerInfo.student_user_id}`}
                    onChange={onGradeChange}
                    placeholder="0, 1, 2, or 3"
                  />
                </td>
                <td>
                  <button
                    onClick={() => {
                      if (moveSelectedToGrade == undefined) {
                        alert(
                          "the maximum grade is undefined, did you select a move to grade?"
                        );
                        return;
                      }
                      submitNewGradeOrNewNote(
                        gradeWithWrestlerInfo.video_id,
                        Number(gradeWithWrestlerInfo.student_user_id),
                        Number(newGrade[gradeWithWrestlerInfo.student_user_id]),
                        gradeWithWrestlerInfo.movement_notes,
                        moveSelectedToGrade?.maximum_grade
                      );
                    }}
                    className="btn btn-success btn-sm"
                  >
                    Submit grade
                  </button>
                </td>
                <td>{gradeWithWrestlerInfo.movement_notes}</td>
                <td>
                  <textarea
                    rows={1}
                    cols={30}
                    name={`${gradeWithWrestlerInfo.student_user_id}`}
                    onChange={onNoteChange}
                  ></textarea>
                </td>
                <td>
                  <button
                    onClick={() => {
                      if (moveSelectedToGrade == undefined) {
                        alert(
                          "the maximum grade is undefined, did you select a move to grade?"
                        );
                        return;
                      }
                      submitNewGradeOrNewNote(
                        gradeWithWrestlerInfo.video_id,
                        Number(gradeWithWrestlerInfo.student_user_id),
                        gradeWithWrestlerInfo.grade,
                        newNote[gradeWithWrestlerInfo.student_user_id],
                        moveSelectedToGrade?.maximum_grade
                      );
                    }}
                    className="btn btn-success btn-sm"
                  >
                    Submit note
                  </button>
                </td>
                <td>
                  <Previous5Logins
                    userId={gradeWithWrestlerInfo.student_user_id}
                  />
                </td>
                <td>
                  <SubmitNoteForWrestler
                    wrestlerId={gradeWithWrestlerInfo.student_user_id}
                    wrestlerFullName={
                      gradeWithWrestlerInfo.first_name +
                      gradeWithWrestlerInfo.last_name
                    }
                    first_name={gradeWithWrestlerInfo.first_name}
                    last_name={gradeWithWrestlerInfo.last_name}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

interface IProps {}
