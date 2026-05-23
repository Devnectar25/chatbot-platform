import os
import psycopg2
from dotenv import load_dotenv
from app.services.whatsapp_service import send_whatsapp_template

load_dotenv()

# Configuration
TEST_NUMBERS = ["918698338343", "918698338563", "918698338561", "918983343739", "919022469833"]
DB_URL = "postgresql://postgres:root@localhost:5432/medived"

def get_latest_campaign():
    """Fetch the most recent campaign from the database"""
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        cur.execute("SELECT festival_greeting_msg, offer_description, image_url FROM campaigns ORDER BY id DESC LIMIT 1")
        row = cur.fetchone()
        cur.close()
        conn.close()
        if row:
            return {
                "greeting": row[0],
                "description": row[1],
                "image_url": row[2]
            }
    except Exception as e:
        print(f"Error fetching campaign: {e}")
    return None

def broadcast():
    campaign = get_latest_campaign()
    if not campaign:
        print("❌ No campaign found in database!")
        return

    print(f"🚀 Starting Broadcast for Campaign: {campaign['greeting'][:30]}...")
    print(f"📸 Image: {campaign['image_url']}")

    for number in TEST_NUMBERS:
        print(f"📤 Sending to {number}...")
        
        # Build template components
        components = [
            {
                "type": "header",
                "parameters": [
                    {
                        "type": "image",
                        "image": {"link": campaign["image_url"]}
                    }
                ]
            },
            {
                "type": "body",
                "parameters": [
                    {"type": "text", "text": "Homeveda Customer"}, # {{customer_name}}
                    {"type": "text", "text": campaign["greeting"]}, # {{greeting_msg}}
                    {"type": "text", "text": campaign["description"]} # {{offer_description}}
                ]
            }
        ]
        
        send_whatsapp_template(number, "grand_sale", components)

    print("\n✅ Broadcast Complete! Check your WhatsApp.")

if __name__ == "__main__":
    broadcast()
