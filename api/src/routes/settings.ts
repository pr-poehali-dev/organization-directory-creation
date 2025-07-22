import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const settingsSchema = Joi.object({
  ministries: Joi.array().items(Joi.string()).default([]),
  notificationDays: Joi.array().items(Joi.number().min(1).max(31)).default([]),
  enableNotifications: Joi.boolean().default(true),
});

router.get('/', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    let settings = await prisma.systemSettings.findFirst();

    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: {
          ministries: [],
          notificationDays: [],
          enableNotifications: true
        }
      });
    }

    res.json(settings);
  } catch (error) {
    next(error);
  }
});

router.put('/', authenticateToken, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { error, value } = settingsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    let settings = await prisma.systemSettings.findFirst();

    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: value
      });
    } else {
      settings = await prisma.systemSettings.update({
        where: { id: settings.id },
        data: value
      });
    }

    res.json(settings);
  } catch (error) {
    next(error);
  }
});

export default router;