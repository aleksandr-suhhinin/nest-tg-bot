## Telegram bot

### to deploy:

- register the telegram bot using @BotFather
- make sure you have access to PostgreSQL instance
- create a database, e.g. "telegram_bot" and grant access to user
- make sure you have nodejs@^18.19.0 installed
- clone the repository
- inside the directory nest-tg-bot run npm install
- copy .env.example to .env and make the necessary changes in it, add the TELEGRAM_BOT_TOKEN value, obtained from @BotFather
- run migration by command `npm run typeorm migration:run`
- run application npm run start:dev 


