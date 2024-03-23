export interface Player {
    name: string;
    userId: string;
    room: string;
    isHost: boolean;
    isFaker: boolean;
    points: number;
}