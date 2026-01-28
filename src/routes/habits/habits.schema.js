import { z } from 'zod';

// ID 파라미터 검증 스키마
export const idParamSchema = z.object({
  id: z.string().regex(/^[0-9A-HJKMNP-TV-Z]{26}$/, {
    message: '유효한 ULID 형식의 ID가 아닙니다.',
  }),
});

// 습관 수정 스키마
export const updateHabitSchema = z.object({
  name: z.string().min(1, '습관이름은 필수입니다.'),
});
