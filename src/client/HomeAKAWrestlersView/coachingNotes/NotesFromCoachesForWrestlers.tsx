import React from "react";
import Moment from "react-moment";

export default function NotesFromCoachesForWrestlers(props: any) {
  const [notes, setNotes] = React.useState([]);

  let UID = props.UID;

  React.useEffect(() => {
    fetch(`/api/coaches_notes_for_wrestlers/${UID}`)
      .then((res) => res.json())
      .then((results) => {
        setNotes(results);
      });
  }, []);



  return (
    <div>
      <table className="table " >
        <thead className="">
          <tr className="bg-dark">
            <th style={{color: "white"}}>Date</th>
            <th style={{color: "white"}}>Coaches Name</th>
            <th style={{color: "white"}}>Notes</th>
          </tr>
        </thead>
        <tbody >
          {notes.map((note: any) => {
            return (
              <tr key={note.id}>
                <td style={{color: "white"}}>
                  <Moment format="MM/DD/YYYY">{note.created_at}</Moment>
                </td>

                <td style={{color: "white"}}>{note.coaches_first_name} {note.coaches_last_name}</td>
                <td style={{ overflow: "hidden", color: "white" }}>{note.notes}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
