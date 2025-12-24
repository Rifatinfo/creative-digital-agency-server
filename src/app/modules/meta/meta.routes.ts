import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../generated/prisma/enums';
import { MetaController } from './meta.controller';

const router = express.Router();

router.get('/', auth(UserRole.ADMIN, UserRole.ADMIN, UserRole.CLIENT), MetaController.fetchDashboardMetaData)


export const MetaRoutes = router;