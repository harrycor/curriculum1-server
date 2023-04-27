import * as React from "react";
import { useState, useEffect } from "react";
import {
  IDateUnits,
  IItemTypes,
  IServicesAndMerchandise,
} from "./interfacesForPayments";
import EditServiceOrMerchandise from "./EditServiceOrMerchandise";

const AllServicesAndMerchandise = (props: IProps) => {
  const [allServicesAndMerchandise, setAllServicesAndMerchandise] =
    useState<IServicesAndMerchandise[]>();
  const [renderBool, setRenderBool] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    let token = localStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    fetch(
      `/api/servicesAndMerchandise/getAllServicesAndMerchandiseByTenantId`,
      requestOptions
    )
      .then((res) => res.json())
      .then((res: IServicesAndMerchandise[] | any) => {
        isMounted && setAllServicesAndMerchandise(res[0]);
      })
      .catch((err) => console.log(err));
    return () => {
      isMounted = false;
    };
  }, [renderBool, props.reRenderBoolAfterNewItemIsAdded]);

  let renderFunc = () => setRenderBool(!renderBool);

  return (
    <div className="m-2">
      <div className="col-12 p-0 d-flex justify-content-center">
        <span style={{ fontSize: "1.3rem" }}>
          <strong>All Items/Services</strong>
        </span>
      </div>
      <table className="table table-striped mt-2">
        <thead>
          <tr
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              backgroundColor: "white",
            }}
          >
            <th>Type</th>
            <th>Item/Service name</th>
            <th># of items included</th>
            <th>Cost</th>
            <th>Will expire in</th>
            <th>Recurring payment contract</th>
            <th>Submit changes</th>
            <th>Remove item</th>
          </tr>
        </thead>
        <tbody>
          {allServicesAndMerchandise?.map((serviceOrMerchandise) => {
            return (
              <tr key={serviceOrMerchandise.id}>
                <EditServiceOrMerchandise
                  serviceOrMerchandise={serviceOrMerchandise}
                  allItemTypes={props.allItemTypes}
                  allDateUnits={props.allDateUnits}
                  renderParentFunc={renderFunc}
                />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default AllServicesAndMerchandise;

interface IProps {
  reRenderBoolAfterNewItemIsAdded: boolean;
  allItemTypes: IItemTypes[];
  allDateUnits: IDateUnits[];
}
