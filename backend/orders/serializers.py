from rest_framework import serializers
from django.db import transaction
from django.db.models import F
from .models import Order, OrderItem
from products.models import Product

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'unit_price']
        read_only_fields = ['unit_price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'customer', 'status', 'total_price', 'created_at', 'items']
        read_only_fields = ['total_price', 'status', 'created_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')

        if not items_data:
            raise serializers.ValidationError({"items": "An order must contain at least one item. "})

        with transaction.atomic():
            order = Order.objects.create(total_price=0, **validated_data)
            total_price = 0

            for item_data in items_data:
                product_id = item_data['product'].id
                quantity = item_data['quantity']

                product = Product.objects.select_for_update().get(id=product_id)

                if product.stock < quantity:
                    raise serializers.ValidationError(
                        {"stock": f"Insufficient stock for product '{product.name}'. Available: {product.stock}"}
                )

                product.stock = F('stock') - quantity
                product.save()

                unit_price = product.price
                item_total = unit_price * quantity
                total_price += item_total

                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=quantity,
                    unit_price=unit_price
                )
            order.total_price=total_price
            order.save()

        return order