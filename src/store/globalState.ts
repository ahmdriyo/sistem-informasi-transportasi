import { create } from 'zustand'

interface GlobalState {
  isSwitchOn: boolean
  toggleSwitch: () => void
}

export const useGlobalStore = create<GlobalState>((set) => ({
  isSwitchOn: false,
  toggleSwitch: () =>
    set((state) => ({
      isSwitchOn: !state.isSwitchOn,
    })),
}))
