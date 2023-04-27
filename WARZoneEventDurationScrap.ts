//We can either calculate the number of mats required for X competitors in Y duration, or we can calculate the duration required for X competitors with Z mats. Therefore the host can opt to use as many mats as possible and get out as quickly as possible, or to stretch over a complete amount of time with the minimum required number of mats. They may want the second option due to a lack of referees, table help, or because getting additional mats isn't worth the hassle. Most people will want to wrap the event up as quickly as possible.

/*
Things we will need to know to setup an event:
- Does the host prefer to finish as quickly as possible, or to use as few mats as necessary?
- Start time of wrestling
- Maximum number of mats available
- Latest end time of wrestling allowed
- Desired number of matches per competitor
- Desired duration a competitor will stay at the event.
*/

let calculateEventDurationOrNumberOfMats = (
  numberOfCompetitors: number,
  speedOrMats: string,
  startTimeOfWrestling: Date,
  latestEndTimeOfWrestling: Date,
  maximumNumberOfMatsAvailable: number,
  desiredNumberOfMatchesPerCompetitor: number,
  desiredDurationOfCompetitorAtEventInHours: number,
  averageMatchLengthInMinutes: number
) => {
  // if (numberOfCompetitors < 20) {
  //   console.log(
  //     "not enough competitors to calculate event duration / number of mats required"
  //   );
  //   return;
  // }

  let numberOfMatchesPerMatPerHour = 60 / averageMatchLengthInMinutes;
  let numberOfCompetitorsPerMat =
    numberOfMatchesPerMatPerHour /
    (desiredNumberOfMatchesPerCompetitor /
      (2 * desiredDurationOfCompetitorAtEventInHours));

  console.log({ numberOfCompetitorsPerMat });

  //here we decide what we're solving for: Speed or minimum number of mats.
  if (speedOrMats === "speed") {
    let numberOfMatsToUse = maximumNumberOfMatsAvailable;
    let speedAtwhichMatsOpenInHours =
      desiredDurationOfCompetitorAtEventInHours / numberOfMatsToUse;
    let timeBetweenCompetitorsArrivingInHours =
      speedAtwhichMatsOpenInHours / numberOfCompetitorsPerMat;
    let timeBetweenCompetitorsArrivingInMilliseconds =
      timeBetweenCompetitorsArrivingInHours * 60 * 60 * 1000;

    let desiredDurationOfCompetitorAtEventInMilliseconds =
      desiredDurationOfCompetitorAtEventInHours * 60 * 60 * 1000;

    console.log({
      speedAtwhichMatsOpenInHours,
      timeBetweenCompetitorsArrivingInHours,
    });
    //solve for:
    let endTimeOfWrestling =
      startTimeOfWrestling.getTime() +
      (numberOfCompetitors - 1) * timeBetweenCompetitorsArrivingInMilliseconds +
      desiredDurationOfCompetitorAtEventInMilliseconds;
    console.log({ startTimeOfWrestling, endTimeOfWrestling });
    return new Date(endTimeOfWrestling);
  } else if (speedOrMats === "mats") {
    let endTimeOfWrestling = latestEndTimeOfWrestling;
    let durationOfEventInMilliseconds =
      endTimeOfWrestling.getTime() - startTimeOfWrestling.getTime();
    let durationOfEventInHours = durationOfEventInMilliseconds / 1000 / 60 / 60;
    let weighInDurationInHours =
      durationOfEventInHours - desiredDurationOfCompetitorAtEventInHours;
    let timeBetweenCompetitorsArrivingInHours =
      weighInDurationInHours / (numberOfCompetitors - 1);
    let maxCapacity =
      desiredDurationOfCompetitorAtEventInHours /
      timeBetweenCompetitorsArrivingInHours;

    console.log({
      maxCapacity,
      timeBetweenCompetitorsArrivingInHours,
      weighInDurationInHours,
      durationOfEventInHours,
    });

    //solve for:
    let numberOfMatsToUse = maxCapacity / numberOfCompetitorsPerMat;

    return numberOfMatsToUse;
  } else {
    console.log("speedOrMats Parameter not selected");
  }
};

//everything below this is for testing

let maximumNumberOfMatsAvailableParam = 4;
let maximumDurationOfEventInHoursParam = 8;
let desiredNumberOfMatchesPerCompetitorParam = 2.5;
let desiredDurationOfCompetitorAtEventInHoursParam = 1;
let numberOfCompetitorsParam = 400;
let speedOrMatsParam = "mats";
let averageMatchLengthInMinutesParam = 5;

console.log(
  calculateEventDurationOrNumberOfMats(
    numberOfCompetitorsParam,
    speedOrMatsParam,
    new Date("1/2/2023 09:00:00.000Z"),
    new Date("1/2/2023 17:00:00.000Z"),
    maximumNumberOfMatsAvailableParam,
    desiredNumberOfMatchesPerCompetitorParam,
    desiredDurationOfCompetitorAtEventInHoursParam,
    averageMatchLengthInMinutesParam
  )
);
