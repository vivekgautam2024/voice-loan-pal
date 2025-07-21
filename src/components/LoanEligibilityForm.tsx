import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Upload, FileText } from 'lucide-react';
import { useSpeechSynthesis } from 'react-speech-kit';
import { toast } from '@/hooks/use-toast';

interface LoanData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  income: string;
  creditScore: string;
  loanAmount: string;
  loanPurpose: string;
  employmentStatus: string;
  aadharNumber: string;
  panNumber: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  aadharFile: File | null;
  panFile: File | null;
  salarySlips: File[];
  bankStatement: File | null;
}

interface LoanEligibilityFormProps {
  onSubmit: (data: LoanData) => void;
  isListening: boolean;
  onToggleListening: () => void;
}

const LoanEligibilityForm: React.FC<LoanEligibilityFormProps> = ({
  onSubmit,
  isListening,
  onToggleListening,
}) => {
  const [formData, setFormData] = useState<LoanData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    income: '',
    creditScore: '',
    loanAmount: '',
    loanPurpose: '',
    employmentStatus: '',
    aadharNumber: '',
    panNumber: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    aadharFile: null,
    panFile: null,
    salarySlips: [],
    bankStatement: null,
  });

  const { speak } = useSpeechSynthesis();

  const handleInputChange = (field: keyof LoanData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: keyof LoanData, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleMultipleFileChange = (field: keyof LoanData, files: FileList | null) => {
    if (files && field === 'salarySlips') {
      const fileArray = Array.from(files).slice(0, 3); // Limit to 3 files
      setFormData(prev => ({ ...prev, [field]: fileArray }));
    }
  };

  const FileUploadField = ({ 
    label, 
    field, 
    accept, 
    multiple = false,
    description 
  }: { 
    label: string; 
    field: keyof LoanData; 
    accept: string; 
    multiple?: boolean;
    description: string;
  }) => (
    <div className="space-y-2">
      <Label htmlFor={field}>{label}</Label>
      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
        <input
          type="file"
          id={field}
          accept={accept}
          multiple={multiple}
          onChange={(e) => {
            if (multiple) {
              handleMultipleFileChange(field, e.target.files);
            } else {
              handleFileChange(field, e.target.files?.[0] || null);
            }
          }}
          className="hidden"
        />
        <label htmlFor={field} className="cursor-pointer flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <span className="text-sm font-medium">Choose files to upload</span>
          <span className="text-xs text-muted-foreground">{description}</span>
        </label>
        {/* Show selected files */}
        {field === 'salarySlips' && formData.salarySlips.length > 0 && (
          <div className="mt-2 space-y-1">
            {formData.salarySlips.map((file, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4" />
                {file.name}
              </div>
            ))}
          </div>
        )}
        {field !== 'salarySlips' && formData[field] && (
          <div className="mt-2 flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4" />
            {(formData[field] as File)?.name}
          </div>
        )}
      </div>
    </div>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required documents
    if (!formData.aadharFile || !formData.panFile || !formData.bankStatement || formData.salarySlips.length === 0) {
      toast({
        title: "Missing Documents",
        description: "Please upload all required documents to proceed.",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(formData);
    speak({ text: 'Processing your loan application. Please wait for the results.' });
  };

  const calculateEligibility = () => {
    const income = parseInt(formData.income) || 0;
    const creditScore = parseInt(formData.creditScore) || 0;
    const loanAmount = parseInt(formData.loanAmount) || 0;

    const debtToIncomeRatio = (loanAmount * 12 * 0.05) / income; // Assuming 5% monthly payment
    
    if (creditScore >= 700 && income >= 50000 && debtToIncomeRatio < 0.4) {
      return { eligible: true, score: 'Excellent', color: 'text-secondary' };
    } else if (creditScore >= 650 && income >= 40000 && debtToIncomeRatio < 0.5) {
      return { eligible: true, score: 'Good', color: 'text-primary' };
    } else if (creditScore >= 600 && income >= 30000 && debtToIncomeRatio < 0.6) {
      return { eligible: true, score: 'Fair', color: 'text-yellow-600' };
    } else {
      return { eligible: false, score: 'Needs Improvement', color: 'text-destructive' };
    }
  };

  const isFormValid = formData.firstName && formData.lastName && formData.email && 
    formData.phone && formData.income && formData.creditScore && formData.loanAmount && 
    formData.loanPurpose && formData.employmentStatus && formData.aadharNumber && 
    formData.panNumber && formData.address && formData.city && formData.state && formData.pinCode;
  const eligibilityResult = isFormValid ? calculateEligibility() : null;

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Loan Eligibility Application
          <Button
            variant={isListening ? "secondary" : "outline"}
            size="sm"
            onClick={onToggleListening}
            className="ml-2"
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        </CardTitle>
        <CardDescription>
          Fill out the form below or use voice input to check your loan eligibility
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Enter your first name"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="income">Annual Income ($)</Label>
              <Input
                id="income"
                type="number"
                value={formData.income}
                onChange={(e) => handleInputChange('income', e.target.value)}
                placeholder="e.g. 75000"
                required
              />
            </div>
            <div>
              <Label htmlFor="creditScore">Credit Score</Label>
              <Input
                id="creditScore"
                type="number"
                value={formData.creditScore}
                onChange={(e) => handleInputChange('creditScore', e.target.value)}
                placeholder="e.g. 720"
                min="300"
                max="850"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="loanAmount">Requested Loan Amount ($)</Label>
              <Input
                id="loanAmount"
                type="number"
                value={formData.loanAmount}
                onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                placeholder="e.g. 50000"
                required
              />
            </div>
            <div>
              <Label htmlFor="employmentStatus">Employment Status</Label>
              <Select onValueChange={(value) => handleInputChange('employmentStatus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time Employment</SelectItem>
                  <SelectItem value="part-time">Part-time Employment</SelectItem>
                  <SelectItem value="self-employed">Self-employed</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="loanPurpose">Loan Purpose</Label>
            <Select onValueChange={(value) => handleInputChange('loanPurpose', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select loan purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">Home Purchase</SelectItem>
                <SelectItem value="car">Auto Loan</SelectItem>
                <SelectItem value="business">Business Loan</SelectItem>
                <SelectItem value="personal">Personal Loan</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="debt-consolidation">Debt Consolidation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Identity Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Identity Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="aadharNumber">Aadhar Number</Label>
                <Input
                  id="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
                  placeholder="1234 5678 9012"
                  maxLength={12}
                  required
                />
              </div>
              <div>
                <Label htmlFor="panNumber">PAN Number</Label>
                <Input
                  id="panNumber"
                  value={formData.panNumber}
                  onChange={(e) => handleInputChange('panNumber', e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  required
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Address Information</h3>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter your complete address"
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Enter city"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="Enter state"
                  required
                />
              </div>
              <div>
                <Label htmlFor="pinCode">Pin Code</Label>
                <Input
                  id="pinCode"
                  value={formData.pinCode}
                  onChange={(e) => handleInputChange('pinCode', e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  required
                />
              </div>
            </div>
          </div>

          {/* Document Upload Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Document Upload</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUploadField
                label="Aadhar Card"
                field="aadharFile"
                accept=".pdf,.jpg,.jpeg,.png"
                description="Upload Aadhar card (PDF/Image)"
              />
              <FileUploadField
                label="PAN Card"
                field="panFile"
                accept=".pdf,.jpg,.jpeg,.png"
                description="Upload PAN card (PDF/Image)"
              />
              <FileUploadField
                label="3 Month Salary Slips"
                field="salarySlips"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple={true}
                description="Upload 3 recent salary slips (Max 3 files)"
              />
              <FileUploadField
                label="6 Month Bank Statement"
                field="bankStatement"
                accept=".pdf"
                description="Upload 6 month bank statement (PDF only)"
              />
            </div>
          </div>

          {eligibilityResult && (
            <Card className="bg-accent/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">
                    Eligibility Status: {' '}
                    <span className={eligibilityResult.color}>
                      {eligibilityResult.eligible ? '✓ Approved' : '✗ Needs Review'}
                    </span>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Credit Rating: <span className={eligibilityResult.color}>{eligibilityResult.score}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90" size="lg">
            Submit Application
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoanEligibilityForm;