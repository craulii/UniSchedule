const PALETTE = [
  { bg: 'bg-blue-500',    text: 'text-blue-700',    light: 'bg-blue-100'    },
  { bg: 'bg-emerald-500', text: 'text-emerald-700', light: 'bg-emerald-100' },
  { bg: 'bg-violet-500',  text: 'text-violet-700',  light: 'bg-violet-100'  },
  { bg: 'bg-amber-500',   text: 'text-amber-700',   light: 'bg-amber-100'   },
  { bg: 'bg-rose-500',    text: 'text-rose-700',    light: 'bg-rose-100'    },
  { bg: 'bg-cyan-500',    text: 'text-cyan-700',    light: 'bg-cyan-100'    },
  { bg: 'bg-orange-500',  text: 'text-orange-700',  light: 'bg-orange-100'  },
  { bg: 'bg-indigo-500',  text: 'text-indigo-700',  light: 'bg-indigo-100'  },
  { bg: 'bg-teal-500',    text: 'text-teal-700',    light: 'bg-teal-100'    },
  { bg: 'bg-pink-500',    text: 'text-pink-700',    light: 'bg-pink-100'    },
  { bg: 'bg-lime-500',    text: 'text-lime-700',    light: 'bg-lime-100'    },
  { bg: 'bg-fuchsia-500', text: 'text-fuchsia-700', light: 'bg-fuchsia-100' },
]

export function getSubjectColor(index) {
  return PALETTE[index % PALETTE.length]
}
