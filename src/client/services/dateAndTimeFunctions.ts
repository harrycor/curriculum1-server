import moment from "moment";

const createMomentCurrentDateTime = (
  date: string = moment().format("YYYY-MM-DD HH:mm:ss")
) => {
  //   console.log(date);
  return moment(date).format();
};
const createMomentDateStartOfDayFromDateOnly = (
  date: string = moment().format("YYYY-MM-DD")
) => {
  //   console.log(date);
  return moment(date).startOf("day").format();
};
const createMomentDateEndOfDayFromDateOnly = (
  date: string = moment().format("YYYY-MM-DD")
) => {
  //   console.log(date);
  return moment(date).endOf("day").format();
};

export {
  createMomentCurrentDateTime,
  createMomentDateStartOfDayFromDateOnly,
  createMomentDateEndOfDayFromDateOnly,
};
