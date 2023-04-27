import React from "react";
import NavigationBar from "../NavigationBar";
import CreateAccountForTennancyModel from "./wrestlerManager/CreateAccountForTennancyModel";
import VideoManager from "./videoManager/VideoManager";
import AddItemAdminPage from "./itemManager/addItemAdminPage";
import PaymentsAdminPanelStart from "../payments/PaymentsAdminPanelStart";
import FilterWrestlers from "./findWrestler/FilterWrestlers";
import ViewPayments from "../payments/viewPaymentsScrap/viewPayments";
import ViewPaymentsAndRefunds from "../payments/viewPaymentsAndRefunds/ViewPaymentsAndRefunds";

function Admin() {
  const [showOrHideCreateAccount, setShowOrHideCreateAccount] =
    React.useState(false);
  const [showOrHideVideoManager, setShowOrHideVideoManager] =
    React.useState(false);
  const [showOrHideItem, setShowOrHideItem] = React.useState(false);
  const [showOrHideFilterForWreslters, setShowOrHideFilterForWreslters] =
    React.useState(false);
  const [showPaymentsAdminPanel, setShowPaymentsAdminPanel] =
    React.useState(false);
  const [isStripeAccountActive, setIsStripeAccountActive] =
    React.useState<boolean>(false);
  const [
    showOrHideViewPaymentsAndRefunds,
    setShowOrHideViewPaymentsAndRefunds,
  ] = React.useState<boolean>(false);

  React.useEffect(() => {
    let isMounted = true;
    let token = localStorage.getItem("token");
    fetch(`/api/stripeAccounts/getStripeAccountStatusForCalendar`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => setIsStripeAccountActive(res.isStripeAccountActive))
      .catch((err) => console.log(err));
    return () => {
      isMounted = false;
    };
  }, []);

  const showOrHideAccountCreation = () => {
    setShowOrHideCreateAccount(!showOrHideCreateAccount);
    if (showOrHideVideoManager) {
      setShowOrHideVideoManager(false);
    }
    if (showOrHideItem) {
      setShowOrHideItem(false);
    }
  };

  const showOrHideVideoManagerFunction = () => {
    setShowOrHideVideoManager(!showOrHideVideoManager);
    setShowOrHideCreateAccount(false);
    setShowOrHideItem(false);
    setShowPaymentsAdminPanel(false);
    setShowOrHideFilterForWreslters(false);
    setShowOrHideViewPaymentsAndRefunds(false);
  };
  const showOrHideItemCreation = () => {
    setShowOrHideItem(!showOrHideItem);
    setShowOrHideCreateAccount(false);
    setShowOrHideVideoManager(false);
    setShowPaymentsAdminPanel(false);
    setShowOrHideFilterForWreslters(false);
    setShowOrHideViewPaymentsAndRefunds(false);
  };
  const showOrHideStoreAdminPanel = () => {
    setShowPaymentsAdminPanel(!showPaymentsAdminPanel);
    setShowOrHideItem(false);
    setShowOrHideCreateAccount(false);
    setShowOrHideVideoManager(false);
    setShowOrHideFilterForWreslters(false);
    setShowOrHideViewPaymentsAndRefunds(false);
  };
  const showOrHideFilterWrestlersFunction = () => {
    setShowOrHideFilterForWreslters(!showOrHideFilterForWreslters);
    setShowPaymentsAdminPanel(false);
    setShowOrHideItem(false);
    setShowOrHideCreateAccount(false);
    setShowOrHideVideoManager(false);
    setShowOrHideViewPaymentsAndRefunds(false);
  };

  const showOrHideViewPaymentsAndRefundsFunc = () => {
    setShowOrHideViewPaymentsAndRefunds(!showOrHideViewPaymentsAndRefunds);
    setShowOrHideFilterForWreslters(false);
    setShowPaymentsAdminPanel(false);
    setShowOrHideItem(false);
    setShowOrHideCreateAccount(false);
    setShowOrHideVideoManager(false);
  };

  // console.log(showOrHideFilterForWreslters);

  return (
    <>
      <NavigationBar />
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-success ml-2"
          onClick={showOrHideAccountCreation}
        >
          Click here to show/hide add wrestler panel
        </button>
        <button
          className="btn btn-warning"
          onClick={showOrHideVideoManagerFunction}
        >
          Click here to show/hide Video Manager
        </button>
        <button
          className="btn btn-secondary mr-2"
          onClick={showOrHideItemCreation}
        >
          Click here to show/hide add item panel
        </button>

        <button
          className="btn btn-primary mr-2"
          onClick={showOrHideFilterWrestlersFunction}
        >
          Click here to find partners
        </button>
      </div>

      {isStripeAccountActive && (
        <div className="d-flex justify-content-center">
          <button
            onClick={showOrHideStoreAdminPanel}
            className="btn btn-info m-3"
          >
            Store manager
          </button>
          <button
            onClick={showOrHideViewPaymentsAndRefundsFunc}
            className="btn btn-info m-3"
          >
            Payments and refunds
          </button>
        </div>
      )}
      {showOrHideCreateAccount && <CreateAccountForTennancyModel />}
      {showOrHideVideoManager && <VideoManager />}
      {showOrHideItem && <AddItemAdminPage />}
      {showOrHideFilterForWreslters && (
        <FilterWrestlers enableTextingFunctionality={true} />
      )}
      {showPaymentsAdminPanel && isStripeAccountActive && (
        <PaymentsAdminPanelStart />
      )}
      {/* <ViewPayments /> */}
      {showOrHideViewPaymentsAndRefunds && <ViewPaymentsAndRefunds />}
    </>
  );
}

export default Admin;
