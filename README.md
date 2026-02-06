# 포기없4_FS11-part2-team4
[공부의 숲 포기없4🔥](https://www.notion.so/youngbase/4-2eefb8f030b080669063f412b6ff6655)

## 프로젝트 소개
### 개요
- 개인 공부 관리 및 커뮤니티 서비스
- 프로젝트 기간: 2026.01.20 ~ 2026.02.06
- 배포 사이트 🚀 : http://study-forest.iptime.org:5001/


### 팀원 구성
- 박영서 - https://github.com/YoungSeo1104
- 김성민 - https://github.com/neraziim
- 박가연 - https://github.com/qlwlsmwoddl0813-wq
- 전주형 - https://github.com/JoohyoungJun
- 이하림 - https://github.com/sumforest-ha
- 김현제 - https://github.com/ranflir


## 기술 스택
### 🔧 프레임워크 / 언어 (Framework / Language)
- **Node.js + Express / JavaScript**
    → 가볍고 확장성이 좋은 웹 서버 프레임워크로 REST API 서버 구축
    
### 🧠 데이터베이스
- **PostgreSQL**
    -   스키마 구조가 명확하고 정교한 관계형 데이터 처리가 가능한 오픈소스
- **Prisma ORM**
    - 타입 세이프(Type-safe)한 데이터베이스 쿼리
    - Prisma Schema 기반 데이터 모델링
    - Migration을 통한 스키마 버전 관리
    - 관계형 데이터(1:N, N:M) 모델링 지원

### 🌐 API

- **RESTful API 구조**
    - 자원 중심(URL) 설계
    - HTTP Method 기반 처리 (GET, POST, PATCH, DELETE)
- **JWT 기반 인증/인가**
    - Access Token / Refresh Token 사용
- **Zod 기반 데이터 검증**
    - 스키마 기반의 선언적 유효성 검사로 데이터 정합성 보장 및 런타임 에러 최소화
- **Middleware 구조**
    - 인증 미들웨어
    - 에러 핸들링 미들웨어
    - 요청 검증 미들웨어

---

## 🚀 배포 플랫폼
- **리눅스 서버 구축**
    - VirtualBox를 활용한 Linux 가상 서버 환경 구축 및 배포 자동화 지원
    - DDNS와 포트포워딩 설정을 통한 외부 접속 및 팀 공용 데이터베이스 인프라 운용
    - 프론트엔드 빌드 결과물(Static Assets) 이식: 별도의 호스팅 없이 단일 서버 내 통합 배포로 네트워크 오버헤드 최소화
    
- **환경 변수 분리**
    - 개발 / 운영 환경 구분

---

## 🤝 협업

- **Git + GitHub**
    - feature 브랜치 전략
    - Pull Request 기반 코드 리뷰
      
- **Notion**
    - API 명세서
    - ERD
    - 일정 관리

