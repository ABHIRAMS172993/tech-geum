from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction
from django.db.models import Sum, Count, F
from django.utils.dateparse import parse_date
from .models import Order, OrderItem
from .serializers import OrderSerializer
from products.models import Product

class OrderViewSet(viewsets.ReadOnlyModelViewSet, viewsets.mixins.CreateModelMixin):
    queryset = Order.objects.prefetch_related('items__product').select_related('customer').order_by('-created_at')
    serializer_class = OrderSerializer

    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel_order(self, request, pk=None):
        order = self.get_object()

        if order.status == 'CANCELLED':
            return Response(
                {"error": "This order is already cancelled."},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            # Restore stock for each item
            for item in order.items.select_related('product'):
                Product.objects.filter(id=item.product.id).update(
                    stock=F('stock') + item.quantity
                )

            order.status = 'CANCELLED'
            order.save(update_fields=['status'])

        return Response({"status": f"Order #{order.id} cancelled and inventory restored."})


class SalesReportView(APIView):
    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        orders = Order.objects.all()

        if start_date:
            parsed_start = parse_date(start_date)
            if parsed_start:
                orders = orders.filter(created_at__date__gte=parsed_start)

        if end_date:
            parsed_end = parse_date(end_date)
            if parsed_end:
                orders = orders.filter(created_at__date__lte=parsed_end)

        total_orders = orders.count()
        cancelled_orders = orders.filter(status='CANCELLED').count()
        completed_orders = orders.filter(status='COMPLETED')

        total_revenue = completed_orders.aggregate(total=Sum('total_price'))['total'] or 0.00

        top_products = (
            OrderItem.objects.filter(order__in=completed_orders)
            .values('product__id', 'product__name')
            .annotate(
                total_quantity_sold=Sum('quantity'),
                total_revenue_generated=Sum(F('quantity') * F('unit_price'))
            )
            .order_by('-total_quantity_sold')[:5]
        )

        return Response({
            "metrics": {
                "total_orders": total_orders,
                "completed_orders": completed_orders.count(),
                "cancelled_orders": cancelled_orders,
                "total_revenue": total_revenue,
            },
            "top_selling_products": list(top_products)
        })