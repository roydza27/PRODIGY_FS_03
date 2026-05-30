import { Camera } from "lucide-react"; // Added missing icons
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator"; // ADDED IMPORT
import ProfileFormField from "./ProfileFormField";
import ProfileActions from "./ProfileActions";

type Props = {
  profile: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
  };
};

export default function ProfileFormCard({ profile }: Props) {
  return (
    <Card className="border-white/10 bg-[#111113] shadow-none">
      <CardHeader className="border-b border-white/5 pb-6 text-left">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="h-16 w-16 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-white/10 overflow-hidden">
              <span className="text-xl font-bold">RD</span>
            </div>
            <div className="absolute bottom-0 right-0 rounded-full bg-zinc-800 p-1.5 border border-[#111113] cursor-pointer hover:bg-zinc-700">
                <Camera className="h-3 w-3 text-zinc-300" />
            </div>
          </div>
          <div>
            <CardTitle className="text-xl">Personal Information</CardTitle>
            <CardDescription className="text-zinc-400">Update your account details and profile photo.</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-8">
        {/* Basic Info */}
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <ProfileFormField label="Full Name" defaultValue={profile.fullName} />
            <ProfileFormField label="Email" defaultValue={profile.email} type="email" />
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Contact & Address</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <ProfileFormField label="Phone Number" defaultValue={profile.phone} type="tel" />
            <ProfileFormField label="Location" defaultValue={profile.location} />
          </div>
        </div>

        <ProfileActions />
      </CardContent>
    </Card>
  );
}