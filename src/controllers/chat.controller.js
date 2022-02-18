const User = require('../models/user.model');
const ChatRoom = require('../models/chat-room.model');
const ChatMessage = require('../models/chat-message.model');
const { createPageLimitOption } = require('../utils/request-query.utils');

module.exports = {
  async getUserChatMessage(req, res, next) {
    const { userAccount } = req;
    const { page, limit } = req.query;

    const pageLimitOption = createPageLimitOption(page, limit);

    const userId = userAccount.userId;

    try {
      const user = await User.findByPk(userId, {
        include: ChatRoom,
        logging: console.log,
      });

      const messages = await ChatMessage.findAndCountAll({
        where: {
          chatRoomId: user.chatRoom.id,
        },
        ...pageLimitOption,
        order: [['createdAt', 'DESC']],
      });

      const maxPage = limit ? Math.ceil(messages.count / limit) : 1;
      messages.messages = messages.rows;
      delete messages.rows;

      res.json({ maxPage, messages });
    } catch (e) {
      next(e);
    }
  },
};
