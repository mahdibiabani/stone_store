from django.core.management.base import BaseCommand
from store.models import Category, Stone, StoneImage, Project, ProjectImage, ProjectStone


class Command(BaseCommand):
    help = 'Populate database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Creating categories...')
        
        # Create categories
        onyx_category, created = Category.objects.get_or_create(
            slug='onyx',
            defaults={
                'name_en': 'Onyx',
                'name_fa': 'اونیکس',
                'description_en': 'Luxurious translucent stones perfect for backlit applications',
                'description_fa': 'سنگ‌های شفاف لوکس مناسب برای کاربردهای نورپردازی'
            }
        )
        
        travertine_category, created = Category.objects.get_or_create(
            slug='travertine',
            defaults={
                'name_en': 'Travertine',
                'name_fa': 'تراورتن',
                'description_en': 'Classic natural stones ideal for both interior and exterior',
                'description_fa': 'سنگ‌های طبیعی کلاسیک مناسب برای کاربردهای داخلی و خارجی'
            }
        )
        
        marble_category, created = Category.objects.get_or_create(
            slug='marble',
            defaults={
                'name_en': 'Marble',
                'name_fa': 'مرمر',
                'description_en': 'Elegant stones perfect for modern architectural designs',
                'description_fa': 'سنگ‌های زیبا مناسب برای طراحی‌های معماری مدرن'
            }
        )
        
        self.stdout.write('Creating stones...')
        
        # Create stones
        royal_onyx, created = Stone.objects.get_or_create(
            name_en='Royal Onyx',
            defaults={
                'name_fa': 'اونیکس سلطنتی',
                'category': onyx_category,
                'description_en': 'Luxurious translucent onyx with golden veining, perfect for backlit applications and premium interiors.',
                'description_fa': 'اونیکس شفاف لوکس با رگه‌های طلایی، مناسب برای کاربردهای نورپردازی و فضاهای داخلی ممتاز.',
                'origin': 'Isfahan, Iran',
                'price': 85.00,
                'density': '2.7 g/cm³',
                'porosity': '0.2%',
                'compressive_strength': '140 MPa',
                'flexural_strength': '15 MPa'
            }
        )
        
        persian_travertine, created = Stone.objects.get_or_create(
            name_en='Persian Travertine',
            defaults={
                'name_fa': 'تراورتن پارسی',
                'category': travertine_category,
                'description_en': 'Classic beige travertine with natural patterns, ideal for both interior and exterior applications.',
                'description_fa': 'تراورتن کلاسیک بژ با الگوهای طبیعی، مناسب برای کاربردهای داخلی و خارجی.',
                'origin': 'Mahallat, Iran',
                'price': 65.00,
                'density': '2.5 g/cm³',
                'porosity': '5%',
                'compressive_strength': '90 MPa',
                'flexural_strength': '8 MPa'
            }
        )
        
        silver_marble, created = Stone.objects.get_or_create(
            name_en='Silver Marble',
            defaults={
                'name_fa': 'مرمر نقره‌ای',
                'category': marble_category,
                'description_en': 'Elegant silver-gray marble with subtle white veining, perfect for modern architectural designs.',
                'description_fa': 'مرمر نقره‌ای زیبا با رگه‌های ظریف سفید، مناسب برای طراحی‌های معماری مدرن.',
                'origin': 'Kerman, Iran',
                'price': 95.00,
                'density': '2.8 g/cm³',
                'porosity': '1%',
                'compressive_strength': '120 MPa',
                'flexural_strength': '12 MPa'
            }
        )
        
        self.stdout.write('Creating projects...')
        
        # Create projects
        hotel_project, created = Project.objects.get_or_create(
            title_en='Luxury Hotel Lobby',
            defaults={
                'title_fa': 'لابی هتل لوکس',
                'description_en': 'A stunning lobby design featuring premium stone materials and modern architecture.',
                'description_fa': 'طراحی لابی خیره‌کننده با استفاده از مصالح سنگی ممتاز و معماری مدرن.',
                'location_en': 'Tehran, Iran',
                'location_fa': 'تهران، ایران',
                'year': '2023',
                'category_en': 'Commercial',
                'category_fa': 'تجاری',
                'client_en': 'Grand Hotel Group',
                'client_fa': 'گروه هتل گرند',
                'size_en': '500 sqm',
                'size_fa': '۵۰۰ متر مربع',
                'duration_en': '6 months',
                'duration_fa': '۶ ماه'
            }
        )
        
        office_project, created = Project.objects.get_or_create(
            title_en='Modern Office Building',
            defaults={
                'title_fa': 'ساختمان اداری مدرن',
                'description_en': 'Contemporary office design with sustainable stone materials and innovative architecture.',
                'description_fa': 'طراحی اداری معاصر با مصالح سنگی پایدار و معماری نوآورانه.',
                'location_en': 'Isfahan, Iran',
                'location_fa': 'اصفهان، ایران',
                'year': '2022',
                'category_en': 'Commercial',
                'category_fa': 'تجاری',
                'client_en': 'Tech Solutions Inc.',
                'client_fa': 'شرکت راه‌حل‌های فناوری',
                'size_en': '1200 sqm',
                'size_fa': '۱۲۰۰ متر مربع',
                'duration_en': '8 months',
                'duration_fa': '۸ ماه'
            }
        )
        
        # Create project-stone relationships
        ProjectStone.objects.get_or_create(
            project=hotel_project,
            stone=royal_onyx,
            defaults={'quantity': 50, 'notes': 'Main lobby feature wall'}
        )
        
        ProjectStone.objects.get_or_create(
            project=hotel_project,
            stone=silver_marble,
            defaults={'quantity': 30, 'notes': 'Flooring and reception desk'}
        )
        
        ProjectStone.objects.get_or_create(
            project=office_project,
            stone=persian_travertine,
            defaults={'quantity': 80, 'notes': 'Exterior facade'}
        )
        
        ProjectStone.objects.get_or_create(
            project=office_project,
            stone=silver_marble,
            defaults={'quantity': 40, 'notes': 'Interior common areas'}
        )
        
        self.stdout.write(
            self.style.SUCCESS('Successfully populated database with sample data!')
        )
