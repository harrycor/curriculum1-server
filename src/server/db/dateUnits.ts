import { Query } from ".";

const getAllDateUnits = async () => {
  return Query(`
    SELECT * from date_units;
    `);
};

const getSingleDateUnitById = async (dateUnitsId: number) => {
  return Query(
    `
    select * from date_units where id=?;
  `,
    [dateUnitsId]
  );
};

export default { getAllDateUnits, getSingleDateUnitById };
