import { prisma } from '#db/prisma.js';

//스터디의 모든 이모지 조회
function findEmojisByStudyId(studyId) {
  return prisma.emoji.findMany({
    where: { studyId },
    orderBy: { count: 'desc' }, //최신 -> 과거
  });
}

//이모지 count 증가
function emojiCount(studyId, name) {
  return prisma.emoji.create({
    data: {
      studyId,
      name,
      count: 1,
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
  emojiCount,
  findEmojiById,
  deleteEmoji,
};
