export const calculateDaysFromNow = (dateString: string): number => {
  // 受け取った日付文字列をDateオブジェクトに変換
  const inputDate = new Date(dateString);

  // 現在の日付を取得し、時間部分を切り捨てて日付のみを比較
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0); // inputDateも同様に時間部分を切り捨てる

  // 両日付のタイムスタンプを取得
  const inputTime = inputDate.getTime();
  const currentTime = currentDate.getTime();

  // タイムスタンプの差をミリ秒単位で計算
  const timeDifference = inputTime - currentTime;

  // ミリ秒を日に変換（1日 = 24時間 * 60分 * 60秒 * 1000ミリ秒）
  const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

  // 日数の差を整数に変換し、未来の日付ならそのまま返し、過去の日付なら0を返す
  return daysDifference >= 0 ? Math.floor(daysDifference) : 0;
};
