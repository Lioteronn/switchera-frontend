import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Music, Code, Handshake, ArrowRight, Compass, Lightbulb, Clock, Camera, Languages, Palette, Utensils } from 'lucide-react-native';
import { Badge, Card, Heading, BadgeText, Button, ButtonText } from '@gluestack-ui/themed';

// Colores base (modo claro)
const COLORS = {
  background: '#fff',
  text: '#11181C',
  accent: '#2563eb',
  cardBg: '#fff',
  sectionBg: '#eff6ff',
  secondaryText: '#6b7280',
  borderColor: '#e5e7eb',
  badgeBg: '#dbeafe'
};

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  // Datos para las tarjetas de características
  const featureData = [
    {
      icon: <Clock color="#2563eb" size={32} />,
      title: "45-Minute Format",
      description: "Focused sessions that respect your time while maximizing learning efficiency."
    },
    {
      icon: <Compass color="#2563eb" size={32} />,
      title: "Skill Discovery",
      description: "Explore new interests and talents you never knew existed in your community."
    },
    {
      icon: <Lightbulb color="#2563eb" size={32} />,
      title: "Personal Growth",
      description: "Develop yourself professionally and personally through diverse learning experiences."
    }
  ];

  // Datos para los pasos de "How It Works"
  const steps = [
    {
      number: "1",
      title: "Create Your Profile",
      description: "List the skills you can teach and what you want to learn."
    },
    {
      number: "2",
      title: "Match & Connect",
      description: "Find compatible skill partners and schedule your first exchange."
    },
    {
      number: "3",
      title: "Teach & Learn",
      description: "Enjoy 45-minute sessions where both parties gain valuable knowledge."
    }
  ];

  // Datos para historias de éxito
  const successStories = [
    {
      name: "Michael J.",
      role: "Guitar Teacher / Coding Student",
      quote: "I've been teaching guitar for years, but always wanted to learn coding. Through SkillSwap, I found a developer who needed help with music theory. Win-win!",
      skills: [
        { name: "Music", color: "#3b82f6" },
        { name: "Programming", color: "#8b5cf6" }
      ]
    },
    {
      name: "Sarah L.",
      role: "Yoga Instructor / Language Learner",
      quote: "I exchange weekly yoga sessions for Spanish lessons. The 45-minute format keeps us focused and makes progress visible each week.",
      skills: [
        { name: "Fitness", color: "#10b981" },
        { name: "Languages", color: "#f59e0b" }
      ]
    },
    {
      name: "David T.",
      role: "Graphic Designer / Home.tsx Cook",
      quote: "I redesigned someone's portfolio in exchange for learning authentic Italian cooking techniques. It's knowledge I couldn't get from YouTube!",
      skills: [
        { name: "Design", color: "#ec4899" },
        { name: "Cooking", color: "#ef4444" }
      ]
    },
    {
      name: "Elena R.",
      role: "Photographer / Marketing Student",
      quote: "Trading my photography skills for marketing lessons has helped me grow my business. Now I can both take great photos AND promote them effectively!",
      skills: [
        { name: "Photography", color: "#0891b2" },
        { name: "Marketing", color: "#7c3aed" }
      ]
    }
  ];

  return (
      <ScrollView style={styles.container}>
        <View style={styles.contentWrapper}>
          {/* Header */}
          <View style={[styles.header, { borderColor: COLORS.borderColor, backgroundColor: COLORS.cardBg }]}>
            <TouchableOpacity onPress={() => router.push('/')}>
              <Text style={[styles.logo, { color: COLORS.accent }]}>Switchera</Text>
            </TouchableOpacity>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                  onPress={() => router.push('/login')}
                  style={[styles.signupButton, { backgroundColor: COLORS.accent }]}>
                <Text style={styles.signupText}>Login</Text>
              </TouchableOpacity>
              <View style={{ width: 16 }} />
              {/* Botón de registro */}
              <TouchableOpacity
                  onPress={() => router.push('/register')}
                  style={[styles.signupButton, { backgroundColor: COLORS.accent }]}>
                <Text style={styles.signupText}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sección de introducción dividida en dos bloques */}
          <View style={[
            styles.introSectionContainer,
            { backgroundColor: COLORS.sectionBg },
            isSmallScreen ? styles.introSectionVertical : styles.introSectionHorizontal
          ]}>
            {/* Bloque izquierdo: contenido de texto */}
            <View style={[
              styles.introTextBlock,
              isSmallScreen ? { width: '100%' } : { width: '45%' }
            ]}>
              <View style={styles.badgeWrapper}>
                <Badge style={[styles.badgeI, { backgroundColor: COLORS.badgeBg }]}>
                  <BadgeText style={styles.badgeText}>Introducing SkillSwap</BadgeText>
                </Badge>
              </View>

              <Text style={[styles.introTitle, { color: COLORS.text }]}>
                Trade Skills, <Text style={styles.bold}>Grow Together</Text>
              </Text>

              <Text style={[styles.introText, { color: COLORS.secondaryText }]}>
                Exchange your expertise for new knowledge. Teach guitar, learn coding. All in focused 45-minute sessions.
              </Text>

              <View style={styles.buttonGroup}>
                <Button
                    onPress={() => router.push('/register')}
                    style={[styles.primaryButton, { backgroundColor: COLORS.accent }]}>
                  <ButtonText>
                    <Text style={styles.primaryButtonText}>Get Started</Text>
                  </ButtonText>
                  <ArrowRight color="#fff" size={18} style={{ marginLeft: 6 }} />
                </Button>

                <Button style={[styles.secondaryButton, { borderColor: COLORS.accent, backgroundColor: COLORS.cardBg }]}>
                  <ButtonText>
                    <Text style={{ color: COLORS.accent }}>Learn More</Text>
                  </ButtonText>
                </Button>
              </View>
            </View>

            {/* Bloque derecho: tarjetas */}
            <View style={[
              styles.cardsBlock,
              isSmallScreen ? { width: '100%', marginTop: 32 } : { width: '50%' }
            ]}>
              {/* Contenedor interno para tarjetas e icono */}
              <View style={[styles.cardsInnerContainer, { backgroundColor: COLORS.cardBg }]}>
                {/* Primera tarjeta */}
                <View style={[styles.card, styles.cardBlue]}>
                  <View style={styles.cardHeader}>
                    <Music color="#3b82f6" size={20} />
                    <Text style={styles.cardTitle}>Guitar Lessons </Text>
                  </View>
                  <Text style={styles.cardText}>Offering 45-min beginner lessons</Text>
                </View>

                <View style={styles.iconWrapper}>
                  <Handshake color="#3b82f6" size={28} />
                </View>
                {/* Segunda tarjeta */}
                <View style={[styles.card, styles.cardRed]}>
                  <View style={styles.cardHeader}>
                    <Code color="#ef4444" size={20} />
                    <Text style={styles.cardTitle}>Coding Help</Text>
                  </View>
                  <Text style={styles.cardText}>Seeking JavaScript tutorials</Text>
                </View>

              </View>
            </View>
          </View>

          {/* Features */}
          <View style={styles.featuresSection}>
            <View style={styles.badgeWrapper}>
              <Badge style={[styles.badge, { backgroundColor: COLORS.badgeBg }]}>
                <BadgeText style={styles.badgeText}>Features</BadgeText>
              </Badge>
            </View>
            <Heading style={[styles.featuresTitle, { color: COLORS.text }]}>
              Why SkillSwap Works
            </Heading>
            <Text style={[styles.featuresSubtitle, { color: COLORS.secondaryText }]}>
              Our platform makes skill trading simple, effective, and rewarding.
            </Text>
            <View style={isSmallScreen ? styles.featureCardsVertical : styles.featureCardsHorizontal}>
              {featureData.map((feature, index) => (
                  <Card
                      key={index}
                      style={[styles.featureCard, { borderColor: '#bfdbfe', backgroundColor: COLORS.cardBg }]}
                  >
                    {feature.icon}
                    <Heading style={[styles.featureCardTitle, { color: COLORS.text }]}>{feature.title}</Heading>
                    <Text style={[styles.featureCardText, { color: COLORS.secondaryText }]}>
                      {feature.description}
                    </Text>
                  </Card>
              ))}
            </View>
          </View>
          {/* How It Works */}
          <View style={[styles.howitworksSection, { backgroundColor: COLORS.sectionBg }]}>
            <View style={styles.badgeWrapper}>
              <Badge style={[styles.badge, { backgroundColor: COLORS.badgeBg }]}>
                <BadgeText style={styles.badgeText}>Process</BadgeText>
              </Badge>
            </View>
            <Heading style={[styles.featuresTitle, { color: COLORS.text }]}>
              How It Works
            </Heading>
            <Text style={[styles.featuresSubtitle, { color: COLORS.secondaryText }]}>
              Three simple steps to start trading skills and expanding your horizons.
            </Text>

            <View style={isSmallScreen ? styles.stepsVertical : styles.stepsHorizontal}>
              {steps.map((step, index) => (
                  <View key={index} style={styles.stepContainer}>
                    <View style={[styles.stepNumberCircle, { backgroundColor: COLORS.accent }]}>
                      <Text style={styles.stepNumber}>{step.number}</Text>
                    </View>
                    <Text style={[styles.stepTitle, { color: COLORS.text }]}>{step.title}</Text>
                    <Text style={[styles.stepDescription, { color: COLORS.secondaryText }]}>
                      {step.description}
                    </Text>
                  </View>
              ))}
            </View>
          </View>
          {/* Pricing */}
          <View style={styles.pricingSection}>
            <View style={styles.badgeWrapper}>
              <Badge style={[styles.badge, { backgroundColor: COLORS.badgeBg }]}>
                <BadgeText style={styles.badgeText}>Membership</BadgeText>
              </Badge>
            </View>
            <Heading style={[styles.featuresTitle, { color: COLORS.text }]}>
              Choose Your Plan
            </Heading>
            <Text style={[styles.featuresSubtitle, { color: COLORS.secondaryText }]}>
              Select the membership that best fits your learning and teaching style.
            </Text>

            <View style={isSmallScreen ? styles.pricingCardsVertical : styles.pricingCardsHorizontal}>
              {/* Plan Gratuito */}
              <View style={[styles.pricingCard, { borderColor: COLORS.borderColor }]}>
                <Text style={styles.planName}>Free</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>$0</Text>
                  <Text style={styles.period}>/month</Text>
                </View>
                <View style={styles.featuresContainer}>
                  <Text style={styles.featureItem}>Up to 3 active skill listings</Text>
                  <Text style={styles.featureItem}>Basic profile customization</Text>
                  <Text style={styles.featureItem}>Standard search visibility</Text>
                  <Text style={styles.featureItem}>Basic messaging</Text>
                </View>
                <Button
                    style={[styles.pricingButton, { backgroundColor: COLORS.accent }]}
                    onPress={() => router.push('/register')}
                >
                  <ButtonText style={styles.pricingButtonText}>Get Started</ButtonText>
                </Button>
              </View>

              {/* Plan Premium */}
              <View style={[styles.pricingCard, styles.popularCard, { borderColor: COLORS.accent }]}>
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>Most Popular</Text>
                </View>
                <Text style={styles.planName}>Premium</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>$9.99</Text>
                  <Text style={styles.period}>/month</Text>
                </View>
                <View style={styles.featuresContainer}>
                  <Text style={styles.featureItem}>Unlimited skill listings</Text>
                  <Text style={styles.featureItem}>Enhanced profile with portfolio</Text>
                  <Text style={styles.featureItem}>Priority in search results</Text>
                  <Text style={styles.featureItem}>Advanced messaging with attachments</Text>
                  <Text style={styles.featureItem}>Verified member badge</Text>
                </View>
                <Button
                    style={[styles.pricingButton, { backgroundColor: COLORS.accent }]}
                    onPress={() => router.push('/register')}
                >
                  <ButtonText style={styles.pricingButtonText}>Upgrade Now</ButtonText>
                </Button>
              </View>

              {/* Plan Pro */}
              <View style={[styles.pricingCard, { borderColor: COLORS.borderColor }]}>
                <Text style={styles.planName}>Pro</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>$19.99</Text>
                  <Text style={styles.period}>/month</Text>
                </View>
                <View style={styles.featuresContainer}>
                  <Text style={styles.featureItem}>Everything in Premium</Text>
                  <Text style={styles.featureItem}>Create group classes (up to 10 people)</Text>
                  <Text style={styles.featureItem}>Featured placement on homepage</Text>
                  <Text style={styles.featureItem}>Analytics dashboard</Text>
                  <Text style={styles.featureItem}>Priority support</Text>
                </View>
                <Button
                    style={[styles.pricingButton, { backgroundColor: COLORS.accent }]}
                    onPress={() => router.push('/register')}
                >
                  <ButtonText style={styles.pricingButtonText}>Go Pro</ButtonText>
                </Button>
              </View>
            </View>
          </View>

          {/* Sección de historias de éxito */}
          <View style={[styles.storiesSection, { backgroundColor: COLORS.sectionBg }]}>
            <View style={styles.badgeWrapper}>
              <Badge style={[styles.badge, { backgroundColor: COLORS.badgeBg }]}>
                <BadgeText style={styles.badgeText}>Success Stories</BadgeText>
              </Badge>
            </View>
            <Heading style={[styles.featuresTitle, { color: COLORS.text }]}>
              Real Skill Exchanges
            </Heading>
            <Text style={[styles.featuresSubtitle, { color: COLORS.secondaryText }]}>
              See how our members are transforming their lives through skill trading.
            </Text>

            <View style={isSmallScreen ? styles.storiesVertical : styles.storiesHorizontal}>
              {successStories.map((story, index) => (
                  <View key={index} style={styles.storyCard}>
                    <Text style={styles.userLabel}>User</Text>
                    <Text style={styles.userName}>{story.name}</Text>
                    <Text style={styles.userRole}>{story.role}</Text>
                    <Text style={styles.userQuote}>"{story.quote}"</Text>
                    <View style={styles.skillBadgesContainer}>
                      {story.skills.map((skill, idx) => (
                          <View key={idx} style={[styles.skillBadge, { backgroundColor: skill.color }]}>
                            <Text style={styles.skillBadgeText}>{skill.name}</Text>
                          </View>
                      ))}
                    </View>
                  </View>
              ))}
            </View>
          </View>

          {/* Sección CTA */}
          <View style={styles.ctaSection}>
            <Heading style={[styles.ctaTitle, { color: COLORS.text }]}>
              Ready to Trade Skills?
            </Heading>
            <Text style={[styles.ctaSubtitle, { color: COLORS.secondaryText }]}>
              Join our community of lifelong learners and start exchanging knowledge today.
            </Text>

            <View style={styles.ctaButtonsContainer}>
              <Button
                  style={[styles.ctaButton, { backgroundColor: COLORS.accent }]}
                  onPress={() => router.push('/register')}
              >
                <ButtonText>Sign Up Now</ButtonText>
              </Button>
              <Button
                  style={[styles.ctaButton, styles.secondaryCtaButton, { borderColor: COLORS.accent }]}
                  onPress={() => router.push('/services')}
              >
                <ButtonText style={{ color: COLORS.accent }}>Browse Skills</ButtonText>
              </Button>
            </View>
          </View>

          {/* Sección de equipo */}
          <View style={[styles.teamSection, { backgroundColor: COLORS.sectionBg }]}>
            <View style={styles.badgeWrapper}>
              <Badge style={[styles.badge, { backgroundColor: COLORS.badgeBg }]}>
                <BadgeText style={styles.badgeText}>The Developers</BadgeText>
              </Badge>
            </View>
            <Heading style={[styles.featuresTitle, { color: COLORS.text }]}>
              Meet The Team
            </Heading>
            <Text style={[styles.featuresSubtitle, { color: COLORS.secondaryText }]}>
              The talented team behind SkillSwap's development and architecture.
            </Text>

            <View style={isSmallScreen ? styles.teamCardsVertical : styles.teamCardsHorizontal}>
              {/* Tarjeta Frontend */}
              <View style={[styles.teamCard, { borderColor: '#3b82f6' }]}>
                <Text style={[styles.teamRole, { color: '#3b82f6' }]}>Frontend Developer</Text>
                <Text style={styles.teamSpecialty}>User Interface & Experience</Text>

                <View style={styles.teamMemberInfo}>
                  <Text style={styles.teamMemberLabel}>Frontend Developer</Text>
                  <Text style={styles.teamMemberName}>You</Text>
                  <Text style={styles.teamMemberTitle}>Frontend Architect</Text>
                </View>

                <View style={styles.teamDetailsContainer}>
                  <Text style={styles.teamSectionTitle}>Technologies</Text>
                  <Text style={styles.teamSectionText}>
                    Next.js, React, Tailwind CSS, TypeScript, and modern frontend practices for responsive, accessible design.
                  </Text>

                  <Text style={[styles.teamSectionTitle, { marginTop: 16 }]}>Responsibilities</Text>
                  <Text style={styles.teamSectionText}>
                    Creating intuitive user interfaces, implementing responsive designs, and ensuring a seamless user experience across all devices.
                  </Text>

                  <View style={styles.techBadgesContainer}>
                    <View style={styles.techBadge}><Text style={styles.techBadgeText}>React</Text></View>
                    <View style={styles.techBadge}><Text style={styles.techBadgeText}>Next.js</Text></View>
                    <View style={styles.techBadge}><Text style={styles.techBadgeText}>Tailwind</Text></View>
                    <View style={styles.techBadge}><Text style={styles.techBadgeText}>TypeScript</Text></View>
                  </View>
                </View>
              </View>

              {/* Tarjeta Backend */}
              <View style={[styles.teamCard, { borderColor: '#ef4444' }]}>
                <Text style={[styles.teamRole, { color: '#ef4444' }]}>Backend Developer</Text>
                <Text style={styles.teamSpecialty}>API & Server Architecture</Text>

                <View style={styles.teamMemberInfo}>
                  <Text style={styles.teamMemberLabel}>Backend Developer</Text>
                  <Text style={styles.teamMemberName}>Lioteronex</Text>
                  <Text style={styles.teamMemberTitle}>Backend Architect</Text>
                </View>

                <View style={styles.teamDetailsContainer}>
                  <Text style={styles.teamSectionTitle}>Technologies</Text>
                  <Text style={styles.teamSectionText}>
                    Node.js, Express, JPA for authentication, PostgreSQL, RESTful API design, and secure data handling practices.
                  </Text>

                  <Text style={[styles.teamSectionTitle, { marginTop: 16 }]}>Responsibilities</Text>
                  <Text style={styles.teamSectionText}>
                    Building robust APIs, implementing secure authentication with JPA, database design, and ensuring efficient communication between users.
                  </Text>

                  <View style={styles.techBadgesContainer}>
                    <View style={styles.techBadge}><Text style={styles.techBadgeText}>Node.js</Text></View>
                    <View style={styles.techBadge}><Text style={styles.techBadgeText}>JPA Auth</Text></View>
                    <View style={styles.techBadge}><Text style={styles.techBadgeText}>PostgreSQL</Text></View>
                    <View style={styles.techBadge}><Text style={styles.techBadgeText}>RESTful API</Text></View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 20
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  loginButton: {
    marginRight: 8
  },
  signupButton: {
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  signupText: {
    color: '#fff'
  },
  introSection: {
    padding: 24
  },
  badgeWrapper: {
    marginBottom: 8
  },
  badge: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeI: {
    alignSelf:'flex-start',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0662f6'
  },
  introTitle: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 12,
  },
  bold: {
    fontWeight: '700',
  },
  introText: {
    fontSize: 18,
    marginBottom: 24,
    lineHeight: 26,
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    marginBottom: 32,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
  },
  introSectionContainer: {
    padding: 24,
    width: '100%',
    borderRadius: 12,
    marginVertical: 20
  },
  introSectionHorizontal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  introSectionVertical: {
    flexDirection: 'column'
  },
  introTextBlock: {
    paddingRight: 16
  },
  cardsBlock: {
    alignItems: 'center'
  },
  cardsOuterContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  cardsInnerContainer: {
    width: '100%',
    maxWidth: 500,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 320,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  cardBlue: {
    borderColor: '#3b82f6',
  },
  cardRed: {
    borderColor: '#ef4444',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardText: {
    fontSize: 14,
    color: '#6b7280',
  },
  iconWrapper: {
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 12,
  },
  iconText: {
    marginTop: 8,
    fontWeight: '500',
    fontSize: 16,
  },
  featuresSection: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 32,
    borderRadius: 12,
  },
  featureBadge: {
    alignSelf: 'center',
    borderWidth: 1,
    marginBottom: 8
  },
  featuresTitle: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8
  },
  featuresSubtitle: {
    textAlign: 'center',
    marginBottom: 16
  },
  featureCardsHorizontal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 16
  },
  featureCardsVertical: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    marginTop: 16
  },
  featureCard: {
    borderWidth: 4,
    borderRadius: 8,
    alignItems: 'center',
    padding: 12,
    flex: 1,
    minWidth: 250,
    maxWidth: 350
  },
  featureCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8
  },
  featureCardText: {
    textAlign: 'center',
    marginTop: 4,
    fontSize: 12
  },
  howitworksSection: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 32,
    borderRadius: 12,
  },
  stepsHorizontal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    flexWrap: 'wrap',
    gap: 16
  },
  stepsVertical: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 24,
    gap: 24
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
    minWidth: 250,
    maxWidth: 320
  },
  stepNumberCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  stepNumber: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },
  stepDescription: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20
  },

    // Estilos para la sección de precios
  pricingSection: {
    marginTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  pricingCardsHorizontal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 24,
  },
  pricingCardsVertical: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 24,
    gap: 24,
  },
  pricingCard: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 2,
    borderRadius: 12,
    padding: 24,
    flex: 1,
    minWidth: 250,
    maxWidth: 320,
    position: 'relative',
  },
  popularCard: {
    borderWidth: 2,
    transform: [{ translateY: -8 }],
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: 0,
    right: 0,
    backgroundColor: COLORS.accent,
    paddingVertical: 4,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignItems: 'center',
  },
  popularText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
    borderWidth: 2
  },
  planName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 8,
    marginBottom: 16,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  period: {
    fontSize: 16,
    color: COLORS.secondaryText,
    marginBottom: 4,
    marginLeft: 2,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureItem: {
    fontSize: 15,
    color: COLORS.secondaryText,
    marginBottom: 8,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.badgeBg,
  },
  pricingButton: {
    width: '100%',
    borderRadius: 2,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pricingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Estilos para la sección de historias
  storiesSection: {
    marginTop: 40,
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  storiesHorizontal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    flexWrap: 'wrap',
    gap: 16,
  },
  storiesVertical: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 24,
    gap: 24,
  },
  storyCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 20,
    flex: 1,
    minWidth: 280,
    maxWidth: 350,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  userLabel: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  userRole: {
    fontSize: 14,
    color: COLORS.secondaryText,
    marginBottom: 12,
  },
  userQuote: {
    fontSize: 15,
    color: COLORS.text,
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 16,
  },
  skillBadgesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  skillBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  skillBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Estilos para la sección CTA
  ctaSection: {
    marginTop: 40,
    paddingHorizontal: 16,
    paddingVertical: 40,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 600,
  },
  ctaButtonsContainer: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    maxWidth: 500,
    justifyContent: 'center',
  },
  ctaButton: {
    minWidth: 180,
    paddingVertical: 12,
    borderRadius: 8,
  },
  secondaryCtaButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },

  // Estilos para la sección de equipo
  teamSection: {
    marginTop: 40,
    paddingHorizontal: 56,
    paddingVertical: 32,
  },
  teamCardsHorizontal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    flexWrap: 'wrap',
    gap: 20,
  },
  teamCardsVertical: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 24,
    gap: 32,
  },
  teamCard: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 2,
    borderRadius: 12,
    padding: 24,
    flex: 1,
    minWidth: 300,
    maxWidth: 500,
  },
  teamRole: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  teamSpecialty: {
    fontSize: 16,
    color: COLORS.secondaryText,
    marginBottom: 24,
  },
  teamMemberInfo: {
    marginBottom: 24,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
    paddingLeft: 12,
  },
  teamMemberLabel: {
    fontSize: 12,
    color: COLORS.secondaryText,
  },
  teamMemberName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  teamMemberTitle: {
    fontSize: 14,
    color: COLORS.secondaryText,
  },
  teamDetailsContainer: {
    backgroundColor: COLORS.sectionBg,
    padding: 16,
    borderRadius: 8,
  },
  teamSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  teamSectionText: {
    fontSize: 14,
    color: COLORS.secondaryText,
    lineHeight: 20,
  },
  techBadgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  techBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  techBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  }
});

