import * as React from "react";
import { useState, useEffect } from "react";
import { IItemTypes } from "./interfacesForPayments";

const EditItemTypes = (props: IProps) => {
  let {
    id,
    item_type,
    item_type_description,
    will_expire,
    keep_track_of_amount_used,
    allow_recurring_payment_contract,
    is_a_private_lesson,
    is_a_practice,
    is_unlimited,
    date_created,
  } = props.itemType;
  const [editItemTypeNewName, setEditItemTypeNewName] =
    useState<string>(item_type);
  const [editItemTypeDescription, setEditItemTypeDescription] =
    useState<string>(item_type_description);
  const [editWillExpire, setEditWillExpire] = useState(
    will_expire === 0 ? false : true
  );
  const [editTrackAmountUsed, setEditTrackAmountUsed] = useState<boolean>(
    keep_track_of_amount_used === 0 ? false : true
  );
  const [editIsAPrivateLesson, setEditIsAPrivateLesson] = useState<boolean>(
    props.itemType.is_a_private_lesson === 1 ? true : false
  );
  const [editIsAPractice, setEditIsAPractice] = useState<boolean>(
    props.itemType.is_a_practice === 1 ? true : false
  );
  const [editIsUnlimited, setEditIsUnlimited] = useState<boolean>(
    props.itemType.is_unlimited === 1 ? true : false
  );
  const [
    editAllowRecurringPaymentContract,
    setEditAllowRecurringPaymentContract,
  ] = useState<boolean>(allow_recurring_payment_contract === 0 ? false : true);
  let updateItemType = () => {
    if (confirm(`Are you sure you want to update item type?`)) {
      let token = localStorage.getItem("token");
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemTypeId: id,
          editItemTypeNewName,
          editItemTypeDescription:
            editItemTypeDescription === "" ? null : editItemTypeDescription,
          editWillExpire,
          editTrackAmountUsed,
          editAllowRecurringPaymentContract,
          editIsAPrivateLesson,
          editIsAPractice,
          editIsUnlimited,
        }),
      };
      fetch("/api/itemTypes/updateItemType", requestOptions)
        .then((res) => res.json())
        .then((res) => {
          alert(res.message);
          props.getAllItemTypes();
        });
    } else {
      return;
    }
  };

  let deleteItemType = () => {
    if (confirm(`Are you sure you want to delete ${item_type}?`)) {
      let token = localStorage.getItem("token");
      const requestOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemTypeId: id,
        }),
      };
      fetch("/api/itemTypes/deleteItemType", requestOptions)
        .then((res) => res.json())
        .then((res) => {
          alert(res.message);
          props.getAllItemTypes();
        });
    } else {
      return;
    }
  };

  return (
    <>
      <tr style={{ fontSize: ".8rem" }}>
        <td>
          {" "}
          <input
            maxLength={30}
            onChange={(e: any) => setEditItemTypeNewName(e.target.value.trim())}
            className="mt-2"
            type="text"
            defaultValue={item_type}
          />
        </td>
        <td>
          <textarea
            style={{ resize: "none" }}
            maxLength={60}
            onChange={(e: any) =>
              setEditItemTypeDescription(e.target.value.trim())
            }
            rows={2}
            placeholder="item type description for Gyn Owner (optional)"
            defaultValue={item_type_description}
          />
        </td>
        <td>
          <select
            defaultValue={will_expire === 0 ? "no" : "yes"}
            onChange={(e: any) =>
              setEditWillExpire(e.target.value === "no" ? false : true)
            }
          >
            <option value="no">no</option>
            <option value="yes">yes</option>
          </select>
        </td>
        <td>
          <select
            defaultValue={keep_track_of_amount_used === 0 ? "no" : "yes"}
            onChange={(e: any) =>
              setEditTrackAmountUsed(e.target.value === "no" ? false : true)
            }
          >
            <option value="no">no</option>
            <option value="yes">yes</option>
          </select>
        </td>
        <td>
          <select
            defaultValue={allow_recurring_payment_contract === 0 ? "no" : "yes"}
            onChange={(e: any) =>
              setEditAllowRecurringPaymentContract(
                e.target.value === "no" ? false : true
              )
            }
          >
            <option value="no">no</option>
            <option value="yes">yes</option>
          </select>
        </td>
        <td>
          <select
            defaultValue={is_a_private_lesson === 1 ? "yes" : "no"}
            onChange={(e: any) =>
              setEditIsAPrivateLesson(e.target.value === "no" ? false : true)
            }
          >
            <option value="no">no</option>
            <option value="yes">yes</option>
          </select>
        </td>
        <td>
          <select
            defaultValue={is_a_practice === 1 ? "yes" : "no"}
            onChange={(e: any) =>
              setEditIsAPractice(e.target.value === "no" ? false : true)
            }
          >
            <option value="no">no</option>
            <option value="yes">yes</option>
          </select>
        </td>
        <td>
          <select
            defaultValue={is_unlimited === 1 ? "yes" : "no"}
            onChange={(e: any) =>
              setEditIsUnlimited(e.target.value === "no" ? false : true)
            }
          >
            <option value="no">no</option>
            <option value="yes">yes</option>
          </select>
        </td>
        <td>
          <button
            onClick={() => updateItemType()}
            className="m-2 btn btn-success btn-sm"
          >
            Update
          </button>
        </td>
        <td>
          <button
            onClick={() => deleteItemType()}
            className="m-2 btn btn-danger btn-sm"
          >
            Delete
          </button>
        </td>
      </tr>
    </>
  );
};

export default EditItemTypes;

interface IProps {
  itemType: IItemTypes;
  getAllItemTypes: Function;
}
