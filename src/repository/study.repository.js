import { prisma } from '#db/prisma.js';

//studyid확인 절차 필요해서 임시로 만듬
// 특정 스터디 조회 

function findStudyById(id) {
  return prisma.habit.findUnique({
     where: { id },
  });
}

export const studyRepository = {
  findStudyById,
}