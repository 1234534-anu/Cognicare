import cv2
from gesture_controller import GestureController
from directkeys import PressKey, ReleaseKey, right_pressed, left_pressed

gesture = GestureController()
current_keys = set()

while True:
    frame, action = gesture.update()
    if frame is None:
        break

    # ---------- GAME LOGIC ----------
    if action == "GAS":
        PressKey(right_pressed)
        current_keys.add(right_pressed)

    elif action == "BRAKE":
        PressKey(left_pressed)
        current_keys.add(left_pressed)

    else:
        for k in current_keys:
            ReleaseKey(k)
        current_keys.clear()

    cv2.putText(frame, f"Action: {action}", (30,60),
                cv2.FONT_HERSHEY_SIMPLEX, 1.5, (255,255,255), 3)

    cv2.imshow("Gesture Game", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

gesture.release()
