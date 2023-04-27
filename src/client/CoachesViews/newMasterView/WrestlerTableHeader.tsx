import React from "react";
import { GradeInterface } from "./MasterView";

interface PropInterface {
  wrestler?: {
    id: number;
    show: boolean;
    grades: GradeInterface[];
  };
  arrayKey: number;
}

export default function WrestlerTableHeader({
  wrestler,
  arrayKey,
}: PropInterface) {
  if (!wrestler) {
    return null;
  }

  return (
    <React.Fragment key={`GradeTableHeader:${wrestler.id}`}>
      {arrayKey < 1 && (
        <>
          <th>
            <div>Level</div>
          </th>
          <th>
            <div>
              {" "}
              Name of Move
              {/*wrestler?.grades
          ? `${wrestler.grades[0].first_name} ${wrestler.grades[0].last_name}`
          : "No wrestler"*/}
            </div>
          </th>
          <th>
            <div>Video explanation</div>
          </th>
          <th>
            <div>Looped video</div>
          </th>
        </>
      )}
      <th>
        <div>Last graded</div>
      </th>
      <th>
        <div>{wrestler.grades[0].first_name}'s new grade</div>
      </th>
      <th>
        <div>{wrestler.grades[0].first_name}'s new notes</div>
      </th>
      <th>
        <div>Submit</div>
      </th>
    </React.Fragment>
  );
}
