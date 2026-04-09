import { create } from 'zustand';

interface UIStore {
  selectedMonth: Date;
  isAddSheetOpen: boolean;
  setSelectedMonth: (date: Date) => void;
  nextMonth: () => void;
  prevMonth: () => void;
  openAddSheet: () => void;
  closeAddSheet: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  selectedMonth: new Date(),
  isAddSheetOpen: false,
  setSelectedMonth: (date) => set({ selectedMonth: date }),
  nextMonth: () =>
    set((state) => {
      const next = new Date(state.selectedMonth);
      next.setMonth(next.getMonth() + 1);
      return { selectedMonth: next };
    }),
  prevMonth: () =>
    set((state) => {
      const prev = new Date(state.selectedMonth);
      prev.setMonth(prev.getMonth() - 1);
      return { selectedMonth: prev };
    }),
  openAddSheet: () => set({ isAddSheetOpen: true }),
  closeAddSheet: () => set({ isAddSheetOpen: false }),
}));
