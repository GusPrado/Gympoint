import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
    async index(req, res) {
        const plans = await Plan.findAll();
        // return res.json({ message: 'PlanContoller here' });
        return res.json(plans);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            title: Yup.string().required(),
            duration: Yup.number().required(),
            price: Yup.number().required()
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation failed!' });
        }

        const planExists = await Plan.findOne({
            where: { title: req.body.title }
        });

        if (planExists) {
            return res.status(400).json({ error: 'Plan already exists' });
        }

        const { title, duration, price } = await Plan.create(req.body);

        return res.json({
            title,
            duration,
            price
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            title: Yup.string(),
            duration: Yup.number(),
            price: Yup.number()
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation failed!' });
        }
        const { title } = req.body;
        const { id } = req.params;

        const plan = await Plan.findByPk(id);

        if (!plan) {
            res.status(400).json({ error: 'Plan does not exist' });
        }

        if (title === plan.title) {
            const { duration, price } = await plan.update(req.body);
            return res.json({
                title,
                duration,
                price
            });
        }

        return res
            .status(400)
            .json({ error: 'Plan name and ID does not match' });
    }

    async delete(req, res) {
        const { id } = req.params;
        await Plan.destroy({
            where: { id }
        });
        return res.json({ message: 'Plan deleted' });
    }
}

export default new PlanController();
