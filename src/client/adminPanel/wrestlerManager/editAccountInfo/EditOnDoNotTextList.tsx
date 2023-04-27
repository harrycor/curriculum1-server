import * as React from "react";
import { useState, useEffect } from "react";

const EditOnDoNotTextList = (props: IProps) => {
  const [onDoNotTextList, setOnDoNotTextList] = useState<boolean>(
    props.onDoNotTextList === 1 ? true : false
  );

  useEffect(() => {
    if (onDoNotTextList === (props.onDoNotTextList === 1 ? true : false))
      return;
    console.log("hey");
    let token = localStorage.getItem("token");
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: props.userId,
        onDoNotTextList,
      }),
    };
    fetch("/api/users/updateOnDoNotTextList", requestOptions)
      .then((res) => res.json())
      .then((res) => {
        alert(res.message);
        props.renderFunc();
      })
      .catch((err) => console.log(err));
  }, [onDoNotTextList]);

  let handleInputChange = () => {
    setOnDoNotTextList(!onDoNotTextList);
  };

  return (
    <>
      <input
        onChange={handleInputChange}
        checked={onDoNotTextList}
        type="checkbox"
        name="do-not-text-list"
        id="do-not-text-list"
      />
    </>
  );
};

export default EditOnDoNotTextList;
interface IProps {
  userId: number;
  onDoNotTextList: number;
  renderFunc: Function;
}
