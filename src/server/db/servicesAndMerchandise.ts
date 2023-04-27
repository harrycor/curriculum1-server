import { Query } from "./index";
import { IPerson } from "../../types";

// GET
const getAllServicesAndMerchandise = async (tenantId: number) => {
  return Query(
    `
  select sam.*,
       du.unit,
       it.item_type as item_type_name
from services_and_merchandise sam
         join item_types it on sam.item_type_id = it.id
         left join date_units du on sam.date_units_id_for_expiration = du.id
where sam.tenant_id = ?
  and sam.is_active = 1
order by sam.item_type_id, sam.name_of_item;
  `,
    [tenantId]
  );
};

const getSingleServiceOrMerchandiseById = async (
  serviceOrMerchandiseId: number
) => {
  return Query(
    `
  select * from services_and_merchandise where id=?;
  `,
    [serviceOrMerchandiseId]
  );
};

const getSingleServiceOrMerchandiseWithItemTypeInfoById = async (
  serviceOrMerchandiseId: number
) => {
  return Query(
    `
      select sam.*,
      it.item_type,
      it.allow_active_duration,
      it.keep_track_of_amount_used,
      it.is_a_practice,
      is_unlimited
    from services_and_merchandise sam
      join item_types it on sam.item_type_id = it.id
    where sam.id=?;
  `,
    [serviceOrMerchandiseId]
  );
};

// const getSingleServiceOrMerchandiseWithDateUniById = async (
//   serviceOrMerchandiseId: number
// ) => {
//   return Query(
//     `
// select s.*,
//       it.*
//        du.unit
// from services_and_merchandise s
//          join item_types it on s.item_type_id = it.id
//          left join date_units du on s.date_units_id_for_expiration = du.id
//          where s.id=?;
// `,
//     [serviceOrMerchandiseId]
//   );
// };

const getAllServicesOrMerchandiseFromArrayOfIds = async (values: any) => {
  return Query(
    `
    select sam.*,
    it.keep_track_of_amount_used,
    it.is_a_private_lesson,
    it.is_a_practice,
    is_unlimited
from services_and_merchandise sam
      join item_types it on sam.item_type_id = it.id
where sam.id in (?);
  `,
    [values]
  );
};

const getAllServicesAndMerchandiseWithRecurringPaymentContractFromIds = async (
  value: any
) => {
  return Query(
    `
  select *
  from services_and_merchandise
  where has_recurring_payment_contract = 1
  and id in (?);
  `,
    [value]
  );
};

// POST
const addNewServiceOrMerchandise = async (
  itemName: string,
  itemCost: number,
  itemTypeId: string,
  numberOfItemsIncluded: number,
  addedByUserId: number,
  tenantId: number,
  dateUnitsIdForExpiration: number | null,
  numberOfDateUnitsForExpiration: number | null,
  itemHasRecurringPaymentContract: number | null
) => {
  return Query(
    `
  insert into services_and_merchandise (name_of_item, cost_of_item, item_type_id, 
    number_of_items_included, added_by_user_id, 
    tenant_id, date_units_id_for_expiration, 
    number_of_date_units_for_expiration,
    has_recurring_payment_contract)
  values (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      itemName,
      itemCost,
      itemTypeId,
      numberOfItemsIncluded,
      addedByUserId,
      tenantId,
      dateUnitsIdForExpiration,
      numberOfDateUnitsForExpiration,
      itemHasRecurringPaymentContract,
    ]
  );
};

// PUT
const updateServiceOrMerchandise = async (
  serviceOrMerchandiseId: number,
  nameOfItem: string,
  costOfItem: number,
  ItemTypeId: number,
  numberOfItemsIncluded: number,
  dateUnitsIdForExpiration: number | null,
  numberOfDateUnitsForExpiration: number | null,
  itemHasRecurringPaymentContract: number | null
) => {
  return Query(
    `
    update services_and_merchandise
    set name_of_item=?,
        cost_of_item=?,
        item_type_id=?,
        number_of_items_included=?,
        date_units_id_for_expiration=?,
        number_of_date_units_for_expiration=?,
        has_recurring_payment_contract=?
    where id = ?
      `,
    [
      nameOfItem,
      costOfItem,
      ItemTypeId,
      numberOfItemsIncluded,
      dateUnitsIdForExpiration,
      numberOfDateUnitsForExpiration,
      itemHasRecurringPaymentContract,
      serviceOrMerchandiseId,
    ]
  );
};

const deactivateServiceOrMerchandise = async (
  serviceOrMerchandiseId: number
) => {
  return Query(
    `
  update services_and_merchandise
  set is_active=0
  where id=?
  `,
    [serviceOrMerchandiseId]
  );
};

// DELETE
const deleteServiceOrMerchandiseById = async (
  serviceOrMerchandiseId: number
) => {
  return Query(
    `
  delete from services_and_merchandise where id = ?;
  `,
    [serviceOrMerchandiseId]
  );
};

export default {
  // GET
  getAllServicesAndMerchandise,
  getSingleServiceOrMerchandiseById,
  getSingleServiceOrMerchandiseWithItemTypeInfoById,
  // getSingleServiceOrMerchandiseWithDateUniById,
  getAllServicesOrMerchandiseFromArrayOfIds,
  getAllServicesAndMerchandiseWithRecurringPaymentContractFromIds,
  // POST
  addNewServiceOrMerchandise,
  // PUT
  updateServiceOrMerchandise,
  deactivateServiceOrMerchandise,
  // DELETE
  deleteServiceOrMerchandiseById,
};
