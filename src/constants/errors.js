// Prisma 에러 코드 상수
export const PRISMA_ERROR = {
  UNIQUE_CONSTRAINT: 'P2002',
  RECORD_NOT_FOUND: 'P2025',
};

// 에러 메시지 상수
export const ERROR_MESSAGE = {
  //Study
  STUDY_NOT_FOUND: 'Study not found', //studyId 404 공통
  FAILED_TO_FETCH_STUDY: 'Failed to fetch studies', //스터디 목록 조회 500
  FAILED_TO_FETCH_STUDY: 'Failed to fetch study', //스터디 조회 500
  FAILED_TO_CREATE_STUDY: 'Failed to create study', //스터디 생성 500
  FAILED_TO_UPDATE_STUDY: 'Failed to update study', //스터디 수정 500
  FAILED_TO_DELETE_STUDY: 'Failed to delete study', //스터디 삭제 500
  PASSWORD_REQUIRED: 'Password is required', //스터디 생성/수정 400 - 비밀번호 필수값
  TITLE_REQUIRED: 'Title is required', //스터디 생성/수정 400 - 제목 필수값
  // TITLE_REQUIRED: 'Title is required', //스터디 생성/수정 400 - 소개 필수값: 필수값이어야 하는지 확인부탁드립니다.
  NICKNAME_REQUIRED: 'Title is required', //스터디 생성/수정 400 - 닉네임 필수값
  SEARCH_QUERY_REQUIRED: 'Search query is required', //스터디 검색 400 - 쿼리 필요 -> API 한번 봐주세요
  FAILED_TO_FETCH_STUDY_WITH_HABITS: 'Failed to fetch study with habits', //오늘의 습관 조회(…{studyId}/habits) 500

  //이모지
  FAILED_TO_FETCH_EMOJIS: 'Failed to fetch emojis', //이모지 조회 500
  FAILED_TO_POST_EMOJIS: 'Failed to post emojis', //이모지 추가 500
  FAILED_TO_DELETE_EMOJIS: 'Failed to fetch emojis', //이모지 삭제 500
  EMOJI_REQUIRED: 'emoji is required', //이모지 생성/수정 400 - 이모지 필수값

  //비밀번호 확인(PRIVATE 진입 전)
  INVALID_CREDENTIALS: 'Invalid password', //비밀번호 불일치 401 공통(스터디 생성, 습관, 집중)
  FAILED_TO_VERIFY: 'Failed to verify', //비밀번호 불일치 500

  // 습관
  FAILED_TO_CREATE_HABIT: 'Failed to create habit', //습관 생성 500
  FAILED_TO_COMPLETE_HABIT: 'Failed to complete habit', // 습관 완료 실패 500
  FAILED_TO_UPDATE_HABIT: 'Failed to update habit', //습관 수정 500
  FAILED_TO_DELETE_HABIT: 'Failed to delete habit', // 습관 삭제 500
  HABIT_NAME_REQUIRED: 'Habit name is required', //습관 생성/수정 400
  // HABIT_ALREADY_EXISTS: 'Habit already exists', //습관 생성 409 - 습관 NAME 중복 가능해서 오류처리 안 해도 될 것 같은데 API 명세서 한번 확인 부탁드립니다!
  HABIT_ALREADY_COMPLETED: 'Habit is completed already', //습관 완료 실패 409
  HABIT_NOT_FOUND: 'Habit not found', //습관 완료 실패/수정/삭제 404
  // HABIT_ALREADY_DELETED: 'Habit is already deleted', //습관 삭제 409 - 습관 삭제 후 다시 삭제하는 경우 404 출력하면 될 것 같습니다..!

  //집중
  FAILED_TO_CREATE_FOCUS: 'Failed to create focus', //집중 시작 실패 500
  FAILED_TO_FETCH_FOCUS: 'Failed to fetch focus', //집중 조회 실패 500
  FAILED_TO_COMPLETE_FOCUS: 'Failed to delete focus', //집중 완료 실패 500
  FOCUS_NOT_FOUND: 'Focus not found', //집중 시작/조회/완료 404

  // Auth 관련
  NO_AUTH_TOKEN: 'No authentication token provided',
  INVALID_TOKEN: 'Invalid or expired token',
  USER_NOT_FOUND_FROM_TOKEN: 'User not found from token',
  AUTH_FAILED: 'Authentication failed',

  // Validation (범용: 전체 바디, 인자, 쿼리)
  INVALID_INPUT: 'Invalid input',
  VALIDATION_FAILED: 'Validation failed',

  // 일반 에러 (Exception 기본값으로 사용)
  RESOURCE_NOT_FOUND: '리소스를 찾을 수 없습니다.', //404 공통
  BAD_REQUEST: '잘못된 요청입니다.', //400 공통
  RESOURCE_CONFLICT: '이미 존재하는 데이터입니다.', //409 공통
  INTERNAL_SERVER_ERROR: '서버 내부 오류가 발생했습니다.', //500 공통
};
