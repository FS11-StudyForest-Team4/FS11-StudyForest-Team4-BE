import { prisma } from '#db/prisma.js';

// 습관기록 등록
function createHabitlog(habitId, data) {
  return prisma.habitlog.create({
    data: {
      ...data,
      habitId,
    },
  });
}

// 습관기록 조회 - 특정날짜
function findHabitlogs(startOfWeek, endOfWeek) {
  const start = new Date(startOfWeek);
  const end = new Date(endOfWeek);
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
  createHabitlog,
  findHabitlogs,
};
