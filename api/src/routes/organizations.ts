import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const organizationSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().optional(),
  description: Joi.string().optional(),
});

router.get('/', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const organizations = await prisma.organization.findMany({
      include: {
        employees: {
          include: {
            department: true
          }
        },
        departments: true,
        _count: {
          select: {
            employees: true,
            departments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(organizations);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const organization = await prisma.organization.findUnique({
      where: { id },
      include: {
        employees: {
          include: {
            department: true
          }
        },
        departments: true
      }
    });

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    res.json(organization);
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { error, value } = organizationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const organization = await prisma.organization.create({
      data: value,
      include: {
        employees: true,
        departments: true,
        _count: {
          select: {
            employees: true,
            departments: true
          }
        }
      }
    });

    res.status(201).json(organization);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = organizationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const organization = await prisma.organization.update({
      where: { id },
      data: value,
      include: {
        employees: {
          include: {
            department: true
          }
        },
        departments: true,
        _count: {
          select: {
            employees: true,
            departments: true
          }
        }
      }
    });

    res.json(organization);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    await prisma.organization.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;