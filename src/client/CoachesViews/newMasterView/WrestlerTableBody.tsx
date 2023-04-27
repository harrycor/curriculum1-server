import React, { useState } from "react";
import { GradeInterface } from "./MasterView";
import Moment from "react-moment";
import classNames from "classnames";

interface PropInterface {
  wrestler?: {
    id: number;
    show: boolean;
    grades: GradeInterface[];
  };
  arrayKey: number;
  enterGrade: (
    video_id: number,
    user_id: number,
    grade: number,
    note: string,
    coach_user_id: number,
    max_grade: number
  ) => void;
}

export default function WrestlerTableBody({
  wrestler,
  enterGrade,
  arrayKey,
}: PropInterface) {
  const [grades, setGrades] = useState<{ [key: number]: number }>();
  const [notes, setNotes] = useState<{ [key: number]: string }>();

  const UID = localStorage.getItem("UID");

  const handleGradeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setGrades((prev) => {
      return {
        ...prev,
        [name]: Number(value),
      };
    });
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setNotes((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  type gradeOrTextType = "grade" | "note";

  // Resets input fields
  const resetField = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    gradeOrText: gradeOrTextType
  ) => {
    const { name } = e.target;

    if (gradeOrText == "note") {
      setNotes((prev) => {
        return {
          ...prev,
          [name]: "",
        };
      });
    }

    if (gradeOrText == "grade") {
      setGrades((prev) => {
        return {
          ...prev,
          [name]: 0,
        };
      });
    }
  };

  if (!grades && !notes) {
    // The above makes it so we only run this once
    // This function sets the grade object so we dont do it a hundred times in the map
    (function () {
      const gradeObject: { [key: number]: number } = {};

      wrestler?.grades.map((move) => {
        gradeObject[move.id] = move.grade ? move.grade : 0;
      });

      setGrades(gradeObject);
    })();

    // This function sets the notes object so we dont do it a hundred times in the map
    (function () {
      const notesObject: { [key: number]: string } = {};

      wrestler?.grades.map((move) => {
        notesObject[move.id] = move.movement_notes ? move.movement_notes : "";
      });

      setNotes(notesObject);
    })();
  }

  if (wrestler) {
    return (
      <>
        {wrestler.grades.map((video: GradeInterface) => {
          return (
            <tr
              className="text-light grade-table-row"
              key={`GradeTableBody:${video.id}`}
            >
              {arrayKey < 1 && (
                <>
                  <td>
                    <div>{video.curriculum_level}</div>
                  </td>
                  <td>
                    <div>{video.name_of_video}</div>
                  </td>
                  {/**/}
                  <td>
                    <div>
                      <a href={video.url_to_video} target="_blank">
                        Detailed Video
                      </a>
                    </div>
                  </td>
                  <td>
                    <div>
                      <a href={video.url_to_looped_video} target="_blank">
                        Looped Video
                      </a>
                    </div>
                  </td>
                </>
              )}
              <td
                className={classNames({
                  gradeOf3: video.grade === 3,
                  gradeOf2: video.grade === 2,
                  gradeOf1: video.grade === 1,
                  // @ts-ignore
                  gradeOfIncorrect: video.grade > 3 || video.grade < 0,
                  notGradeable: video.maximum_grade === 0,
                })}
              >
                <div>{video.grade ? video.grade : 0}</div>
              </td>
              <td
                className={classNames({
                  gradeOf3: video.grade === 3,
                  gradeOf2: video.grade === 2,
                  gradeOf1: video.grade === 1,
                  // @ts-ignore
                  gradeOfIncorrect: video.grade > 3 || video.grade < 0,
                  notGradeable: video.maximum_grade === 0,
                })}
              >
                <div>
                  {" "}
                  <input
                    type="number"
                    disabled={video.maximum_grade === 0}
                    onChange={handleGradeChange}
                    onFocus={(e) => resetField(e, "grade")}
                    style={{ width: "50px" }}
                    value={grades ? grades[video.id] : 0}
                    name={`${video.id}`}
                  />
                </div>
              </td>
              <td
                className={classNames({
                  gradeOf3: video.grade === 3,
                  gradeOf2: video.grade === 2,
                  gradeOf1: video.grade === 1,
                  // @ts-ignore
                  gradeOfIncorrect: video.grade > 3 || video.grade < 0,
                  notGradeable: video.maximum_grade === 0,
                })}
              >
                <div
                  style={{
                    wordBreak: "break-all",
                  }}
                >
                  <textarea
                    disabled={video.maximum_grade === 0}
                    onChange={handleNoteChange}
                    onFocus={(e) => resetField(e, "note")}
                    value={notes ? notes[video.id] : ""}
                    name={`${video.id}`}
                  ></textarea>
                </div>
              </td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    enterGrade(
                      video.id,
                      wrestler.id,
                      grades ? grades[video.id] : 0,
                      notes ? notes[video.id] : "",
                      Number(UID),
                      video.maximum_grade
                    );
                  }}
                >
                  <strong>{video.first_name}'s update</strong>
                </button>
              </td>
            </tr>
          );
        })}
      </>
    );
  }
  return null;
}
