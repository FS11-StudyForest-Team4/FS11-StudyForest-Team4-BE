import { prisma } from '#db/prisma.js';

// 습관기록 등록
function create(habitId, data) {
  return prisma.habitlog.create({
    data: {
      ...data,
      habitId,
    },
  });
}

// 습관기록 조회 - 특정날짜
function findHabitlogs(startOfWeek) {
  const start = new Date(startOfWeek);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  
  return prisma.habitlog.findMany({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
    },
    select: {
      habitId: true,
      createdAt: true,
    },
  });
}

export const habitlogRepository = {
  create,
  findHabitlogs,
};
