// server.js
const express = require('express');
const app = express();

app.use(express.json());

// Render에서 사용하는 포트
const PORT = process.env.PORT || 3000;

// 톡톡이 기대하는 응답 JSON 만들기
function buildReply(text) {
  return {
    event: 'send',
    textContent: {
      text,
    },
  };
}

app.post('/webhook', (req, res) => {
  console.log('=== 새 요청 ===');
  console.log('원본 body:', JSON.stringify(req.body));

  const body = req.body || {};

  // 1) 우리가 테스트용으로 보내던 { message: "..." }
  // 2) 톡톡의 send 이벤트 형식 { event: "send", textContent: { text: "..." } }
  let userText = '';

  if (typeof body.message === 'string') {
    userText = body.message.trim();
  } else if (
    body.textContent &&
    typeof body.textContent.text === 'string'
  ) {
    userText = body.textContent.text.trim();
  }

  console.log('사용자 텍스트:', userText);

  let replyText = '문의 감사합니다 😊';

  const lower = userText.toLowerCase();

  // 배송 관련 규칙
  if (lower.includes('배송') || lower.includes('언제') || lower.includes('출고')) {
    replyText =
      '📦 배송 안내 드릴게요.\n' +
      '- 평일 오후 3시 이전 주문은 당일 출고됩니다.\n' +
      '- 평균 배송 기간은 출고 후 1~2일 정도 소요됩니다.\n' +
      '- 주말/공휴일 주문은 다음 영업일에 출고됩니다.';
  }
  // 교환/반품/환불 규칙 예시
  else if (
    lower.includes('교환') ||
    lower.includes('반품') ||
    lower.includes('환불')
  ) {
    replyText =
      '↩️ 교환/반품 안내입니다.\n' +
      '- 제품 수령 후 7일 이내 미개봉 상품은 교환/반품이 가능합니다.\n' +
      '- 초기 불량의 경우 왕복 배송비는 저희가 부담합니다.\n' +
      '- 단순 변심의 경우 왕복 배송비가 부과될 수 있습니다.';
  }

  // 톡톡이 이해하는 형식으로 응답
  res.json(buildReply(replyText));
});

// 헬스 체크용
app.get('/', (req, res) => {
  res.send('DBBeats Bot is running');
});

app.listen(PORT, () => {
  console.log(`서버 실행됨: http://localhost:${PORT}`);
});