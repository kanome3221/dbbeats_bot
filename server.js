const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

// POST /webhook 핸들러
app.post("/webhook", (req, res) => {
  const raw = req.body?.message ?? "";
  const message = String(raw).trim();

  console.log("==== 새 요청 ====");
  console.log("받은 원본 메시지:", raw);
  console.log("trim 후 메시지:", message);

  let reply = "문의 감사합니다 🙂"; // 기본값

  // 1) 배송 관련 키워드
  if (message.includes("배송") || message.includes("언제")) {
    console.log("→ 배송 질문으로 인식");
    reply =
      "📦 배송 안내 드릴게요.\n" +
      "- 평일 오후 3시 이전 주문은 당일 출고됩니다.\n" +
      "- 평균 배송 기간은 출고 후 1~2일 정도 소요됩니다.\n" +
      "- 주말/공휴일 주문은 다음 영업일에 출고됩니다.";
  }
  // 2) 엑스붐 버즈 관련
  else if (message.includes("엑스붐") && message.includes("버즈")) {
    console.log("→ 엑스붐 버즈 질문으로 인식");
    reply =
      "🎧 엑스붐 버즈는 노이즈 캔슬링과 안정적인 블루투스 연결을 지원하는 무선 이어폰입니다.";
  } else {
    console.log("→ 어떤 규칙에도 안 걸려서 기본 답변 사용");
  }

  return res.json({ reply });
});

// GET / (헬스 체크)
app.get("/", (req, res) => {
  res.send("DBBeats Bot 서버 정상 작동 중 🚀");
});

app.listen(PORT, () => {
  console.log(`서버 실행됨: http://localhost:${PORT}`);
});