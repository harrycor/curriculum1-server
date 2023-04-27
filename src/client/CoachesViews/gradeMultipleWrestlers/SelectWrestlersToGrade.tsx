import React, { useEffect, useState } from "react";
import { IWrestler } from "../../../types";
import SelectDropDownForAllWrestlersOnTennant from "../../reusableComponents/selectDropDownForAllWrestlersOnTennant";

export default function SelectWrestlersToGrade(props: IProps) {
  const [allWrestlers, setAllWrestlers] = useState<IWrestler[]>([]);
  const [showWrestlerList, setShowWrestlerList] = useState<boolean>(false);
  const [searchForWrestlerInput, setSearchForWrestlerInput] =
    useState<string>("");
  const [wrestlerId, setWrestlerId] = useState<number>();
  const [selectedWrestlerName, setSelectedWrestlerName] = useState<string>();

  let token = localStorage.getItem("token");
  let UID = localStorage.getItem("UID");

  useEffect(() => {
    fetch("/api/wrestlers/getAllWrestlersInTenant", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        UID,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        console.log(result);
        setAllWrestlers(result);
      });
  }, []);

  let handleWrestlerClicked = (wrestler: WrestlerInterface) => {
    let wrestlerId = wrestler.id;
    let wrestlerFirstName = wrestler.first_name;
    let wrestlerLastName = wrestler.last_name;

    let fullname = wrestlerFirstName + " " + wrestlerLastName;
    setSearchForWrestlerInput(fullname);
    setWrestlerId(wrestlerId);
    setSelectedWrestlerName(fullname);
    setShowWrestlerList(false);
    setSearchForWrestlerInput("");

    for (let x = 0; x < allWrestlers.length; x++) {
      const wrestler = allWrestlers[x];

      if (wrestler.id == wrestlerId) props.addWrestlersToTheArray(wrestler);
    }
  };
  // let onKeyDownFunction = (e) => {
  //   if (e.keyCode === 13) {
  //     console.log("13");
  //   } else if (e.keyCode === 38) {
  //     console.log("38");
  //   } else if (e.keyCode === 40) {
  //     console.log(40);
  //   }
  // };

  return (
    <>
      <label>Add wrestler: </label>

      <SelectDropDownForAllWrestlersOnTennant
        callBackFunction={handleWrestlerClicked}
      />

      {allWrestlers &&
        showWrestlerList === true &&
        allWrestlers.length > 0 &&
        searchForWrestlerInput.length > 0 && (
          <div className="d-flex justify-content-center">
            <div
              tabIndex={-1}
              className="col-md-6 col-10"
              style={{
                position: "absolute",
                backgroundColor: "#F0F0F0",
                zIndex: 50,
                opacity: "95%",
                maxHeight: "14rem",
                overflow: "scroll",
                borderRadius: ".3rem",
                border: "solid black 1px",
              }}
            ></div>
          </div>
        )}
      {/* <div>
        {wrestlerId && selectedWrestlerName && <h1>Getting something</h1>}
      </div> */}
    </>
  );
}

interface WrestlerInterface {
  id: number;
  email: string;
  password: string;
  role: string;
  real_email: string;
  phone_number: string;
  war_zone_id?: any;
  tenant: number;
  created_at: Date;
  is_active: number;
  first_name: string;
  last_name: string;
  notes: string;
  user_id: number;
  current_item_id: number;
}

interface IProps {
  addWrestlersToTheArray: Function;
}
