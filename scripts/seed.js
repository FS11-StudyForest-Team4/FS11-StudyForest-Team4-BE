import { PrismaClient } from '#generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import { faker } from '@faker-js/faker';

const NUM_STUDIES_TO_CREATE = 10;

const EMOJIS = ['🔥', '👏', '🙌', '🎉', '❤️', '😊', '🚀', '💯', '📚', '🏆'];

const BACKGROUNDS = [
  'GREEN',
  'YELLOW',
  'BLUE',
  'PINK',
  'DESIGN',
  'STUDY',
  'TILE',
  'LEAF',
];

const STATUS = ['RUNNING', 'COMPLETED', 'CANCELED', 'PAUSED'];

const xs = (n) => Array.from({ length: n }, (_, i) => i + 1);

// 스터디 데이터 생성 함수
const makeStudyInputs = () => ({
  password: faker.internet.password({ length: 8 }),
  title: faker.lorem.sentence({ min: 3, max: 7 }),
  description: faker.lorem.paragraph({ min: 1, max: 3 }, '\n\n'),
  nickName: faker.internet.username(),
  background: faker.helpers.arrayElement(BACKGROUNDS),
  totalPoint: faker.number.int({ min: 0, max: 1000 }),
});

// 습관 데이터 생성 함수
const makeHabitInputsForStudy = (studyId, count) =>
  xs(count).map(() => ({
    name: faker.lorem.sentence({ min: 3, max: 5 }),
    isDeleted: faker.datatype.boolean(), //defaut지만 확인위해 생성
    studyId,
  }));

// 습관 기록 데이터 생성 함수
const makeHabitlogInputsForHabit = (habitId, count) =>
  xs(count).map(() => ({
    habitId,
  }));

//이모지 데이터 생성 함수 (중복될수 있음)
const makeEmojiInputsForStudy = (studyId, count) => 
  xs(count).map(() => ({
    studyId,
    name: faker.helpers.arrayElement(EMOJIS),
    count: faker.number.int({ min: 1, max: 100 }),
  }));

// 집중 데이터 생성 함수
const makeFocusInputsForStudy = (studyId, count) =>
  xs(count).map(() => ({
    status: faker.helpers.arrayElement(STATUS),
    point: faker.number.int({ min: 0, max: 1000 }),
    studyId,
  }));

//trasaction
const resetDb = (prisma) =>
  prisma.$transaction([
    prisma.Habitlog.deleteMany(),
    prisma.emoji.deleteMany(),
    prisma.focus.deleteMany(),
    prisma.habit.deleteMany(),
    prisma.study.deleteMany(),
  ]);

// 스터디 시딩
const seedStudies = async (prisma, count) => {
  const data = xs(count).map(makeStudyInputs);

  return await prisma.study.createManyAndReturn({
    data,
    select: { id: true },
  });
};

// 스터디에 습관 시딩
const seedHabits = async (prisma, studies) => {
  const data = studies
    .map((s) => ({ id: s.id, count: faker.number.int({ min: 1, max: 5 }) }))
    .flatMap(({ id, count }) => makeHabitInputsForStudy(id, count));
  return await prisma.habit.createManyAndReturn({
    data,
    select: { id: true },
  });
};

// 습관에 습관기록 시딩
const seedHabitlogs = async (prisma, habits) => {
  const data = habits
    .map((h) => ({ id: h.id, count: faker.number.int({ min: 1, max: 1 }) }))
    .flatMap(({ id, count }) => makeHabitlogInputsForHabit(id, count));

  return await prisma.Habitlog.createManyAndReturn({
    data,
    select: { id: true },
  });
};

//스터디에 이모지 시딩
const seedEmojis = async (prisma, studies) => {
  const data = studies.flatMap((s) => {
    const count = faker.number.int({ min: 3, max: 9 });
    const emojis = makeEmojiInputsForStudy(s.id, count);

    // 스터디 단위로 유니크
    return Array.from(
      new Map(emojis.map(e => [e.name, e])).values()
    );
  });

  return await prisma.emoji.createManyAndReturn({
    data,
    select: { id: true },
  });
};

// 스터디에 포커스 시딩
const seedFoci = async (prisma, studies) => {
  const data = studies
    .map((s) => ({ id: s.id, count: faker.number.int({ min: 1, max: 1 }) }))
    .flatMap(({ id, count }) => makeFocusInputsForStudy(id, count));

  return await prisma.focus.createManyAndReturn({
    data,
    select: { id: true },
  });
};

async function main(prisma) {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('⚠️  프로덕션 환경에서는 시딩을 실행하지 않습니다');
  }

  if (!process.env.DATABASE_URL?.includes('localhost')) {
    throw new Error('⚠️  localhost 데이터베이스에만 시딩을 실행할 수 있습니다');
  }

  console.log('🌱 시딩 시작...');

  await resetDb(prisma);
  console.log('✅ 기존 데이터 삭제 완료');

  const studies = await seedStudies(prisma, NUM_STUDIES_TO_CREATE);
  console.log(`✅ ${studies.length}의 스터디가 생성되었습니다`);

  const habits = await seedHabits(prisma, studies);
  console.log(`✅ ${habits.length}개의 습관이 생성되었습니다`);

  const Habitlogs = await seedHabitlogs(prisma, habits);
  console.log(`✅ ${Habitlogs.length}개의 습관기록이 생성되었습니다`);

  const emojis = await seedEmojis(prisma, studies);
  console.log(`✅ ${emojis.length}개의 이모지가 생성되었습니다`);

  const foci = await seedFoci(prisma, studies);
  console.log(`✅ ${foci.length}개의 집중데이터가 생성되었습니다`);

  console.log('✅ 데이터 시딩 완료');
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

main(prisma)
  .catch((e) => {
    console.error('❌ 시딩 에러:', e);
    process.exit(1); // 프로세스 종료
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
