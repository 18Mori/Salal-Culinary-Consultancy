from django.db import models


class MpesaRequest(models.Model):
    phone_number = models.CharField(max_length=15)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    account_reference = models.CharField(max_length=50)
    transaction_desc = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
    checkout_request_id = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.phone_number} - {self.amount}"

class MpesaResponse(models.Model):
    request = models.OneToOneField(MpesaRequest, on_delete=models.CASCADE)
    response_code = models.CharField(max_length=10)
    response_description = models.TextField()
    customer_message = models.TextField()
    merchant_request_id = models.CharField(max_length=100)
    checkout_request_id = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Response for {self.request.phone_number}"
