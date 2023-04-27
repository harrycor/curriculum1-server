import React from "react";
import Moment from "react-moment";

export default function Previous5Logins(props: IProps) {
  const [allLoginsForWrestler, setAllLoginsForWrestler] = React.useState([]);
  React.useEffect(() => {
    fetch(`/api/successfulLogins/${props.userId}`)
      .then((res) => res.json())
      .then((results) => {
        setAllLoginsForWrestler(results);
      });
  }, []);

  return (
    <div
      className="card-text"
      style={{ color: "black", fontSize: "8px", lineHeight: "8px" }}
    >
      {allLoginsForWrestler.map((login: any, index) => {
        return (
          <div key={index}>
            <Moment fromNow>{login.login_was_created_at}</Moment> -{" "}
          </div>
        );
      })}
    </div>
  );
}

interface IProps {
  userId: number;
}
