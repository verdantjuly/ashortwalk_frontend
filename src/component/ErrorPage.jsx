export default function ErrorPage({ error, resetErrorBoundary }) {
  return (
    <div>
      <p>에러 메시지: {error}</p>
      <button onClick={() => resetErrorBoundary()}>다시 시도</button>
    </div>
  );
}
