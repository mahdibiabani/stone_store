from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserProfile(models.Model):
    """Extended user profile with additional fields"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Create UserProfile when User is created"""
    if created:
        UserProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """Save UserProfile when User is saved"""
    if hasattr(instance, 'profile'):
        instance.profile.save()


class MultilingualTextField(models.Model):
    """Abstract model for multilingual text fields"""
    text_en = models.TextField()
    text_fa = models.TextField()
    
    class Meta:
        abstract = True


class Category(models.Model):
    name_en = models.CharField(max_length=100)
    name_fa = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description_en = models.TextField(blank=True)
    description_fa = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name_en


class Stone(models.Model):
    name_en = models.CharField(max_length=200)
    name_fa = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='stones')
    description_en = models.TextField()
    description_fa = models.TextField()
    origin = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Technical data
    density = models.CharField(max_length=50, blank=True)
    porosity = models.CharField(max_length=50, blank=True)
    compressive_strength = models.CharField(max_length=50, blank=True)
    flexural_strength = models.CharField(max_length=50, blank=True)
    
    def __str__(self):
        return self.name_en


class StoneImage(models.Model):
    stone = models.ForeignKey(Stone, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='stones/')
    alt_text = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order', 'id']


class StoneVideo(models.Model):
    stone = models.ForeignKey(Stone, on_delete=models.CASCADE, related_name='videos')
    video_url = models.URLField()
    title = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)


class Project(models.Model):
    title_en = models.CharField(max_length=200)
    title_fa = models.CharField(max_length=200)
    description_en = models.TextField()
    description_fa = models.TextField()
    location_en = models.CharField(max_length=200)
    location_fa = models.CharField(max_length=200)
    year = models.CharField(max_length=4)
    category_en = models.CharField(max_length=100)
    category_fa = models.CharField(max_length=100)
    client_en = models.CharField(max_length=200, blank=True)
    client_fa = models.CharField(max_length=200, blank=True)
    size_en = models.CharField(max_length=100, blank=True)
    size_fa = models.CharField(max_length=100, blank=True)
    duration_en = models.CharField(max_length=100, blank=True)
    duration_fa = models.CharField(max_length=100, blank=True)
    challenges_en = models.TextField(blank=True)
    challenges_fa = models.TextField(blank=True)
    solutions_en = models.TextField(blank=True)
    solutions_fa = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title_en


class ProjectImage(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='projects/')
    alt_text = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order', 'id']


class ProjectVideo(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='videos')
    video_url = models.URLField()
    title = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)


class ProjectStone(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='project_stones')
    stone = models.ForeignKey(Stone, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    notes = models.TextField(blank=True)


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='carts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Cart for {self.user.username}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    stone = models.ForeignKey(Stone, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    selected_finish = models.CharField(max_length=100, blank=True)
    selected_thickness = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.quantity}x {self.stone.name_en}"


class Quote(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quotes', null=True, blank=True)
    name = models.CharField(max_length=200)
    email = models.EmailField()
    company = models.CharField(max_length=200, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    project_type = models.CharField(max_length=100)
    project_location = models.CharField(max_length=200)
    timeline = models.CharField(max_length=100)
    additional_notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Quote from {self.name} - {self.project_type}"


class QuoteItem(models.Model):
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE, related_name='items')
    stone = models.ForeignKey(Stone, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.quantity}x {self.stone.name_en} for {self.quote.name}"


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    order_number = models.CharField(max_length=50, unique=True)
    tracking_code = models.CharField(max_length=50, unique=True, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Payment information
    payment_id = models.CharField(max_length=100, blank=True)  # ZarinPal payment ID
    payment_status = models.CharField(max_length=20, default='pending')
    payment_date = models.DateTimeField(null=True, blank=True)
    
    # Shipping information
    shipping_address = models.TextField()
    shipping_city = models.CharField(max_length=100)
    shipping_postal_code = models.CharField(max_length=20)
    shipping_phone = models.CharField(max_length=20)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Order {self.order_number} - {self.user.username}"
    
    def save(self, *args, **kwargs):
        if not self.order_number:
            import uuid
            self.order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        
        # Generate tracking code when order is paid or processing
        if not self.tracking_code and self.status in ['paid', 'processing']:
            import uuid
            self.tracking_code = f"TRK-{uuid.uuid4().hex[:10].upper()}"
        
        super().save(*args, **kwargs)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    stone = models.ForeignKey(Stone, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Price at time of purchase
    selected_finish = models.CharField(max_length=100, blank=True)
    selected_thickness = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.quantity}x {self.stone.name_en} in Order {self.order.order_number}"