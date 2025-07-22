import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const departmentSchema = Joi.object({
  name: Joi.string().required(),
  organizationId: Joi.string().required(),
});

router.get('/', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { organizationId } = req.query;

    const where: any = {};
    if (organizationId) {
      where.organizationId = organizationId as string;
    }

    const departments = await prisma.department.findMany({
      where,
      include: {
        organization: true,
        employees: true,
        _count: {
          select: {
            employees: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json(departments);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        organization: true,
        employees: true
      }
    });

    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.json(department);
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { error, value } = departmentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const department = await prisma.department.create({
      data: value,
      include: {
        organization: true,
        employees: true,
        _count: {
          select: {
            employees: true
          }
        }
      }
    });

    res.status(201).json(department);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = departmentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const department = await prisma.department.update({
      where: { id },
      data: value,
      include: {
        organization: true,
        employees: true,
        _count: {
          select: {
            employees: true
          }
        }
      }
    });

    res.json(department);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    await prisma.department.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;