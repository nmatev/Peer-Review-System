export interface LiveDataListener {
    isThereChange: boolean;
    liveDataListener(time: number): void;
}
