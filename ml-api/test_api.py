import requests
import json

def test_api():
    url = "http://localhost:6000/predict"
    test_reviews = [
        "This movie was absolutely amazing! The acting was superb and the plot kept me engaged throughout.",
        "The movie was okay. Some parts were good, but others were boring.",
        "This is the worst movie I've ever seen. Complete waste of time and money.",
        "While the cinematography was beautiful, the story felt a bit disconnected and the pacing was slow.",
        "I can't decide if I liked it or not. It had its moments but also some major flaws."
    ]
    
    for review in test_reviews:
        print(f"\nTesting review: {review}")
        try:
            response = requests.post(url, json={"text": review})
            print("Status Code:", response.status_code)
            print("Response:", json.dumps(response.json(), indent=2))
        except Exception as e:
            print("Error:", str(e))

if __name__ == "__main__":
    test_api() 