import discord
from discord.ext import commands
import asyncio

intents = discord.Intents.default()
intents.members = True
intents.messages = True

bot = commands.Bot(command_prefix='/', intents=intents)

@bot.event
async def on_ready():
    print(f'Conectado como {bot.user.name}')
    bot.loop.create_task(check_channels_every_10_seconds())

@bot.event
async def on_member_remove(member):
    target_channel_id = 1144383479954546779
    target_channel = bot.get_channel(target_channel_id)

    if target_channel:
        await target_channel.send(f'El usuario {member.name} ha salido del servidor.')

@bot.event
async def on_member_join(member):
    target_channel_id = 1190056001651609621  
    target_channel = bot.get_channel(target_channel_id)

    if target_channel:
        await target_channel.send(f'Bienvenido/a {member.name} al servidor!')

@bot.event
async def on_message(message):
    target_channels = [123456789012345678, 987654321098765432]

    if message.channel.id in target_channels:
        user_message_count = get_user_message_count(message.author.id)
        set_user_message_count(message.author.id, user_message_count + 1)

        print(f'Usuario {message.author.name} ha enviado {user_message_count + 1} mensajes en el canal {message.channel.name}.')

    await bot.process_commands(message)

def get_user_message_count(user_id):
    return user_message_counts.get(user_id, 0)

def set_user_message_count(user_id, count):
    user_message_counts[user_id] = count

user_message_counts = {}

async def check_channels_every_10_seconds():
    while True:
        try:
            print('Verificando canales...')
            target_channel_ids = [1104198740304208013, 1104190352744796191]

            for target_channel_id in target_channel_ids:
                target_channel = bot.get_channel(target_channel_id)

                if target_channel:
                    user_message_counts.clear()  # Limpiar la cuenta de mensajes antes de comenzar una nueva iteración

                    async for message in target_channel.history(limit=None):
                        user_message_count = get_user_message_count(message.author.id)
                        set_user_message_count(message.author.id, user_message_count + 1)

                    print('-' * 112)
                    print('| {:^40} | {:^40} | {:^20} |'.format('Canal', 'Usuario', 'Cant-Msg'))
                    print('-' * 112)

                    for user_id, message_count in user_message_counts.items():
                        member = target_channel.guild.get_member(user_id)
                        if member:
                            print('| {:^40} | {:^40} | {:^20} |'.format(target_channel.name, member.name, message_count))

                    print('-' * 112)

        except Exception as e:
            print(f'Error al verificar canales: {e}')
            # Agrega aquí el manejo de errores según tus requisitos

        await asyncio.sleep(10)

bot.run('MTE5MjkxNDYwNjk5NDIzNTQxNA.GIw-5g.MmhU_VzOW-Wo0hB0-p0ia0LhRJRemkA64UGDBQ-')
