import { z } from 'zod';

// ID 파라미터 검증 스키마
export const studyIdParamSchema = z.object({
  studyId: z.string().regex(/^[0-9A-HJKMNP-TV-Z]{26}$/, {
    message: '유효한 ULID 형식의 ID가 아닙니다.',
  }),
});

// 습관 생성 스키마
export const createHabitSchema = z.object({
  name: z.string().min(1, '습관이름은 필수입니다.'),
});

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const habitlogQuerySchema = z.object({
  startOfWeek: z.string().regex(isoDateRegex,'startOfWeek 날짜가 유효하지 않습니다.'),
  endOfWeek: z.string().regex(isoDateRegex,'endOfWeek 날짜가 유효하지 않습니다.'),
})
