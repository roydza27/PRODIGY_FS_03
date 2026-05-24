import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
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
    <Card className="border-white/10 bg-white/5 text-white">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <ProfileFormField label="Full Name" defaultValue={profile.fullName} />
          <ProfileFormField label="Email" defaultValue={profile.email} />
          <ProfileFormField label="Phone" defaultValue={profile.phone} />
          <ProfileFormField label="Location" defaultValue={profile.location} />
        </div>

        <ProfileActions />
      </CardContent>
    </Card>
  );
}