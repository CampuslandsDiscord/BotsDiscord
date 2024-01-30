import discord
from discord.ext import commands

intents = discord.Intents.all()
bot = commands.Bot(command_prefix="!", intents=intents)

@bot.event
async def on_ready():
    print(f'Bot conectado como {bot.user.name}')

@bot.command(name='listar_personas')
async def listar_personas(ctx):
    members = ctx.guild.members
    member_list = [member.name for member in members]

    for chunk in [member_list[i:i+100] for i in range(0, len(member_list), 100)]:
        await ctx.send(f'Lista de personas en el servidor:\n{", ".join(chunk)}')

@bot.command(name='give_rol_all')
async def give_rol_all(ctx, rol_name):
    role = discord.utils.get(ctx.guild.roles, name=rol_name)

    if role is None:
        await ctx.send(f'No se encontró el rol "{rol_name}" en el servidor.')
        return

    # Verificar si el bot tiene el permiso "Manage Roles"
    if ctx.guild.me.guild_permissions.manage_roles:
        for member in ctx.guild.members:
            try:
                await member.add_roles(role)
            except discord.Forbidden:
                await ctx.send(f'No tengo los permisos para dar el rol "{rol_name}" a {member.name}.')
    else:
        await ctx.send('No tengo los permisos necesarios para gestionar roles.')

    await ctx.send(f'Se ha dado el rol "{rol_name}" a los miembros del servidor que cumplen los requisitos.')

# Reemplaza 'TU_TOKEN_DE_DISCORD' con tu token real
bot.run('MTA1NTMwNjkxMjg0MjkwNzY3OA.GW3eM1.aLQpmGSGNkzFu3T1QY-9a_gYlh1BdsK1mXL9Ac')
