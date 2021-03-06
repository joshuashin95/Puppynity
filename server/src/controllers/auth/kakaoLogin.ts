import { Request, Response } from 'express'
import axios from 'axios'

import { User } from '../../entity/User'

import dotenv from 'dotenv'
dotenv.config()

export const kakaoLogin = async (req: Request, res: Response) => {
  console.log('kako ๋ก๊ทธ์ธ ๐น')
  const { authorizationCode } = req.body
  try {
    // ์นด์นด์ค์ ํ ํฐ ๋ฐ๊ธ ์์ฒญ
    const kakaoTokenResp = await axios.post(
      `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}&code=${authorizationCode}`,
    )
    const { access_token, refresh_token, expires_in, scope, refresh_token_expires_in } = kakaoTokenResp.data
    console.log(access_token)

    // ์นด์นด์ค์ ์ ์  ์ ๋ณด ์กฐํ
    const kakaoInfoApiResp = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/x-www-form-urlencoded;charset=utf-8',
      },
    })
    // ํ์ ๋์ ํญ๋ชฉ ์ฒดํฌ์
    const { id: kakaoId } = kakaoInfoApiResp.data
    //! ์ฌ์ง ์๋ก๋ ๊ตฌํ์ db์ ํ๋กํ ์ฌ์ง๋ ์๋ก๋ ๋๋๋ก ํด์ผํจ
    const { nickname, profile_image, thumbnail_image } = kakaoInfoApiResp.data.properties

    // DB์ ์ด๋ฏธ ๋ฑ๋ก๋ kakaoId๊ฐ ์๋์ง ํ์ธ
    const userInfo = await User.findOne({ kakaoId })

    // ์ด๋ฏธ ์นด์นด์ค ์ฐ๋๋ ํ์์ธ ๊ฒฝ์ฐ
    if (userInfo) {
      return res.status(200).json({
        id: userInfo.id,
        nickname: userInfo.nickname,
        accessToken: access_token,
        loginType: userInfo.signupType,
        message: '์นด์นด์ค ๋ก๊ทธ์ธ ์ฑ๊ณต',
      })
    }

    // ํ์ ์ ๋ณด ์ ์ฅ
    const createdUser = new User()
    createdUser.nickname = nickname
    createdUser.kakaoId = kakaoId
    createdUser.signupType = 'kakao'
    createdUser.save()

    res
      .cookie('refreshToken', refresh_token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })
      .status(201)
      .json({
        id: createdUser.id,
        accessToken: access_token,
        nickname: createdUser.nickname,
        loginType: createdUser.signupType,
        message: '์นด์นด์ค ํ์ ์ ๋ณด ์์ฑ ๋ฐ ๋ก๊ทธ์ธ ์ฑ๊ณต',
      })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err })
  }
}
