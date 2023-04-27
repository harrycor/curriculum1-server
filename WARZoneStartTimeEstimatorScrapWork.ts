/*Variable I didn't use/need, that I might want to use elsewhere:
finalizeTheStartTimesAt: Date, Should be setup as a chron job.
  numberOfMats: number,
  numberOfCompetitorsPerMat: number,
*/

let calculateStartTimes = (
  allRegisteredCompetitors: IWrestler[],
  startTimeOfWrestling: Date,
  endTimeOfWrestling: Date,
  durationCompetitorsWillBeElligibleForMatchesInMinutes: number,
  lowestWARsGoFirst: boolean,
  timeBetweenWeighInsAndWrestlingBeginningInMinutes: number
) => {
  //Competitors should submit their estimated weight for each event, it should not rely on old weigh-ins as they may have grown substantially. This requires a WAR calculation with their estimated weight, but it should not update their actual WAR.
  let calculateWARBasedOnEstimatedWeight = (
    estimatedWeight: number,
    Rating: number
  ): number => {
    //This should use the same adjustment formula we use for folkstyle wrestling and should have a central source of truth.
    let adjustment = 200 * (Math.log(estimatedWeight / 30) / Math.log(1.04));
    let estimatedWARBasedOnEstimatedWeight = Rating + adjustment;

    return estimatedWARBasedOnEstimatedWeight;
  };

  for (let x = 0; x < allRegisteredCompetitors.length; x++) {
    let estimatedWARBasedOnEstimatedWeight = calculateWARBasedOnEstimatedWeight(
      allRegisteredCompetitors[x].EstimatedWeight,
      allRegisteredCompetitors[x].Rating
    );
    allRegisteredCompetitors[x].estimatedWARBasedOnEstimatedWeight =
      estimatedWARBasedOnEstimatedWeight;
  }
  //   console.log({ allRegisteredCompetitors });

  let totalNumberOfWrestlers = allRegisteredCompetitors.length;
  let startTimeInMilliseconds = startTimeOfWrestling.getTime();
  let endTimeInMilliseconds = endTimeOfWrestling.getTime();
  let totalDurationOfEventInMilliseconds =
    endTimeInMilliseconds - startTimeInMilliseconds;
  let durationCompetitorsWillBeElligibleForMatchesInMilliseconds =
    durationCompetitorsWillBeElligibleForMatchesInMinutes * 60000;
  let durationOfWeighInsInMilliseconds =
    totalDurationOfEventInMilliseconds -
    durationCompetitorsWillBeElligibleForMatchesInMilliseconds;
  let timeBetweenWrestlersArrivingInMilliseconds =
    durationOfWeighInsInMilliseconds / totalNumberOfWrestlers;
  let timeBetweenWeighInsAndWrestlingBeginningInMilliseconds =
    timeBetweenWeighInsAndWrestlingBeginningInMinutes * 60000;

  // 1. Order all wrestlers by WAR
  allRegisteredCompetitors.sort((a, b) => {
    const a1 = a.estimatedWARBasedOnEstimatedWeight;
    const b1 = b.estimatedWARBasedOnEstimatedWeight;
    if (lowestWARsGoFirst) {
      return Number(a1) - Number(b1); //How do I properly do this with TS? I know the properties now exist, how do I tell the linter?
    } else {
      return Number(b1) - Number(a1); //How do I properly do this with TS? I know the properties now exist, how do I tell the linter?
    }
  });

  // 2. Calculate the arrival and completion times for each competitor, this is when they will be eligible to wrestle. We will no longer need to perform pool weight shifts via pool weight range.};
  for (let y = 0; y < allRegisteredCompetitors.length; y++) {
    const wrestler = allRegisteredCompetitors[y];

    let wrestlersStartTimeInMilliseconds =
      startTimeInMilliseconds + y * timeBetweenWrestlersArrivingInMilliseconds;
    let wrestlersEndTimeInMilliseconds =
      wrestlersStartTimeInMilliseconds +
      durationCompetitorsWillBeElligibleForMatchesInMilliseconds;
    let wrestlersWeighInTimeInMilliseconds =
      wrestlersStartTimeInMilliseconds -
      timeBetweenWeighInsAndWrestlingBeginningInMilliseconds;
    wrestler.startTime = new Date(wrestlersStartTimeInMilliseconds);
    wrestler.endTime = new Date(wrestlersEndTimeInMilliseconds);
    wrestler.weighInTime = new Date(wrestlersWeighInTimeInMilliseconds);
  }

  return allRegisteredCompetitors;
};

interface IWrestler {
  FirstName: string;
  LastName: string;
  EstimatedWeight: number;
  Rating: number;
  estimatedWARBasedOnEstimatedWeight?: number;
  weighInTime?: Date;
  startTime?: Date;
  endTime?: Date;
}

//for testing:

let fakeCompetitorList = [
  { FirstName: "j", LastName: "L`", EstimatedWeight: 100, Rating: 1200 },
  { FirstName: "h", LastName: "t", EstimatedWeight: 105, Rating: 1100 },
  { FirstName: "a", LastName: "be", EstimatedWeight: 102, Rating: 900 },
  { FirstName: "haa", LastName: "hl", EstimatedWeight: 99, Rating: 950 },
  { FirstName: "dij", LastName: "doo", EstimatedWeight: 110, Rating: 1500 },
  { FirstName: "top", LastName: "dawg", EstimatedWeight: 108, Rating: 2000 },
  {
    FirstName: "nope",
    LastName: "dope",
    EstimatedWeight: 99.3,
    Rating: 1003.5,
  },
];

//Parameters
let startTimeParam = new Date("1/2/23 07:00:00");
let endTimeParam = new Date("1/2/23 15:00:00");
let durationCompetitorsWillBeElligibleForMatchesInMinutes = 120;
let lowestWARsGoFirst = false;
let timeBetweenWeighInsAndWrestlingBeginning = 5;
let totalNumberOfWrestlers = 200;

calculateStartTimes(
  fakeCompetitorList,
  startTimeParam,
  endTimeParam,
  durationCompetitorsWillBeElligibleForMatchesInMinutes,
  lowestWARsGoFirst,
  timeBetweenWeighInsAndWrestlingBeginning
);
