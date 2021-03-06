import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { accessTokenGenerator } from '../../jwt/GenerateAccessToken';
import { refreshTokenGenerator } from '../../jwt/GenerateRefreshToken';

import { User } from '../../entity/User';

export const emailLogin = async (req: Request, res: Response) => {
  console.log('email ๋ก๊ทธ์ธ ๐น');

  // ์๋ ฅํ ์ด๋ฉ์ผ ๊ณ์ ์ด ์กด์ฌํํ๋์ง ํ์ธ
  const { email, password } = req.body;
  const userInfo = await User.findOne({ email });

  // ์ด๋ฉ์ผ ๊ณ์ ์ด ์๋ค๋ฉด
  if (!userInfo) {
    return res.status(404).json({ message: '์๋ ฅํ ์ด๋ฉ์ผ ์ฃผ์๋ก ๋ฑ๋กํ ํ์ ์ ๋ณด๊ฐ ์์ต๋๋ค. ํ์๊ฐ์ ํด์ฃผ์ธ์.' });
  }

  // ์นด์นด์ค ๊ณ์ ์ธ ๊ฒฝ์ฐ email ๋ก๊ทธ์ธ ์ฐจ๋จ
  if (userInfo.signupType === 'kakao') {
    return res
      .status(400)
      .json({ message: '์นด์นด์ค ์ฐ๋ ํ์์๋๋ค. ์นด์นด์ค ์์ ๋ก๊ทธ์ธ ๋๋ ์ด๋ฉ์ผ ํ์ ๊ฐ์์ ์งํํด์ฃผ์ธ์.' });
  }

  // ๋น๋ฐ๋ฒํธ ๊ฒ์ฆ
  try {
    const verifiedPassword = bcrypt.compare(password, userInfo.password);
  } catch (err: any) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }

  // ํ ํฐ ์์ฑ ํ ์ ์ก
  const accessToken = await accessTokenGenerator(userInfo.id, userInfo.email);
  const refreshToken = await refreshTokenGenerator(userInfo.id, userInfo.email);

  res
    .status(200)
    .cookie('refreshToken', refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })
    .json({ id: userInfo.id, accessToken, loginType: userInfo.signupType, message: 'email ๋ก๊ทธ์ธ ์ฑ๊ณต' });
};
