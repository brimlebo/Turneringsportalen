export type Tournament = {
  tournament_id: number;
  name: string;
  start_date: Date;
  location: string;
  fields: TournamentField[];
  match_interval: number;
};

export type TournamentField = {
  field_id: number;
  tournament_id: number;
  field_name: string;
};

export type Participant = {
  participant_id: number;
  name: string;
  tournament_id: number;
};

export type Match = {
  match_id: number;
  time: Date;
  game_location_id: number;
  tournament_id: number;
};

export type MatchParticipant = {
  match_id: number;
  participant_id: number;
  index: number;
};

export type MatchWithParticipantsAndTournament = Match & {
  participant1: Participant;
  participant2: Participant;
  tournament: Tournament;
};

export type TournamentWithParticipantsAndMatches = Tournament & {
  participants: Participant[];
  matches: Match[];
};

export type CreateTournamentDTO = {
  name: string;
  start_date: string;
  location: string;
  field_names: string[];
  match_interval: number;
};


export type CreateUserDTO = {
  email: string;
  password: string;
  //username: string;
};


export type LoginUserDTO = {
  email: string;
  password: string;
};
