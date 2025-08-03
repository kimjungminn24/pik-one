

> 💡 이 서비스는 **피크민 블룸**이라는 게임을 기반으로 한 팬 커뮤니티 기반의 웹 서비스입니다. 

> [🔗 사이트 바로가기](https://pikonlyspot.com/)

### 🧠 이런 고민을 했어요
- [위치 기반 반경 검색 성능을 인덱스 구조별로 비교해봤어요](https://www.notion.so/22011869caca80b1af8af5cb78255149?v=21b11869caca80d2b2e6000c266c30af&source=copy_link)
- [지도를 한번만 움직였을 뿐인데 서버가 울어요](https://www.notion.so/22b11869caca8065bd83d8ad6aef52a8?v=21b11869caca80d2b2e6000c266c30af&source=copy_link)
- [N+1 문제 해결하기](https://www.notion.so/N-1-22611869caca806bad77c349419d036b?v=21b11869caca80d2b2e6000c266c30af&source=copy_link)
- [악의적인 요청 차단하기](https://www.notion.so/22d11869caca8007b7bbfc95f4131d4e?v=21b11869caca80d2b2e6000c266c30af&source=copy_link)
- [의견 제보 기능을 만들어보자](https://www.notion.so/Github-22d11869caca80b1acedfb23f58bea3f?v=21b11869caca80d2b2e6000c266c30af&source=copy_link)
- [서비스 사용량을 측정해보자 & 홍보 하기](https://www.notion.so/22f11869caca80238ce0e4691ccc5d2d?v=21b11869caca80d2b2e6000c266c30af&source=copy_link)
- [왜 JPA 연관관계에서 편의 메서드를 써야할까?](https://www.notion.so/JPA-JPA-22b11869caca80799087fdcc80eea461?v=21b11869caca80d2b2e6000c266c30af&source=copy_link)


### 🎮 피크민 블룸이란?

- 닌텐도의 위치 기반 모바일 게임입니다.
- 유저는 실제 지도를 따라 걷고, 모종을 수집합니다.
- 모종을 심고 키우면 데코 피크민이라는 꾸며진 피크민이 자라납니다.
- 데코의 종류는 주로 모종을 얻은 장소의 유형에 따라 결정됩니다. (예: 영화관, 편의점, 카페 등)
- 하루에 한 번, 원하는 위치에서 탐지기를 사용해 모종을 찾을 수 있습니다.

---

### 🌟 단독 스팟이란?

- 특정 장소에서 오직 하나의 데코 타입 모종만 등장하는 장소입니다.
- 예를 들어 어떤 편의점에서 탐지기를 사용했을 때, '편의점 데코' 모종만 나오는 경우가 여기에 해당합니다.

> 일반적인 장소에서는 여러 데코 타입의 모종이 혼합되어 나오기 때문에, 단독 스팟은 원하는 데코 피크민을 빠르게 수집할 수 있는 효율적인 장소입니다.
> 

### 🤔 왜 이 서비스가 필요한가요?

- 기존에는 단독 스팟이 카페 글, 지도 좌표, 스크린샷 형태로만 공유되어 원하는 위치를 찾기 어렵고, 최신 정보인지 확인하기 힘들었습니다.
- 특정 데코를 수집하고 싶은 유저는 원하는 지역 + 원하는 데코 조건을 직접 필터링하고 싶어 합니다.
- 새로운 데코가 출시되면 기존 스팟의 단독성이 사라질 수도 있어, 유저 간 피드백을 통해 실시간으로 유효성을 검증할 수 있는 구조가 필요했습니다.

> 예) 실제  팬카페에서 단독 스팟을 공유하는 방식
> 
> 
> <img width="925" height="265" alt="image" src="https://github.com/user-attachments/assets/2f57a64e-6e3f-481c-be9a-ca276faf7ff8" />

> 

📈 현재 구글 애널리틱스 기준 활성 사용자 수는 약 2,500명이며, [네이버 피크민 팬카페](https://cafe.naver.com/pikmins?iframe_url_utf8=%2FArticleRead.nhn%253Fclubid%3D30588265%2526articleid%3D369383%2526commentFocus%3Dtrue)에 필독 게시물로 등록되어 활발히 사용되고 있습니다



### 🛠️ 주요 기능

- **단독 스팟 등록 :** 사용자가 직접 위치 기반으로 단독 스팟을 등록할 수 있습니다.
- **위치 및 태그 기반 검색 :** 지도에서 원하는 지역을 선택하고, 카페/영화관/편의점 등 데코 유형 태그로 필터링해 검색할 수 있습니다.
- **유저 피드백 시스템 :** 해당 스팟이 지금도 단독인지, 아니면 변경되었는지 다른 유저의 의견을 통해 확인할 수 있습니다.
<img width="1912" height="870" alt="image" src="https://github.com/user-attachments/assets/7ec42bfb-3251-4c8d-9644-f3ef11c7bfbf" />

