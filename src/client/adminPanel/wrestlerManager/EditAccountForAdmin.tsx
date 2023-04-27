// import * as React from "react";
// import { useState, useEffect } from "react";
// import { IUser } from "../../../types";
// import WarZoneIdFetchFromNameInput from "../../reusableComponents/WarZoneIdFetchFromNameInput";

// const EditAccountForAdmin = (props: IProps) => {
//   let {
//     id,
//     email,
//     real_email,
//     phone_number,
//     war_zone_id,
//     on_do_not_text_list,
//     role,
//     is_active,
//   } = props.wrestler;

//   const [newPassword, setNewPassword] = React.useState<string>();
//   const [showPasswordInputForUserId, setShowPasswordInputForUserId] =
//     React.useState<string>();
//   const [newEmail, setNewEmail] = React.useState<string>();
//   const [newPhoneNumber, setNewPhoneNumber] = React.useState<string>();
//   const [
//     showPhoneNumberResetForInputClicked,
//     setShowPhoneNumberResetForInputClicked,
//   ] = React.useState<boolean>(false);
//   const [newWarZoneId, setNewWarZoneId] = React.useState<number>();
//   const [
//     showWarZoneIdResetForInputClicked,
//     setShowWarZoneIdResetForInputClicked,
//   ] = React.useState<boolean>(false);
//   const [showEmailResetForUserId, setShowEmailResetForUserId] =
//     React.useState<string>();
//   const [
//     enableDisablButtonWhileResettingPasswordOrEmail,
//     setEnableDisablButtonWhileResettingPasswordOrEmail,
//   ] = React.useState<boolean>(false);
//   const showPasswordInputClicked = (userId: number) => {
//     setShowPasswordInputForUserId(`show password reset for ${userId}`);
//     setNewPassword("");
//   };
//   const showEmailResetInputClicked = (userId: number) => {
//     setShowEmailResetForUserId(`show email reset for ${userId}`);
//     setNewEmail("");
//   };
//   const showPhoneNumberResetInputClicked = () => {
//     setShowPhoneNumberResetForInputClicked(
//       !showPhoneNumberResetForInputClicked
//     );
//     setNewPhoneNumber("");
//   };
//   const newPasswordInputChange = (e: any) => {
//     setNewPassword(e.target.value.trim());
//   };
//   const newEmailInputChange = (e: any) => {
//     setNewEmail(e.target.value.trim());
//   };
//   const newPhoneNumberInputChange = (e: any) => {
//     setNewPhoneNumber(e.target.value.trim());
//   };
//   const newWarZoneIdInputChange = (wrestler: { id: number; name: string }) => {
//     console.log({ newWarzoneInput: wrestler.id });
//     setNewWarZoneId(wrestler.id);
//   };

//   function validatePhoneNumber(input_str: string) {
//     var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
//     return re.test(input_str);
//   }

//   const resetEmailSubmitClicked = (userId: number, userName: string) => {

//   };

//   const changePhoneNumberFunction = (
//     userId: number,
//     newPhoneNumber: string
//   ) => {
//     let token = localStorage.getItem("token");

//     const requestOptions = {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         userId,
//         newPhoneNumber,
//       }),
//     };

//     fetch(`/api/users/resetPhoneNumberFromAdmin`, requestOptions).then(
//       (res) => {
//         if (res.ok) {
//           alert(`Phone number reset`);
//           // we should not be doing it this way, but I decided to keep it consistent
//           // window.location.reload();
//           // props.renderBoolFunc();
//         } else {
//           alert("something went wrong");
//           // we should not be doing it this way, but I decided to keep it consistent
//           // window.location.reload();
//         }
//       }
//     );
//   };

//   const changeWarZoneIdFunction = (userId: number, newWarZoneId: number) => {
//     let token = localStorage.getItem("token");

//     const requestOptions = {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         userId,
//         newWarZoneId,
//       }),
//     };
//     fetch(`/api/users/resetWarZoneIdFromAdmin`, requestOptions).then((res) => {
//       if (res.ok) {
//         alert(`WAR number reset`);
//         // we should not be doing it this way, but I decided to keep it consistent
//         // window.location.reload();
//         // props.renderBoolFunc();
//       } else {
//         alert("something went wrong");
//         // we should not be doing it this way, but I decided to keep it consistent
//         // window.location.reload();
//         // props.renderBoolFunc();
//       }
//     });
//   };

//   const resetPasswordSubmitClicked = (userId: number, userName: string) => {
//     if (!newPassword || newPassword.length === 0) {
//       alert("You must input a new password");
//       return;
//     } else {
//       if (
//         confirm(`Are you sure you want to reset the password for, ${userName}`)
//       ) {
//         setEnableDisablButtonWhileResettingPasswordOrEmail(true);
//         let token = localStorage.getItem("token");
//         const requestOptions = {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             userId,
//             newPassword,
//           }),
//         };
//         fetch(`/api/users/resetPasswordFromAdmin`, requestOptions).then(
//           (res) => {
//             if (res.ok) {
//               alert(`Password has been reset`);
//               setEnableDisablButtonWhileResettingPasswordOrEmail(false);
//               window.location.reload();
//             } else {
//               alert("something went wrong");
//               setEnableDisablButtonWhileResettingPasswordOrEmail(false);
//             }
//           }
//         );
//       }
//     }
//   };

//   const changeRole = (role: string, id: number) => {
//     const requestOptions = {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer token`,
//       },
//       body: JSON.stringify({
//         role: role,
//         id: id,
//       }),
//     };

//     fetch(`/api/users/updateRole`, requestOptions).then((res) => {
//       if (res.ok) {
//         alert("The role was changed to " + role + "!");
//       } else {
//         alert(
//           "it didn't work! Coach Wayne Apologizes try again later and let him know what happened."
//         );
//       }
//     });
//   };

//   const activateUser = (userId: number, userName: string) => {
//     if (
//       confirm(
//         `Are your sure you want to ACTIVATE user?\nID: ${userId}\nusername: ${userName}`
//       )
//     ) {
//       let token = localStorage.getItem("token");
//       const requestOptions = {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       fetch(`/api/users/activateUser/${userId}`, requestOptions).then((res) => {
//         if (res.ok) {
//           alert("User Activated");
//           window.location.reload();
//         } else {
//           alert("It didn't work!");
//         }
//       });
//     }
//   };
//   const deactivateUser = (userId: number, userName: string) => {
//     if (
//       confirm(
//         `Are your sure you want to DEACTIVATE user?\nID: ${userId}\nusername: ${userName}`
//       )
//     ) {
//       let token = localStorage.getItem("token");
//       const requestOptions = {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       fetch(`/api/users/deactivateUser/${userId}`, requestOptions).then(
//         (res) => {
//           if (res.ok) {
//             alert("User Deactivated");
//             window.location.reload();
//           } else {
//             alert("It didn't work!");
//           }
//         }
//       );
//     }
//   };

//   return (
//     <div>
//       <td>{id}</td>
//       <td>{email}</td>

//       <td>
//         <>
//           {real_email} <br />
//           {showEmailResetForUserId === `show email reset for ${id}` ? (
//             <>
//               <input
//                 onChange={newEmailInputChange}
//                 type="email"
//                 autoFocus
//                 placeholder="new email"
//                 style={{ width: "10rem" }}
//               />{" "}
//               <br />
//               {newEmail !== undefined && newEmail.length > 0 && (
//                 <button
//                   onClick={() => resetEmailSubmitClicked(id, email)}
//                   className="btn btn-sm btn-success"
//                 >
//                   reset email
//                 </button>
//               )}
//             </>
//           ) : (
//             <small
//               onClick={() => showEmailResetInputClicked(id)}
//               style={{ color: "blue", cursor: "pointer" }}
//             >
//               <u>update email</u>
//             </small>
//           )}
//         </>
//       </td>

//       <td>
//         {phone_number ? phone_number : "no number"}
//         {showPhoneNumberResetForInputClicked ? (
//           <>
//             <input
//               onChange={newPhoneNumberInputChange}
//               type="text"
//               autoFocus
//               placeholder="new phone number"
//               style={{ width: "10rem" }}
//             />{" "}
//             <br />
//             {newPhoneNumber !== undefined && newPhoneNumber && (
//               <button
//                 onClick={() => changePhoneNumberFunction(id, newPhoneNumber)}
//                 className="btn btn-sm btn-success"
//               >
//                 change number
//               </button>
//             )}
//           </>
//         ) : (
//           <small
//             onClick={showPhoneNumberResetInputClicked}
//             style={{ color: "blue", cursor: "pointer" }}
//           >
//             <br />
//             <u>change</u>
//           </small>
//         )}
//       </td>

//       <td>
//         {war_zone_id ? war_zone_id : "no war_zone_id"}
//         {showWarZoneIdResetForInputClicked ? (
//           <>
//             <WarZoneIdFetchFromNameInput
//               setStateFunction={newWarZoneIdInputChange}
//             />

//             <br />
//             {newWarZoneId !== undefined && newWarZoneId && (
//               <button
//                 onClick={() => changeWarZoneIdFunction(id, newWarZoneId)}
//                 className="btn btn-sm btn-success"
//               >
//                 change WAR Zone Id
//               </button>
//             )}
//           </>
//         ) : (
//           <small
//             onClick={() =>
//               setShowWarZoneIdResetForInputClicked(
//                 !showWarZoneIdResetForInputClicked
//               )
//             }
//             style={{ color: "blue", cursor: "pointer" }}
//           >
//             <br />
//             <u>change war_zone_id</u>
//           </small>
//         )}
//       </td>

//       <td>
//         <label>Role:</label>
//         <select
//           name="languages"
//           id="role"
//           onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
//             changeRole(e.target.value, id);
//           }}
//         >
//           <option value={role}>{role}</option>
//           <option value="wrestler">wrestler</option>
//           <option value="coach">coach</option>
//           <option value="admin">admin</option>
//         </select>
//       </td>
//       <td style={{ maxWidth: "8rem" }}>
//         {showPasswordInputForUserId === `show password reset for ${id}` ? (
//           <>
//             <input
//               onChange={newPasswordInputChange}
//               style={{ width: "8rem" }}
//               type="password"
//               placeholder="new password"
//               autoFocus
//             />
//             {newPassword !== undefined && newPassword.length > 0 && (
//               <button
//                 onClick={() => resetPasswordSubmitClicked(id, email)}
//                 disabled={enableDisablButtonWhileResettingPasswordOrEmail}
//                 className="btn btn-sm btn-success"
//               >
//                 Reset password
//               </button>
//             )}
//           </>
//         ) : (
//           <span
//             onClick={() => showPasswordInputClicked(id)}
//             style={{ color: "blue", cursor: "pointer" }}
//           >
//             <u>Reset password</u>
//           </span>
//         )}
//       </td>
//       <td>
//         {is_active === 1 ? (
//           <button
//             onClick={() => deactivateUser(id, email)}
//             className="btn btn-sm btn-danger"
//           >
//             Deactivate Account
//           </button>
//         ) : (
//           <button
//             onClick={() => activateUser(id, email)}
//             className="btn btn-sm btn-success"
//           >
//             Activated account
//           </button>
//         )}

//         {/* <button
//                     className="btn btn-danger"
//                     onClick={() => onDeleteItem(id)}
//                   >
//                     Delete!
//                   </button> */}
//       </td>
//     </div>
//   );
// };

// export default EditAccountForAdmin;

// interface IProps {
//   wrestler: IUser;
// }
