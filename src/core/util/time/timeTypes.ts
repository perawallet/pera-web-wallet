export type FormatDateUtilOptions = {
  format: string;
  timezone?: string | null;
  shouldShiftDateToCompensateForTimezone?: boolean;
  isProvidedDateInUTC?: boolean;
};
