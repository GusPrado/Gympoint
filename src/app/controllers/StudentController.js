// Copyright (c) 2019 gusprado
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string()
                .required()
                .min(3),
            email: Yup.string()
                .email()
                .required(),
            age: Yup.number().required(),
            height: Yup.number().required(),
            weight: Yup.number().required()
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation failed' });
        }

        const studentExists = await Student.findOne({
            where: { email: req.body.email }
        });

        if (studentExists) {
            return res.status(400).json({ error: 'Student already exists' });
        }
        const { id, name, email, age, height, weight } = await Student.create(
            req.body
        );
        return res.json({
            id,
            name,
            email,
            age,
            height,
            weight
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().min(3),
            email: Yup.string().email(),
            age: Yup.number()
                .integer()
                .min(1),
            height: Yup.number().min(2),
            weight: Yup.number().min(2)
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation failed' });
        }

        const { email } = req.body;
        const { id } = req.params;

        const student = await Student.findByPk(id);
        if (!student) {
            return res.status(400).json({ error: 'Student does not exist' });
        }

        if (email === student.email) {
            const { name, age, height, weight } = await student.update(
                req.body
            );
            return res.json({
                name,
                email,
                age,
                height,
                weight
            });
        }
        return res
            .status(400)
            .json({ error: 'Student and email does not match' });
    }
}

export default new StudentController();
