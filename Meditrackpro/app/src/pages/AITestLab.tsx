import React, { useState } from "react";
import { Upload, Brain, Stethoscope, CloudUploadIcon,Eye, AlertCircle, CheckCircle, Loader } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { baseUrl } from "@/utils/apiconfig";
import { unknown } from "zod";

interface TestResult {
  prediction: string;
  confidence: number;
  details?: string;
  recommendations?: string[];
}

const testTypes = [
  {
    id: "brain-tumor",
    name: "Brain Tumor Detection",
    icon: Brain,
    description: "Upload MRI/CT scan images to detect brain tumors",
    acceptedFormats: "MRI/CT scans (.jpg, .png, .dicom)"
  },
  {
    id: "pneumonia",
    name: "Pneumonia Detection",
    icon: Stethoscope,
    description: "Upload chest X-ray images to detect pneumonia",
    acceptedFormats: "Chest X-rays (.jpg, .png)"
  },
  {
    id: "other",
    name: "Cloud-based Analysis",
    icon: CloudUploadIcon,
    description: "Upload  X-ray images to detect various conditions using cloud AI services",
    acceptedFormats: "X-rays (.jpg, .png)"
  }
];

const AITestLab = () => {
  const [selectedTest, setSelectedTest] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "application/dicom"];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPEG, PNG, or DICOM file.",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive"
        });
        return;
      }

      setUploadedFile(file);
      setResult(null);
    }
  };

  const runAnalysis = async () => {
    if (!selectedTest || !uploadedFile) {
      toast({
        title: "Missing information",
        description: "Please select a test type and upload an image.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    try {
        if (selectedTest === "pneumonia") {
          // Send to Django backend for pneumonia detection
          const formData = new FormData();
          formData.append("image", uploadedFile);

          const response = await axios.post(`${baseUrl}/api/ml/pneumonia/`, formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data"
            }
          });

          setResult({
            prediction: response.data.prediction,
            confidence: Math.round(response.data.confidence * 100 * 100) / 100, // Convert to percentage
            details: response.data.details || "Analysis completed using pneumonia detection model",
            recommendations: response.data.recommendations || ["Consult with a pulmonologist", "Consider follow-up imaging"]
          });

        } else if (selectedTest === "brain-tumor") {
          // Send to Django backend for brain tumor detection
          const formData = new FormData();
          formData.append("image", uploadedFile);

          const response = await axios.post(`${baseUrl}/api/ml/braintumor/`, formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data"
            }
          });

          setResult({
            prediction: response.data.prediction,
            confidence: Math.round(response.data.confidence * 100 * 100) / 100,
            details: response.data.details || "Analysis completed using brain tumor classification model",
            recommendations: response.data.recommendations || ["Consult with a neurologist", "Consider follow-up MRI"]
          });

        } else if (selectedTest === "other") {
          // Send to Django backend for brain tumor detection
          const formData = new FormData();
          formData.append("image", uploadedFile);

          const response = await axios.post(`${baseUrl}/api/ml/cloud/`, formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data"
            }
          });

          setResult({
            prediction: response.data.prediction,
            confidence: Math.round(response.data.confidence)  ,
            details: response.data.details || "Analysis completed using cloud classification model",
            recommendations: response.data.recommendations || ["Not able to diagnoise", "Consider follow-up MRI"]
          });

        } else {
          // Mock responses for other test types
          const mockResults: { [key: string]: TestResult } = {
            "skin-cancer": {
              prediction: Math.random() > 0.5 ? "Benign lesion" : "Malignant characteristics detected",
              confidence: Math.round((Math.random() * 20 + 80) * 100) / 100,
              details: "Analysis using DenseNet-121 trained on ISIC dermatology dataset",
              recommendations: ["Recommend dermatologist consultation", "Consider biopsy for confirmation"]
            }
          };

          await new Promise(resolve => setTimeout(resolve, 2000));
          setResult(mockResults[selectedTest]);
        }

        toast({
          title: "Analysis complete",
          description: "AI analysis has been completed successfully."
        });
      } catch (error: any) {
        toast({
          title: "Analysis failed",
          description: error.response?.data?.detail || "Failed to analyze image. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsAnalyzing(false);
      }
    };

  const saveToPatientRecord = () => {
    // Placeholder for saving to patient record
    toast({
      title: "Result saved",
      description: "Analysis result has been saved to patient record."
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600";
    if (confidence >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getResultIcon = (prediction: string) => {
    const isNormal = prediction.toLowerCase().includes("no") || 
                    prediction.toLowerCase().includes("benign");
    return isNormal ? CheckCircle : AlertCircle;
  };

  const getResultColor = (prediction: string) => {
    const isNormal = prediction.toLowerCase().includes("no") || 
                    prediction.toLowerCase().includes("benign");
    return isNormal ? "text-green-600" : "text-red-600";
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">AI Test Lab</h1>
          <p className="text-muted-foreground">
            Advanced AI-powered medical image analysis for diagnostic assistance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Selection and Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Select Test & Upload Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Test Type Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Test Type</label>
                <Select value={selectedTest} onValueChange={setSelectedTest}>
                  <SelectTrigger className="text-lg py-6">
                    <SelectValue placeholder="Select a test type" />
                  </SelectTrigger>
                  <SelectContent>
                    {testTypes.map((test) => (
                      <SelectItem key={test.id} value={test.id}>
                        <div className="flex items-center gap-2">
                          <test.icon size={20} />
                          {test.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Test Description */}
              {selectedTest && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {testTypes.find(t => t.id === selectedTest)?.description}
                    <br />
                    <strong>Accepted formats:</strong> {testTypes.find(t => t.id === selectedTest)?.acceptedFormats}
                  </AlertDescription>
                </Alert>
              )}

              {/* File Upload */}
              <div>
                <label className="text-sm font-medium mb-2 block">Upload Medical Image</label>
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                  <div className="space-y-3">
                    <p className="text-base text-muted-foreground">
                      Drag and drop your image here, or click to browse
                    </p>
                    <input
                      type="file"
                      accept="image/*,application/dicom"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" className="cursor-pointer text-lg py-6 px-8" asChild>
                        <span>Browse Files</span>
                      </Button>
                    </label>
                  </div>
                </div>
                
                {uploadedFile && (
                  <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-base font-medium">{uploadedFile.name}</span>
                      <span className="text-sm text-muted-foreground ml-auto">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Run Analysis Button */}
              <Button 
                onClick={runAnalysis} 
                disabled={!selectedTest || !uploadedFile || isAnalyzing}
                className="w-full text-lg py-6"
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Run AI Analysis"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Display */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
              {!result && !isAnalyzing && (
                <div className="text-center py-12">
                  <Brain className="mx-auto h-16 w-16 mb-4 opacity-50" />
                  <p className="text-lg">Upload an image and run analysis to see results</p>
                </div>
              )}

              {isAnalyzing && (
                <div className="text-center py-12">
                  <Loader className="mx-auto h-16 w-16 animate-spin text-primary mb-4" />
                  <p className="text-xl font-medium">Analyzing image...</p>
                  <p className="text-base text-muted-foreground">
                    This may take a few moments
                  </p>
                </div>
              )}

              {result && (
                <div className="space-y-8">
                  {/* Prediction */}
                  <div className="border rounded-lg p-6">
                    <div className="flex items-center gap-4 mb-3">
                      {React.createElement(getResultIcon(result.prediction), {
                        className: `h-6 w-6 ${getResultColor(result.prediction)}`
                      })}
                      <h3 className="font-semibold text-lg">Prediction</h3>
                    </div>
                    <p className={`text-xl font-medium ${getResultColor(result.prediction)}`}>
                      {result.prediction}
                    </p>
                  </div>

                  {/* Confidence Score */}
                  <div className="border rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-3">Confidence Score</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-muted rounded-full h-3">
                        <div 
                          className="bg-primary h-3 rounded-full transition-all"
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>
                      <Badge variant="outline" className={`${getConfidenceColor(result.confidence)} text-lg px-4 py-2`}>
                        {result.confidence}%
                      </Badge>
                    </div>
                  </div>

                  {/* Details */}
                  {result.details && (
                    <div className="border rounded-lg p-6">
                      <h3 className="font-semibold text-lg mb-3">Analysis Details</h3>
                      <p className="text-base text-muted-foreground">{result.details}</p>
                    </div>
                  )}

                  {/* Recommendations */}
                  {result.recommendations && (
                    <div className="border rounded-lg p-6">
                      <h3 className="font-semibold text-lg mb-3">Recommendations</h3>
                      <ul className="space-y-2">
                        {result.recommendations.map((rec, index) => (
                          <li key={index} className="text-base text-muted-foreground flex items-start gap-3">
                            <span className="text-primary text-xl">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Save to Record */}
                  <Button onClick={saveToPatientRecord} variant="outline" className="w-full text-lg py-6">
                    Save to Patient Record
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default AITestLab;