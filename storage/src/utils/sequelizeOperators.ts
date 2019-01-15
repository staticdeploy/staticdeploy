import { Op } from "sequelize";

export const eq = <T>(value: T) => ({ [Op.eq]: value });

export const or = <T>(conditions: T[]) => ({ [Op.or]: conditions });

// It's not possible to call it in since it's a reserved keyword
export const valueIn = <T>(values: T[]) => ({ [Op.in]: values });
