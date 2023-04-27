import { Query } from "./index";

const allNotes = async () => {
  return Query("SELECT * from coaches_notes_for_wrestlers");
};

// "Select * from coaches_notes_for_wrestlers WHERE for_wrestler=? ORDER BY created_at DESC LIMIT 20;",
const allNotesFor1Wrestler = async (wrestlerID: number) => {
  return Query(
    `Select coaches_notes_for_wrestlers.*,
    pi.first_name as coaches_first_name,
    pi.last_name as coaches_last_name
from coaches_notes_for_wrestlers
      left join personal_info pi on coaches_notes_for_wrestlers.from_coach = pi.user_id
WHERE for_wrestler = ?
ORDER BY created_at DESC
LIMIT 20;`,
    [wrestlerID]
  );
};

const createNote = async (
  notes: string,
  coachID: number,
  WrestlerID: number
) => {
  return Query(
    `
    Insert INTO coaches_notes_for_wrestlers (notes,from_coach,for_wrestler)
Values (?,?,?);
    `,
    [notes, coachID, WrestlerID]
  );
};

export default {
  allNotes,
  allNotesFor1Wrestler,
  createNote,
};
