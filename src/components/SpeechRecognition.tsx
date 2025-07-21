import React, { useState, useEffect } from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';
import { toast } from '@/hooks/use-toast';

interface SpeechRecognitionProps {
  onResult: (text: string) => void;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const SpeechRecognition: React.FC<SpeechRecognitionProps> = ({
  onResult,
  isListening,
  setIsListening,
}) => {
  const [recognition, setRecognition] = useState<any>(null);
  const [transcript, setTranscript] = useState('');
  const { speak } = useSpeechSynthesis();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        console.log('Speech recognition started');
        speak({ text: 'Voice input activated. Please speak now.' });
        toast({
          title: "Voice input activated",
          description: "Speak now to fill out the form",
        });
      };

      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
        
        if (finalTranscript) {
          processVoiceInput(finalTranscript);
          onResult(finalTranscript);
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice input error",
          description: `Error: ${event.error}. Please try again.`,
          variant: "destructive",
        });
      };

      recognitionInstance.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        toast({
          title: "Voice input ended",
          description: "Click the microphone to start again",
        });
      };

      setRecognition(recognitionInstance);
    } else {
      console.warn('Speech recognition not supported');
      toast({
        title: "Speech recognition not supported",
        description: "Please use manual input instead",
        variant: "destructive",
      });
    }
  }, []); // Removed dependencies to prevent infinite loop

  const processVoiceInput = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Process the voice input and extract relevant information
    // This is a simplified example - you can extend this logic
    console.log('Processing voice input:', text);
    
    speak({ 
      text: 'I heard you say: ' + text + '. Processing this information for your loan application.',
      rate: 0.9 
    });
  };

  useEffect(() => {
    if (recognition) {
      if (isListening) {
        recognition.start();
      } else {
        recognition.stop();
      }
    }
  }, [isListening, recognition]);

  return null; // This component doesn't render anything visible
};

export default SpeechRecognition;