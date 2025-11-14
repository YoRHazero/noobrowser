import { create } from 'zustand';

interface CounterpartState {
    availableFilters: string[];
    filterRed: string;
    filterGreen: string;
    filterBlue: string;
    pmin: number;
    pmax: number;
    cutoutPmin: number;
    cutoutPmax: number;
    setAvailableFilters: (filters: string[]) => void;
    setFilterRed: (filter: string) => void;
    setFilterGreen: (filter: string) => void;
    setFilterBlue: (filter: string) => void;
    setCounterpartPmin: (pmin: number) => void;
    setCounterpartPmax: (pmax: number) => void;
    setCutoutPmin: (cutoutPmin: number) => void;
    setCutoutPmax: (cutoutPmax: number) => void;
}