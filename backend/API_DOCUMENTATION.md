# Stone Store Backend API Documentation

## Authentication Flow

### 1. User Registration
**POST** `/api/register/`

```json
{
    "username": "user123",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "password": "securepassword123",
    "password_confirm": "securepassword123"
}
```

**Response:**
```json
{
    "user": {
        "id": 1,
        "username": "user123",
        "email": "user@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "date_joined": "2024-01-01T00:00:00Z"
    },
    "token": "abc123def456...",
    "message": "User registered successfully"
}
```

### 2. User Login
**POST** `/api/auth/login/`

```json
{
    "username": "user123",
    "password": "securepassword123"
}
```

**Response:**
```json
{
    "user": {
        "id": 1,
        "username": "user123",
        "email": "user@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "date_joined": "2024-01-01T00:00:00Z"
    },
    "token": "abc123def456...",
    "message": "Login successful"
}
```

## Cart Management

### Get Cart
**GET** `/api/cart/`
**Headers:** `Authorization: Token your_token_here`

### Add Item to Cart
**POST** `/api/cart/add_item/`
**Headers:** `Authorization: Token your_token_here`

```json
{
    "stone_id": 1,
    "quantity": 2,
    "selected_finish": "Polished",
    "selected_thickness": "2cm",
    "notes": "Special requirements"
}
```

### Update Cart Item
**POST** `/api/cart/update_item/`
**Headers:** `Authorization: Token your_token_here`

```json
{
    "item_id": 1,
    "quantity": 3
}
```

### Remove Item from Cart
**POST** `/api/cart/remove_item/`
**Headers:** `Authorization: Token your_token_here`

```json
{
    "item_id": 1
}
```

### Clear Cart
**POST** `/api/cart/clear/`
**Headers:** `Authorization: Token your_token_here`

## Checkout and Payment

### Checkout (Create Order and Initiate Payment)
**POST** `/api/cart/checkout/`
**Headers:** `Authorization: Token your_token_here`

```json
{
    "shipping": {
        "address": "123 Main Street, Tehran, Iran",
        "city": "Tehran",
        "postal_code": "1234567890",
        "phone": "+989123456789"
    }
}
```

**Response:**
```json
{
    "order": {
        "id": 1,
        "order_number": "ORD-ABC12345",
        "status": "pending",
        "total_amount": "150000.00",
        "shipping_address": "123 Main Street, Tehran, Iran",
        "shipping_city": "Tehran",
        "shipping_postal_code": "1234567890",
        "shipping_phone": "+989123456789",
        "items": [...]
    },
    "payment_url": "https://sandbox.zarinpal.com/pg/StartPay/abc123...",
    "authority": "abc123def456..."
}
```

## Order Management

### Get User Orders
**GET** `/api/orders/`
**Headers:** `Authorization: Token your_token_here`

### Get Specific Order
**GET** `/api/orders/{order_id}/`
**Headers:** `Authorization: Token your_token_here`

## Payment Callback

### Payment Success/Failure Callback
**GET/POST** `/api/payment/callback/`

This endpoint is called by ZarinPal after payment completion. It handles:
- Payment verification
- Order status updates
- Cart clearing on successful payment

## ZarinPal Integration

### Configuration
The system is configured for ZarinPal sandbox mode:

```python
# settings.py
ZARINPAL_MERCHANT_ID = 'sandbox'  # Replace with your actual merchant ID
ZARINPAL_SANDBOX = True
ZARINPAL_CALLBACK_URL = 'http://localhost:8000/api/payment/callback/'
```

### Payment Flow
1. User adds items to cart
2. User clicks checkout
3. System creates order and initiates ZarinPal payment
4. User is redirected to ZarinPal payment page
5. After payment, ZarinPal redirects back to callback URL
6. System verifies payment and updates order status
7. Cart is cleared on successful payment

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `404` - Not Found
- `500` - Internal Server Error

Error responses include detailed error messages:
```json
{
    "error": "Cart is empty"
}
```

## Authentication

Use token authentication by including the token in the Authorization header:
```
Authorization: Token your_token_here
```

## Testing the Payment Flow

1. Register a new user
2. Login to get authentication token
3. Add items to cart
4. Call checkout endpoint with shipping information
5. Use the returned `payment_url` to test payment
6. For sandbox testing, use ZarinPal test cards
7. Check order status after payment completion

## Order Statuses

- `pending` - Order created, payment not completed
- `paid` - Payment completed successfully
- `processing` - Order being processed
- `shipped` - Order shipped
- `delivered` - Order delivered
- `cancelled` - Order cancelled
