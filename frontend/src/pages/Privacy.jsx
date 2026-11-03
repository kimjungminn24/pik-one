import "../css/page.scss";
import "../css/privacy.scss";

const SERVICE = "단독스팟";
const EMAIL = "jmeve24@naver.com";
const EFFECTIVE_DATE = "2026년 11월 3일";

const SECTIONS = [
  {
    id: "purpose",
    title: "제1조(개인정보의 처리 목적)",
    body: (
      <>
        <p>
          {SERVICE}는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의
          목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」
          제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행합니다.
        </p>
        <ol>
          <li>회원 식별 및 로그인 상태 유지</li>
          <li>스팟 등록, 피드백, 좋아요 등 서비스 기능 제공</li>
          <li>의견 게시판을 통한 문의 및 제안 사항 확인과 답변</li>
        </ol>
      </>
    ),
  },
  {
    id: "items",
    title: "제2조(처리하는 개인정보의 항목)",
    body: (
      <>
        <p>{SERVICE}는 다음의 개인정보 항목을 처리하고 있습니다.</p>
        <ol>
          <li>
            회원가입 및 로그인(카카오, 네이버, 구글 소셜 로그인): 소셜 로그인 제공자 구분, 소셜
            로그인 제공자가 발급한 회원 식별값
          </li>
          <li>
            서비스 이용 과정에서 생성되는 정보: 서비스가 자동으로 부여한 닉네임, 가입 및 수정 일시,
            회원이 등록한 스팟 정보(위치 좌표, 종류, 설명), 피드백 및 좋아요 기록
          </li>
          <li>로그인 유지를 위한 접속 토큰(쿠키)</li>
          <li>
            의견 게시판(비회원 작성): 작성자가 입력한 닉네임, 이모지, 게시글 내용
          </li>
        </ol>
        <p>
          {SERVICE}는 소셜 로그인 제공자로부터 이름, 이메일 주소, 프로필 사진 등 위 항목 외의
          정보를 저장하지 않습니다.
        </p>
      </>
    ),
  },
  {
    id: "period",
    title: "제3조(개인정보의 처리 및 보유 기간)",
    body: (
      <>
        <p>
          {SERVICE}는 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터 개인정보를 수집할 때
          동의받은 개인정보 보유·이용 기간 내에서 개인정보를 처리·보유합니다.
        </p>
        <ol>
          <li>회원 정보 및 서비스 이용 기록: 회원 탈퇴 시까지</li>
          <li>로그인 유지를 위한 쿠키: 로그아웃 시 또는 쿠키 유효 기간 만료 시까지</li>
          <li>의견 게시판 게시글: 작성자의 삭제 요청 시까지</li>
        </ol>
      </>
    ),
  },
  {
    id: "destroy",
    title: "제4조(개인정보의 파기 절차 및 방법)",
    body: (
      <>
        <p>
          {SERVICE}는 개인정보 보유 기간의 경과, 처리 목적 달성 등 개인정보가 불필요하게 되었을
          때에는 지체 없이 해당 개인정보를 파기합니다.
        </p>
        <p>
          전자적 파일 형태로 기록·저장된 개인정보는 기록을 재생할 수 없도록 파기하며, {SERVICE}는
          종이 문서 형태로 개인정보를 처리하지 않습니다.
        </p>
      </>
    ),
  },
  {
    id: "share",
    title: "제5조(개인정보의 제3자 제공)",
    body: (
      <p>
        {SERVICE}는 정보주체의 개인정보를 제1조에서 명시한 범위 내에서만 처리하며, 정보주체의
        동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조 및 제18조에 해당하는 경우에만
        개인정보를 제3자에게 제공합니다.
      </p>
    ),
  },
  {
    id: "outsourcing",
    title: "제6조(개인정보 처리의 위탁)",
    body: (
      <>
        <p>{SERVICE}는 원활한 서비스 제공을 위하여 다음과 같이 개인정보 처리 업무를 위탁하고 있습니다.</p>
        <div className="privacy-table" role="table">
          <div className="privacy-table__row privacy-table__row--head" role="row">
            <span role="columnheader">수탁자</span>
            <span role="columnheader">위탁 업무</span>
          </div>
          <div className="privacy-table__row" role="row">
            <span role="cell">Amazon Web Services, Inc.</span>
            <span role="cell">서버 운영 및 데이터 보관</span>
          </div>
          <div className="privacy-table__row" role="row">
            <span role="cell">GitHub, Inc.</span>
            <span role="cell">의견 게시판 게시글 보관</span>
          </div>
        </div>
        <p>
          의견 게시판에 작성한 게시글은 의견 게시판과 GitHub에 공개됩니다. 게시글에 개인을 식별할
          수 있는 정보를 기재하지 않도록 유의하시기 바랍니다.
        </p>
      </>
    ),
  },
  {
    id: "rights",
    title: "제7조(정보주체의 권리·의무 및 행사 방법)",
    body: (
      <>
        <p>
          정보주체는 {SERVICE}에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를
          행사할 수 있습니다.
        </p>
        <p>
          권리 행사는 제10조의 개인정보 보호책임자에게 이메일로 하실 수 있으며, {SERVICE}는 이에
          대해 지체 없이 조치합니다.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "제8조(개인정보의 안전성 확보 조치)",
    body: (
      <>
        <p>{SERVICE}는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
        <ol>
          <li>전송 구간 암호화: 모든 통신을 HTTPS로 암호화합니다.</li>
          <li>접속 토큰 보호: 로그인 쿠키에 HttpOnly 및 Secure 속성을 적용합니다.</li>
          <li>접근 권한 관리: 개인정보를 처리하는 데이터베이스의 접근 권한을 운영자로 제한합니다.</li>
        </ol>
      </>
    ),
  },
  {
    id: "cookie",
    title: "제9조(개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항)",
    body: (
      <>
        <p>
          {SERVICE}는 로그인 상태를 유지하기 위해 쿠키를 사용합니다. 쿠키는 웹사이트를 운영하는 데
          이용되는 서버가 이용자의 브라우저에 보내는 소량의 정보이며, 이용자의 기기에 저장됩니다.
        </p>
        <p>
          이용자는 브라우저 설정에서 쿠키 저장을 거부할 수 있습니다. 다만 쿠키 저장을 거부할 경우
          로그인이 필요한 서비스 이용에 어려움이 있을 수 있습니다. {SERVICE}는 광고 또는 방문 분석
          목적의 쿠키를 사용하지 않습니다.
        </p>
      </>
    ),
  },
  {
    id: "officer",
    title: "제10조(개인정보 보호책임자)",
    body: (
      <>
        <p>
          {SERVICE}는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한
          정보주체의 불만 처리 및 피해 구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고
          있습니다.
        </p>
        <ul>
          <li>개인정보 보호책임자: {SERVICE} 운영자</li>
          <li>
            연락처: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "remedy",
    title: "제11조(권익침해 구제 방법)",
    body: (
      <>
        <p>
          정보주체는 개인정보 침해로 인한 구제를 받기 위하여 아래 기관에 분쟁 해결이나 상담 등을
          신청할 수 있습니다.
        </p>
        <ul>
          <li>개인정보분쟁조정위원회: (국번 없이) 1833-6972 (www.kopico.go.kr)</li>
          <li>개인정보침해신고센터: (국번 없이) 118 (privacy.kisa.or.kr)</li>
          <li>대검찰청: (국번 없이) 1301 (www.spo.go.kr)</li>
          <li>경찰청: (국번 없이) 182 (ecrm.police.go.kr)</li>
        </ul>
      </>
    ),
  },
  {
    id: "change",
    title: "제12조(개인정보 처리방침의 변경)",
    body: <p>이 개인정보 처리방침은 {EFFECTIVE_DATE}부터 적용됩니다.</p>,
  },
];

export default function Privacy() {
  const goTo = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="shell privacy">
      <aside className="shell__panel privacy__toc">
        <h1 className="shell__title">개인정보 처리방침</h1>
        <p className="shell__text privacy__date">시행일 {EFFECTIVE_DATE}</p>
        <nav aria-label="목차">
          <ol>
            {SECTIONS.map(({ id, title }) => (
              <li key={id}>
                <a href={`#${id}`} onClick={goTo(id)}>
                  {title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </aside>

      <article className="shell__main privacy__doc">
        <p className="privacy__lead">
          {SERVICE}는 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한
          고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을
          수립·공개합니다.
        </p>
        {SECTIONS.map(({ id, title, body }) => (
          <section key={id} id={id} className="privacy__section">
            <h2>{title}</h2>
            {body}
          </section>
        ))}
      </article>
    </div>
  );
}
