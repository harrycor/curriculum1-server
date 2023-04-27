// for table users

export interface IUser {
  id: number;
  email: string;
  password: string;
  role?: string;
  real_email?: string;
  phone_number?: string;
  war_zone_id?: number;
  date_created?: Date;
  tenant?: string;
  on_do_not_text_list: number;
  is_active: number;
}

export interface IAccount {
  id: number;
  email: string;
  real_email: string | null;
  role: string;
  tenant_id: number;
  phone_number: string | null;
  war_zone_id: number | null;
  is_active: number;
  on_do_not_text_list: number;
  first_name: string | null;
  last_name: string | null;
  notes: string | null;
  current_item_id: number | null;
}

// for table personal_info
export interface IPerson {
  id: number;
  first_name: string;
  last_name: string;
  notes: string;
  user_id: number;
  date_created: Date;
}

//for table grades
export interface IGrade {
  id: number;
  video_id: number;
  coach_user_id: number;
  student_user_id: number;
  grade: number;
  movement_notes: string;
  date_created: Date;
}

//for table videos
export interface IVideo {
  id: number;
  name_of_video: string;
  url_to_video: string;
  url_to_looped_video: string;
  number_for_ordering: number;
  curriculum_level: number;
  date_created: Date;
  maximum_grade: number;
  UID: number;
}

export interface IGradesForSingleWreslterOnSpecificLevel {
  id: number;
  name_of_video: string;
  url_to_video: string;
  curriculum_level: number;
  created_at: Date;
  url_to_looped_video: string;
  number_for_ordering: number;
  grade: number;
  movement_notes: string;
}

export interface mysqlResponse {
  affectedRows: number;
  insertId: number;
}

// lessons used
export interface ILessonsUsedInfo {
  id: number;
  wrestler_user_id: number;
  coach_user_id: number;
  checked_in_by_user_id: number;
  tenant_id: number;
  payout_percentage_id: number;
  private_lesson_bookings_id: number;
  purchase_id: number;
  price_paid_for_lesson: number;
  date_of_lesson: string;
  time_of_lesson: string;
  check_in_date_and_time: number;
  date_created: string;
}

export interface IServicesAndMerchandiseWithItemTypeInfo {
  id: number;
  name_of_item: string;
  cost_of_item: number;
  item_type_id: number;
  number_of_items_included: number;
  added_by_user_id: number;
  tenant_id: number;
  date_units_id_for_expiration: number | null;
  number_of_date_units_for_expiration: number | null;
  has_recurring_payment_contract: number | null;
  is_a_private_lesson: number;
  is_a_practice: number;
  is_unlimited: number;
  is_active: number;
  keep_track_of_amount_used: number;
  quantity?: number;
  date_created: string;
}

export interface IStripeCustomer {
  id: number;
  user_id: number;
  stripe_customer_id: string;
  stripe_payment_method_id_for_recurring_payments: string | null;
  date_created: Date;
}

export interface IPayment {
  id: number;
  user_id: number;
  stripe_event_id: string | null;
  stripe_payment_intents_id: string;
  connect_account_id: string;
  stripe_charge_id: string | null;
  charge_status: string;
  admin_insert_by_user_id: number | null;
  date_created: Date;
}

export interface IPurchase {
  id: number;
  user_id: number;
  tenant_id: number;
  name_of_item: string;
  item_type_id: number;
  number_of_items_included: number;
  total_price_of_service_or_merchandise: number;
  purchase_date: Date | null;
  payments_id: number;
  is_a_private_lesson: number;
  is_a_practice: number | null;
  is_unlimited: number;
  deactivation_date: Date | null;
  date_created: Date;
  date_units_id_for_expiration: number | null;
  number_of_date_units_for_expiration: number | null;
  keep_track_of_amount_used: number;
  recurring_payment_contracts_id: number | null;
}

export interface IPurchaseWithUnit extends IPurchase {
  unit: "days" | "weeks" | "months" | "years";
}

export interface IRecurringPaymentContract {
  id: number;
  user_id: number;
  tenant_id: number;
  name_of_item: string;
  item_type_id: number;
  number_of_items_included: number;
  total_price_of_service_or_merchandise: number;
  is_a_private_lesson: number;
  date_units_id_for_expiration: number;
  number_of_date_units_for_expiration: number;
  keep_track_of_amount_used: number;
  contract_start_date: Date | null;
  most_recent_payment_date: Date | null;
  next_payment_date: Date | null;
  is_active: number;
  is_unlimited: number;
  is_a_practice: number | null;
  date_created: Date;
  admin_insert_by_user_id: number | null;
}

export interface IRecurringPaymentContractWithUnit
  extends IRecurringPaymentContract {
  unit: "days" | "weeks" | "months" | "years";
}

export interface IWrestler {
  id: number;
  email: string;
  password: string;
  role: string;
  real_email: string;
  tenant: number;
  created_at: Date;
  is_active: number;
  first_name: string;
  last_name: string;
  notes: string;
  user_id: number;
  phone_number: string;
}

export interface IMove {
  id: number;
  tenant: number;
  name_of_video: string;
  url_to_video: string;
  curriculum_level: number;
  created_at: Date;
  url_to_looped_video: string;
  number_for_ordering: number;
  maximum_grade: number;
}

export interface IGradeWithWrestlerInfo {
  id?: number;
  video_id?: number;
  coach_user_id?: number | null;
  student_user_id: number;
  grade?: number;
  created_at?: Date;
  movement_notes?: string;
  first_name: string;
  last_name: string;
  notes?: string;
  maximum_grade?: number;
}

export interface IActiveRecurringPaymentContractsWithUnit {
  id: number;
  user_id: number;
  first_name: string | null;
  last_name: string | null;
  tenant_id: number;
  name_of_item: string;
  item_type_id: number;
  number_of_items_included: number;
  total_price_of_service_or_merchandise: number;
  is_a_private_lesson: number;
  date_units_id_for_expiration: number;
  number_of_date_units_for_expiration: number;
  keep_track_of_amount_used: number;
  contract_start_date: Date;
  most_recent_payment_date: Date;
  next_payment_date: Date;
  recurring_payment_processing: number;
  is_active: number;
  date_created: Date;
  is_a_practice: number;
  is_unlimited: number;
  unit: "days" | "weeks" | "months" | "years";
}

export interface ITransaction {
  id: number;
  user_id: number;
  tenant_id: number;
  payments_id: number;
  purchases_id: number;
  item_type_id: number;
  is_a_private_lesson: number;
  is_unlimited: number;
  is_a_practice: number;
  keep_track_of_amount_used: number;
  deactivation_date: Date | null;
  wrestler_user_id: number | null;
  coach_user_id: number | null;
  checked_in_by_user_id: number | null;
  payout_percentage_id: number | null;
  private_lesson_bookings_id: number | null;
  price_paid_for_lesson: number | null;
  date_of_lesson: string | null;
  time_of_lesson: string | null;
  check_in_date_and_time: string;
  credit: number;
  debit: number;
  comments: string | null;
  date_created: Date;
  admin_insert_by_user_id: number;
}

export interface ICronJobLog {
  id: number;
  number_of_contracts_charged: number;
  date_and_time_of_cron_job: Date;
  date_created: Date;
}
