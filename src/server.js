import express from 'express';
import { prisma } from '#db/prisma.js';
import { config } from '#config';
import { router as apiRouter } from './routes/index.js';
import { setupGracefulShutdown } from '#utils';
import { errorHandler, cors } from '#middlewares';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import { HTTP_STATUS } from '#constants';

// ES Module 환경에서 __dirname 역할을 하는 변수 설정
const __filename = fileURLToPath(import.meta.url);
const __srcname = path.dirname(__filename); // src 폴더 위치
const rootPath = path.resolve(__srcname, '..'); // 프로젝트 루트 (src 밖으로)
const distPath = path.join(rootPath, 'dist'); // 루트에 있는 dist 폴더

const app = express();
if (config.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // 프록시 설정
  app.use(compression()); // 모든 응답을 압축해서 전송 렌더링 안 되는 게 혹시나 속도 문제일까봐 추가함
}

app.use(cors);
app.use(express.json());

app.use(express.static(distPath, {
  maxAge: '1d', // 배포 시에는 하루 동안 파일을 캐싱하도록 설정
  etag: true
}));
app.use('/assets', express.static(path.join(distPath, 'assets')));

app.use('/api', apiRouter);

app.use('/studies', (req, res) => {
  // 기존의 __dirname과 public 경로 대신, 위에서 정의한 distPath를 사용합니다.
  res.sendFile(path.join(distPath, 'index.html'), (error) => {
    if (error) {
      console.error("파일 전송 오류: dist 폴더에 index.html이 있는지 확인하세요.");
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: "화면 파일을 찾을 수 없습니다." });
    }
  });
});

app.get('/', (req, res) => {
  res.redirect('/');
});

app.use(errorHandler);

const server = app.listen(config.PORT, () => {
  console.log(
    `[${config.NODE_ENV}] Server running at http://study-forest.iptime.org:${config.PORT}`,
  );
  // 경로가 제대로 잡혔는지 확인용 로그
  console.log(`현재 dist 경로: ${distPath}`);
});

setupGracefulShutdown(server, prisma);