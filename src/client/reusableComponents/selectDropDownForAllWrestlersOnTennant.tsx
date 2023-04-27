import React, { useEffect, useState } from "react";
import Select from "react-select";
import { WrestlerInterface } from "../CoachesViews/newMasterView/MasterView";

function SelectDropDownForAllWrestlersOnTennant({
  className,
  callBackFunction,
}: {
  className?: string;
  callBackFunction: Function;
}) {
  const UID = localStorage.getItem("UID");

  const token = localStorage.getItem("token");

  const [wrestlers, setWrestlers] = useState<WrestlerInterface[]>([]);

  useEffect(() => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        UID,
      }),
    };
    fetch("/api/wrestlers/getAllWrestlersInTenant", requestOptions)
      .then((res: any) => res.json())
      .then((data: any) => {
        setWrestlers(data);
      })
      .catch((err: any) => console.log(err));
  }, []);

  const handleSelectChange = (wrestler: WrestlerInterface) => {
    callBackFunction(wrestler);
  };

  return (
    <Select
      className={className}
      options={wrestlers}
      getOptionLabel={(option: WrestlerInterface) =>
        `${option.first_name} ${option.last_name}`
      }
      getOptionValue={(option: WrestlerInterface) => String(option.id)}
      placeholder="Type a wrestlers name"
      styles={{
        menuPortal: (provided) => ({
          ...provided,
          zIndex: 9999999,
        }),
        menu: (provided) => ({
          ...provided,
          zIndex: 9999999,
        }),
      }}
      // This is a fine ignore
      // @ts-ignore
      onChange={handleSelectChange}
    />
  );
}

export default SelectDropDownForAllWrestlersOnTennant;
