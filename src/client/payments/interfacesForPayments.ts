interface IServicesAndMerchandise {
  id: number;
  name_of_item: string;
  cost_of_item: number;
  item_type_id: number;
  item_type_name: string;
  number_of_items_included: number;
  added_by_user_id: number;
  tenant_id: number;
  date_units_id_for_expiration: number | null;
  number_of_date_units_for_expiration: number | null;
  has_recurring_payment_contract: number | null;
  is_active: number;
  unit?: "days" | "weeks" | "months" | "years";
  date_created: string;
  quantity?: number;
}

interface ICart extends IServicesAndMerchandise {
  quantity: number;
}

interface IItemTypes {
  id: number;
  item_type: string;
  item_type_description: string;
  will_expire: number;
  keep_track_of_amount_used: number;
  allow_recurring_payment_contract: number;
  is_a_private_lesson: number;
  is_a_practice: number;
  is_unlimited: number;
  date_created: string;
}

interface IDateUnits {
  id: number;
  unit: "days" | "weeks" | "months" | "years";
  date_created: Date;
}

interface ICoachsInfoWithPayoutPercentage {
  id: number;
  role: string;
  tenant: number;
  email: string;
  real_email?: null;
  first_name?: string;
  last_name?: string;
  is_active: number;
  payout_percentage_id: number | null;
  payout_percentage_of_private_lessons: number | null;
}

interface IUsersForTenant {
  id: number;
  email: string;
  real_email: string;
  role: string;
  tenant_id: number;
  first_name: string;
  last_name: string;
}

interface IPurchasesLessonsAndPracticesOnly {
  is_tracking_amount_used?: number;
  deactivation_date?: string;
  item_type: string;
  item_type_id: number;
  name_of_item: string;
  number_of_items_included: number;
  purchase_date: string;
  purchases_id: number;
  tenant_id: number;
  tenant_name: string;
}

interface IPrivateLessonPurchaseHistoryForWrestler {
  id: number;
  name_of_item: string;
  number_of_items_included: number;
  purchase_date: number;
  total_price_of_service_or_merchandise: number;
  numberOfItemsUsed?: number;
  dates_and_times_of_completed_lessons?: {
    dateOfLesson: string;
    timeOfLesson: string;
  }[];
}

interface ICheckInHistoryForWrestler {
  check_in_date_and_time: number;
  checked_in_by_email: string;
  checked_in_by_first_name: string;
  checked_in_by_last_name: string;
  coach_email: string;
  coach_first_name: string;
  coach_last_name: string;
  date_of_lesson: string;
  duration: number;
  lesson_start_time: string;
  lessons_used_id: number;
  price_paid_for_lesson: number;
  wrestler_email: string;
  wrestler_first_name: string;
  wrestler_last_name: string;
}

interface ICheckInHistoryForCoach extends ICheckInHistoryForWrestler {
  payout_percentage_of_private_lessons: number;
}

interface ITransaction {
  id: number;
  user_id: number;
  tenant_id: number;
  payments_id: number;
  purchases_id: number;
  item_type_id: number;
  is_a_private_lesson: number;
  keep_track_of_amount_used: number;
  deactivation_date: Date;
  wrestler_user_id: null | number;
  coach_user_id: null | number;
  checked_in_by_user_id: null | number;
  payout_percentage_id: null | number;
  private_lesson_bookings_id: null | number;
  price_paid_for_lesson: null | number;
  date_of_lesson: null | Date;
  time_of_lesson: null | string;
  check_in_date_and_time: null | Date;
  credit: number;
  debit: number;
  comments: string;
  date_created: Date;
  is_a_practice: number;
  is_unlimited: number;
}

interface ITransactionForPracticeCheckIn {
  id: number;
  user_id: number;
  tenant_id: number;
  payments_id: number;
  purchases_id: number;
  item_type_id: number;
  is_a_private_lesson: number;
  keep_track_of_amount_used: number;
  deactivation_date: Date;
  wrestler_user_id: null;
  coach_user_id: null;
  checked_in_by_user_id: number;
  payout_percentage_id: null;
  private_lesson_bookings_id: null;
  price_paid_for_lesson: null;
  date_of_lesson: null;
  time_of_lesson: null;
  check_in_date_and_time: Date;
  credit: number;
  debit: number;
  comments: null | string;
  date_created: Date;
  is_a_practice: number;
  is_unlimited: number;
  wrestler_first_name: string;
  wrestler_last_name: string;
  wrestlers_email: string;
  checked_in_by_first_name: string;
  checked_in_by_last_name: string;
  checked_in_by_email: string;
  checkInCanBeRemoved?: boolean;
}

interface ITransactionCheckInHistoryForCoach {
  check_in_date_and_time: Date;
  checked_in_by_email: string;
  checked_in_by_first_name: string;
  checked_in_by_last_name: string;
  coach_email: string;
  coach_first_name: string;
  coach_last_name: string;
  date_of_lesson: Date;
  duration: number;
  lesson_start_time: string;
  payout_percentage_of_private_lessons: number;
  price_paid_for_lesson: number;
  transaction_id: number;
  wrestler_email: string;
  wrestler_first_name: string;
  wrestler_last_name: string;
}

interface ITransactionCheckInHistoryForWrestler {
  lessons_used_id: number;
  price_paid_for_lesson: number;
  check_in_date_and_time: Date;
  coach_email: string;
  coach_first_name: string;
  coach_last_name: string;
  wrestler_email: string;
  wrestler_first_name: string;
  wrestler_last_name: string;
  checked_in_by_email: string;
  checked_in_by_first_name: string;
  checked_in_by_last_name: string;
  date_of_lesson: Date;
  lesson_start_time: string;
  duration: number;
}

interface ITransactionForPracticeCHeckIn {
  practice_used_id: number;
  check_in_date_and_time: Date;
  wrestler_email: string;
  wrestler_first_name: string;
  wrestler_last_name: string;
  checked_in_by_email: string;
  checked_in_by_first_name: string;
  checked_in_by_last_name: string;
}

interface ITransactionPrivateLesson {
  id: number;
  user_id: number;
  tenant_id: number;
  payments_id: number;
  purchases_id: number;
  item_type_id: number;
  is_a_private_lesson: number;
  keep_track_of_amount_used: number;
  deactivation_date: Date;
  wrestler_user_id: number;
  coach_user_id: number;
  checked_in_by_user_id: number;
  payout_percentage_id: number;
  private_lesson_bookings_id: number;
  price_paid_for_lesson: number;
  date_of_lesson: Date;
  time_of_lesson: string;
  check_in_date_and_time: Date;
  credit: number;
  debit: number;
  comments: string | null;
  number_of_lessons_remaining?: number;
  number_of_practices_remaining?: number;
  date_created: Date;
}

interface ITransactionWithInfo {
  id: number;
  user_id: number;
  tenant_id: number;
  payments_id: number;
  purchases_id: number;
  item_type_id: number;
  is_a_private_lesson: number;
  keep_track_of_amount_used: number;
  deactivation_date: Date | null;
  wrestler_user_id: null | number;
  coach_user_id: null | number;
  checked_in_by_user_id: null | number;
  payout_percentage_id: null | number;
  private_lesson_bookings_id: null | number;
  price_paid_for_lesson: null | number;
  date_of_lesson: null | Date;
  time_of_lesson: null | string;
  check_in_date_and_time: null | Date;
  credit: number;
  debit: number;
  comments: null;
  date_created: Date;
  is_a_practice: number;
  is_unlimited: number;
  admin_insert_by_user_id: number;
  number_of_items_remaining: number;
  name_of_item: string;
  number_of_items_included: number;
  purchase_date: Date;
  total_price_of_service_or_merchandise: number;
  charge_status: string;
  contract_start_date: Date | null;
  recurring_payment_contract_id: number | null;
  most_recent_payment_date: Date | null;
  next_payment_date: Date | null;
  recurring_payment_contract_active_status: number | null;
  purchase_made_by_first_name: string | null;
  purchase_made_by_last_name: string | null;
}

interface ITransactionWithPurchaseInfo extends ITransactionPrivateLesson {
  name_of_item: string;
  number_of_items_included: number;
  purchase_date: Date;
  total_price_of_service_or_merchandise: number;
  datesOfUsedPrivateLessons?: Date[];
  datesOfUsedPractices?: Date[];
  is_unlimited?: number;
}

interface IPaymentsAndPurchases {
  paymentsId: number;
  purchaseDate: Date | null;
  purchaseMadeByWrestlerName: string;
  purchaseMadeByUserId: number;
  allPurchasesMadeForThisPayment: ITransactionWithInfo[];
}

interface IPaymentsAndPurchasesForMultiUsers {
  purchaseMadeByWrestlerName: string;
  purchaseMadeByUserId: number;
  purchasesAndPaymentsMade: IPaymentsAndPurchases[];
}

export {
  IServicesAndMerchandise,
  ICart,
  IItemTypes,
  IDateUnits,
  ICoachsInfoWithPayoutPercentage,
  IUsersForTenant,
  IPurchasesLessonsAndPracticesOnly,
  IPrivateLessonPurchaseHistoryForWrestler,
  ICheckInHistoryForWrestler,
  ICheckInHistoryForCoach,
  ITransactionForPracticeCheckIn,
  ITransactionForPracticeCHeckIn,
  // ITransaction,
  ITransactionCheckInHistoryForCoach,
  ITransactionCheckInHistoryForWrestler,
  ITransactionPrivateLesson,
  ITransactionWithPurchaseInfo,
  ITransactionWithInfo,
  IPaymentsAndPurchases,
  IPaymentsAndPurchasesForMultiUsers,
};
