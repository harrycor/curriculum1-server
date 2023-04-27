import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

interface propTypes {
  earnableItems: EarnableItemsInterface[];
  personalInfo: PersonalInfo;
  currentItemEarned: EarnableItemsInterface | null;
  nextItemToBeEarned: EarnableItemsInterface | undefined;
  totalPointsAvailable: number | undefined;
  totalPointsEarnedByWrestler: number | undefined;
  UID: number;
  toggleSowItemCard: () => void;
}

export default function ItemPanel({
  earnableItems,
  personalInfo,
  currentItemEarned,
  nextItemToBeEarned,
  totalPointsAvailable,
  totalPointsEarnedByWrestler,
  UID,
  toggleSowItemCard,
}: propTypes) {
  const returnsEarnableItemsOrNothingIfNoItemsToEarnFunc: any = (
    earningItemsForFunc: Array<EarnableItemsInterface>
  ) => {
    if (!earningItemsForFunc.length) {
      return <h3>No Items to earn</h3>;
    } else {
      return (
        <>
          <ListGroup className="my-3">
            {earningItemsForFunc.map((item, index: number) => (
              <React.Fragment key={`React Fragment for ItemPanel:${index}`}>
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
                      currentItemEarned?.id === item.id
                        ? "solid black 3px"
                        : null
                    }`,
                  }}
                  key={`key-${item.id}-${UID} aaaaaaaaaaaaa`}
                  className="py-3 d-flex justify-content-between align-items-center"
                >
                  <span>
                    {`${nextItemToBeEarned}` ===
                      `${item.item_color} ${item.item_name}` && (
                      <>
                        <small>
                          <strong>
                            Only{" "}
                            {Math.ceil(
                              (item.percentage_of_total_points_needed *
                                (totalPointsAvailable
                                  ? totalPointsAvailable
                                  : 0)) /
                                100 -
                                (totalPointsEarnedByWrestler
                                  ? totalPointsEarnedByWrestler
                                  : 0)
                            )}{" "}
                            more stars until you earn your:
                          </strong>
                        </small>
                        <br />
                      </>
                    )}
                    {currentItemEarned?.id === item.id && (
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
                        (totalPointsAvailable ? totalPointsAvailable : 0)) /
                        100
                    )}{" "}
                    <small className="text-muted">stars required</small>
                  </span>
                </ListGroup.Item>
              </React.Fragment>
            ))}
          </ListGroup>
        </>
      );
    }
  };

  return (
    <>
      <Card
        key={`${personalInfo.first_name} ${personalInfo.last_name} ${UID} wwwwwwwwwww`}
        style={{ height: "85vh", position: "relative" }}
      >
        <Card.Header className="flex-column d-flex justify-content-center align-items-center">
          <span className="fw-bolder fs-5">
            {personalInfo.first_name} {personalInfo.last_name}{" "}
            <button
              style={{ all: "unset", cursor: "pointer", padding: "5px" }}
              name={`Card in Itempannel.tsx ${UID}`}
              onClick={toggleSowItemCard}
            >
              <AiOutlineClose color="red" />
            </button>
          </span>
          <small className="text-muted">Wrestler Dashboard</small>
        </Card.Header>
        <Card.Body>
          <Card.Title className="fw-light">Earnable Items</Card.Title>

          {returnsEarnableItemsOrNothingIfNoItemsToEarnFunc(earnableItems)}

          <Card.Text className="bg-light px-2">
            {personalInfo.first_name} has earned{" "}
            <strong>{totalPointsEarnedByWrestler}</strong> of{" "}
            <strong>{totalPointsAvailable}</strong> total available stars.
          </Card.Text>
        </Card.Body>
        <Card.Footer></Card.Footer>
      </Card>
      <hr />
    </>
  );
}

/* 
  The following interfaces are the various response structures
  fetched from the several endpoints.  Add properties as needed.
*/
interface EarnableItemsInterface {
  created_at: string;
  id: number;
  item_color: string;
  item_name: string;
  percentage_of_total_points_needed: number;
  tenant: number;
  user_id: number;
}

interface PersonalInfo {
  first_name?: string;
  last_name?: string;
}
