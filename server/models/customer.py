from .user import User

class Customer(User):
    def __init__(self, *args, address: str, payment_info: str, **kwargs):
        super().__init__(*args, **kwargs)
        self.address = address
        self.payment_info = payment_info