// Copyright (c) 2019 gusprado
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as Yup from 'yup';
import User from '../models/User';

class UserController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string()
                .email()
                .required(),
            password: Yup.string()
                .required()
                .min(6)
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation failed' });
        }

        const userExists = await User.findOne({
            where: { email: req.body.email }
        });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const { id, name, email } = await User.create(req.body);
        return res.json({
            id,
            name,
            email
        });
    }

    async update(req, res) {
        // future use
        return res.json({ message: 'user update route' });
    }
}

export default new UserController();
