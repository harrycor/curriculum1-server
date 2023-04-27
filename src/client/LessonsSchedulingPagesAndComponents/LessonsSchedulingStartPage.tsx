import * as React from "react";
import { useState, useEffect } from "react";
import NavigationBar from "../NavigationBar";
import CoachesPrivateLessonScheduleWeeklyCalendarHeader from "./SchedulingComponents/CalendarComponents/CoachesPrivateLessonScheduleWeeklyCalendarHeader";
import CoachAvailabilityForm from "./SchedulingComponents/CoachAvailabilityForm";
import ScheduleNewPrivateLessonForm from "./SchedulingComponents/ScheduleNewPrivateLessonForm";
import ViewAllCoachesSchedules from "./SchedulingComponents/ViewAllCoachesSchedules";
import PhoneNumberForm from "./SchedulingComponents/PhoneNumberForm";
import InstructionsForLessonScheduling from "./InstructionsForLessonScheduling";
import CalendarSelectView from "./SchedulingComponents/CalendarComponents/calendarDailyView/CalendarSelectView";
import CoachesDailyPrivateLessonScheduleHeader from "./SchedulingComponents/CalendarComponents/calendarDailyView/CoachesDailyPrivateLessonScheduleHeader";

const LessonsSchedulingStartPage = () => {
  let token = localStorage.getItem("token");
  const [isStripeAccountActive, setIsStripeAccountActive] = useState<boolean>();
  let [UID, setUID] = useState<number>();
  let [tenant, setTenant] = useState<string | undefined>();
  let [role, setRole] = useState<string>();
  let [showAvailabilityButton, setShowAvailabilityButton] =
    useState<boolean>(true);
  let [showscheduleLessonButton, setShowscheduleLessonButton] =
    useState<boolean>(true);
  let [showPhoneNumberFormButton, setShowPhoneNumberFormButton] =
    useState<boolean>(true);
  let [
    textForViewAllCoachesOrViewYourSched,
    setTextForViewAllCoachesOrViewYourSched,
  ] = useState<string>("All coaches");
  let [boolUsedToRenderFromStartPage, setBoolUsedToRenderFromStartPage] =
    useState<boolean>(true);
  let [
    showOrHideScheduleNewLessonComponent,
    setShowOrHideScheduleNewLessonComponent,
  ] = useState<boolean>(false);
  let [
    showOrHideCochesAvailabilityComponent,
    setShowOrHideCochesAvailabilityComponent,
  ] = useState<boolean>(false);
  let [showOrHideViewAllCoaches, setShowOrHideViewAllCoaches] =
    useState<boolean>(false);
  let [showOrHideCalendar, setShowOrHideCalendar] = useState<boolean>(true);
  let [showOrHidePhoneNumberForm, setShowOrHidePhoneNumberForm] =
    useState<boolean>(false);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [showDaily, setShowDaily] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    fetch(`/api/schedulingLessons/validateToketInputAvailability`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res) => {
        if (isMounted) {
          setUID(res.userId);
          setTenant(res.tenant);
          setRole(res.role);
          if (res.role === "wrestler") {
            setShowOrHideViewAllCoaches(true);
            setShowInstructions(true);
          }
        }
      });
    fetch("/api/stripeAccounts/getStripeAccountStatusForCalendar", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(
        (res: { isStripeAccountActive: boolean }) =>
          isMounted && setIsStripeAccountActive(res.isStripeAccountActive)
      );
    return () => {
      isMounted = false;
    };
  }, []);

  let showOrHideInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  let funcFromStartPageToChangeRenderBool = () => {
    setBoolUsedToRenderFromStartPage(!boolUsedToRenderFromStartPage);
  };

  let showCoachesAvailabilityFormFunc = () => {
    setShowOrHideCochesAvailabilityComponent(
      !showOrHideCochesAvailabilityComponent
    );
    setShowOrHideScheduleNewLessonComponent(false);
    setShowOrHideViewAllCoaches(false);
    setShowOrHideCalendar(true);
    setShowOrHidePhoneNumberForm(false);
  };

  let showScheduleNewLessonComponentFunc = () => {
    setShowOrHideScheduleNewLessonComponent(
      !showOrHideScheduleNewLessonComponent
    );
    setShowOrHideCochesAvailabilityComponent(false);
    setShowOrHideViewAllCoaches(false);
    setShowOrHideCalendar(true);
    setShowOrHidePhoneNumberForm(false);
  };

  let showPhoneNumberForm = () => {
    setShowOrHidePhoneNumberForm(!showOrHidePhoneNumberForm);
    setShowOrHideScheduleNewLessonComponent(false);
    setShowOrHideCochesAvailabilityComponent(false);
    setShowOrHideViewAllCoaches(false);
    setShowOrHideCalendar(true);
  };

  let showOrHideViewAllCoachesFunc = () => {
    if (!showOrHideViewAllCoaches) {
      setTextForViewAllCoachesOrViewYourSched("Your schedule");
      setShowOrHideViewAllCoaches(true);
      setShowOrHideScheduleNewLessonComponent(false);
      setShowOrHideCochesAvailabilityComponent(false);
      setShowOrHideCalendar(false);
      setShowOrHidePhoneNumberForm(false);
      setShowAvailabilityButton(false);
      setShowscheduleLessonButton(false);
      setShowPhoneNumberFormButton(false);
    } else {
      setTextForViewAllCoachesOrViewYourSched("All coaches");
      setShowOrHideViewAllCoaches(false);
      setShowOrHideScheduleNewLessonComponent(false);
      setShowOrHideCochesAvailabilityComponent(false);
      setShowOrHidePhoneNumberForm(false);
      setShowOrHideCalendar(true);
      setShowAvailabilityButton(true);
      setShowscheduleLessonButton(true);
      setShowPhoneNumberFormButton(true);
    }
  };

  let handleDailyViewClicked = () => {
    setShowDaily(!showDaily);
    setShowOrHideCochesAvailabilityComponent(false);
    setShowOrHideScheduleNewLessonComponent(false);
    setShowOrHideViewAllCoaches(!showOrHideViewAllCoaches);
    setShowOrHideCalendar(true);
    setShowOrHidePhoneNumberForm(false);
  };

  return (
    <div>
      {showInstructions && (
        <div style={{ zIndex: 5000, position:"absolute" }}>
          <InstructionsForLessonScheduling
            hideInstructions={showOrHideInstructions}
          />
        </div>
      )}
      <NavigationBar />
      <div className="m-3">
        <hr />
        <div className="d-flex justify-content-center text-center flex-wrap m-3">
          <h2 className="col-12 text-center">
            <u>Lesson scheduling</u>
          </h2>
          <span
            onClick={showOrHideInstructions}
            style={{ color: "blue", cursor: "pointer" }}
          >
            <u>How to use</u>
          </span>
        </div>
        {role !== "coach" && role !== "admin" && (
          <div className="d-flex justify-content-center col-12">
            <button
              onClick={handleDailyViewClicked}
              className="btn btn-sm btn-info"
            >
              {showDaily ? "Coaches" : "Daily view"}
            </button>
          </div>
        )}
        {role === "admin" || role === "coach" ? (
          <div className="mb-3">
            {showAvailabilityButton && (
              <button
                onClick={showCoachesAvailabilityFormFunc}
                className="btn btn-warning mr-2"
              >
                Edit Availability
              </button>
            )}
            {showscheduleLessonButton && (
              <button
                onClick={showScheduleNewLessonComponentFunc}
                className="btn btn-success mr-2"
              >
                Schedule lesson
              </button>
            )}
            {showPhoneNumberFormButton && (
              <button
                onClick={showPhoneNumberForm}
                className="btn btn-warning mr-2"
              >
                Edit phone number
              </button>
            )}
            <button
              onClick={showOrHideViewAllCoachesFunc}
              className="btn btn-success"
            >
              {textForViewAllCoachesOrViewYourSched}
            </button>
          </div>
        ) : null}

        <div>
          {showOrHideViewAllCoaches &&
            !showDaily &&
            isStripeAccountActive !== undefined && (
              <ViewAllCoachesSchedules
                tenant={tenant}
                role={role}
                isStripeAccountActive={isStripeAccountActive}
              />
            )}
          {showDaily && !showOrHideViewAllCoaches && (
            <CoachesDailyPrivateLessonScheduleHeader
              isAdminBoolFromHeader={false}
              role={role}
              coachesId={undefined}
            />
          )}

          {showOrHideCochesAvailabilityComponent && (
            <CoachAvailabilityForm
              funcFromStartPageToRenderComp={
                funcFromStartPageToChangeRenderBool
              }
            />
          )}
          {showOrHideScheduleNewLessonComponent && (
            <ScheduleNewPrivateLessonForm
              funcFromStartPageToRenderComp={
                funcFromStartPageToChangeRenderBool
              }
            />
          )}
          {showOrHidePhoneNumberForm && <PhoneNumberForm userId={UID} />}
          <div>
            {role === "admin" || role === "coach"
              ? showOrHideCalendar &&
                isStripeAccountActive !== undefined && (
                  <CalendarSelectView
                    coachesId={UID}
                    boolForRenderFromStartPage={boolUsedToRenderFromStartPage}
                    isAdminBool={role === "admin" ? true : false}
                    isStripeAccountActive={isStripeAccountActive}
                    role={role}
                  />
                )
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonsSchedulingStartPage;
