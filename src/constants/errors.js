// Prisma 에러 코드 상수
export const PRISMA_ERROR = {
  UNIQUE_CONSTRAINT: 'P2002',
  RECORD_NOT_FOUND: 'P2025',
};
export const ERROR_MESSAGE = {
  //스터디 관련
  STUDY_NOT_FOUND: 'Study not found', //studyId 404 공통
  FAILED_TO_FETCH_STUDIES: 'Failed to fetch studies', //스터디 목록 조회 500
  FAILED_TO_FETCH_STUDY: 'Failed to fetch study', //스터디 조회 500
  FAILED_TO_CREATE_STUDY: 'Failed to create study', //스터디 생성 500
  FAILED_TO_UPDATE_STUDY: 'Failed to update study', //스터디 수정 500
  FAILED_TO_DELETE_STUDY: 'Failed to delete study', //스터디 삭제 500

  // 습관
  FAILED_TO_CREATE_HABIT: 'Failed to create habit', //습관 생성 500
  FAILED_TO_COMPLETE_HABIT: 'Failed to complete habit', // 습관 완료 실패 500
  FAILED_TO_UPDATE_HABIT: 'Failed to update habit', //습관 수정 500
  FAILED_TO_DELETE_HABIT: 'Failed to delete habit', // 습관 삭제 500
  HABIT_NAME_REQUIRED: 'Habit name is required', //습관 생성/수정 400
  HABIT_NOT_FOUND: 'Habit not found', //습관 완료 실패/수정/삭제 404
  // HABIT_ALREADY_DELETED: 'Habit is already deleted', //습관 삭제 409 - 습관 삭제 후 다시 삭제하는 경우 404 출력하면 될 것 같습니다..!

  //Validation
  INVALID_INPUT: 'Invalid input',
  VALIDATION_FAILED: 'Validation failed',

  // 일반 에러 (Exception 기본값으로 사용)
  RESOURCE_NOT_FOUND: '리소스를 찾을 수 없습니다.',
  BAD_REQUEST: '잘못된 요청입니다.',
  RESOURCE_CONFLICT: '이미 존재하는 데이터입니다.',
  INTERNAL_SERVER_ERROR: '서버 내부 오류가 발생했습니다.',
};

// // 에러 메시지 상수 (아래 에러 메시지 참고해 보시면 좋을거 같아서 남겨놓았습니다)
// export const ERROR_MESSAGE = {
//   // User 관련
//   USER_NOT_FOUND: 'User not found',
//   EMAIL_REQUIRED: 'Email is required',
//   EMAIL_ALREADY_EXISTS: 'Email already exists',
//   FAILED_TO_FETCH_USERS: 'Failed to fetch users',
//   FAILED_TO_FETCH_USER: 'Failed to fetch user',
//   FAILED_TO_CREATE_USER: 'Failed to create user',
//   FAILED_TO_UPDATE_USER: 'Failed to update user',
//   FAILED_TO_DELETE_USER: 'Failed to delete user',

//   // Post 관련
//   POST_NOT_FOUND: 'Post not found',
//   TITLE_REQUIRED: 'Title is required',
//   AUTHOR_ID_REQUIRED: 'Author ID is required',
//   SEARCH_QUERY_REQUIRED: 'Search query is required',
//   FAILED_TO_FETCH_POSTS: 'Failed to fetch posts',
//   FAILED_TO_FETCH_POST: 'Failed to fetch post',
//   FAILED_TO_CREATE_POST: 'Failed to create post',
//   FAILED_TO_UPDATE_POST: 'Failed to update post',
//   FAILED_TO_DELETE_POST: 'Failed to delete post',
//   FAILED_TO_SEARCH_POSTS: 'Failed to search posts',
//   FAILED_TO_FETCH_PUBLISHED_POSTS: 'Failed to fetch published posts',
//   FAILED_TO_FETCH_USER_WITH_POSTS: 'Failed to fetch user with posts',
//   FAILED_TO_DELETE_POST_WITH_COMMENTS: 'Failed to delete post with comments',
//   FAILED_TO_CREATE_POST_WITH_COMMENT: 'Failed to create post with comment',
//   FAILED_TO_CREATE_MULTIPLE_POSTS: 'Failed to create multiple posts',
//   POSTS_ARRAY_REQUIRED: 'Posts array is required',
//   INVALID_POSTS_ARRAY: 'Posts must be an array',

//   // Auth 관련
//   NO_AUTH_TOKEN: 'No authentication token provided',
//   INVALID_TOKEN: 'Invalid or expired token',
//   USER_NOT_FOUND_FROM_TOKEN: 'User not found from token',
//   AUTH_FAILED: 'Authentication failed',
//   INVALID_CREDENTIALS: 'Invalid email or password',

//
// };
