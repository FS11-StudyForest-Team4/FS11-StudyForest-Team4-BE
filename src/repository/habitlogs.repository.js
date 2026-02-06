import { prisma } from '#db/prisma.js';
import { startOfWeekRange } from '#utils';



function findFirst(where) {
  return prisma.habitlog.findFirst({
    where,
  });
}

function remove(id) {
  return prisma.habitlog.delete({
    where: {
      id,
    },
  });
}

function create(habitId) {
  return prisma.habitlog.create({ data: { habitId } });
}

// 습관기록 조회 - 특정날짜
function findHabitlogs(studyId, startOfWeek) {
 
  const {start, end } = startOfWeekRange(startOfWeek)

  return prisma.habitlog.findMany({
    where: {
      habit: {
        studyId: studyId,
      },
      createdAt: {
        gte: start,
        lte: end,
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
    select: {
      habitId: true,
      createdAt: true,
    },
  });
}

export const habitlogRepository = {
  findFirst,
  remove,
  create,
  findHabitlogs,
};
