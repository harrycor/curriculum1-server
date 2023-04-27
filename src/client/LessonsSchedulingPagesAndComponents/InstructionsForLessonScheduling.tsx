import * as React from "react";

const InstructionsForLessonScheduling = (props: IProps) => {
  return (
    <div
      onClick={() => props.hideInstructions()}
      className="d-flex justify-content-center align-items-center"
      style={{
        position: "fixed",
        zIndex: 2000,
        backgroundColor: "gray",
        height: "100%",
        width: "100%",
        opacity: "97%",
        overflow: "scroll",
      }}
    >
      <div
        className="p-2"
        style={{
          zIndex: 2001,
          backgroundColor: "white",
          minWidth: "75%",
          //   minHeight: "75%",
          maxHeight: "100%",
          overflow: "scroll",
        }}
      >
        <div className="d-flex justify-content-center flex-wrap">
          <div
            style={{ color: "black", fontSize: "2rem", margin: "2rem" }}
            className=" col-12 p-0 d-flex justify-content-center text-center"
          >
            <span>
              <u>Wreslter instructions:</u>
            </span>
          </div>
          <div className="col-md-8 col-12 p-0 d-flex justify-content-start flex-wrap">
            <div className="alert alert-primary col-12 p-0 mt-3 mb-1 d-flex justify-content-center">
              <span className="col-1 d-flex justify-content-center align-items-center">
                <strong style={{fontSize:"1.5rem", color:"black"}}>1</strong>
              </span>
              <span className="col-11">
                Select a Coach to view their availability and schedule on the
                Calendar below
              </span>
            </div>

            <div className="col-12 justify-content-center mb-3">
              <div
                style={{ fontSize: ".7rem" }}
                className="text-center d-flex justify-content-center flex-wrap"
              >
                <div
                  className="p-1 m-1"
                  style={{
                    backgroundColor: "LightGray",
                    border: "solid red 1px",
                    borderRadius: ".3rem",
                  }}
                >
                  Coaches
                  <br />
                  availability
                </div>
                <div
                  className="p-1 m-1"
                  style={{
                    backgroundColor: "LimeGreen",
                    border: "solid black 1px",
                    borderRadius: ".3rem",
                  }}
                >
                  Single
                  <br />
                  lesson
                </div>{" "}
                <div
                  className="p-1 m-1"
                  style={{
                    backgroundColor: "coral",
                    border: "solid aqua 1px",
                    borderRadius: ".3rem",
                  }}
                >
                  Weekly
                  <br />
                  lesson
                </div>
              </div>
            </div>

            <div className="col-12 p-0 mt-3 mb-3 d-flex justify-content-center alert alert-dark">
              <span className="col-1 d-flex justify-content-center align-items-center">
                <strong style={{fontSize:"1.5rem", color:"black"}}>2</strong>
              </span>
              <span className="col-11">
                Select a specific Date or use the arrows just above the Calendar
                to view upcomming/previous Dates
              </span>
            </div>

            <div className="col-12 p-0 mt-3 mb-3 d-flex justify-content-center alert alert-dark">
              <span className="col-1 d-flex justify-content-center align-items-center">
                <strong style={{fontSize:"1.5rem", color:"black"}}>3</strong>
              </span>
              <span className="col-11">
                Click on a scheduled lesson to show more information about the
                lesson
              </span>
            </div>
          </div>
          <div className="m-3 col-12 p-0 text-center d-flex justify-content-center">
            <span
              className="btn btn-sm btn-danger"
              onClick={() => props.hideInstructions()}
            >
              Close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructionsForLessonScheduling;

interface IProps {
  hideInstructions: Function;
}
