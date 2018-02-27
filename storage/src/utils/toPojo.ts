import Sequelize from "sequelize";

export default function toPojo(
    modelInstance: Sequelize.Instance<any> | null
): any {
    return modelInstance
        ? modelInstance.get({ plain: true, clone: true })
        : null;
}
