import * as React from "react";
import { useState, useEffect } from "react";
import {
  IDateUnits,
  IItemTypes,
  IServicesAndMerchandise,
} from "./interfacesForPayments";

const EditServiceOrMerchandise = (props: IProps) => {
  let {
    id,
    name_of_item,
    cost_of_item,
    item_type_id,
    item_type_name,
    number_of_items_included,
    added_by_user_id,
    tenant_id,
    date_units_id_for_expiration,
    date_created,
    number_of_date_units_for_expiration,
    has_recurring_payment_contract,
  } = props.serviceOrMerchandise;
  // item type details
  const [allDateUnits, setAllDateUnits] = useState<IDateUnits[]>(
    props.allDateUnits
  );
  const [allItemTypes, setAllItemTypes] = useState<IItemTypes[]>(
    props.allItemTypes
  );
  const [itemTypeId, setItemTypeId] = useState<number | undefined>(
    item_type_id
  );
  const [itemTypeDescription, setItemTypeDescription] = useState<string>();
  const [keepTrackOfAmountUsed, setKeepTrackOfAmountUsed] =
    useState<boolean>(false);
  const [willExpire, setWillExpire] = useState<boolean>(false);
  const [allowRecurringPaymentContract, setAllowRecurringPaymentContract] =
    useState<boolean>(false);
  //  set by user
  const [itemName, setItemName] = useState<string>(name_of_item);
  const [numberOfItemsIncluded, setNumberOfItemsIncluded] = useState<number>(
    number_of_items_included
  );
  const [itemCost, setItemCost] = useState<number>(cost_of_item);
  const [dateUnitsIdForExpiration, setDateUnitsIdForExpiration] = useState<
    number | null
  >();
  const [dateUnitName, setDateUnitName] = useState<string | undefined>();
  const [numberOfDateUnitsForExpiration, setNumberOfDateUnitsForExpiration] =
    useState<number | null>(number_of_date_units_for_expiration);
  const [itemHasRecurringPaymentContract, setItemHasRecurringPaymentContract] =
    useState<boolean | undefined>(
      has_recurring_payment_contract === 1 ? true : false
    );

  //   useEffect(() => {
  //     let isMounted = true;
  //     if (isMounted) {
  //       setDateUnitsIdForExpiration(null);
  //       setDateUnitName(undefined);
  //       setNumberOfDateUnitsForExpiration(null);
  //       setItemHasRecurringPaymentContract(undefined);
  //     }
  //     return () => {
  //       isMounted = false;
  //     };
  //   }, [itemTypeId]);

  useEffect(() => {
    let isMounted = true;
    if (
      props.allDateUnits &&
      allItemTypes &&
      props.serviceOrMerchandise &&
      isMounted
    ) {
      handleDateUnitChange({
        target: {
          value: props.serviceOrMerchandise.date_units_id_for_expiration,
        },
      });
      // fuuucking stupid
      for (let x = 0; x < allItemTypes.length; x++) {
        if (
          allItemTypes[x].id === Number(props.serviceOrMerchandise.item_type_id)
        ) {
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
    return () => {
      isMounted = false;
    };
  }, [props.allDateUnits, props.serviceOrMerchandise, allItemTypes]);

  let handleItemTypeChange = (e: any) => {
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
            setDateUnitsIdForExpiration(null);
            setDateUnitName(undefined);
            setNumberOfDateUnitsForExpiration(null);
            setItemHasRecurringPaymentContract(undefined);
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

  let updateItem = () => {
    if (confirm("Are you sure you want to update item?")) {
      let token = localStorage.getItem("token");
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceOrMerchandiseId: id,
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
        }),
      };
      fetch(
        "/api/servicesAndMerchandise/updateServiceOrMerchandise",
        requestOptions
      )
        .then((res) => res.json())
        .then((res) => {
          alert(res.message);
          props.renderParentFunc();
        });
    }
  };

  let deactivateItem = () => {
    if (!confirm("Are you sure you want to remove this item?")) return;
    let token = localStorage.getItem("token");
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        serviceOrMerchandiseId: id,
      }),
    };
    fetch(
      "/api/servicesAndMerchandise/deactivateServiceOrMerchandise",
      requestOptions
    )
      .then((res) => res.json())
      .then((res) => {
        alert(res.message);
        props.renderParentFunc();
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <td>
        <select
          defaultValue={Number(itemTypeId)}
          onChange={handleItemTypeChange}
          style={{ width: "10rem" }}
        >
          <option value=""></option>
          {allItemTypes.map((type) => {
            return (
              <option key={type.id} value={type.id}>
                {type.item_type}
              </option>
            );
          })}
        </select>{" "}
        <br />
        {itemTypeDescription && itemTypeDescription !== null && (
          <span style={{ fontSize: ".7rem", color: "gray" }}>
            {itemTypeDescription}
          </span>
        )}
      </td>
      <td>
        <textarea
          defaultValue={itemName}
          maxLength={50}
          rows={2}
          onChange={handleItemNameChange}
          style={{ maxWidth: "15rem", minWidth: "9rem" }}
        />
      </td>
      <td>
        <input
          value={numberOfItemsIncluded}
          onChange={handleNumberOfItemsIncludedChange}
          min="1"
          type="number"
          style={{ width: "5rem" }}
        />
      </td>
      <td>
        <>
          {numberOfItemsIncluded && numberOfItemsIncluded > 0 && itemName ? (
            <input
              value={itemCost}
              onChange={handleItemCostChange}
              min="1"
              type="number"
              placeholder="$"
              style={{ width: "5rem" }}
            />
          ) : (
            <div>-</div>
          )}
        </>
      </td>
      <td>
        {willExpire ? (
          <>
            <input
              value={
                Number(numberOfDateUnitsForExpiration) > 0
                  ? Number(numberOfDateUnitsForExpiration)
                  : ""
              }
              style={{ width: "5rem" }}
              type="number"
              min={1}
              onChange={handleNumberOfDateUnitsChange}
            />
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
                      : dateUnit.unit.slice(0, dateUnit.unit.length - 1)}
                  </option>
                );
              })}
            </select>
          </>
        ) : (
          <div>-</div>
        )}
      </td>
      <td>
        {allowRecurringPaymentContract ? (
          <div className="recurring-payment-contract-2 col-12 p-0">
            <div className="d-flex">
              <div className=" mr-5">
                <input
                  checked={itemHasRecurringPaymentContract === true}
                  onChange={() => handleRecurringPaymentContractChange(true)}
                  type="radio"
                  id={`recurring-payment-on-${props.serviceOrMerchandise.id}`}
                />
                <label
                  style={{
                    fontWeight:
                      itemHasRecurringPaymentContract === true
                        ? "bold"
                        : "normal",
                  }}
                  htmlFor={`recurring-payment-on-${props.serviceOrMerchandise.id}`}
                >
                  yes
                </label>
              </div>
              <div className="">
                <input
                  checked={itemHasRecurringPaymentContract === false}
                  onChange={() => handleRecurringPaymentContractChange(false)}
                  type="radio"
                  id={`recurring-payment-off-${props.serviceOrMerchandise.id}`}
                />
                <label
                  style={{
                    fontWeight:
                      itemHasRecurringPaymentContract === false
                        ? "bold"
                        : "normal",
                  }}
                  htmlFor={`recurring-payment-off-${props.serviceOrMerchandise.id}`}
                >
                  no
                </label>
              </div>
            </div>
            {itemHasRecurringPaymentContract && willExpire && (
              <>
                {!dateUnitsIdForExpiration ||
                !numberOfDateUnitsForExpiration ||
                numberOfDateUnitsForExpiration < 1 ? (
                  <>
                    <span style={{ fontSize: ".7rem" }}>
                      Set expiration date
                    </span>
                    <br />
                  </>
                ) : (
                  <>
                    <span
                      style={{ fontSize: ".7rem", backgroundColor: "yellow" }}
                    >
                      Automatically bill the customer every{" "}
                      <strong>{numberOfDateUnitsForExpiration}</strong>
                      <strong>
                        {" "}
                        {Number(numberOfDateUnitsForExpiration) > 1
                          ? dateUnitName
                          : dateUnitName?.slice(0, dateUnitName.length - 1)}
                      </strong>
                    </span>
                    <br />
                  </>
                )}
              </>
            )}
            {itemHasRecurringPaymentContract && !willExpire && (
              <div>
                <div className="col-12 p-0" style={{ fontSize: ".7rem" }}>
                  <span>Automatically bill the customer every</span> <br />
                  <div className="d-flex p">
                    <div>
                      <input
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
                <br />
              </div>
            )}
          </div>
        ) : (
          <div>-</div>
        )}
      </td>
      <td>
        <div>
          {/* Figuring out this logic was a BLAST! */}
          <button
            disabled={
              (itemName !== name_of_item ||
                itemTypeId !== item_type_id ||
                Number(numberOfItemsIncluded) !== number_of_items_included ||
                Number(itemCost) !== cost_of_item ||
                dateUnitsIdForExpiration != date_units_id_for_expiration ||
                numberOfDateUnitsForExpiration !=
                  number_of_date_units_for_expiration ||
                itemHasRecurringPaymentContract !==
                  (has_recurring_payment_contract === 1 ? true : false)) &&
              itemName &&
              itemTypeId &&
              numberOfItemsIncluded &&
              numberOfItemsIncluded > 0 &&
              itemCost &&
              itemCost > 0 &&
              ((willExpire &&
                Number(dateUnitsIdForExpiration) > 0 &&
                Number(numberOfDateUnitsForExpiration) > 0) ||
                !willExpire) &&
              ((allowRecurringPaymentContract &&
                ((itemHasRecurringPaymentContract === true &&
                  Number(dateUnitsIdForExpiration) > 0 &&
                  Number(numberOfDateUnitsForExpiration)) ||
                  itemHasRecurringPaymentContract === false)) ||
                !allowRecurringPaymentContract)
                ? false
                : true
            }
            onClick={updateItem}
            className="btn btn-sm btn-success"
          >
            update
          </button>
        </div>
      </td>
      <td>
        <button onClick={deactivateItem} className="btn btn-sm btn-danger">
          Remove
        </button>
      </td>
    </>
  );
};

export default EditServiceOrMerchandise;

interface IProps {
  serviceOrMerchandise: IServicesAndMerchandise;
  allItemTypes: IItemTypes[];
  allDateUnits: IDateUnits[];
  renderParentFunc: Function;
}
