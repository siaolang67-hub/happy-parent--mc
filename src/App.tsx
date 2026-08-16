import React, { useState } from 'react';
import { TabType, UserProfile, Studio, ClassSession, Booking, CategoryType } from './types';
import { initialUserProfile, mockStudios, initialBookings } from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { SearchView } from './components/SearchView';
import { CreditsView } from './components/CreditsView';
import { UpcomingView } from './components/UpcomingView';
import { ProfileView } from './components/ProfileView';
import { StudioModal } from './components/StudioModal';
import { BookingModal } from './components/BookingModal';
import { ReferralModal } from './components/ReferralModal';
import { ReviewsModal } from './components/ReviewsModal';
import { Review } from './types';
import { CheckCircle2, Sparkles } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [studios, setStudios] = useState<Studio[]>(mockStudios);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');

  // Modal states
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [selectedReviewsStudio, setSelectedReviewsStudio] = useState<Studio | null>(null);
  const [selectedClassForBooking, setSelectedClassForBooking] = useState<ClassSession | null>(null);
  const [isReferralOpen, setIsReferralOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const handleToggleFavorite = (studioId: string) => {
    setFavorites((prev) => {
      const isFav = !prev[studioId];
      if (isFav) {
        showToast('❤️ Saved to your favorite studios!');
      }
      return { ...prev, [studioId]: isFav };
    });
  };

  const handleAddReview = (studioId: string, newReviewData: Omit<Review, 'id' | 'studioId' | 'date'>) => {
    const newReview: Review = {
      id: `rev_${Date.now()}`,
      studioId,
      ...newReviewData,
      date: 'Just now',
    };

    setStudios((prevStudios) =>
      prevStudios.map((studio) => {
        if (studio.id !== studioId) return studio;
        const currentReviews = studio.reviews || [];
        const updatedReviews = [newReview, ...currentReviews];
        const newReviewCount = (studio.reviewCount || 0) + 1;

        // Calculate weighted average rating score
        const sumRatings = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
        const avg = (sumRatings / updatedReviews.length).toFixed(1);

        const updatedStudio: Studio = {
          ...studio,
          reviews: updatedReviews,
          reviewCount: newReviewCount,
          rating: parseFloat(avg),
        };

        if (selectedReviewsStudio?.id === studioId) {
          setSelectedReviewsStudio(updatedStudio);
        }

        return updatedStudio;
      })
    );

    showToast('🌟 Thank you! Your parent review has been published.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Actions
  const handleAddCredits = (amount: number, packageName: string) => {
    setUser((prev) => ({ ...prev, credits: prev.credits + amount }));
    showToast(`🎉 Success! Added +${amount} credits to your balance (${packageName}).`);
  };

  const handleConfirmBooking = (session: ClassSession, bookedFor: string) => {
    if (user.credits < session.credits) return;

    // Deduct credits
    setUser((prev) => ({ ...prev, credits: prev.credits - session.credits }));

    // Create new booking record
    const newBooking: Booking = {
      id: `bk_${Date.now()}`,
      classSession: session,
      bookedAt: new Date().toISOString(),
      status: 'confirmed',
      bookedFor,
    };

    setBookings((prev) => [newBooking, ...prev]);
    setSelectedClassForBooking(null);
    showToast(`✓ Booked ${session.title} at ${session.studioName} for ${bookedFor}!`);
  };

  const handleCancelBooking = (bookingId: string) => {
    const bookingToCancel = bookings.find((b) => b.id === bookingId);
    if (!bookingToCancel) return;

    // Refund credits
    setUser((prev) => ({
      ...prev,
      credits: prev.credits + bookingToCancel.classSession.credits,
    }));

    // Update booking status
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );

    showToast(`✓ Booking cancelled. ${bookingToCancel.classSession.credits} credits refunded.`);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#191c1e] font-sans antialiased selection:bg-[#0042c8]/20">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        user={user}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenNotifications={() => showToast('🔔 No new notifications')}
      />

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto px-5 pt-20 md:pt-28 pb-20">
        {currentTab === 'home' && (
          <HomeView
            recommendedStudios={studios}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectStudio={(studio) => setSelectedStudio(studio)}
            onBookClass={(cls) => setSelectedClassForBooking(cls)}
            onOpenReferral={() => setIsReferralOpen(true)}
            onNavigateSearch={() => setCurrentTab('search')}
            onOpenReviews={(studio) => setSelectedReviewsStudio(studio)}
          />
        )}

        {currentTab === 'search' && (
          <SearchView
            studios={studios}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectStudio={(studio) => setSelectedStudio(studio)}
            onBookClass={(cls) => setSelectedClassForBooking(cls)}
            onOpenReviews={(studio) => setSelectedReviewsStudio(studio)}
          />
        )}

        {currentTab === 'credits' && (
          <CreditsView user={user} onAddCredits={handleAddCredits} />
        )}

        {currentTab === 'upcoming' && (
          <UpcomingView
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
            onNavigateSearch={() => setCurrentTab('search')}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            user={user}
            onNavigateTab={setCurrentTab}
            onOpenAddCredits={() => setCurrentTab('credits')}
            onOpenReferral={() => setIsReferralOpen(true)}
          />
        )}
      </main>

      {/* Bottom Sticky Navigation (Mobile) */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        credits={user.credits}
      />

      {/* Modals & Dialogs */}
      <StudioModal
        studio={selectedStudio}
        onClose={() => setSelectedStudio(null)}
        onBookClass={(session) => {
          setSelectedStudio(null);
          setSelectedClassForBooking(session);
        }}
        onOpenReviews={(studio) => setSelectedReviewsStudio(studio)}
      />

      <ReviewsModal
        studio={selectedReviewsStudio}
        onClose={() => setSelectedReviewsStudio(null)}
        onAddReview={handleAddReview}
        currentUserName={user.name}
      />

      <BookingModal
        session={selectedClassForBooking}
        user={user}
        onClose={() => setSelectedClassForBooking(null)}
        onConfirmBooking={handleConfirmBooking}
        onOpenAddCredits={() => {
          setSelectedClassForBooking(null);
          setCurrentTab('credits');
        }}
      />

      <ReferralModal
        isOpen={isReferralOpen}
        onClose={() => setIsReferralOpen(false)}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-[#191c1e] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-white/10 animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
