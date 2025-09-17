from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import (
    UserProfile, Category, Stone, StoneImage, StoneVideo, Project, ProjectImage, 
    ProjectVideo, ProjectStone, Cart, CartItem, Quote, QuoteItem, Order, OrderItem
)


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'


class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)


class StoneImageInline(admin.TabularInline):
    model = StoneImage
    extra = 1


class StoneVideoInline(admin.TabularInline):
    model = StoneVideo
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name_en', 'name_fa', 'slug', 'created_at']
    search_fields = ['name_en', 'name_fa']
    prepopulated_fields = {'slug': ('name_en',)}


@admin.register(Stone)
class StoneAdmin(admin.ModelAdmin):
    list_display = ['name_en', 'category', 'origin', 'price', 'is_active', 'created_at']
    list_filter = ['category', 'origin', 'is_active', 'created_at']
    search_fields = ['name_en', 'name_fa', 'description_en', 'description_fa']
    inlines = [StoneImageInline, StoneVideoInline]
    fieldsets = (
        ('Basic Information', {
            'fields': ('name_en', 'name_fa', 'category', 'description_en', 'description_fa')
        }),
        ('Details', {
            'fields': ('origin', 'price', 'is_active')
        }),
        ('Technical Data', {
            'fields': ('density', 'porosity', 'compressive_strength', 'flexural_strength'),
            'classes': ('collapse',)
        }),
    )


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1


class ProjectVideoInline(admin.TabularInline):
    model = ProjectVideo
    extra = 1


class ProjectStoneInline(admin.TabularInline):
    model = ProjectStone
    extra = 1


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title_en', 'category_en', 'year', 'location_en', 'is_active', 'created_at']
    list_filter = ['category_en', 'year', 'is_active', 'created_at']
    search_fields = ['title_en', 'title_fa', 'description_en', 'description_fa']
    inlines = [ProjectImageInline, ProjectVideoInline, ProjectStoneInline]
    fieldsets = (
        ('Basic Information', {
            'fields': ('title_en', 'title_fa', 'description_en', 'description_fa')
        }),
        ('Project Details', {
            'fields': ('location_en', 'location_fa', 'year', 'category_en', 'category_fa')
        }),
        ('Client Information', {
            'fields': ('client_en', 'client_fa', 'size_en', 'size_fa', 'duration_en', 'duration_fa'),
            'classes': ('collapse',)
        }),
        ('Project Story', {
            'fields': ('challenges_en', 'challenges_fa', 'solutions_en', 'solutions_fa'),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_at', 'updated_at', 'is_active']
    list_filter = ['is_active', 'created_at']
    search_fields = ['user__username', 'user__email']
    inlines = [CartItemInline]


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['cart', 'stone', 'quantity', 'created_at']
    list_filter = ['created_at']
    search_fields = ['cart__user__username', 'stone__name_en']


class QuoteItemInline(admin.TabularInline):
    model = QuoteItem
    extra = 0


@admin.register(Quote)
class QuoteAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'project_type', 'status', 'created_at']
    list_filter = ['status', 'project_type', 'created_at']
    search_fields = ['name', 'email', 'company', 'project_type']
    inlines = [QuoteItemInline]
    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'company', 'phone')
        }),
        ('Project Details', {
            'fields': ('project_type', 'project_location', 'timeline', 'additional_notes')
        }),
        ('Status', {
            'fields': ('status',)
        }),
    )


@admin.register(QuoteItem)
class QuoteItemAdmin(admin.ModelAdmin):
    list_display = ['quote', 'stone', 'quantity', 'notes']
    list_filter = ['quote__status']
    search_fields = ['quote__name', 'stone__name_en']


# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

# Register other models
admin.site.register(Order)
admin.site.register(OrderItem)
