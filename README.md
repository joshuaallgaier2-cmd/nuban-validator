# nuban-validator

Validate Nigerian bank account numbers (NUBAN) using the check digit algorithm published by the Central Bank of Nigeria.

Use it to catch typos before you call a name enquiry API, so you don't pay for or wait on lookups that were never going to succeed.

- Supports banks (3-digit CBN codes) and other financial institutions such as microfinance banks (5-digit CBN codes)
- No dependencies
- Works in Node.js and the browser
- Written in TypeScript, with types included

## Install

```bash
npm install @kolapoimam/nuban
```

## Usage

```ts
import { isValidNuban, validateNuban } from "@kolapoimam/nuban";

isValidNuban("0000014579", "011"); // true
isValidNuban("0000014570", "011"); // false

validateNuban("0000014570", "011");
// { valid: false, reason: "CHECK_DIGIT_MISMATCH", expectedCheckDigit: 9 }
```

CommonJS works too:

```js
const { isValidNuban } = require("@kolapoimam/nuban");
```

## API

### `isValidNuban(accountNumber, bankCode)`

Returns `true` if the account number's check digit matches the bank code.

### `validateNuban(accountNumber, bankCode)`

Same check, but tells you why it failed. Returns one of:

```ts
{ valid: true, institutionCode: "000011" }
{ valid: false, reason: "INVALID_ACCOUNT_NUMBER" }
{ valid: false, reason: "INVALID_BANK_CODE" }
{ valid: false, reason: "CHECK_DIGIT_MISMATCH", expectedCheckDigit: 9 }
```

### `findMatchingBankCodes(accountNumber, bankCodes)`

Takes a list of bank codes and returns the ones the account number is valid for. You can use this to suggest a bank after a user types their account number.

```ts
findMatchingBankCodes("0000014579", ["011", "044", "058"]);
// ["011", "044"]
```

As the example shows, more than one bank can match. The check digit is a single digit, so roughly 1 in 10 banks will pass for any given number. Always confirm with a name enquiry.

### `computeCheckDigit(serial, bankCode)`

Returns the check digit for a 9-digit account serial. Throws a `TypeError` on bad input.

### `buildNuban(serial, bankCode)`

Returns the full 10-digit account number for a 9-digit serial. Handy for generating test data.

### `toInstitutionCode(bankCode)`

Converts a CBN bank code to the 6-digit form used in the calculation. Returns `null` if the code is not usable.

## Bank codes

Pass the **CBN code** for the institution:

| Institution type | CBN code | Example |
| --- | --- | --- |
| Commercial bank | 3 digits | `058` |
| Microfinance bank or other financial institution | 5 digits | `50547` |

These are not the same as NIP or NIBSS institution codes, which are usually 6 digits (for example `000013`). If you only have a NIP code, map it to the CBN code first.

This package does not ship a bank list yet. See [Contributing](#contributing) if you want to help add one.

## How the check works

From the CBN [Revised Standards on Nigeria Uniform Bank Account Number (NUBAN)](https://www.cbn.gov.ng/Out/2020/PSMD/REVISED%20STANDARDS%20ON%20NIGERIA%20UNIFORM%20BANK%20ACCOUNT%20NUMBER%20(NUBAN)%20FOR%20BANKS%20AND%20OTHER%20FINANCIAL%20INSTITUTIONS%20.pdf), March 2020.

1. Turn the bank code into 6 digits. Banks get three leading zeros (`011` becomes `000011`). Other financial institutions get a leading `9` (`50547` becomes `950547`).
2. Join it with the first 9 digits of the account number to get 15 digits.
3. Multiply each digit by `3, 7, 3, 3, 7, 3, 3, 7, 3, 3, 7, 3, 3, 7, 3` and add them up.
4. The check digit is `10 - (sum mod 10)`. If that gives 10, use 0.
5. The account number is valid if its last digit equals the check digit.

The test suite includes both worked examples from the CBN document.

## What this does not tell you

A valid check digit means the number is well formed for that bank. It does not mean the account exists, is active, or belongs to the person you expect. Use a name enquiry for that.

## Contributing

Contributions are welcome. Good places to start:

- A bank list with CBN codes and sources
- Ports to other languages (Python, Go, PHP, Dart)
- More test cases

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

[MIT](LICENSE) © Kolapo Imam
