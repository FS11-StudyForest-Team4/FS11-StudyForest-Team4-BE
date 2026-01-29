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
function findHabitsForStudy(studyId) {
  return prisma.habit.findMany({
    where: { studyId },
  });
}

export const habitRepository = {
  create,
  findById,
  update,
  remove,
  findHabitsForStudy,
};
