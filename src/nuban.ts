// Check digit algorithm from the CBN Revised NUBAN Standards (March 2020).
// See README for the full breakdown.

const WEIGHTS = [3, 7, 3, 3, 7, 3, 3, 7, 3, 3, 7, 3, 3, 7, 3];

const ACCOUNT_NUMBER = /^\d{10}$/;
const SERIAL = /^\d{9}$/;

export type InvalidReason =
  | "INVALID_ACCOUNT_NUMBER"
  | "INVALID_BANK_CODE"
  | "CHECK_DIGIT_MISMATCH";

export type ValidationResult =
  | { valid: true; institutionCode: string }
  | { valid: false; reason: InvalidReason; expectedCheckDigit?: number };

/**
 * Converts a CBN bank code to its 6-digit form.
 * 3 digits (banks) get three leading zeros, 5 digits (OFIs) get a leading 9.
 */
export function toInstitutionCode(bankCode: string): string | null {
  const code = bankCode.trim();

  if (/^\d{3}$/.test(code)) return `000${code}`;
  if (/^\d{5}$/.test(code)) return `9${code}`;
  if (/^(000\d{3}|9\d{5})$/.test(code)) return code;

  return null;
}

/**
 * Returns the check digit for a 9-digit account serial.
 * Throws a TypeError on bad input.
 */
export function computeCheckDigit(serial: string, bankCode: string): number {
  const institutionCode = toInstitutionCode(bankCode);

  if (institutionCode === null) {
    throw new TypeError(`Invalid bank code: "${bankCode}"`);
  }
  if (!SERIAL.test(serial)) {
    throw new TypeError(`Account serial must be 9 digits, got "${serial}"`);
  }

  return checkDigitFor(institutionCode + serial);
}

export function validateNuban(
  accountNumber: string,
  bankCode: string,
): ValidationResult {
  const account = accountNumber.trim();

  if (!ACCOUNT_NUMBER.test(account)) {
    return { valid: false, reason: "INVALID_ACCOUNT_NUMBER" };
  }

  const institutionCode = toInstitutionCode(bankCode);
  if (institutionCode === null) {
    return { valid: false, reason: "INVALID_BANK_CODE" };
  }

  const expected = checkDigitFor(institutionCode + account.slice(0, 9));
  if (expected !== Number(account[9])) {
    return {
      valid: false,
      reason: "CHECK_DIGIT_MISMATCH",
      expectedCheckDigit: expected,
    };
  }

  return { valid: true, institutionCode };
}

export function isValidNuban(accountNumber: string, bankCode: string): boolean {
  return validateNuban(accountNumber, bankCode).valid;
}

/**
 * Filters a list of bank codes down to the ones the account number passes for.
 * More than one bank will usually match, so confirm with a name enquiry.
 */
export function findMatchingBankCodes(
  accountNumber: string,
  bankCodes: readonly string[],
): string[] {
  return bankCodes.filter((code) => isValidNuban(accountNumber, code));
}

/** Appends the check digit to a 9-digit serial. Useful for test data. */
export function buildNuban(serial: string, bankCode: string): string {
  return serial + computeCheckDigit(serial, bankCode);
}

function checkDigitFor(digits: string): number {
  const sum = WEIGHTS.reduce(
    (total, weight, i) => total + Number(digits[i]) * weight,
    0,
  );
  return (10 - (sum % 10)) % 10;
}
