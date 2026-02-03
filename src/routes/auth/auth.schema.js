import { z } from 'zod';

//유저 엔티티가 없으므로 스터디 생성이 회원가입과 같은 역할인 것 같습니다. 합쳐야할지 확인 필요합니다.
export const signUpSchema = z.object({
  password: z
    .string({ error: '비밀번호는 필수입니다.' })
    .min(4, '비밀번호는 4자리 이상이어야 합니다.'),
  title: z.string().min(1, '스터디 제목은 필수입니다.'),
  nickName: z.string().min(1, '닉네임은 필수입니다.'),
});

//private 접근 시 비밀번호 확인(로그인)
export const loginSchema = z.object({
  password: z
    .string({ error: '비밀번호는 필수입니다.' })
    .min(1, '비밀번호를 입력해주세요.'),
});

//id 검증
export const idParamSchema = z.object({
  id: z.ulid({
    message: 'ID 형식이 올바르지 않습니다.', //~~우린 ulid를 식별자로 쓰기로 약속했어요~~
  }),
});