import { prisma } from '#db/prisma.js';

//정렬 조건 상수
const ORDER = {
  LATEST: [{ createdAt: 'desc' }, { id: 'desc' }],
  OLDEST: [{ createdAt: 'asc' }, { id: 'asc' }],
  MOST_POINTS: [{ totalPoint: 'desc' }, { id: 'desc' }],
  LEAST_POINTS: [{ totalPoint: 'asc' }, { id: 'asc' }],
};

//검색 기능
function search(q) {
  if (!q || q.trim() === '') return {};
  return {
    OR: [
      {
        title: {
          contains: q,
          mode: 'insensitive',
        },
      },
      {
        description: {
          contains: q,
          mode: 'insensitive',
        },
      },
      {
        nickName: {
          contains: q,
          mode: 'insensitive',
        },
      },
    ],
  };
}

//페이지네이션 - 커서 방식 사용하여 새로운 스터디 등록되더라도 중복되지 않게 함
function pagination({ cursor, limit = 6, orderBy }) {
  const order = ORDER[orderBy] || ORDER.LATEST;

  return {
    take: limit,
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor },
    }),
    orderBy: order,
  };
}

//스터디 목록 조회
function findAll({ q, cursor, limit = 6, orderBy } = {}, include = null) {
  const searchResult = search(q);
  const paginationResult = pagination({
    cursor,
    limit: Number(limit), //limit 자료형 문제 해결을 위해 강제 형변환
    orderBy,
  });
  return prisma.study.findMany({
    where: searchResult, //검색 기능
    ...paginationResult, //페이지네이션 기능
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

//스터디 생성
function create(data) {
  return prisma.study.create({
    data,
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
  findAll,
  findById,
  edit,
  remove,
};
