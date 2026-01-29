import { prisma } from '#db/prisma.js';

export const focusRepository = {
  async getTotalPoint(studyId) {
    return prisma.study.findUnique({
      where: { id: studyId },
      select: { totalPoint: true },
    });
  },

  async getFocus(studyId) {
    return prisma.focus.findMany({
      where: { studyId },
      orderBy: { startedAt: 'desc' },
      select: {
        id: true,
        status: true,
        point: true,
        startedAt: true,
        updatedAt: true,
      },
    });
  },
};
