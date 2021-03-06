import { Request, Response } from 'express';

import { Post } from '../../entity/Post';
import { User } from '../../entity/User';
import { Post_comment } from '../../entity/Post_comment';

export const deleteComment = async (req: Request, res: Response) => {
  console.log('๋๊ธ ์ญ์  ๐น');

  //? ์ POST psts/:id ์์ฒญ body์ userId๋ฅผ ๋ด์ผ๋ผ๋์ง ๋น์ต ์ดํด๊ฐ ๋์ง ์๋๋ค.
  const userId = req.userId;
  const postId = Number(req.params.postId);
  const commentId = Number(req.params.commentId);

  if (!postId) {
    return res.status(400).json({ message: '๊ฒ์๋ฌผ์ postid(pk)๋ฅผ path์ ๋ด์์ฃผ์ธ์.' });
  } else if (!commentId) {
    return res.status(400).json({ message: '์ญ์ ํ  ๋๊ธ์ commentId(pk)๋ฅผ path์ ๋ด์์ฃผ์ธ์.' });
  }

  const userInfo = await User.findOne({ id: userId });

  if (userInfo === undefined) {
    return res.status(403).json({ message: '์ ์ ์ ํ์ ์ ๋ณด๊ฐ ์์ต๋๋ค' });
  }

  const postDetail = await Post.findOne({ id: postId });

  if (postDetail === undefined) {
    return res.status(404).json({ message: '๋๊ธ์ ์ญ์ ํ  ๊ฒ์๋ฌผ์ด ์กด์ฌํ์ง ์์ต๋๋ค.' });
  }

  const comment = await Post_comment.findOne({ id: commentId });

  if (comment === undefined) {
    return res.status(404).json({ message: '์ญ์ ํ  ๋๊ธ์ด ์กด์ฌํ์ง ์์ต๋๋ค.' });
  }

  if (comment.writer.id !== userId) {
    return res.status(403).json({ message: '์ ์ ๊ฐ ๋๊ธ์ ์๋ ์์ฑ์๊ฐ ์๋๋๋ค.' });
  }

  comment.remove();
  res.status(201).json({ commentId, messgage: '๋๊ธ์ด ์ญ์ ๋์์ต๋๋ค.' });
};
