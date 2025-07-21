import React, { useState } from 'react';
import LoanEligibilityForm from '@/components/LoanEligibilityForm';
import Chatbot from '@/components/Chatbot';
import SpeechRecognition from '@/components/SpeechRecognition';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Headphones, MessageCircle, Mic, Shield, Zap } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [isListening, setIsListening] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  const handleFormSubmit = (data: any) => {
    console.log('Loan application submitted:', data);
    toast({
      title: "Application Submitted!",
      description: `Thank you ${data.firstName}! We'll review your application and get back to you within 24 hours.`,
    });
  };

  const handleVoiceResult = (text: string) => {
    console.log('Voice input received:', text);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const features = [
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Instant Eligibility Check",
      description: "Get real-time loan eligibility results as you fill out the form"
    },
    {
      icon: <Mic className="h-6 w-6 text-secondary" />,
      title: "Voice Input",
      description: "Use speech recognition to fill out your application hands-free"
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-primary" />,
      title: "AI Chatbot Assistant",
      description: "Get instant answers to your loan questions 24/7"
    },
    {
      icon: <Shield className="h-6 w-6 text-secondary" />,
      title: "Secure & Private",
      description: "Your financial information is protected with bank-level security"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">LoanEligibility Pro</h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="hidden md:flex">
                <Headphones className="h-3 w-3 mr-1" />
                Voice Enabled
              </Badge>
              <Button
                onClick={() => setShowChatbot(!showChatbot)}
                variant="outline"
                size="sm"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                {showChatbot ? 'Hide' : 'Show'} Assistant
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-gradient-primary">
                <CheckCircle className="h-3 w-3 mr-1" />
                Instant Approval Available
              </Badge>
              <h2 className="text-5xl font-bold text-foreground mb-6 leading-tight">
                Check Your Loan Eligibility in{' '}
                <span className="text-primary">Minutes</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Advanced AI-powered platform with voice recognition and intelligent chatbot assistance. 
                Get pre-approved for personal loans, auto loans, home loans, and more with our streamlined process.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                  Start Application
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Professional loan application interface" 
                className="rounded-lg shadow-elegant w-full h-auto"
              />
              <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-card p-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">AI Processing Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Platform?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center shadow-card hover:shadow-elegant transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h4 className="font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className={`grid gap-8 ${showChatbot ? 'lg:grid-cols-2' : 'lg:grid-cols-1 max-w-4xl mx-auto'}`}>
            <div>
              <LoanEligibilityForm
                onSubmit={handleFormSubmit}
                isListening={isListening}
                onToggleListening={toggleListening}
              />
            </div>
            {showChatbot && (
              <div>
                <Chatbot />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card text-card-foreground py-8 px-4 border-t">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 LoanEligibility Pro. Secure, fast, and reliable loan processing.
          </p>
        </div>
      </footer>

      {/* Speech Recognition Component */}
      <SpeechRecognition
        onResult={handleVoiceResult}
        isListening={isListening}
        setIsListening={setIsListening}
      />
    </div>
  );
};

export default Index;
