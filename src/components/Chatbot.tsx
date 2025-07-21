import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User } from 'lucide-react';
import { useSpeechSynthesis } from 'react-speech-kit';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I'm your loan eligibility assistant. I'm here to help you understand the loan application process, answer questions about eligibility requirements, and guide you through each step. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { speak } = useSpeechSynthesis();

  const predefinedResponses: Record<string, string> = {
    greeting: "Hello! I'm excited to help you with your loan application. I can explain eligibility requirements, help you understand different loan types, or guide you through the application process.",
    
    eligibility: "Great question! For loan eligibility, we typically consider: 1) Your credit score (ideally 600+), 2) Annual income (varies by loan type), 3) Employment status and history, 4) Debt-to-income ratio (preferably under 40%), and 5) The loan amount and purpose. Would you like me to explain any of these factors in detail?",
    
    "credit score": "Your credit score is crucial! Here's what we look for: Excellent (750+): Best rates and terms available. Good (700-749): Great rates with standard terms. Fair (650-699): Good rates, may need higher down payment. Poor (600-649): Higher rates, additional requirements. Below 600: May need a co-signer or secured loan. What's your current credit score range?",
    
    income: "Income requirements vary by loan type! For personal loans: typically $30,000+ annually. For auto loans: $25,000+ annually. For home loans: $40,000+ annually with stable employment history. We also consider your debt-to-income ratio - your total monthly debt payments should be less than 40% of your monthly income.",
    
    "loan types": "We offer several loan types: 1) Personal Loans: Unsecured, flexible use, $5K-$100K. 2) Auto Loans: Vehicle purchases, competitive rates, up to 7 years. 3) Home Loans: Mortgages and home equity, various terms. 4) Business Loans: For entrepreneurs, equipment, or expansion. 5) Student Loans: Education financing with flexible repayment. Which type interests you most?",
    
    process: "The loan application process is simple: 1) Fill out our eligibility form (takes 5-10 minutes), 2) We instantly check your preliminary eligibility, 3) Submit required documents (income proof, ID, etc.), 4) Our team reviews your application (24-48 hours), 5) Get approved and receive funds (1-5 business days). I can help you with each step!",
    
    documents: "You'll typically need: 1) Government-issued photo ID, 2) Proof of income (pay stubs, tax returns, bank statements), 3) Proof of residence (utility bill, lease agreement), 4) Social Security card, 5) Bank statements (2-3 months), 6) Employment verification letter. For specific loan types, additional documents may be required.",
    
    rates: "Our rates are competitive and depend on several factors: Your credit score, loan amount, loan term, and loan type. Generally: Excellent credit: 3.5-7% APR, Good credit: 6-12% APR, Fair credit: 10-18% APR. Rates are updated daily based on market conditions. Pre-qualify to see your personalized rates without affecting your credit score!",
    
    time: "Timeline varies by loan type: Personal loans: 1-3 business days after approval. Auto loans: Same day to 2 business days. Home loans: 15-45 days (more complex due to appraisals, inspections). Business loans: 3-10 business days. Pre-approval can be instant for many loan types!",
    
    help: "I'm here to help with everything loan-related! I can: ✅ Explain eligibility requirements, ✅ Guide you through the application, ✅ Answer questions about loan types, ✅ Help with documentation, ✅ Explain rates and terms, ✅ Provide application status updates, ✅ Connect you with a loan specialist. What specific help do you need?",
    
    default: "That's a great question! I'm here to help you with all aspects of loan applications. I can provide detailed information about eligibility requirements, different loan types, the application process, required documents, interest rates, and timelines. I can also help you understand your options based on your specific situation. What would you like to know more about?"
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return predefinedResponses.greeting;
    }
    if (message.includes('eligib') || message.includes('qualify')) {
      return predefinedResponses.eligibility;
    }
    if (message.includes('credit score') || message.includes('credit')) {
      return predefinedResponses['credit score'];
    }
    if (message.includes('income') || message.includes('salary')) {
      return predefinedResponses.income;
    }
    if (message.includes('loan type') || message.includes('types of loan')) {
      return predefinedResponses['loan types'];
    }
    if (message.includes('process') || message.includes('how to apply') || message.includes('application')) {
      return predefinedResponses.process;
    }
    if (message.includes('document') || message.includes('paper') || message.includes('requirement')) {
      return predefinedResponses.documents;
    }
    if (message.includes('rate') || message.includes('interest') || message.includes('apr')) {
      return predefinedResponses.rates;
    }
    if (message.includes('time') || message.includes('how long') || message.includes('duration')) {
      return predefinedResponses.time;
    }
    if (message.includes('help') || message.includes('assist') || message.includes('support')) {
      return predefinedResponses.help;
    }
    
    return predefinedResponses.default;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue);
      const botMessage: Message = {
        id: Date.now() + 1,
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      
      // Speak the bot response
      speak({ text: botResponse, rate: 0.9 });
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card className="h-[600px] flex flex-col shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          Loan Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex items-start gap-2 max-w-[85%] ${
                    message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}>
                      {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about loans, eligibility, or application process..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chatbot;