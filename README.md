# Lumen Search

OpenRouter 웹 검색 플러그인과 AI를 사용하는 Cloudflare Workers 검색 앱입니다. 질문마다 실제 웹 검색을 요청하고 OpenRouter가 반환한 출처를 표시합니다. 출처를 반환하지 않은 경우 검색을 검증할 수 없다고 표시합니다. 후속 질문에는 현재 대화 내용이 함께 전송됩니다.

## 배포

1. Node.js 20 이상과 Cloudflare 계정, OpenRouter API 키 및 크레딧을 준비합니다.
2. `npm install` 후 `npx wrangler login`을 실행합니다.
3. `npx wrangler secret put OPENROUTER_API_KEY`를 실행하고 키를 입력합니다. 키를 코드나 GitHub에 올리지 마세요.
4. `npm run deploy`를 실행합니다. 출력된 workers.dev 주소로 접속합니다.
5. 모델을 바꾸려면 `wrangler.jsonc`의 `OPENROUTER_MODEL`을 수정하고 다시 배포합니다. OpenRouter 웹 검색 플러그인과 호환되는 모델을 사용하세요.

로컬 개발은 `.dev.vars` 파일에 `OPENROUTER_API_KEY=키`를 넣고 `npm run dev`를 실행합니다. `.dev.vars`는 Git에서 제외됩니다. `npm test`로 서버의 입력 검증 및 응답 처리를 점검합니다.

## 운영 안내

웹 검색과 모델 사용에는 OpenRouter 요금이 발생할 수 있습니다. 이 예제는 공개 서비스용 사용자 인증이나 요청 제한을 제공하지 않으므로 공개 배포 전 Cloudflare의 접근 제어 및 속도 제한, OpenRouter 키의 지출 한도를 설정하세요. 브라우저에 API 키를 보내지 않으며, 대화는 현재 브라우저 탭의 메모리에만 보관됩니다. 질문과 대화 내용은 응답 생성 및 검색을 위해 OpenRouter와 관련 검색·모델 제공자에게 전달됩니다.
