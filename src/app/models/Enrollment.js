import Sequelize, { Model } from 'sequelize';

class Enrollment extends Model {
    static init(sequelize) {
        super.init(
            {
                start_date: Sequelize.DATE,
                end_date: Sequelize.DATE,
                price: Sequelize.FLOAT
            },
            {
                sequelize
            }
        );

        return this;
    }

    static associate(models) {
        // more than one relationship the use of 'as'
        // for relationship nickname is imperative
        // being a nickname any name is acceptable
        this.belongsTo(models.Student, {
            foreignKey: 'student_id',
            as: 'student'
        });
        this.belongsTo(models.Plan, { foreignKey: 'plan_id', as: 'plan' });
    }
}

export default Enrollment;
