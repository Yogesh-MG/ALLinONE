from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import XrayUploadSerializer
from .inference import predict, predict_brain
import tempfile
from rest_framework.permissions import AllowAny, IsAuthenticated
from .google_cloud import cloud_google_analysis


class PneumoniaTestView(generics.GenericAPIView):
    serializer_class = XrayUploadSerializer
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Save temp image for prediction
        image_file = serializer.validated_data['image']
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            for chunk in image_file.chunks():
                tmp.write(chunk)
            tmp_path = tmp.name

        # Run ML model
        result = predict(tmp_path)

        return Response(result, status=status.HTTP_200_OK)

class BrainTumorTestView(generics.GenericAPIView):
    serializer_class = XrayUploadSerializer
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Save temp image for prediction
        image_file = serializer.validated_data['image']
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            for chunk in image_file.chunks():
                tmp.write(chunk)
            tmp_path = tmp.name

        # Run ML model
        result = predict_brain(tmp_path)

        return Response(result, status=status.HTTP_200_OK)
    
class CloudAnalysis(generics.GenericAPIView):
    serializer_class = XrayUploadSerializer
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        image_file = serializer.validated_data['image']
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            for chunk in image_file.chunks():
                tmp.write(chunk)
            tmp_path = tmp.name
            
        image_path = tmp_path        
        output = cloud_google_analysis(image_path=image_path)
        
        return Response(output, status=status.HTTP_200_OK)
        
        
    