import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';
// import pt from 'date-fns/locale/pt';
import Enrollment from '../models/Enrollment';
import Plan from '../models/Plan';
import Student from '../models/Student';

import EnrollmentMail from '../jobs/EnrollmentMail';
import Queue from '../../lib/Queue';

class EnrollmentController {
    async index(req, res) {
        const enrollments = await Enrollment.findAll();
        return res.json(enrollments);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            student_id: Yup.number().required(),
            plan_id: Yup.number().required(),
            start_date: Yup.date().required()
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation failed!' });
        }

        const enrollmentExists = await Enrollment.findOne({
            where: { student_id: req.body.student_id }
        });

        if (enrollmentExists) {
            return res
                .status(400)
                .json({ error: 'Student is actually enrolled' });
        }

        const { student_id, plan_id, start_date } = req.body;
        const plan = await Plan.findByPk(plan_id, {
            attributes: ['duration', 'price', 'title']
        });

        if (!plan) {
            return res.status(400).json({ error: 'Choose a valid plan' });
        }

        const price = plan.duration * plan.price;

        const end_date = addMonths(
            parseISO(req.body.start_date),
            plan.duration
        );

        const student = await Student.findByPk(student_id, {
            attributes: ['name', 'email']
        });

        if (!student) {
            return res.status(400).json({ error: 'Choose a valid student' });
        }

        const enrollment = await Enrollment.create({
            start_date,
            student_id,
            plan_id,
            end_date,
            price
        });

        await Queue.add(EnrollmentMail.key, {
            student,
            enrollment,
            plan,
            end_date,
            price
        });

        return res.json(enrollment);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            plan_id: Yup.number(),
            start_date: Yup.date()
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation failed!' });
        }

        const enrollment = await Enrollment.findByPk(req.params.id);

        if (!enrollment) {
            return res.status(400).json({ error: 'Enrollment not found' });
        }

        const { plan_id, start_date } = req.body;
        const plan = await Plan.findByPk(plan_id);

        if (plan_id !== enrollment.plan_id && plan) {
            const price = plan.price * plan.duration;
            const end_date = addMonths(parseISO(start_date), plan.duration);

            await enrollment.update({
                plan_id,
                price,
                end_date,
                start_date
            });
            return res.json({ message: 'Enrollment updated' });
        }

        return res.status(400).json({ error: 'Please choose a valid plan' });
    }

    async delete(req, res) {
        const { id } = req.params;
        const enrollment = await Enrollment.findByPk(id);

        if (!enrollment) {
            return res.status(400).json({ error: 'Enrollment not found' });
        }

        await Enrollment.destroy({
            where: { id }
        });
        return res.json({ message: 'Enrollment deleted' });
    }
}

export default new EnrollmentController();
