import React, { useState, useEffect } from "react";
import NavigationBar from "../../NavigationBar";
import SelectDropDownForAllWrestlersOnTennant from "../../reusableComponents/selectDropDownForAllWrestlersOnTennant";
import WrestlerCard from "./WrestlerCard";
import WrestlerTableBody from "./WrestlerTableBody";
import WrestlerTableHeader from "./WrestlerTableHeader";

function MasterView() {
  const [wrestlers, setWrestlers] = useState<WrestlerInterface[] | undefined>(
    []
  );
  const [wrestlersToDisplayGrades, setWrestlersToDisplayGrades] = useState<{
    [key: string]: boolean;
  }>({});
  const [wrestlersGrades, setWrestlersGrades] = useState<
    Array<{ id: number; show: boolean; grades: GradeInterface[] }>
  >([]);

  // This is how we handle the initial wrestler slelect from the input
  const handleWrestlerSelect = (wrestler: WrestlerInterface) => {
    let wrestlerAlreadyExsistsInList =
      wrestlers?.some(
        (wrestlerFromArray) => wrestler.id == wrestlerFromArray.id
      ) ||
      Object.keys(wrestlersToDisplayGrades).some(
        (id) => Number(id) == wrestler.id
      );

    if (!wrestlerAlreadyExsistsInList) {
      // @ts-ignore
      setWrestlers((prev) => [...prev, wrestler]);
      //
      // This is an object whtih id's as keys and boolean values to determine who gets displayed
      setWrestlersToDisplayGrades((prev) => {
        let idAsString = String(wrestler.user_id);
        return { ...prev, [idAsString]: true };
      });
    } else {
    }
  };

  // This is how we toggle if we show the wrestlers
  // We only call it if the checked value in the WrestlerCard component is true
  const showThisWrestler = (id: number) => {
    setWrestlersToDisplayGrades((prev) => {
      let idAsString = String(id);
      return { ...prev, [idAsString]: prev[id] == false };
    });
  };

  // This is how we delete a wrestler it is calles in the WrestlerCard conponent
  const deleteWrestler = (id: number) => {
    // filter out wrestler that was clickec
    let newArray = wrestlers?.filter((wrestler) => wrestler.user_id != id);

    // const firstUserInArrayId = String(newArray[0].user_id);

    //remove werstler from wrestler array
    setWrestlers(newArray);

    // Update the object so we don't keep the removed id key in there
    setWrestlersToDisplayGrades((prev) => {
      let idAsString = String(id);
      // remove the clicked user from the display object
      delete prev[idAsString];

      let keysFromPrev = Object.keys(prev);

      // we do the below to ensure that if a wrestler that is the masterUser[footNote:1] is removed while no other wrestlers are selected to be shown
      // We make sure we set the new master user to be shown
      prev[keysFromPrev[0]] = true;

      return { ...prev };
    });
  };

  let token = localStorage.getItem("token");

  // this is the enter grade function
  let enterGrade = async (
    video_id: number,
    user_id: number,
    grade: number,
    note: string,
    coach_user_id: number,
    max_grade: number
  ) => {
    if (grade > max_grade) {
      alert(
        "GRADE NOT SUBMITTED! You cannot submit a grade higher than the maximum grade"
      );
    } else if (grade < 0) {
      alert(
        "GRADE NOT SUBMITTED! You cannot submit a grade of a negative number"
      );
    } else {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          video_id: video_id,
          coach_user_id: coach_user_id,
          student_user_id: user_id,
          grade: grade,
          movement_notes: note,
        }),
      };
      await fetch(`/api/grades/`, requestOptions).then((res) => {
        if (res.ok) {
          alert(
            `A grade of ${grade} was entered for wrestler with user ID: ${user_id}`
          );
          // We do this to cause a re-render if we update grades in order for our UI updates
          setWrestlersToDisplayGrades({ ...wrestlersToDisplayGrades });
        } else {
          alert(
            "GRADE NOT SUBMITTED! Something went wrong. Try logging out and then logging in again."
          );
        }
      });
    }
  };

  // This fetches our route that returns the wrestler grades and name
  const getWrestlersGrades = async () => {
    await fetch("/api/grades/multipleWrestlersGrades", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        wrestlers: wrestlersToDisplayGrades,
      }),
    })
      .then((res) => {
        if (res.status == 204) {
          console.log("no wrestlers");
        } else {
          const parsed = res.json();
          return parsed;
        }
      })
      .then(
        (
          parsedUsersAndGrades: Array<{
            id: number;
            show: boolean;
            grades: GradeInterface[];
          }>
        ) => {
          // We need this if statement to make sure we don't get an error if somehting weird accurs
          if (!parsedUsersAndGrades) {
            return;
          } else {
            setWrestlersGrades(parsedUsersAndGrades);
          }
        }
      );
  };

  useEffect(() => {
    getWrestlersGrades();
  }, [wrestlersToDisplayGrades]);

  // We use this to determine if the user is the masterUser[footNote:1] in WrestlerCard component
  function returnTrueIfMasterUser(wrestler: WrestlerInterface) {
    if (wrestler.user_id == wrestlersGrades[0]?.id) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <>
      <NavigationBar />
      <div className="form-group row m-2">
        <label className="col-sm-2 col-form-label" htmlFor="wrestlerName">
          Add Wrestler
        </label>
        <SelectDropDownForAllWrestlersOnTennant
          className={"col-sm-10 "}
          callBackFunction={handleWrestlerSelect}
        />
      </div>
      <div
        className="d-flex "
        style={{ position: "sticky", top: "11vh", zIndex: "3" }}
      >
        {wrestlers
          ? wrestlers.map((wrestler: WrestlerInterface) => (
              <WrestlerCard
                key={`wrestlerCard:${wrestler.id}`}
                // This is the function that determines if we display the star
                masterUser={returnTrueIfMasterUser(wrestler)}
                wrestler={wrestler}
                wrestlerToDisplayGradesState={wrestlersToDisplayGrades}
                showThisWrestler={showThisWrestler}
                deleteWrestlerById={deleteWrestler}
              />
            ))
          : "Select a wrestler"}
      </div>
      <div style={{ display: "flex", overflowY: "visible" }}>
        {wrestlersGrades.length
          ? wrestlersGrades.map((wrestler, arrayKey) => {
              return (
                wrestlersToDisplayGrades[String(wrestler.id)] && (
                  <table
                    key={`wrestlerTable:${wrestler.id}`}
                    className={`p-4  master-view-table table`}
                    style={{
                      backgroundColor: "hsl(0,0%,30%)",
                      border: "2px solid tangerine",
                      borderRadius: "3px",
                    }}
                  >
                    <thead className="">
                      <tr className="grade-table-header-row">
                        <WrestlerTableHeader
                          wrestler={wrestler}
                          arrayKey={arrayKey}
                        />
                      </tr>
                    </thead>
                    <tbody className="master-view-table-body">
                      <WrestlerTableBody
                        wrestler={wrestler}
                        enterGrade={enterGrade}
                        arrayKey={arrayKey}
                      />
                    </tbody>
                  </table>
                )
              );
            })
          : null}
      </div>
    </>
  );
}

export interface WrestlerInterface {
  id: number;
  email: string;
  password: string;
  role: string;
  real_email: number;
  phone_number: number;
  war_zone_id: number;
  tenant: number;
  created_at: string;
  is_active: number;
  first_name: string;
  last_name: string;
  notes: string;
  user_id: number;
}

export interface GradeInterface {
  id: number;
  tenant: number;
  name_of_video: string;
  url_to_video: string;
  curriculum_level: number;
  created_at: string;
  url_to_looped_video: string;
  number_for_ordering: number;
  maximum_grade: number;
  grade?: number;
  movement_notes?: string;
  grade_created_at?: string;
  first_name?: string;
  last_name?: string;
}

export default MasterView;

// Foot Notes
// ================================
// *1: masterUser is the user that is in the first position in the array. We must distinguish this user because we only want to display the name of the move and the levelt it is on once in our
// layout. The master user therefore is denoted by a star instead of a check box because we don't want to allow the master user to be hidden because we will lose the move names if this happens
