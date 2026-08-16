import React, { useState } from 'react';
import { UserProfile, TabType } from '../types';
import { Calendar, Users, Settings, HelpCircle, ChevronRight, Sparkles } from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  onNavigateTab: (tab: TabType) => void;
  onOpenAddCredits: () => void;
  onOpenReferral: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onNavigateTab,
  onOpenAddCredits,
  onOpenReferral,
}) => {
  const [activeModal, setActiveModal] = useState<'friends' | 'family' | 'settings' | 'help' | null>(null);
  const [familyList, setFamilyList] = useState(user.familyMembers);
  const [newKidName, setNewKidName] = useState('');
  const [newKidAge, setNewKidAge] = useState('8');

  const handleAddFamilyMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKidName.trim()) return;
    setFamilyList((prev) => [
      ...prev,
      {
        id: `fam_${Date.now()}`,
        name: newKidName,
        age: parseInt(newKidAge) || 8,
        relation: 'Child',
      },
    ]);
    setNewKidName('');
  };

  return (
    <div className="space-y-6 pb-24 pt-2 max-w-md mx-auto">
      {/* Profile Header */}
      <section className="flex flex-col items-center text-center space-y-3">
        <div className="relative w-24 h-24">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-full h-full rounded-full object-cover shadow-xs border-2 border-[#edeef0]"
          />
          <span className="absolute bottom-0 right-0 w-6 h-6 bg-[#0042c8] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs">
            ✓
          </span>
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-[#191c1e] tracking-tight">{user.name}</h1>
          <p className="text-xs font-semibold text-[#434656] mt-0.5">{user.membership}</p>
        </div>
      </section>

      {/* Credits Card */}
      <section className="bg-white rounded-xl p-6 border border-[#c3c5d9]/30 relative overflow-hidden shadow-xs space-y-4">
        <div className="absolute inset-0 bg-gradient-to-br from-[#dce1ff] via-white to-white opacity-60 z-0 pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-xs font-bold text-[#434656] uppercase tracking-wider mb-2">
            AVAILABLE BALANCE
          </h2>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-extrabold text-[#0042c8] tracking-tight">
              {user.credits}
            </span>
            <span className="text-base font-semibold text-[#0042c8] pb-1">credits</span>
          </div>
          <p className="text-xs text-[#6B7280] mt-1.5 font-medium">
            Renews on {user.renewalDate}
          </p>

          <div className="mt-5">
            <button
              onClick={onOpenAddCredits}
              className="w-full bg-[#0042c8] text-white font-bold text-sm py-3 rounded-full hover:bg-[#003ab2] active:scale-95 transition-all shadow-xs"
            >
              Add Credits
            </button>
          </div>
        </div>
      </section>

      {/* Menu List */}
      <section className="flex flex-col gap-2">
        <button
          onClick={() => onNavigateTab('upcoming')}
          className="flex items-center justify-between p-4 bg-white rounded-lg border border-[#c3c5d9]/20 hover:bg-[#f3f4f6] transition-colors group cursor-pointer text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#edeef0] flex items-center justify-center text-[#44617b] group-hover:text-[#0042c8]">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-[#191c1e] group-hover:text-[#0042c8] transition-colors">
              My Classes
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-[#434656]" />
        </button>

        <button
          onClick={() => setActiveModal('friends')}
          className="flex items-center justify-between p-4 bg-white rounded-lg border border-[#c3c5d9]/20 hover:bg-[#f3f4f6] transition-colors group cursor-pointer text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#edeef0] flex items-center justify-center text-[#44617b] group-hover:text-[#0042c8]">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-[#191c1e] group-hover:text-[#0042c8] transition-colors">
              Friends & Referrals
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-[#434656]" />
        </button>

        <button
          onClick={() => setActiveModal('family')}
          className="flex items-center justify-between p-4 bg-white rounded-lg border border-[#c3c5d9]/20 hover:bg-[#f3f4f6] transition-colors group cursor-pointer text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#e8f1ff] flex items-center justify-center text-[#0042c8]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-semibold text-[#191c1e] group-hover:text-[#0042c8] transition-colors block">
                Family & Kids Profiles
              </span>
              <span className="text-[11px] text-[#434656]">Book kids enrichment classes</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#434656]" />
        </button>

        <button
          onClick={() => setActiveModal('settings')}
          className="flex items-center justify-between p-4 bg-white rounded-lg border border-[#c3c5d9]/20 hover:bg-[#f3f4f6] transition-colors group cursor-pointer text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#edeef0] flex items-center justify-center text-[#44617b] group-hover:text-[#0042c8]">
              <Settings className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-[#191c1e] group-hover:text-[#0042c8] transition-colors">
              Settings
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-[#434656]" />
        </button>

        <button
          onClick={() => setActiveModal('help')}
          className="flex items-center justify-between p-4 bg-white rounded-lg border border-[#c3c5d9]/20 hover:bg-[#f3f4f6] transition-colors group cursor-pointer text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#edeef0] flex items-center justify-center text-[#44617b] group-hover:text-[#0042c8]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-[#191c1e] group-hover:text-[#0042c8] transition-colors">
              Help Center
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-[#434656]" />
        </button>
      </section>

      {/* MODALS */}
      {activeModal === 'friends' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-[#191c1e]">Friends & Referrals</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[#434656] text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#434656]">
              See what classes your friends are attending or invite friends to earn SGD 20 bonus credits!
            </p>
            <div className="bg-[#f8f9fb] p-3 rounded-lg border border-[#c3c5d9]/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#191c1e]">Sarah Tan</span>
                <span className="text-[#0042c8] font-bold">Booked Align Pilates</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#191c1e]">David Chen</span>
                <span className="text-[#0042c8] font-bold">Booked STRONG Pilates</span>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveModal(null);
                onOpenReferral();
              }}
              className="w-full bg-[#0042c8] text-white font-bold text-xs py-2.5 rounded-full hover:bg-[#003ab2]"
            >
              Share Referral Link (Get $20)
            </button>
          </div>
        </div>
      )}

      {activeModal === 'family' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-[#191c1e]">Family & Kids Profiles</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[#434656] text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#434656]">
              Add your children or family dependents to easily reserve Robotics, Coding, or Art enrichment classes!
            </p>

            <div className="space-y-2">
              {familyList.map((member) => (
                <div
                  key={member.id}
                  className="p-3 bg-[#f8f9fb] rounded-lg border border-[#c3c5d9]/30 flex justify-between items-center"
                >
                  <div>
                    <p className="text-xs font-bold text-[#191c1e]">{member.name}</p>
                    <p className="text-[11px] text-[#434656]">{member.relation} • Age {member.age}</p>
                  </div>
                  <span className="text-[10px] bg-[#e8f1ff] text-[#0042c8] font-bold px-2 py-0.5 rounded-full">
                    Enrichment Ready
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddFamilyMember} className="space-y-2 pt-2 border-t border-[#c3c5d9]/30">
              <label className="text-xs font-bold text-[#191c1e] block">Add Child / Dependent</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Child's Name"
                  value={newKidName}
                  onChange={(e) => setNewKidName(e.target.value)}
                  className="flex-1 text-xs p-2 rounded-md border border-[#c3c5d9] focus:ring-1 focus:ring-[#0042c8]"
                />
                <input
                  type="number"
                  placeholder="Age"
                  value={newKidAge}
                  onChange={(e) => setNewKidAge(e.target.value)}
                  className="w-16 text-xs p-2 rounded-md border border-[#c3c5d9] focus:ring-1 focus:ring-[#0042c8]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#0042c8] text-white text-xs font-bold py-2 rounded-lg hover:bg-[#003ab2]"
              >
                + Add Member
              </button>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'settings' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-[#191c1e]">Account Settings</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[#434656] text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-xs text-[#191c1e]">
              <div className="flex justify-between items-center p-2.5 bg-[#f8f9fb] rounded-lg">
                <span>Class Reminder Push Notifications</span>
                <input type="checkbox" defaultChecked className="accent-[#0042c8]" />
              </div>
              <div className="flex justify-between items-center p-2.5 bg-[#f8f9fb] rounded-lg">
                <span>Location Services (Singapore)</span>
                <span className="font-bold text-[#0042c8]">Orchard</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-[#f8f9fb] rounded-lg">
                <span>Payment Method</span>
                <span className="font-semibold text-[#434656]">Visa ending in 8842</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'help' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-[#191c1e]">Happy Parents Help Center</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[#434656] text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-xs text-[#434656]">
              <p className="font-bold text-[#191c1e]">Frequently Asked Questions</p>
              <details className="bg-[#f8f9fb] p-2.5 rounded-lg border border-[#c3c5d9]/30">
                <summary className="font-semibold text-[#191c1e] cursor-pointer">
                  How do class cancellations work?
                </summary>
                <p className="mt-1">
                  Cancel up to 12 hours prior for 100% credit refund instantly back to your balance.
                </p>
              </details>
              <details className="bg-[#f8f9fb] p-2.5 rounded-lg border border-[#c3c5d9]/30">
                <summary className="font-semibold text-[#191c1e] cursor-pointer">
                  Can I book classes for my kids?
                </summary>
                <p className="mt-1">
                  Yes! Select your child in Family Profiles when reserving robotics or coding classes.
                </p>
              </details>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
