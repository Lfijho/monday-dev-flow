export interface Team {
  id: string;
  name: string;
  description?: string;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: 'admin' | 'member';
  joinedAt: string;
}

export interface CreateTeamData {
  name: string;
  description?: string;
}

export interface AddMemberData {
  teamId: string;
  userId: string;
  role: 'admin' | 'member';
}