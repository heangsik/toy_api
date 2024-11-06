const bcrypt = require('bcrypt');

// 비밀번호 해싱 테스트
async function testBcrypt() {
  try {
    // 테스트할 비밀번호
    const password = 'qqqq';
    const hashpassword =
      '$2b$10$dYVZN0OwGgoTiwTXz3tmQeUDSMJh7tgWmbuWlqwmhQn1yOlQ0HJgO';

    // 솔트 라운드 설정 (보통 10~12 추천)
    const saltRounds = 10;

    // // 비밀번호 해싱
    // console.log('원본 비밀번호:', password);
    // const hash = await bcrypt.hash(password, saltRounds);
    // console.log('해시된 비밀번호:', hash);

    // 비밀번호 검증 테스트
    const isMatch1 = await bcrypt.compare(password, hashpassword);
    console.log('올바른 비밀번호 검증:', isMatch1); // true

    // 잘못된 비밀번호 테스트
    const isMatch2 = await bcrypt.compare('1111', hashpassword);
    console.log('잘못된 비밀번호 검증:', isMatch2); // false
  } catch (error) {
    console.error('에러 발생:', error);
  }
}

// 테스트 실행
testBcrypt();
