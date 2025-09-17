import requests
import json
import uuid
from django.conf import settings
from django.utils import timezone


class ZarinPalPayment:
    def __init__(self):
        self.merchant_id = settings.ZARINPAL_MERCHANT_ID
        self.sandbox = settings.ZARINPAL_SANDBOX
        self.callback_url = settings.ZARINPAL_CALLBACK_URL
        
        if self.sandbox:
            self.request_url = "https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentRequest.json"
            self.verify_url = "https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentVerification.json"
            self.start_pay_url = "https://sandbox.zarinpal.com/pg/StartPay/"
        else:
            self.request_url = "https://api.zarinpal.com/pg/v4/payment/request.json"
            self.verify_url = "https://api.zarinpal.com/pg/v4/payment/verify.json"
            self.start_pay_url = "https://www.zarinpal.com/pg/StartPay/"
    
    def create_payment_request(self, amount, description, order_id, user_email=None, user_phone=None):
        """
        Create a payment request with ZarinPal
        """
        # Check if we should use mock payment for development
        if getattr(settings, 'USE_MOCK_PAYMENT', False):
            return self._create_mock_payment_request(amount, description, order_id, user_email, user_phone)
        
        data = {
            "merchant_id": self.merchant_id,
            "amount": int(amount),  # Amount in Toman
            "description": description,
            "callback_url": self.callback_url,
            "metadata": {
                "order_id": str(order_id),
                "user_email": user_email,
                "user_phone": user_phone
            }
        }
        
        try:
            print(f"Making payment request to: {self.request_url}")
            print(f"Payment data: {data}")
            
            response = requests.post(self.request_url, json=data, timeout=10)
            print(f"Response status: {response.status_code}")
            print(f"Response headers: {response.headers}")
            
            # Check if response has content
            if not response.text.strip():
                return {
                    'success': False,
                    'error': 'Empty response from payment gateway'
                }
            
            print(f"Response text: {response.text}")
            result = response.json()
            
            if result.get('data', {}).get('code') == 100:
                return {
                    'success': True,
                    'authority': result['data']['authority'],
                    'payment_url': f"{self.start_pay_url}{result['data']['authority']}"
                }
            else:
                error_msg = result.get('errors', {}).get('message', 'Payment request failed')
                print(f"Payment failed: {error_msg}")
                return {
                    'success': False,
                    'error': error_msg
                }
        except requests.RequestException as e:
            print(f"Request exception: {str(e)}")
            return {
                'success': False,
                'error': f'Network error: {str(e)}'
            }
        except ValueError as e:
            print(f"JSON decode error: {str(e)}")
            print(f"Response content: {response.text if 'response' in locals() else 'No response'}")
            return {
                'success': False,
                'error': f'Invalid response from payment gateway: {str(e)}'
            }
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return {
                'success': False,
                'error': f'Unexpected error: {str(e)}'
            }
    
    def _create_mock_payment_request(self, amount, description, order_id, user_email=None, user_phone=None):
        """
        Create a mock payment request for development/testing
        """
        print(f"Using mock payment for development")
        print(f"Amount: {amount}, Description: {description}, Order ID: {order_id}")
        
        # Generate a fake authority code
        mock_authority = str(uuid.uuid4()).replace('-', '')[:32]
        
        # Create a mock payment URL that shows payment page
        mock_payment_url = f"http://localhost:8000/payment/mock/?authority={mock_authority}&amount={amount}&description={description}&order_id={order_id}"
        
        return {
            'success': True,
            'authority': mock_authority,
            'payment_url': mock_payment_url
        }
    
    def verify_payment(self, authority, amount):
        """
        Verify payment with ZarinPal
        """
        # Check if we should use mock payment for development
        if getattr(settings, 'USE_MOCK_PAYMENT', False):
            return self._verify_mock_payment(authority, amount)
        
        data = {
            "merchant_id": self.merchant_id,
            "amount": int(amount),
            "authority": authority
        }
        
        try:
            response = requests.post(self.verify_url, json=data, timeout=10)
            result = response.json()
            
            if result.get('data', {}).get('code') == 100:
                return {
                    'success': True,
                    'ref_id': result['data']['ref_id'],
                    'card_pan': result['data'].get('card_pan', ''),
                    'card_hash': result['data'].get('card_hash', ''),
                    'fee_type': result['data'].get('fee_type', ''),
                    'fee': result['data'].get('fee', 0)
                }
            else:
                return {
                    'success': False,
                    'error': result.get('errors', {}).get('message', 'Payment verification failed')
                }
        except requests.RequestException as e:
            return {
                'success': False,
                'error': f'Network error: {str(e)}'
            }
        except Exception as e:
            return {
                'success': False,
                'error': f'Unexpected error: {str(e)}'
            }
    
    def _verify_mock_payment(self, authority, amount):
        """
        Mock payment verification for development/testing
        """
        print(f"Mock payment verification - Authority: {authority}, Amount: {amount}")
        
        # Always return success for mock payments
        return {
            'success': True,
            'ref_id': f"MOCK{authority[:10]}",
            'card_pan': '123456****1234',
            'card_hash': 'mock_hash',
            'fee_type': 'Payer',
            'fee': 0
        }
