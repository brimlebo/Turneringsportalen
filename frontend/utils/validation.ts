// Regex patterns for name and location validation
// This will match:
// - Letters (a-z, A-Z)
// - Numbers (0-9)
// - Single spaces (not at start or end, no consecutive spaces)
export const textInputRegex = /^[A-Za-z0-9]+(?:\s[A-Za-z0-9]+)*$/;
export const numberInputRegex = /^[0-9]+$/;

export function validateInputString(
  input: string,
  minLength: number,
  maxLength: number,
  fieldName: string
): string | undefined {
  // Validate name format and length
  if (!textInputRegex.test(input)) {
    return `${fieldName} can only contain letters, numbers, and single spaces`;
  } else if (input.length < minLength || input.length > maxLength) {
    return `${fieldName} must be between 3 and 65 characters long`;
  }
}

export function validateNumbers(
  input: number,
  min: number,
  max: number,
  fieldName: string
): string | undefined {
  if (typeof input !== "number" || !numberInputRegex.test(input.toString())) {
    return `${fieldName} can only contain numbers`;
  }
  if (input < min || input > max) {
    return `${fieldName} must be between ${min} and ${max}`;
  }
}

export function validateStartDate(dateInput: string): string | undefined {
  if (!dateInput) {
    return "Start date is required";
  }

  const now = new Date();
  const [year, month, day] = dateInput.split("-").map(Number);
  const selectedDate = new Date(year, month - 1, day);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Calculate date 2 years from now
  const twoYearsFromNow = new Date();
  twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);

  if (selectedDate < today) {
    return "Start date must be today or in the future";
  } else if (selectedDate > twoYearsFromNow) {
    return "Start date must be within the next 2 years";
  }
}

export function validateStartTime(
  timeInput: string,
  dateInput: string
): string | undefined {
  if (!timeInput) {
    return "Start time is required";
  }

  const now = new Date();
  const [year, month, day] = dateInput.split("-").map(Number);
  const [hour, minute] = timeInput.split(":").map(Number);
  const selectedDateTime = new Date(year, month - 1, day, hour, minute);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (
    selectedDateTime.toDateString() === today.toDateString() &&
    selectedDateTime.getHours() * 60 + selectedDateTime.getMinutes() <=
      now.getHours() * 60 + now.getMinutes()
  ) {
    return "Start time must be later than current time for today";
  }
}
