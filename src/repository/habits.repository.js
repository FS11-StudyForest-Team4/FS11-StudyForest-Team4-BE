import { prisma } from '#db/prisma.js';


// 습관 등록 
function creatHabit(studyId, data) {
  return prisma.habit.create({
    data: {
      ...data,
      studyId,
    }
  })
}

// 습관 수정
function updateHabit(id, data) {
  return prisma.habit.update({
    where: { id },
    data,
  })
}

// 습관 삭제 
function deleteHabit(id) {
  return prisma.habit.delete({
    where: { id },
  })
}

// 습관 목록 조회 
function findHabitsForStudy(studyId) {
  return prisma.habit.findMany({
    where: {studyId}
  })

}

export const habitRepository = {
  creatHabit,
  updateHabit,
  deleteHabit,
  findHabitsForStudy,
}