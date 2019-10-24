// Copyright (c) 2019 gusprado
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Sequelize from 'sequelize';
import User from '../app/models/User';
import Student from '../app/models/Student';
import databaseConfig from '../config/database';

const models = [User, Student];

class Database {
    constructor() {
        this.init();
    }

    // abre a conexão
    init() {
        this.connection = new Sequelize(databaseConfig);

        models.map(model => model.init(this.connection));
    }
}

export default new Database();
