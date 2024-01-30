import os
import json

class CrudManager:
    def __init__(self, data_folder):
        self.data_folder = data_folder
        self.data_path = os.path.join(self.data_folder, 'data.json')
        self.data = self.load_data()

    def load_data(self):
        if os.path.exists(self.data_path):
            with open(self.data_path, 'r') as file:
                try:
                    return json.load(file)
                except json.JSONDecodeError:
                    print("El archivo JSON no tiene un formato válido.")
                    return []
        else:
            return []

    def save_data(self):
        with open(self.data_path, 'w') as file:
            json.dump(self.data, file, indent=2)

    def create_group(self):
        group_name = input("Ingrese el nombre del grupo: ")
        group_ids = {}
        for i in range(1, 5):
            while True:
                user_id = input(f"Ingrese el ID {i} (debe tener de 18 a 25 dígitos): ")
                if len(user_id) >= 18 and len(user_id) <= 25:
                    group_ids[str(i)] = user_id
                    break
                else:
                    print("El ID debe tener de 18 a 25 dígitos.")

        self.data.extend([group_name, group_ids])
        self.save_data()

    def read_groups(self):
        return [self.data[i:i+2] for i in range(0, len(self.data), 2)]

def main():
    data_folder = os.path.join(os.path.dirname(__file__), '..', 'json')
    crud_manager = CrudManager(data_folder)

    try:
        while True:
            print("\n1. Crear grupo")
            print("2. Leer grupos")
            print("0. Salir")
            choice = input("Selecciona una opción: ")

            if choice == "1":
                crud_manager.create_group()
            elif choice == "2":
                groups = crud_manager.read_groups()
                print("Grupos:")
                for group_name, group_ids in groups:
                    print(f"{group_name}: {group_ids}")
            elif choice == "0":
                break
            else:
                print("Opción no válida. Inténtalo de nuevo.")

    except KeyboardInterrupt:
        while True:
            try:
                force_exit = input("\n¿Seguro que quieres salir con fuerza bruta? (Y/N): ").strip().lower()
                if force_exit in ["y", "n"]:
                    break
                else:
                    print("Por favor, ingresa 'Y' o 'N'.")
            except KeyboardInterrupt:
                continue

        if force_exit == "y":
            print("Saliendo con fuerza bruta...")
            exit()
        else:
            main()  # Vuelve a llamar a main para continuar el programa después de un Ctrl + C

if __name__ == "__main__":
    main()