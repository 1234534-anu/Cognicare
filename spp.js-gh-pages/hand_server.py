import cv2
import mediapipe as mp
import asyncio
import websockets
import json

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    max_num_hands=1,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.7
)

cap = cv2.VideoCapture(0)

async def handler(websocket):
    while True:
        ret, frame = cap.read()
        if not ret:
            continue

        frame = cv2.flip(frame, 1)
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        res = hands.process(rgb)

        if res.multi_hand_landmarks:
            lm = res.multi_hand_landmarks[0].landmark[8]  # index tip
            await websocket.send(json.dumps({
                "x": lm.x,
                "y": lm.y
            }))
        else:
            await websocket.send(json.dumps(None))

        await asyncio.sleep(0.016)  # ~60fps

async def main():
    async with websockets.serve(handler, "localhost", 8765):
        await asyncio.Future()

asyncio.run(main())
