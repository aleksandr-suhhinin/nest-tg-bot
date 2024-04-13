import { Injectable } from '@nestjs/common';
import TelegramBot, {
  InlineKeyboardButton,
  InlineKeyboardMarkup,
  ParseMode,
  Poll,
} from 'node-telegram-bot-api';
import type { Message } from 'node-telegram-bot-api';
import * as process from 'node:process';
import { UserService } from '../user/user.service';
import { IUser } from '../types/IUser';

@Injectable()
export class TelegramService {
  private readonly bot: TelegramBot;

  constructor(private userService: UserService) {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
      polling: true,
    });
    this.bot.on('message', this.onReceiveMessage);
    this.bot.on('polling_error', (err) => console.log(err));
    this.bot.on('poll', this.handlePoll);
  }

  async sendAdminHello(incomingMessage: string): Promise<void> {
    const [, userId, text] = incomingMessage.split(' ');
    await this.bot.sendMessage(userId, text);
  }

  isAdmin(id: number): boolean {
    const admins = process.env.TELEGRAM_ADMIN_ID.split(',');
    if (admins.length === 0) {
      return false;
    }
    return admins.includes(id.toString());
  }

  async redirectToPage(msg: Message) {
    const { chat, from } = msg;
    const text = `Hello, ${from.first_name || from.username}`;
    const arrayButton: InlineKeyboardButton[][] = [
      [
        {
          text: 'Goto webpage',
          web_app: {
            url: `https://google.com?q=${text}`,
          },
        },
      ],
    ];

    const markup: InlineKeyboardMarkup = {
      inline_keyboard: arrayButton,
    };

    const options = {
      reply_markup: markup,
      parse_mode: 'HTML' as ParseMode,
    };

    await this.bot.sendMessage(chat.id, 'Goto webpage', options);
  }

  async sendAdminSelect(chatId: number) {
    const users = await this.userService.getAllUsers();
    if (users.length === 0) {
      return;
    }
    const options = users.map(
      (user: IUser) => `${user.firstName}; ${user.userId}`,
    );

    await this.bot.sendPoll(chatId, 'Select user to say hello', options);
  }

  onReceiveMessage = async (msg: Message): Promise<void> => {
    if (!msg.text || msg.text?.startsWith('/start')) {
      await this.userService.saveUser(msg.from);
      await this.redirectToPage(msg);
    }

    if (msg.text?.startsWith('/adminhello')) {
      if (this.isAdmin(msg.from.id)) {
        await this.sendAdminHello(msg.text);
      }
    }
    if (msg.text?.startsWith('/adminselect')) {
      if (this.isAdmin(msg.from.id)) {
        await this.sendAdminSelect(msg.from.id);
      }
    }
  };

  handlePoll = async (pollResult: Poll) => {
    const { options } = pollResult;
    const user = options.find((option) => option.voter_count > 0);
    if (user) {
      const [firstName, userId] = user.text.split(';');
      const text = `Hello, ${firstName}!`;
      await this.bot.sendMessage(userId.trim(), text);
    }
  };
}
