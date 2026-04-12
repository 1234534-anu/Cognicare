import ctypes

user32 = ctypes.windll.user32

# Virtual-Key codes (Windows)
VK_LEFT  = 0x25   # ←
VK_RIGHT = 0x27   # →

KEYEVENTF_KEYUP = 0x0002


def PressKey(vk):
    user32.keybd_event(vk, 0, 0, 0)


def ReleaseKey(vk):
    user32.keybd_event(vk, 0, KEYEVENTF_KEYUP, 0)


left_pressed  = VK_LEFT
right_pressed = VK_RIGHT
