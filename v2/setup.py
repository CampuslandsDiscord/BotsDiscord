import subprocess
import os

def main():
    # Obtener la ruta al directorio .code
    code_directory = os.path.join(os.path.dirname(os.path.realpath(__file__)), "./.code")

    # Verificar que la carpeta .code existe
    if not os.path.exists(code_directory):
        print("Error: El directorio '.code' no se encuentra.")
        return

    # Cambiar al directorio .code y ejecutar code.py
    subprocess.run(["python3", "code.py"], cwd=code_directory)

if __name__ == "__main__":
    main()
