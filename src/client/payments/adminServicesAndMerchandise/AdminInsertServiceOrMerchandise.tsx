import * as React from "react";
import { useState, useEffect } from "react";
import SelectServicesAdmin from "./SelectServicesAdmin";

const AdminInsertServiceOrMerchandise = (props: IProps) => {
  const [showCash, setShowCash] = useState<boolean>(true);
  const [showCard, setShowCard] = useState<boolean>(false);

  return (
    <div>
      <div>
        <SelectServicesAdmin
          handleShowAdminInsertServicesFunc={
            props.handleShowAdminInsertServicesFunc
          }
        />
      </div>
    </div>
  );
};

export default AdminInsertServiceOrMerchandise;

interface IProps {
  handleShowAdminInsertServicesFunc: Function;
}
