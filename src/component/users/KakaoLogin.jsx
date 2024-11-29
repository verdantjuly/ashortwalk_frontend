function KakaoLogin() {
  const { Kakao } = window;
  async function StartKakao() {
    try {
      const response = await fetch(
        `https://shortwalk-f3byftbfe4czehcg.koreacentral-01.azurewebsites.net/api/auth/kakaokey`,
        {
          method: "POST",
        }
      );
      const result = await response.json();

      await Kakao.init(result.kakaoJSKey);
      await Kakao.Auth.authorize({
        redirectUri: result.kakaoRedirectURI,
      });
    } catch (err) {}
  }

  StartKakao();

  return <></>;
}

export default KakaoLogin;
