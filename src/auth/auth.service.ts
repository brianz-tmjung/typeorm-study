import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

const JWT_SECRET = 'typeorm-study-secret';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  /**
   * 만들 기능
   *
   * 1) registerwithEmail
   *  -email,nickname,password를 입력받고 사용자를 생성
   *  -생성이 완료되면 accesstoken과 refreshtoken을 반환한다'
   * 회원가입 후 다시 로그인 해주세요<- 이런 과정을 제거
   *
   *
   * 2) login with email
   * -email password를 입력하면 사용자 검증을 진행
   * -검증이 완료되면 refresh token을 반환
   *
   * 3)loginuser
   * 1과 2에 필요한 accesstoken과 refreshtoken을 반환하는 로직
   *
   * 4)signToken
   *  -3에서 필요한 토큰을 생성하는 로직
   * 5) 검증하는로직
   *  -1. 사용자가 존재하는지
   *  -2. 비밀번호가 맞는지
   *   -3. 모두 통과되면 사용자 정보 반환
   *   -4.반환된 데이터를 기반으로 토큰 생성
   *
   *
   * 토큰 사용방식
   * 1)사용자가 로그인 또는 회원가입을 진행하면 accesstoken이나 refreshtoken발급
   *
   * 2)로그인할땐 BasicToken으로 요청을 보낸다
   * 3) 아무나 접근할수없는 정보는 accesstoken을 헤더에 추가해서 요청과 함께 보낸다
   * 4)토큰과 함께 요청을 받은 서버는 토큰 검증을 통해 사용자가 누구인지 알수있따
   * 5)모든 토큰은 만료 기간이 있다.
   * jwt.verify에서 인증이 실패한다.
   * 각각 access와 refresh 둘다 새로받는 기능이 필요하다
   * 6) 토큰이 만료되면 새로운 토큰을 받아야한다.
   */
  /**
   * Header로부터 토큰을 받을때
   * {authorization : 'Basic {token}'}
   * {authorization : 'Bearer {token}'}
   *
   */
  extractFromHeader(header: string, isBearer: boolean) {
    const splitToken = header.split(' ');

    const prefix = isBearer ? 'Bearer' : 'Basic';

    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new UnauthorizedException('잘못된 토큰입니다.');
    }

    const token = splitToken[1];

    return token;
  }
  /**
   * Basic Token을 디코딩하여 email과 password를 추출
   * base64로 인코딩된 'email:password' 문자열을 디코딩
   */
  decodeBasicToken(base64String: string) {
    const decoded = Buffer.from(base64String, 'base64').toString('utf-8');
    const split = decoded.split(':');

    if (split.length !== 2) {
      throw new UnauthorizedException('잘못된 토큰입니다.');
    }

    const [email, password] = split;

    return { email, password };
  }
  /**
   * 4) signToken
   * PayLoad에 들어갈 정보
   * 1) email
   * 2) sub -> id
   * 3) type : 'access' | 'refresh'
   */
  signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: isRefreshToken ? 3600 : 300,
    });
  }

  /**
   * 3) loginUser
   * signToken을 이용해서 accessToken과 refreshToken을 모두 반환
   */
  loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }

  /**
   * 1) registerWithEmail
   * email, nickname, password를 입력받고 사용자를 생성
   * 생성이 완료되면 accessToken과 refreshToken을 반환
   */
  async registerWithEmail(
    user: Pick<UsersModel, 'email' | 'nickname' | 'password'>,
  ) {
    const hash = await bcrypt.hash(user.password, 10);

    const newUser = await this.usersService.createUser(
      user.nickname,
      user.email,
      hash,
    );

    return this.loginUser(newUser);
  }

  /**
   * 2) loginWithEmail
   * email, password를 입력하면 사용자 검증을 진행
   * 검증이 완료되면 accessToken과 refreshToken을 반환
   */
  async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
    const existingUser = await this.authenticateWithEmailAndPassword(user);

    return this.loginUser(existingUser);
  }

  /**
   * 5) authenticateWithEmailAndPassword
   * 사용자가 존재하는지 확인
   * 비밀번호가 맞는지 확인
   * 모두 통과되면 사용자 정보 반환
   */
  async authenticateWithEmailAndPassword(
    user: Pick<UsersModel, 'email' | 'password'>,
  ) {
    // 1. 사용자가 존재하는지 확인
    const existingUser = await this.usersService.getUserByEmail(user.email);

    if (!existingUser) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }
    // 2. 비밀번호가 맞는지 확인
    const passOk = await bcrypt.compare(user.password, existingUser.password);
    if (!passOk) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다.');
    }

    // 3. 모두 통과되면 사용자 정보 반환
    return existingUser;
  }
}
