// Prisma 에러 코드 상수
export const PRISMA_ERROR = {
  UNIQUE_CONSTRAINT: 'P2002', // Unique constraint 위반
  RECORD_NOT_FOUND: 'P2025', // 레코드를 찾을 수 없음
};

// 에러 메시지 상수
export const ERROR_MESSAGE = {
  //작성해야 함

  //이모지
  FAILED_TO_GET_EMOJIS: 'Failed to get emojis', //이모지 조회 500
  FAILED_TO_POST_EMOJIS: 'Failed to post emojis', //이모지 추가 500
  FAILED_TO_DELETE_EMOJIS: 'Failed to delete emojis', //이모지 삭제 500
  EMOJI_REQUIRED: 'emoji is required', //이모지 생성/수정 400 - 이모지 필수값
  EMOJI_NOT_FOUND: 'emoji is no found'
};
