import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const employeeSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  middleName: Joi.string().optional().allow('', null),
  position: Joi.string().required(),
  email: Joi.string().email().optional().allow('', null),
  phone: Joi.string().optional().allow('', null),
  organizationId: Joi.string().required(),
  departmentId: Joi.string().optional().allow('', null),
});

router.get('/', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { organizationId, departmentId, search } = req.query;

    const where: any = {};
    
    if (organizationId) {
      where.organizationId = organizationId as string;
    }
    
    if (departmentId) {
      where.departmentId = departmentId as string;
    }

    if (search) {
      const searchTerm = search as string;
      where.OR = [
        { firstName: { contains: searchTerm } },
        { lastName: { contains: searchTerm } },
        { middleName: { contains: searchTerm } },
        { position: { contains: searchTerm } },
        { email: { contains: searchTerm } }
      ];
    }

    const employees = await prisma.employee.findMany({
      where,
      include: {
        organization: true,
        department: true
      },
      orderBy: [
        { lastName: 'asc' },
        { firstName: 'asc' }
      ]
    });

    res.json(employees);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        organization: true,
        department: true
      }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { error, value } = employeeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const employee = await prisma.employee.create({
      data: {
        ...value,
        departmentId: value.departmentId || null
      },
      include: {
        organization: true,
        department: true
      }
    });

    res.status(201).json(employee);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = employeeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        ...value,
        departmentId: value.departmentId || null
      },
      include: {
        organization: true,
        department: true
      }
    });

    res.json(employee);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    await prisma.employee.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;