import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';
import Enrollment from '../models/Enrollment';
import Plan from '../models/Plan';
import Student from '../models/Student';

class EnrollmentController {
    async index(req, res) {
        const enrollments = await Enrollment.findAll();
        return res.json(enrollments);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            student_id: Yup.number().required(),
            plan_id: Yup.number().required(),
            start_date: Yup.number().required()
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails!' });
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
        const plan = await Plan.findByPk(plan_id);

        if (!plan) {
            return res.status(400).json({ error: 'Plan does not exist' });
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
            return res.status(400).json({ error: 'Student not found' });
        }

        const enrollment = await Enrollment.create({
            start_date,
            student_id,
            plan_id,
            end_date,
            price
        });

        return res.json(enrollment);
    }
}

export default new EnrollmentController();
