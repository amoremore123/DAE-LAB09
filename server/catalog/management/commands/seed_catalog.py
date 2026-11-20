from decimal import Decimal
from io import BytesIO

from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from PIL import Image, ImageDraw, ImageFont

from catalog.models import Category, Product

CATEGORIES = {
    'Electrónica': ('Audio, accesorios y dispositivos para el día a día.', '#2f6f9f'),
    'Hogar': ('Artículos para la cocina, el descanso y la decoración.', '#ce512f'),
    'Deportes': ('Equipamiento para entrenar en casa y al aire libre.', '#3f8f5b'),
}

PRODUCTS = [
    ('Electrónica', 'Audífonos inalámbricos', 'Bluetooth 5.3 con 30 horas de batería.', '189.90', 25),
    ('Electrónica', 'Teclado mecánico', 'Switches táctiles y retroiluminación blanca.', '249.00', 12),
    ('Electrónica', 'Mouse ergonómico', 'Seis botones y sensor de 4000 DPI.', '89.50', 40),
    ('Hogar', 'Lámpara de escritorio', 'LED regulable con brazo articulado.', '119.00', 18),
    ('Hogar', 'Juego de tazas', 'Cuatro tazas de cerámica de 350 ml.', '59.90', 30),
    ('Hogar', 'Cojín decorativo', 'Funda de lino lavable de 45 x 45 cm.', '45.00', 22),
    ('Deportes', 'Mat de yoga', 'Antideslizante de 6 mm con correa.', '79.00', 35),
    ('Deportes', 'Botella térmica', 'Acero inoxidable, 750 ml, 12 horas de frío.', '65.00', 50),
    ('Deportes', 'Mancuernas 5 kg', 'Par de mancuernas recubiertas de neopreno.', '139.00', 10),
]


def product_image(name, color):
    image = Image.new('RGB', (600, 450), color)
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((40, 40, 560, 410), radius=28, outline='white', width=6)
    draw.ellipse((230, 110, 370, 250), fill='white')
    try:
        font = ImageFont.truetype('arial.ttf', 34)
    except OSError:
        font = ImageFont.load_default()
    width = draw.textlength(name, font=font)
    draw.text(((600 - width) / 2, 300), name, fill='white', font=font)
    buffer = BytesIO()
    image.save(buffer, format='PNG')
    return ContentFile(buffer.getvalue())


class Command(BaseCommand):
    help = 'Load three categories and nine products with image.'

    def handle(self, *args, **options):
        categories = {}
        for name, (description, _) in CATEGORIES.items():
            categories[name], _ = Category.objects.update_or_create(
                name=name, defaults={'description': description}
            )
        for category, name, description, price, stock in PRODUCTS:
            product, created = Product.objects.update_or_create(
                name=name,
                defaults={
                    'category': categories[category],
                    'description': description,
                    'price': Decimal(price),
                    'stock': stock,
                },
            )
            if created or not product.image:
                slug = name.lower().replace(' ', '-')
                product.image.save(
                    f'{slug}.png', product_image(name, CATEGORIES[category][1])
                )
        self.stdout.write(self.style.SUCCESS(
            f'{Category.objects.count()} categories, {Product.objects.count()} products.'
        ))
