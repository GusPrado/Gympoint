// Copyright (c) 2019 gusprado
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.post('/students', StudentController.store);

routes.use(authMiddleware); // Needs authentication down below

routes.put('/students/:id', StudentController.update);

routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.get('/enrollments', EnrollmentController.index);
routes.post('/enrollments', EnrollmentController.store);
// routes.put('/enrollments/:id', EnrollmentController.update);
// routes.delete('/enrollments/:id', EnrollmentController.delete);

export default routes;
