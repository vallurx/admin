const errorLookupTable = {
    EMAIL_NOT_FOUND: 'We didn\'t recognize your email. If your email is correct, request an invite to VallurX from your manager.',
    INVALID_PASSWORD: 'Your password is incorrect.'
};

export type ErrorTypes = keyof typeof errorLookupTable;

export const getError = (error: ErrorTypes) => {
    return errorLookupTable[error];
}