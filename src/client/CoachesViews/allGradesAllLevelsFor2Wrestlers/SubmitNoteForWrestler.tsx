import React, { useEffect, useState } from "react";
import { IPerson, IUser } from "../../../types";

export default function SubmitNoteForWrestler({
  showNote = false,
  wrestlerId,
  wrestlerFullName,
  first_name,
  last_name,
}: IProps) {
  const [notes, setNotes] = useState("not it");
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [coachesUserInfo, setCoachesUserInfo] = useState<IUser[]>([]);
  const [coachesPersonalInfo, setCoachesPersonalInfo] = useState<IPerson[]>([]);
  const [showSubmitWrestlerNote, setShowSubmitWrestlerNote] = useState(false);

  let token = localStorage.getItem("token");
  let UID = Number(localStorage.getItem("UID"));

  // Gets the coaches' user info.
  useEffect(() => {
    fetch(`/api/users/${UID}`)
      .then((res) => res.json())
      .then((results) => {
        setCoachesUserInfo(results);
      });
  }, []);

  // Get the coaches' personal info
  useEffect(() => {
    fetch(`/api/personal_info/person/${UID}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((results) => {
        setCoachesPersonalInfo(results);
      });
  }, []);

  let handleChange = (event: any) => {
    setNotes(event.target.value);
  };

  useEffect(() => {
    fetch(`/api/users`)
      .then((res) => res.json())
      .then((results) => {
        setAllUsers(results);
      });
  }, []);

  let submitNote = (note: string, from_coach: number, for_wrestler: number) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        notes: note,
        from_coach: from_coach,
        for_wrestler: for_wrestler,
      }),
    };
    fetch(`/api/coaches_notes_for_wrestlers`, requestOptions).then((res) => {
      if (res.ok) {
        alert(`Note submitted!`);

        //Sends an email letting them know about the new note
        let wrestlerEmail: string | undefined;
        try {
          for (let x = 0; x < allUsers.length; x++) {
            if (allUsers[x].id === wrestlerId) {
              wrestlerEmail = allUsers[x].real_email;
            }
          }
          if (wrestlerEmail) {
            fetch("/api/contact", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                to: wrestlerEmail,
                subject: `${wrestlerFullName} has received a message from coach ${coachesPersonalInfo[0].first_name} ${coachesPersonalInfo[0].last_name}`,
                html: `<p>Coach ${coachesPersonalInfo[0].first_name} ${coachesPersonalInfo[0].last_name} has left a message for ${first_name} ${last_name} on <a href="https://www.wrestlingcurriculum.com/">https://www.wrestlingcurriculum.com/</a><br>
              The message is:</p>
              <h4>${note}</h4>
              `,
              }),
            })
              .then((res) => res.json())
              .then((result) => {
                console.log(result.message);
                alert(result.message);
              });
          } else {
            alert("no email on file, cannot send email.");
          }
        } catch (error) {
          console.log(error);
          alert("email not sent");
        }
      } else {
        alert(
          "NOTE NOT SUBMITTED! Something went wrong. Try logging out and then logging in again. If that doesn't work, contact us"
        );
      }
    });
  };

  // HTML
  if (!showNote) {
    return (
      <>
        <button
          className="btn btn-secondary"
          onClick={() => {
            setShowSubmitWrestlerNote(!showSubmitWrestlerNote);
          }}
        >
          Send new note to wrestler
        </button>
        {showSubmitWrestlerNote && (
          <>
            <div className="d-flex justify-content-center">
              <textarea
                rows={10}
                cols={20}
                onChange={handleChange}
                placeholder="add notes"
              ></textarea>
            </div>

            <div className="d-flex justify-content-center">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  submitNote(notes, UID, wrestlerId);
                }}
              >
                Submit Note!
              </button>
            </div>
          </>
        )}
      </>
    );
  } else {
    return (
      <div
        style={{ height: "14vh", position: "relative", width: "90vw" }}
        className="d-flex pb-4 justify-content-center align-items-center mt-5"
      >
        <div style={{ flexGrow: 1, position: "relative" }} className="m-2 ">
          <textarea
            style={{ width: "100%" }}
            rows={2}
            onChange={handleChange}
            placeholder="add notes"
          ></textarea>
        </div>

        <button
          className="btn btn-primary m-2"
          onClick={() => {
            submitNote(notes, UID, wrestlerId);
          }}
        >
          Submit Note!
        </button>
      </div>
    );
  }
}

interface IProps {
  wrestlerId: number;
  wrestlerFullName: string;
  first_name: string;
  last_name: string;
  showNote?: boolean;
}
