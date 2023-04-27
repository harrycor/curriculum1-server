import * as React from "react";
import NavigationBar from "../NavigationBar";

const ThankYouForYourPurchase = () => {
  return (
    <>
      <NavigationBar />
      <div className="d-flex justify-content-center flex-wrap">
        <div className="col-12 text-center">
          <span style={{ fontSize: "2rem" }}>
            <strong>Thank you for your purchase!</strong>
          </span>
        </div>
        <div className="col-6 text-center">
          <span style={{ fontSize: "1.3rem" }}>
            A receipt has been sent to your email
          </span>
        </div>
      </div>
    </>
  );
};
export default ThankYouForYourPurchase;
