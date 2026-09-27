export interface AvatarOption {
  id: string;
  url: string;
  label: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = Array.from({ length: 18 }, (_, i) => ({
  id: `avatar-${i + 1}`,
  url: `/avatars/avatar-${i + 1}.png`,
  label: `Persona ${i + 1}`,
}));
