import React, { useState, useEffect } from 'react';
import { ArrowRightIcon, ArrowLeftIcon } from 'lucide-react';

interface PersonalityTestProps {
    onComplete: (data: any) => void;
    onPrevious: () => void;
    canGoBack: boolean;
    language: string;
}

interface QuestionResponse {
    questionId: string;
    questionText: string;
    userAnswer: number;
    responseTime: number;
    timestamp: Date;
    trait: string;
    questionIndex: number;
}

interface LearningStyleResponse {
    selectedStyle: string;
    styleLabel: string;
    styleDescription: string;
    timestamp: Date;
    responseTime: number;
}

// ...existing personalityQuestions, traitNames, learningStyles, translations...

const PersonalityTest: React.FC<PersonalityTestProps> = ({ onComplete, onPrevious, canGoBack, language = 'fr' }) => {
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [learningStyle, setLearningStyle] = useState('');

    // Nouvelles states pour capturer les détails
    const [detailedResponses, setDetailedResponses] = useState<QuestionResponse[]>([]);
    const [learningStyleResponse, setLearningStyleResponse] = useState<LearningStyleResponse | null>(null);
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());
    const [sessionStartTime] = useState(Date.now());
    const [learningStyleStartTime, setLearningStyleStartTime] = useState<number | null>(null);

    const t = translations[language as 'fr' | 'ar'] || translations.fr;
    const styles = learningStyles[language as 'fr' | 'ar'] || learningStyles.fr;
    const traits = Object.keys(personalityQuestions);

    // Démarrer le timer pour le style d'apprentissage quand on arrive à cette section
    useEffect(() => {
        const allQuestionsAnswered = traits.every((trait) => {
            const traitData = personalityQuestions[trait as keyof typeof personalityQuestions];
            const questions = traitData?.[language as 'fr' | 'ar'] || [];
            return questions.every((_, index) => answers[`${trait}_${index}`] !== undefined);
        });

        if (allQuestionsAnswered && !learningStyleStartTime) {
            setLearningStyleStartTime(Date.now());
        }
    }, [answers, traits, language, learningStyleStartTime]);

    const handleAnswer = (trait: string, questionIndex: number, value: number) => {
        const key = `${trait}_${questionIndex}`;
        const responseTime = Date.now() - questionStartTime;

        // Enregistrer la réponse simple
        setAnswers(prev => ({ ...prev, [key]: value }));

        // Obtenir le texte de la question
        const traitData = personalityQuestions[trait as keyof typeof personalityQuestions];
        const questions = traitData?.[language as 'fr' | 'ar'] || [];
        const questionText = questions[questionIndex];

        if (questionText) {
            const questionResponse: QuestionResponse = {
                questionId: key,
                questionText,
                userAnswer: value,
                responseTime,
                timestamp: new Date(),
                trait,
                questionIndex
            };

            // Mettre à jour les réponses détaillées (remplacer si déjà répondu)
            setDetailedResponses(prevResponses => {
                const filteredResponses = prevResponses.filter(r => r.questionId !== key);
                const newResponses = [...filteredResponses, questionResponse].sort((a, b) => {
                    if (a.trait !== b.trait) {
                        return traits.indexOf(a.trait) - traits.indexOf(b.trait);
                    }
                    return a.questionIndex - b.questionIndex;
                });

                console.log(`🧠 Personality Response Captured:`, {
                    trait,
                    question: questionText.substring(0, 50) + '...',
                    answer: value,
                    responseTime: `${responseTime}ms`,
                    totalResponses: newResponses.length
                });

                return newResponses;
            });
        }

        // Reset timer pour la prochaine question
        setQuestionStartTime(Date.now());
    };

    const handleLearningStyleChange = (value: string) => {
        const responseTime = learningStyleStartTime ? Date.now() - learningStyleStartTime : 0;
        const selectedStyleData = styles.find(style => style.value === value);

        setLearningStyle(value);

        if (selectedStyleData) {
            const styleResponse: LearningStyleResponse = {
                selectedStyle: value,
                styleLabel: selectedStyleData.label,
                styleDescription: selectedStyleData.description,
                timestamp: new Date(),
                responseTime
            };

            setLearningStyleResponse(styleResponse);

            console.log(`🎨 Learning Style Selected:`, {
                style: selectedStyleData.label,
                responseTime: `${responseTime}ms`,
                description: selectedStyleData.description
            });
        }
    };

    const handleSubmit = () => {
        console.group('🧠 Personality Test Completion');
        console.log('Calculating scores and preparing detailed data...');

        // Calculate scores for each trait
        const scores: Record<string, number> = {};
        let totalQuestions = 0;
        let totalResponses = detailedResponses.length;

        traits.forEach((trait) => {
            let total = 0;
            let answered = 0;

            const traitData = personalityQuestions[trait as keyof typeof personalityQuestions];
            const questions = traitData?.[language as 'fr' | 'ar'] || [];
            totalQuestions += questions.length;

            questions.forEach((_, index) => {
                const key = `${trait}_${index}`;
                if (answers[key] !== undefined) {
                    total += answers[key];
                    answered++;
                }
            });

            scores[trait] = answered > 0 ? Math.round((total / answered) * 20) : 0;
            console.log(`${trait}: ${answered}/${questions.length} answered, score: ${scores[trait]}`);
        });

        // Calculer les statistiques temporelles
        const avgResponseTime = detailedResponses.length > 0
            ? detailedResponses.reduce((sum, r) => sum + r.responseTime, 0) / detailedResponses.length
            : 0;

        // Identifier les traits dominants
        const sortedTraits = Object.entries(scores)
            .sort(([, a], [, b]) => (b as number) - (a as number));
        const dominantTraits = sortedTraits.slice(0, Math.ceil(sortedTraits.length / 2)).map(([trait]) => trait);

        // Créer la session
        const session = {
            testType: 'personality',
            startedAt: new Date(sessionStartTime),
            completedAt: new Date(),
            duration: Date.now() - sessionStartTime,
            language: language as 'fr' | 'ar',
            totalQuestions: totalQuestions + 1, // +1 pour le style d'apprentissage
            questions: [
                ...detailedResponses.map(response => ({
                    questionId: response.questionId,
                    questionText: response.questionText,
                    userAnswer: response.userAnswer,
                    responseTime: response.responseTime,
                    timestamp: response.timestamp
                })),
                // Ajouter la réponse du style d'apprentissage comme "question"
                ...(learningStyleResponse ? [{
                    questionId: 'learning_style',
                    questionText: t.learningStyleSubtitle,
                    userAnswer: learningStyleResponse.selectedStyle,
                    responseTime: learningStyleResponse.responseTime,
                    timestamp: learningStyleResponse.timestamp
                }] : [])
            ]
        };

        // Statistiques par trait
        const traitStats = traits.map(trait => {
            const traitResponses = detailedResponses.filter(r => r.trait === trait);
            return {
                trait,
                score: scores[trait],
                questionsAnswered: traitResponses.length,
                avgResponseTime: traitResponses.length > 0
                    ? Math.round(traitResponses.reduce((sum, r) => sum + r.responseTime, 0) / traitResponses.length)
                    : 0
            };
        });

        console.log('Final Statistics:', {
            totalQuestions,
            totalResponses,
            avgResponseTime: Math.round(avgResponseTime),
            dominantTraits,
            learningStyle,
            sessionDuration: session.duration
        });
        console.groupEnd();

        const completionData = {
            scores,
            learningStyle,
            rawAnswers: answers,
            session,
            detailedResponses,
            learningStyleResponse,
            totalQuestions,
            totalResponses,
            avgResponseTime: Math.round(avgResponseTime),
            dominantTraits,
            sessionDuration: session.duration,
            completedAt: new Date(),
            traitStats
        };

        onComplete(completionData);
    };

    const isComplete = traits.every((trait) => {
        const traitData = personalityQuestions[trait as keyof typeof personalityQuestions];
        const questions = traitData?.[language as 'fr' | 'ar'] || [];
        return questions.every((_, index) => answers[`${trait}_${index}`] !== undefined);
    }) && learningStyle;

    const getTraitName = (trait: string) => {
        return traitNames[language as 'fr' | 'ar'][trait as keyof typeof traitNames.fr] || trait;
    };

    // Calculer les statistiques de progression
    const getTotalQuestionsAnswered = () => {
        return Object.keys(answers).length;
    };

    const getTotalQuestions = () => {
        return traits.reduce((total, trait) => {
            const traitData = personalityQuestions[trait as keyof typeof personalityQuestions];
            const questions = traitData?.[language as 'fr' | 'ar'] || [];
            return total + questions.length;
        }, 0);
    };

    return (
        <div className={`space-y-8 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{t.testTitle}</h2>
                <p className="text-gray-600">{t.testSubtitle}</p>

                {/* Progress Statistics */}
                {detailedResponses.length > 0 && (
                    <div className="bg-purple-50 rounded-lg p-3 mt-4">
                        <div className={`text-sm text-purple-700 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                            {language === 'ar'
                                ? `التقدم: ${getTotalQuestionsAnswered()}/${getTotalQuestions()} أسئلة`
                                : `Progression: ${getTotalQuestionsAnswered()}/${getTotalQuestions()} questions`
                            }
                            {detailedResponses.length > 0 && (
                                <span className="ml-4">
                                    {language === 'ar'
                                        ? `متوسط الوقت: ${Math.round(detailedResponses.reduce((sum, r) => sum + r.responseTime, 0) / detailedResponses.length / 1000)}ث`
                                        : `Temps moyen: ${Math.round(detailedResponses.reduce((sum, r) => sum + r.responseTime, 0) / detailedResponses.length / 1000)}s`
                                    }
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Personality Questions */}
            {traits.map((trait, traitIndex) => {
                const traitData = personalityQuestions[trait as keyof typeof personalityQuestions];
                const questions = traitData?.[language as 'fr' | 'ar'] || [];
                const traitResponses = detailedResponses.filter(r => r.trait === trait);

                return (
                    <div key={trait} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                        <div className={`flex justify-between items-center mb-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {getTraitName(trait)}
                            </h3>
                            <div className="text-right">
                                <div className="text-sm text-purple-600">
                                    {traitResponses.length}/{questions.length}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {language === 'ar' ? 'مُجاب عليها' : 'répondues'}
                                </div>
                            </div>
                        </div>

                        <p className={`text-sm text-gray-600 mb-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                            {t.questionInstruction}
                        </p>

                        <div className="space-y-4">
                            {questions.map((question, questionIndex) => {
                                const key = `${trait}_${questionIndex}`;
                                const currentAnswer = answers[key];
                                const hasAnswered = currentAnswer !== undefined;

                                return (
                                    <div key={questionIndex} className={`bg-white rounded-lg p-4 border shadow-sm transition-all ${hasAnswered ? 'border-purple-300 bg-purple-50' : 'border-gray-200'
                                        }`}>
                                        <div className={`flex justify-between items-start mb-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                            <p className={`text-gray-800 flex-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                                {question}
                                            </p>
                                            {hasAnswered && (
                                                <span className="text-xs text-purple-600 font-medium ml-2">
                                                    ✓ {currentAnswer}/5
                                                </span>
                                            )}
                                        </div>

                                        <div className={`flex justify-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                                            {[1, 2, 3, 4, 5].map(value => (
                                                <button
                                                    key={value}
                                                    onClick={() => handleAnswer(trait, questionIndex, value)}
                                                    className={`w-10 h-10 rounded-full border-2 font-medium transition-all ${currentAnswer === value
                                                        ? 'bg-purple-500 border-purple-500 text-white scale-110'
                                                        : 'border-gray-300 text-gray-600 hover:border-purple-300 hover:text-purple-600'
                                                        }`}
                                                >
                                                    {value}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            {/* Learning Style */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6">
                <div className={`flex justify-between items-center mb-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <h3 className="text-lg font-semibold text-gray-900">{t.learningStyleTitle}</h3>
                    {learningStyle && (
                        <div className="text-right">
                            <div className="text-sm text-green-600">✓</div>
                            <div className="text-xs text-gray-500">
                                {language === 'ar' ? 'مختار' : 'sélectionné'}
                            </div>
                        </div>
                    )}
                </div>
                <p className={`text-gray-600 mb-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    {t.learningStyleSubtitle}
                </p>

                <div className="grid md:grid-cols-2 gap-3">
                    {styles.map(({ value, label, description }) => (
                        <button
                            key={value}
                            onClick={() => handleLearningStyleChange(value)}
                            className={`p-4 rounded-lg border-2 transition-all ${learningStyle === value
                                ? 'border-green-500 bg-green-100'
                                : 'border-gray-300 hover:border-green-300'
                                } ${language === 'ar' ? 'text-right' : 'text-left'}`}
                        >
                            <div className="font-medium text-gray-900">{label}</div>
                            <div className="text-sm text-gray-600 mt-1">{description}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            <div className={`flex justify-between items-center pt-6 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <button
                    type="button"
                    onClick={onPrevious}
                    className={`inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all ${language === 'ar' ? 'flex-row-reverse' : ''
                        }`}
                >
                    {language === 'ar' ? (
                        <>
                            <ArrowRightIcon className="w-4 h-4" />
                            <span>{t.previous}</span>
                        </>
                    ) : (
                        <>
                            <ArrowLeftIcon className="w-4 h-4" />
                            <span>{t.previous}</span>
                        </>
                    )}
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={!isComplete}
                    className={`inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${language === 'ar' ? 'flex-row-reverse' : ''
                        }`}
                >
                    {language === 'ar' ? (
                        <>
                            <ArrowLeftIcon className="w-4 h-4" />
                            <span>{t.continue}</span>
                        </>
                    ) : (
                        <>
                            <span>{t.continue}</span>
                            <ArrowRightIcon className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default PersonalityTest;