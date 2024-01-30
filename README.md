# BOT DISCORD CAMPUSLANDS

Para este bot de discord se vioeron las necesidades que habian en el servidor
en este caso la necesidad que habia era que los usuario al entrar al canal de voz si no compartian su pantalla se sacarian del canal de voz

Para ello se uso un bot de discord que automatizara el proceso, se uso para crear el bot el lenguage de **PYTHON** el cual considere que era el mas correcto para esta ocacion 

Lo primero era instalar la libreria de discord.py 

Para ello solo se introduce el siguiente comando en la terminal ya sea de vscode o del sistema en general 

```bash
pip install discord.py

```

```bash
pip install asyncio
```

Con la libreria ya descargada solo nos queda empezar a escribir el codigo que se usara para darle vida al bot

Pero antes que nada es necesesario tener una cuenta de discord

Para poder obtener la key de nuestro bot solo iremos a discord developers 

[DISCORD DEVELOPERS](https://discord.com/developers/applications)

Una vez estando alli solo crearemos una nueva app

![img](https://media.discordapp.net/attachments/1102799679416184913/1122629387771199668/Captura_desde_2023-06-25_15-48-07.png)

Al darle click un modal nos debera de aparecer, algo como este

![img](https://media.discordapp.net/attachments/1102799679416184913/1122630236408905819/Captura_desde_2023-06-25_15-51-36.png)

Colocaremos el nombre del bot, aceptaremos los terminos y condiciones de discord y le daremos create y enseguida nos saldra el panel central de nuestro bot

![img](https://media.discordapp.net/attachments/1102799679416184913/1122630878342942821/image.png?width=835&height=434)

Iremos a bot 

![img](https://media.discordapp.net/attachments/1102799679416184913/1122631475876069467/image.png)

Y una vez estando alli solo nos queda obtener el token de nuestro bot, para ello solo vamos a restablecer el token actual por uno nuevo y lo copiaremos 

![img](https://media.discordapp.net/attachments/1102799679416184913/1122631945394847904/image.png?width=1025&height=171)

Nos dara el token el cual copiaremos

Ahora iremos a vscode para poder empezar a escribir el codigo de nuestro bot

Crearemos nuesto archivo main.py

luego vamos a empezar a escribir el siguiente codigo

```python
import discord
import asyncio
```

Que lo que hace es poder importar las librerias que usaremos


```python
intents = discord.Intents.default()
intents.voice_states = True

TOKEN = 'TOKEN_DE_TU_BOT_DE_DISCORD'

client = discord.Client(intents=intents)

```

Aca solo creamos una variable llamada TOKEN con el valor del token del bot que mas adelante usaremos para darle vida a nuestro bot.

```python
@client.event
async def on_ready():
    print(f'Conectado como {client.user.name}')

```
Este bloque de código define un evento que se activa cuando el bot se conecta correctamente al servidor de Discord. Muestra un mensaje en la consola indicando que el bot se ha conectado correctamente y muestra el nombre del bot.


```python
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

```
Este bloque de código define un evento que se activa cuando hay un cambio en el estado de voz de un miembro del servidor. El bot verifica si el miembro que ha experimentado el cambio de estado no es el propio bot. Luego, verifica si el miembro se ha unido a un canal de voz y si el bot no está conectado a ningún canal de voz en ese servidor. Si se cumplen estas condiciones, el bot se conecta automáticamente al canal de voz al que se ha unido el miembro y envía un mensaje indicando que se ha unido al canal.

Luego, se espera un tiempo de 5 segundos utilizando await asyncio.sleep(5).

Después, se obtiene el estado de voz actual del miembro y se verifica si está en un canal de voz y si no está transmitiendo su propia pantalla. Si se cumple esta condición, el bot mueve al miembro a ningún canal de voz (lo desconecta) y envía un mensaje al canal de voz indicando que el miembro ha sido desconectado debido a no compartir pantalla.

Se espera un tiempo muy breve de 0.1 segundos utilizando await asyncio.sleep(0.1).

A continuación, se verifica si el bot está conectado a algún canal de voz y si ese canal de voz solo tiene un miembro (el bot). En ese caso, el bot se desconecta automáticamente del canal de voz y envía un mensaje al canal indicando que se ha desconectado debido a la inactividad.

```python
@client.event
async def on_message(message):
    if message.content == '!desconectar':
        if message.guild.voice_client:
            await message.guild.voice_client.disconnect()
            await message.channel.send('¡El bot se ha desconectado del canal de voz!')
        else:
            await message.channel.send('¡El bot no está conectado a ningún canal de voz!')

```
Este bloque de código define un evento que se activa cuando se envía un mensaje en el servidor de Discord. El bot verifica si el contenido del mensaje es igual a !desconectar. Si es así, verifica si el bot está conectado a algún canal de voz en el servidor. Si el bot está conectado, se desconecta del canal de voz y envía un mensaje indicando que se ha desconectado. Si el bot no está conectado a ningún canal de voz, envía un mensaje indicando que no está conectado a ningún canal de voz.


```python
client.run(TOKEN)

```
Finalmente, este código ejecuta el bot de Discord utilizando el token proporcionado. El bot se conectará al servidor de Discord y estará listo para recibir eventos y responder a ellos.

Si todo salio bien el bot deberia de verse asi 
# HACER QUE EL BOT ESTE SIEMPRE ACTIVO

Si bien el bot de python estara siempre cumpliendo su funcion no siempre podra estar activo, para ello se debe de alojar el bot en un servicio en la nuve que simpre mantenga el bot despierto

Pero una forma mas facil de hacerlo es simplemente creando un servicio en nuestra computadora para cada que ella prenda el bot se encienda automaticamente sin necesidad de encender el bot desde el vscode

los comando son:

- vamos a crear un archivo bot.service

```sh
bot.service
```

y dentro de el archivo vamos a colocar lo siguiente

```sh
[Unit]
Description=My Script Service
After=network.target

[Service]
ExecStart=/usr/bin/python3 /ruta/al/script.py
WorkingDirectory=/ruta/al/directorio/del/script
Restart=always
User=usuario
Group=grupo

[Install]
WantedBy=multi-user.target
```

ya teniendo el archivo 
vamos a moverlo a la siguiente ruta 

```sh
/etc/systemd/system/
```

una ves alli colocaremos el siguiente comando en la terminal

```sh
sudo systemctl enable bot.service
sudo systemctl start bot.service
```

le daremos los permisos necesarios al archivo 

```sh
sudo chmod 644 /etc/systemd/system/bot.service
```

colocaremos
```sh
sudo systemctl enable bot.service 
```

luego 
```sh
sudo systemctl start bot.service
```

y por ultimo 

```sh
sudo systemctl status bot.service
```

y con eso nos deberia de salir el siguiente mensaje en la terminal

![img](https://media.discordapp.net/attachments/1102799679416184913/1122640498708979764/Captura_desde_2023-06-25_16-28-34.png?width=1025&height=395)

y eso seria todo 
## SOPORTE

Para mas soporte puede escribir al correo owdrydev@gmail.com


## CODIGO COMPLETO

```python
import discord
import asyncio

intents = discord.Intents.default()
intents.voice_states = True

TOKEN = 'TOKEN_DEL_BOT_DE_DISCORD'

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
```


## AUTOR

- [@owellandry](https://www.github.com/owellandry)
