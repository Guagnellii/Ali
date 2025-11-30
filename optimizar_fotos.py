from PIL import Image, ImageOps
import os

carpeta = "fotos/"

print("Iniciando optimización de fotos...")

for archivo in os.listdir(carpeta):
    if archivo.lower().endswith((".jpg", ".jpeg", ".png")):
        ruta_completa = os.path.join(carpeta, archivo)

        try:
            img = Image.open(ruta_completa)

            img = ImageOps.exif_transpose(img)

            img.thumbnail((800, 800))

            img.save(ruta_completa, optimize=True, quality=85)

            print(f"{archivo} optimizado correctamente.")
        except Exception as e:
            print(f"Error al optimizar {archivo}: {e}")

print("¡Listo! Todas las fotos han sido optimizadas.")