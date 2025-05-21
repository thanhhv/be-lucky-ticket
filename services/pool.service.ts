import { PoolFilterOptions } from "../interfaces/pagination.interface";
import { PoolModel } from "../models/pool.model";

export async function getPoolsWithPagination({
  page = 1,
  pageSize = 10,
  status = "active",
}: PoolFilterOptions) {
  const skip = (page - 1) * pageSize;

  const filter: Record<string, any> = {};
  filter.status = status;

  const [totalCount, pools] = await Promise.all([
    PoolModel.countDocuments(filter),
    PoolModel.find(filter)
      .sort({ poolId: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean(),
  ]);

  return {
    pagination: {
      total: totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    },
    data: pools,
  };
}

export async function getPoolById(poolId: number) {
  const pool = await PoolModel.findOne({ poolId }).lean();
  return pool;
}
