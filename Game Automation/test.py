# test_keys.py
import time
from directkeys import PressKey, ReleaseKey, right_pressed

time.sleep(3)
PressKey(right_pressed)
time.sleep(2)
ReleaseKey(right_pressed)
