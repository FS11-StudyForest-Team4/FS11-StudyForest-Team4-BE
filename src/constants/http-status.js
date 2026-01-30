// HTTP 상태 코드 상수
export const HTTP_STATUS = {
  OK: 200, //GET, PUT 성공
  CREATED: 201, //POST 생성
  NO_CONTENT: 204, //DELETE 성공
  BAD_REQUEST: 400, //잘못된 요청, 필드 누락
  UNAUTHORIZED: 401, 
  NOT_FOUND: 404, //찾을 수 없음, 존재하지 않음
  CONFLICT: 409, //충돌
  INTERNAL_SERVER_ERROR: 500, //서버 에러
};
