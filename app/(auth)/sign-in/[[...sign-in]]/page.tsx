import { SignIn } from '@clerk/nextjs'

const authAppearance = {
  elements: {
    rootBox: 'w-full flex justify-center',
    card: 'w-full max-w-xl rounded-2xl border border-slate-200/80 bg-white/90 shadow-2xl backdrop-blur-sm',
    cardBox: 'w-full',
    headerTitle: 'text-slate-900',
    headerSubtitle: 'text-slate-600',
    socialButtonsBlockButton:
      'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
    socialButtonsBlockButtonText: 'text-slate-700',
    formButtonPrimary: 'bg-slate-900 text-white hover:bg-slate-800',
    footerActionLink: 'text-slate-700 hover:text-slate-900',
    formFieldInput:
      'border border-slate-300 bg-white/90 text-slate-900 placeholder:text-slate-400',
  },
}

export default function Page() {
  return <SignIn appearance={authAppearance} />
}