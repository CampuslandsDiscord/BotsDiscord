import os
import json
import time
import asyncio
import discord
from discord.ext import commands
from modules.token import get_token

token = get_token()

intents = discord.Intents.default()
intents.messages = True
intents.voice_states = True
intents.members = True

















bot = commands.Bot(command_prefix='/', intents=intents)

last_messages = {}
warnings = {}
disconnect_timers = {}
screen_share_timers = {}
users_info = {}  # Nueva lista para almacenar información de los usuarios

file_path = os.path.join(os.path.dirname(__file__), 'src', 'json', 'data.json')
user_warnings_path = os.path.join(os.path.dirname(__file__), 'src', 'json', 'user_warnings.json')

















channel_mapping = {}
rol_ban_mapping = {}

with open(file_path, 'r') as file:
    channels_info = json.load(file)
    for channel_info in channels_info:
        voice_channel_a1 = channel_info.get("voice-channel-a1", {}).get("id1a")
        voice_channel_a2 = channel_info.get("voice-channel-a2", {}).get("id2a")
        text_channel_t1 = channel_info.get("text_channel-t1", {}).get("id1t")
        rol_course = channel_info.get("rol-coure", {}).get("idc")
        rol_ban_id = channel_info.get("rol-ban", {}).get("idb")

        if voice_channel_a1 and text_channel_t1:
            channel_mapping[int(voice_channel_a1)] = int(text_channel_t1)
            rol_ban_mapping[int(voice_channel_a1)] = int(rol_ban_id) if rol_ban_id else None

        if voice_channel_a2 and text_channel_t1:
            channel_mapping[int(voice_channel_a2)] = int(text_channel_t1)
            rol_ban_mapping[int(voice_channel_a2)] = int(rol_ban_id) if rol_ban_id else None



















@bot.event
async def on_ready():
    print(f'Conectado como {bot.user.name}')


















@bot.event
async def on_message(message):
    print(f'Mensaje Enviado: {message.content}')
    
    # Manejar el conteo de mensajes y roles
    await handle_user_roles(message.author)
    
    await bot.process_commands(message)


















async def handle_user_roles(member):
    user_id = str(member.id)

    if user_id not in users_info:
        users_info[user_id] = {"messages": 0, "current_role": "rol-cour"}

    users_info[user_id]["messages"] += 1

    print(f'Usuario: {member.name}, Mensajes: {users_info[user_id]["messages"]}, Advertencias: {get_warnings(user_id)}')

    if isinstance(member, discord.Member) and users_info[user_id]["messages"] >= 3 and users_info[user_id]["current_role"] == "rol-cour":
        await member.remove_roles(*member.roles, reason="Usuario superó 3 mensajes.")

        users_info[user_id]["messages"] = 0

        await handle_warnings(member)  # Llamar a la función de advertencias

        print(f'Roles del usuario después de quitarlos: {member.roles}')














disconnect_counts_path = os.path.join(os.path.dirname(__file__), 'src', 'json', 'disconnect_counts.json')

with open(disconnect_counts_path, 'r') as disconnect_counts_file:
    disconnect_counts = json.load(disconnect_counts_file)









async def start_disconnect_timer(member):
    await asyncio.sleep(10)

    # Verificar si el miembro sigue en un canal de voz y no está compartiendo pantalla
    if member.voice and member.voice.channel and not member.voice.self_stream:
        # Imprimir información de desconexión
        print(f'Desconectando a {member.name} por no compartir pantalla.')

        # Desconectar al miembro del canal de voz
        await member.move_to(None, reason="El usuario no compartió pantalla en el tiempo permitido.")

        # Esperar un poco más antes de enviar el mensaje directo
        await asyncio.sleep(1)

        # Enviar mensaje directo al usuario
        disconnect_message = f'{member.mention}, has sido desconectado por no compartir pantalla.'
        await member.send(disconnect_message)

        # Actualizar el JSON disconnect_counts
        user_id = str(member.id)
        username = member.name

        # Verificar si el usuario está en disconnect_counts, si no, agregarlo
        if not any(entry.get(username) for entry in disconnect_counts):
            disconnect_counts.append({username: 1})
        else:
            # Incrementar la cantidad de mensajes
            for entry in disconnect_counts:
                if entry.get(username):
                    entry[username] += 1

        # Guardar el JSON actualizado
        with open(disconnect_counts_path, 'w') as disconnect_counts_file:
            json.dump(disconnect_counts, disconnect_counts_file, indent=2)


















async def start_screen_share_timer(member, text_channel):
    start_time = time.time()
    message = None
    while member.voice and member.voice.self_stream:
        elapsed_time = int(time.time() - start_time)
        minutes, seconds = divmod(elapsed_time, 60)
        await asyncio.sleep(1)

        # Enviar o editar un mensaje cada minuto al canal de texto
        if seconds == 0:
            if message:
                # Editar el mensaje existente
                await message.edit(content=f'{member.mention} lleva {minutes} minutos compartiendo pantalla.')
            else:
                # Enviar el mensaje inicial
                message = await text_channel.send(f'{member.mention} lleva {minutes} minutos compartiendo pantalla.')

    end_time = time.time()
    duration = end_time - start_time

    print(f'El usuario {member.name} compartió pantalla durante {duration} segundos.')


















@bot.event
async def on_voice_state_update(member, before, after):
    print('-----------------')
    # print(f'Evento on_voice_state_update detectado: {member.name}, {before.channel}, {after.channel}')
    # print('-----------------')

    # Verificar si el miembro estaba compartiendo pantalla y deja de hacerlo
    if before.self_stream and not after.self_stream:
        print('El miembro dejó de compartir pantalla')
        await handle_stop_sharing(member)

    # Verificar si el miembro está compartiendo pantalla y si está en un canal de voz
    if after.self_stream and after.channel:
        print('El miembro está compartiendo pantalla y en un canal de voz')

        # Imprimir información sobre el canal de texto correspondiente
        text_channel_id = channel_mapping.get(after.channel.id)
        print(f'Voice Channel ID: {after.channel.id}')
        print(f'Text Channel ID: {text_channel_id}')

        if text_channel_id:
            text_channel = discord.utils.get(bot.get_all_channels(), id=text_channel_id)
            print(f'Text Channel: {text_channel}')

            # Llamar a la función para desconectar si no comparte pantalla en 5 segundos
            bot.loop.create_task(start_disconnect_timer(member))

            # Llamar a la función para iniciar el temporizador de compartir pantalla
            bot.loop.create_task(start_screen_share_timer(member, text_channel))

            # Mensaje al canal de texto indicando que el usuario comenzó a compartir pantalla
            await text_channel.send(f'{member.mention} ha comenzado a compartir pantalla en {after.channel.name}.')

    # Verificar si el miembro no está compartiendo pantalla y está en un canal de voz
    if not after.self_stream and after.channel:
        print('El miembro no está compartiendo pantalla y está en un canal de voz')

        # Imprimir información sobre el canal de texto correspondiente
        voice_channel_id = after.channel.id
        text_channel_id = channel_mapping.get(voice_channel_id)
        print(f'Voice Channel ID: {voice_channel_id}')
        print(f'Text Channel ID: {text_channel_id}')

        if text_channel_id:
            text_channel = discord.utils.get(bot.get_all_channels(), id=text_channel_id)
            print(f'Text Channel: {text_channel}')

            # Llamar a la función para desconectar si no comparte pantalla en 5 segundos
            bot.loop.create_task(start_disconnect_timer(member))
            
    # Verificar si el miembro dejó el canal de voz y cancelar el temporizador si existe
    if before.channel and not after.channel:
        print(f'El miembro {member.name} dejó el canal de voz')
        voice_channel_id = before.channel.id
        text_channel_id = channel_mapping.get(voice_channel_id)

        if text_channel_id:
            text_channel = discord.utils.get(bot.get_all_channels(), id=text_channel_id)
            print(f'Voice Channel ID: {voice_channel_id}')
            print(f'Text Channel ID: {text_channel_id}')
            print(f'Text Channel: {text_channel}')


            if member.id in disconnect_timers:
                disconnect_timers[member.id].cancel()

            # Cancelar el temporizador de compartir pantalla si existe
            if member.id in screen_share_timers:
                screen_share_timers[member.id].cancel()











@bot.event
async def on_raw_presence_update(payload):
    if payload.activity and payload.activity.type == discord.ActivityType.streaming:
        channel_id = payload.activity.channel_id
        guild_id = payload.guild_id
        member_id = payload.user_id

        channel = bot.get_channel(channel_id)
        guild = bot.get_guild(guild_id)
        member = guild.get_member(member_id)

        if channel and guild and member:
            message = f'El usuario {member.name} está compartiendo pantalla en el canal de voz {channel.name}.'
            await send_message_to_all_text_channels(message, guild_id)













async def send_message_to_all_text_channels(message, guild_id):
    for guild in bot.guilds:
        if guild.id != guild_id:
            continue

        for text_channel in guild.text_channels:
            last_message_time = last_messages.get(text_channel.id, 0)
            current_time = time.time()

            if current_time - last_message_time > 60:
                try:
                    await text_channel.send(message)
                    last_messages[text_channel.id] = current_time
                    print(f'Mensaje enviado a {text_channel.name}')
                except discord.Forbidden:
                    print(f'El bot no tiene permisos para enviar mensajes a {text_channel.name}')














async def handle_warnings(member):
    user_id = str(member.id)

    if user_id not in users_info:
        users_info[user_id] = {"messages": 0, "current_role": "rol-cour"}

    users_info[user_id]["messages"] += 1

    warnings = get_warnings(user_id)
    warnings[user_id] = warnings.get(user_id, 0) + 1
    print(f'Advertencias para {member.name}: {warnings[user_id]}')

    # Aquí es donde se actualiza el conteo en user_warnings.json
    save_warnings(user_id, warnings)

    if warnings[user_id] >= 3:
        await member.edit(roles=[], reason="Usuario alcanzó 3 advertencias.")
        rol_ban_id = rol_ban_mapping.get(member.voice.channel.id)

        if rol_ban_id:
            rol_ban = discord.utils.get(member.guild.roles, id=rol_ban_id)
            
            if rol_ban:
                await member.add_roles(rol_ban, reason="Usuario alcanzó 3 advertencias.")
        
        warnings[user_id] = 0
    else:
        await member.send(f'Tienes {warnings[user_id]} advertencias.')
        await asyncio.sleep(60)
        warnings[user_id] = 0

    disconnect_message = f'{member.mention}, has sido desconectado por no compartir pantalla.'

    if member.voice and member.voice.channel and not member.voice.self_stream:
        text_channel_id = channel_mapping.get(member.voice.channel.id)

        if text_channel_id:
            text_channel = discord.utils.get(bot.get_all_channels(), id=text_channel_id)
            if text_channel and isinstance(text_channel, discord.TextChannel):
                await text_channel.send(disconnect_message)
                print(f'Mensaje enviado por MD: {disconnect_message}')
                await member.move_to(None, reason="El usuario no compartió pantalla en el tiempo permitido.")
                await member.send(disconnect_message)
            else:
                print('Error: No se pudo encontrar el canal de texto correspondiente.')
        else:
            print('Error: No se encontró la entrada del canal de voz en el mapeo.')

# Nueva función para cargar advertencias desde user_warnings.json
def get_warnings(user_id):
    try:
        with open(user_warnings_path, 'r') as file:
            warnings = json.load(file)
    except FileNotFoundError:
        warnings = {}

    return warnings

# Nueva función para guardar advertencias en user_warnings.json
def save_warnings(user_id, warnings):
    with open(user_warnings_path, 'w') as file:
        json.dump(warnings, file, indent=2)

















# Nueva función para manejar las advertencias
async def handle_warnings(member):
    warnings[member.id] = warnings.get(member.id, 0) + 1
    print(f'Advertencias para {member.name}: {warnings[member.id]}')

    if warnings[member.id] >= 3:
        # Limpiar roles y asignar el rol-ban especial
        await member.edit(roles=[], reason="Usuario alcanzó 3 advertencias.")
        rol_ban_id = rol_ban_mapping.get(member.voice.channel.id)
        
        if rol_ban_id:
            rol_ban = discord.utils.get(member.guild.roles, id=rol_ban_id)
            
            if rol_ban:
                await member.add_roles(rol_ban, reason="Usuario alcanzó 3 advertencias.")
        
        # Restablecer el contador de advertencias después de llegar a 3
        warnings[member.id] = 0
    else:
        # Enviar mensaje por MD con el número de advertencias
        await member.send(f'Tienes {warnings[member.id]} advertencias.')
















async def handle_stop_sharing(member):
    user_id = str(member.id)

    # Verificar si el usuario está en la lista, si no, agregarlo
    if user_id not in users_info:
        users_info[user_id] = {"messages": 0, "current_role": "rol-cour"}  # Rol inicial

    # Obtener el ID del rol específico ("rol-cour") del JSON
    target_role_id = channel_info.get("rol-cour", {}).get("idc")


    # Verificar si el usuario tiene el rol "rol-cour" antes de realizar acciones
    target_role = discord.utils.get(member.guild.roles, id=target_role_id)

    if target_role and target_role in member.roles:
        # Incrementar el conteo de advertencias
        warnings[user_id] = warnings.get(user_id, 0) + 1

        # Verificar si el usuario ha alcanzado 3 advertencias
        if warnings[user_id] >= 3:
            # Limpiar roles y asignar el rol-ban especial
            await member.edit(roles=[], reason="Usuario alcanzó 3 advertencias.")
            rol_ban_id = rol_ban_mapping.get(member.voice.channel.id)

            if rol_ban_id:
                rol_ban = discord.utils.get(member.guild.roles, id=rol_ban_id)

                if rol_ban:
                    await member.add_roles(rol_ban, reason="Usuario alcanzó 3 advertencias.")

            # Restablecer el contador de advertencias después de llegar a 3
            warnings[user_id] = 0

        # Limpiar las advertencias después de un tiempo (puedes ajustar el tiempo según tus necesidades)
        await asyncio.sleep(60)
        warnings[user_id] = 0

        disconnect_message = f'{member.mention}, has sido desconectado por no compartir pantalla.'

        # Verificar si el miembro está en un canal de voz y desconectarlo si no comparte pantalla
        if member.voice and member.voice.channel and not member.voice.self_stream:
            text_channel_id = channel_mapping.get(member.voice.channel.id)

            # Verificar si el canal de voz actual existe en el mapeo antes de intentar acceder a su ID
            if text_channel_id:
                text_channel = discord.utils.get(bot.get_all_channels(), id=text_channel_id)
                if text_channel and isinstance(text_channel, discord.TextChannel):
                    print(f'Canal de voz actual: {member.voice.channel.name}')
                    print(f'Canal de texto correspondiente: {text_channel.name}')

                    # Mensaje al usuario antes de desconectar
                    await text_channel.send(disconnect_message)

                    # Imprimir el mensaje que se está enviando al usuario por MD
                    print(f'Mensaje enviado por MD: {disconnect_message}')

                    # Desconectar al miembro del canal de voz
                    await member.move_to(None, reason="El usuario no compartió pantalla en el tiempo permitido.")

                    # Enviar mensaje directo al usuario
                    await member.send(disconnect_message)
                else:
                    print('Error: No se pudo encontrar el canal de texto correspondiente.')
            else:
                print('Error: No se encontró la entrada del canal de voz en el mapeo.')
    else:
        print(f'El usuario {member.name} no tiene el rol "rol-cour", no se realizarán acciones.')


bot.run(token)