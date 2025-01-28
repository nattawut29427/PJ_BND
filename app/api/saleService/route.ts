// pages/api/sale.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { skewerId, quantity } = req.body;

      if (!quantity) {
        return res.status(400).json({ error: 'Missing skewerId or quantity' });
      }

      // บันทึกข้อมูลการขาย
      const sale = await prisma.sale.create({
        data: {
          skewerId: skewerId || undefined,
          quantity,
        },
      });

      res.status(201).json(sale);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create sale' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
