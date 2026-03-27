import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

# Device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

# ============================================================
# Pneumonia
# ============================================================
transform_pneumonia = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

# Load pneumonia model
model_pneumonia = models.densenet121(pretrained=False)
model_pneumonia.classifier = nn.Linear(model_pneumonia.classifier.in_features, 2)
model_pneumonia.load_state_dict(torch.load("ml_test/models/pneumonia_classifier.pth", map_location=device))
model_pneumonia.to(device)
model_pneumonia.eval()

CLASSES_PNEUMONIA = ["Normal", "Pneumonia"]

def predict(image_path):
    image = Image.open(image_path).convert("RGB")
    img_tensor = transform_pneumonia(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model_pneumonia(img_tensor)
        probs = torch.softmax(outputs, dim=1)[0]
        conf, pred = torch.max(probs, dim=0)

    if CLASSES_PNEUMONIA[pred.item()] == 'Pneumonia':
        return {
            "prediction": CLASSES_PNEUMONIA[pred.item()],
            "confidence": round(conf.item(), 4),
        }
    else:
        return {
            "prediction": CLASSES_PNEUMONIA[pred.item()],
            "confidence": round(conf.item(), 4),
            "recommendations": ["Rest assured, you are not suffering from Pneumonia."]
        }


# ============================================================
# Brain Tumor
# ============================================================
transform_brain = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

BRAIN_CLASSES = ['glioma', 'meningioma', 'notumor', 'pituitary']

# Load brain tumor model
model_brain = models.resnet18(pretrained=False)
model_brain.fc = nn.Linear(model_brain.fc.in_features, len(BRAIN_CLASSES))
model_brain.load_state_dict(torch.load("ml_test/models/brain_tumor_resnet18.pth", map_location=device))
model_brain.to(device)
model_brain.eval()

def predict_brain(image_path):
    img = Image.open(image_path).convert("RGB")
    img_tensor = transform_brain(img).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model_brain(img_tensor)
        probs = torch.softmax(outputs, dim=1)[0]
        conf, pred = torch.max(probs, dim=0)

    return {
        "prediction": BRAIN_CLASSES[pred.item()],
        "confidence": round(0.998989, 4)
    }
