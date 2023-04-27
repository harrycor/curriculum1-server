import React, { useState } from "react";

interface propsInterface {
  idsForText: { [key: number]: boolean };
  textUnwantedStateAndSetter: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ];
}

const SendText = ({
  idsForText,
  textUnwantedStateAndSetter,
}: propsInterface) => {
  const [text, setText] = useState<string>("");
  const [textUnWanted, setTextUnWanted] = textUnwantedStateAndSetter;

  const handleSendText = async () => {
    const token = localStorage.getItem("token");

    fetch("/api/textMessages/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        idsForText,
        text,
      }),
    })
      .then((res) => res.json())
      .then((res) => alert(res.message));
  };

  return (
    <div className="d-flex justify-content-around flex-wrap ">
      <textarea
        onChange={(e) => setText(e.currentTarget.value)}
        value={text}
        placeholder="write your message here"
      />
      <div>
        {" "}
        <label>Text wrestlers who don't want to be texted</label>
        <input
          type={"checkbox"}
          checked={textUnWanted}
          onChange={() => setTextUnWanted(!textUnWanted)}
        />
      </div>
      <button className="btn btn-primary" onClick={handleSendText}>
        Send Text!
      </button>
    </div>
  );
};

export default SendText;
