import React, { useEffect, useState } from "react";
import { IMove, IWrestler } from "../../../types";

export default function SelectMoveToGrade(props: IProps) {
  const [allMoves, setAllMoves] = useState<IMove[]>([]);
  const [showMoveList, setShowMoveList] = useState<boolean>(false);
  const [searchForMoveInput, setSearchForMoveInput] = useState<string>("");
  const [moveId, setMoveId] = useState<number>();
  const [selectedMoveName, setSelectedMoveName] = useState<string>();

  let token = localStorage.getItem("token");
  let UID = localStorage.getItem("UID");

  useEffect(() => {
    fetch(`/api/videos/${UID}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        console.log(result);
        setAllMoves(result);
      });
  }, []);

  let handleSearchMoveInputChange = (e: any) => {
    setSearchForMoveInput(e.target.value);
    setShowMoveList(true);
  };

  let handleMoveClicked = (moveId: number, MoveName: string) => {
    setSearchForMoveInput(MoveName);
    setMoveId(moveId);
    setSelectedMoveName(MoveName);
    setShowMoveList(false);

    for (let x = 0; x < allMoves.length; x++) {
      const move = allMoves[x];
      if (move.id == moveId) {
        props.setMoveSelectedToGrade(move);
      }
    }
  };

  let handleClearTextArea = () => {
    setSearchForMoveInput("");
  };

  return (
    <>
      <label>Select move: </label>
      <input
        type="text"
        onFocus={handleClearTextArea}
        onChange={handleSearchMoveInputChange}
        value={searchForMoveInput}
        placeholder="search moves"
      />
      {allMoves &&
        showMoveList === true &&
        allMoves.length > 0 &&
        searchForMoveInput.length > 0 && (
          <div
            className="d-flex justify-content-center"
            style={{ zIndex: "150" }}
          >
            <div
              className="col-md-6 col-10"
              style={{
                position: "absolute",
                backgroundColor: "#F0F0F0",
                zIndex: 100,
                opacity: "95%",
                maxHeight: "14rem",
                overflow: "scroll",
                borderRadius: ".3rem",
                border: "solid black 1px",
              }}
            >
              <>
                {allMoves
                  .filter(
                    ({ name_of_video }) =>
                      `${name_of_video}`
                        .toLowerCase()
                        .indexOf(searchForMoveInput?.toLowerCase()) > -1
                  )
                  .map((move) => {
                    return (
                      <div className="mt-3 mb-3" key={move.id}>
                        <div
                          onClick={() =>
                            handleMoveClicked(move.id, move.name_of_video)
                          }
                          style={{ cursor: "pointer" }}
                          className="col-12"
                        >
                          {move.name_of_video}
                        </div>{" "}
                      </div>
                    );
                  })}
              </>
            </div>
          </div>
        )}
      {/* <div>{moveId && selectedMoveName && <h1>Getting something</h1>}</div> */}
    </>
  );
}

interface IProps {
  setMoveSelectedToGrade: Function;
}
