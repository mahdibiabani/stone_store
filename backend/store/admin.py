from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
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
    list_display = ['name_display', 'slug', 'created_at']
    search_fields = ['name_en', 'name_fa']
    prepopulated_fields = {'slug': ('name_en',)}
    
    def name_display(self, obj):
        return format_html(
            '<div style="direction: ltr; text-align: left;">{}</div>'
            '<div style="direction: rtl; text-align: right; font-family: Vazir, Tahoma, Arial;">{}</div>',
            obj.name_en,
            obj.name_fa
        )
    name_display.short_description = 'Name (EN/FA)'


@admin.register(Stone)
class StoneAdmin(admin.ModelAdmin):
    list_display = ['name_display', 'category', 'origin', 'price_display', 'is_active', 'created_at']
    list_filter = ['category', 'origin', 'is_active', 'created_at']
    search_fields = ['name_en', 'name_fa', 'description_en', 'description_fa']
    inlines = [StoneImageInline, StoneVideoInline]
    fieldsets = (
        ('Basic Information', {
            'fields': ('name_en', 'name_fa', 'category', 'description_en', 'description_fa'),
            'description': 'Enter the stone name and description in both English and Persian'
        }),
        ('Details', {
            'fields': ('origin', 'price', 'is_active')
        }),
        ('Technical Data', {
            'fields': ('density', 'porosity', 'compressive_strength', 'flexural_strength'),
            'classes': ('collapse',),
            'description': 'Technical specifications of the stone'
        }),
    )
    
    def name_display(self, obj):
        return format_html(
            '<div style="direction: ltr; text-align: left; margin-bottom: 5px;"><strong>EN:</strong> {}</div>'
            '<div style="direction: rtl; text-align: right; font-family: Vazir, Tahoma, Arial;"><strong>فا:</strong> {}</div>',
            obj.name_en,
            obj.name_fa
        )
    name_display.short_description = 'Name'
    
    def price_display(self, obj):
        return format_html(
            '<span style="color: #28a745; font-weight: bold;">${:,.2f}</span>',
            obj.price
        )
    price_display.short_description = 'Price'


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
    list_display = ['title_display', 'category_display', 'year', 'location_display', 'is_active', 'created_at']
    list_filter = ['category_en', 'year', 'is_active', 'created_at']
    search_fields = ['title_en', 'title_fa', 'description_en', 'description_fa']
    inlines = [ProjectImageInline, ProjectVideoInline, ProjectStoneInline]
    fieldsets = (
        ('Basic Information', {
            'fields': ('title_en', 'title_fa', 'description_en', 'description_fa'),
            'description': 'Project title and description in both languages'
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
    
    def title_display(self, obj):
        return format_html(
            '<div style="direction: ltr; text-align: left; margin-bottom: 3px;"><strong>EN:</strong> {}</div>'
            '<div style="direction: rtl; text-align: right; font-family: Vazir, Tahoma, Arial;"><strong>فا:</strong> {}</div>',
            obj.title_en,
            obj.title_fa
        )
    title_display.short_description = 'Title'
    
    def category_display(self, obj):
        return format_html(
            '<div style="direction: ltr; text-align: left; margin-bottom: 3px;">{}</div>'
            '<div style="direction: rtl; text-align: right; font-family: Vazir, Tahoma, Arial;">{}</div>',
            obj.category_en,
            obj.category_fa
        )
    category_display.short_description = 'Category'
    
    def location_display(self, obj):
        return format_html(
            '<div style="direction: ltr; text-align: left; margin-bottom: 3px;">{}</div>'
            '<div style="direction: rtl; text-align: right; font-family: Vazir, Tahoma, Arial;">{}</div>',
            obj.location_en,
            obj.location_fa
        )
    location_display.short_description = 'Location'


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
