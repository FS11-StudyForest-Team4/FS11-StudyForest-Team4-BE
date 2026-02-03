import { z } from 'zod';

//private 접근 시 비밀번호 확인(로그인 예제 활용)
export const verifySchema = z.object({
  id: z.ulid({
    error: 'ID 형식이 올바르지 않습니다.',
  }),
  password: z
    .string({ error: '비밀번호는 필수입니다.' })
    .min(1, '비밀번호를 입력해주세요.'),
});
