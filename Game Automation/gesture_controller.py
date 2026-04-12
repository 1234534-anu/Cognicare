import cv2
import time
from mediapipe import Image, ImageFormat
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

MODEL_PATH = r"C:\Users\Anuja Murugan\Desktop\GameChanger\Game Automation\hand_landmarker.task"

BaseOptions = python.BaseOptions
HandLandmarkerOptions = vision.HandLandmarkerOptions
VisionRunningMode = vision.RunningMode

class GestureController:
    def __init__(self):
        self.current_result = None
        self.last_inference_time = 0
        self.INFERENCE_INTERVAL = 0.18

        def callback(result, output_image, timestamp_ms):
            self.current_result = result

        options = HandLandmarkerOptions(
            base_options=BaseOptions(model_asset_path=MODEL_PATH),
            running_mode=VisionRunningMode.LIVE_STREAM,
            num_hands=1,
            result_callback=callback
        )

        self.landmarker = vision.HandLandmarker.create_from_options(options)
        self.cap = cv2.VideoCapture(0)

    def update(self):
        ret, frame = self.cap.read()
        if not ret:
            return None, "NONE"

        now = time.time()
        if now - self.last_inference_time > self.INFERENCE_INTERVAL:
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            mp_image = Image(image_format=ImageFormat.SRGB, data=rgb)
            self.landmarker.detect_async(mp_image, int(now * 1000))
            self.last_inference_time = now

        action = "NONE"
        if self.current_result and self.current_result.hand_landmarks:
            hand = self.current_result.hand_landmarks[0]
            open_fingers = sum(
                1 for tip, pip in [(8,6),(12,10),(16,14),(20,18)]
                if hand[tip].y < hand[pip].y
            )

            if open_fingers == 0:
                action = "BRAKE"
            elif open_fingers >= 4:
                action = "GAS"

        return frame, action

    def release(self):
        self.cap.release()
        cv2.destroyAllWindows()
