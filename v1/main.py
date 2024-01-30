import discord
import asyncio

intents = discord.Intents.default()
intents.voice_states = True

TOKEN = 'token_del_bot_de_discord'

client = discord.Client(intents=intents)

@client.event
async def on_ready():
    print(f'Conectado como {client.user.name}')

@client.event
async def on_voice_state_update(member, before, after):
    if member == client.user:
        return

    if after.channel and after.channel.guild.voice_client is None:
        await after.channel.connect()
        await after.channel.send(f'¡El bot se ha unido al canal de voz {after.channel.name}!')

    await asyncio.sleep(5)

    current_voice_state = member.voice
    if current_voice_state and current_voice_state.channel and not current_voice_state.self_stream:
        voice_channel = current_voice_state.channel
        await member.move_to(None)

        if voice_channel:
            await voice_channel.send(f'{member.display_name} ha sido desconectado del canal de voz por no compartir pantalla.')

        await asyncio.sleep(0.1)
        voice_client = client.voice_clients[0] if client.voice_clients else None
        if voice_client and voice_client.channel and len(voice_client.channel.members) == 1:
            await voice_client.disconnect()
            await voice_client.channel.send('¡El bot se ha desconectado del canal de voz debido a la inactividad!')

@client.event
async def on_message(message):
    if message.content == '!desconectar':
        if message.guild.voice_client:
            await message.guild.voice_client.disconnect()
            await message.channel.send('¡El bot se ha desconectado del canal de voz!')
        else:
            await message.channel.send('¡El bot no está conectado a ningún canal de voz!')

client.run(TOKEN)
