import { Query } from "./index";
import { IUser } from "../../types";
import { generateHash } from "../utils/passwords";

const all = async () => {
  return Query("SELECT * from users");
};

const find = async (column: string, email: string) => {
  return Query(
    `Select * From users
    WHERE ??=?`,
    [column, email]
  );
};

const singleUser = async (id: number) => {
  return Query("SELECT * FROM users WHERE id=?", [id]);
};

const getSingleUserWithPersonalInfoForUserWithUserId = (userId: number) => {
  return Query(
    `
  select 
  u.id,
  u.email,
  u.real_email,
  u.role,
  u.tenant as tenant_id,
  u.phone_number,
  u.war_zone_id,
  u.is_active,
  u.on_do_not_text_list,
  pi.first_name,
  pi.last_name,
  pi.notes,
  pi.current_item_id
from users u
 left join personal_info pi on u.id = pi.user_id
where u.id = ?;
  `,
    [userId]
  );
};

const createUser = async (
  user: Omit<Required<IUser>, "id" | "date_created" | "is_active">
) => {
  let hashedPassword = generateHash(user.password);
  return <Promise<any>>Query(
    `INSERT INTO users (email, password, role, real_email, tenant,phone_number,war_zone_id, on_do_not_text_list) VALUES (?,?,?,?,?,?,?,?)`,

    [
      user.email,
      hashedPassword,
      user.role,
      user.real_email,
      user.tenant,
      user.phone_number,
      user.war_zone_id,
      user.on_do_not_text_list,
    ]
  );
};

const updateUser = async (user: Required<IUser>) => {
  return Query(
    `UPDATE users SET email=?, password=?, role=?, real_email=?,phone_number=?, war_zone_id=?, WHERE id=?`,
    [
      user.email,
      user.password,
      user.role,
      user.real_email,
      user.phone_number,
      user.war_zone_id,
      user.id,
    ]
  );
};

// TODO This is used to update the role only in the admin component, but I think we should add an if statement here that only allows the update to happen if the tenant of the admin matches the tenant of the user.
const updateRoleOnly = async (id: number, role: string) => {
  return Query(`UPDATE users SET role=? WHERE id=?`, [role, id]);
};

const deleteUser = async (id: number) => {
  return Query(`DELETE FROM users WHERE id=?`, [id]);
};

const deleteCorrespondingPersonal_info = async (id: number) => {
  return Query("DELETE FROM personal_info WHERE user_id=?", [id]);
};
const deleteCorrespondingGrades = async (id: number) => {
  return Query(
    //"DELETE FROM grades WHERE (coach_user_id=?) OR (student_user_id=?)",
    //I don't think it makes sesne to delete grades if we delete a coach (therefore I won't delete coaches). Perhaps this shouldn't have been a foreign key?
    "DELETE FROM grades WHERE student_user_id=?",
    [id, id]
  );
};

const resetPassword = async (userId: number, password: string) => {
  let hashedPassword = generateHash(password);
  return Query(
    `UPDATE users
SET password=?
WHERE id=?`,
    [hashedPassword, userId]
  );
};

const resetPhoneNumber = async (userId: number, phone_number: string) => {
  return Query(
    `UPDATE users
SET phone_number=?
WHERE id=?`,
    [phone_number, userId]
  );
};

const updateOnDoNotTextList = async (
  userId: number,
  onDoNotTextList: number
) => {
  return Query(
    `UPDATE users
    SET on_do_not_text_list=?
    WHERE id=?`,
    [onDoNotTextList, userId]
  );
};

const resetWarZoneId = async (userId: number, war_zone_id: string) => {
  return Query(
    `UPDATE users
SET war_zone_id=?
WHERE id=?`,
    [war_zone_id, userId]
  );
};

const updateEmail = async (userId: number, newEmail: string) => {
  return Query(
    `
  UPDATE users
  SET email=?
  where id=?`,
    [newEmail, userId]
  );
};

const updateRealEmail = async (userId: number, newEmail: string) => {
  return Query(
    `
  UPDATE users
  SET real_email=?
  where id=?`,
    [newEmail, userId]
  );
};

const getAllUserIDsForPasswordReset = async (email: string) => {
  //in the sentence below, "email" is actually username in the database.
  return Query("SELECT * FROM users WHERE real_email=?", [email]);
};

const activateUser = async (userId: number) => {
  return Query(
    `
  update users
    set is_active=1
    where id = ?;
  `,
    [userId]
  );
};

const deactivateUser = async (userId: number) => {
  return Query(
    `
  update users
    set is_active=0
    where id = ?;
  `,
    [userId]
  );
};

const getAllUsersWithPersonalInfoInTenantForAdmin = (tenantId: number) => {
  return Query(
    `
  select 
  u.id,
  u.email,
  u.real_email,
  u.role,
  u.tenant as tenant_id,
  u.phone_number,
  u.war_zone_id,
  u.is_active,
  u.on_do_not_text_list,
  pi.first_name,
  pi.last_name,
  pi.notes,
  pi.current_item_id
from users u
 left join personal_info pi on u.id = pi.user_id
where u.tenant = ?;
  `,
    [tenantId]
  );
};

const getAllUsersInTenantWithNames = (tenantId: number) => {
  return Query(
    `
  select u.id,
       u.email,
       u.real_email,
       u.role,
       u.tenant as tenant_id,
       pi.first_name,
       pi.last_name
  from users u
      left join personal_info pi on u.id = pi.user_id
  where u.tenant = ? and u.is_active=1;
  `,
    [tenantId]
  );
};

const getAllUsersInTenantFromTenantID = (tenantId: number) => {
  return Query(
    `
select u.*, pi.first_name, pi.last_name from users u 
left join personal_info pi on u.id = pi.user_id
where u.tenant = ? and u.is_active = 1;
  `,
    [tenantId]
  );
};

const getAllCoachsAndAdminsInTenantWithNames = (tenantId: number) => {
  return Query(
    `
  select u.id,
       u.email,
       u.real_email,
       u.role,
       u.tenant as tenant_id,
       pi.first_name,
       pi.last_name
  from users u
         join personal_info pi on u.id = pi.user_id
  where (u.role = "admin" or u.role = "coach")
  and u.tenant = ?;
  `,
    [tenantId]
  );
};

const getAllUsersInArrayOfIds = async (values: number[]) => {
  return Query(
    `
  select *
from users
where id in (?);
  `,
    [values]
  );
};

const getAllActiveCoachesAndAdminsUserInfoByTenantId = (tenantId: number) => {
  return Query(
    `
  select u.*,
  pi.first_name,
  pi.last_name
  from users u 
  left join personal_info pi on u.id =pi.user_id
  where u.is_active = 1
  and (u.role = "admin" or u.role = "coach")
  and u.tenant = ?;
  `,
    [tenantId]
  );
};

export default {
  all,
  find,
  singleUser,
  createUser,
  updateUser,
  deleteUser,
  deleteCorrespondingGrades,
  deleteCorrespondingPersonal_info,
  resetPassword,
  resetPhoneNumber,
  resetWarZoneId,
  updateEmail,
  updateOnDoNotTextList,
  updateRealEmail,
  getAllUserIDsForPasswordReset,
  updateRoleOnly,
  activateUser,
  deactivateUser,
  getAllUsersInTenantWithNames,
  getAllUsersInTenantFromTenantID,
  getAllUsersInArrayOfIds,
  getAllCoachsAndAdminsInTenantWithNames,
  getAllUsersWithPersonalInfoInTenantForAdmin,
  getSingleUserWithPersonalInfoForUserWithUserId,
  getAllActiveCoachesAndAdminsUserInfoByTenantId,
};
