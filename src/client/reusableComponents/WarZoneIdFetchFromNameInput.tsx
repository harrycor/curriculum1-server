import React from "react";
import AsyncSelect from "react-select/async";

type setStateFunctionType = (wrestler: { id: number; name: string }) => void;

interface propTypes {
  setStateFunction: setStateFunctionType;
}

function WarZoneIdFetchFromNameInput({ setStateFunction }: propTypes) {
  const loadWarZoneIds = async (
    searchParam: string,
    callback: any
  ): Promise<any> => {
    try {
      await fetch(`/api/warZone/getAllWrestlers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          searchParam,
        }),
      })
        .then((data) => data.json())
        .then((data) => {
          console.log({ data });
          if (data.message) {
            return;
          } else {
            callback(data);
          }
        });
    } catch (err: unknown) {
      alert(err);
    }
  };

  return (
    <AsyncSelect
      getOptionLabel={(option: { id: number; name: string }) => option.name}
      getOptionValue={(option: { id: number; name: string }) => option.name}
      cacheOptions
      defaultOptions
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
      loadOptions={loadWarZoneIds}
      placeholder="Type full name"
      // This is totally acceptable as the package maintainers don't care about typescript and make it very poor to use
      // @ts-ignore
      onChange={setStateFunction}
    ></AsyncSelect>
  );
}

export default WarZoneIdFetchFromNameInput;
("react");
