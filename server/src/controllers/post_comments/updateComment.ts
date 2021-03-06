import { Request, Response } from 'express';

import { Post } from '../../entity/Post';
import { User } from '../../entity/User';
import { Post_comment } from '../../entity/Post_comment';

export const updateComment = async (req: Request, res: Response) => {
  console.log('λκΈ μμ  πΉ');

  //? μ POST psts/:id μμ²­ bodyμ userIdλ₯Ό λ΄μΌλΌλμ§ λΉμ΅ μ΄ν΄κ° λμ§ μλλ€.
  const userId = req.userId;
  const postId = Number(req.params.postId);
  const commentId = Number(req.params.commentId);
  const { content } = req.body;

  if (!content) {
    return res.sendStatus(200);
  }

  if (!postId) {
    return res.status(400).json({ message: 'κ²μλ¬Όμ postid(pk)λ₯Ό pathμ λ΄μμ£ΌμΈμ.' });
  } else if (!commentId) {
    return res.status(400).json({ message: 'μμ ν  λκΈμ commentId(pk)λ₯Ό pathμ λ΄μμ£ΌμΈμ.' });
  }

  const userInfo = await User.findOne({ id: userId });

  if (userInfo === undefined) {
    return res.status(403).json({ message: 'μ μ μ νμ μ λ³΄κ° μμ΅λλ€' });
  }

  const postDetail = await Post.findOne({ id: postId });

  if (postDetail === undefined) {
    return res.status(404).json({ message: 'λκΈμ μμ ν  κ²μλ¬Όμ΄ μ‘΄μ¬νμ§ μμ΅λλ€.' });
  }

  const comment = await Post_comment.findOne({ id: commentId });

  if (comment === undefined) {
    return res.status(404).json({ message: 'μμ ν  λκΈμ΄ μ‘΄μ¬νμ§ μμ΅λλ€.' });
  }

  if (comment.writer.id !== userId) {
    return res.status(403).json({ message: 'μ μ κ° λκΈμ μλ μμ±μκ° μλλλ€.' });
  }

  comment.content = content;
  comment.save();
  console.log(comment);

  res.status(201).json({ comment, messgage: 'λκΈμ΄ μμ λμμ΅λλ€.' });

  //* μ€λ³΅ λκΈ λ±λ‘ λ°©μ§
};
