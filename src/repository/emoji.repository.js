import { prisma } from '#db/prisma.js';

//스터디의 모든 이모지 조회
function findByStudyId(studyId) {
  return prisma.emoji.findMany({
    where: { studyId },
    orderBy: { count: 'desc' }, //최신 -> 과거
  });
}

//이모지 count 증가
function incrementOrCreate({ studyId, name }) {
  return prisma.emoji.upsert({
    where: {
      studyId_name: {
        studyId,
        name,
      },
    },
    update: {
      count: { increment: 1 },
    },
    create: {
      studyId,
      name,
      count: 1,
    },
  });
}

//이모지 단건 조회 (삭제 조건 확인용)
function findById(emojiId) {
  return prisma.emoji.findUnique({
    where: { id: emojiId },
  });
}

//이모지 삭제
function remove(emojiId) {
  return prisma.emoji.delete({
    where: { id: emojiId },
  });
}

export const emojiRepository = {
  findByStudyId,
  incrementOrCreate,
  findById,
  remove,
};
