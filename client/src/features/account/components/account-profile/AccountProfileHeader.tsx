type Props = {
  title?: string;
  description?: string;
};

export default function AccountProfileHeader({
  title = "Profile",
  description = "View and update your account information.",
}: Props) {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-white">
        {title}
      </h1>
      <p className="mt-1 text-sm text-zinc-400">{description}</p>
    </div>
  );
}