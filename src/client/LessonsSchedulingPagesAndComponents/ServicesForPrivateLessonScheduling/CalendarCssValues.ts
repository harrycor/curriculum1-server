//weekday as number
let sunAsNum = 6;
let monAsNum = 0;
let tuesAsNum = 1;
let wedAsNum = 2;
let thursAsNum = 3;
let friAsNum = 4;
let satAsNum = 5;

// 18.5%
//width sould be %
let sundaySixWidth = 13.7; //14.4
let mondayZeroWdith = 16.3; //16.78
let tuesdayOneWidth = 19.4; //20.1
let wednesdayTwoWidth = 24.5; //25.1
let thursdayThreeWidth = 32.7; //33.5
let fridayFourWidth = 48.5; //50.2
let SaturdayFiveWidth = 104; //110

let weekDayForMoment = (weekdayAsANumberFromMoment: number) => {
  console.log(weekdayAsANumberFromMoment)
  if (weekdayAsANumberFromMoment == 1) return "monday";
  if (weekdayAsANumberFromMoment == 2) return "tuesday";
  if (weekdayAsANumberFromMoment == 3) return "wednesday";
  if (weekdayAsANumberFromMoment == 4) return "thursday";
  if (weekdayAsANumberFromMoment == 5) return "friday";
  if (weekdayAsANumberFromMoment == 6) return "saturday";
  if (weekdayAsANumberFromMoment == 7) return "sunday";
};

export {
  sunAsNum,
  monAsNum,
  tuesAsNum,
  wedAsNum,
  thursAsNum,
  friAsNum,
  satAsNum,
  sundaySixWidth,
  mondayZeroWdith,
  tuesdayOneWidth,
  wednesdayTwoWidth,
  thursdayThreeWidth,
  fridayFourWidth,
  SaturdayFiveWidth,
  weekDayForMoment,
};
