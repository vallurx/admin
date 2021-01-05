const errorLookupTable = {
    EMAIL_NOT_FOUND: 'We didn\'t recognize your email. If your email is correct, request an invite to VallurX from your manager.',
    INVALID_PASSWORD: 'Your password is incorrect.',
    INVALID_2FA_CODE: 'Your Two-Factor Authentication code is incorrect.',
    MALFORMED_DATE: 'Entered date was not of correct format: Month/Day/Year',
};

export type ErrorTypes = keyof typeof errorLookupTable;

export const getError = (error: ErrorTypes) => {
    return errorLookupTable[error];
}