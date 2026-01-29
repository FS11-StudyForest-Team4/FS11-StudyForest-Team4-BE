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

  async createFocus(studyId) {
    return prisma.focus.create({
      data: {
        studyId,
        status: 'RUNNING',
        point: 0,
      },
      select: {
        id: true,
        status: true,
        point: true,
        startedAt: true,
        updatedAt: true,
        studyId: true,
      },
    });
  },

  async completeFocus(focusId) {
    const POINT_PER_COMPLETE = 50;

    return prisma.$transaction(async (tx) => {
      // focus 완료
      const focus = await tx.focus.update({
        where: { id: focusId },
        data: {
          status: 'COMPLETED',
          point: POINT_PER_COMPLETE,
        },
        select: {
          id: true,
          studyId: true,
          status: true,
          point: true,
        },
      });

      // study totalPoint 적립
      await tx.study.update({
        where: { id: focus.studyId },
        data: { totalPoint: { increment: POINT_PER_COMPLETE } },
        select: { id: true },
      });

      return {
        focusId: focus.id,
        studyId: focus.studyId,
        point: POINT_PER_COMPLETE,
      };
    });
  },

  // 진행중인 세션 찾기
  async findFocus(studyId) {
    return prisma.focus.findFirst({
      where: {
        studyId,
        status: 'RUNNING',
      },
      orderBy: { startedAt: 'desc' },
      select: {
        id: true,
        status: true,
        startedAt: true,
        studyId: true,
      },
    });
  },

  // 세션 취소
  async cancelFocus(focusId) {
    return prisma.focus.update({
      where: { id: focusId },
      data: { status: 'CANCELED', point: 0 },
      select: {
        id: true,
        studyId: true,
        status: true,
        point: true,
      },
    });
  },

  // 세션 일시정지
  async pauseFocus(focusId) {
    return prisma.focus.updateMany({
      where: {
        id: focusId,
        status: 'RUNNING',
      },
      data: { status: 'PAUSED' },
    });
  },

  // 세션 재개
  async resumeFocus(focusId) {
    return prisma.focus.updateMany({
      where: {
        id: focusId,
        status: 'PAUSED',
      },
      data: { status: 'RUNNING' },
    });
  },
};
