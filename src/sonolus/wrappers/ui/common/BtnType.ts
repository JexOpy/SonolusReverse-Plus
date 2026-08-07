export const BtnType = {
    Normal: 0,
    Success: 1,
    Warning: 2,
    Transparent: 3,
    Silent: 4
} as const;

/** `Sonolus.UI.Common.BtnType` */
export type BtnType = (typeof BtnType)[keyof typeof BtnType];
