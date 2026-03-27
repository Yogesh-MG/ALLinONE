from google import genai
from google.genai import types
import json
from django.conf import settings
import os


#try:
    # Attempt to use the provided setting (assuming this script is outside the settings file)
   # from backend.backend.settings import GEMINI_API_KEY
#except ImportError:
    # Fallback to an environment variable or simple placeholder for testing
 #   GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "YOUR_ACTUAL_API_KEY_HERE")
    
  #  if GEMINI_API_KEY == "YOUR_ACTUAL_API_KEY_HERE":
        
   #     print("Warning: GEMINI_API_KEY not loaded. Replace 'YOUR_ACTUAL_API_KEY_HERE' or set the environment variable.")
        # If the key isn't set, the script will likely fail when creating the client.


GEMINI_API_KEY = settings.GEMINI_API_KEY
# Initialize the client outside the function to reuse the connection
try:
    client = genai.Client(api_key=GEMINI_API_KEY)
except Exception as e:
    print(f"Error initializing Gemini Client: {e}")
    # You might want to handle this error (e.g., by exiting or setting client to None)
    client = None


# ----------------------------------------------------------------------
# Core Analysis Function
# ----------------------------------------------------------------------

def cloud_google_analysis(image_path: str):
    """
    Analyzes a medical image using the Gemini API and returns the result
    in a structured JSON format.
    """
    if not client:
        return {"error": "Gemini Client failed to initialize. Check API Key."}

    # --- 1. Load the Local Image File ---
    try:
        with open(image_path, "rb") as f:
            image_bytes = f.read()
    except FileNotFoundError:
        print(f"Error: The file '{image_path}' was not found.")
        return {"error": f"File not found: {image_path}"}
    except Exception as e:
        print(f"Error reading image file: {e}")
        return {"error": f"Error reading image file: {e}"}

    image = types.Part.from_bytes(
        data=image_bytes, 
        mime_type="image/jpeg"
    )
    
    # --- 2. Define the Response Schema ---
    disease_schema = types.Schema(
        type=types.Type.OBJECT,
        properties={
            "prediction": types.Schema(
                type=types.Type.STRING,
                description="The most likely disease or condition identified in the image.",
            ),
            "confidence": types.Schema(
                type=types.Type.NUMBER,
                # Adjusted description to reflect the common 0-100 scale
                description="The model's confidence in the prediction, as a percentage (e.g., 95.50).",
            ),
            "details": types.Schema(
                type=types.Type.STRING,
                description="A brief explanation of the model's analysis, e.g., 'Tumor identified in the left frontal lobe.'",
            ),
            "recommendations": types.Schema(
                type=types.Type.ARRAY,
                items=types.Schema(type=types.Type.STRING),
                description="A list of 2-3 clinical recommendations or follow-up actions.",
            ),
        },
        required=["prediction", "confidence", "details", "recommendations"],
    )
    
    # --- 3. Configure the API Call ---
    config = types.GenerateContentConfig(
        response_mime_type="application/json",
        response_schema=disease_schema,
    )
    
    # Adjusted prompt to ensure the confidence is a 0-100 percentage.
    prompt_text = (
        "Analyze the provided medical image. Identify the primary disease or "
        "condition visible and its location. **Output the results strictly in the JSON format "
        "specified in the schema.** Ensure the 'confidence' is a numerical percentage between 0.00 and 100.00."
    )
    
    # --- 4. Call the Gemini API ---
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[prompt_text, image],
            config=config,
        )
    except Exception as e:
        print(f"Gemini API call failed: {e}")
        return {"error": f"Gemini API call failed: {e}"}

    # --- 5. Process the JSON Output ---
    try:
        # The model returns the JSON as a string in response.text
        json_output = json.loads(response.text)
    except json.JSONDecodeError:
        # If the model fails to return perfect JSON, return the raw text for debugging
        print("Warning: Could not decode response as valid JSON.")
        json_output = {"raw_response_error": response.text}

    return json_output


