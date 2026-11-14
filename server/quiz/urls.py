from rest_framework.routers import DefaultRouter
from .views import ExamViewSet, QuestionViewSet, OptionViewSet

router = DefaultRouter()
router.register('exams', ExamViewSet)
router.register('questions', QuestionViewSet)
router.register('options', OptionViewSet)
urlpatterns = router.urls
