from django.db import models
from customers.models import Customer
from products.models import Product
from django.core.validators import MinValueValidator
# Create your models here.

class Order(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    )

    customer = models.ForeignKey(Customer, related_name='orders', on_delete=models.PROTECT)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    total_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00,null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.customer.user.username}"

class OrderItem(models.Model):
    order= models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product=models.ForeignKey(Product,on_delete=models.PROTECT, related_name='order_items')
    quantity=models.PositiveIntegerField(validators=[MinValueValidator(1)])
    unit_price=models.DecimalField(max_digits=10, decimal_places=2,null=True)

    @property
    def item_total(self):
        return self.quantity * self.unit_price

    class Meta:

        unique_together = ('order', 'product')