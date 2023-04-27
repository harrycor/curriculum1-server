import * as React from "react";
import Select from "react-select";

// ATEEEEntion I think we don't need this component at all anymore

const DropDownForMovesAndWrestlers = (props: IProps) => {
  if (props.isMovesList) {
    return (
      <Select
        options={props.videosByTenant}
        getOptionLabel={(option: any) => option.name_of_video}
        getOptionValue={(option: any) => option.name_of_video}
        onChange={(event: any) => {
          console.log(event);
          props.setDropDownInputValue(event);
        }}
      />
    );


  } else {
    return (
      <div>
        <input
          style={{ maxWidth: "200px" }}
          type="text"
          onClick={() => {
            !props.dropDownInputValue
              ? props.setDisplayDropDown(true)
              : props.setDisplayDropDown(false);
          }}
          value={props.dropDownInputValue}
          onChange={(event: any) => {
            props.setDropDownInputValue(event.target.value);
            props.setDisplayDropDown(true);
          }}
        />
        {props.displayDropDown && (
          <div
            className="auto-container"
            style={{
              whiteSpace: "nowrap",
              backgroundColor: "white",
              maxWidth: "200px",
              maxHeight: "190px",
              overflow: "scroll",
              position: "absolute",
              zIndex: 1,
            }}
          >
            {props.personal_info
              .filter(
                ({ first_name, last_name }: any) =>
                  `${first_name} ${last_name}`
                    .toLowerCase()
                    .indexOf(props.dropDownInputValue.toLowerCase()) > -1
              )
              .map((wrestler: any) => {
                return (
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      props.setDropDownInputValue(
                        `${wrestler.first_name} ${wrestler.last_name}`
                      );
                      props.setWrestlerId(wrestler.user_id);
                      props.setDisplayDropDown(false);
                    }}
                    key={wrestler.user_id}
                    tabIndex={0}
                  >
                    <span>
                      {wrestler.first_name} {wrestler.last_name}
                    </span>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    );
  }
};

export default DropDownForMovesAndWrestlers;

interface IProps {
  isMovesList: boolean;
  isPersonList: boolean;
  dropDownInputValue: boolean | any;
  setDisplayDropDown: any;
  setDropDownInputValue: any;
  displayDropDown: any;
  videosByTenant: any;
  setSearchedMoveId: any;
  personal_info: any;
  setWrestlerId: any;
}


