from rest_framework.test import APITestCase

from .models import Category, Product


class CatalogApiTests(APITestCase):
    def setUp(self):
        self.home = Category.objects.create(name='Hogar', description='Casa')
        self.sport = Category.objects.create(name='Deportes', description='Entrenar')
        Product.objects.create(category=self.home, name='Taza', price='10.00', stock=3)
        Product.objects.create(category=self.sport, name='Mat', price='20.00', stock=1)

    def test_product_list_nests_category(self):
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, 200)
        first = response.json()[0]
        self.assertEqual(first['category']['name'], 'Deportes')
        self.assertEqual(first['category']['description'], 'Entrenar')

    def test_filter_by_category(self):
        response = self.client.get(f'/api/products/?category={self.home.id}')
        self.assertEqual([p['name'] for p in response.json()], ['Taza'])

    def test_create_with_category_id(self):
        response = self.client.post('/api/products/', {
            'name': 'Cojín', 'price': '15.00', 'stock': 2, 'category_id': self.home.id,
        }, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['category']['name'], 'Hogar')

    def test_update_and_delete(self):
        product = Product.objects.get(name='Taza')
        response = self.client.patch(f'/api/products/{product.id}/', {'price': '12.50'}, format='json')
        self.assertEqual(response.json()['price'], '12.50')
        self.assertEqual(self.client.delete(f'/api/products/{product.id}/').status_code, 204)
