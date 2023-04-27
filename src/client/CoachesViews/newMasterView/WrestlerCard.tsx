import React, { useState, useEffect } from "react";
import { WrestlerInterface } from "./MasterView";
import { AiOutlineClose } from "react-icons/ai";
import ItemPanel from "./ItemPanel";
import SubmitNoteForWrestler from "../allGradesAllLevelsFor2Wrestlers/SubmitNoteForWrestler";
import NotesFromCoachesForWrestlers from "../../HomeAKAWrestlersView/coachingNotes/NotesFromCoachesForWrestlers";

interface propsInterface {
  wrestler: WrestlerInterface;
  deleteWrestlerById: (id: number) => void;
  showThisWrestler: (id: number) => void;
  wrestlerToDisplayGradesState: {
    [key: string]: boolean;
  };
  masterUser: boolean;
}

function WrestlerCard({
  wrestler,
  deleteWrestlerById,
  showThisWrestler,
  wrestlerToDisplayGradesState,
  masterUser,
}: propsInterface) {
  const token = localStorage.getItem("token");

  const idString = String(wrestler.user_id);
  const idBoolean = wrestlerToDisplayGradesState[idString];

  // I feel like these don't need to be in state
  const [earnableItemsState, setEarnableItemsState] = useState<
    EarnableItemsInterface[]
  >([]);

  const [nextItemToBeEarned, setNextItemToBeEarned] =
    useState<EarnableItemsInterface>();

  const [pointsTillNextItem, setPointsTillNextItem] = useState<number>(0);

  const [totalPointsAvailable, setTotalPointsAvailable] = useState<
    number | undefined
  >(undefined);

  const [totalPointsEarnedByWrestler, setTotalPointsEarnedByWrestler] =
    useState<number | undefined>(undefined);

  const [futureEarnableItems, setFutureEarnableItems] = useState<
    EarnableItemsInterface[]
  >([]);

  const [currentItemState, setCurrentItemState] = useState<
    EarnableItemsInterface | undefined
  >();

  const [personalInfo, setPersonalInfo] = useState<
    PersonalInfoInterface | Record<string, any>
  >({});

  const [showItemsCard, setShowItemsCard] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/earnableItems/${idString}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`/api/grades/allCurrentGradesForASingleWrestler/${idString}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`/api/videos/${idString}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`/api/personal_info/person/${idString}`, {
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
      //[EarnableItemsInterface[], WrestlerGradesInterface[] , VideoInterface[]]
      .then(async (array) => {
        // this will be switched to a fetch above in the promise.ALL

        //assigning fetch to variables
        let earnableItems: EarnableItemsInterface[] = array[0];
        setEarnableItemsState(earnableItems);

        let wrestlerGrades: WrestlerGradesInterface[] = array[1];

        let videos: VideoInterface[] = array[2];

        let personalInfoFetch: PersonalInfoInterface = array[3][0];
        setPersonalInfo(personalInfoFetch);

        // Logic to set currentItem variables to state
        let theCurrentItem: EarnableItemsInterface[] = earnableItems.filter(
          (item) => {
            return item.id == personalInfoFetch.current_item_id;
          }
        );
        setCurrentItemState(theCurrentItem[0]);

        // get total points earned
        const totalPoints = wrestlerGrades.reduce(
          (total: number, currentWrestler: AllCurrentGradesForWrestler) =>
            // @ts-ignore
            (total += currentWrestler.grade),
          0
        );
        setTotalPointsEarnedByWrestler(totalPoints);

        // get total points available
        const totalPointsAv = videos.reduce(
          (total: number, video: AllUserVideos) =>
            // @ts-ignore
            (total += video.maximum_grade),
          0
        );
        setTotalPointsAvailable(totalPointsAv);

        // we make it so that future earnableItems will only be updated once
        if (!futureEarnableItems.length) {
          // get an array of only items that the user can earn not past items
          const futureEarnableItemsArray: EarnableItemsInterface[] | undefined =
            earnableItems.filter((item: EarnableItemsInterface): boolean => {
              if (
                totalPoints >
                (item.percentage_of_total_points_needed / 100) * totalPointsAv
              ) {
                return false;
              } else {
                return true;
              }
            });
          setFutureEarnableItems(futureEarnableItemsArray);
        }

        // This is where we calculate the currentItem based on points
        // And determine if the user has earned a new item

        // we set this in the loop below

        for (let index = 0; index < earnableItems.length; index++) {
          const item = earnableItems[index];

          const itemsPoints =
            (item.percentage_of_total_points_needed / 100) * totalPointsAv;

          // totalPoints is points earned
          if (totalPoints < itemsPoints) {
            // this gets the item they are up to based on their points
            let currentItem = earnableItems[index - 1];

            let nextItem = earnableItems[index];
            const nextItemPoints =
              (nextItem.percentage_of_total_points_needed / 100) *
              totalPointsAv;

            const pointsTillNextItem = Math.round(nextItemPoints - totalPoints);

            setPointsTillNextItem(pointsTillNextItem);
            setNextItemToBeEarned(nextItem);

            // this returns true if any item in the future array equals the current Item
            const boolean =
              futureEarnableItems.some((item) => {
                return item.id == currentItem.id;
              }) && currentItem.id != currentItemState?.id;

            if (boolean) {
              const requestOptions = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  UID: wrestler.user_id,
                  itemId: currentItem.id,
                }),
              };

              await fetch(
                "/api/personal_info/updatecurrentitem",
                requestOptions
              ).then((res: any) => {
                res.status !== 200
                  ? alert(res.message)
                  : alert("Update successfully made");
              });

              alert(
                `Congradulations ${wrestler.first_name} ${wrestler.last_name} earned ${currentItem.item_color} ${currentItem.item_name}!`
              );

              setCurrentItemState(currentItem);
            }

            break;
          } else {
            continue;
          }
        }
      })
      .catch((e) => alert(e.message));
  }, [wrestlerToDisplayGradesState]);

  const toggleSowItemCard = () => {
    setShowItemsCard(!showItemsCard);
  };

  //HTML
  return (
    <>
      <div
        className="m-2 p-2"
        key={`WrestlerCardKey:${wrestler.id}`}
        style={{ backgroundColor: "ghostwhite" }}
      >
        <div>
          <small
            style={{ display: "inline", cursor: "pointer" }}
            onClick={() => {
              toggleSowItemCard();
            }}
          >
            {wrestler.first_name} {wrestler.last_name}
          </small>
          {masterUser ? (
            "🌟"
          ) : (
            <input
              name={`${wrestler.user_id}`}
              type={"checkbox"}
              onChange={(e) => {
                showThisWrestler(Number(e.currentTarget.name));
              }}
              checked={idBoolean}
            />
          )}
          <button
            style={{ all: "unset", cursor: "pointer", padding: "5px" }}
            name={`${wrestler.user_id}`}
            onClick={() => {
              deleteWrestlerById(Number(wrestler.user_id));
            }}
          >
            <AiOutlineClose color="red" />
          </button>
        </div>

        <div>
          {pointsTillNextItem} points till {nextItemToBeEarned?.item_color}{" "}
          {nextItemToBeEarned?.item_name}
        </div>
      </div>

      {showItemsCard && (
        <div
          className="wrestler-items-displayer-div"
          key={`containing div for item pannel:${wrestler.user_id}`}
        >
          <ItemPanel
            earnableItems={earnableItemsState}
            UID={wrestler.id}
            personalInfo={personalInfo}
            currentItemEarned={currentItemState ? currentItemState : null}
            nextItemToBeEarned={nextItemToBeEarned}
            totalPointsAvailable={totalPointsAvailable}
            totalPointsEarnedByWrestler={totalPointsEarnedByWrestler}
            toggleSowItemCard={toggleSowItemCard}
          />
          <SubmitNoteForWrestler
            showNote={true}
            wrestlerId={wrestler.user_id}
            wrestlerFullName={`${personalInfo.first_name} ${personalInfo.last_name}`}
            first_name={personalInfo.first_name}
            last_name={personalInfo.last_name}
          />
          <NotesFromCoachesForWrestlers UID={wrestler.user_id} />
        </div>
      )}
    </>
  );
}

export default WrestlerCard;

interface PersonalInfoInterface {
  id: number;
  first_name: string;
  last_name: string;
  notes: string;
  user_id: number;
  created_at: Date;
  phone_number: string;
  current_item_id: number;
}

interface EarnableItemsInterface {
  created_at: string;
  id: number;
  item_color: string;
  item_name: string;
  percentage_of_total_points_needed: number;
  tenant: number;
  user_id: number;
}

interface AllCurrentGradesForWrestler {
  id?: number;
  maximum_grade?: number;
  grade?: number;
}

interface AllUserVideos {
  id?: number;
  maximum_grade?: number;
}

interface WrestlerGradesInterface {
  id: number;
  tenant: number;
  name_of_video: string;
  url_to_video: string;
  curriculum_level: number;
  created_at: Date;
  url_to_looped_video: string;
  number_for_ordering: number;
  maximum_grade: number;
  grade?: any;
  movement_notes?: any;
  grade_created_at?: any;
  first_name: string;
  last_name: string;
}

interface VideoInterface {
  id: number;
  tenant: number;
  name_of_video: string;
  url_to_video: string;
  curriculum_level: number;
  created_at: Date;
  url_to_looped_video: string;
  number_for_ordering: number;
  maximum_grade: number;
}
