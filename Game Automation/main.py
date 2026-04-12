import cv2
import time
from mediapipe import Image, ImageFormat
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from directkeys import PressKey, ReleaseKey, left_pressed, right_pressed

# ================= CONFIG =================
MODEL_PATH = r"C:\Users\JAYASHRII\OneDrive\Desktop\GameChanger\Game Automation\hand_landmarker.task"

INFERENCE_INTERVAL = 0.18  # ~5 FPS

BaseOptions = python.BaseOptions
HandLandmarkerOptions = vision.HandLandmarkerOptions
VisionRunningMode = vision.RunningMode

current_result = None
current_key_pressed = set()
last_inference_time = 0


def result_callback(result, output_image, timestamp_ms):
    global current_result
    current_result = result


# ================= MEDIAPIPE =================
options = HandLandmarkerOptions(
    base_options=BaseOptions(model_asset_path=MODEL_PATH),
    running_mode=VisionRunningMode.LIVE_STREAM,
    num_hands=1,
    result_callback=result_callback
)

landmarker = vision.HandLandmarker.create_from_options(options)
cap = cv2.VideoCapture(0)

# ================= MAIN LOOP =================
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    now = time.time()

    # Run inference only sometimes
    if now - last_inference_time > INFERENCE_INTERVAL:
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_image = Image(image_format=ImageFormat.SRGB, data=rgb)
        landmarker.detect_async(mp_image, int(now * 1000))
        last_inference_time = now

    # ---------- DETERMINE ACTION ----------
    action = "NONE"

    if current_result and current_result.hand_landmarks:
        hand = current_result.hand_landmarks[0]

        open_fingers = sum(
            1 for tip, pip in [(8, 6), (12, 10), (16, 14), (20, 18)]
            if hand[tip].y < hand[pip].y
        )

        if open_fingers == 0:
            action = "BRAKE"
        elif open_fingers >= 4:
            action = "GAS"

    # ---------- KEYBOARD CONTROL ----------
    if action == "GAS":
        PressKey(right_pressed)
        current_key_pressed.add(right_pressed)

        if left_pressed in current_key_pressed:
            ReleaseKey(left_pressed)
            current_key_pressed.remove(left_pressed)

    elif action == "BRAKE":
        PressKey(left_pressed)
        current_key_pressed.add(left_pressed)

        if right_pressed in current_key_pressed:
            ReleaseKey(right_pressed)
            current_key_pressed.remove(right_pressed)

    else:
        for key in current_key_pressed:
            ReleaseKey(key)
        current_key_pressed.clear()

    # ---------- UI ----------
    cv2.putText(frame, action, (40, 100),
                cv2.FONT_HERSHEY_SIMPLEX, 2,
                (0, 255, 0) if action == "GAS" else (0, 0, 255), 4)

    cv2.imshow("Hand Control (Keyboard)", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
