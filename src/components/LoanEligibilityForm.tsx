import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechSynthesis } from 'react-speech-kit';

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
  });

  const { speak } = useSpeechSynthesis();

  const handleInputChange = (field: keyof LoanData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

  const isFormValid = Object.values(formData).every(value => value.trim() !== '');
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