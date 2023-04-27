import * as React from "react";
import { useState, useEffect } from "react";
import { IItemTypes, IDateUnits } from "./interfacesForPayments";
import AllServicesAndMerchandise from "./AllServicesAndMerchandise";

const AddServicesAndMerchandise = () => {
  // item type details
  const [allDateUnits, setAllDateUnits] = useState<IDateUnits[]>();
  const [allItemTypes, setAllItemTypes] = useState<IItemTypes[]>();
  const [itemTypeId, setItemTypeId] = useState<number>();
  const [itemTypeDescription, setItemTypeDescription] = useState<string>();
  const [keepTrackOfAmountUsed, setKeepTrackOfAmountUsed] =
    useState<boolean>(false);
  const [willExpire, setWillExpire] = useState<boolean>(false);
  const [allowRecurringPaymentContract, setAllowRecurringPaymentContract] =
    useState<boolean>(false);
  //  set by user
  const [itemName, setItemName] = useState<string>();
  const [numberOfItemsIncluded, setNumberOfItemsIncluded] = useState<number>();
  const [itemCost, setItemCost] = useState<number>();
  const [dateUnitsIdForExpiration, setDateUnitsIdForExpiration] = useState<
    number | null
  >();
  const [dateUnitName, setDateUnitName] = useState<string | undefined>();
  const [numberOfDateUnitsForExpiration, setNumberOfDateUnitsForExpiration] =
    useState<number | null>();
  const [itemHasRecurringPaymentContract, setItemHasRecurringPaymentContract] =
    useState<boolean>();

  const [
    boolToRenderListOfAllItemsAfterNewIsAdded,
    setBoolToRenderListOfAllItemsAfterNewIsAdded,
  ] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/itemTypes/getAllItemTypesAndDateUnits")
      .then((res) => res.json())
      .then((res: { dateUnits: IDateUnits[]; allItemTypes: IItemTypes[] }) => {
        isMounted && setAllItemTypes(res.allItemTypes);
        isMounted && setAllDateUnits(res.dateUnits);
      })
      .catch((err) => console.log(err));
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      setDateUnitsIdForExpiration(null);
      setNumberOfDateUnitsForExpiration(null);
      setDateUnitName(undefined);
      setItemHasRecurringPaymentContract(undefined);
    }
    return () => {
      isMounted = false;
    };
  }, [itemTypeId]);

  let handleItemTypeChange = (e: any) => {
    console.log(e);
    let itemTypId: number | string = e.target.value;
    if (itemTypId === "") {
      setItemTypeId(undefined);
      setWillExpire(false);
      setAllowRecurringPaymentContract(false);
      setKeepTrackOfAmountUsed(false);
      setItemTypeDescription(undefined);
    } else {
      if (allItemTypes !== undefined) {
        // fuuucking stupid
        for (let x = 0; x < allItemTypes.length; x++) {
          if (allItemTypes[x].id === Number(itemTypId)) {
            let {
              id,
              item_type,
              will_expire,
              keep_track_of_amount_used,
              allow_recurring_payment_contract,
              item_type_description,
            } = allItemTypes[x];
            setItemTypeId(id);
            setWillExpire(will_expire === 1 ? true : false);
            setKeepTrackOfAmountUsed(
              keep_track_of_amount_used === 1 ? true : false
            );
            setAllowRecurringPaymentContract(
              allow_recurring_payment_contract === 1 ? true : false
            );
            setItemTypeDescription(item_type_description);
            break;
          }
        }
      }
    }
  };

  let handleItemNameChange = (e: any) => setItemName(e.target.value.trim());
  let handleNumberOfItemsIncludedChange = (e: any) => {
    setNumberOfItemsIncluded(e.target.value.trim());
  };
  let handleItemCostChange = (e: any) => setItemCost(e.target.value.trim());
  let handleDateUnitChange = (e: any) => {
    let dateUnitId = e.target.value;
    setDateUnitsIdForExpiration(dateUnitId);
    if (allDateUnits !== undefined) {
      for (let x = 0; x < allDateUnits.length; x++) {
        if (allDateUnits[x].id === Number(dateUnitId)) {
          setDateUnitName(allDateUnits[x].unit);
        }
      }
    }
  };
  let handleNumberOfDateUnitsChange = (e: any) => {
    setNumberOfDateUnitsForExpiration(e.target.value);
  };
  let handleRecurringPaymentContractChange = (contractStatus: boolean) => {
    if (!willExpire) {
      setDateUnitsIdForExpiration(null);
      setNumberOfDateUnitsForExpiration(null);
    }
    setItemHasRecurringPaymentContract(contractStatus);
  };

  let submitNewItem = () => {
    // if (
    //   !itemName ||
    //   !itemTypeId ||
    //   !numberOfItemsIncluded ||
    //   numberOfItemsIncluded < 1 ||
    //   !itemCost ||
    //   itemCost < 1
    // ) {
    //   alert("Fill out entire form");
    //   return;}
    if (confirm("Are you sure you want to submit new item?")) {
      let token = localStorage.getItem("token");
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemName,
          itemCost,
          itemTypeId,
          numberOfItemsIncluded,
          dateUnitsIdForExpiration:
            Number(dateUnitsIdForExpiration) > 0
              ? dateUnitsIdForExpiration
              : null,
          numberOfDateUnitsForExpiration:
            Number(numberOfDateUnitsForExpiration) > 0
              ? numberOfDateUnitsForExpiration
              : null,
          itemHasRecurringPaymentContract:
            itemHasRecurringPaymentContract === true ? true : false,
          // activeDurationInDays:
          //   activeDurationInDays === "" ? null : activeDurationInDays,
          // recurringPaymentInterval,
        }),
      };
      fetch(
        "/api/servicesAndMerchandise/addNewServiceOrMerchandise",
        requestOptions
      )
        .then((res) => res.json())
        .then((res) => {
          alert(res.message);
          setBoolToRenderListOfAllItemsAfterNewIsAdded(
            !boolToRenderListOfAllItemsAfterNewIsAdded
          );
        });
    }
  };

  if (allItemTypes === undefined || allDateUnits === undefined)
    return <div>Loading...</div>;

  return (
    <div className="d-flex justify-content-center flex-wrap m-2 ">
      <div
        className=" pl-0 pr-0 d-flex justify-content-center flex-wrap"
        style={{ border: "solid black 1px", paddingBottom: "2rem" }}
      >
        <div className="col-12 p-0 d-flex justify-content-center flex-wrap text-center mt-3 mb-3 mr-1 ml-1">
          <span style={{ fontSize: "1.5rem" }}>
            <u>Add services or merchandise</u>
          </span>
        </div>
        <div className="d-flex col-12 justify-content-center">
          <div className=" d-flex justify-content-center flex-wrap mt-3 mr-1 ml-1">
            <div className=" mb-3" style={{ width: "15rem" }}>
              <span>Type:</span>
              <div className="col-12 p-0">
                <select
                  style={{ maxWidth: "15rem" }}
                  onChange={handleItemTypeChange}
                >
                  <option value=""></option>
                  {allItemTypes.map((type) => {
                    return (
                      <option key={type.id} value={type.id}>
                        {type.item_type}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="col-12 text-start">
                {itemTypeDescription && itemTypeDescription !== null && (
                  <span style={{ fontSize: ".7rem", color: "gray" }}>
                    {itemTypeDescription}
                  </span>
                )}
              </div>
            </div>

            <div className="col-12 d-flex justify-content-center p-0 mb-3 mr-1 ml-1">
              <div style={{ width: "15rem" }}>
                <span>Item/Service name:</span>
                <div className="col-12 p-0">
                  <textarea
                    maxLength={50}
                    onChange={handleItemNameChange}
                    style={{ width: "15rem" }}
                    placeholder="Item/Service name"
                  />
                </div>
              </div>
            </div>
            <div className="col-12 p-0 d-flex justify-content-center  mb-3 mr-1 ml-1">
              <div style={{ width: "15rem" }}>
                {" "}
                <span>Number of items included:</span>
                <div className="col-12 p-0">
                  <input
                    // defaultValue={
                    //   Number(numberOfItemsIncluded) > 0
                    //     ? numberOfItemsIncluded
                    //     : undefined
                    // }
                    onChange={handleNumberOfItemsIncludedChange}
                    min="1"
                    type="number"
                    style={{ width: "5rem" }}
                    placeholder="Number"
                  />
                </div>
              </div>
            </div>
            {numberOfItemsIncluded && numberOfItemsIncluded > 0 && itemName && (
              <div className="col-12 p-0 d-flex justify-content-center flex-wrap mb-3 mr-1 ml-1">
                <div style={{ width: "15rem" }}>
                  <span>
                    Total cost for {numberOfItemsIncluded} {itemName}
                    {numberOfItemsIncluded > 1 && "'s"}:
                  </span>
                  <div className="col-12 p-0">
                    <input
                      onChange={handleItemCostChange}
                      value={Number(itemCost) > 0 ? Number(itemCost) : ""}
                      min="1"
                      type="number"
                      placeholder="$"
                      style={{ width: "5rem" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <>
              <div className="col-12 p-0 d-flex justify-content-center flex-wrap mb-3 mr-1 ml-1">
                {willExpire && (
                  <div style={{ width: "15rem" }}>
                    <span>will expire in</span> <br />
                    <div className="d-flex p">
                      <div>
                        <input
                          placeholder="number"
                          style={{ width: "5rem" }}
                          type="number"
                          min={1}
                          onChange={handleNumberOfDateUnitsChange}
                          value={
                            Number(numberOfDateUnitsForExpiration) > 0
                              ? Number(numberOfDateUnitsForExpiration)
                              : ""
                          }
                        />
                      </div>
                      <select
                        value={
                          Number(dateUnitsIdForExpiration) > 0
                            ? Number(dateUnitsIdForExpiration)
                            : ""
                        }
                        onChange={handleDateUnitChange}
                      >
                        <option value=""></option>
                        {allDateUnits.map((dateUnit) => {
                          return (
                            <option key={dateUnit.id} value={dateUnit.id}>
                              {Number(numberOfDateUnitsForExpiration) > 1
                                ? dateUnit.unit
                                : dateUnit.unit.slice(
                                    0,
                                    dateUnit.unit.length - 1
                                  )}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                )}
              </div>
              {allowRecurringPaymentContract && (
                <div
                  style={{ width: "15rem" }}
                  className="recurring-payment-contract-2"
                >
                  <span>Is this a one time payment?</span> <br />
                  <div className="d-flex">
                    <div className="d-flex">
                      <input
                        checked={itemHasRecurringPaymentContract === false}
                        onChange={() =>
                          handleRecurringPaymentContractChange(false)
                        }
                        type="radio"
                        id="recurring-payment-off"
                      />
                      <label
                        style={{
                          fontWeight:
                            itemHasRecurringPaymentContract === false
                              ? "bold"
                              : "normal",
                        }}
                        htmlFor="recurring-payment-off"
                      >
                        This is a one time payment
                      </label>
                    </div>
                    <div className=" mr-5 d-flex">
                      <input
                        checked={itemHasRecurringPaymentContract === true}
                        onChange={() =>
                          handleRecurringPaymentContractChange(true)
                        }
                        type="radio"
                        id="recurring-payment-on"
                      />
                      <label
                        style={{
                          fontWeight:
                            itemHasRecurringPaymentContract === true
                              ? "bold"
                              : "normal",
                        }}
                        htmlFor="recurring-payment-on"
                      >
                        I would like to set up recurring payments
                      </label>
                    </div>
                  </div>
                  {itemHasRecurringPaymentContract && willExpire && (
                    <>
                      {!dateUnitsIdForExpiration ||
                      !numberOfDateUnitsForExpiration ||
                      numberOfDateUnitsForExpiration < 1 ||
                      Number(itemCost) < 1 ||
                      !itemName ? (
                        <>
                          <span style={{ fontSize: ".7rem" }}>
                            Complete all fields
                          </span>
                          <br />
                        </>
                      ) : (
                        <>
                          <span
                            style={{
                              fontSize: ".7rem",
                              backgroundColor: "yellow",
                            }}
                          >
                            Automatically bill the customer{" "}
                            <strong>${itemCost}</strong> every{" "}
                            <strong>{numberOfDateUnitsForExpiration}</strong>
                            <strong>
                              {" "}
                              {dateUnitName}
                              {numberOfDateUnitsForExpiration > 1 && "s"}
                            </strong>{" "}
                            for{" "}
                            <strong>
                              {numberOfItemsIncluded} {itemName}
                            </strong>
                          </span>
                          <br />
                        </>
                      )}
                    </>
                  )}
                  {itemHasRecurringPaymentContract && !willExpire && (
                    <>
                      {numberOfItemsIncluded &&
                      Number(itemCost) > 0 &&
                      itemCost &&
                      itemName ? (
                        <div>
                          <div
                            className="col-12 p-0"
                            style={{ fontSize: ".7rem" }}
                          >
                            <span style={{ backgroundColor: "yellow" }}>
                              Automatically bill the customer every
                            </span>{" "}
                            <br />
                            <div className="d-flex p">
                              <div>
                                <input
                                  placeholder="number"
                                  defaultValue={
                                    numberOfDateUnitsForExpiration !== null &&
                                    numberOfDateUnitsForExpiration != undefined
                                      ? numberOfDateUnitsForExpiration
                                      : undefined
                                  }
                                  style={{ width: "5rem" }}
                                  type="number"
                                  min={1}
                                  onChange={handleNumberOfDateUnitsChange}
                                />
                              </div>
                              <select
                                onChange={handleDateUnitChange}
                                defaultValue={
                                  dateUnitsIdForExpiration !== null &&
                                  dateUnitsIdForExpiration !== undefined
                                    ? dateUnitsIdForExpiration
                                    : undefined
                                }
                              >
                                <option value=""></option>
                                {allDateUnits.map((dateUnit) => {
                                  return (
                                    <option
                                      key={dateUnit.id}
                                      value={dateUnit.id}
                                    >
                                      {Number(numberOfDateUnitsForExpiration) >
                                      1
                                        ? dateUnit.unit
                                        : dateUnit.unit.slice(
                                            0,
                                            dateUnit.unit.length - 1
                                          )}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </div>
                          <>
                            <>
                              <span
                                style={{
                                  fontSize: ".7rem",
                                  backgroundColor: "yellow",
                                }}
                              >
                                for{" "}
                                <strong>
                                  {numberOfItemsIncluded} {itemName}
                                </strong>
                              </span>
                              <br />
                            </>
                          </>
                        </div>
                      ) : (
                        <span style={{ fontSize: ".7rem" }}>
                          Complete all fields
                        </span>
                      )}
                    </>
                  )}
                </div>
              )}
            </>
            {itemName &&
              itemTypeId &&
              numberOfItemsIncluded &&
              numberOfItemsIncluded > 0 &&
              itemCost &&
              itemCost > 0 && (
                <>
                  {((willExpire &&
                    Number(dateUnitsIdForExpiration) > 0 &&
                    Number(numberOfDateUnitsForExpiration) > 0) ||
                    !willExpire) && (
                    <>
                      {((allowRecurringPaymentContract &&
                        ((itemHasRecurringPaymentContract === true &&
                          Number(dateUnitsIdForExpiration) > 0 &&
                          Number(numberOfDateUnitsForExpiration)) ||
                          itemHasRecurringPaymentContract === false)) ||
                        !allowRecurringPaymentContract) && (
                        <div className="col-12 p-0 d-flex justify-content-center flex-wrap mb-3 mt-4 mr-1 ml-1">
                          <button
                            onClick={submitNewItem}
                            className="btn btn-success"
                            style={{ width: "15rem" }}
                          >
                            submit
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
          </div>
        </div>
      </div>
      <div className="col-12 d-flex justify-content-center flex-wrap">
        <div className="col-12 p-0">
          <AllServicesAndMerchandise
            allItemTypes={allItemTypes}
            allDateUnits={allDateUnits}
            reRenderBoolAfterNewItemIsAdded={
              boolToRenderListOfAllItemsAfterNewIsAdded
            }
          />
        </div>
      </div>
    </div>
  );
};

export default AddServicesAndMerchandise;
