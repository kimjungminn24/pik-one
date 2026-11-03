# 배포

`release` 브랜치에 올라가면 GitHub Actions(`.github/workflows/deploy.yml`)가 EC2에 배포합니다.

1. 백엔드 jar와 프론트 빌드를 서버로 복사
2. jar를 바꾸고 `systemctl restart pik-one-backend`
3. 60초 안에 `/actuator/health`가 `UP`이 아니면 이전 jar로 되돌리고 워크플로 실패

## 서버 구성

| 무엇 | 어디 |
|---|---|
| 백엔드 서비스 | `/etc/systemd/system/pik-one-backend.service` (이 폴더의 파일) |
| 비밀값 | `/etc/pik-one/backend.env` (권한 600) |
| jar | `/home/ubuntu/app/pik-one/backend/backend-0.0.1-SNAPSHOT.jar` |
| 직전 jar | 같은 폴더 `backend-0.0.1-SNAPSHOT.jar.prev` |
| 에러 로그 | `/home/ubuntu/app/pik-one/backend/logs/error.json` |
| 전체 로그 | `journalctl -u pik-one-backend` |

GitHub Secrets에는 서버 접속 정보(`EC2_HOST`, `EC2_USER`, `EC2_KEY`)와 프론트 빌드용 `FRONTEND_ENV`만 있으면 됩니다.

## 비밀값 바꾸기

```bash
sudo nano /etc/pik-one/backend.env
sudo systemctl restart pik-one-backend
curl -s http://localhost:8080/actuator/health
```

`{"status":"UP"}`이 나오면 끝입니다. 한 줄에 `이름=값` 하나씩, 따옴표 없이 씁니다.

## 자주 쓰는 명령

```bash
sudo systemctl status pik-one-backend      # 지금 상태
sudo journalctl -u pik-one-backend -f      # 로그 따라 보기
sudo systemctl restart pik-one-backend     # 다시 시작
```

## 이전 버전으로 직접 되돌리기

```bash
cd /home/ubuntu/app/pik-one/backend
mv backend-0.0.1-SNAPSHOT.jar.prev backend-0.0.1-SNAPSHOT.jar
sudo systemctl restart pik-one-backend
```
