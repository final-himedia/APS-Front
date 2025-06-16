import { create } from "zustand";

const useScenarioStore = create((set) => ({
  selectedScenarioId: null, // 선택된 시나리오 ID
  setSelectedScenarioId: (id) => set({ selectedScenarioId: id }), // setter
}));

export default useScenarioStore;