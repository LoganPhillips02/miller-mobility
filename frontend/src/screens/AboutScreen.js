import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Animated,
  Platform,
  Dimensions,
  ScrollView,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import SiteFooter from '../components/SiteFooter';
import { useTabNavigation } from '../navigation/TabNavigationContext';
import { WEB_LAYOUT_BREAKPOINT } from '../constants/webLayout';
import WebContentGutter from '../components/WebContentGutter';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IS_WEB_DESKTOP = Platform.OS === 'web' && SCREEN_WIDTH >= WEB_LAYOUT_BREAKPOINT;

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PAGES = [
  { key: 'about',        label: 'About Us' },
  { key: 'jobs',         label: 'Completed Jobs' },
  { key: 'reviews',      label: 'Reviews' },
  { key: 'media',        label: 'Media' },
  { key: 'blog',         label: 'Blog' },
  { key: 'scootertips',  label: 'Scooter Tips' },
  { key: 'batterytips',  label: 'Battery Tips' },
  { key: 'millermoney',  label: 'Miller Money' },
];

const px = IS_WEB_DESKTOP ? 0 : Spacing.base;

// ─── Review card ──────────────────────────────────────────────────────────────
const ReviewCard = ({ text, name }) => (
  <View style={styles.reviewCard}>
    <Text style={styles.reviewStars}>★★★★★</Text>
    <Text style={styles.reviewText}>"{text}"</Text>
    <Text style={styles.reviewName}>— {name}</Text>
  </View>
);

// ─── About Us page ────────────────────────────────────────────────────────────
const AboutUsPage = ({ switchTab }) => (
  <View>
    <View style={styles.section}>
      <Text style={styles.bodyText}>
        At Miller Mobility, family isn't just part of our story — it's the foundation of everything we do. What began as a small, local operation has grown into a trusted resource for families across southeastern Wisconsin who want safe, reliable mobility solutions they can feel good about.
      </Text>
      <Text style={styles.bodyText}>
        Our roots go back to the 1990s, when <Text style={styles.bold}>Mike Miller</Text> worked for one of our key manufacturers, <Text style={styles.bold}>Bruno</Text>, gaining firsthand experience with mobility equipment and the people who depend on it. That work sparked a passion for helping others, and in <Text style={styles.bold}>2004</Text>, Mike and his wife <Text style={styles.bold}>Val</Text> opened their own mobility company in <Text style={styles.bold}>Waukesha</Text>.
      </Text>
      <Text style={styles.bodyText}>
        Over the years, the business became a true family effort. Val stepped into a central leadership role, and her two kids eventually joined the team as well — bringing new energy while keeping the same values at the heart of the company. In <Text style={styles.bold}>2021</Text>, Miller Mobility moved to <Text style={styles.bold}>Oconomowoc</Text>, where we continue to serve customers with honesty, care, and decades of hands‑on expertise.
      </Text>
      <Text style={styles.bodyText}>
        And if you've ever visited our shop, you already know: our two <Text style={styles.bold}>golden retrievers</Text> are just as much a part of the team as anyone else. They greet customers, brighten days, and remind us that a welcoming environment matters.
      </Text>
      <Text style={styles.bodyText}>
        Today, Miller Mobility remains proudly family‑run, committed to helping people stay independent, comfortable, and confident in their homes. When you work with us, you're not just choosing a product — you're joining a family that truly cares.
      </Text>
    </View>

    <View style={styles.missionBlock}>
      <Text style={styles.blockLabel}>MILLER MOBILITY'S MISSION</Text>
      <Text style={styles.blockText}>
        Our mission at Miller Mobility is to improve the lives of individuals with mobility challenges by providing top-quality mobility equipment, sales, service, installation and exceptional personal service. We are a family-owned business dedicated to ensuring that each person we serve receives the best possible solution for their needs. We strive to make a positive impact on the lives of our customers by providing reliable, safe, and easy-to-use mobility products that improve their independence and quality of life.
      </Text>
    </View>

    <View style={styles.infoCard}>
      <Text style={styles.infoCardTitle}>💳 Ask About Monthly Payments!</Text>
      <Text style={styles.infoCardText}>Need to make payments? We now offer <Text style={styles.bold}>4 equal monthly payments</Text> for a $25.00 service fee!</Text>
    </View>

    <View style={styles.infoCard}>
      <Text style={styles.infoCardTitle}>🔑 Ask About Our Rentals</Text>
      <Text style={styles.infoCardText}>Miller Mobility also provides stairlift, wheelchair, scooter and durable medical equipment rentals! Contact us for details about renting a wheelchair, scooter or other medical equipment.</Text>
      <TouchableOpacity style={styles.infoCardLink} onPress={() => switchTab('Rentals')}>
        <Text style={styles.infoCardLinkText}>View Rentals →</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Service Area</Text>
      <Text style={styles.bodyText}>Serving these counties: Waukesha, Milwaukee, Walworth, Kenosha, Racine, Dane, Sheboygan, Rock, Green, Columbia, Dodge, Fond du Lac, Jefferson, Ozaukee and Sheboygan.</Text>
      <Text style={styles.bodyText}>Major cities include: Milwaukee, Kenosha, Racine, Waukesha, Madison, Green Bay, Sheboygan, Oshkosh, Appleton and Fond du Lac.</Text>
    </View>

    <View style={styles.darkBlock}>
      <Text style={styles.blockLabel}>PREFERRED PROVIDER FOR THESE PROGRAMS</Text>
      <Text style={styles.blockText}>If you're in need of durable medical equipment or mobility aids, these state funded programs — <Text style={styles.boldWhite}>IRIS, CLTS, ILSP, and ADRC</Text> — may be able to help cover the costs if you've had trouble affording them on your own. Our company works with iLife, Wisconsin Department of Health Services (WDHS), and ADRC to make sure you can access the equipment you need.</Text>
      <TouchableOpacity style={styles.ghostBtn} onPress={() => switchTab('ADRC')}>
        <Text style={styles.ghostBtnText}>Learn About the ADRC Program →</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.section}>
      <View style={styles.ctaRow}>
        <TouchableOpacity style={styles.ctaBtn} onPress={() => switchTab('Contact')}>
          <Text style={styles.ctaBtnText}>Contact Us</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.ctaBtn, styles.ctaBtnOutline]} onPress={() => Linking.openURL('tel:+12625494900')}>
          <Text style={[styles.ctaBtnText, styles.ctaBtnOutlineText]}>📞 262-549-4900</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

// ─── Completed Jobs page ──────────────────────────────────────────────────────
const CompletedJobsPage = () => {
  const JOB_TYPES = [
    { label: 'Stairlift Installation', icon: '🪜', count: '18+' },
    { label: 'Wheelchair Ramp Installation', icon: '📐', count: '14+' },
    { label: 'Vertical Platform Lift', icon: '🔼', count: '3+' },
    { label: 'Vehicle Lift', icon: '🚐', count: '7+' },
    { label: 'Patient Lift', icon: '🏥', count: '4+' },
    { label: 'Security Pole', icon: '🔒', count: '3+' },
  ];
  return (
    <View>
      <View style={styles.section}>
        <Text style={styles.bodyText}>
          Miller Mobility installs a wide variety of products to make life safer and more accessible — including wheelchair ramps, patient lifts, stairlifts, security poles, and vehicle lifts. Take a look at some of our recently completed projects below and see how we're helping customers enjoy greater independence every day.
        </Text>
        <Text style={styles.callout}>
          We're here to guide you through making the right decision to fit your needs.{' '}
          Call <Text style={styles.calloutLink} onPress={() => Linking.openURL('tel:+12625494900')}>262-549-4900</Text> today to speak to a product expert!
        </Text>
      </View>

      <View style={styles.jobsGrid}>
        {JOB_TYPES.map(job => (
          <View key={job.label} style={styles.jobCard}>
            <Text style={styles.jobIcon}>{job.icon}</Text>
            <Text style={styles.jobLabel}>{job.label}</Text>
            <View style={styles.jobBadge}><Text style={styles.jobBadgeText}>{job.count} installs</Text></View>
          </View>
        ))}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoCardTitle}>📍 Serving Southeastern Wisconsin</Text>
        <Text style={styles.infoCardText}>
          Counties: Waukesha, Milwaukee, Walworth, Kenosha, Racine, Washington, Dane, Sheboygan, Rock, Green, Columbia, Dodge, Fond du Lac, Jefferson, and Ozaukee.{'\n\n'}
          Major cities: Milwaukee, Kenosha, Racine, Waukesha, Madison, West Bend, Mequon, Green Bay, Sheboygan, Oshkosh, Appleton and Fond du Lac.
        </Text>
      </View>
    </View>
  );
};

// ─── Reviews page ─────────────────────────────────────────────────────────────
const ReviewsPage = () => {
  const REVIEWS = [
    { text: "Yesterday's service exceeded expectations in many ways. Jack was thorough and a total professional in servicing the unit at Highlands at Aero Park.", name: 'Wayne L.' },
    { text: "The staff at Miller Mobility have always been courteous and prompt in their response to my requests. I would recommend their company to anyone that needs any type of mobility products.", name: 'Bob R.' },
    { text: "From start to finish the job was handled professionally and we are very pleased.", name: 'Mary G.' },
    { text: "They have been great, always on time. The stairlift has been great, if we didn't have it we wouldn't be in our home today.", name: 'John A.' },
    { text: "Miller Mobility has helped me with my mobility needs for nearly 10 years from stairlifts to scooters. They have been instrumental in keeping me going. I look forward to calling them in the future for my mobility needs.", name: 'Larry A.' },
    { text: "I have really enjoyed working with Miller Mobility and have purchased most of my medical equipment from them for a number of years. They are really good at focusing on what customers need and require. I have experienced complete transparency from selecting a product, to getting a quote and the job being completed from start to finish. They are a family run business and treat everyone as such.", name: 'Lisa E.' },
    { text: "He does a fantastic job and they are my go to vendor for any needs I have. They are professional, easy to work with, and their prices are great as well. I have been using them for years.", name: 'Meg H.' },
    { text: "I have used him for several different projects. I have used him for a stair-lift and it works great. No problems with him at all, very easy to work with, and he was very professional.", name: 'Arnold W.' },
    { text: "Superb job, most attentive. Cleaned everything up, everything works fine. They were very attentive to her needs.", name: 'Judith M.' },
    { text: "Very courteous, friendly and has the knowledge about the products.", name: 'Jerry D.' },
    { text: "I have used Mike Miller multiple times. Great service and top notch quality work.", name: 'Dick S.' },
    { text: "The service is excellent, great follow up, very professional and always on time.", name: 'Sue F.' },
    { text: "He is great, excellent customer service, very helpful, always there when I need him.", name: 'Kathleen R.' },
    { text: "Mike is very thorough, they understand what you are doing, he has great ideas and answers for what needs to be done. Very professional and on time.", name: 'Christina S.' },
    { text: "We found them to be extremely professional, great follow-through with what we wanted. Promptly brought over products to install, exceeded my expectations, and went above and beyond what I needed.", name: 'Tom L.' },
    { text: "Just a \"thank you\" for being so helpful when we came to purchase a walker for me. I am very happy with it! So much easier than the one I was using! We certainly will come back if we need anything else in the future.", name: 'Dave & Darlene S.' },
    { text: "Having a stairlift is a lifesaver to keep people in their homes! Without Miller Mobility, we wouldn't be able to stay in our home.", name: 'Susan B.' },
  ];
  return (
    <View>
      <View style={styles.section}>
        <Text style={styles.bodyText}>
          At Miller Mobility Products, we're committed to delivering the very best in customer support — whether it's sales, service, installation, or rentals. From ramps and wheelchairs to scooters, stairlifts, and lift chairs, we'll help you find the right mobility solution for your needs.
        </Text>
        <Text style={styles.callout}>
          Call <Text style={styles.calloutLink} onPress={() => Linking.openURL('tel:+12625494900')}>262-549-4900</Text> today to speak to a product expert!
        </Text>
      </View>

      <View style={styles.missionBlock}>
        <Text style={styles.blockLabel}>LEAVE US A REVIEW</Text>
        <Text style={styles.blockText}>Do you want to leave us a review? We'd love to hear from you!</Text>
        <View style={styles.reviewLinksRow}>
          {[
            { label: '⭐ Google', url: 'https://g.page/r/CSOCs_z3FnaoEB0/review' },
            { label: '👍 Facebook', url: 'https://www.facebook.com/millermobility/' },
            { label: '🏆 BBB', url: 'https://www.bbb.org/us/wi/oconomowoc/profile/wheelchair-ramps/miller-mobility-products-0694-17001935' },
          ].map(l => (
            <TouchableOpacity key={l.label} style={styles.ghostBtn} onPress={() => Linking.openURL(l.url)}>
              <Text style={styles.ghostBtnText}>{l.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        {REVIEWS.map((r, i) => <ReviewCard key={i} text={r.text} name={r.name} />)}
      </View>
    </View>
  );
};

// ─── Media Page ───────────────────────────────────────────────────────────────
const MediaPage = () => {
  return (
    <View>  
    </View>
  );
};

// ─── Blog Page ────────────────────────────────────────────────────────────────
const BlogPage = () => {
  return (
    <View>  
    </View>
  );
};

// ─── Scooter Tips page ────────────────────────────────────────────────────────
const ScooterTipsPage = () => {
  const STEPS = [
    { n: '1', title: 'Remove the Basket / Accessories', text: 'Start by removing any baskets, bags, or accessories attached to the front tiller. These typically lift or unclip easily.' },
    { n: '2', title: 'Disconnect the Battery', text: 'Turn the key to the OFF position and remove the battery pack. On most models this slides or lifts out from under the seat. Store the battery separately for travel.' },
    { n: '3', title: 'Remove the Seat', text: 'Lift the seat straight up — it usually pops off the seat post with gentle upward pressure. On some models a lever or twist-lock must be released first.' },
    { n: '4', title: 'Separate the Tiller', text: 'Fold or remove the tiller (handlebar column). Many models have a quick-release lever at the base. Fold the tiller down flat or detach completely.' },
    { n: '5', title: 'Split the Body', text: 'Most travel scooters split into front and rear halves. Locate the center latch or release button and pull the two halves apart. Each half typically weighs approximately 20–30 lbs.' },
    { n: '6', title: 'Load into Vehicle', text: 'Load each piece separately into your vehicle — typically the trunk of a car or backseat. Lay pieces flat and avoid stacking heavy items on top.' },
    { n: '7', title: 'Reassembly', text: 'Reverse the steps: connect the two body halves until the latch clicks, reattach the tiller, place the seat back on the post, re-insert the battery, and attach accessories. Turn the key and test the controls before use.' },
  ];
  return (
    <View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Taking Apart and Putting Back Together Your Scooter</Text>
        <Text style={styles.bodyText}>Knowing how to safely disassemble and reassemble your scooter is essential for transporting it in a vehicle or storing it at home. Follow these steps for the most common travel scooter models.</Text>
      </View>
      {STEPS.map(s => (
        <View key={s.n} style={styles.stepCard}>
          <View style={styles.stepNum}><Text style={styles.stepNumText}>{s.n}</Text></View>
          <View style={styles.stepBody}>
            <Text style={styles.stepTitle}>{s.title}</Text>
            <Text style={styles.stepText}>{s.text}</Text>
          </View>
        </View>
      ))}
      <View style={styles.infoCard}>
        <Text style={styles.infoCardTitle}>💡 Pro Tips</Text>
        <Text style={styles.infoCardText}>
          • Practice disassembling at home before you need to do it in a parking lot.{'\n'}
          • Keep a small cloth to wipe down pieces before reassembly.{'\n'}
          • If a connection feels stiff, check for debris — never force it.{'\n'}
          • Questions? Call us at 262-549-4900 and we can walk you through it.
        </Text>
      </View>
      <TouchableOpacity style={[styles.ctaBtn, { marginHorizontal: px, marginBottom: Spacing.xl }]} onPress={() => Linking.openURL('tel:+12625494900')}>
        <Text style={styles.ctaBtnText}>📞 Call 262-549-4900 for Help</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Battery Tips page ────────────────────────────────────────────────────────
const BatteryTipsPage = () => {
  const TIPS = [
    { icon: '🔋', title: 'Charge Regularly', text: 'Top off your battery after each use, even if you only went a short distance. Most mobility batteries perform best when kept charged rather than run down.' },
    { icon: '🚫', title: 'Avoid Full Discharge', text: 'Try not to let your battery run completely flat. Running a battery all the way down repeatedly can shorten its lifespan significantly.' },
    { icon: '🌡️', title: 'Store at Moderate Temperature', text: 'Store your equipment in a dry place at a moderate temperature. Extreme cold or heat — like an unheated garage in Wisconsin winters — is hard on batteries.' },
    { icon: '📅', title: 'Long-Term Storage', text: "If you won't be using your scooter or power chair for a while, give the battery a full charge every couple of weeks to keep it healthy and prevent deep discharge." },
    { icon: '🔌', title: 'Use the Right Charger', text: 'Always use the charger that came with your device or one specifically approved for your battery type. Using the wrong charger can damage the battery or create a safety hazard.' },
    { icon: '🧹', title: 'Keep Contacts Clean', text: 'Occasionally check the battery contacts for corrosion or debris and wipe them clean with a dry cloth. Good contact ensures efficient charging.' },
    { icon: '🛠️', title: 'Watch for Warning Signs', text: "If your battery no longer holds a charge, takes longer to charge, or your range has decreased noticeably, it may be time for a replacement. Call us to order the right battery for your model." },
  ];
  return (
    <View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tips for Longer Battery Life</Text>
        <Text style={styles.bodyText}>To get the longest life and best performance from your mobility battery, follow these guidelines. Proper care can significantly extend the life of your battery and keep your equipment running reliably.</Text>
      </View>
      {TIPS.map(tip => (
        <View key={tip.title} style={styles.tipCard}>
          <Text style={styles.tipIcon}>{tip.icon}</Text>
          <View style={styles.tipBody}>
            <Text style={styles.stepTitle}>{tip.title}</Text>
            <Text style={styles.stepText}>{tip.text}</Text>
          </View>
        </View>
      ))}
      <TouchableOpacity style={[styles.ctaBtn, { marginHorizontal: px, marginBottom: Spacing.xl }]} onPress={() => Linking.openURL('tel:+12625494900')}>
        <Text style={styles.ctaBtnText}>📞 Need a New Battery? Call 262-549-4900</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Miller Money page ────────────────────────────────────────────────────────
const MillerMoneyPage = () => {
  const SECTIONS = [
    {
      title: '✅ Eligibility',
      items: [
        'Offer valid only for enrolled customers in our rewards or customer tracking program at the time of purchase.',
        'Purchases made by non-enrolled or guest customers are not eligible.',
        'Only one coupon may be issued per eligible transaction.',
        'Coupon will be issued automatically or delivered via email after a qualifying purchase.',
      ],
    },
    {
      title: '🎟️ Redemption Rules',
      items: [
        'Coupon is redeemable in person only and must be physically presented at time of purchase.',
        'The coupon is nontransferable, nonrefundable, and has no cash value.',
        'Cannot be redeemed for cash or applied to previous purchases.',
        'Coupon is not valid with any other discounts, promotions, or offers.',
        'Valid only within the specific date range printed on the coupon.',
        'Lost, damaged, or expired coupons will not be reissued.',
        'Coupons are issued in $10 increments only. No change or credit will be issued for unused balances.',
        'Duplicating or altering coupons voids redemption.',
        'Miller Money cannot be used to adjust the price of previous purchases.',
        'Minimum purchase of $800 (pre-tax, after any other applicable adjustments) is required to redeem the coupon.',
      ],
    },
    {
      title: '↩️ Returns & Adjustments',
      items: [
        'If the purchase that earned the coupon is returned in full, the coupon will be voided and no longer valid.',
        'If the purchase is partially returned, the coupon value may be adjusted or reduced based on the revised eligible transaction amount.',
        'If the coupon has already been redeemed and the return disqualifies the original transaction, the redeemed value will be deducted from your refund.',
        'If you return items purchased using the coupon, only the amount paid out-of-pocket (after the coupon) will be refunded. The coupon value will not be reinstated, refunded, or reissued.',
      ],
    },
    {
      title: '📋 Additional Terms',
      items: [
        'We reserve the right to modify, suspend, or cancel the coupon program at any time without notice.',
        'Misuse of this offer, including unauthorized reproduction or transfer, may result in disqualification from future promotional offers.',
        'Miller Money is not legal tender.',
      ],
    },
  ];
  return (
    <View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Miller Money Overview</Text>
        <Text style={styles.bodyText}>
          Customers enrolled in our rewards program who complete a qualifying purchase will receive <Text style={styles.bold}>a coupon equal to $10 for every $100 spent, issued in $10 increments only</Text> (maximum coupon value: $500), <Text style={styles.bold}>minimum purchase of $800 required</Text>, redeemable toward a future in-store purchase. The coupon activates <Text style={styles.bold}>7 days after the original purchase</Text> and is valid for a <Text style={styles.bold}>14-day redemption window.</Text>
        </Text>
        <View style={styles.exampleBox}>
          <Text style={styles.exampleTitle}>Example</Text>
          <Text style={styles.exampleText}>A $248 qualifying purchase would yield a $20 coupon. A $389 purchase would yield a $30 coupon. No partial or prorated values are issued. It can only be used on a purchase $800 or more.</Text>
        </View>
      </View>
      {SECTIONS.map(sec => (
        <View key={sec.title} style={[styles.infoCard, { marginBottom: Spacing.md }]}>
          <Text style={styles.infoCardTitle}>{sec.title}</Text>
          {sec.items.map((item, i) => (
            <View key={i} style={styles.mmRow}>
              <Text style={styles.mmDot}>•</Text>
              <Text style={styles.mmText}>{item}</Text>
            </View>
          ))}
        </View>
      ))}
      <TouchableOpacity style={[styles.ctaBtn, { marginHorizontal: px, marginBottom: Spacing.xl }]} onPress={() => Linking.openURL('tel:+12625494900')}>
        <Text style={styles.ctaBtnText}>📞 Ask About Miller Money: 262-549-4900</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const HERO_TITLES = {
  about:        'About Us',
  jobs:         'Completed Jobs',
  reviews:      'Client Reviews',
  media:        'In the Media',
  blog:         'From the Blog',
  scootertips:  'Scooter Tips',
  batterytips:  'Battery Tips',
  millermoney:  'Miller Money',
};

const AboutScreen = () => {
  const { switchTab, scrollY } = useTabNavigation();
  const [activePage, setActivePage] = useState('about');

  const renderPage = () => {
    switch (activePage) {
      case 'about':       return <AboutUsPage switchTab={switchTab} />;
      case 'jobs':        return <CompletedJobsPage />;
      case 'reviews':     return <ReviewsPage />;
      case 'media':       return <MediaPage />;
      case 'blog':        return <BlogPage />;
      case 'scootertips': return <ScooterTipsPage />;
      case 'batterytips': return <BatteryTipsPage />;
      case 'millermoney': return <MillerMoneyPage />;
      default:            return null;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTag}>FAMILY OWNED SINCE 2004</Text>
        <Text style={styles.heroTitle}>{HERO_TITLES[activePage]}</Text>
      </View>

      {/* Horizontal sub-nav */}
      <View style={styles.subNavWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subNavContent}>
          {PAGES.map(page => (
            <TouchableOpacity
              key={page.key}
              style={[styles.subNavTab, activePage === page.key && styles.subNavTabActive]}
              onPress={() => setActivePage(page.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.subNavLabel, activePage === page.key && styles.subNavLabelActive]}>
                {page.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <WebContentGutter>
          <View style={styles.pageContent}>{renderPage()}</View>
        </WebContentGutter>
        <SiteFooter onTabPress={switchTab} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  hero: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.base, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  heroTag: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.bold, color: 'rgba(255,255,255,0.6)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: Spacing.xs },
  heroTitle: { fontSize: Typography.sizes['2xl'], fontWeight: Typography.weights.heavy, color: Colors.white },

  subNavWrapper: { backgroundColor: Colors.primary, borderBottomWidth: 2, borderBottomColor: 'rgba(255,255,255,0.15)' },
  subNavContent: { paddingHorizontal: Spacing.sm, gap: 4 },
  subNavTab: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 2, borderBottomWidth: 3, borderBottomColor: 'transparent', marginHorizontal: 2 },
  subNavTabActive: { borderBottomColor: Colors.white },
  subNavLabel: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.medium, color: 'rgba(255,255,255,0.65)' },
  subNavLabelActive: { color: Colors.white, fontWeight: Typography.weights.bold },

  pageContent: { paddingBottom: Spacing['2xl'] },

  section: { paddingTop: Spacing.xl, paddingBottom: Spacing.base, paddingHorizontal: px },
  sectionTitle: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.heavy, color: Colors.black, marginBottom: Spacing.md },
  bodyText: { fontSize: Typography.sizes.base, color: Colors.gray600, lineHeight: Typography.sizes.base * 1.7, marginBottom: Spacing.md },
  bold: { fontWeight: Typography.weights.bold, color: Colors.black },

  callout: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.black, lineHeight: Typography.sizes.base * 1.5, marginTop: Spacing.sm },
  calloutLink: { color: Colors.primary, textDecorationLine: 'underline' },

  missionBlock: { marginHorizontal: px, marginBottom: Spacing.base, backgroundColor: Colors.primary, borderRadius: Radius.xl, padding: Spacing.lg },
  darkBlock: { marginHorizontal: px, marginBottom: Spacing.base, backgroundColor: Colors.primaryDark ?? '#001F3F', borderRadius: Radius.xl, padding: Spacing.lg },
  blockLabel: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.heavy, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: Spacing.sm },
  blockText: { fontSize: Typography.sizes.sm, color: 'rgba(255,255,255,0.85)', lineHeight: Typography.sizes.sm * 1.65, marginBottom: Spacing.md },
  boldWhite: { fontWeight: Typography.weights.bold, color: Colors.white },

  ghostBtn: { backgroundColor: 'rgba(255,255,255,0.15)', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: Radius.full, alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', marginRight: Spacing.sm, marginBottom: Spacing.sm },
  ghostBtnText: { color: Colors.white, fontWeight: Typography.weights.bold, fontSize: Typography.sizes.sm },

  infoCard: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border, marginHorizontal: px, marginBottom: Spacing.base, ...Shadows.sm },
  infoCardTitle: { fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: Colors.black, marginBottom: Spacing.sm },
  infoCardText: { fontSize: Typography.sizes.sm, color: Colors.gray600, lineHeight: Typography.sizes.sm * 1.6 },
  infoCardLink: { marginTop: Spacing.md },
  infoCardLinkText: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.primary },

  ctaRow: { flexDirection: 'row', gap: Spacing.md, flexWrap: 'wrap' },
  ctaBtn: { backgroundColor: Colors.primary, paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, borderRadius: Radius.full, alignItems: 'center' },
  ctaBtnText: { color: Colors.white, fontWeight: Typography.weights.bold, fontSize: Typography.sizes.base },
  ctaBtnOutline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: Colors.primary },
  ctaBtnOutlineText: { color: Colors.primary },

  jobsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: px, gap: Spacing.md, marginBottom: Spacing.base },
  jobCard: { width: IS_WEB_DESKTOP ? '30%' : '46%', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, ...Shadows.sm, minWidth: 130 },
  jobIcon: { fontSize: 36, marginBottom: Spacing.sm },
  jobLabel: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.black, textAlign: 'center', marginBottom: Spacing.xs },
  jobBadge: { backgroundColor: Colors.primaryLight, borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 2 },
  jobBadgeText: { fontSize: Typography.sizes.xs, color: Colors.white, fontWeight: Typography.weights.bold },

  reviewLinksRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: Spacing.sm },
  reviewCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border, ...Shadows.sm },
  reviewStars: { fontSize: 16, color: '#F59E0B', marginBottom: Spacing.xs },
  reviewText: { fontSize: Typography.sizes.sm, color: Colors.gray600, lineHeight: Typography.sizes.sm * 1.6, fontStyle: 'italic', marginBottom: Spacing.sm },
  reviewName: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.black },

  stepCard: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, marginHorizontal: px, marginBottom: Spacing.md, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, ...Shadows.sm },
  stepNum: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 },
  stepNumText: { color: Colors.white, fontWeight: Typography.weights.heavy, fontSize: Typography.sizes.sm },
  stepBody: { flex: 1 },
  stepTitle: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.black, marginBottom: Spacing.xs },
  stepText: { fontSize: Typography.sizes.sm, color: Colors.gray600, lineHeight: Typography.sizes.sm * 1.55 },

  tipCard: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, marginHorizontal: px, marginBottom: Spacing.md, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, ...Shadows.sm },
  tipIcon: { fontSize: 28, marginTop: 2 },
  tipBody: { flex: 1 },

  exampleBox: { backgroundColor: '#EFF6FF', borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: '#BFDBFE', marginBottom: Spacing.md },
  exampleTitle: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.primary, marginBottom: Spacing.xs },
  exampleText: { fontSize: Typography.sizes.sm, color: Colors.gray600, lineHeight: Typography.sizes.sm * 1.55 },

  mmRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, marginBottom: Spacing.sm },
  mmDot: { color: Colors.primary, fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, width: 14 },
  mmText: { flex: 1, fontSize: Typography.sizes.sm, color: Colors.gray600, lineHeight: Typography.sizes.sm * 1.55 },
});

export default AboutScreen;