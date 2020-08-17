import tools from 'satanic'

const bot = tools.bot(TOKEN, true)
const db = new tools.JSONFile('groups.json')

async function handleMessage(ctx) {
    const chatId = ctx.chat.id
    const isNewChat = !(await db.includes(`${chatId}`))
    if (isNewChat) {
        await db.set(chatId)
        const successMessage = await ctx.replyWithHTML('Теперь сюда будут приходить котики🐾')
        setTimeout(async () => {
            await bot.telegram.deleteMessage(chatId, successMessage.message_id)
        }, 3000)
    }
}
async function handleChannelPost(ctx) {
    if (ctx.chat.id === CHANNEL_ID) {
        const groups = await db.toObject()
        for (const group of groups) {
            try {
                await ctx.forwardMessage(group)
            } catch (e) {
                console.log(e.description || e.message || e)
            }
        }
    }
}

bot.on('message', handleMessage)
bot.on('channel_post', handleChannelPost)

bot.start()
