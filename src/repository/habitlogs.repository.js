import { prisma } from '#db/prisma.js';

// 오늘 습관 완료 토글 (토글이니까 data 안받기)
async function toggleHabitToday(habitId) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  // 오늘 습관 조회
  const todayHabitlog = await prisma.habitlog.findFirst({
    where: {
      habitId,
      createdAt: {
        gte: startOfToday,
        lte: endOfToday,
      },
    },
  });
  // 습관완료 있는 경우 로그 삭제
  if (todayHabitlog) {
    await prisma.habitlog.delete({
      where: { id: todayHabitlog.id },
    });
  } else {
    // 습관완료 없는 경우 로그 생성
    await prisma.habitlog.create({
      data: {
        habitId,
        createdAt: new Date(),
      },
    });
  }
}

// 습관기록 조회 - 특정날짜
function findHabitlogs(studyId, startOfWeek) {
  const start = new Date(startOfWeek);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

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
  // create,
  toggleHabitToday,
  findHabitlogs,
};
