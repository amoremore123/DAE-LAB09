from django.contrib import admin

from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'description', 'product_count']
    search_fields = ['name']

    @admin.display(description='products')
    def product_count(self, obj):
        return obj.products.count()


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price', 'stock', 'updated_at']
    list_filter = ['category', 'updated_at']
    list_editable = ['price', 'stock']
    search_fields = ['name', 'description']
    list_select_related = ['category']
