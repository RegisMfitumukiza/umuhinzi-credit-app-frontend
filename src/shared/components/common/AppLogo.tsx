import faviconUrl from "@/assets/favicon/favicon.svg";

type Props = {
  iconSize?: "sm" | "md" | "lg";
  showText?: boolean;
  textSize?: "sm" | "md" | "lg";
};

const iconSizeMap = { sm: "h-7 w-7", md: "h-9 w-9", lg: "h-11 w-11" };
const textSizeMap = { sm: "text-base", md: "text-lg", lg: "text-2xl" };

export const AppLogo = ({
  iconSize = "md",
  showText = true,
  textSize = "md",
}: Props) => {
  return (
    <div className="flex items-center gap-2.5">
      <img
        src={faviconUrl}
        alt="Umuhinzi Credit"
        className={`${iconSizeMap[iconSize]} shrink-0 rounded-md`}
      />
      {showText && (
        <span className={`font-semibold tracking-tight leading-none ${textSizeMap[textSize]}`}>
          Umuhinzi Credit
        </span>
      )}
    </div>
  );
};
