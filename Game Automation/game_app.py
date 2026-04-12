import cv2
import numpy as np
from gesture_controller import GestureController

# ---------- GAME STATE ----------
gesture = GestureController()

speed = 0
distance = 0
MAX_SPEED = 20

car_x = 300
car_y = 380

# ---------- GAME LOOP ----------
while True:
    frame, action = gesture.update()
    if frame is None:
        break

    h, w, _ = frame.shape

    # ---------- GAME LOGIC ----------
    if action == "GAS":
        speed += 0.5
    elif action == "BRAKE":
        speed -= 1
    else:
        speed -= 0.2

    speed = max(0, min(speed, MAX_SPEED))
    distance += speed * 0.1

    # ---------- DRAW GAME ----------
    game_canvas = np.zeros_like(frame)

    # Road
    cv2.rectangle(game_canvas, (0, 350), (w, h), (50, 50, 50), -1)

    # Car
    cv2.rectangle(game_canvas, (car_x-30, car_y-20),
                  (car_x+30, car_y+20), (0, 0, 255), -1)

    # HUD
    cv2.putText(game_canvas, f"Speed: {int(speed)}",
                (30, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 2)
    cv2.putText(game_canvas, f"Distance: {int(distance)} m",
                (30, 80), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 2)
    cv2.putText(game_canvas, f"Action: {action}",
                (30, 120), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,0), 2)

    # ---------- SHOW ----------
    cv2.imshow("Gesture Drive – In App Game", game_canvas)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

gesture.release()
