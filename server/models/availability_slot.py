from datetime import time

class AvailabilitySlot:
    def __init__(self, day: str, start_time: time, end_time: time):
        self.day = day
        self.start_time = start_time
        self.end_time = end_time