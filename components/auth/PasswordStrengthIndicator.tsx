// components/auth/PasswordStrengthIndicator.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { CheckCircle, Copy } from 'lucide-react-native';
import { MotiView } from 'moti';
import React, { useCallback, useEffect, useState } from 'react';
import { AccessibilityInfo, ActivityIndicator, Clipboard, Keyboard, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import zxcvbn from 'zxcvbn';

// Common password dictionary (add more common passwords as needed)
const COMMON_PASSWORDS = [
  'password', 'password123', 'admin', 'admin123', '123456', 'qwerty',
  'letmein', 'welcome', 'monkey', 'dragon', 'baseball', 'football',
  'superman', 'batman', 'trustno1', 'master', 'hello', 'freedom',
  'whatever', 'qazwsx', '123123', 'killer', 'soccer', '696969',
];

interface Props {
  password: string;
  onStrengthChange?: (score: number) => void;
}

interface StrengthCheck {
  regex: RegExp;
  label: string;
  description: string;
  weight: number; // Weight factor for scoring
}

interface PasswordSuggestion {
  suggestion: string;
  reason: string;
}

interface EntropyScore {
  entropy: number;
  bonus: number;
}

interface PasswordFeedback {
  warning?: string;
  suggestions: string[];
}

interface EntropyDetails {
  base: number;
  length: number;
  variety: number;
  uniqueness: number;
  pattern: number;
  dictionary: number;
}

// Common password patterns to check against
const commonPatterns = [
  '123', '456', '789', '987', '654', '321', // Sequential numbers
  'qwe', 'asd', 'zxc', // Keyboard patterns
  'abc', 'def', 'ghi', // Sequential letters
  'pass', 'word', 'admin', // Common words
];

const strengthChecks: StrengthCheck[] = [
  { 
    regex: /.{8,}/, 
    label: '8+ Characters',
    description: 'At least 8 characters long',
    weight: 1
  },
  { 
    regex: /[A-Z]/, 
    label: 'Uppercase',
    description: 'Contains uppercase letter',
    weight: 1
  },
  { 
    regex: /[a-z]/, 
    label: 'Lowercase',
    description: 'Contains lowercase letter',
    weight: 1
  },
  { 
    regex: /[0-9]/, 
    label: 'Number',
    description: 'Contains number',
    weight: 1
  },
  { 
    regex: /[^A-Za-z0-9]/, 
    label: 'Special',
    description: 'Contains special character',
    weight: 2
  },
  { 
    regex: /^(?!.*(.)\1{2,}).{8,}$/, 
    label: 'No Repeats',
    description: 'No repeating characters',
    weight: 2
  },
  {
    regex: new RegExp(`^(?!.*(${commonPatterns.join('|')})).*$`),
    label: 'Unique Pattern',
    description: 'Avoid common patterns',
    weight: 2
  },
];

const getStrengthColor = (score: number): string => {
  if (score <= 3) return '#ef4444'; // red
  if (score <= 6) return '#f59e0b'; // yellow
  return '#10b981'; // green
};

const getHapticFeedback = async (oldScore: number, newScore: number) => {
  if (newScore > oldScore) {
    if (newScore <= 3) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (newScore <= 6) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }
};

const generatePasswordSuggestion = (password: string, checks: StrengthCheck[]): PasswordSuggestion | null => {
  const failingChecks = checks.filter(check => !check.regex.test(password));
  if (failingChecks.length === 0) return null;

  const randomCheck = failingChecks[Math.floor(Math.random() * failingChecks.length)];
  
  switch (randomCheck.label) {
    case '8+ Characters':
      return {
        suggestion: password + Math.random().toString(36).slice(-4),
        reason: 'Added random characters to meet length requirement'
      };
    case 'Uppercase':
      return {
        suggestion: password.charAt(0).toUpperCase() + password.slice(1),
        reason: 'Capitalized first letter'
      };
    case 'Number':
      return {
        suggestion: password + Math.floor(Math.random() * 100),
        reason: 'Added random number'
      };
    case 'Special':
      const specials = ['!', '@', '#', '$', '%', '&'];
      return {
        suggestion: password + specials[Math.floor(Math.random() * specials.length)],
        reason: 'Added special character'
      };
    default:
      return null;
  }
}

const calculateEntropy = (password: string): EntropyScore => {
  if (!password) return { entropy: 0, bonus: 0 };

  let charsetSize = 0;
  let bonus = 0;

  // Character set calculations
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^A-Za-z0-9]/.test(password)) charsetSize += 32;

  // Base entropy calculation
  const entropy = Math.log2(Math.pow(charsetSize, password.length));

  // Bonus points for good practices
  if (password.length >= 12) bonus += 10;
  if (/[^A-Za-z0-9]/.test(password)) bonus += 5;
  if (!/(.)\1{2,}/.test(password)) bonus += 5; // No repeating characters
  if (!/123|abc|qwe/i.test(password)) bonus += 5; // No common sequences

  return { entropy, bonus };
}

const isPasswordCompromised = async (password: string): Promise<boolean> => {
  try {
    // Check local cache first
    const cachedResult = await AsyncStorage.getItem(`pwd_check_${password}`);
    if (cachedResult) return JSON.parse(cachedResult);

    // Check against common passwords
    if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
      await AsyncStorage.setItem(`pwd_check_${password}`, 'true');
      return true;
    }

    // Store result in cache
    await AsyncStorage.setItem(`pwd_check_${password}`, 'false');
    return false;
  } catch (error) {
    console.error('Error checking password:', error);
    return false;
  }
};

const calculateDetailedEntropy = (password: string): EntropyDetails => {
  if (!password) {
    return {
      base: 0,
      length: 0,
      variety: 0,
      uniqueness: 0,
      pattern: 0,
      dictionary: 0
    };
  }

  // Base entropy (character set size)
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^A-Za-z0-9]/.test(password)) charsetSize += 32;
  const baseEntropy = Math.log2(Math.pow(charsetSize, password.length));

  // Length bonus
  const lengthEntropy = password.length >= 12 ? 10 : password.length >= 8 ? 5 : 0;

  // Character variety bonus
  const varietyEntropy = 
    (/[a-z]/.test(password) ? 5 : 0) +
    (/[A-Z]/.test(password) ? 5 : 0) +
    (/[0-9]/.test(password) ? 5 : 0) +
    (/[^A-Za-z0-9]/.test(password) ? 10 : 0);

  // Uniqueness bonus (penalize repeating characters)
  const uniqueChars = new Set(password).size;
  const uniquenessRatio = uniqueChars / password.length;
  const uniquenessEntropy = uniquenessRatio * 10;

  // Pattern penalty
  let patternPenalty = 0;
  if (/(.)\1{2,}/.test(password)) patternPenalty -= 5; // Repeating characters
  if (/123|abc|qwe/i.test(password)) patternPenalty -= 5; // Common sequences
  if (/pass|word|admin/i.test(password)) patternPenalty -= 10; // Common words
  if (/[A-Za-z]+\d{1,3}$/i.test(password)) patternPenalty -= 5; // Word followed by numbers
  if (/^\d{1,3}[A-Za-z]+$/i.test(password)) patternPenalty -= 5; // Numbers followed by word

  // Dictionary check penalty
  let dictionaryPenalty = 0;
  const lowerPassword = password.toLowerCase();
  for (const commonPwd of COMMON_PASSWORDS) {
    if (lowerPassword.includes(commonPwd)) {
      dictionaryPenalty -= 15;
      break;
    }
  }

  return {
    base: baseEntropy,
    length: lengthEntropy,
    variety: varietyEntropy,
    uniqueness: uniquenessEntropy,
    pattern: patternPenalty,
    dictionary: dictionaryPenalty
  };
};

const EntropyBreakdown = ({ details }: { details: EntropyDetails }) => {
  return (
    <View style={styles.entropyBreakdown}>
      <Text style={styles.entropyTitle}>Password Analysis:</Text>
      <View style={styles.entropyGrid}>
        <View style={styles.entropyItem}>
          <Text style={styles.entropyLabel}>Base Strength</Text>
          <Text style={styles.entropyValue}>{Math.round(details.base)}</Text>
        </View>
        <View style={styles.entropyItem}>
          <Text style={styles.entropyLabel}>Length Bonus</Text>
          <Text style={[styles.entropyValue, { color: '#10b981' }]}>+{details.length}</Text>
        </View>
        <View style={styles.entropyItem}>
          <Text style={styles.entropyLabel}>Variety Bonus</Text>
          <Text style={[styles.entropyValue, { color: '#10b981' }]}>+{details.variety}</Text>
        </View>
        <View style={styles.entropyItem}>
          <Text style={styles.entropyLabel}>Uniqueness</Text>
          <Text style={[styles.entropyValue, { color: '#10b981' }]}>+{Math.round(details.uniqueness)}</Text>
        </View>
        {details.pattern !== 0 && (
          <View style={styles.entropyItem}>
            <Text style={styles.entropyLabel}>Pattern Penalty</Text>
            <Text style={[styles.entropyValue, { color: '#ef4444' }]}>{details.pattern}</Text>
          </View>
        )}
      </View>
      {details.dictionary !== 0 && (
        <View style={styles.entropyItem}>
          <Text style={styles.entropyLabel}>Dictionary Check</Text>
          <Text style={[styles.entropyValue, { color: '#ef4444' }]}>
            {details.dictionary}
          </Text>
        </View>
      )}
    </View>
  );
};

const generateSecurePassword = (): string => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = lowercase + uppercase + numbers + special;
  let password = '';
  
  // Ensure at least one of each type
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Add random characters to reach desired length (16)
  while (password.length < 16) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

const GeneratePasswordButton = ({ onGenerate }: { onGenerate: (password: string) => void }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Simulate some delay for UX
    setTimeout(() => {
      const newPassword = generateSecurePassword();
      onGenerate(newPassword);
      setIsGenerating(false);
    }, 500);
  };

  return (
    <TouchableOpacity
      style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
      onPress={handleGenerate}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={styles.generateButtonText}>Generate Strong Password</Text>
      )}
    </TouchableOpacity>
  );
};

const SuggestionItem = ({ suggestion, reason }: PasswordSuggestion) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setString(suggestion);
    setCopied(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300 }}
      style={styles.suggestionItem}
    >
      <View style={styles.suggestionHeader}>
        <Text style={styles.suggestionTitle}>Suggestion:</Text>
        <TouchableOpacity
          onPress={handleCopy}
          style={styles.copyButton}
          accessibilityLabel={copied ? "Copied to clipboard" : "Copy suggestion"}
        >
          {copied ? (
            <CheckCircle size={16} color="#10b981" />
          ) : (
            <Copy size={16} color="#0369a1" />
          )}
        </TouchableOpacity>
      </View>
      <Text style={styles.suggestionText}>{suggestion}</Text>
      <Text style={styles.suggestionReason}>{reason}</Text>
    </MotiView>
  );
};

interface Props {
  password: string;
  onStrengthChange?: (score: number) => void;
  onPasswordGenerate?: (password: string) => void;
}

const PasswordStrengthIndicator: React.FC<Props> = ({ 
  password, 
  onStrengthChange,
  onPasswordGenerate
}) => {
  const weightedScore = strengthChecks.reduce((acc, check) => 
    acc + (check.regex.test(password) ? check.weight : 0), 0
  );
  const maxScore = strengthChecks.reduce((acc, check) => acc + check.weight, 0);
  
  const { entropy, bonus } = calculateEntropy(password);
  const entropyScore = Math.min(10, Math.floor(entropy / 10)) + bonus;
  
  const strengthColor = getStrengthColor(Math.max(weightedScore, entropyScore));
  
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);
  const previousScore = useSharedValue(0);
  
  const [feedback, setFeedback] = useState<PasswordFeedback>({ suggestions: [] });
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isCompromised, setIsCompromised] = useState(false);
  const entropyDetails = calculateDetailedEntropy(password);
  
  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener('keyboardDidShow', () => {
      setShowAnalysis(false);
    });
    const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => {
      setShowAnalysis(true);
    });

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

  useEffect(() => {
    const checkPassword = async () => {
      if (password.length >= 4) {
        const compromised = await isPasswordCompromised(password);
        setIsCompromised(compromised);
        if (compromised) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      } else {
        setIsCompromised(false);
      }
    };
    
    checkPassword();
  }, [password]);
  
  useEffect(() => {
    if (password) {
      const result = zxcvbn(password);
      setFeedback({
        warning: result.feedback.warning,
        suggestions: result.feedback.suggestions,
      });
    }
  }, [password]);
  
  useEffect(() => {
    const announceStrength = async () => {
      if (weightedScore !== previousScore.value) {
        const strengthLabel = getStrengthLabel(weightedScore);
        await AccessibilityInfo.announceForAccessibility(
          `Password strength is ${strengthLabel}. Score: ${weightedScore} out of ${maxScore}`
        );
        await getHapticFeedback(previousScore.value, weightedScore);
        previousScore.value = weightedScore;
        onStrengthChange?.(weightedScore);
      }
    };

    announceStrength();

    progress.value = withSpring(weightedScore / maxScore, {
      damping: 15,
      stiffness: 100,
    });

    scale.value = withSequence(
      withTiming(1.05, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
  }, [weightedScore]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${(progress.value * 100)}%`,
    backgroundColor: strengthColor,
    transform: [{ scale: scale.value }],
  }));

  const getStrengthLabel = useCallback((score: number): string => {
    if (score <= 3) return 'Weak';
    if (score <= 6) return 'Medium';
    return 'Strong';
  }, []);

  const renderFeedback = () => {
    if (!password) return null;
    
    return (
      <View style={styles.feedbackContainer}>
        {isCompromised && (
          <Text style={styles.compromisedText}>
            This password appears in common password lists and should not be used!
          </Text>
        )}
        {feedback.warning && (
          <Text style={styles.warningText}>{feedback.warning}</Text>
        )}
        {feedback.suggestions.length > 0 && (
          <View style={styles.suggestionsList}>
            {feedback.suggestions.map((suggestion, index) => (
              <Text key={index} style={styles.suggestionItem}>
                • {suggestion}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View 
      style={styles.container}
      accessible={true}
      accessibilityLabel="Password strength indicator"
      accessibilityHint="Shows how strong your password is"
      accessibilityRole="progressbar"
    >
      <View style={styles.barContainer}>
        <Animated.View 
          style={[styles.strengthBar, barStyle]}
          accessible={false}
        />
      </View>
      
      {renderFeedback()}
      
      <View style={styles.labelContainer}>
        <Text 
          style={[styles.strengthLabel, { color: strengthColor }]}
          accessible={true}
          accessibilityLabel={`Password strength is ${getStrengthLabel(weightedScore)}`}
        >
          Password Strength: {getStrengthLabel(weightedScore)}
        </Text>
        <Text 
          style={styles.scoreText}
          accessible={true}
          accessibilityLabel={`Score ${weightedScore} out of ${maxScore}`}
        >
          {weightedScore}/{maxScore}
        </Text>
      </View>
      
      <View style={styles.checksContainer}>
        {strengthChecks.map((check, index) => {
          const isCompleted = check.regex.test(password);
          return (
            <View 
              key={index} 
              style={styles.checkItem}
              accessible={true}
              accessibilityLabel={`${check.label}: ${check.description}`}
              accessibilityState={{ checked: isCompleted }}
            >
              <View style={styles.checkRow}>
                <MotiView
                  animate={{
                    scale: isCompleted ? [0, 1.2, 1] : 1,
                    opacity: isCompleted ? 1 : 0.5,
                  }}
                  transition={{
                    type: 'timing',
                    duration: 300,
                    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                  }}
                  style={styles.checkmarkContainer}
                >
                  <Text
                    style={[
                      styles.checkText,
                      {
                        color: isCompleted ? '#10b981' : '#94a3b8'
                      }
                    ]}
                  >
                    {isCompleted ? '✓' : '•'}
                  </Text>
                </MotiView>
                <Text style={[
                  styles.checkLabel,
                  { color: isCompleted ? '#10b981' : '#94a3b8' }
                ]}>
                  {check.label}
                </Text>
              </View>
              <Text style={styles.checkDescription}>
                {check.description}
              </Text>
            </View>
          );
        })}
      </View>
      
      {password.length > 0 && weightedScore < 6 && (
        <View style={styles.suggestionsWrapper}>
          {(() => {
            const suggestion = generatePasswordSuggestion(password, strengthChecks);
            if (!suggestion) return null;
            return <SuggestionItem {...suggestion} />;
          })()}
        </View>
      )}
      
      {showAnalysis && <EntropyBreakdown details={entropyDetails} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  barContainer: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  strengthBar: {
    height: '100%',
    borderRadius: 3,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  strengthLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  scoreText: {
    fontSize: 12,
    color: '#64748b',
  },
  checksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  checkItem: {
    flexBasis: '48%',
    marginBottom: 12,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkText: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  checkDescription: {
    fontSize: 11,
    color: '#64748b',
    paddingLeft: 16,
  },
  checkmarkContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkLabel: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  entropyContainer: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
  },
  entropyLabel: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
  bonusText: {
    fontSize: 11,
    color: '#10b981',
    marginTop: 2,
  },
  suggestionsWrapper: {
    marginTop: 16,
  },
  suggestionItem: {
    padding: 12,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  copyButton: {
    padding: 4,
  },
  suggestionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0369a1',
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 14,
    color: '#0c4a6e',
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
    marginBottom: 4,
  },
  suggestionReason: {
    fontSize: 11,
    color: '#64748b',
    fontStyle: 'italic',
  },
  generateButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 16,
    alignItems: 'center',
  },
  generateButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  generateButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  feedbackContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  warningText: {
    color: '#f59e0b',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  suggestionsList: {
    marginTop: 4,
  },
  entropyBreakdown: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  entropyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 12,
  },
  entropyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  entropyItem: {
    flexBasis: '48%',
    marginBottom: 8,
  },
  entropyValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },
  compromisedText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
    backgroundColor: '#fee2e2',
    padding: 8,
    borderRadius: 6,
  },
});

export default PasswordStrengthIndicator;

