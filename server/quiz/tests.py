from rest_framework.test import APITestCase


class QuizApiTests(APITestCase):
    def test_crud_validation_and_pagination(self):
        exam = self.client.post('/api/exams/', {'title': 'Python'}, format='json')
        self.assertEqual(exam.status_code, 201)
        body = {'exam': exam.data['id'], 'text': 'Choose Python', 'options': [
            {'text': 'Python', 'is_correct': True},
            {'text': 'HTML', 'is_correct': False}]}
        response = self.client.post('/api/questions/', body, format='json')
        self.assertEqual(response.status_code, 201)
        url = f"/api/questions/{response.data['id']}/"
        self.assertEqual(self.client.get(url).status_code, 200)
        self.assertEqual(self.client.patch(url, {'text': 'Updated'}, format='json').status_code, 200)
        for invalid in [{}, {**body, 'exam': 'bad'}, {**body, 'options': []}]:
            self.assertEqual(self.client.post('/api/questions/', invalid, format='json').status_code, 400)
        correct = response.data['options'][0]['id']
        self.assertEqual(self.client.delete(f'/api/options/{correct}/').status_code, 400)
        self.assertEqual(self.client.patch(f'/api/options/{correct}/', {'is_correct': False}, format='json').status_code, 400)
        for _ in range(6):
            self.client.post('/api/questions/', body, format='json')
        listing = self.client.get('/api/questions/', {'exam': exam.data['id'], 'search': 'Python'})
        self.assertEqual(listing.data['count'], 6)
        self.assertEqual(len(listing.data['results']), 5)
        self.assertIsNotNone(listing.data['next'])
        self.assertEqual(self.client.get('/api/questions/?page=2').status_code, 200)
        self.assertEqual(self.client.delete(url).status_code, 204)
