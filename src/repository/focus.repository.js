import { prisma } from '#db/prisma.js';


function getTotalPoint(studyId) {
  return prisma.study.findUnique({
    where: { id: studyId },
    select: { totalPoint: true },
  });
}

function findById(studyId) {
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
}

function create(studyId) {
  return prisma.focus.create({
    data: {
      studyId,
      status: 'RUNNING',
      point: 0,
    },
  });
}

function complete(focusId, earnedPoint) {
  const point = Number(earnedPoint);
  return prisma.$transaction(async (tx) => {
    // focus 완료
    const focus = await tx.focus.update({
      where: { id: focusId },
      data: {
        status: 'COMPLETED',
        point: point,
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
      data: { totalPoint: { increment: point } },
      select: { id: true },
    });

    return {
      focusId: focus.id,
      studyId: focus.studyId,
      point: point,
    };
  });
}

// 진행중인 세션 찾기
function findRunningByStudyId(studyId) {
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
}

// 세션 취소
function cancel(focusId) {
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
}

// 세션 일시정지
function pause(focusId) {
  return prisma.focus.updateMany({
    where: {
      id: focusId,
      status: 'RUNNING',
    },
    data: { status: 'PAUSED' },
  });
}

// 세션 재개
function resume(focusId) {
  return prisma.focus.updateMany({
    where: {
      id: focusId,
      status: 'PAUSED',
    },
    data: { status: 'RUNNING' },
  });
}
export const focusRepository = {
  getTotalPoint,
  findById,
  create,
  complete,
  findRunningByStudyId,
  cancel,
  pause,
  resume,
};
