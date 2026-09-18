import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { useEnergy } from '../../context/EnergyContext';
import { copilotService, CopilotMessage } from '../../services/copilotService';

interface BilingualCopilotModalProps {
  visible: boolean;
  onClose: () => void;
}

export const BilingualCopilotModal: React.FC<BilingualCopilotModalProps> = ({
  visible,
  onClose,
}) => {
  const { telemetry, nepraStatus } = useEnergy();
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'init_1',
      sender: 'assistant',
      language: 'ur',
      timestamp: 'Just now',
      text: 'Assalam-o-Alaikum! Main aap ka BijliOptima Energy Copilot hoon. Aap Roman Urdu ya English mein pooch saktay hain, jaisay: "Kya abhi paani ki motor chala saktay hain?" ya What-If scenarios model karwa saktay hain.',
      metricsHighlight: {
        label: 'STATUS',
        value: 'AI ENERGY COPILOT READY',
      },
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Pulsing voice wave animation
  const waveAnim = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const nd = Platform.OS !== 'web';
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, { toValue: 1.25, duration: 600, useNativeDriver: nd }),
        Animated.timing(waveAnim, { toValue: 1.0, duration: 600, useNativeDriver: nd }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [waveAnim]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim()) return;

    const userMsg: CopilotMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      language: 'en',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const response = await copilotService.processQuery(textToSend, {
        solarKw: telemetry.solarKw,
        batterySoc: telemetry.batterySoc,
        houseLoadKw: telemetry.houseLoadKw,
        isPeakHour: true,
        currentUnits: nepraStatus.currentUnits,
      });

      setMessages((prev) => [...prev, response]);
    } finally {
      setIsThinking(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const presetQueries = [
    'Kya abhi paani ki motor chala saktay hain?',
    'What-If: Run 2 ACs all afternoon?',
    'End-of-Month ROI savings breakdown',
    'How to absorb solar surplus now?',
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Animated.View style={[styles.voiceBubble, { transform: [{ scale: waveAnim }] }]}>
                <MaterialCommunityIcons name="microphone-message" size={20} color={colors.primaryBright} />
              </Animated.View>
              <View>
                <Text style={styles.headerTitle}>BijliOptima AI Copilot</Text>
                <Text style={styles.headerSub}>BILINGUAL ENERGY ADVISOR (ENGLISH / ROMAN URDU)</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialCommunityIcons name="close" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Quick Preset Prompts */}
          <View style={styles.presetsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetsScroll}>
              {presetQueries.map((query, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.presetChip}
                  onPress={() => handleSend(query)}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons name="lightning-bolt" size={12} color={colors.primaryBright} />
                  <Text style={styles.presetChipText}>{query}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Messages Scroll View */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.chatScroll}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <View
                  key={msg.id}
                  style={[
                    styles.messageWrapper,
                    isUser ? styles.userMessageWrapper : styles.assistantMessageWrapper,
                  ]}
                >
                  {/* Tool-Call Inspection Badge */}
                  {msg.toolCall && (
                    <View style={styles.toolCallCard}>
                      <View style={styles.toolCallHeader}>
                        <MaterialCommunityIcons name="robot" size={13} color={colors.tertiaryContainer} />
                        <Text style={styles.toolCallTitle}>TOOL EXECUTION: {msg.toolCall.toolName.toUpperCase()}</Text>
                      </View>
                      <Text style={styles.toolCallResult}>{msg.toolCall.result}</Text>
                    </View>
                  )}

                  {/* Message Bubble */}
                  <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
                    <Text style={[styles.bubbleText, isUser ? styles.userBubbleText : styles.assistantBubbleText]}>
                      {msg.text}
                    </Text>

                    {msg.metricsHighlight && (
                      <View style={styles.highlightPill}>
                        <Text style={styles.highlightLabel}>{msg.metricsHighlight.label}:</Text>
                        <Text style={styles.highlightValue}>{msg.metricsHighlight.value}</Text>
                      </View>
                    )}

                    <Text style={styles.timestamp}>{msg.timestamp}</Text>
                  </View>
                </View>
              );
            })}

            {isThinking && (
              <View style={styles.thinkingBubble}>
                <MaterialCommunityIcons name="dots-horizontal" size={24} color={colors.primaryBright} />
                <Text style={styles.thinkingText}>Copilot is evaluating live telemetry & NEPRA matrix...</Text>
              </View>
            )}
          </ScrollView>

          {/* Text Input Row */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask in Roman Urdu or English..."
              placeholderTextColor={colors.textDim}
              onSubmitEditing={() => handleSend()}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={styles.sendBtn}
              onPress={() => handleSend()}
              disabled={!inputText.trim()}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="send" size={18} color={colors.onPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 14, 0.85)',
    justifyContent: 'flex-end',
  },
  container: {
    height: '85%',
    backgroundColor: colors.surfaceContainer,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGhost,
    backgroundColor: 'rgba(28, 32, 40, 0.95)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  voiceBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 229, 153, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderGlowPrimary,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSub: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.primaryBright,
    letterSpacing: 0.8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  closeBtn: {
    padding: 4,
  },
  presetsContainer: {
    paddingVertical: 8,
    backgroundColor: 'rgba(24, 28, 36, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGhost,
  },
  presetsScroll: {
    paddingHorizontal: 14,
    gap: 8,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderGhost,
  },
  presetChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    gap: 14,
  },
  messageWrapper: {
    width: '100%',
  },
  userMessageWrapper: {
    alignItems: 'flex-end',
  },
  assistantMessageWrapper: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '85%',
    borderRadius: 14,
    padding: 12,
    gap: 6,
  },
  userBubble: {
    backgroundColor: colors.primaryContainer,
    borderBottomRightRadius: 2,
  },
  assistantBubble: {
    backgroundColor: colors.surfaceContainerLow,
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: colors.borderGhost,
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: 19,
  },
  userBubbleText: {
    color: colors.onPrimaryContainer,
    fontWeight: '600',
  },
  assistantBubbleText: {
    color: colors.textPrimary,
  },
  highlightPill: {
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.borderGlowPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  highlightLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  highlightValue: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryBright,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  timestamp: {
    fontSize: 9,
    color: colors.textMuted,
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  toolCallCard: {
    backgroundColor: 'rgba(10, 14, 22, 0.9)',
    borderRadius: 8,
    padding: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(124, 211, 255, 0.3)',
    maxWidth: '85%',
  },
  toolCallHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  toolCallTitle: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.tertiaryContainer,
    letterSpacing: 0.8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  toolCallResult: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  thinkingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  thinkingText: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderGhost,
    backgroundColor: colors.surfaceContainerLowest,
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 13,
    borderWidth: 1,
    borderColor: colors.borderGhost,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryBright,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
