import { create } from "zustand";

export type Domain = "All" | "Data Privacy" | "Fintech" | "IPR" | "Litigation Support";

interface FilterState {
  domain: Domain;
  setDomain: (d: Domain) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  domain: "All",
  setDomain: (d) => set({ domain: d }),
}));