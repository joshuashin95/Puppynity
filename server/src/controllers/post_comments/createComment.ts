import { Request, Response } from 'express';

import { Post } from '../../entity/Post';
import { User } from '../../entity/User';
import { Post_comment } from '../../entity/Post_comment';

export const createComment = async (req: Request, res: Response) => {
  console.log('๋๊ธ ์์ฑ ๐น');

  //? ์ POST psts/:id ์์ฒญ body์ userId๋ฅผ ๋ด์ผ๋ผ๋์ง ๋น์ต ์ดํด๊ฐ ๋์ง ์๋๋ค.
  const userId = req.userId;
  const postId = Number(req.params.postId);
  const { content } = req.body;

  if (!postId) {
    return res.status(400).json({ message: '๊ฒ์๋ฌผ์ postid(pk)๋ฅผ path์ ๋ด์์ฃผ์ธ์.' });
  }

  const userInfo = await User.findOne({ id: userId });

  if (userInfo === undefined) {
    return res.status(403).json({ message: '์ ์ ์ ํ์ ์ ๋ณด๊ฐ ์์ต๋๋ค' });
  }

  const postDetail = await Post.findOne({ id: postId });

  if (postDetail === undefined) {
    return res.status(404).json({ message: '๋๊ธ์ ๋ฌ ๊ฒ์๋ฌผ์ด ์กด์ฌํ์ง ์์ต๋๋ค.' });
  }

  const createdComment = await Post_comment.create({ content, writer: userInfo, post: postDetail });
  await createdComment.save();
  createdComment.writer.password = '';

  const comment = {
    id: createdComment.id,
    content: createdComment.content,
    createdAt: createdComment.createdAt,
    updatedAt: createdComment.updatedAt,
    writer: createdComment.writer,
  };
  res.status(201).json({ comment, messgage: '๋๊ธ์ด ์์ฑ๋์์ต๋๋ค.' });

  //* ์ค๋ณต ๋๊ธ ๋ฑ๋ก ๋ฐฉ์ง
};
