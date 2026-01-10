export const TodoPage = () => {
  return (
    <main className="w-full min-w-[360px] h-full flex flex-col items-center pt-4">
      <div className="w-full h-full flex flex-col items-center gap-6  px-6">
        <section className="flex flex-col w-full">
          <h2>2026년 1월</h2>
          <div className="flex gap-2 -mx-6 w-screen">
            <ul>
              <li className="min-w-14 min-h-14">일</li>
            </ul>
          </div>
        </section>

        <div className="w-full flex flex-col gap-6">
          <div className="w-full h-[232px] max-h-[232px]">
            <section>
              <h2>오늘 할 일</h2>
              <p>자기 전까지 꼭 끝낼 일</p>
            </section>
          </div>

          <div className="w-full h-[207px] min-h-[207px]">
            <section>
              <h2>할 일 목록</h2>
              <p>생각나는 일 모두 적기</p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};
