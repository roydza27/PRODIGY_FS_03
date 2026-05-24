import AccountProfileHeader from "../components/account-profile/AccountProfileHeader";
import ProfileFormCard from "../components/account-profile/ProfileFormCard";
import AccountOverviewCard from "../components/account-profile/AccountOverviewCard";
import { accountProfileData } from "../constants/account-profile.constants";

export default function AccountProfilePage() {
  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <AccountProfileHeader />

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <ProfileFormCard
            profile={{
              fullName: accountProfileData.fullName,
              email: accountProfileData.email,
              phone: accountProfileData.phone,
              location: accountProfileData.location,
            }}
          />

          <AccountOverviewCard
            status={accountProfileData.status}
            memberSince={accountProfileData.memberSince}
            ordersPlaced={accountProfileData.ordersPlaced}
          />
        </div>
      </div>
    </div>
  );
}