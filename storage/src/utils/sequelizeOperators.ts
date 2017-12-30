import { Op } from "sequelize";

export const eq = <T>(value: T) => ({ [Op.eq]: value });

export const or = <T>(conditions: T[]) => ({ [Op.or]: conditions });
