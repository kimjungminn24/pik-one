// 로그인하지 않고 남긴 피드백은 서버가 누군지 몰라서, 같은 기기에서 같은 스팟에 또 남기지 않게 여기 기억해 둔다
const KEY = "anon-feedback";

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};

export const hasAnonVote = (decorId) => read().includes(decorId);

export const rememberAnonVote = (decorId) => {
  const ids = read();
  if (ids.includes(decorId)) return;
  try {
    localStorage.setItem(KEY, JSON.stringify([...ids, decorId]));
  } catch {
    // 저장소를 못 쓰는 브라우저면 기억만 못 할 뿐 피드백은 이미 보냈다
  }
};
