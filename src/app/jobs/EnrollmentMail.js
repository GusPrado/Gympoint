import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class EnrollmentMail {
    get key() {
        // each job needs an unique key - usually the class name
        return 'EnrollmentMail';
    }

    async handle({ data }) {
        const { student, plan, end_date, price } = data;

        // console.log('Queue executed');

        await Mail.sendMail({
            to: `${student.name} <${student.email}>`,
            subject: 'Bem vindo a GYMPOINT',
            template: 'enrollment',
            context: {
                name: student.name,
                plan: plan.title,
                end_date: format(
                    parseISO(end_date),
                    "'Dia' dd 'de' MMMM 'de' yyyy",
                    {
                        locale: pt
                    }
                ),
                total: price
            }
        });
    }
}

export default new EnrollmentMail();
