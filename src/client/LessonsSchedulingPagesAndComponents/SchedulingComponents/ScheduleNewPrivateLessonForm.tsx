import * as React from "react";
import { useState, useEffect } from "react";
import * as scheduleLessonFunctions from "../ServicesForPrivateLessonScheduling/privateLessonScheduleFuncs";
import * as dateTimeValues from "../ServicesForPrivateLessonScheduling/dateTimeValues";
import Select from "react-select";

const ScheduleNewPrivateLessonForm = (props: IProps) => {
  let hourArray: number[] = dateTimeValues.hourArrayValues;
  let minuteArray: Array<number | string> = dateTimeValues.minuteArrayValues;
  let token = localStorage.getItem("token");
  let [personal_info, setPersonalInfo] = useState<Array<any>>([]);
  let [coaches_UID, setCoaches_UID] = useState<number>(); // not inputed
  let [wrestlerId, setWrestlerId] = useState<number>();
  let [lessonStartDate, setLessonStartDate] = useState<string>();
  let [lessonStartTime, setLessonStartTime] = useState<string>();
  let [durationHours, setDurationHours] = useState<number | string>(1);
  let [durationMinutes, setDurationMinutes] = useState<number | string>("00");
  let [seriesEndDate, setSeriesEndDate] = useState<string>();
  let [notes, setNotes] = useState<string | null>(null);

  //gets all of the user_profiles for proper tenant - this gets everyone, wrestlers, coaches and admin, not my code just copied and pasted
  useEffect(() => {
    console.log("1");
    if (props.coachId) {
      setCoaches_UID(props.coachId);
      console.log("2");
    } else {
      console.log("3");
      fetch(`/api/schedulingLessons/validateToketInputAvailability`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((res) => {
          setCoaches_UID(res.userId);
        });
    }
  }, [props.coachId]);

  useEffect(() => {
    let isMounted = true;
    if (!coaches_UID) return;
    fetch(`/api/personal_info/${coaches_UID}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((results) => {
        isMounted && setPersonalInfo(results);
      });
    return () => {
      isMounted = false;
    };
  }, [coaches_UID]);

  let handleSubmitLessonPlan = (e: any) => {
    e.preventDefault();
    let submitResultResult = scheduleLessonFunctions.submitPrivateLessonFunc(
      coaches_UID,
      wrestlerId,
      lessonStartDate,
      lessonStartTime,
      durationHours,
      durationMinutes,
      seriesEndDate,
      notes,
      props.funcFromStartPageToRenderComp
    );
  };

  return (
    <div className=" d-flex justify-content-center">
      <div
        className=" col-md-8 col-12"
        style={{ border: "solid black 1px", borderRadius: ".3rem" }}
      >
        <div className="d-flex justify-content-center col-12">
          <div className="d-flex justify-content-center flex-wrap col-10">
            <h4 className="text-center mb-3">
              <u>
                <strong>Schedule a new lesson or series</strong>
              </u>
              <br />
            </h4>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <div className="d-flex flex-wrap justify-content-start ">
            <div className="col-12">
              <div className="mt-1 col-12">
                <span style={{ fontSize: ".8rem" }} className="col-12">
                  <strong>Select a wrestler:</strong>
                </span>{" "}
                <div className="col-12">
                  <Select
                    // defaultValue={selectedUserId}
                    options={personal_info}
                    getOptionLabel={(option) => {
                      return `${
                        option.first_name ? option.first_name : "N/A"
                      } ${option.last_name ? option.last_name : ""}`;
                    }}
                    getOptionValue={(option) => {
                      return `${option.user_id}`;
                    }}
                    onChange={(e: any) => setWrestlerId(e.user_id)}
                  />
                </div>
              </div>

              <div className="col-12 mt-3 mb-3">
                <span className="col-12" style={{ fontSize: ".8rem" }}>
                  <strong>Date:</strong>
                </span>{" "}
                <br />
                <div className="col-12">
                  <input
                    onChange={(e: any) => setLessonStartDate(e.target.value)}
                    type="date"
                    id="birthday"
                    name="birthday"
                  />
                </div>
              </div>

              <div className="col-12">
                <span className="col-12" style={{ fontSize: ".8rem" }}>
                  <strong>start time:</strong>
                </span>{" "}
                <br />
                <div className="col-12">
                  <input
                    onChange={(e: any) => setLessonStartTime(e.target.value)}
                    type="time"
                    id="appt"
                    name="appt"
                  />
                </div>
              </div>

              <div className="col-12 mt-3">
                <span className="col-12" style={{ fontSize: ".8rem" }}>
                  <strong>Duration:</strong>
                </span>{" "}
                <br />
                <div className="col-12">
                  <select
                    onChange={(e) => setDurationHours(e.target.value)}
                    defaultValue="1"
                  >
                    {hourArray.map((hour) => {
                      return (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      );
                    })}
                  </select>
                  <select
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    defaultValue="00"
                  >
                    {minuteArray.map((minute) => {
                      return (
                        <option key={minute} value={minute}>
                          {minute}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="col-12 mt-3 mb-3 ">
                <div className="col-12">
                  <span style={{ fontSize: ".8rem" }}>
                    <strong>series end date</strong> <small> (optional)</small>:
                    <br />
                    <small style={{ fontSize: "10px" }}>
                      select an end date if you would like lesson
                      <br />
                      to reccur weekly on the same day & time
                    </small>
                  </span>{" "}
                </div>
                <div className="col-12">
                  <input
                    onChange={(e: any) => setSeriesEndDate(e.target.value)}
                    type="date"
                    id="birthday"
                    name="birthday"
                  />
                </div>
              </div>

              <div className="col-12">
                <span style={{ fontSize: ".8rem" }} className=" col-12">
                  <strong>Notes</strong> (optional):
                </span>{" "}
                <br />
                <div className="col-12 w-100 d-flex flex-wrap col-sm-12 p-0">
                  <div className=" col-12">
                    <textarea
                      className="col-12"
                      placeholder="Notes"
                      // maxLength={15}
                      onChange={(e) => {
                        setNotes(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 mb-3 d-flex justify-content-center">
                <button
                  onClick={handleSubmitLessonPlan}
                  className="btn btn-success col-10"
                >
                  Submit Lesson
                </button>
              </div>
            </div>
          </div>
          {/* <hr style={{ height: "2px", backgroundColor: "black" }} /> */}
        </div>
      </div>
    </div>
  );
};

export default ScheduleNewPrivateLessonForm;

interface IProps {
  funcFromStartPageToRenderComp: Function;
  coachId?: number;
}
