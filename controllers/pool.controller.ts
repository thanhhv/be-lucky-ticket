import { Request, Response } from "express";
import { getPoolById, getPoolsWithPagination } from "../services/pool.service";

export async function getPools(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const status = req.query.status as string;

    const result = await getPoolsWithPagination({
      page,
      pageSize,
      status,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("❌ Error fetching pools:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getPoolDetails(req: Request, res: Response) {
  try {
    const poolId = parseInt(req.params.id);
    if (isNaN(poolId)) {
      return res.status(400).json({ success: false, message: 'Invalid pool ID' });
    }

    const pool = await getPoolById(poolId);

    if (!pool) {
      return res.status(404).json({ success: false, message: 'Pool not found' });
    }

    res.json({ success: true, data: pool });
  } catch (error) {
    console.error('❌ Error fetching pool detail:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}