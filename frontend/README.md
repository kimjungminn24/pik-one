# 단독스팟 프론트엔드

React 19 + Vite. 지도는 react-leaflet, 서버 상태는 React Query, 번역은 i18next(ko, en, ja).

## 실행

`.env`에 두 값을 넣습니다.

- `VITE_BACKEND_URL`: 백엔드 주소
- `VITE_OSM_API`: 장소 검색에 쓰는 OpenStreetMap 검색 주소

```bash
npm install
npm run dev
```

http://localhost:3000 에서 열립니다.

```bash
npm run build
```

```bash
npm run lint
```

## 웹폰트 서브셋

이모지(TossFace)는 원본이 커서 실제로 쓰는 이모지만 남긴 woff2를 씁니다. 일본어 한자는 기기에 있는 일본어 폰트로 보여 줍니다.

- 원본: `fonts-src/` (배포되지 않음)
- 결과: `public/fonts/tossface-*.woff2`, `src/css/_tossface.scss`(자동 생성)
- 화면 이모지(ui)와 의견에 자주 쓰는 이모지(faces, hearts, misc) 조각으로 나뉘고, 조각마다 `unicode-range`가 있어 그 이모지가 화면에 있을 때만 받습니다.
- 데코 종류나 이모지를 바꾸면 다시 만들어 커밋합니다.

```bash
npm run fonts:subset
```

TossFace는 비트맵(sbix) 폰트라 일반 서브셋 도구로는 그림이 빠집니다. 그래서 스크립트가 쓰는 이모지의 PNG만 남기고 나머지를 비우는 방식으로 줄입니다.
