// import { format, parseISO, subDays, startOfDay, endOfDay } from 'date-fns';

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

        // const last7Days = format(subDays(new Date(), 7), 'yyyy-MM-dd')

        // const checkInCount = await Checkin.count({
        //     where:
        // })

        await Checkin.create({
            student_id: student.id
        });
        return res.json({ message: 'Checkin done' });
    }
}

export default new CheckinController();
