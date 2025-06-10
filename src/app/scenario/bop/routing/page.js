export default function BopPage() {
  return (
    <div
      style={{
        padding: 16,
        whiteSpace: "normal",     // ✅ 줄바꿈 허용
        wordBreak: "keep-all",    // ✅ 한글 단어 단위 유지
        width: "100%",            // ✅ 부모 영역 꽉 채움
        maxWidth: "100%",         // ✅ 혹시라도 제한 있으면 무시
      }}
    >
      <h2 style={{ marginBottom: 8 }}>생산 프로세스</h2>
      <p>여기에 생산 프로세스 관련 테이블 넣기</p>
    </div>
  );
}
