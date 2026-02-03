import { z } from 'zod';

//스터디 수정 스키마 커스텀
const optionalStringSchema = (minLen, errorMessage) =>
  z
    .string()
    .transform((v) => (v === '' ? undefined : v))
    .optional()
    .refine((v) => v === undefined || v.length >= minLen, {
      message: errorMessage,
    });

//PK 검증 스키마
export const idParamSchema = z.object({
  id: z.ulid({
    message: 'ID 형식이 올바르지 않습니다.', //~~우린 ulid를 식별자로 쓰기로 약속했어요~~
  }),
});

//스터디 생성 스키마
export const createStudySchema = z.object({
  password: z.string().min(4, '비밀번호는 4자리 이상이어야 합니다.'), //비밀번호 4자리 이상 조건 임의로 달았슴다.
  title: z.string().min(1, '스터디 제목은 필수입니다.'),
  description: z.string(),
  nickName: z.string().min(1, '닉네임은 필수입니다.'), //사용자 입장에서는 시각적으로 구별할 방법이 닉넴+제목밖에 없을듯 해서 추가
  background: z.enum([
    'GREEN',
    'YELLOW',
    'BLUE',
    'PINK',
    'DESIGN',
    'STUDY',
    'TILE',
    'LEAF',
  ]),
});

//스터디 수정 스키마
export const updateStudySchema = z.object({
  password: optionalStringSchema(4, '비밀번호는 4자리 이상이어야 합니다.'),
  title: optionalStringSchema(1, '스터디 제목은 필수입니다.'),
  description: z.string().optional(),
  nickName: optionalStringSchema(1, '닉네임은 필수입니다.'),
  background: z
    .enum([
      'GREEN',
      'YELLOW',
      'BLUE',
      'PINK',
      'DESIGN',
      'STUDY',
      'TILE',
      'LEAF',
    ])
    .optional(),
});

// 습관 생성 스키마
export const createHabitSchema = z.object({
  name: z.string().min(1, '습관이름은 필수입니다.'),
});

export const habitlogQuerySchema = z.object({
  startOfWeek: z.iso.date('startOfWeek 날짜형식은 YYYY-MM-DD 여야 합니다.'),
})
