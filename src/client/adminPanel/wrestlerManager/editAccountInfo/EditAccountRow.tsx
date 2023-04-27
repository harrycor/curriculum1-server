import * as React from "react";
import { useState, useEffect } from "react";
import { IAccount } from "../../../../types";
import EditActiveStatus from "./EditActiveStatus";
import EditEmail from "./EditEmail";
import EditFirstName from "./EditFirstName";
import EditLastName from "./EditLastName";
import EditOnDoNotTextList from "./EditOnDoNotTextList";
import EditPassword from "./EditPassword";
import EditPhoneNumber from "./EditPhoneNumber";
import EditRealEmail from "./EditRealEmail";
import EditRole from "./EditRole";
import EditWZId from "./EditWZId";

const EditAccountRow = (props: IProps) => {
  let {
    id,
    first_name,
    last_name,
    email,
    real_email,
    phone_number,
    on_do_not_text_list,
    war_zone_id,
    role,
    is_active,
  } = props.account;

  return (
    <>
      <td>{id}</td>
      <td>
        <EditFirstName
          userId={id}
          firstName={first_name}
          renderFunc={props.renderBoolFunc}
        />
      </td>
      <td>
        <EditLastName
          userId={id}
          lastName={last_name}
          renderFunc={props.renderBoolFunc}
        />
      </td>
      <td>
        <EditRealEmail
          userId={id}
          realEmail={real_email}
          renderFunc={props.renderBoolFunc}
        />
      </td>
      <td>
        <EditEmail
          userId={id}
          email={email}
          renderFunc={props.renderBoolFunc}
        />
      </td>
      <td>
        <EditPhoneNumber
          userId={id}
          phoneNumber={phone_number}
          renderFunc={props.renderBoolFunc}
        />
      </td>
      <td>
        <EditOnDoNotTextList
          userId={id}
          onDoNotTextList={on_do_not_text_list}
          renderFunc={props.renderBoolFunc}
        />
      </td>
      <td>
        <EditWZId
          userId={id}
          warId={war_zone_id}
          renderFunc={props.renderBoolFunc}
        />
      </td>
      <td style={{ minWidth: "7rem", maxWidth: "20rem" }}>
        <EditRole
          userId={id}
          role={String(role)}
          renderFunc={props.renderBoolFunc}
        />
      </td>
      <td>
        {/* we shoudl  not grabbing the PW for the front but guess what? we do! */}
        <EditPassword renderFunc={props.renderBoolFunc} userId={id} />
      </td>
      <td>
        <EditActiveStatus
          userId={id}
          isActive={is_active}
          renderFunc={props.renderBoolFunc}
        />
      </td>
    </>
  );
};

export default EditAccountRow;
interface IProps {
  renderBoolFunc: Function;
  account: IAccount;
}
