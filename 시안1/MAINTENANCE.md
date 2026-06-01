# 시안1 유지보수 가이드

## 파일 구조 (정리 후)

| 경로 | 역할 |
|------|------|
| `index.html` | 마크업·섹션 HTML (~1,700줄) |
| `css/site.css` | 커스텀 스타일 (~2,300줄) |
| `js/site.js` | 인터랙션 스크립트 (~1,750줄) |
| `scripts/` | UTF-8 안전 패치·검증 도구 |
| `assets/` | 이미지·SVG |

브라우저에서 `index.html`을 열면 `./css/site.css`, `./js/site.js`가 함께 로드됩니다.

---

## 반응형 브레이크포인트 (고정 기준)

| 구분 | 조건 | 비고 |
|------|------|------|
| **폰 모바일** | `max-width: 719px` | 일반 스마트폰 |
| **iPad Mini 세로** | `width: 768px` + `orientation: portrait` | 미니 세로만 |
| **iPad Air 세로** | `width: 820px` + `orientation: portrait` | 에어 세로만 |
| **iPad Pro 세로** | `width: 1024px` + `orientation: portrait` | 프로 세로만 |
| **모바일 레이아웃** | 위 4가지를 OR로 묶음 | 햄버거·40px 거터·6카드 미디어룸 등 |
| **720px+ 데스크톱 UI** | `min-width: 720px` 이면서 **768·820·1024 세로 제외** | 패드 가로·일반 태블릿 |

**주의:** 범위(`720~1024 portrait`)로 잡지 않는다. 패드 세로는 **768·820·1024 세 해상도만** 모바일과 동일하게 처리한다.

CSS·JS·패치 스크립트에서 동일 문자열을 쓸 때:

```js
const { MQ_MOBILE, MQ_PAD_PORTRAIT, MQ_DESKTOP_720_AT } = require("./breakpoints");
```

`js/site.js`의 `matchMedia`와 `css/site.css`의 `@media`는 위 표와 같은 조건을 사용한다.

---

## 한글이 깨지는 이유 (파일이 지저분해서가 아님)

**원인은 “파일 길이”보다 “수정 방식”입니다.**

1. **에디터 일괄 치환(StrReplace)으로 한글 문자열을 직접 바꿈**  
   Cursor/VS Code 치환이 UTF-8이 아닌 인코딩으로 저장되면 `???`로 깨집니다.  
   **한글 문구가 들어간 `index.html`은 에디터 치환으로 수정하지 마세요.**

2. **체크포인트 복구**  
   `_restore-from-checkpoint.js` 실행 시 최신 작업(모바일 메뉴·패치 등)이 사라질 수 있습니다.

3. **여러 `_patch-*.js`를 반복 실행**  
   앵커 문자열이 어긋나면 일부만 적용되거나 JS가 잘릴 수 있습니다.  
   (예: 접근성 패치가 `site.js`의 잘못된 위치를 건드린 사례 → `repair-site-js.js`로 복구)

**대용량 단일 HTML이 불편했던 것은 사실**이며, 그래서 CSS/JS를 분리했습니다.  
분리 후에는 **한글은 HTML에, 로직 앵커는 영문 id/클래스**로 두면 패치가 안전해집니다.

---

## 안전한 수정 절차

### 1) 수정 전·후 검증

```bash
node scripts/verify-encoding.js
```

- `index.html`에 `엔터프라이즈 IT 파트너`가 있는지
- `???` 문자가 없는지 확인합니다.

### 2) 한글/대량 변경

- **Node 스크립트**만 사용: `fs.readFileSync(path, "utf8")` → 수정 → `writeFileSync`
- 새 패치는 `scripts/`에 추가하고, 기존 `_patch-*.js`(루트)는 **사용하지 않음** (archive 참고용)

### 3) CSS만 변경

- `css/site.css` 직접 편집 가능 (주석·속성명은 영문 위주)
- 저장 후 `verify-encoding.js` 실행

### 4) JS만 변경

- `js/site.js` 직접 편집 가능
- 한글 **문자열**을 넣을 때는 파일 인코딩 UTF-8 확인

### 5) HTML 구조·한글 카피 변경

- `index.html` 편집 시 저장 인코딩 UTF-8
- 가능하면 스크립트로 치환하거나, 짧은 문구만 수동 수정 후 즉시 `verify-encoding.js`

### 6) 자산 다시 합치기(필요 시)

```bash
node scripts/split-assets.js   # 인라인 style/script → css·js (이미 분리된 상태면 생략)
```

---

## scripts 명령어

| 스크립트 | 용도 |
|----------|------|
| `breakpoints.js` | 공통 MQ 상수 (폰 719 / iPad Mini·Air·Pro 세로 768·820·1024) |
| `verify-encoding.js` | 한글·깨짐 검사 (**항상 먼저**) |
| `split-assets.js` | HTML에서 CSS/JS 분리 |
| `repair-site-js.js` | `site.js` 누락 블록 복구 |
| `patch-a11y.js` | HTML 접근성 보완 |
| `fix-js-comments.js` | JS 주석 깨짐 복구 |
| `restore-from-checkpoint.js` | Cursor 체크포인트로 index만 복구 (최후 수단) |

---

## 웹접근성 (KWCAG 2.2 / WCAG 2.2 기준 반영)

이미 적용된 항목:

- `lang="ko"`, `charset="UTF-8"`
- **본문 바로가기** (`#content`)
- `header` / `main` / `footer` / `section` 랜드마크
- 페이지 `h1`(히어로), 섹션 `h2`
- GNB·모바일 메뉴 `aria-label`, `aria-expanded`, `aria-controls`, `aria-labelledby`
- 모바일 메뉴 **포커스 트랩**(Tab 순환), Esc 닫기, 닫을 때 버튼으로 포커스 복귀
- 준비중 링크 `aria-disabled` + `tabindex="-1"`
- 문의 폼 `label`/`for`, 필수 `abbr`, `aria-labelledby`, `aria-live` 토스트
- `prefers-reduced-motion` CSS·JS 대응
- 장식 이미지 `alt=""`, `aria-hidden` 아이콘

추가 권장(향후):

- 색 대비 4.5:1 점검(디자인 토큰)
- 키보드로 GNB 메가메뉴 전체 탐색(현재 hover 중심)
- 실제 전송 API 연동 시 서버 검증·오류 메시지 `aria-invalid`

---

## 루트의 `_patch-*.js` 파일

과거 일괄 패치용입니다. **새 작업에는 `scripts/`만 사용**하고, 루트 `_patch-*`는 `scripts/archive/`로 옮겨 두었습니다.
