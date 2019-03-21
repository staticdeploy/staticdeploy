import Sequelize from "sequelize";

export default function toPojo(modelInstance: Sequelize.Model | null): any {
    return modelInstance
        ? modelInstance.get({ plain: true, clone: true })
        : null;
}
