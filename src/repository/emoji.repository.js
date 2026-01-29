import { prisma } from '#db/prisma.js';

//스터디의 모든 이모지 조회
function findEmojisByStudyId(studyId) {
  return prisma.emoji.findMany({
    where: { studyId },
    orderBy: { count: 'desc' },
  });
}

//이모지 생성 (첫 생성시 count = 1)
function createEmoji(studyId, name) {
  return prisma.emoji.create({
    data: {
      studyId,
      name,
      count: 1,
    },
  });
}

//이모지 count 증가
function increaseEmojiCount(emojiId) {
  return prisma.emoji.update({
    where: { id: emojiId },
    data: {
      count: { increment: 1 },
    },
  });
}

//이모지 단건 조회 (삭제 조건 확인용)
function findEmojiById(emojiId) {
  return prisma.emoji.findUnique({
    where: { id: emojiId },
  });
}

//이모지 삭제
function deleteEmoji(emojiId) {
  return prisma.emoji.delete({
    where: { id: emojiId },
  });
}

export const emojiRepository = {
  findEmojisByStudyId,
  createEmoji,
  findEmojiById,
  increaseEmojiCount,
  deleteEmoji,
};
