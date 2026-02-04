import { prisma } from '#db/prisma.js';

// 습관 등록
function create(studyId, data) {
  return prisma.habit.create({
    data: {
      ...data,
      studyId,
    },
  });
}

// 특정 습관 조회
function findById(id) {
  return prisma.habit.findUnique({
    where: { id },
  });
}

// 습관 수정
function update(id, data) {
  return prisma.habit.update({
    where: { id },
    data,
  });
}

// 습관 삭제
function remove(id) {
  return prisma.habit.delete({
    where: { id },
  });
}

// 습관 목록 조회
async function getTodayHabits(studyId) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0); 
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999); 

  const habits = await prisma.habit.findMany({
    where: { studyId },
    include: {
      habitlogs: {
        where: {
          createdAt: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
      },
    },
  });

  return habits.map(({ habitlogs, ...habit }) => ({
    ...habit,
    isCompleted: habitlogs.length > 0, // 오늘 완료 여부
  }));
}


export const habitRepository = {
  create,
  findById,
  update,
  remove,
  getTodayHabits,
};
