type FAQItem = {
  question: string;
  answer: string;
};

type Props = {
  items?: FAQItem[];
};

const defaultFAQs: FAQItem[] = [
  {
    question: "Is this product covered by warranty?",
    answer: "Yes, warranty coverage depends on the product and seller policy.",
  },
  {
    question: "Can I return it if I do not like it?",
    answer: "Returns are usually available within the return window.",
  },
  {
    question: "Does it come with accessories?",
    answer: "Included accessories are listed in the product details.",
  },
];

export default function ProductFAQ({ items = defaultFAQs }: Props) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 lg:p-7">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">Frequently asked questions</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Common questions buyers ask before placing an order.
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <details
            key={item.question}
            className="group rounded-2xl border border-white/8 bg-black/20 p-4"
          >
            <summary className="cursor-pointer list-none text-sm font-medium text-white">
              {item.question}
            </summary>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}