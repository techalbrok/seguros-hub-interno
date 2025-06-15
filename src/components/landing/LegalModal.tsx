
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PrivacyPolicyText, CookiesPolicyText, LegalNoticeText } from "./LegalTexts"

const legalContent = {
  privacy: {
    title: "Política de Privacidad",
    content: <PrivacyPolicyText />,
  },
  cookies: {
    title: "Política de Cookies",
    content: <CookiesPolicyText />,
  },
  legal: {
    title: "Aviso Legal",
    content: <LegalNoticeText />,
  },
}

export type LegalContentType = keyof typeof legalContent;

type LegalModalProps = {
  contentKey: LegalContentType;
  onClose: () => void;
}

export const LegalModal = ({ contentKey, onClose }: LegalModalProps) => {
  const { title, content } = legalContent[contentKey];

  return (
    <AlertDialog open onOpenChange={onClose}>
      <AlertDialogContent className="max-w-4xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
        </AlertDialogHeader>
        <ScrollArea className="h-[60vh] pr-6">
          <div className="prose dark:prose-invert max-w-none">
            {content}
          </div>
        </ScrollArea>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cerrar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
