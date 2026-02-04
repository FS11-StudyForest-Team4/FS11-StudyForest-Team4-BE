import { prisma } from '#db/prisma.js';
import { comparePassword, hashPassword } from '#utils';

//정렬 조건 상수
const ORDER = {
  LATEST: [{ createdAt: 'desc' }, { id: 'desc' }],
  OLDEST: [{ createdAt: 'asc' }, { id: 'asc' }],
  MOST_POINTS: [{ totalPoint: 'desc' }, { id: 'desc' }],
  LEAST_POINTS: [{ totalPoint: 'asc' }, { id: 'asc' }],
};

//스터디 생성 및 수정 비밀번호 해실
const makeSecureData = async (data) => {
  if (!data.password) return data;
  //req body 중 password 있는 경우 hash
  return { ...data, password: await hashPassword(data.password) };
};

//비밀번호 검증
const verifyPassword = async (id, password) => {
  //스터디가 없는 경우 return null
  const study = await findById(id);
  if (!study) return null;
  //비밀번호가 없는 경우 return null
  const matchPassword = await comparePassword(password, study.password);
  if (!matchPassword) return null;

  return study;
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

const generateNextCursor = (limit, studies) => {
  const checkNextPage = studies.length > limit;
  const nextCursor = checkNextPage ? studies[limit - 1].id : null; //다음 cursor 반환

  return { nextCursor, checkNextPage };
};

//스터디 목록 조회
async function findAll(
  { q: keyword, cursor, limit = 6, orderBy } = {},
  include = null,
) {
  const limitNum = Number(limit);
  const searchResult = search(keyword);
  const paginationResult = pagination({
    cursor,
    limit: limitNum + 1, //더보기 버튼 활성 사전 확인을 위해 +1
    orderBy,
  });

  const rawData = await prisma.study.findMany({
    where: searchResult, //검색 기능
    ...paginationResult, //페이지네이션 기능
    ...(include && { include }),
  });

  const { nextCursor, checkNextPage } = generateNextCursor(limit, rawData);

  const data = checkNextPage ? rawData.slice(0, limitNum) : rawData;

  return { data, nextCursor, checkNextPage };
}

//특정 스터디 조회
function findById(id, include = null) {
  return prisma.study.findUnique({
    where: { id },
    ...(include && { include }),
  });
}

//스터디 생성
async function create(data) {
  const secureData = await makeSecureData(data);

  return prisma.study.create({ data: secureData });
}

//특정 스터디 수정
async function edit(id, data) {
  //수정할 데이터 중 비밀번호가 포함된 경우 해싱
  const secureData = await makeSecureData(data);

  return prisma.study.update({
    where: { id },
    data: secureData,
  });
}

//특정 스터디 삭제
function remove(id) {
  return prisma.study.delete({
    where: { id },
  });
}
  
export const studyRepository = {
  verifyPassword,
  create,
  findAll,
  findById,
  edit,
  remove,
};
