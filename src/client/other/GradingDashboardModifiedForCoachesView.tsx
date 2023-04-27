import React, { useState } from "react";

import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

/* 
  The following interfaces are the various response structures
  fetched from the several endpoints.  Add properties as needed.
*/

interface AllCurrentGradesForWrestler {
  id?: number;
  maximum_grade?: number;
  grade?: number;
}

interface PersonalInfo {
  first_name?: string;
  last_name?: string;
}

interface EarnableItems {
  id?: number;
  created_at?: string;
  user_id?: number;
  tenant?: number;
  item_name: string;
  item_color: string;
  percentage_of_total_points_needed: number;
}

interface AllUserVideos {
  id?: number;
  maximum_grade?: number;
}

/*
  This interface represents all the state of this component
  batched into one object.  This helps prevent unecessary re-renders
  and prevents state from falling out of sync.
*/

interface ComponentState {
  personalInfo: PersonalInfo;
  currentItemFromDb: EarnableItems;
  earnableItems: EarnableItems[];
  totalPointsEarnedByWrestler: number;
  totalPointsAvailable: number;
  currentItemEarned: EarnableItems;
  nextItemToBeEarned: string;
  loading: boolean;
}

/*
  This interface represents the arguments for the two utility 
  functions used to calculate the earned and next items to display
*/

interface CalcArguments {
  earnableItems: EarnableItems[];
  totalPointsAvailable: number;
  totalPointsEarnedByWrestler: number;
}

/*
  Utility function meant to obtain the current earned item
*/

export default function GradingDashBoardModifiedForCoachesView(props: {
  UID: number;
  stateForRerenderOnGradeSubmit: number;
}) {
  let token = localStorage.getItem("token");

  // This will be replaces by personal_info.current_shirt
  const [userShirt, setUserShirt] = useState<EarnableItems>({
    id: 5,
    created_at: "2021-12-30T23:34:07.000Z",
    user_id: 21,
    tenant: 75,
    item_name: "Shirt",
    item_color: "Black",
    percentage_of_total_points_needed: 0,
  });

  const [unearnedItems, setUnearnedItems] = useState<EarnableItems[]>([]);

  let stateForReRenderOnGradeSubmit = props.stateForRerenderOnGradeSubmit;
  // We use these two pieces of state to calculate points till next Item
  const [pointsEarned, setPointsEarned] = useState(0);
  const [pointsAvailableForNextItem, setPointsAvailableForNextItem] =
    useState(0);

  // one batched state to control unecessary re-renders
  // added a loading property to guarentee useEffect labeled "2"
  // only runs one time per card
  const [state, setState] = useState<ComponentState>({
    personalInfo: {
      first_name: "not yet loaded",
      last_name: "not yet loaded",
    },
    currentItemFromDb: {
      id: 5,
      created_at: "2021-12-30T23:34:20.000Z",
      user_id: 21,
      tenant: 75,
      item_name: "Shirt",
      item_color: "Black",
      percentage_of_total_points_needed: 0,
    },
    earnableItems: [],
    totalPointsEarnedByWrestler: 0,
    totalPointsAvailable: 1,
    currentItemEarned: {
      item_name: "No items to show",
      item_color: "No items to show",
      percentage_of_total_points_needed: 0,
    },
    nextItemToBeEarned: "You did it!",
    loading: true,
  });

  // Functions for cacling current and next item
  function calcCurrentItem({
    earnableItems,
    totalPointsAvailable,
    totalPointsEarnedByWrestler,
  }: CalcArguments): EarnableItems {
    let pointsRequiredToEarnThisItem = 0;
    let itemIndex = 0;
    if (earnableItems.length === 0) {
      alert("No items to earn");
      return {
        item_name: "No items to show",
        item_color: "No items to show",
        percentage_of_total_points_needed: 0,
      };
    }
    for (let x = 0; x < earnableItems.length; x++) {
      pointsRequiredToEarnThisItem =
        (earnableItems[x].percentage_of_total_points_needed *
          totalPointsAvailable) /
        100;

      if (totalPointsEarnedByWrestler >= pointsRequiredToEarnThisItem) {
        itemIndex = x;
      }
    }
    setPointsEarned(totalPointsEarnedByWrestler);
    return earnableItems[itemIndex];
  }

  function calcNextItem({
    earnableItems,
    totalPointsAvailable,
    totalPointsEarnedByWrestler,
  }: CalcArguments) {
    let pointsRequiredToEarnThisItem = 0;
    let itemIndex = 0;
    if (earnableItems.length === 0) {
      return;
    }
    for (let x = 0; x < earnableItems.length; x++) {
      pointsRequiredToEarnThisItem =
        (earnableItems[x].percentage_of_total_points_needed *
          totalPointsAvailable) /
        100;
      if (totalPointsEarnedByWrestler < pointsRequiredToEarnThisItem) {
        itemIndex = x;
        break;
      }
    }
    const nextItemsPointsRequired = Math.ceil(
      (earnableItems[itemIndex].percentage_of_total_points_needed / 100) *
        totalPointsAvailable
    );
    setPointsAvailableForNextItem(nextItemsPointsRequired);
    return `${earnableItems[itemIndex].item_color} ${earnableItems[itemIndex].item_name}`;
  }

  // useEffect 1
  // batched fetch of all info
  // Promise.all allows us to run all the fetch requests in parallel
  // it returns an array that I map over and res.json each response
  // and then I have the final array of all fetched data grouped
  React.useEffect(() => {
    Promise.all([
      fetch(`/api/personal_info/person/${props.UID}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`/api/earnableItems/${props.UID}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`/api/grades/allCurrentGradesForASingleWrestler/${props.UID}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`/api/videos/${props.UID}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then((resArray) =>
        Promise.all(
          resArray.map((res) => {
            if (res.status === 500) {
              alert("Internal Server Error");
            } else {
              return res.json();
            }
          })
        )
      )
      .then(([personalInfo, earnableItems, wrestlerGrades, videos]: any) => {
        // get total points earned
        const totalPoints = wrestlerGrades.reduce(
          (total: number, currentWrestler: AllCurrentGradesForWrestler) =>
            (total += currentWrestler.grade),
          0
        );

        // get total points available
        const totalPointsAv = videos.reduce(
          (total: number, video: AllUserVideos) =>
            (total += video.maximum_grade),
          0
        );

        // one batched setState that also toggles loading to false
        setState((prev) => {
          return {
            ...prev,
            currentItemFromDb: {
              id: 15,
              created_at: "2021-12-30T23:34:20.000Z",
              user_id: 21,
              tenant: 75,
              item_name: "Shirt",
              item_color: "Blue",
              percentage_of_total_points_needed: 14,
            },
            personalInfo: personalInfo[0],
            earnableItems,
            totalPointsEarnedByWrestler: totalPoints,
            totalPointsAvailable: totalPointsAv,
            loading: false,
          };
        });
      })
      .catch((e) => alert(e.message));
  }, [stateForReRenderOnGradeSubmit]);

  console.log({state,pointsEarned})
  // useEffect 2
  // if statement prevents running until all data is fetched and set
  // it calulates the current and next earned items
  // and sets them to state at the same time
  React.useEffect(() => {
    if (state.loading) return;

    //is the object destructuring
    const { earnableItems, totalPointsAvailable, totalPointsEarnedByWrestler } =
      state;

    const currentItemEarned = calcCurrentItem({
      earnableItems,
      totalPointsAvailable,
      totalPointsEarnedByWrestler,
    });
    const nextItemToBeEarned = calcNextItem({
      earnableItems,
      totalPointsAvailable,
      totalPointsEarnedByWrestler,
    });

    setState((prev: any) => ({
      ...prev,
      currentItemEarned,
      nextItemToBeEarned,
    }));
  }, [state.loading, stateForReRenderOnGradeSubmit]); // <- ensures this only re-runs on that boolean toggling and never again or if grade is submitted

  React.useEffect(() => {
    if (state.loading) return;

    const { earnableItems, totalPointsAvailable, totalPointsEarnedByWrestler } =
      state;

    const currentItemEarned = calcCurrentItem({
      earnableItems,
      totalPointsAvailable,
      totalPointsEarnedByWrestler,
    });

    if (unearnedItems.length == 0) {
      const onlyUnearnedItemsArray: EarnableItems[] = [];

      let isTrue = false;
      for (let index = 0; index < earnableItems.length; index++) {
        const currentItem = earnableItems[index];

        if (isTrue) {
          onlyUnearnedItemsArray.push(currentItem);
        }

        if (
          currentItem.percentage_of_total_points_needed ==
          userShirt.percentage_of_total_points_needed
        ) {
          isTrue = true;
        }
      }

      setUnearnedItems(onlyUnearnedItemsArray);
    } else {
      let array = unearnedItems.some((item) => item == currentItemEarned);

      if (array) {
        alert("you earned a new item");
      }
    }

    //
  }, [pointsEarned]);
  // we switched the order of what we test here

  const returnsEarnableItemsOrNothingIfNoItemsToEarnFunc: any = (
    earningItemsForFunc: Array<EarnableItems>
  ) => {
    if (!earningItemsForFunc.length) {
      return <h3>No Items to earn</h3>;
    } else {
      return (
        <ListGroup className="my-3">
          {earningItemsForFunc.map((item) => (
            <>
              {/* {`${state.nextItemToBeEarned}` ===
                `${item.item_color} ${item.item_name}` && (
                <ListGroup.Item>
                  <small className="text-muted">next item</small>{" "}
                  <span className="fst-italic text-dark">
                    {state.nextItemToBeEarned}
                  </span>
                </ListGroup.Item>
              )} */}

              <ListGroup.Item
                style={{
                  border: `${
                    state.currentItemEarned.item_color +
                      " " +
                      state.currentItemEarned.item_name ===
                    `${item.item_color} ${item.item_name}`
                      ? "solid black 3px"
                      : null
                  }`,
                }}
                key={`key-${item.id}-${props.UID}`}
                className="py-3 d-flex justify-content-between align-items-center"
              >
                <span>
                  {`${state.nextItemToBeEarned}` ===
                    `${item.item_color} ${item.item_name}` && (
                    <>
                      <small>
                        <strong>
                          Only{" "}
                          {Math.ceil(
                            (item.percentage_of_total_points_needed *
                              state.totalPointsAvailable) /
                              100 -
                              state.totalPointsEarnedByWrestler
                          )}{" "}
                          more stars until you earn your:
                        </strong>
                      </small>
                      <br />
                    </>
                  )}
                  {state.currentItemEarned.item_color +
                    " " +
                    state.currentItemEarned.item_name ===
                    `${item.item_color} ${item.item_name}` && (
                    <>
                      {" "}
                      <small>
                        <strong>*Current item</strong>
                      </small>{" "}
                      <br />
                    </>
                  )}
                  {item.item_color} {item.item_name}
                </span>
                <span>
                  {Math.ceil(
                    (item.percentage_of_total_points_needed *
                      state.totalPointsAvailable) /
                      100
                  )}{" "}
                  <small className="text-muted">stars required</small>
                </span>
              </ListGroup.Item>
            </>
          ))}
        </ListGroup>
      );
    }
  };

  return (
    <>
      <Card>
        <Card.Header className="flex-column d-flex justify-content-center align-items-center">
          <span className="fw-bolder fs-5">
            {state.personalInfo.first_name} {state.personalInfo.last_name}
          </span>
          <small className="text-muted">Wrestler Dashboard</small>
        </Card.Header>
        <Card.Body>
          <Card.Title className="fw-light">Earnable Items</Card.Title>

          {returnsEarnableItemsOrNothingIfNoItemsToEarnFunc(
            state.earnableItems
          )}

          <Card.Text>
            {state.personalInfo.first_name} has earned{" "}
            <strong>{state.totalPointsEarnedByWrestler}</strong> of{" "}
            <strong>{state.totalPointsAvailable}</strong> total available stars.
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}
