import { Query } from ".";

// GET
const getAllItemTypes = async () => {
  return Query(`
    select * from item_types order by item_type
    `);
};

const selectSingleItemType = async (itemTypeId: number) => {
  return Query(
    `
  select * from item_types where id=?
  `,
    [itemTypeId]
  );
};

// POST
const addNewItemType = async (
  itemType: string,
  itemTypeDesription: string,
  willExpire: number,
  trackAmountUsed: number,
  allowRecurringPaymentContract: number,
  isAPrivateLesson: number | null,
  isAPractice: number | null,
  isUnlimited: number
) => {
  return Query(
    `
    insert into item_types (item_type, item_type_description, 
      will_expire, keep_track_of_amount_used, 
      allow_recurring_payment_contract, is_a_private_lesson, is_a_practice,
      is_unlimited)
    values(?, ?, ?, ?, ?, ?, ?, ?);
    `,
    [
      itemType,
      itemTypeDesription,
      willExpire,
      trackAmountUsed,
      allowRecurringPaymentContract,
      isAPrivateLesson,
      isAPractice,
      isUnlimited,
    ]
  );
};

// PUT
const updateItemType = async (
  itemTypeNewName: string,
  itemTypeDescription: string,
  willExpire: number,
  keepTrackOfAmountUsed: number,
  allowRecurringPaymentContract: number,
  editIsAPrivateLesson: number,
  editIsAPractice: number,
  editIsUnlimited: number,
  itemTypeId: number
) => {
  return Query(
    `
    update item_types
        set item_type =?, 
        item_type_description=?, 
        will_expire=?, 
        keep_track_of_amount_used=?,
        allow_recurring_payment_contract=?,
        is_a_private_lesson=?,
        is_a_practice=?,
        is_unlimited=?
    where id=?;
`,
    [
      itemTypeNewName,
      itemTypeDescription,
      willExpire,
      keepTrackOfAmountUsed,
      allowRecurringPaymentContract,
      editIsAPrivateLesson,
      editIsAPractice,
      editIsUnlimited,
      itemTypeId,
    ]
  );
};

// DELETE
const deleteItemType = async (itemTypeId: number) => {
  return Query(
    `
    delete
        from item_types
        where id=?;
    `,
    [itemTypeId]
  );
};

export default {
  // GET
  getAllItemTypes,
  selectSingleItemType,
  //   POST
  addNewItemType,
  //   PUT
  updateItemType,
  //   DELETE
  deleteItemType,
};
