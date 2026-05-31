// apps\frontend\src\components\ui\SectionHeading.tsx
type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold text-white md:text-5xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-white/64 md:text-lg">
        {description}
      </p>
    </div>
  );
}
