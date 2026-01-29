import { prisma } from '#db/prisma.js';

//스터디 생성
function create(data) {
  return prisma.study.create({
    data: {
      ...data,
      totalPoint: 0, //초기값
    },
  });
}

//스터디 목록 조회
function findList(include = null) {
  return prisma.study.findMany({
    ...(include && { include }),
  });
}

//특정 스터디 조회
function findById(id, include = null) {
  return prisma.study.findUnique({
    where: { id: id },
    ...(include && { include }),
  });
}

//특정 스터디 수정
function edit(id, data) {
  return prisma.study.update({
    where: { id: id },
    data,
  });
}

//특정 스터디 삭제
function remove(id) {
  return prisma.study.delete({
    where: { id: id },
  });
}

export const studyRepository = {
  create,
  findList,
  findById,
  edit,
  remove,
};
