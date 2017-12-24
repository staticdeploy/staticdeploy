export const configuration = {
    type: "object",
    patternProperties: {
        ".*": { type: "string" }
    },
    additionalProperties: false
};

export const appName = {
    type: "string",
    pattern: "^[a-zA-Z0-9-]+$",
    minLength: 1,
    maxLength: 255
};
