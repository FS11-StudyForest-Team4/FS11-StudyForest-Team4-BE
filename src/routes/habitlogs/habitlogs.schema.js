import { z } from 'zod';

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const habitIdParamSchema = z.object({
  habitId: z.string().regex(/^[0-9A-HJKMNP-TV-Z]{26}$/, {
    message: '유효한 ULID 형식의 ID가 아닙니다.',
  }),
});

export const habitlogQuerySchema = z.object({
  startOfWeek: z.string().regex(isoDateRegex,'startOfWeek 날짜가 유효하지 않습니다.'),
  endOfWeek: z.string().regex(isoDateRegex,'endOfWeek 날짜가 유효하지 않습니다.'),
})



