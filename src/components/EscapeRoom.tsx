import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Search, 
  Eye, 
  Lock, 
  BookOpen, 
  Sofa, 
  DoorOpen,
  AlertTriangle,
  CheckCircle2,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import backgroundImage from '@/assets/escape-room-bg.jpg';

interface GameState {
  timeLeft: number;
  puzzlesSolved: {
    bookshelf: boolean;
    safe: boolean;
    couch: boolean;
    window: boolean;
    helix: boolean;
    vault: boolean;
  };
  inventory: {
    magnifyingGlass: boolean;
    safeCode: string;
    helixAnswer: string;
  };
  gamePhase: 'playing' | 'success' | 'failed';
  hintsUsed: number;
}

interface InteractiveObject {
  id: string;
  name: string;
  icon: React.ReactNode;
  position: { x: number; y: number };
  isAvailable: boolean;
  isCompleted: boolean;
}

const EscapeRoom: React.FC = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    timeLeft: 900, // 15 minutes
    puzzlesSolved: {
      bookshelf: false,
      safe: false,
      couch: false,
      window: false,
      helix: false,
      vault: false,
    },
    inventory: {
      magnifyingGlass: false,
      safeCode: '',
      helixAnswer: '',
    },
    gamePhase: 'playing',
    hintsUsed: 0,
  });

  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [alarmTriggered, setAlarmTriggered] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (gameState.gamePhase !== 'playing') return;
    
    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          return { ...prev, timeLeft: 0, gamePhase: 'failed' };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.gamePhase]);

  // Check win condition
  useEffect(() => {
    const allPuzzlesSolved = Object.values(gameState.puzzlesSolved).every(solved => solved);
    if (allPuzzlesSolved && gameState.gamePhase === 'playing') {
      setGameState(prev => ({ ...prev, gamePhase: 'success' }));
      toast({
        title: "Heist Success!",
        description: "You have escaped the bank with the loot. The Resistance is proud!",
      });
    }
  }, [gameState.puzzlesSolved, gameState.gamePhase, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const interactiveObjects: InteractiveObject[] = [
    {
      id: 'bookshelf',
      name: 'Bookshelf',
      icon: <BookOpen className="w-6 h-6" />,
      position: { x: 15, y: 35 },
      isAvailable: true,
      isCompleted: gameState.puzzlesSolved.bookshelf,
    },
    {
      id: 'couch',
      name: 'Couch',
      icon: <Sofa className="w-6 h-6" />,
      position: { x: 45, y: 65 },
      isAvailable: true,
      isCompleted: gameState.puzzlesSolved.couch,
    },
    {
      id: 'safe',
      name: 'Safe',
      icon: <Lock className="w-6 h-6" />,
      position: { x: 75, y: 40 },
      isAvailable: gameState.inventory.magnifyingGlass,
      isCompleted: gameState.puzzlesSolved.safe,
    },
    {
      id: 'window',
      name: 'Window',
      icon: <Eye className="w-6 h-6" />,
      position: { x: 25, y: 20 },
      isAvailable: true,
      isCompleted: gameState.puzzlesSolved.window,
    },
    {
      id: 'helix',
      name: 'Helix Terminal',
      icon: <Shield className="w-6 h-6" />,
      position: { x: 60, y: 25 },
      isAvailable: gameState.puzzlesSolved.safe,
      isCompleted: gameState.puzzlesSolved.helix,
    },
    {
      id: 'vault',
      name: 'Main Vault',
      icon: <DoorOpen className="w-6 h-6" />,
      position: { x: 85, y: 50 },
      isAvailable: gameState.puzzlesSolved.helix,
      isCompleted: gameState.puzzlesSolved.vault,
    },
  ];

  const handleObjectClick = (objectId: string) => {
    if (gameState.gamePhase !== 'playing') return;
    
    const object = interactiveObjects.find(obj => obj.id === objectId);
    if (!object || !object.isAvailable || object.isCompleted) return;

    setSelectedObject(objectId);
    setShowModal(true);
  };

  const solvePuzzle = (puzzleId: string, data?: any) => {
    setGameState(prev => ({
      ...prev,
      puzzlesSolved: {
        ...prev.puzzlesSolved,
        [puzzleId]: true,
      },
      ...(data && { inventory: { ...prev.inventory, ...data } }),
    }));
    setShowModal(false);
    setSelectedObject(null);
  };

  const renderPuzzleModal = () => {
    if (!selectedObject) return null;

    switch (selectedObject) {
      case 'bookshelf':
        return (
          <PuzzleModal
            title="Mysterious Bookshelf"
            onClose={() => setShowModal(false)}
          >
            <div className="space-y-4">
              <p className="text-foreground">You find several old books. One seems different...</p>
              <div className="grid grid-cols-3 gap-2">
                {['History', 'Art', 'CODE', 'Philosophy', 'Science', 'Literature'].map((book, idx) => (
                  <Button
                    key={book}
                    variant={book === 'CODE' ? 'default' : 'outline'}
                    className="h-20 text-xs"
                    onClick={() => book === 'CODE' && solvePuzzle('bookshelf', { safeCode: '1985' })}
                  >
                    {book}
                  </Button>
                ))}
              </div>
              {gameState.inventory.safeCode && (
                <p className="text-heist-gold text-sm">You found the code: 1985!</p>
              )}
            </div>
          </PuzzleModal>
        );

      case 'couch':
        return (
          <PuzzleModal
            title="Elegant Couch"
            onClose={() => setShowModal(false)}
          >
            <div className="space-y-4">
              <p className="text-foreground">You check the couch cushions...</p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="secondary"
                  className="w-full h-24"
                  onClick={() => solvePuzzle('couch', { magnifyingGlass: true })}
                >
                  <Search className="w-8 h-8 mr-2" />
                  Lift Cushion
                </Button>
              </motion.div>
              <p className="text-heist-gold text-sm">Magnifying glass found! Now you can examine the safe.</p>
            </div>
          </PuzzleModal>
        );

      case 'safe':
        return (
          <SafePuzzle 
            onSolve={() => solvePuzzle('safe')} 
            onClose={() => setShowModal(false)}
            expectedCode={gameState.inventory.safeCode}
          />
        );

      case 'window':
        return (
          <PuzzleModal
            title="Security Window"
            onClose={() => setShowModal(false)}
          >
            <div className="space-y-4">
              <p className="text-foreground">You look outside. There are police patrolling...</p>
              <Button
                variant="destructive"
                onClick={() => {
                  setAlarmTriggered(true);
                  solvePuzzle('window');
                  toast({
                    title: "Alarm Activated!",
                    description: "The police have seen movement. Hurry up!",
                    variant: "destructive",
                  });
                  // Reduce time
                  setGameState(prev => ({ ...prev, timeLeft: Math.max(0, prev.timeLeft - 120) }));
                }}
                className="w-full"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Watch Police
              </Button>
            </div>
          </PuzzleModal>
        );

      case 'helix':
        return (
          <HelixPuzzle 
            onSolve={() => solvePuzzle('helix')} 
            onClose={() => setShowModal(false)}
          />
        );

      case 'vault':
        return (
          <PuzzleModal
            title="Main Vault"
            onClose={() => setShowModal(false)}
          >
            <div className="space-y-4 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle2 className="w-16 h-16 text-heist-gold mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-heist-gold">Vault Opened!</h3>
                <p className="text-foreground">You have accessed the bank's treasure.</p>
              </motion.div>
              <Button
                variant="gold"
                onClick={() => solvePuzzle('vault')}
                className="w-full"
              >
                Take the Loot
              </Button>
            </div>
          </PuzzleModal>
        );

      default:
        return null;
    }
  };

  if (gameState.gamePhase === 'success') {
    return <SuccessScreen timeElapsed={900 - gameState.timeLeft} hintsUsed={gameState.hintsUsed} />;
  }

  if (gameState.gamePhase === 'failed') {
    return <FailureScreen />;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Room */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Alarm Effect */}
      {alarmTriggered && (
        <motion.div
          className="absolute inset-0 bg-heist-red/20 animate-alarm-flash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* UI Overlay */}
      <div className="relative z-10 h-screen">
        {/* Top HUD */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              {formatTime(gameState.timeLeft)}
            </Badge>
            {alarmTriggered && (
              <Badge variant="destructive" className="animate-heist-pulse">
                <AlertTriangle className="w-4 h-4 mr-1" />
                ALARM
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {Object.entries(gameState.puzzlesSolved).map(([key, solved]) => (
              <div
                key={key}
                className={`w-3 h-3 rounded-full ${
                  solved ? 'bg-heist-gold' : 'bg-muted'
                } transition-colors`}
              />
            ))}
          </div>
        </div>

        {/* Interactive Objects */}
        <div className="absolute inset-0">
          {interactiveObjects.map((object) => (
            <motion.button
              key={object.id}
              className={`absolute w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all
                ${object.isAvailable 
                  ? object.isCompleted
                    ? 'bg-heist-gold/20 border-heist-gold text-heist-gold'
                    : 'bg-primary/20 border-primary text-primary hover:bg-primary/30 hover:scale-110'
                  : 'bg-muted/20 border-muted text-muted cursor-not-allowed'
                }`}
              style={{
                left: `${object.position.x}%`,
                top: `${object.position.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => handleObjectClick(object.id)}
              whileHover={object.isAvailable ? { scale: 1.1 } : {}}
              whileTap={object.isAvailable ? { scale: 0.95 } : {}}
            >
              {object.icon}
            </motion.button>
          ))}
        </div>

        {/* Inventory */}
        <div className="absolute bottom-4 left-4 flex space-x-2">
          {gameState.inventory.magnifyingGlass && (
            <Badge variant="outline" className="bg-card/80">
              <Search className="w-4 h-4 mr-1" />
              Magnifying Glass
            </Badge>
          )}
          {gameState.inventory.safeCode && (
            <Badge variant="outline" className="bg-card/80">
              <Lock className="w-4 h-4 mr-1" />
              Code: {gameState.inventory.safeCode}
            </Badge>
          )}
        </div>
      </div>

      {/* Puzzle Modals */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderPuzzleModal()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Puzzle Components
const PuzzleModal: React.FC<{
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}> = ({ title, children, onClose }) => (
  <motion.div
    className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4 shadow-dramatic"
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.8, opacity: 0 }}
  >
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-bold text-card-foreground">{title}</h3>
      <Button variant="ghost" size="sm" onClick={onClose}>
        ✕
      </Button>
    </div>
    {children}
  </motion.div>
);

const SafePuzzle: React.FC<{
  onSolve: () => void;
  onClose: () => void;
  expectedCode: string;
}> = ({ onSolve, onClose, expectedCode }) => {
  const [code, setCode] = useState(['', '', '', '']);
  
  const handleDigitChange = (index: number, digit: string) => {
    if (!/^\d$/.test(digit) && digit !== '') return;
    
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    
    if (newCode.join('') === expectedCode) {
      setTimeout(onSolve, 500);
    }
  };

  return (
    <PuzzleModal title="Safe" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-foreground">Use the magnifying glass to reveal the hidden code...</p>
        <div className="flex justify-center space-x-2">
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(index, e.target.value)}
              className="w-12 h-12 text-center text-2xl font-bold bg-input border border-border rounded-md"
            />
          ))}
        </div>
        {expectedCode && (
          <p className="text-xs text-muted-foreground text-center">
            Hint: The year of a famous movie about the future
          </p>
        )}
      </div>
    </PuzzleModal>
  );
};

const HelixPuzzle: React.FC<{
  onSolve: () => void;
  onClose: () => void;
}> = ({ onSolve, onClose }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  
  const questions = [
    {
      question: "What is the protocol for an emergency situation?",
      options: [
        "Activate alarm immediately",
        "Follow standard evacuation protocol",
        "Release sleeping gases",
        "Ignore and continue operation"
      ],
      correct: "Release sleeping gases"
    }
  ];

  return (
    <PuzzleModal title="Helix AI Terminal" onClose={onClose}>
      <div className="space-y-4">
        <div className="text-center">
          <Shield className="w-12 h-12 text-heist-vault mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Security AI System</p>
        </div>
        
        <div className="space-y-3">
          <p className="font-medium text-foreground">{questions[0].question}</p>
          {questions[0].options.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === option ? "default" : "outline"}
              className="w-full text-left justify-start"
              onClick={() => setSelectedAnswer(option)}
            >
              {option}
            </Button>
          ))}
        </div>
        
        {selectedAnswer === questions[0].correct && (
          <Button onClick={onSolve} variant="vault" className="w-full">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Access Granted
          </Button>
        )}
      </div>
    </PuzzleModal>
  );
};

// End Game Screens
const SuccessScreen: React.FC<{ timeElapsed: number; hintsUsed: number }> = ({ 
  timeElapsed, 
  hintsUsed 
}) => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <motion.div
      className="text-center space-y-6 max-w-2xl mx-auto p-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="text-6xl mb-4"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🎭
      </motion.div>
      
      <h1 className="text-4xl font-bold text-heist-gold">
        HEIST SUCCESS!
      </h1>
      
      <p className="text-xl text-foreground">
        You have completed the perfect heist. The Resistance is proud.
      </p>
      
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <Card className="p-4 text-center">
          <h3 className="font-bold text-heist-gold">Time</h3>
          <p className="text-2xl">{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="font-bold text-heist-gold">Hints</h3>
          <p className="text-2xl">{hintsUsed}</p>
        </Card>
      </div>
      
      <Button 
        onClick={() => window.location.reload()} 
        variant="gold"
        className="text-lg px-8 py-3"
      >
        New Heist
      </Button>
    </motion.div>
  </div>
);

const FailureScreen: React.FC = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <motion.div
      className="text-center space-y-6 max-w-2xl mx-auto p-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-6xl mb-4">🚨</div>
      
      <h1 className="text-4xl font-bold text-heist-red">
        CAPTURED!
      </h1>
      
      <p className="text-xl text-foreground">
        Time is up. The police have found you.
      </p>
      
      <Button 
        onClick={() => window.location.reload()} 
        variant="destructive"
        className="text-lg px-8 py-3"
      >
        Try Again
      </Button>
    </motion.div>
  </div>
);

export default EscapeRoom;