import { subDays, startOfDay, endOfDay } from 'date-fns';

import Checkin from '../schemas/Checkin';
import Student from '../models/Student';
import Enrollment from '../models/Enrollment';

class CheckinController {
    async index(req, res) {
        const { id } = req.params;

        const student = await Student.findByPk(id);

        if (!student) {
            res.status(400).json({ error: 'Invalid student' });
        }

        const checkIns = await Checkin.find({
            student_id: id
        })
            .sort('createdAt')
            .limit(10);

        return res.json(checkIns);
    }

    async store(req, res) {
        const { id } = req.params;
        const student = await Student.findByPk(id);

        if (!student) {
            res.status(400).json({ error: 'Invalid student' });
        }

        const enrollmentExists = await Enrollment.findOne({
            where: { id }
        });

        if (!enrollmentExists) {
            return res.status(400).json({ error: 'Student is not enrolled.' });
        }

        const today = startOfDay(new Date());
        const last7Days = subDays(today, 7);

        const checkInCount = await Checkin.find({
            student_id: student.id
        })
            .gte('createdAt', startOfDay(last7Days))
            .lte('createdAt', endOfDay(today))
            .countDocuments();

        // verify if its exceed 5 chekins on 7 days role
        if (checkInCount > 5) {
            return res.status(400).json({
                error: '05 checkins on a seven day row limit exceeded.'
            });
        }

        await Checkin.create({
            student_id: student.id
        });

        return res.json({ message: 'Checkin done' });
    }
}

export default new CheckinController();
