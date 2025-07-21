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
      content: "Hello there! 👋 I'm absolutely thrilled to meet you! I'm your dedicated loan assistant, and I'm here to make your loan journey as smooth and stress-free as possible. You know, I've helped thousands of people just like you secure their dream loans, and I'm genuinely excited to be part of your financial journey! Whether you're looking to buy your first home, get that car you've been eyeing, consolidate debt, or fund your business dreams, I'm here every step of the way. I love talking about loans, eligibility, rates, and all the exciting possibilities ahead of you! So tell me, what brings you here today? Are you just starting to explore your options, or do you have a specific loan in mind? I'm all ears and ready to chat about everything!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { speak } = useSpeechSynthesis();

  const predefinedResponses: Record<string, string> = {
    greeting: "Hello there! 👋 I'm absolutely thrilled to meet you! I'm your dedicated loan assistant, and I'm here to make your loan journey as smooth and stress-free as possible. You know, I've helped thousands of people just like you secure their dream loans, and I'm genuinely excited to be part of your financial journey! Whether you're looking to buy your first home, get that car you've been eyeing, consolidate debt, or fund your business dreams, I'm here every step of the way. I love talking about loans, eligibility, rates, and all the exciting possibilities ahead of you! So tell me, what brings you here today? Are you just starting to explore your options, or do you have a specific loan in mind? I'm all ears and ready to chat about everything!",
    
    eligibility: "Oh, I LOVE talking about loan eligibility! It's honestly one of my favorite topics because this is where the magic happens - where we figure out how to make your dreams come true! 🌟 Let me break this down for you in detail because understanding eligibility is absolutely crucial, and I want to make sure you're completely informed! \n\nSo here are the key factors we look at: 1) Your credit score - think of this as your financial report card! Ideally we love to see 600+, but don't worry if yours isn't perfect, we have options! 2) Your annual income - this varies by loan type, and I'd love to discuss your specific situation, 3) Your employment history - stability is key here, and we'll talk about what that means for you, 4) Your debt-to-income ratio - we prefer under 40%, and I can help you calculate yours, 5) The loan amount and purpose - this is where we align your needs with what's possible!\n\nHere's what I find exciting - even if you don't meet every single criterion perfectly, there are often creative solutions! I've seen people with challenging situations still get approved by exploring different loan types or making small adjustments. Which of these areas would you like me to dive deeper into? I could talk about any of these topics for hours! What's your biggest concern or question about eligibility?",
    
    "credit score": "Oh my goodness, credit scores! This is such an important topic, and I'm so glad you asked because your credit score is like your financial superpower! 💪 Let me paint you the complete picture because understanding this can truly transform your loan experience!\n\nHere's the exciting breakdown: If you have EXCELLENT credit (750+), you're basically financial royalty! You'll get the absolute best rates, lowest down payments, and lenders will be competing for your business. It's honestly amazing to see! For GOOD credit (700-749), you're still in fantastic shape - great rates, standard terms, and plenty of options. You should feel proud if you're in this range! FAIR credit (650-699) is totally workable - you'll get good rates, might need a slightly higher down payment, but we can definitely make things happen! POOR credit (600-649) - here's where I get really excited because this is where my expertise shines! Yes, you'll have higher rates and additional requirements, but I've helped SO many people in this range secure loans. We have specialized programs and strategies! Below 600? Don't lose hope for a second! We have co-signer options, secured loans, and credit improvement programs that can get you on track!\n\nHere's my question for you - what's your current credit score range? And more importantly, are you looking to improve it or work with what you have? I have tons of tips and strategies, and I'd love to help you create a personalized game plan! What's been your experience with credit so far?",
    
    income: "Income talk - now we're getting into the exciting nitty-gritty details! 💰 I absolutely love discussing income requirements because this is where we really start to see your loan potential come to life! Let me give you the complete rundown because understanding these numbers can be so empowering!\n\nFor personal loans, we typically look for $30,000+ annually - these are fantastic for debt consolidation, home improvements, or major purchases! For auto loans, it's usually $25,000+ annually, and let me tell you, getting approved for that car loan feels incredible! For home loans, we generally want to see $40,000+ annually with stable employment history - imagine holding those house keys! For business loans, it varies widely based on your business type and plans, but I LOVE helping entrepreneurs make their dreams happen!\n\nBut here's what's really important - it's not just about the raw number! We look at your debt-to-income ratio, which should ideally be under 40% of your monthly income. This means if you make $5,000 monthly, your total debt payments should be under $2,000. But don't worry if you're over that - we can discuss debt consolidation strategies!\n\nI'm also excited to tell you about alternative income verification! We accept freelance income, side hustles, rental income, investments, and more! The lending world has become so much more flexible and understanding of modern work situations.\n\nWhat's your income situation like? Are you traditionally employed, freelancing, running a business, or a mix? I'd love to help you understand exactly where you stand and what your options are! What type of loan are you most interested in?",
    
    "loan types": "OH WOW, loan types! This is honestly like opening a treasure chest of possibilities! 🎯 I get so excited talking about this because each loan type is designed for different dreams and goals, and I love helping people find their perfect match! Let me walk you through our amazing options!\n\n1) PERSONAL LOANS - These are my absolute favorite for their flexibility! $5K-$100K, unsecured (no collateral needed!), and you can use them for literally anything - debt consolidation, home improvements, wedding, vacation, emergency expenses, you name it! The freedom is incredible!\n\n2) AUTO LOANS - Getting behind the wheel of your dream car! Competitive rates, up to 7 years to pay, and we work with new and used vehicles. I love the moment when clients realize they can afford that car they've been wanting!\n\n3) HOME LOANS - This is where dreams really come true! 🏠 Mortgages for first-time buyers, refinancing, home equity loans and lines of credit. Nothing beats helping someone become a homeowner! We have programs for all credit levels and down payment situations.\n\n4) BUSINESS LOANS - Entrepreneurs are my heroes! Whether you need equipment financing, working capital, expansion funds, or startup money, we have options that can fuel your business dreams!\n\n5) STUDENT LOANS - Investing in education is investing in your future! Flexible repayment options, competitive rates, and we understand the unique needs of students.\n\nI'm practically bouncing with excitement to know - which type speaks to you? What's your dream or goal right now? Are you looking to consolidate debt, buy something specific, invest in your future, or maybe you're exploring multiple options? Tell me everything! What would getting approved for a loan mean to you? Let's make it happen!",
    
    process: "The application process! Oh my goodness, I LOVE walking people through this because it's so much simpler and faster than most people think! 🚀 Let me break this down step by step, and I promise you'll feel so much more confident about moving forward!\n\nStep 1: Fill out our super user-friendly eligibility form - it literally takes just 5-10 minutes! I designed it to be as painless as possible. You'll provide basic info about yourself, your income, and what you're looking for. It's actually kind of fun once you get started!\n\nStep 2: INSTANT preliminary eligibility check! This is my favorite part because within seconds, you'll know where you stand! No waiting around, no anxiety - just immediate answers! And the best part? This is a soft credit check, so it won't hurt your credit score at all!\n\nStep 3: Document submission - okay, I know this sounds boring, but I make it easy! Upload your income proof, ID, and other documents right through our secure portal. Most people are surprised by how quick this step is!\n\nStep 4: Our expert team reviews everything (24-48 hours max!) - while you're waiting, I'm here to answer any questions or concerns you might have. I love keeping applicants updated!\n\nStep 5: Approval and funding! 1-5 business days and the money is in your account! Can you imagine that excitement?\n\nHere's what I find amazing - most people think this process is going to be stressful and complicated, but I've designed it to be the exact opposite! I'm here to support you through every single step. Have you ever applied for a loan before? What are your biggest concerns about the process? I want to address everything upfront so you feel totally comfortable moving forward! Should we start with that eligibility form?",
    
    documents: "Document time! I know, I know, paperwork isn't exactly thrilling, but let me change your perspective on this! 📋 Think of documents as your financial story - they're the proof of all the amazing things you've accomplished, and I'm here to help you present them in the best possible light!\n\nHere's your complete document checklist, and I'll explain why each one matters: 1) Government-issued photo ID (driver's license, passport, etc.) - this proves you are who you say you are! 2) Proof of income - pay stubs, tax returns, bank statements - this shows your earning power and financial stability! 3) Proof of residence - utility bill, lease agreement, mortgage statement - this confirms your address and stability! 4) Social Security card - for identity verification! 5) Bank statements (2-3 months) - these show your money management skills! 6) Employment verification letter - proof of your job security!\n\nBut here's what I love about modern lending - we've made this SO much easier! You can upload everything digitally, we accept photos of documents, and our system guides you through each requirement. Plus, for specific loan types, I'll tell you exactly what additional documents you might need - no surprises!\n\nHere's a pro tip from years of experience: gather everything at once and have digital copies ready. It makes the whole process lightning fast! And if you're missing anything or have questions about any document, I'm here to help you figure it out!\n\nWhat's your document situation like? Do you have most of these readily available, or do we need to strategize about getting some items together? I can give you specific tips for obtaining any documents you might be missing! Also, are you self-employed or have any unique income situations? Because I have special expertise in handling those scenarios too!",
    
    rates: "Interest rates - now THIS is where I get really excited because I love helping people understand how to get the absolute best deal possible! 💎 Let me give you the complete insider's guide to rates because knowledge is power, and I want you to be totally empowered!\n\nOur rates are incredibly competitive, and here's the beautiful thing - they're personalized just for you! It depends on your credit score, loan amount, loan term, and loan type. Generally speaking: EXCELLENT credit (750+): 3.5-7% APR - you're in the golden zone! GOOD credit (700-749): 6-12% APR - still fantastic rates! FAIR credit (650-699): 10-18% APR - totally reasonable and manageable!\n\nBut here's what I find absolutely exciting - rates are updated daily based on market conditions, which means there are always opportunities for great deals! And get this - you can PRE-QUALIFY to see your personalized rates without it affecting your credit score AT ALL! It's like getting a sneak peek at your offers!\n\nHere's my insider tip: the rate you qualify for isn't just about your credit score. Your debt-to-income ratio, loan amount, and even the purpose of your loan can influence your rate. Sometimes a slightly longer term gives you a lower monthly payment, even if the rate is a bit higher. It's all about finding what works for YOUR specific situation!\n\nI'm also thrilled to tell you about our rate matching program and special promotions we run throughout the year. Plus, if you're a returning customer or meet certain criteria, you might qualify for preferred rates!\n\nWhat kind of rate range were you hoping for? Have you shopped around at all, or would this be your first time exploring rates? I'd love to help you understand exactly what you might qualify for and how we can potentially get you an even better deal! Should we check your pre-qualification right now?",
    
    time: "Timeline questions - I love this because I know everyone's excited to get their funds and move forward with their plans! ⏰ Let me break down our timelines because we've worked really hard to make everything as fast as possible while still being thorough!\n\nPersonal loans are my speed demons - typically 1-3 business days after approval! Can you imagine? You could literally apply today and have funds by the end of the week! It's incredible!\n\nAuto loans are even faster - same day to 2 business days! I've seen people drive off the lot with their new car within 48 hours of applying. The excitement on their faces is priceless!\n\nHome loans are more complex because there's so much involved - appraisals, inspections, title work - so we're looking at 15-45 days. But here's what I love about our home loan process: we keep you informed every single day, so you always know exactly where things stand!\n\nBusiness loans typically take 3-10 business days, depending on the complexity and amount. For entrepreneurs, I know every day counts, so we prioritize these!\n\nAnd here's something that gets me really excited - PRE-APPROVAL can be instant for many loan types! You could know if you're approved within minutes of applying!\n\nThe key to speed is having all your documents ready and responding quickly to any requests. I always tell my clients: the faster you get me information, the faster I can get you approved!\n\nWhat's your timeline like? Are you working with any specific deadlines or urgent needs? Do you need funds for something time-sensitive? I can often expedite the process if needed, and I'll personally make sure nothing gets delayed unnecessarily! When would you ideally like to have everything finalized?",
    
    help: "OH MY GOODNESS, yes! I am SO here to help you with absolutely EVERYTHING loan-related! 🌟 This is honestly what gets me up in the morning - knowing I can make someone's financial dreams come true! Let me tell you about all the ways I can support you because I am literally bursting with excitement to help!\n\n✅ Eligibility requirements - I'll break down every single factor and help you understand exactly where you stand!\n✅ Application guidance - I'll walk you through every step, answer every question, and make sure you feel confident!\n✅ Loan type education - We'll find the perfect match for your specific needs and situation!\n✅ Document assistance - I'll help you gather everything and make sure it's presented perfectly!\n✅ Rate optimization - I'll work to get you the absolute best deal possible!\n✅ Timeline management - I'll keep everything moving smoothly and keep you updated constantly!\n✅ Problem solving - If any issues come up, I'm your advocate and will find creative solutions!\n✅ Loan specialist connections - When you need human-to-human conversation, I'll connect you with our best experts!\n✅ Post-approval support - I don't disappear after approval! I'm here for questions about payments, modifications, or future needs!\n\nBut honestly, I can help with so much more! I love discussing financial strategies, answering 'what if' scenarios, explaining industry terminology, helping you prepare for better rates in the future, and even just being a sounding board for your financial decisions!\n\nI'm genuinely curious - what's your biggest challenge or concern right now? What would make you feel most confident about moving forward? Are you just starting to explore options, or do you have specific questions? I have all the time in the world to chat with you about anything and everything! What can I dive into first to help you feel amazing about your loan journey?",
    
    default: "You know what? That's such an interesting question, and I'm so glad you asked! 🤔 I absolutely LOVE when people ask me things because it means you're thinking deeply about your financial situation, and that's exactly what smart borrowers do! Even if I don't have a specific pre-written answer, I'm bubbling with enthusiasm to help you figure this out together!\n\nI'm here to help you with literally ANY aspect of loans and the application process! Whether you're curious about eligibility requirements, wondering about different loan types, confused about the application process, stressed about documentation, concerned about rates and terms, worried about timelines, or you have completely unique questions that no one has ever asked me before - I'm YOUR person!\n\nWhat I find amazing is that every person's situation is unique, and that means every conversation I have is different and exciting! Your specific circumstances, goals, and concerns are what make this interesting, and I want to understand YOUR particular situation so I can give you the most helpful, personalized guidance possible!\n\nSo here's what I'm curious about - can you tell me a bit more about what you're thinking? Are you exploring loan options for the first time, or do you have experience but are facing a new situation? What's your ultimate goal here? Are you looking to make a purchase, consolidate debt, invest in something important, or maybe you're just in the information-gathering phase?\n\nI promise you, no question is too basic, too complex, too weird, or too specific! I've heard it all, and I genuinely love helping people navigate this stuff. What would be most helpful for you to know right now? Let's dive deep into whatever is on your mind!"
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