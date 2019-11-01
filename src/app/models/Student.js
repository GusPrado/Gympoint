// Copyright (c) 2019 gusprado
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Sequelize, { Model } from 'sequelize';

class Student extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                age: Sequelize.INTEGER,
                height: Sequelize.FLOAT,
                weight: Sequelize.FLOAT
            },
            {
                sequelize
            }
        );

        return this;
    }
}

export default Student;
