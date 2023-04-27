import * as React from "react";
import { useState, useEffect } from "react";
import EditItemTypes from "./EditItemTypes";
import { IItemTypes } from "./interfacesForPayments";

const AddItemTypes = () => {
  const [newItemTypeName, setNewItemTypeName] = useState<string>();
  const [newItemTypeDescription, setNewItemTypeDescription] =
    useState<string>();
  const [willExpire, setWillExpire] = useState<boolean>(false);
  const [trackAmountUsed, setTrackAmountUsed] = useState<boolean>(false);
  const [allowRecurringPaymentContract, setAllowRecurringPaymentContract] =
    useState<boolean>(false);
  const [isAPrivateLesson, setIsAPrivateLesson] = useState<boolean>(false);
  const [isAPractice, setIsAPractice] = useState<boolean>(false);
  const [isUnlimited, setIsUnlimited] = useState<boolean>(false);
  const [allItemTypes, setAllItemTypes] = useState<IItemTypes[]>();

  useEffect(() => {
    let isMounted = true;
    isMounted && getAllItemTypes();
    return () => {
      isMounted = false;
    };
  }, []);

  let getAllItemTypes = () => {
    fetch("/api/itemTypes/getAllItemTypes")
      .then((res) => res.json())
      .then((res) => setAllItemTypes(res))
      .catch((err) => console.log(err));
  };

  let submitNewItemType = () => {
    if (newItemTypeName && newItemTypeName.length > 0) {
      let token = localStorage.getItem("token");
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newItemTypeName,
          newItemTypeDescription:
            newItemTypeDescription === "" ||
            newItemTypeDescription === undefined
              ? null
              : newItemTypeDescription,
          willExpire,
          trackAmountUsed,
          allowRecurringPaymentContract,
          isAPrivateLesson,
          isAPractice,
          isUnlimited,
        }),
      };
      fetch("/api/itemTypes/addNewItemType", requestOptions)
        .then((res) => res.json())
        .then((res) => {
          alert(res.message);
          getAllItemTypes();
        });
    } else {
      alert("Input field cannot be blank!");
      return;
    }
  };

  return (
    <div className="d-flex justify-content-center flex-wrap mb-5">
      <div
        className="mt-3 mb-3 ml-1 mr-1 pt-3 pb-3 d-flex flex-wrap justify-content-center align-items-center text-center col-sm-6 col-12"
        style={{ border: "solid black 1px", borderRadius: ".3rem" }}
      >
        <div className="col-12 p-0 justify-content-center">
          <h2>Add item type</h2>
        </div>

        <div className="mt-2 col-12 p-0 d-flex justify-content-center flex-wrap">
          <span className="col-12 text-center">
            Will expire(This would be for a single purchase that would last for
            several days; a month of wrestling practices or a week of wrestling
            camp):
          </span>
          <select
            onChange={(e: any) =>
              setWillExpire(e.target.value === "no" ? false : true)
            }
          >
            <option value="no">no</option>
            <option value="yes">yes</option>
          </select>
        </div>
        <div className="mt-2 col-12 p-0 d-flex justify-content-center flex-wrap">
          <span className="col-12 text-center">
            Keep track of amount used
            <br />
            (lessons, lesson packages, etc. check in required things people will
            run out of.)
          </span>
          <select
            onChange={(e: any) =>
              setTrackAmountUsed(e.target.value === "no" ? false : true)
            }
          >
            <option value="no">no</option>
            <option value="yes">yes</option>
          </select>
        </div>
        <div className="mt-2 col-12 p-0 d-flex justify-content-center flex-wrap">
          <span className="col-12 text-center">
            Allow recurring payment contract
          </span>
          <br />
          <select
            onChange={(e: any) =>
              setAllowRecurringPaymentContract(
                e.target.value === "no" ? false : true
              )
            }
          >
            <option value="no">no</option>
            <option value="yes">yes</option>
          </select>
        </div>

        <div className="mt-2 col-12 p-0 d-flex justify-content-center flex-wrap">
          <span className="col-12 text-center">Is a private lesson</span>
          <br />
          <select
            onChange={(e: any) =>
              setIsAPrivateLesson(e.target.value === "no" ? false : true)
            }
          >
            <option value="no">no</option>
            <option value="yes">yes</option>
          </select>
        </div>
        <div className="mt-2 col-12 p-0 d-flex justify-content-center flex-wrap">
          <span className="col-12 text-center">
            Is a practice (requires check-in)
          </span>
          <br />
          <select
            onChange={(e: any) =>
              setIsAPractice(e.target.value === "no" ? false : true)
            }
          >
            <option value="no">no</option>
            <option value="yes">yes</option>
          </select>
        </div>
        <div className="mt-2 col-12 p-0 d-flex justify-content-center flex-wrap">
          <span className="col-12 text-center">Is a unlimited</span>
          <br />
          <select
            onChange={(e: any) =>
              setIsUnlimited(e.target.value === "no" ? false : true)
            }
          >
            <option value="no">no</option>
            <option value="yes">yes</option>
          </select>
        </div>

        <div className="mt-2 col-12 p-0 d-flex justify-content-center">
          <input
            maxLength={30}
            onChange={(e: any) => setNewItemTypeName(e.target.value.trim())}
            type="text"
            placeholder="item type"
          />
        </div>
        <div className="mt-2 col-12 p-0 d-flex justify-content-center">
          <textarea
            style={{ resize: "none" }}
            maxLength={60}
            onChange={(e: any) =>
              setNewItemTypeDescription(e.target.value.trim())
            }
            rows={2}
            placeholder="item type description for Gyn Owner (optional)"
          />
        </div>
        {newItemTypeName &&
          newItemTypeName.length > 0 &&
          (willExpire === false || willExpire === true) && (
            <div className=" mt-3 col-12 p-0 d-flex justify-content-center">
              <button onClick={submitNewItemType} className="btn btn-success">
                submit
              </button>
            </div>
          )}
      </div>
      {/* ****************************************************************************************************************** */}
      {allItemTypes && (
        <div className="col-12">
          {allItemTypes.length > 0 ? (
            <div className="d-flex flex-wrap justify-content-center">
              <table className="table table-striped">
                <thead
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    backgroundColor: "white",
                  }}
                >
                  <tr>
                    <th>Item type</th>
                    <th>description for gym owner (optional)</th>
                    <th>Will expire</th>
                    <th>Keep track of amount used</th>
                    <th>Allow recurring payment contract</th>
                    <th>Is a private lesson</th>
                    <th>Is a practice</th>
                    <th>Is unlimited</th>
                    <th>Update</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {allItemTypes.map((item) => {
                    return (
                      <EditItemTypes
                        key={item.id}
                        getAllItemTypes={getAllItemTypes}
                        itemType={item}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <span>Theres nada brada</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddItemTypes;
