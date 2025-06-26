export type PetStats = {
  health: number;
  hunger: number;
  cleanliness: number;
  energy: number;
  happiness: number;
  age: number; // in minutes
};

export type PetState = 'idle' | 'happy' | 'sick' | 'sleeping' | 'dead';

export type ActionType = 'feed' | 'play' | 'clean' | 'sleep' | 'talk';

export type RedditUpdateRequest = {
  action: string;
  message: string;
};

export type RedditUpdateResponse = {
  status: 'success' | 'error';
  message?: string;
};

export type PetActionResponse = {
  status: 'success' | 'error';
  stats?: PetStats;
  state?: PetState;
  message?: string;
};