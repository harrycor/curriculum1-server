import { Query } from "./index";
import { IPerson } from "../../types";

//     id: number;
//     first_name: string;
//     last_name: string;
//     notes: string;
//     user_id: number;
//     date_created: Date;

//this gets all of the personal_info, but only for users from the corresponding tenant
const allPeopleRelevantToUser = async (UID: number) => {
  return Query(
    `
  Select * from users
      Join personal_info ON personal_info.user_id = users.id
      Where tenant = (Select tenant from users Where id=?);
  `,
    [UID]
  );
};

const singlePerson = async (id: number) => {
  return Query("SELECT * FROM personal_info WHERE user_id=?", [id]);
};

const insertNewPersonalInfoWithUserId = (userId: number) => {
  return Query(
    `
  insert into personal_info(user_id)
  values (?);
  `,
    [userId]
  );
};

const createPerson = async (person: IPerson) => {
  return Query(
    `INSERT INTO personal_info (first_name, last_name, notes, user_id) VALUES (?,?,?,?)`,
    [person.first_name, person.last_name, person.notes, person.user_id]
  );
};

const createPersonFromAdminCreate = async (
  first_name: string,
  last_name: string,
  notes: string,
  user_id: number
) => {
  return Query(
    `INSERT INTO personal_info (first_name, last_name, notes, user_id) VALUES (?,?,?,?)`,
    [first_name, last_name, notes, user_id]
  );
};

const updatePerson = async (person: IPerson) => {
  return Query(
    `UPDATE personal_info SET first_name=?, last_name=?, notes=? WHERE user_id=?`,
    [person.first_name, person.last_name, person.notes, person.user_id]
  );
};

const updatePersonsCurrentItem = async (UID: number, itemId: number) => {
  const data = await Query(
    `update personal_info set current_item_id = ? where user_id = ?;`,
    [itemId, UID]
  );
  return data;
};

const updateFirstNameForUserId = (userId: number, firstName: string) => {
  return Query(
    `
  update personal_info
  set first_name = ?
  where user_id = ?;
  `,
    [firstName, userId]
  );
};

const updateLastNameForUserId = (userId: number, lastName: string) => {
  return Query(
    `
  update personal_info
  set last_name = ?
  where user_id = ?;
  `,
    [lastName, userId]
  );
};

const deletePerson = async (id: number) => {
  return Query(`DELETE FROM personal_info WHERE id=?`, [id]);
};

export default {
  allPeopleRelevantToUser,
  singlePerson,
  insertNewPersonalInfoWithUserId,
  createPerson,
  updatePerson,
  updateFirstNameForUserId,
  updateLastNameForUserId,
  deletePerson,
  createPersonFromAdminCreate,
  updatePersonsCurrentItem,
};
