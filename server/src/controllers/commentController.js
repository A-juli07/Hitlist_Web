import Comment from '../models/Comment.js';
import Anime from '../models/Anime.js';

async function getReplies(commentId) {
  const replies = await Comment.find({ parentComment: commentId })
    .populate('user', 'username avatar')
    .sort({ createdAt: 1 });

  const repliesWithNested = await Promise.all(
    replies.map(async (reply) => {
      const nestedReplies = await getReplies(reply._id);
      return {
        ...reply.toObject(),
        replies: nestedReplies
      };
    })
  );

  return repliesWithNested;
}

export const getAnimeComments = async (req, res) => {
  try {
    const topLevelComments = await Comment.find({
      anime: req.params.animeId,
      parentComment: null
    })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });

    const commentsWithReplies = await Promise.all(
      topLevelComments.map(async (comment) => {
        const replies = await getReplies(comment._id);
        return {
          ...comment.toObject(),
          replies
        };
      })
    );

    res.json(commentsWithReplies);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar comentários', error: error.message });
  }
};

export const createComment = async (req, res) => {
  try {
    const { animeId, content, parentCommentId } = req.body;

    const anime = await Anime.findById(animeId);
    if (!anime) {
      return res.status(404).json({ message: 'Anime não encontrado' });
    }

    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ message: 'Comentário pai não encontrado' });
      }
    }

    const comment = await Comment.create({
      user: req.user._id,
      anime: animeId,
      content,
      parentComment: parentCommentId || null
    });

    await comment.populate('user', 'username avatar');
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar comentário', error: error.message });
  }
};

async function deleteRepliesRecursively(commentId) {
  const replies = await Comment.find({ parentComment: commentId });

  for (const reply of replies) {
    await deleteRepliesRecursively(reply._id);
    await reply.deleteOne();
  }
}

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comentário não encontrado' });
    }

    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Não autorizado' });
    }

    await deleteRepliesRecursively(comment._id);
    await comment.deleteOne();

    res.json({ message: 'Comentário deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar comentário', error: error.message });
  }
};

export const toggleLikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comentário não encontrado' });
    }

    const likeIndex = comment.likes.indexOf(req.user._id);

    if (likeIndex > -1) {
      comment.likes.splice(likeIndex, 1);
    } else {
      comment.likes.push(req.user._id);
    }

    await comment.save();
    await comment.populate('user', 'username avatar');

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao curtir comentário', error: error.message });
  }
};
